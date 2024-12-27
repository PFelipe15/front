"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { PlusCircle, DollarSign, Calendar } from "lucide-react"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../ui/select"
import { Textarea } from "../ui/textarea"
import { toast } from "sonner"
import { formatCurrency } from "@/lib/utils"
import { useWorkspaces } from "@/contexts/WorkspaceContext"
 interface CreateServiceModalProps {
  workspaceId: number
  onServiceCreated?: () => void
}

export function CreateServiceModal({ 
  workspaceId, 
  onServiceCreated 
}: CreateServiceModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [equipes, setEquipes] = useState<{ id: number; nome: string; representante: string }[]>([])
  const [formData, setFormData] = useState({
    nome: "",
    categoria: "",
    teamId: "",
    orcamento: String('0'),
    progresso: "0",
    dataInicio: new Date().toISOString().split('T')[0],
    dataFim: "",
    status: "EM_ANDAMENTO",
    observacoes: "",
  })

  const { refreshWorkspaces } = useWorkspaces()


  useEffect(() => {
    if (open) {
       fetchEquipes()
    }
  }, [open])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Verificar orçamento disponível
      const workspace = await fetch(`/api/workspaces/${workspaceId}`).then(res => res.json())
      const gastoAtual = workspace.servicos?.reduce((acc: number, s: any) => acc + s.orcamento, 0) || 0
      const novoGasto = parseFloat(formData.orcamento)
      
      if (gastoAtual + novoGasto > workspace.orcamento) {
        const excedente = formatCurrency(gastoAtual + novoGasto - workspace.orcamento)
        toast.error(
          <div className="space-y-2">
            <p>Orçamento será excedido em {excedente}</p>
            <p className="text-sm text-gray-500">
              Orçamento total: {formatCurrency(workspace.orcamento)}
              <br />
              Gasto atual: {formatCurrency(gastoAtual)}
              <br />
              Novo serviço: {formatCurrency(novoGasto)}
            </p>
    
            
          </div>
        )        
      }

      const response = await fetch(`/api/services`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: formData.nome,
          categoria: formData.categoria,
          orcamento: parseFloat(formData.orcamento),
          progresso: parseInt(formData.progresso),
          dataInicio: new Date(formData.dataInicio),
          dataFim: new Date(formData.dataFim),
          status: formData.status,
          ultimaAtualizacao: new Date(),
          observacoes: formData.observacoes,
          teamId: parseInt(formData.teamId),
          projetoId: workspaceId,
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao criar serviço')
      }

      toast.success('Serviço criado com sucesso!')
      await refreshWorkspaces() // Atualiza o sidebar após a criacao

      await onServiceCreated?.()
      setOpen(false)
      
      // Reset form
      setFormData({
        nome: "",
        categoria: "",
        teamId: "",
        orcamento: "",
        progresso: "0",
        dataInicio: new Date().toISOString().split('T')[0],
        dataFim: "",
        status: "EM_ANDAMENTO",
        observacoes: "",
      })
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao criar serviço')
    } finally {
      setLoading(false)
    }
  }

  const handleCurrencyInput = (value: string) => {
    // Remove tudo que não é número
    const numericValue = value.replace(/\D/g, "")
    
    // Converte para número e divide por 100 para ter os centavos
    const floatValue = numericValue ? Number(numericValue) / 100 : 0
    
    // Atualiza o estado com o valor formatado
    setFormData(prev => ({
      ...prev,
      orcamento: String(floatValue)
    }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="h-4 w-4 mr-2" />
          Novo Serviço
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Criar Novo Serviço</DialogTitle>
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
              placeholder="Ex: Instalação Elétrica"
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
                placeholder="R$ 0,00"
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
                <SelectItem value="PAUSADO">Pausado</SelectItem>
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

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Criando..." : "Criar Serviço"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
