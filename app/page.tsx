import { CommercialPlayer } from '@/components/commercial/commercial-player'

export default function Page() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 py-6">
      <h1 className="sr-only">{'إعلان STARTECH — كل ما تحتاجه في مكان واحد'}</h1>
      <CommercialPlayer />
    </main>
  )
}
