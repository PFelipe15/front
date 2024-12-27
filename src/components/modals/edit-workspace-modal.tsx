"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Workspace } from "@/types"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { useWorkspaces } from '@/contexts/WorkspaceContext'
import axios from "axios"

interface EditWorkspaceModalProps {
  workspace: Workspace
  open: boolean
  onOpenChange: (open: boolean) => void
  onWorkspaceUpdated: () => void
}

export function EditWorkspaceModal({
  workspace,
  open,
  onOpenChange,
  onWorkspaceUpdated,
}: EditWorkspaceModalProps) {
  const [loading, setLoading] = useState(false)
   const [formData, setFormData] = useState({
    nome: workspace.nome,
    localizacao: workspace.localizacao,
    gerente: workspace.gerente,
    orcamento: String(workspace.orcamento),
    dataInicio: workspace.dataInicio.split('T')[0],
    dataFim: workspace.dataFim.split('T')[0]
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
       await axios.patch(`/api/workspaces/${workspace.id}`, formData)
      
       await onWorkspaceUpdated()
       
      toast.success('Projeto atualizado com sucesso')
      onOpenChange(false)
    } catch (error) {
      console.error('Erro ao atualizar workspace:', error)
      toast.error('Erro ao atualizar projeto')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Projeto</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="nome">Nome do Projeto</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="localizacao">Localização</Label>
              <Input
                id="localizacao"
                value={formData.localizacao}
                onChange={(e) => setFormData({ ...formData, localizacao: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="gerente">Gerente</Label>
              <Input
                id="gerente"
                value={formData.gerente}
                onChange={(e) => setFormData({ ...formData, gerente: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="orcamento">Orçamento Total</Label>
              <Input
                id="orcamento"
                type="text"
                value={formatCurrency(String(formData.orcamento))}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "")
                  const numericValue = value ? Number(value) / 100 : ""
                  setFormData({ ...formData, orcamento: String(numericValue) })
                }}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="dataInicio">Data de Início</Label>
                <Input
                  id="dataInicio"
                  type="date"
                  value={formData.dataInicio}
                  onChange={(e) => setFormData({ ...formData, dataInicio: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dataFim">Data de Término</Label>
                <Input
                  id="dataFim"
                  type="date"
                  value={formData.dataFim}
                  onChange={(e) => setFormData({ ...formData, dataFim: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar Alterações
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 