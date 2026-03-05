import Image from 'next/image';
import { getSettings } from '@/lib/actions/settings.actions';
import { LeadCaptureForm } from '@/components/LeadCaptureForm';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Logo } from '@/components/Logo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function Home() {
  const settings = await getSettings();
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-background');

  return (
    <div className="flex flex-col min-h-screen">
      <header className="py-4 px-4 sm:px-6">
        <Logo />
      </header>
      <main className="flex-grow">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-primary font-headline tracking-tight">
                {settings.headline}
              </h1>
              <p className="text-lg text-muted-foreground">
                {settings.description}
              </p>
              <div className="relative aspect-[3/2] rounded-lg overflow-hidden shadow-lg">
                {heroImage && (
                  <Image
                    src={heroImage.imageUrl}
                    alt={heroImage.description}
                    fill
                    className="object-cover"
                    data-ai-hint={heroImage.imageHint}
                    priority
                  />
                )}
              </div>
            </div>
            <Card className="shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Inicie sua jornada para um novo sorriso</CardTitle>
              </CardHeader>
              <CardContent>
                <LeadCaptureForm settings={settings} />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground">
        © {new Date().getFullYear()} Consulta Fácil. Todos os direitos reservados.
      </footer>
    </div>
  );
}
