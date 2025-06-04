import { Logo } from "./logo"

export function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-pulse mb-6">
          <Logo size="lg" showText={false} href="" />
        </div>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading MovieStream...</p>
      </div>
    </div>
  )
}
