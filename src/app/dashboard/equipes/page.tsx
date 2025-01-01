'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, UserPlus, Activity, Calendar, Search } from 'lucide-react'

type Team = {
  id: number
  nome: string
  representante: string
  quantidade: number
  servicos: {
    id: number
    nome: string
    status: 'NAO_INICIADO' | 'EM_ANDAMENTO' | 'CONCLUIDO' | 'ATRASADO'
  }[]
}

type StatusCount = {
  NAO_INICIADO: number;
  EM_ANDAMENTO: number;
  CONCLUIDO: number;
  ATRASADO: number;
}

function getStatusSummary(servicos: Team['servicos']): StatusCount {
  return servicos.reduce((acc, servico) => {
    acc[servico.status] = (acc[servico.status] || 0) + 1;
    return acc;
  }, {} as StatusCount);
}

export default function EquipesPage() {
  const [equipes, setEquipes] = useState<Team[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [novaEquipe, setNovaEquipe] = useState({
    nome: '',
    representante: '',
    quantidade: 0
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
    }
  }



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/equipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaEquipe),
      })
      if (response.ok) {
        fetchEquipes()
        setNovaEquipe({ nome: '', representante: '', quantidade: 0 })
      }
    } catch (error) {
      console.error('Erro ao criar equipe:', error)
    }
  }
 

  const filteredEquipes = equipes.filter(equipe => 
    equipe.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
    equipe.representante.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="container    ">
      <Tabs defaultValue="lista" className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Gerenciamento de Equipes</h1>
            <p className="text-gray-500">Gerencie suas equipes e acompanhe seus serviços</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar equipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-[250px]"
              />
            </div>
            <TabsList>
              <TabsTrigger value="lista">Lista</TabsTrigger>
              <TabsTrigger value="cards">Cards</TabsTrigger>
            </TabsList>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Nova Equipe
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Nova Equipe</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="nome">Nome da Equipe</Label>
                    <Input
                      id="nome"
                      value={novaEquipe.nome}
                      onChange={(e) => setNovaEquipe({...novaEquipe, nome: e.target.value})}
                      placeholder="Ex: Pedreiros"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="representante">Representante</Label>
                    <Input
                      id="representante"
                      value={novaEquipe.representante}
                      onChange={(e) => setNovaEquipe({...novaEquipe, representante: e.target.value})}
                      placeholder="Nome do representante"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="quantidade">Quantidade de Membros</Label>
                    <Input
                      id="quantidade"
                      type="number"
                      value={novaEquipe.quantidade}
                      onChange={(e) => setNovaEquipe({...novaEquipe, quantidade: parseInt(e.target.value)})}
                      required
                      min="1"
                    />
                  </div>
                  <Button type="submit">Salvar</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <TabsContent value="lista">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Equipe</TableHead>
                    <TableHead>Representante</TableHead>
                    <TableHead>Membros</TableHead>
                    <TableHead>Serviços Ativos</TableHead>
                    <TableHead>Status dos Serviços</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEquipes.map((equipe) => {
                    const statusCount = getStatusSummary(equipe.servicos || []);
                    
                    return (
                      <TableRow key={equipe.id}>
                        <TableCell className="font-medium">{equipe.nome}</TableCell>
                        <TableCell>{equipe.representante}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-gray-500" />
                            {equipe.quantidade}
                          </div>
                        </TableCell>
                        <TableCell>{equipe.servicos?.length || 0} serviços</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {statusCount.CONCLUIDO > 0 && (
                              <Badge variant="secondary" className="bg-green-500 text-white">
                                {statusCount.CONCLUIDO} concluídos
                              </Badge>
                            )}
                            {statusCount.EM_ANDAMENTO > 0 && (
                              <Badge variant="secondary" className="bg-blue-500 text-white">
                                {statusCount.EM_ANDAMENTO} em andamento
                              </Badge>
                            )}
                            {statusCount.ATRASADO > 0 && (
                              <Badge variant="secondary" className="bg-red-500 text-white">
                                {statusCount.ATRASADO} atrasados
                              </Badge>
                            )}
                            {statusCount.NAO_INICIADO > 0 && (
                              <Badge variant="secondary" className="bg-gray-500 text-white">
                                {statusCount.NAO_INICIADO} não iniciados
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              Editar
                            </Button>
                            <Button variant="destructive" size="sm">
                              Excluir
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cards">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEquipes.map((equipe) => {
              const statusCount = getStatusSummary(equipe.servicos || []);
              
              return (
                <Card key={equipe.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{equipe.nome}</h3>
                        <p className="text-sm text-gray-500">{equipe.representante}</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Users className="h-4 w-4" />
                        {equipe.quantidade}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Activity className="h-4 w-4 text-gray-500" />
                        <span>{equipe.servicos?.length || 0} serviços ativos</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {statusCount.CONCLUIDO > 0 && (
                          <Badge variant="secondary" className="bg-green-500 text-white">
                            {statusCount.CONCLUIDO} concluídos
                          </Badge>
                        )}
                        {statusCount.EM_ANDAMENTO > 0 && (
                          <Badge variant="secondary" className="bg-blue-500 text-white">
                            {statusCount.EM_ANDAMENTO} em andamento
                          </Badge>
                        )}
                        {statusCount.ATRASADO > 0 && (
                          <Badge variant="secondary" className="bg-red-500 text-white">
                            {statusCount.ATRASADO} atrasados
                          </Badge>
                        )}
                        {statusCount.NAO_INICIADO > 0 && (
                          <Badge variant="secondary" className="bg-gray-500 text-white">
                            {statusCount.NAO_INICIADO} não iniciados
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1">
                        Editar
                      </Button>
                      <Button variant="destructive" size="sm" className="flex-1">
                        Excluir
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
