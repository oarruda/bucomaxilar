'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { saveLeadAndCreateWhatsAppLink } from '@/lib/actions/lead.actions';
import type { Settings } from '@/lib/types';
import { Loader2 } from 'lucide-react';

const createFormSchema = (questions: string[]) => {
  const customFields: Record<string, z.ZodBoolean> = {};
  questions.forEach((question, index) => {
    customFields[`question_${index}`] = z.boolean().default(false);
  });

  return z.object({
    name: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres.' }),
    email: z.string().email({ message: 'Por favor, insira um email válido.' }),
    phone: z.string().min(10, { message: 'Por favor, insira um telefone válido.' }),
    ...customFields,
  });
};

type LeadCaptureFormProps = {
  settings: Settings;
};

export function LeadCaptureForm({ settings }: LeadCaptureFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const formSchema = createFormSchema(settings.formQuestions);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const result = await saveLeadAndCreateWhatsAppLink({
        leadData: {
          name: values.name,
          email: values.email,
          phone: values.phone,
        },
        customResponses: settings.formQuestions.map((q, i) => ({
          question: q,
          answered: values[`question_${i}` as keyof typeof values] as boolean,
        })),
        whatsAppNumber: settings.whatsAppNumber,
      });

      if (result.success && result.url) {
        window.location.href = result.url;
      } else {
        throw new Error(result.error || 'Falha ao processar sua solicitação.');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Completo</FormLabel>
              <FormControl>
                <Input placeholder="Seu nome" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="seu@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone / WhatsApp</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="(00) 90000-0000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {settings.formQuestions.length > 0 && (
          <div className="space-y-4">
             <FormLabel>Qual seu interesse?</FormLabel>
            {settings.formQuestions.map((question, index) => (
              <FormField
                key={index}
                control={form.control}
                name={`question_${index}`}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>{question}</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            ))}
          </div>
        )}

        <Button type="submit" className="w-full bg-accent hover:bg-accent/90" disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Enviar e ir para WhatsApp
        </Button>
      </form>
    </Form>
  );
}
