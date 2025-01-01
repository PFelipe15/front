# 🏗️ BuildHub - Plataforma de Gestão de Obras

## 📋 Descrição do Projeto
BuildHub é uma plataforma web desenvolvida para gestão completa de obras e projetos de construção civil. O sistema permite o gerenciamento de equipes, serviços, materiais, orçamentos e documentos, oferecendo uma visão centralizada e em tempo real do andamento dos projetos.

## 🎯 Objetivo
Facilitar o gerenciamento de obras através de uma interface intuitiva que permite:
- Acompanhamento em tempo real do progresso das obras
- Gestão de equipes e serviços
- Controle orçamentário
- Gestão de documentos
- Monitoramento de prazos
- Geração de relatórios

## 🔐 Sistema de Autenticação

### ✅ Implementado
- [x] Login com email e senha
- [x] Cadastro de novos usuários
- [x] Logout
- [x] Proteção de rotas
- [x] Diferentes níveis de acesso (ADMIN, ENGENHEIRO, GESTOR)

### ❌ Pendente
- [ ] Recuperação de senha
- [ ] Atualização de perfil
- [ ] Autenticação com Google/Microsoft

## 📱 Páginas


### 0. Landing Page Comercial da Plataforma '/
- [X] Informacoes sobre a plataforma
- [X] Logo da plataforma
- [X] Figuras de Gestão
- [X] Confianca
- [ ] Video de apresentacao
- [X] Testemunhos de clientes
- [ ] Preços
- [ ] Formulario de contato
- [X] Footer com links para as redes sociais


### 1. Register '/register'
- [x] Interface de cadastro
- [x] Validação de campos
- [x] Redirecionamento baseado no perfil
- [x] Mensagens de erro

### 2. Login '/login'
- [x] Interface de login
- [x] Validação de campos
- [x] Redirecionamento baseado no perfil
- [x] Mensagens de erro
- [x] Layout responsivo


### 3. Dashboard `/`
#### Cards Principais
- [x] Projetos Ativos
  - Contador de projetos em andamento
  - Indicador de projetos concluídos
- [x] Orçamento Total
  - Valor total dos projetos
  - Percentual de gastos
- [x] Equipes Ativas
  - Número de equipes trabalhando
  - Serviços em andamento
- [x] Serviços Atrasados
  - Contador de serviços com prazo excedido
  - Indicador de urgência
- [x] Projetos Com Orcamento Excedido
  - Contador de projetos com orçamento excedido
  - Indicador de urgência

#### Gráficos Visão Geral
- [x] Progresso dos Projetos (Gráfico de Barras)
  - Grafico de barras projetando o progresso dos projetos, porcentagem do projeto especifico o quanto foi concluido.
- [x] Status dos Serviços (Gráfico de Pizza)
  - Explica de modo geral em grafico a divisao de servicos por status, ex: 10 servicos em andamento, 5 servicos concluidos, 2 servicos atrasados


#### Graficos Financeiro
- [x] Orçamento vs Gasto por Projeto (Gráfico de Área)
  - Explica em grafico o comparativo entre o orçamento e o gasto de cada projeto, ex: projeto 1 gastou 1000 e o orçamento era 1500, projeto 2 gastou 800 e o orçamento era 1000
- [x] Distribuição de Gastos por Categoria de Servico (Grafico de Circulo)
  - Explica em grafico a divisao de gastos por categoria, ex: 10% de gastos em Servicos de Gesso, 20% de gastos em Alvenaria, 70% de gastos em Pintura

#### Graficos Equipes
- [x] Desempenho das Equipes (Gráfico de Barras)
  - Totaliza o desempenho de cada equipe entre servicos totais e ativos, ex: equipe 1 fez 10 servicos, equipe 2 fez 8 servicos, equipe 3 fez 6 servicos
- [x] Distribuição de Gastos por Equipe (Grafico de Barras)
  - Explica em grafico a divisao de gastos por equipe, ex: equipe 1 gastou 1000, equipe 2 gastou 800, equipe 3 gastou 600

#### Graficos Servicos
- [x] Serviços por Categoria
  - Explica em grafico a divisao de servicos por categoria, ex: 10 servicos de pintura, 5 servicos de alvenaria, 2 servicos de gesso
- [x] Evolução Mensal
  - Explica em grafico a evolucao mensal de gastos, ex: em janeiro inicamos 10 servicos, em fevereiro inicamos 5 servicos, em marco inicamos 2 servicos

### 4. Workspace `/workspace/[id]`
#### Cards Principais
- [x] Orçamento Total

- [x] Progresso Geral

- [x] Orçamento Utilizado

- [x] Total de Serviços


#### tab Visão Geral
- [x] Prazo do Projeto
  - [x] Término previsto
  - [x] Indicador de atraso

- [x] Progresso do Projeto
  - [x] Orçamento vs Gasto

- [x] Gasto por Equipe
- [x] Progresso por Equipe
- [x] Evolução Mensal
- [x] Status por Equipe


#### tab Serviços
- [x] Lista de Serviços
- [x] Criacao de Servico:
    - [x] Nome do Servico
    - [x] Descricao do Servico
    - [x] Data de Inicio
    - [x] Data de Conclusao
    - [x] Categoria do Servico
    - [x] Orcamento
    - [x] Equipe Responsavel
    - [x] Status do Servico
- [x] Edicao de Servico
- [x] Exclusao de Servico

#### tab Materiais
- [ ] Lista de Materiais
- [ ] Criacao de Material:
    - [ ] Nome do Material
    - [ ] Descricao do Material
    - [ ] Quantidade
    - [ ] Preco Unitario
    - [ ] Fornecedor
- [ ] Edicao de Material
- [ ] Exclusao de Material

#### tab Atualizacoes
- [ ] Lista de Atualizacoes
- [ ] Criacao de Atualizacao:
    - [ ] Descricao da Atualizacao
    - [ ] Data da Atualizacao
    - [ ] Servico Responsavel
- [ ] Edicao de Atualizacao
- [ ] Exclusao de Atualizacao

#### tab Documentos
    - [ ] Lista de Documentos
    - [ ] Criacao de Documento:
        - [ ] Nome do Documento
        - [ ] Descricao do Documento
        - [ ] Data de Upload
        - [ ] Servico Responsavel
    - [ ] Edicao de Documento
    - [ ] Exclusao de Documento
 
- [x] Gasto por Equipe
- [x] Progresso por Equipe
- [x] Evolução Mensal
- [x] Status por Equipe

### 5. Equipes `/equipes`
#### Funcionalidades
- [x] Listagem de equipes
- [x] Criação de nova equipe
- [x] Visualização em lista e cards
- [x] Filtro de busca
- [x] Indicadores de status

#### Pendente
- [ ] Edição de equipe
- [ ] Exclusão de equipe
- [ ] Histórico de serviços
- [ ] Gestão de membros



## 📊 Próximas Implementações

### Alta Prioridade
1. [ ] Sistema de notificações
2. [X] Exportação de relatórios especifico de cada projeto
3. [ ] Exportação de relatórios gerais
3. [ ] Filtros avançados
4. [ ] Gestão de documentos
5. [X] Dashboard por projeto

### Média Prioridade
1. [ ] Timeline de atividades
2. [ ] KPIs detalhados
3. [ ] Integração com calendário
4. [ ] Sistema de comentários
5. [ ] Métricas de produtividade

### Baixa Prioridade
1. [ ] Tema escuro
2. [ ] Customização de dashboard
3. [ ] App mobile
4. [ ] Integração com fornecedores
5. [ ] Chat interno

## 🔧 Tecnologias Utilizadas
- Next.js 14 (App Router)
- TypeScript
- Prisma ORM
- NextAuth.js
- TailwindCSS
- Shadcn/ui
- ApexCharts
- PostgreSQL
- Docker

## 📝 Observações
- Necessário implementar testes automatizados
- Melhorar documentação do código
- Otimizar queries do banco de dados
- Implementar cache de dados
- Melhorar tratamento de erros
- Refatorar codigo

