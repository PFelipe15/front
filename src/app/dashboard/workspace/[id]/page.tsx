"use client"
import { useEffect, useState, use } from "react"
import { Service, Workspace } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
 import { 
  DollarSign, 
  Users, 
  Clock, 
  AlertTriangle, 
  Calendar, 
  TrendingUp,
  Loader2,
  Building2,
  PlusCircle,
  AlertCircle,
  UserCircle,
  FileText,
  MoreVertical,
  Trash,
  ListChecks

} from 'lucide-react'
 
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { toast } from "sonner"
import { cn, formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { CreateServiceModal } from "@/components/modals/create-service-modal"
import { EditServiceModal } from "@/components/modals/edit-service-modal"
import { differenceInDays } from "date-fns"
import { EditWorkspaceModal } from "@/components/modals/edit-workspace-modal"
import { useWorkspaces } from "@/contexts/WorkspaceContext"
import dynamic from 'next/dynamic'
import { GenerateReportModal } from "@/components/modals/generate-report-modal"
import { DocumentosList } from "@/components/documentos-list"
import { Progress } from "@/components/ui/progress"

// Importação dinâmica do ApexCharts
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

const isOrcamentoEstourado = (orcamentoTotal: number, orcamentoUtilizado: number) => {
  return orcamentoUtilizado > orcamentoTotal;
}

const isPrazoEstourado = (dataFim: Date) => {
  return differenceInDays(new Date(dataFim), new Date()) < 0;
}

export default function WorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const { currentWorkspace, refreshCurrentWorkspace } = useWorkspaces()
  const { id } = use(params)
  const [workspace, setWorkspace] = useState<Workspace | null>(currentWorkspace)
  const [servicesUpdated, setServicesUpdated] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
   const [error, setError] = useState<string | null>(null)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [reportModalOpen, setReportModalOpen] = useState(false)


  useEffect(() => {
    const fetchWorkspace = async () => {
      try {
        const response = await fetch(`/api/workspaces/${id}`)
        
        if (!response.ok) {
          throw new Error('Workspace não encontrado')
        }

        const data = await response.json()
        setWorkspace(data)
      } catch (error) {
        console.error('Erro ao carregar workspace:', error)
        setError('Não foi possível carregar os dados do workspace')
        toast.error('Erro ao carregar workspace')
      } finally {
        setLoading(false)
      }
    }

    fetchWorkspace()
  }, [id, servicesUpdated, currentWorkspace])


  const handleServiceChange = (service: Service) => {
    setServicesUpdated(prevServices => [...prevServices, service])
  }
  
  // Estado de carregamento
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Carregando workspace...</p>
        </div>
      </div>
    )
  }

  // Estado de erro
  if (error || !workspace) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold">Workspace não encontrado</h2>
          <p className="text-muted-foreground mt-2">
            {error || 'O workspace que você está procurando não existe ou foi removido.'}
          </p>
        </div>
      </div>
    )
  }

  // Componente de Visão Geral
   function OverviewTab({ workspace }: { workspace: Workspace }) {
    // Cálculo do progresso baseado em serviços concluídos
    const calcularProgresso = () => {
      if (!workspace.servicos || workspace.servicos.length === 0) return 0;
      
      const servicosConcluidos = workspace.servicos.filter(
        servico => servico.status === 'CONCLUIDO'
      ).length;
      
      return Math.round((servicosConcluidos / workspace.servicos.length) * 100);
    };

    // Atualização das configurações do gráfico de progresso
    const progressoChart = {
      options: {
        chart: {
          type: 'radialBar',
          toolbar: { show: false }
        },
        plotOptions: {
          radialBar: {
            startAngle: -135,
            endAngle: 135,
            hollow: {
              margin: 15,
              size: '70%'
            },
            track: {
              background: '#e7e7e7',
              strokeWidth: '97%',
              margin: 5
            },
            dataLabels: {
              name: {
                show: true,
                fontSize: '16px',
                color: '#888',
                offsetY: -10
              },
              value: {
                fontSize: '30px',
                show: true,
                formatter: function(val: number) {
                  return val + '%'
                }
              }
            }
          }
        },
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'dark',
            type: 'horizontal',
            shadeIntensity: 0.5,
            gradientToColors: ['#4F46E5'],
            inverseColors: true,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100]
          }
        },
        stroke: {
          lineCap: 'round'
        },
        labels: ['Progresso']
      },
      series: [calcularProgresso()]
    };

    // Atualização do cálculo de progresso por equipe
    const progressoPorEquipe = workspace.servicos?.reduce((acc, servico) => {
      if (servico.team) {
        if (!acc[servico.team.nome]) {
          acc[servico.team.nome] = { total: 0, concluidos: 0 };
        }
        acc[servico.team.nome].total += 1;
        if (servico.status === 'CONCLUIDO') {
          acc[servico.team.nome].concluidos += 1;
        }
      }
      return acc;
    }, {} as Record<string, { total: number; concluidos: number }>);

    // Novos cálculos para dados adicionais
    const gastoPorEquipe = workspace.servicos?.reduce((acc, servico) => {
      if (servico.team) {
        acc[servico.team.nome] = (acc[servico.team.nome] || 0) + servico.orcamento
      }
      return acc
    }, {} as Record<string, number>)

    // Evolução mensal dos serviços
    const evolucaoMensal = workspace.servicos?.reduce((acc, servico) => {
      const mes = format(new Date(servico.dataInicio), 'MMM', { locale: ptBR })
      acc[mes] = (acc[mes] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Configuração do gráfico de orçamento
    const orcamentoChart = {
      options: {
        chart: {
          type: 'bar',
          toolbar: { show: false }
        },
        plotOptions: {
          bar: {
            borderRadius: 4,
            horizontal: false,
            columnWidth: '60%',
          }
        },
        colors: ['#4F46E5', '#EF4444'],
        xaxis: {
          categories: ['Orçamento'],
          labels: {
            formatter: (value: string) => formatCurrency(Number(value))
          }
        },
        yaxis: {
          labels: {
            formatter: (value: number) => formatCurrency(value)
          }
        },
        dataLabels: {
          enabled: true,
          formatter: function (val: number) {
            return formatCurrency(val)
          }
        },
        legend: {
          position: 'top'
        }
      },
      series: [
        {
          name: 'Orçamento Total',
          data: [workspace.orcamento]
        },
        {
          name: 'Gasto Atual',
          data: [workspace.servicos?.reduce((total, servico) => total + servico.orcamento, 0) || 0]
        }
      ]
    };

    return (
      <div className="space-y-6">
        <Card className={cn(
          isPrazoEstourado(workspace.dataFim) && "bg-red-50 border-red-200"
        )}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className={cn(
                "h-5 w-5",
                isPrazoEstourado(workspace.dataFim) ? "text-red-500" : "text-gray-500"
              )} />
              <span className={cn(
                isPrazoEstourado(workspace.dataFim) && "text-red-700"
              )}>
                Prazo do Projeto
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <h3 className={cn(
                "text-2xl font-bold",
                isPrazoEstourado(workspace.dataFim) ? "text-red-600" : "text-gray-900"
              )}>
                {isPrazoEstourado(workspace.dataFim) 
                  ? `${Math.abs(differenceInDays(new Date(workspace.dataFim), new Date()))} dias de atraso` 
                  : `${differenceInDays(new Date(workspace.dataFim), new Date())} dias restantes`
                }
              </h3>
              
              <p className={cn(
                "text-sm mt-1",
                isPrazoEstourado(workspace.dataFim) ? "text-red-500" : "text-muted-foreground"
              )}>
                Término previsto: {format(new Date(workspace.dataFim), "PPP", { locale: ptBR })}
              </p>
            </div>
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Progresso do Projeto</CardTitle>
            </CardHeader>
            <CardContent>
              <ReactApexChart
                options={progressoChart.options}
                series={progressoChart.series}
                type="radialBar"
                height={250}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Orçamento vs Gasto</CardTitle>
            </CardHeader>
            <CardContent>
              <ReactApexChart
                options={orcamentoChart.options}
                series={orcamentoChart.series}
                type="bar"
                height={350}
              />
            </CardContent>
          </Card>
        </div>

        {/* Segunda linha de gráficos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gasto por Equipe */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Gasto por Equipe
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ReactApexChart
                options={{
                  chart: { type: 'bar' },
                  plotOptions: {
                    bar: {
                      horizontal: true,
                      borderRadius: 4
                    }
                  },
                  colors: ['#4F46E5'],
                  xaxis: {
                    categories: Object.keys(gastoPorEquipe || {}),
                    labels: {
                      formatter: (value) => formatCurrency(Number(value))
                    }
                  }
                }}
                series={[{
                  name: 'Gasto Total',
                  data: Object.values(gastoPorEquipe || {})
                }]}
                type="bar"
                height={300}
              />
            </CardContent>
          </Card>

          {/* Progresso por Equipe */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Progresso por Equipe
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ReactApexChart
                options={{
                  chart: { type: 'bar' },
                  plotOptions: {
                    bar: {
                      horizontal: true,
                      borderRadius: 4
                    }
                  },
                  colors: ['#10B981'],
                  xaxis: {
                    categories: Object.keys(progressoPorEquipe || {}),
                    labels: {
                      formatter: (value) => `${Number(value).toFixed(1)}%`
                    }
                  }
                }}
                series={[{
                  name: 'Progresso',
                  data: Object.entries(progressoPorEquipe || {}).map(
                    ([_, data]) => Math.round((data.concluidos / data.total) * 100)
                  )
                }]}
                type="bar"
                height={300}
              />
            </CardContent>
          </Card>
        </div>

        {/* Terceira linha */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Evolução Mensal de Serviços */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Evolução Mensal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ReactApexChart
                options={{
                  chart: { type: 'area' },
                  stroke: { curve: 'smooth' },
                  fill: {
                    type: 'gradient',
                    gradient: {
                      shadeIntensity: 1,
                      opacityFrom: 0.7,
                      opacityTo: 0.3
                    }
                  },
                  xaxis: {
                    categories: Object.keys(evolucaoMensal || {})
                  }
                }}
                series={[{
                  name: 'Serviços Iniciados',
                  data: Object.values(evolucaoMensal || {})
                }]}
                type="area"
                height={300}
              />
            </CardContent>
          </Card>

          {/* Status dos Serviços por Equipe */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListChecks className="h-5 w-5" />
                Status por Equipe
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ReactApexChart
                options={{
                  chart: { type: 'heatmap' },
                  dataLabels: { enabled: true },
                  colors: ['#4F46E5'],
                  xaxis: {
                    categories: ['Em Andamento', 'Concluído', 'Atrasado']
                  }
                }}
                series={
                  workspace.servicos?.reduce((acc, servico) => {
                    if (servico.team) {
                      const teamIndex = acc.findIndex(t => t.name === servico.team?.nome)
                      if (teamIndex === -1) {
                        acc.push({
                          name: servico.team.nome,
                          data: [
                            { x: 'Em Andamento', y: 0 },
                            { x: 'Concluído', y: 0 },
                            { x: 'Atrasado', y: 0 }
                          ]
                        })
                      }
                      const status = servico.status === 'EM_ANDAMENTO' ? 'Em Andamento' :
                                   servico.status === 'CONCLUIDO' ? 'Concluído' : 'Atrasado'
                      acc[acc.length - 1].data.find(d => d.x === status)!.y += 1
                    }
                    return acc
                  }, [] as any[]) || []
                }
                type="heatmap"
                height={300}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Componente de Serviços atualizado
  function ServicesTab({ workspace }: { workspace: Workspace }) {
    const [services, setServices] = useState(workspace.servicos || [])
    const [editingService, setEditingService] = useState<Service | null>(null)

    // Função para buscar Workspace atualizado
    const fetchServicesByWorkspaceId = async () => {
      try {
         const response = await fetch(`/api/workspaces/${workspace.id}`)
        if (!response.ok) throw new Error('Erro ao carregar serviços')
        const data = await response.json()
        setServicesUpdated(data.servicos)
        setServices(data.servicos)
      } catch (error) {
        console.error('Erro ao atualizar serviços:', error)
        toast.error('Erro ao atualizar lista de serviços')
      }
    }

    // Função para lidar com a criação ou atualização do serviço ou atualização do workspace
    const handleServiceOrWorkspaceChange = async () => {
      await fetchServicesByWorkspaceId()
    }


    const handleDeleteService = async (serviceId: number) => {
      try {
        await fetch(`/api/services/${serviceId}`, { method: 'DELETE' })
        await fetchServicesByWorkspaceId()
      } catch (error) {
        console.error('Erro ao deletar serviço:', error)
        toast.error('Erro ao deletar serviço')
      }
    }

    const getColorByStatus = (status: string) => {
      if (status === 'CONCLUIDO') return 'bg-green-200'
       if (status === 'ATRASADO') return 'bg-red-400'
      return 'bg-gray-50'
    }

    const isServiceOverdue = (dataFim: Date) => {
      return differenceInDays(dataFim, new Date()) < 0;
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Lista de Serviços</h2>
          <CreateServiceModal 
            workspaceId={workspace.id} 
            onServiceCreated={handleServiceChange} // Usando a mesma função
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((servico) => (
            <Card key={servico.id} className={cn("hover:shadow-lg transition-shadow duration-300 ease-in-out", getColorByStatus(servico.status))}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium truncate">{servico.nome}</h3>
                    <p className="text-xs text-muted-foreground">
                      {servico.team?.nome}
                    </p>
                  </div>
                   

                  <Badge variant={
                    servico.status === 'CONCLUIDO' ? 'success' :
                    servico.status === 'ATRASADO' ? 'destructive' :
                    'default'
                  }>
                    {servico.status}
                  </Badge>
                 
                  
                </div>

               

                <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <div className={"flex items-center gap-1 " + (isServiceOverdue(servico.dataFim) ? "bg-red-500 text-white rounded-full p-1" : "text-muted-foreground")}>
                    <Calendar className={cn("h-3 w-3"  )} />
                    {isServiceOverdue(servico.dataFim) ? `Atrasado ${differenceInDays(new Date(servico.dataFim), new Date())} dias - Prazo: ${format(new Date(servico.dataFim), "dd/MM/yyyy")}` : format(new Date(servico.dataFim), "dd/MM/yyyy") }
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    {formatCurrency(servico.orcamento)}
                  </div>
                  <div className="flex items-center gap-1">
                    <UserCircle className="h-3 w-3" />
                    {servico.team?.representante}
                  </div>
                </div>

                {servico.observacoes && (
                  <div className="mt-2 text-xs">
                    <p className="text-muted-foreground line-clamp-2">
                      {servico.observacoes}
                    </p>
                  </div>
                )}

                <div className="mt-3 flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setEditingService(servico)}
                  >
                    Detalhes
                  </Button>
                  <Button size="sm" variant="outline" className="px-2">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                  <Button onClick={() => handleDeleteService(servico.id)} variant="destructive" size="sm" className="px-2">
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {services.length === 0 && (
            <div className="col-span-full text-center py-8 border rounded-lg">
              <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <h3 className="font-medium mb-1">Nenhum serviço cadastrado</h3>
              <p className="text-sm text-muted-foreground">
                Comece adicionando um novo serviço ao projeto.
              </p>
            </div>
          )}
        </div>

        {editingService && (
          <EditServiceModal
            service={editingService}
            open={!!editingService}
            onOpenChange={(open) => !open && setEditingService(null)}
            onServiceUpdated={() => handleServiceOrWorkspaceChange(editingService.id)} // Usando a mesma função
          />
        )}
      </div>
    )
  }


  // Componente de Materiais
  function MaterialsTab({ workspace }: { workspace: Workspace }) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Controle de Materiais</h2>
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Novo Material
          </Button>
        </div>

        <div className="grid gap-4">
          {workspace.materiais?.map((material) => (
            <Card key={material.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{material.nome}</h3>
                    <p className="text-sm text-muted-foreground">
                      {material.quantidade} {material.unidade}
                    </p>
                  </div>
                  <Badge variant={
                    material.status === 'OK' ? 'success' :
                    material.status === 'CRITICO' ? 'destructive' :
                    'warning'
                  }>
                    {material.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // Componente de Atualizações
  function UpdatesTab({ workspace }: { workspace: Workspace }) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Atualizações Recentes</h2>
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Nova Atualização
          </Button>
        </div>

        <div className="space-y-4">
          {workspace.atualizacoes?.map((atualizacao) => (
            <Card key={atualizacao.id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "p-2 rounded-full",
                    atualizacao.tipo === 'INFO' && "bg-blue-100",
                    atualizacao.tipo === 'ALERTA' && "bg-yellow-100",
                    atualizacao.tipo === 'ERRO' && "bg-red-100",
                    atualizacao.tipo === 'SUCESSO' && "bg-green-100"
                  )}>
                    <AlertCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">{atualizacao.texto}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(atualizacao.data), "PPP 'às' HH:mm", { locale: ptBR })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

   
  // Função helper para verificar atraso
  const isServiceOverdue = (dataFim: Date) => {
    return differenceInDays(new Date(dataFim), new Date()) < 0;
  }

  
  return (
    <div className="space-y-8  ">
      {/* Header */}
      <div className="border-b pb-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{workspace.nome}</h1>
                <p className="text-muted-foreground">{workspace.localizacao}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <Badge variant="outline" className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Início: {format(new Date(workspace.dataInicio), "PPP", { locale: ptBR })}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Término: {format(new Date(workspace.dataFim), "PPP", { locale: ptBR })}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                Serviços: {workspace.servicos?.length} 
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <UserCircle className="h-4 w-4" />
                Gerente: {workspace.gerente}
              </Badge>
              {workspace.riscos > 0 && (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <AlertTriangle className="h-4 w-4" />
                  {workspace.riscos} riscos identificados
                </Badge>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => setEditModalOpen(true)}>
              Editar Projeto
            </Button>
            <Button variant="outline" onClick={() => setReportModalOpen(true)}>
              <FileText className="h-4 w-4 mr-2" />
              Gerar Relatório
            </Button>
          </div>
        </div>
      </div>

      {/* Cards de Métricas */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                Orçamento Total
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {workspace.orcamento > 0 ? (
              <>
                <div className={cn(
                  "text-2xl font-bold",
                  isOrcamentoEstourado(workspace.orcamento, workspace.servicos?.reduce((total, servico) => total + servico.orcamento, 0) || 0) && "text-red-600"
                )}>
                  {formatCurrency(String(workspace.orcamento))}
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground mt-1">
                    {((workspace.servicos?.reduce((total, servico) => total + servico.orcamento, 0) / workspace.orcamento) * 100).toFixed(1)}% utilizado
                  </p>
                  {isOrcamentoEstourado(workspace.orcamento, workspace.servicos?.reduce((total, servico) => total + servico.orcamento, 0) || 0) && (
                    <Badge variant="destructive" className="text-xs">
                      Orçamento Estourado
                    </Badge>
                  )}
                </div>
                <Progress 
                  value={(workspace.servicos?.reduce((total, servico) => total + servico.orcamento, 0) / workspace.orcamento) * 100} 
                  className={cn(
                    "mt-2",
                    isOrcamentoEstourado(workspace.orcamento, workspace.servicos?.reduce((total, servico) => total + servico.orcamento, 0) || 0) && "bg-red-100"
                  )}
                />
              </>
            ) : (
              <div className="text-center py-2">
                <p className="text-sm text-muted-foreground">Orçamento não definido</p>
                <Button variant="link" className="mt-1">
                  Definir orçamento
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                Progresso Geral 
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(() => {
                const total = workspace.servicos?.length || 0;
                const concluidos = workspace.servicos?.filter(s => s.status === 'CONCLUIDO').length || 0;
                if (total === 0) return '0%';
                return `${Math.round((concluidos / total) * 100)}%`;
              })()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {workspace.servicos?.filter(s => s.status === 'CONCLUIDO').length || 0} de {workspace.servicos?.length || 0} serviços concluídos
            </p>
            <Progress 
              value={(() => {
                const total = workspace.servicos?.length || 0;
                const concluidos = workspace.servicos?.filter(s => s.status === 'CONCLUIDO').length || 0;
                return (concluidos / total) * 100;
              })()}
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-orange-600" />
                Orçamento Utilizado
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(String(workspace.servicos?.reduce((total, servico) => total + servico.orcamento, 0)))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Restante: {formatCurrency(String(workspace.orcamento - (workspace.servicos?.reduce((total, servico) => total + servico.orcamento, 0) || 0)))}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center gap-2">
                <ListChecks className="h-4 w-4 text-purple-600" />
                Total de Serviços
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {workspace.servicos?.length || 0}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1 text-center">
              <span>Concluídos: {workspace.servicos?.filter(s => s.status === 'CONCLUIDO').length || 0}</span>
              <span>Atrasados: {workspace.servicos?.filter(s => isServiceOverdue(s.dataFim) && s.status !== 'CONCLUIDO').length || 0}</span>
              <span>Em Andamento: {workspace.servicos?.filter(s => s.status === 'EM_ANDAMENTO').length || 0}</span>
              <span>Não iniciados: {workspace.servicos?.filter(s => s.status === 'NAO_INICIADO').length || 0}</span>
            </div>
          </CardContent>
        </Card>

       
      </div>

      

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="services">Serviços</TabsTrigger>
           <TabsTrigger value="materials">Materiais</TabsTrigger>
          <TabsTrigger value="updates">Atualizações</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab workspace={workspace} />
        </TabsContent>

        <TabsContent value="services">
          <ServicesTab workspace={workspace} />
        </TabsContent>

       

        <TabsContent value="materials">
          <MaterialsTab workspace={workspace} />
        </TabsContent>

        <TabsContent value="updates">
          <UpdatesTab workspace={workspace} />
        </TabsContent>

        

        <TabsContent value="documents">
          <DocumentosList workspaceId={Number(workspace.id)}  />
        </TabsContent>
      </Tabs>

      {workspace && (
        <EditWorkspaceModal
          workspace={workspace}
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          onWorkspaceUpdated={() => refreshCurrentWorkspace(workspace.id)}
          />
      )}

      {workspace && (
        <GenerateReportModal
          workspace={workspace}
          open={reportModalOpen}
          onOpenChange={setReportModalOpen}
        />
      )}
    </div>
  )
}

