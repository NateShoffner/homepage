export interface CertSummary {
  active: number
  total: number
  issuers: { name: string; logo?: string }[]
}
