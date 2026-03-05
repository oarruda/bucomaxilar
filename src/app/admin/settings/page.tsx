import { getSettings } from '@/lib/actions/settings.actions';
import { SettingsForm } from './SettingsForm';

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">
          Personalize o conteúdo da sua landing page e o formulário de captura.
        </p>
      </header>
      <SettingsForm currentSettings={settings} />
    </div>
  );
}
