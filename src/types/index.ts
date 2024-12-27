// src/types/index.ts

// Interface principal do Workspace
export interface Workspace {
    id: number
    nome: string
    orcamento: number
    gasto: number
    progresso: number
    localizacao: string
    dataInicio: Date
    dataFim: Date
    gerente: string
    equipe: number
    riscos: number
    criadoEm: Date
    atualizadoEm: Date
    servicos?: Service[]
    materiais?: Material[]
    atualizacoes?: Update[]
   }
  
  // Interface para Serviços
  export interface Service {
    id: number
    nome: string
    orcamento: number
    progresso: number
    dataInicio: Date
    dataFim: Date
    status: ServiceStatus
    ultimaAtualizacao: Date
    observacoes: string
    projetoId: number
    projeto: Workspace
    teamId: number
    team: Team
  }
  
  // Interface para Materiais
  export interface Material {
    id: number
    nome: string
    quantidade: number
    unidade: string
    status: MaterialStatus
    projetoId: number
    projeto?: Workspace
  }
  
  // Interface para Atualizações
  export interface Update {
    id: number
    data: Date
    texto: string
    tipo: UpdateType
    projetoId: number
    projeto?: Workspace
  }
  
  // Interface para Membros da Equipe
  export interface Team {
    id: number
    nome: string
    representante: string
    quantidade: number
    servicos: Service[]
  }
  
  // Enums para status e tipos
  export enum ServiceStatus {
    NAO_INICIADO = 'NAO_INICIADO',
    EM_ANDAMENTO = 'EM_ANDAMENTO',
    CONCLUIDO = 'CONCLUIDO',
    ATRASADO = 'ATRASADO',
    PAUSADO = 'PAUSADO'
  }
  
  export enum MaterialStatus {
    OK = 'OK',
    BAIXO = 'BAIXO',
    CRITICO = 'CRITICO',
    ESGOTADO = 'ESGOTADO'
  }
  
  export enum UpdateType {
    INFO = 'INFO',
    ALERTA = 'ALERTA',
    ERRO = 'ERRO',
    SUCESSO = 'SUCESSO'
  }
  
  // Types para requests
  export type CreateWorkspaceRequest = Omit<Workspace, 'id' | 'criadoEm' | 'atualizadoEm'>
  export type UpdateWorkspaceRequest = Partial<CreateWorkspaceRequest>
  
  export type CreateServiceRequest = Omit<Service, 'id' | 'projeto'>
  export type UpdateServiceRequest = Partial<CreateServiceRequest>
  
  export type CreateMaterialRequest = Omit<Material, 'id' | 'projeto'>
  export type UpdateMaterialRequest = Partial<CreateMaterialRequest>
  
  export type CreateUpdateRequest = Omit<Update, 'id' | 'projeto'>
  export type UpdateUpdateRequest = Partial<CreateUpdateRequest>
  
  export type CreateTeamMemberRequest = Omit<TeamMember, 'id' | 'projeto'>
  export type UpdateTeamMemberRequest = Partial<CreateTeamMemberRequest>
  
  // Types para responses
  export interface ApiResponse<T> {
    data?: T
    error?: string
    message?: string
  }
  
  export interface PaginatedResponse<T> {
    data: T[]
    total: number
    page: number
    limit: number
    totalPages: number
  }
  
  // Types para filtros e ordenação
  export interface FilterOptions {
    search?: string
    status?: ServiceStatus
    startDate?: Date
    endDate?: Date
    minProgress?: number
    maxProgress?: number
  }
  
  export interface SortOptions {
    field: string
    direction: 'asc' | 'desc'
  }
  
  // Types para métricas e dashboards
  export interface WorkspaceMetrics {
    totalOrcamento: number
    totalGasto: number
    progressoMedio: number
    totalEquipe: number
    totalRiscos: number
    servicosAtrasados: number
    materiaisCriticos: number
  }
  
  export interface TimelineEvent {
    id: number
    data: Date
    tipo: UpdateType
    descricao: string
    servicoId?: number
    materialId?: number
  }
  
  // Types para relatórios
  export interface RelatorioProgresso {
    periodo: string
    progresso: number
    gasto: number
    incidentes: number
    equipe: number
  }
  
  export interface RelatorioFinanceiro {
    periodo: string
    orcamentoPrevisto: number
    gastoReal: number
    variacao: number
  }