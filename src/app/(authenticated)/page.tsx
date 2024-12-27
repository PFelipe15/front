"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import dynamic from 'next/dynamic'
import { 
  Building2, 
  Clock, 
  AlertTriangle, 
  Users, 
  TrendingUp, 
  Hammer, 
  Calendar,
  DollarSign,
  BarChart4,
  Group,
  Download,
 
  CalendarDays,
  RefreshCw
} from 'lucide-react'
import { formatCurrency } from "@/lib/utils"
import { format, isAfter, differenceInDays } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Progress } from "@/components/ui/progress"
import { Service, Team    } from "@prisma/client"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useWorkspaces } from "@/contexts/WorkspaceContext"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreateWorkspaceModal } from "@/components/modals/create-workspace-modal"

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

// Função auxiliar para traduzir categorias
const traduzirCategoria = (categoria: string) => {
  const traducoes: Record<string, string> = {
    'ALVENARIA': 'Alvenaria',
    'GESSO': 'Gesso',
    'ELETRICIDADE': 'Eletricidade',
    'HIDRAULICA': 'Hidráulica',
    'CIVIL': 'Construção Civil',
    'PINTURA': 'Pintura',
    'OUTROS': 'Outros',
    'JARDINAGEM': 'Jardinagem',
    'SERRALHERIA': 'Serralheria',
    'MARMOARIA': 'Marmoaria',
    'VIDRACARIA': 'Vidraçaria',
    'CLIMATIZACAO': 'Climatização',
    'TOLDOS': 'Toldos e Coberturas',
    'CARPINTARIA': 'Carpintaria',
    'REVESTIMENTO': 'Revestimento',
    'DEDETIZACAO': 'Dedetização',
    'DESENTUPIMENTO': 'Desentupimento',
    'REFRIGERACAO': 'Refrigeração',
    'DEMOLICAO': 'Demolição',
    'LIMPEZA': 'Limpeza',
    'PORTAS_E_PORTOES': 'Portas e Portões'
  }
  return traducoes[categoria] || categoria
}

export default function DashboardGeral() {
  const { workspaces, refreshWorkspaces } = useWorkspaces()
  const [equipes, setEquipes] = useState<Team[]>([])
  const [services, setServices] = useState<Service[]>([])

  useEffect(() => {
    Promise.all([
      fetch('/api/equipes').then(res => res.json()),
      fetch('/api/services').then(res => res.json())
    ]).then(([equipesData, servicesData]) => {
      setEquipes(equipesData)
      setServices(servicesData)
    })
  }, [])

  useEffect(() => {
    refreshWorkspaces()
  }, [refreshWorkspaces])

  // Cálculos atualizados baseados em status
  const calcularProgressoPorStatus = (servicos: Service[]) => {
    if (!servicos.length) return 0
    
    const servicosConcluidos = servicos.filter(s => s.status === 'CONCLUIDO').length
    return (servicosConcluidos / servicos.length) * 100
  }

  // Cálculos importantes atualizados
  const projetosAtivos = workspaces.length
  const projetosConcluidos = workspaces.filter(w => 
    w.servicos?.every(s => s.status === 'CONCLUIDO')
  ).length
  const projetosEmAndamento = workspaces.filter(w => 
    w.servicos?.some(s => s.status === 'EM_ANDAMENTO')
  ).length
  const projetosAtrasados = workspaces.filter(w => 
    w.servicos?.some(s => s.status === 'ATRASADO')
  ).length

  const orcamentoTotal = workspaces.reduce((acc, w) => acc + w.orcamento, 0)
  const gastoTotal = services?.reduce((acc, w) => acc + w.orcamento, 0)

  // Serviços atrasados (agora usando status)
  const servicosAtrasados = services.filter(s => s.status === 'ATRASADO').length

  // Progresso por projeto atualizado
  const progressoPorProjeto = workspaces.map(w => {
    const servicos = w.servicos || []
    const progressoAtual = calcularProgressoPorStatus(servicos)

    return {
      nome: w.nome,
      progresso: Number(progressoAtual.toFixed(2)),
      totalServicos: servicos.length,
      servicosConcluidos: servicos.filter(s => s.status === 'CONCLUIDO').length,
      servicosEmAndamento: servicos.filter(s => s.status === 'EM_ANDAMENTO').length,
      servicosAtrasados: servicos.filter(s => s.status === 'ATRASADO').length,
      servicosNaoIniciados: servicos.filter(s => s.status === 'NAO_INICIADO').length,
      orcamentoPrevisto: w.orcamento,
      orcamentoGasto: w.servicos?.reduce((acc, s) => acc + s.orcamento, 0) || 0
    }
  })

  // Cálculo do progresso geral atualizado
  const progressoGeral = calcularProgressoPorStatus(services)

  // Status dos serviços para o gráfico de pizza
  const statusServicos = {
    emAndamento: services.filter(s => s.status === 'EM_ANDAMENTO').length,
    concluidos: services.filter(s => s.status === 'CONCLUIDO').length,
    atrasados: services.filter(s => s.status === 'ATRASADO').length,
    naoIniciados: services.filter(s => s.status === 'NAO_INICIADO').length,
  }

  // Dados para o gráfico de status
  const dadosGraficoStatus = {
    series: [
      statusServicos.emAndamento,
      statusServicos.concluidos,
      statusServicos.atrasados,
      statusServicos.naoIniciados
    ],
    labels: ['Em Andamento', 'Concluídos', 'Atrasados', 'Não Iniciados']
  }

  // Equipes mais ativas (número de serviços por equipe)
  const servicosPorEquipe = equipes.map(equipe => ({
    nome: equipe.nome,
    totalServicos: services.filter(s => s.teamId === equipe.id).length,
    servicosAtivos: services.filter(s => 
      s.teamId === equipe.id && s.status === 'EM_ANDAMENTO'
    ).length
  }))

  // Categorias mais frequentes
  const categoriaServicos = services.reduce((acc, service) => {
    acc[service.categoria] = (acc[service.categoria] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const servicosPorMes = services.reduce((acc, service) => {
    const mes = format(new Date(service.dataInicio), 'MMM', { locale: ptBR })
    acc[mes] = (acc[mes] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Cálculo da distribuição de gastos por categoria
  const gastosPorCategoria = services.reduce((acc, service) => {
    if (!acc[service.categoria]) {
      acc[service.categoria] = {
        categoria: service.categoria,
        categoriaTraduzida: traduzirCategoria(service.categoria),
        total: 0,
        quantidade: 0,
        projetos: new Set()
      }
    }
    acc[service.categoria].total += service.orcamento
    acc[service.categoria].quantidade += 1
    acc[service.categoria].projetos.add(service.nome)
    return acc
  }, {} as Record<string, { 
    categoria: string
    categoriaTraduzida: string
    total: number
    quantidade: number
    projetos: Set<string>
  }>)

  const dadosGastosPorCategoria = Object.values(gastosPorCategoria)
    .sort((a, b) => b.total - a.total) // Ordenar por valor total
  const totalGastos = dadosGastosPorCategoria.reduce((acc, cat) => acc + cat.total, 0)

  // Adicione esses cálculos no início da função
  const projetosComOrcamentoExcedido = workspaces.filter(workspace => {
    const gastoTotal = workspace.servicos?.reduce((acc, s) => acc + s.orcamento, 0) || 0
    return gastoTotal > workspace.orcamento
  })

  const projetosComPrazoAtrasado = workspaces.filter(workspace => {


 const projetoAtrasado = workspace.dataFim && isAfter(new Date(), new Date(workspace.dataFim))
    
  return projetoAtrasado
  })

  // Função para calcular gastos por equipe
  const calcularGastosPorEquipe = () => {
    const gastosPorEquipe = equipes.map(team => {
      const servicosDaEquipe = services.filter(s => s.teamId === team.id)
      const gastoTotal = servicosDaEquipe.reduce((acc, s) => acc + s.orcamento, 0)
      const servicosAtivos = servicosDaEquipe.filter(s => s.status === 'EM_ANDAMENTO').length
      
      return {
        nome: team.nome,
        gastoTotal,
        servicosAtivos,
        totalServicos: servicosDaEquipe.length,
        representante: team.representante
      }
    }).sort((a, b) => b.gastoTotal - a.gastoTotal) // Ordena por gasto decrescente

    return gastosPorEquipe
  }

  return (
    <div className="space-y-8    ">
      <div className="mb-8">
        {/* Header Principal - Mais limpo e minimalista */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold">Visão Geral dos Projetos</h1>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                Acompanhamento em tempo real dos projetos          
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" className="text-sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar Relatório
              </Button>
              <CreateWorkspaceModal onWorkspaceCreated={refreshWorkspaces} typeButton="default"/>
              
            </div>
          </div>

          {/* Filtros - Mais simples e integrado */}
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-4">
              <Select defaultValue="todos">
                <SelectTrigger className="w-[180px] h-9 text-sm bg-background">
                  <SelectValue placeholder="Todos os Projetos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Projetos</SelectItem>
                  <SelectItem value="ativos">Projetos Ativos</SelectItem>
                  <SelectItem value="concluidos">Projetos Concluídos</SelectItem>
                  <SelectItem value="atrasados">Projetos Atrasados</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays className="h-4 w-4" />
                Últimos 30 dias
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <RefreshCw className="h-3.5 w-3.5" />
              Atualizado há 5 minutos
            </div>
          </div>
        </div>

        {/* Elemento decorativo de fundo */}
        <div className="absolute right-0 top-0 -z-10 h-full w-1/2 bg-gradient-to-l from-blue-50/50 to-transparent dark:from-blue-950/30" />
      </div>

      {/* Cards Principais sempre visíveis */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Projetos Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{projetosAtivos}</div>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {projetosConcluidos} projetos concluídos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Orçamento Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className={cn(
                "text-2xl font-bold",
                gastoTotal > orcamentoTotal ? "text-red-500" : ""
              )}>
                {formatCurrency(orcamentoTotal)}
              </div>
              <TrendingUp className={cn(
                "h-4 w-4",
                gastoTotal > orcamentoTotal ? "text-red-500" : "text-muted-foreground"
              )} />
            </div>
            <p className={cn(
              "text-xs mt-2",
              gastoTotal > orcamentoTotal ? "text-red-500" : "text-muted-foreground"
            )}>
              {formatCurrency(gastoTotal)} em gastos ({((gastoTotal/orcamentoTotal) * 100).toFixed(1)}%)
              {gastoTotal > orcamentoTotal && " - Orçamento Excedido!"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Equipes Ativas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{equipes.length}</div>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {services.filter(s => s.status === 'EM_ANDAMENTO').length} serviços em andamento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Serviços Atrasados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-red-500">{servicosAtrasados}</div>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Necessitam atenção imediata
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Cards de Alertas em versão compacta */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Alertas de Orçamento */}
        {projetosComOrcamentoExcedido.length > 0 && (
          <Card className="border-l-4 border-l-red-500 bg-red-50/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-red-700">
                <AlertTriangle className="h-4 w-4" />
                Alertas de Orçamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {projetosComOrcamentoExcedido.map(projeto => {
                  const gastoTotal = projeto.servicos?.reduce((acc, s) => acc + s.orcamento, 0) || 0
                  const excedido = gastoTotal - projeto.orcamento
                  const percentualExcedido = ((excedido / projeto.orcamento) * 100).toFixed(1)

                  return (
                    <div 
                      key={projeto.id} 
                      className="flex items-center justify-between py-2 border-b border-red-100 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        <div>
                          <Link 
                            href={`/workspace/${projeto.id}`}
                            className="text-sm font-medium text-gray-900 hover:text-red-700"
                          >
                            {projeto.nome}
                          </Link>
                          <p className="text-xs text-red-600">
                            Excedido em {formatCurrency(excedido)} ({percentualExcedido}%)
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Orçamento</p>
                        <p className="text-sm font-medium text-red-700">{formatCurrency(projeto.orcamento)}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Alertas de Prazo */}
        {projetosComPrazoAtrasado.length > 0 && (
          <Card className="border-l-4 border-l-amber-500 bg-amber-50/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-amber-700">
                <Clock className="h-4 w-4" />
                Alertas de Prazo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {projetosComPrazoAtrasado.map(projeto => {
                  const diasAtraso = differenceInDays(new Date(), new Date(projeto.dataFim))
                  const progressoGeral = projeto.servicos?.reduce((acc, s) => acc + s.progresso, 0) / (projeto.servicos?.length || 1)

                  return (
                    <div 
                      key={projeto.id} 
                      className="flex items-center justify-between py-2 border-b border-amber-100 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <div>
                          <Link 
                            href={`/workspace/${projeto.id}`}
                            className="text-sm font-medium text-gray-900 hover:text-amber-700"
                          >
                            {projeto.nome}
                          </Link>
                          <p className="text-xs text-amber-600">
                            Atrasado em {diasAtraso} {diasAtraso === 1 ? 'dia' : 'dias'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Progresso</p>
                        <p className="text-sm font-medium text-amber-700">{progressoGeral.toFixed(0)}%</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}
      {/* Atualização do card de Progresso Geral */}
      <Card className="flex-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Progresso Geral
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">{progressoGeral.toFixed(1)}%</div>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>
          <Progress value={progressoGeral} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {services.filter(s => s.status === 'CONCLUIDO').length} de {services.length} serviços concluídos
          </p>
        </CardContent>
      </Card>
      </div>


      {/* Sistema de Tabs para organizar os gráficos */}
      <Tabs defaultValue="geral" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="geral" className="flex items-center gap-2">
            <BarChart4 className="h-4 w-4" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="financeiro" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Financeiro
          </TabsTrigger>
          <TabsTrigger value="equipes" className="flex items-center gap-2">
            <Group className="h-4 w-4" />
            Equipes
          </TabsTrigger>
          <TabsTrigger value="servicos" className="flex items-center gap-2">
            <Hammer className="h-4 w-4" />
            Serviços
          </TabsTrigger>
        </TabsList>

        {/* Conteúdo da Visão Geral */}
        <TabsContent value="geral" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Progresso dos Projetos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Progresso dos Projetos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ReactApexChart
                  options={{
                    chart: {
                      type: 'bar',
                      toolbar: {
                        show: false
                      }
                    },
                    plotOptions: {
                      bar: {
                        borderRadius: 4,
                        dataLabels: {
                          position: 'top'
                        }
                      }
                    },
                    colors: ['#4F46E5'],
                    xaxis: {
                      categories: progressoPorProjeto.map(p => p.nome)
                    },
                    dataLabels: {
                      enabled: true,
                      formatter: function (val) {
                        return val.toFixed(1) + '%'
                      },
                      offsetY: -20,
                      style: {
                        fontSize: '12px',
                        colors: ["#304758"]
                      }
                    },
                    tooltip: {
                      y: {
                        formatter: function(val, { seriesIndex, dataPointIndex, w }) {
                          const projeto = progressoPorProjeto[dataPointIndex]
                          return `Progresso: ${val.toFixed(1)}%\nServiços Concluídos: ${projeto.servicosConcluidos}/${projeto.totalServicos}`
                        }
                      }
                    }
                  }}
                  series={[{
                    name: 'Progresso',
                    data: progressoPorProjeto.map(p => p.progresso)
                  }]}
                  type="bar"
                  height={300}
                />
              </CardContent>
            </Card>

            {/* Status dos Serviços */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Status dos Serviços
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ReactApexChart
                  options={{
                    chart: { type: 'pie' },
                    labels: ['Em Andamento', 'Concluídos', 'Não Iniciados', 'Atrasados'],
                    colors: ['#10B981', '#4F46E5', '#EF4444', '#F59E0B'],
                    legend: { position: 'bottom' }
                  }}
                  series={[
                    services.filter(s => s.status === 'EM_ANDAMENTO').length,
                    services.filter(s => s.status === 'CONCLUIDO').length,
                    services.filter(s => s.status === 'NAO_INICIADO').length,
                    servicosAtrasados
                  ]}
                  type="pie"
                  height={300}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Conteúdo Financeiro */}
        <TabsContent value="financeiro" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Orçamento vs Gasto */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Orçamento vs Gasto por Projeto
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ReactApexChart
                  options={{
                    chart: { type: 'bar' },
                    plotOptions: { bar: { borderRadius: 4 } },
                    colors: ['#10B981', '#F59E0B'],
                    xaxis: { categories: progressoPorProjeto.map(p => p.nome) }
                  }}
                  series={[
                    {
                      name: 'Orçamento Previsto',
                      data: progressoPorProjeto.map(p => p.orcamentoPrevisto)
                    },
                    {
                      name: 'Gasto Realizado',
                      data: progressoPorProjeto.map(p => p.orcamentoGasto)
                    }
                  ]}
                  type="bar"
                  height={300}
                />
              </CardContent>
            </Card>

            {/* Distribuição de Gastos */}
            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <span>Distribuição de Gastos por Categoria</span>
                  </div>
                  <div className="text-sm font-normal text-muted-foreground">
                    Total: {formatCurrency(totalGastos)}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ReactApexChart
                  options={{
                    chart: {
                      type: 'donut',
                      fontFamily: 'Inter, sans-serif',
                      animations: {
                        enabled: true,
                        speed: 500,
                        animateGradually: {
                          enabled: true,
                          delay: 150
                        },
                        dynamicAnimation: {
                          enabled: true,
                          speed: 350
                        }
                      },
                      toolbar: {
                        show: true,
                        tools: {
                          download: true,
                          selection: false,
                          zoom: false,
                          zoomin: false,
                          zoomout: false,
                          pan: false,
                          reset: false
                        }
                      }
                    },
                    labels: dadosGastosPorCategoria.map(cat => cat.categoriaTraduzida),
                    colors: [
                      '#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
                      '#EC4899', '#06B6D4', '#14B8A6', '#84CC16', '#F97316'
                    ],
                    plotOptions: {
                      pie: {
                        donut: {
                          size: '75%',
                          labels: {
                            show: true,
                            name: {
                              show: true,
                              fontSize: '14px',
                              fontWeight: 600,
                              offsetY: 0
                            },
                            value: {
                              show: true,
                              fontSize: '16px',
                              fontWeight: 500,
                              formatter: function(val) {
                                return formatCurrency(Number(val))
                              }
                            },
                            total: {
                              show: true,
                              label: 'Total Geral',
                              formatter: function() {
                                return formatCurrency(totalGastos)
                              },
                              color: '#64748b'
                            }
                          }
                        }
                      }
                    },
                    tooltip: {
                      enabled: true,
                      custom: function({ series, seriesIndex, dataPointIndex }) {
                        const categoria = dadosGastosPorCategoria[seriesIndex]
                        const percentual = ((categoria.total / totalGastos) * 100).toFixed(1)
                        const projetos = Array.from(categoria.projetos).join(', ')
                        
                        return `
                          <div class="p-2 bg-white rounded-lg shadow-lg border">
                            <div class="font-semibold text-gray-900 mb-1">
                              ${categoria.categoriaTraduzida}
                            </div>
                            <div class="text-sm text-gray-600">
                              <div>Valor: ${formatCurrency(categoria.total)}</div>
                              <div>Percentual: ${percentual}%</div>
                              <div>Quantidade: ${categoria.quantidade} serviços</div>
                              <div class="mt-1 text-xs">
                                <span class="font-medium">Projetos:</span> ${projetos}
                              </div>
                            </div>
                          </div>
                        `
                      }
                    },
                    legend: {
                      position: 'bottom',
                      horizontalAlign: 'center',
                      floating: false,
                      fontSize: '13px',
                      formatter: function(seriesName, opts) {
                        const categoria = dadosGastosPorCategoria[opts.seriesIndex]
                        const percentual = ((categoria.total / totalGastos) * 100).toFixed(1)
                        return `${seriesName} (${percentual}%)`
                      },
                      markers: {
                        width: 8,
                        height: 8,
                        radius: 4
                      },
                      itemMargin: {
                        horizontal: 10,
                        vertical: 5
                      }
                    },
                    responsive: [{
                      breakpoint: 480,
                      options: {
                        chart: {
                          height: 300
                        },
                        legend: {
                          position: 'bottom'
                        }
                      }
                    }],
                    stroke: {
                      width: 2,
                      colors: ['#fff']
                    }
                  }}
                  series={dadosGastosPorCategoria.map(cat => cat.total)}
                  type="donut"
                  height={400}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Conteúdo de Equipes */}
        <TabsContent value="equipes" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Desempenho das Equipes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Desempenho das Equipes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ReactApexChart
                  options={{
                    chart: { type: 'bar' },
                    plotOptions: { bar: { horizontal: true, barHeight: '70%' } },
                    colors: ['#4F46E5', '#10B981'],
                    xaxis: { categories: servicosPorEquipe.map(e => e.nome) }
                  }}
                  series={[
                    {
                      name: 'Serviços Totais',
                      data: servicosPorEquipe.map(e => e.totalServicos)
                    },
                    {
                      name: 'Serviços Ativos',
                      data: servicosPorEquipe.map(e => e.servicosAtivos)
                    }
                  ]}
                  type="bar"
                  height={300}
                />
              </CardContent>
            </Card>

            {/* Distribuição de Serviços por Equipe */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <span>Distribuição de Gastos por Equipe</span>
                  </div>
                  <div className="text-sm font-normal text-muted-foreground">
                    Total: {formatCurrency(services.reduce((acc, s) => acc + s.orcamento, 0))}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ReactApexChart
                  options={{
                    chart: {
                      type: 'bar',
                      toolbar: {
                        show: true,
                        tools: {
                          download: true,
                          selection: false,
                          zoom: false,
                          zoomin: false,
                          zoomout: false,
                          pan: false,
                          reset: false
                        }
                      }
                    },
                    plotOptions: {
                      bar: {
                        borderRadius: 4,
                        horizontal: true,
                        barHeight: '70%',
                        distributed: true,
                        dataLabels: {
                          position: 'bottom'
                        }
                      }
                    },
                    colors: [
                      '#4F46E5', '#10B981', '#F59E0B', '#EF4444', 
                      '#8B5CF6', '#EC4899', '#06B6D4', '#14B8A6'
                    ],
                    dataLabels: {
                      enabled: true,
                      textAnchor: 'start',
                      style: {
                        colors: ['#fff']
                      },
                      formatter: function(val, opt) {
                        return formatCurrency(Number(val))
                      },
                      offsetX: 0
                    },
                    xaxis: {
                      categories: calcularGastosPorEquipe().map(e => e.nome),
                      labels: {
                        formatter: function(val) {
                          return formatCurrency(Number(val))
                        }
                      }
                    },
                    yaxis: {
                      labels: {
                        show: true
                      }
                    },
                    tooltip: {
                      theme: 'dark',
                      y: {
                        formatter: function(val) {
                          return formatCurrency(val)
                        }
                      },
                      custom: function({ series, seriesIndex, dataPointIndex }) {
                        const equipe = calcularGastosPorEquipe()[dataPointIndex]
                        return `
                          <div class="p-2 bg-white rounded-lg shadow-lg border text-gray-900">
                            <div class="font-semibold mb-1">${equipe.nome}</div>
                            <div class="text-sm">
                              <div>Gasto: ${formatCurrency(equipe.gastoTotal)}</div>
                              <div>Serviços Ativos: ${equipe.servicosAtivos}</div>
                              <div>Total de Serviços: ${equipe.totalServicos}</div>
                              <div class="mt-1 text-xs text-gray-500">
                                Representante: ${equipe.representante}
                              </div>
                            </div>
                          </div>
                        `
                      }
                    },
                    grid: {
                      padding: {
                        left: 20,
                        right: 20
                      }
                    }
                  }}
                  series={[{
                    name: 'Gasto Total',
                    data: calcularGastosPorEquipe().map(e => e.gastoTotal)
                  }]}
                  type="bar"
                  height={350}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Conteúdo de Serviços */}
        <TabsContent value="servicos" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Serviços por Categoria */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hammer className="h-5 w-5" />
                  Serviços por Categoria
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ReactApexChart
                  options={{
                    chart: { type: 'donut' },
                    labels: Object.keys(categoriaServicos),
                    colors: ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
                    legend: { position: 'bottom' }
                  }}
                  series={Object.values(categoriaServicos)}
                  type="donut"
                  height={300}
                />
              </CardContent>
            </Card>

            {/* Evolução Mensal */}
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
                    xaxis: { categories: Object.keys(servicosPorMes) },
                    colors: ['#4F46E5'],
                    fill: {
                      type: 'gradient',
                      gradient: {
                        shadeIntensity: 1,
                        opacityFrom: 0.7,
                        opacityTo: 0.3
                      }
                    }
                  }}
                  series={[{
                    name: 'Serviços Iniciados',
                    data: Object.values(servicosPorMes)
                  }]}
                  type="area"
                  height={300}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

    
    </div>
  )
}

