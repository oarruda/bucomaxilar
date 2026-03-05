import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Lead } from '@/lib/types';
import LeadsTable from './LeadsTable';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users } from 'lucide-react';

async function getLeads(): Promise<Lead[]> {
  try {
    const leadsCollection = collection(db, 'leads');
    const q = query(leadsCollection, orderBy('createdAt', 'desc'));
    const leadsSnapshot = await getDocs(q);
    const leadsList = leadsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Lead[];
    return leadsList;
  } catch (error) {
    console.error("Error fetching leads: ", error);
    return [];
  }
}

export default async function LeadsPage() {
  const leads = await getLeads();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Leads</h1>
        <p className="text-muted-foreground">Visualize e interaja com os potenciais clientes.</p>
      </header>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6" />
            <div>
              <CardTitle>Leads Recebidos</CardTitle>
              <CardDescription>
                {leads.length > 0 ? `Total de ${leads.length} leads.` : 'Nenhum lead recebido ainda.'}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <LeadsTable leads={leads} />
        </CardContent>
      </Card>
    </div>
  );
}
