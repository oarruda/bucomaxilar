'use client';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { Settings } from '@/lib/types';
import { updateSettings } from '@/lib/actions/settings.actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle, Trash2 } from 'lucide-react';
import { useState } from 'react';

const settingsSchema = z.object({
  headline: z.string().min(1, 'O título é obrigatório.'),
  description: z.string().min(1, 'A descrição é obrigatória.'),
  whatsAppNumber: z.string().min(10, 'O número de WhatsApp é obrigatório.'),
  formQuestions: z.array(z.string().min(1, 'A pergunta não pode ser vazia.')).min(1, 'Adicione pelo menos uma pergunta.'),
});

interface SettingsFormProps {
  currentSettings: Settings;
}

export function SettingsForm({ currentSettings }: SettingsFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      headline: currentSettings.headline || '',
      description: currentSettings.description || '',
      whatsAppNumber: currentSettings.whatsAppNumber || '',
      formQuestions: currentSettings.formQuestions || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'formQuestions',
  });

  async function onSubmit(values: z.infer<typeof settingsSchema>) {
    setIsLoading(true);
    const result = await updateSettings(values);
    if (result.success) {
      toast({
        title: 'Sucesso!',
        description: result.message,
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: result.error,
      });
    }
    setIsLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Conteúdo da Landing Page</CardTitle>
            <CardDescription>Textos principais que aparecerão na página inicial.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="headline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título Principal</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea rows={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="whatsAppNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número do WhatsApp para Contato</FormLabel>
                  <FormControl>
                    <Input placeholder="5511999999999" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Perguntas do Formulário</CardTitle>
            <CardDescription>Itens de checklist para os leads marcarem.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                <FormField
                  control={form.control}
                  name={`formQuestions.${index}`}
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                       <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
             <FormMessage>{form.formState.errors.formQuestions?.root?.message}</FormMessage>
            <Button type="button" variant="outline" size="sm" onClick={() => append('')}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar Pergunta
            </Button>
          </CardContent>
        </Card>

        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Salvar Alterações
        </Button>
      </form>
    </Form>
  );
}
