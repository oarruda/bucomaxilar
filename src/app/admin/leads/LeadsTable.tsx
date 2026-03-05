'use client';
import type { Lead } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { WhatsappReplyGenerator } from './WhatsappReplyGenerator';

interface LeadsTableProps {
  leads: Lead[];
}

export default function LeadsTable({ leads }: LeadsTableProps) {
  if (leads.length === 0) {
    return <p className="text-center text-muted-foreground py-8">Você ainda não tem nenhum lead.</p>;
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    // Firebase timestamps can be seconds/nanoseconds objects
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };
  
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Contato</TableHead>
            <TableHead>Interesses</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow key={lead.id}>
              <TableCell>{formatDate(lead.createdAt)}</TableCell>
              <TableCell className="font-medium">{lead.name}</TableCell>
              <TableCell>
                <div>{lead.email}</div>
                <div>{lead.phone}</div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-2">
                {lead.customResponses && Object.keys(lead.customResponses).length > 0 ? (
                  Object.keys(lead.customResponses).map(interest => (
                    <Badge key={interest} variant="secondary">{interest}</Badge>
                  ))
                ) : (
                  <span className="text-muted-foreground text-xs">Nenhum</span>
                )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <WhatsappReplyGenerator lead={lead} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
