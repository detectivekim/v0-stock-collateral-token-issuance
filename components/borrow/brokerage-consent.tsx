"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import { Building2, Shield, FileText } from "lucide-react"

interface BrokerageConsentProps {
  onComplete: () => void
}

const brokerages = [
  { id: "samsung", name: "삼성증권", logo: "🏢" },
  { id: "mirae", name: "미래에셋증권", logo: "🏦" },
  { id: "kiwoom", name: "키움증권", logo: "🏛️" },
]

export function BrokerageConsent({ onComplete }: BrokerageConsentProps) {
  const [selectedBrokerage, setSelectedBrokerage] = useState<string>("")
  const [consents, setConsents] = useState({
    terms: false,
    privacy: false,
    pledge: false,
  })

  const allConsented = consents.terms && consents.privacy && consents.pledge && selectedBrokerage

  return (
    <div className="space-y-6">
      {/* Brokerage Selection */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="h-5 w-5 text-accent" />
          <h3 className="text-lg font-semibold">증권사 선택</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">담보로 사용할 주식 계좌의 증권사를 선택하세요</p>

        <div className="grid md:grid-cols-3 gap-3">
          {brokerages.map((brokerage) => (
            <button
              key={brokerage.id}
              onClick={() => setSelectedBrokerage(brokerage.id)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedBrokerage === brokerage.id
                  ? "border-accent bg-accent/5"
                  : "border-border hover:border-accent/50 bg-transparent"
              }`}
            >
              <div className="text-3xl mb-2">{brokerage.logo}</div>
              <div className="font-semibold">{brokerage.name}</div>
            </button>
          ))}
        </div>
      </Card>

      {/* Consent Form */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-accent" />
          <h3 className="text-lg font-semibold">약관 동의</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          주식 계좌 조회 및 질권 설정을 위해 다음 약관에 동의해주세요
        </p>

        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
            <Checkbox
              id="terms"
              checked={consents.terms}
              onCheckedChange={(checked) => setConsents({ ...consents, terms: checked as boolean })}
            />
            <div className="flex-1">
              <label htmlFor="terms" className="font-medium cursor-pointer">
                서비스 이용약관 동의 (필수)
              </label>
              <p className="text-sm text-muted-foreground mt-1">
                Seesaw Finance 서비스 이용을 위한 기본 약관에 동의합니다
              </p>
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
                개인정보 수집 및 이용 동의 (필수)
              </label>
              <p className="text-sm text-muted-foreground mt-1">
                주식 계좌 정보 조회를 위한 개인정보 수집에 동의합니다
              </p>
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
                주식 질권 설정 동의 (필수)
              </label>
              <p className="text-sm text-muted-foreground mt-1">대출 담보를 위한 주식 질권 설정에 동의합니다</p>
            </div>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </Card>

      {/* Action Button */}
      <Button onClick={onComplete} disabled={!allConsented} className="w-full" size="lg">
        {allConsented ? "계좌 조회하기" : "모든 항목에 동의해주세요"}
      </Button>
    </div>
  )
}
