"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { Loader2, FileText, Download, Printer } from "lucide-react"
import { Workspace } from "@/types"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { formatCurrency } from "@/lib/utils"
import { differenceInDays } from "date-fns"
import { Badge } from "../ui/badge"
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Label } from "../ui/label"
import { generateApprovalReport, generateGeneralReport, generateScheduleReport, generateTeamsReport } from "@/lib/reports"

interface GenerateReportModalProps {
  workspace: Workspace
  open: boolean
  onOpenChange: (open: boolean) => void
}

type ReportType = 'geral' | 'financeiro' | 'equipes' | 'aprovacao' | 'cronograma'

export function GenerateReportModal({
  workspace,
  open,
  onOpenChange
}: GenerateReportModalProps) {
  const [loading, setLoading] = useState(false)
  const [reportType, setReportType] = useState<ReportType>('geral')

  const handleGenerateReport = async () => {
    setLoading(true)
    const toastId = toast.loading('Gerando relatório...')

    try {
      switch (reportType) {
        case 'geral':
          await generateGeneralReport(workspace)
          break
        case 'financeiro':
          await generateFinancialReport(workspace)
          break
        case 'equipes':
          await generateTeamsReport(workspace)
          break
        case 'aprovacao':
          await generateApprovalReport(workspace)
          break
        case 'cronograma':
          await generateScheduleReport(workspace)
          break
      }
      
      toast.success('Relatório gerado com sucesso!', { id: toastId })
    } catch (error) {
      console.error('Erro ao gerar relatório:', error)
      toast.error('Erro ao gerar relatório', { id: toastId })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Gerar Relatório</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Tipo de Relatório</Label>
            <Select value={reportType} onValueChange={(value) => setReportType(value as ReportType)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de relatório" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="geral">Relatório Geral do Projeto</SelectItem>
                <SelectItem value="financeiro">Relatório Financeiro Detalhado</SelectItem>
                <SelectItem value="equipes">Relatório de Equipes e Serviços</SelectItem>
                <SelectItem value="aprovacao">Relatório de Aprovação de Orçamento</SelectItem>
                <SelectItem value="cronograma">Relatório de Cronograma</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Descrição do relatório selecionado */}
          <div className="text-sm text-muted-foreground">
            {reportType === 'geral' && (
              "Visão completa do projeto, incluindo progresso, orçamento e equipes."
            )}
            {reportType === 'financeiro' && (
              "Análise detalhada de custos, gastos e projeções financeiras."
            )}
            {reportType === 'equipes' && (
              "Desempenho das equipes, distribuição de serviços e produtividade."
            )}
            {reportType === 'aprovacao' && (
              "Documento formal para aprovação de orçamentos e aditivos."
            )}
            {reportType === 'cronograma' && (
              "Análise de prazos, marcos do projeto e cronograma detalhado."
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleGenerateReport} disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <FileText className="h-4 w-4 mr-2" />
            )}
            Gerar Relatório
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}  