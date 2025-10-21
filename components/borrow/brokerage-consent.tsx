"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import { Shield, FileText, AlertCircle, CheckCircle } from "lucide-react"
import { useAppState } from "@/store/app-state"
import { useTranslation } from "@/lib/i18n-provider"

interface BrokerageConsentProps {
  onComplete: () => void
}

export function BrokerageConsent({ onComplete }: BrokerageConsentProps) {
  const { t } = useTranslation()
  const isKYCVerified = useAppState((state) => state.isKYCVerified)
  const verifyKYC = useAppState((state) => state.verifyKYC)

  const [consents, setConsents] = useState({
    terms: false,
    privacy: false,
    pledge: false,
  })

  const allConsented = consents.terms && consents.privacy && consents.pledge

  const handleVerifyKYC = () => {
    verifyKYC()
  }

  return (
    <div className="space-y-6">
      {!isKYCVerified && (
        <Card className="p-6 border-red-500 border-2 bg-red-50 dark:bg-red-950/20">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">{t("borrow.kycRequired")}</h3>
              <p className="text-sm text-red-800 dark:text-red-200 mb-4">{t("borrow.kycRequiredDesc")}</p>
              <Button onClick={handleVerifyKYC} variant="destructive" size="sm" className="bg-red-600 hover:bg-red-700">
                {t("borrow.verifyIdentity")}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {isKYCVerified && (
        <Card className="p-4 border-green-500 bg-green-50 dark:bg-green-950/20">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            <p className="text-sm font-medium text-green-900 dark:text-green-100">{t("borrow.kycVerified")}</p>
          </div>
        </Card>
      )}

      {/* Consent Form */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-accent" />
          <h3 className="text-lg font-semibold">{t("borrow.termsConsent")}</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-6">{t("borrow.termsConsentDesc")}</p>

        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
            <Checkbox
              id="terms"
              checked={consents.terms}
              onCheckedChange={(checked) => setConsents({ ...consents, terms: checked as boolean })}
            />
            <div className="flex-1">
              <label htmlFor="terms" className="font-medium cursor-pointer">
                {t("borrow.serviceTerms")}
              </label>
              <p className="text-sm text-muted-foreground mt-1">{t("borrow.serviceTermsDesc")}</p>
            </div>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </div>

          <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
            <Checkbox
              id="privacy"
              checked={consents.privacy}
              onCheckedChange={(checked) => setConsents({ ...consents, privacy: checked as boolean })}
            />
            <div className="flex-1">
              <label htmlFor="privacy" className="font-medium cursor-pointer">
                {t("borrow.privacyConsent")}
              </label>
              <p className="text-sm text-muted-foreground mt-1">{t("borrow.privacyConsentDesc")}</p>
            </div>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </div>

          <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
            <Checkbox
              id="pledge"
              checked={consents.pledge}
              onCheckedChange={(checked) => setConsents({ ...consents, pledge: checked as boolean })}
            />
            <div className="flex-1">
              <label htmlFor="pledge" className="font-medium cursor-pointer">
                {t("borrow.pledgeConsent")}
              </label>
              <p className="text-sm text-muted-foreground mt-1">{t("borrow.pledgeConsentDesc")}</p>
            </div>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </Card>

      {/* Action Button */}
      <Button onClick={onComplete} disabled={!allConsented || !isKYCVerified} className="w-full" size="lg">
        {!isKYCVerified
          ? t("borrow.kycRequiredButton")
          : !allConsented
            ? t("borrow.agreeToAll")
            : t("borrow.checkAccounts")}
      </Button>
    </div>
  )
}
