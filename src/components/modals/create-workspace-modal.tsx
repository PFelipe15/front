"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, PlusCircle, Building2, Users, MapPin, Banknote, X } from "lucide-react"
import { cn, formatCurrency } from "@/lib/utils"
import { Separator } from "../ui/separator"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { z } from "zod"
import { api } from '@/lib/axios'
import axios from 'axios'
import { isBefore, isAfter, startOfToday } from "date-fns"
import DatePicker, { registerLocale } from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"

interface CreateWorkspaceModalProps {
  onWorkspaceCreated?: () => void
}

const workspaceSchema = z.object({
  nome: z.string().min(1, "Nome do projeto é obrigatório"),
  orcamento: z.string().min(1, "Orçamento é obrigatório"),
  localizacao: z.string().min(1, "Localização é obrigatória"),
  dataInicio: z.date(),
  dataFim: z.date(),
  gerente: z.string().min(1, "Gerente responsável é obrigatório"),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  categoria: z.string().min(1, "Categoria é obrigatória"),
  prioridade: z.string().min(1, "Prioridade é obrigatória"),
})

// Registrar localização em português
registerLocale('pt-BR', ptBR)

interface CreateWorkspaceModalProps {
  onWorkspaceCreated?: () => void
  typeButton?: "default" | "icon" 
}

export function CreateWorkspaceModal({ onWorkspaceCreated, typeButton  }: CreateWorkspaceModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nome: "",
    orcamento: "",
    localizacao: "",
    dataInicio: new Date(),
    dataFim: new Date(),
    gerente: "",
    descricao: "",
    categoria: "",
    prioridade: "media",
   })

  const [dateError, setDateError] = useState("")

  const validateForm = () => {
    try {
      workspaceSchema.parse(formData)
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          toast.error(err.message)
        })
      }
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)

    try {
      const workspaceData = {
        nome: formData.nome,
        orcamento: Number(formData.orcamento),
        localizacao: formData.localizacao,
        dataInicio: formData.dataInicio,
        dataFim: formData.dataFim,
        gerente: formData.gerente,
        descricao: formData.descricao,
        categoria: formData.categoria,
        prioridade: formData.prioridade,
      }

      const { data } = await api.post('/workspaces', workspaceData)

      if (!data.success) {
        throw new Error(data.error || 'Erro ao criar workspace')
      }

      toast.success('Workspace criado com sucesso!')
      setOpen(false)
      onWorkspaceCreated?.()
      
      // Reset do formulário
      setFormData({
        nome: "",
        orcamento: "",
        localizacao: "",
        dataInicio: new Date(),
        dataFim: new Date(),
        gerente: "",
        descricao: "",
        categoria: "",
        prioridade: "media",
      })
    } catch (error) {
      console.error('Erro:', error)
      
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || error.message
        toast.error(errorMessage)
      } else {
        toast.error('Erro ao criar workspace')
      }
    } finally {
      setLoading(false)
    }
  }

  const validateDates = (start: string, end: string) => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    const today = startOfToday()
    
    if (isBefore(startDate, today)) {
      setDateError("A data de início não pode ser anterior a hoje")
      return false
    }
    
    if (isBefore(endDate, startDate)) {
      setDateError("A data de término não pode ser anterior à data de início")
      return false
    }
    
    setDateError("")
    return true
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {typeButton === "icon" ? (
          <TooltipProvider>

          <Tooltip>
            <TooltipTrigger>
              <Button variant="default" size="sm" className="gap-2">
                <PlusCircle size={16}  />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Criar novo projeto
            </TooltipContent>
          </Tooltip>
          </TooltipProvider>
        ) : (
          <Button  className="gap-2">
        Criar novo projeto   <PlusCircle size={16} className="text-secondary" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl">Criar Novo Workspace</DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Preencha as informações para criar um novo projeto
                </p>
              </div>
            </div>
          </DialogHeader>
          <Separator className="my-4" />
          <Tabs defaultValue="info" className="mt-6">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="info">Informações Básicas</TabsTrigger>
               <TabsTrigger value="config">Configurações</TabsTrigger>
            </TabsList>

            <TabsContent value="info">
              <div className="space-y-4">
                <div className="grid gap-3">
                  <Label htmlFor="nome" className="flex items-center gap-2">
                    <Building2 size={16} />
                    Nome do Projeto
                  </Label>
                  <Input
                    id="nome"
                    placeholder="Ex: Condomínio Marimar"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    className="h-11"
                    required
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="orcamento" className="flex items-center gap-2">
                    <Banknote size={16} />
                    Orçamento Inicial
                  </Label>
                  <Input
                    id="orcamento"
                    type="text"
                    placeholder="R$ 0,00"
                    value={formatCurrency(formData.orcamento)}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "")
                      const numericValue = value ? Number(value) / 100 : ""
                      setFormData({ ...formData, orcamento: String(numericValue) })
                    }}
                    className="h-11"
                    required
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="localizacao" className="flex items-center gap-2">
                    <MapPin size={16} />
                    Localização
                  </Label>
                  <Input
                    id="localizacao"
                    placeholder="Endereço completo"
                    value={formData.localizacao}
                    onChange={(e) => setFormData({ ...formData, localizacao: e.target.value })}
                    className="h-11"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label className="flex items-center gap-2">
                      <CalendarIcon size={16} />
                      Data de Início
                    </Label>
                    <Input
                      type="date"
                      value={format(formData.dataInicio, 'yyyy-MM-dd')}
                      min={format(new Date(), 'yyyy-MM-dd')}
                      onChange={(e) => {
                        const newDate = new Date(e.target.value)
                        setFormData({ ...formData, dataInicio: newDate })
                        if (formData.dataFim) {
                          validateDates(e.target.value, format(formData.dataFim, 'yyyy-MM-dd'))
                        }
                      }}
                      className="h-11"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label className="flex items-center gap-2">
                      <CalendarIcon size={16} />
                      Data de Término
                    </Label>
                    <Input
                      type="date"
                      value={format(formData.dataFim, 'yyyy-MM-dd')}
                      min={format(formData.dataInicio, 'yyyy-MM-dd')}
                      onChange={(e) => {
                        const newDate = new Date(e.target.value)
                        setFormData({ ...formData, dataFim: newDate })
                        if (formData.dataInicio) {
                          validateDates(format(formData.dataInicio, 'yyyy-MM-dd'), e.target.value)
                        }
                      }}
                      className="h-11"
                    />
                  </div>
                </div>

                {dateError && (
                  <p className="text-sm text-destructive mt-1">
                    {dateError}
                  </p>
                )}

                <div className="grid gap-3">
                  <Label htmlFor="gerente" className="flex items-center gap-2">
                    <Users size={16} />
                    Gerente Responsável
                  </Label>
                  <Input
                    id="gerente"
                    placeholder="Nome do gerente"
                    value={formData.gerente}
                    onChange={(e) => setFormData({ ...formData, gerente: e.target.value })}
                    className="h-11"
                    required
                  />
                </div>

                <div className="grid gap-3 mt-4">
                  <Label htmlFor="descricao">Descrição do Projeto</Label>
                  <Textarea
                    id="descricao"
                    placeholder="Descreva os objetivos e escopo do projeto..."
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </TabsContent>
 

            <TabsContent value="config">
              <div className="space-y-4">
                <div className="grid gap-3">
                  <Label>Categoria do Projeto</Label>
                  <Select
                    value={formData.categoria}
                    onValueChange={(value) => setFormData({ ...formData, categoria: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="construcao">Construção Civil</SelectItem>
                      <SelectItem value="reforma">Reforma</SelectItem>
                      <SelectItem value="infraestrutura">Infraestrutura</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-3">
                  <Label>Prioridade</Label>
                  <Select
                    value={formData.prioridade}
                    onValueChange={(value) => setFormData({ ...formData, prioridade: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a prioridade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baixa">Baixa</SelectItem>
                      <SelectItem value="media">Média</SelectItem>
                      <SelectItem value="alta">Alta</SelectItem>
                      <SelectItem value="urgente">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        <div className="flex justify-end gap-3">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setOpen(false)}
            className="h-11"
          >
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={loading}
            onClick={handleSubmit}
            className="h-11"
          >
            {loading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Criando...
              </>
            ) : (
              <>
                <PlusCircle className="mr-2 h-4 w-4" />
                Criar Workspace
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
