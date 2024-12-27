"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { DollarSign, Loader2 } from "lucide-react"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../ui/select"
import { Textarea } from "../ui/textarea"
import { toast } from "sonner"
import { Service } from "@/types"
import { formatCurrency } from "@/lib/utils"
 import { Role } from "@prisma/client"

interface EditServiceModalProps {
  service: Service
  open: boolean
  onOpenChange: (open: boolean) => void
  onServiceUpdated: () => void
  userRole: Role
}

export function EditServiceModal({
  service,
  open,
  onOpenChange,
  onServiceUpdated,
  userRole
}: EditServiceModalProps) {
  const [loading, setLoading] = useState(false)
  const [equipes, setEquipes] = useState<{ id: number; nome: string; representante: string }[]>([])
  const [formData, setFormData] = useState({
    nome: service.nome,
    categoria: service.categoria,
    teamId: String(service.teamId || ""),
    orcamento: String(service.orcamento),
    dataInicio: service.dataInicio.split('T')[0],
    dataFim: service.dataFim.split('T')[0],
    status: service.status,
    observacoes: service.observacoes || "",
    especificacoesTecnicas: "",
    normasTecnicas: "",
    detalhesArquitetonicos: "",
  })

  useEffect(() => {
    fetchEquipes()
  }, [])

  const fetchEquipes = async () => {
    try {
      const response = await fetch('/api/equipes')
      const data = await response.json()
      setEquipes(data)
    } catch (error) {
      console.error('Erro ao carregar equipes:', error)
      toast.error('Erro ao carregar equipes')
    }
  }

  const handleCurrencyInput = (value: string) => {
    const numericValue = value.replace(/\D/g, "")
    const floatValue = numericValue ? Number(numericValue) / 100 : 0
    setFormData(prev => ({
      ...prev,
      orcamento: String(floatValue)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/services/${service.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: formData.nome,
          categoria: formData.categoria,
          orcamento: parseFloat(formData.orcamento),
          dataInicio: new Date(formData.dataInicio),
          dataFim: new Date(formData.dataFim),
          status: formData.status,
          ultimaAtualizacao: new Date(),
          observacoes: formData.observacoes,
          teamId: formData.teamId ? parseInt(formData.teamId) : null,
          especificacoesTecnicas: formData.especificacoesTecnicas,
          normasTecnicas: formData.normasTecnicas,
          detalhesArquitetonicos: formData.detalhesArquitetonicos,
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao atualizar serviço')
      }

      toast.success('Serviço atualizado com sucesso!')
      onServiceUpdated()
      onOpenChange(false)
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao atualizar serviço')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Serviço</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nome">Nome do Serviço</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                nome: e.target.value
              }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="categoria">Categoria</Label>
            <Select
              value={formData.categoria}
              onValueChange={(value) => setFormData(prev => ({
                ...prev,
                categoria: value
              }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALVENARIA">Alvenaria</SelectItem>
                <SelectItem value="GESSO">Gesso</SelectItem>
                <SelectItem value="ELETRICIDADE">Eletricidade</SelectItem>
                <SelectItem value="HIDRAULICA">Hidráulica</SelectItem>
                <SelectItem value="CIVIL">Construção Civil</SelectItem>
                <SelectItem value="PINTURA">Pintura</SelectItem>
                <SelectItem value="OUTROS">Outros</SelectItem>
                <SelectItem value="JARDINAGEM">Jardinagem</SelectItem>
                <SelectItem value="SERRALHERIA">Serralheria</SelectItem>
                <SelectItem value="MARMOARIA">Marmoaria</SelectItem>
                <SelectItem value="VIDRACARIA">Vidraçaria</SelectItem>
                <SelectItem value="CLIMATIZACAO">Climatização</SelectItem>
                <SelectItem value="TOLDOS">Toldos e Coberturas</SelectItem>
                <SelectItem value="CARPINTARIA">Carpintaria</SelectItem>
                <SelectItem value="REVESTIMENTO">Revestimento</SelectItem>
                <SelectItem value="DEDETIZACAO">Dedetização</SelectItem>
                <SelectItem value="DESENTUPIMENTO">Desentupimento</SelectItem>
                <SelectItem value="REFRIGERACAO">Refrigeração</SelectItem>
                <SelectItem value="DEMOLICAO">Demolição</SelectItem>
                <SelectItem value="LIMPEZA">Limpeza e Conservação</SelectItem>
                <SelectItem value="PORTAS_E_PORTOES">Instalação de Portas e Portões</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="teamId">Equipe Responsável</Label>
            <Select
              value={formData.teamId}
              onValueChange={(value) => setFormData(prev => ({
                ...prev,
                teamId: value
              }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a equipe responsável" />
              </SelectTrigger>
              <SelectContent>
                {equipes.map((equipe) => (
                  <SelectItem key={equipe.id} value={equipe.id.toString()}>
                    {equipe.nome} - {equipe.representante}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="orcamento">Orçamento</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="orcamento"
                type="text"
                value={formatCurrency(formData.orcamento)}
                onChange={(e) => handleCurrencyInput(e.target.value)}
                className="pl-9"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dataInicio">Data de Início</Label>
              <Input
                id="dataInicio"
                type="date"
                value={formData.dataInicio}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  dataInicio: e.target.value
                }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="dataFim">Data de Término</Label>
              <Input
                id="dataFim"
                type="date"
                value={formData.dataFim}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  dataFim: e.target.value
                }))}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData(prev => ({
                ...prev,
                status: value
              }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NAO_INICIADO">Não Iniciado</SelectItem>
                <SelectItem value="EM_ANDAMENTO">Em Andamento</SelectItem>
                <SelectItem value="CONCLUIDO">Concluído</SelectItem>
                <SelectItem value="ATRASADO">Atrasado</SelectItem>
              </SelectContent>
            </Select>
          </div>

        

          <div>
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                observacoes: e.target.value
              }))}
              placeholder="Observações adicionais sobre o serviço..."
              rows={3}
            />
          </div>

          {userRole === "ENGENHEIRO" && (
            <>
              <div>
                <Label>Especificações Técnicas</Label>
                <Textarea
                  value={formData.especificacoesTecnicas}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    especificacoesTecnicas: e.target.value
                  }))}
                />
              </div>
              
              <div>
                <Label>Normas Técnicas Aplicáveis</Label>
                <Input
                  value={formData.normasTecnicas}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    normasTecnicas: e.target.value
                  }))}
                />
              </div>
            </>
          )}

          {userRole === "ARQUITETO" && (
            <>
              <div>
                <Label>Detalhes Arquitetônicos</Label>
                <Textarea
                  value={formData.detalhesArquitetonicos}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    detalhesArquitetonicos: e.target.value
                  }))}
                />
              </div>
            </>
          )}

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
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