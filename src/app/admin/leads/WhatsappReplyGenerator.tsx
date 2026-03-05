'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import type { Lead } from '@/lib/types';
import { generatePersonalizedWhatsAppReply } from '@/ai/flows/generate-personalized-whatsapp-reply';
import { Bot, ClipboardCopy, Loader2, MessageSquarePlus } from 'lucide-react';

interface WhatsappReplyGeneratorProps {
  lead: Lead;
}

export function WhatsappReplyGenerator({ lead }: WhatsappReplyGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reply, setReply] = useState('');
  const { toast } = useToast();

  const handleGenerateReply = async () => {
    setIsLoading(true);
    setReply('');
    try {
      const customFormData: Record<string, string> = {};
      if(lead.customResponses) {
        for (const key in lead.customResponses) {
          if (lead.customResponses[key]) {
            customFormData[key] = 'Demonstrou interesse';
          }
        }
      }

      const response = await generatePersonalizedWhatsAppReply({
        leadName: lead.name,
        leadEmail: lead.email,
        leadPhone: lead.phone,
        customFormData: customFormData,
      });

      if (response && response.replyTemplate) {
        setReply(response.replyTemplate);
      } else {
        throw new Error('A resposta da IA está vazia.');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao gerar resposta',
        description: error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(reply);
    toast({
      title: 'Copiado!',
      description: 'A mensagem foi copiada para a área de transferência.',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <MessageSquarePlus className="mr-2 h-4 w-4" />
          Gerar Resposta
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Gerador de Resposta com IA</DialogTitle>
          <DialogDescription>
            Crie uma mensagem inicial personalizada para <strong>{lead.name}</strong>.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button onClick={handleGenerateReply} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Bot className="mr-2 h-4 w-4" />
            )}
            Gerar com IA
          </Button>

          {isLoading && <p className="text-center text-sm text-muted-foreground">Gerando resposta...</p>}

          {reply && (
            <div className="space-y-2">
                <Textarea value={reply} readOnly rows={6} className="bg-muted" />
                 <Button onClick={handleCopyToClipboard} variant="secondary" size="sm" className="w-full">
                    <ClipboardCopy className="mr-2 h-4 w-4" />
                    Copiar Mensagem
                </Button>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
