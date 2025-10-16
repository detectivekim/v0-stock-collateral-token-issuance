"use client"

import { usePrivy } from "@privy-io/react-auth"
import { useTranslation } from "@/lib/i18n-provider"
import { Button } from "@/components/ui/button"
import { ArrowRight, Languages } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function LandingPage() {
  const { login, authenticated } = usePrivy()
  const { t, language, setLanguage } = useTranslation()
  const router = useRouter()

  useEffect(() => {
    if (authenticated) {
      router.push("/dashboard")
    }
  }, [authenticated, router])

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ko" : "en")
  }

  if (authenticated) {
    return null
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <header className="flex items-center justify-between mb-32">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center">
              <span className="text-accent-foreground font-bold text-xl">S</span>
            </div>
            <span className="text-2xl font-bold">{t("brand.name")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={toggleLanguage} className="gap-2">
              <Languages className="h-4 w-4" />
              {language.toUpperCase()}
            </Button>
            <Button variant="outline" onClick={login}>
              {t("nav.login")}
            </Button>
          </div>
        </header>

        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-6xl md:text-7xl font-bold leading-tight text-balance">{t("landing.hero.title")}</h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">{t("landing.hero.subtitle")}</p>

          <div className="flex items-center justify-center gap-4 pt-8">
            <Button size="lg" onClick={login} className="gap-2">
              {t("landing.hero.cta")}
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-32">
          <div className="p-8 rounded-xl bg-card border border-border">
            <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <span className="text-2xl">📈</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">{t("landing.feature1.title")}</h3>
            <p className="text-muted-foreground">{t("landing.feature1.desc")}</p>
          </div>

          <div className="p-8 rounded-xl bg-card border border-border">
            <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <span className="text-2xl">🔄</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">{t("landing.feature2.title")}</h3>
            <p className="text-muted-foreground">{t("landing.feature2.desc")}</p>
          </div>

          <div className="p-8 rounded-xl bg-card border border-border">
            <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <span className="text-2xl">🛡️</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">{t("landing.feature3.title")}</h3>
            <p className="text-muted-foreground">{t("landing.feature3.desc")}</p>
          </div>
        </div>
      </div>
    </main>
  )
}
