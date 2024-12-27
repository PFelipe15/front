import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { format, differenceInDays } from 'date-fns'
import { formatCurrency } from '../utils'
import { Workspace } from '@prisma/client'

// Função auxiliar para criar cabeçalho padrão
 

// Relatório de Equipes
export async function generateTeamsReport(workspace: Workspace) {
  try {
    const doc = new jsPDF()
    let yPos = 20

    // Cabeçalho
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('RELATÓRIO DE EQUIPES E SERVIÇOS', 105, yPos, { align: 'center' })
    
    yPos += 15
    doc.setFontSize(14)
    doc.text(workspace.nome, 105, yPos, { align: 'center' })

    // Info Básica
    yPos += 20
    doc.setFontSize(10)
    doc.text([
      `Código do Projeto: #${workspace.id}`,
      `Gerente: ${workspace.gerente}`,
      `Data: ${format(new Date(), 'dd/MM/yyyy')}`
    ], 20, yPos)

    // Resumo das Equipes
    yPos += 30
    doc.setFontSize(12)
    doc.text('1. RESUMO DAS EQUIPES', 20, yPos)

    const equipeStats = workspace.servicos?.reduce((acc, servico) => {
      if (servico.team) {
        if (!acc[servico.team.nome]) {
          acc[servico.team.nome] = {
            totalServicos: 0,
            servicosConcluidos: 0,
            orcamentoTotal: 0,
            progressoMedio: 0
          }
        }
        acc[servico.team.nome].totalServicos++
        if (servico.status === 'CONCLUIDO') {
          acc[servico.team.nome].servicosConcluidos++
        }
        acc[servico.team.nome].orcamentoTotal += servico.orcamento
        acc[servico.team.nome].progressoMedio += servico.progresso
      }
      return acc
    }, {} as Record<string, any>)

    const equipeData = Object.entries(equipeStats).map(([equipe, stats]) => [
      equipe,
      stats.totalServicos,
      stats.servicosConcluidos,
      `${(stats.progressoMedio / stats.totalServicos).toFixed(1)}%`,
      formatCurrency(stats.orcamentoTotal)
    ])

    doc.autoTable({
      startY: yPos + 10,
      head: [['Equipe', 'Total Serviços', 'Concluídos', 'Progresso Médio', 'Orçamento']],
      body: equipeData,
      theme: 'grid',
      styles: { fontSize: 10 }
    })

    // ... resto do relatório de equipes ...
    doc.save(`relatorio-equipes-${workspace.nome}-${format(new Date(), 'dd-MM-yyyy')}.pdf`)
    return true
  } catch (error) {
    throw error
  }
}

// Relatório de Aprovação de Orçamento
export async function generateApprovalReport(workspace: Workspace) {
  try {
    if (!workspace) {
      throw new Error('Workspace não encontrado')
    }

    const doc = new jsPDF()
    
    // Verifica se temos o logo antes de tentar adicionar
    try {
      doc.addImage('/logo.png', 'PNG', 20, 10, 25, 25)
    } catch (error) {
      console.warn('Logo não encontrado, continuando sem logo')
    }

    // Cabeçalho básico (sem depender do addReportHeader)
    let yPos = 20
    
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('SOLICITAÇÃO DE APROVAÇÃO DE ORÇAMENTO', 105, yPos, { align: 'center' })
    
    yPos += 15
    doc.setFontSize(14)
    doc.text(workspace.nome || 'Sem nome', 105, yPos, { align: 'center' })

    // Informações Básicas com verificações
    yPos += 20
    doc.setFontSize(10)
    doc.text([
      `Código: #${workspace.id || 'N/A'}`,
      `Local: ${workspace.localizacao || 'N/A'}`,
      `Responsável: ${workspace.gerente || 'N/A'}`,
      `Data: ${format(new Date(), 'dd/MM/yyyy')}`
    ], 20, yPos)

    // Sumário Executivo com verificações de valores
    yPos += 30
    doc.setFontSize(12)
    doc.text('1. SUMÁRIO EXECUTIVO', 20, yPos)

    const gastoTotal = workspace.servicos?.reduce((acc, s) => acc + (s.orcamento || 0), 0) || 0
    const orcamentoOriginal = workspace.orcamento || 0
    const percentualExcedido = orcamentoOriginal > 0 
      ? ((gastoTotal - orcamentoOriginal) / orcamentoOriginal) * 100 
      : 0

    const sumarioData = [
      ['Orçamento Original', formatCurrency(orcamentoOriginal)],
      ['Gasto Total Atual', formatCurrency(gastoTotal)],
      ['Valor Excedido', formatCurrency(gastoTotal - orcamentoOriginal)],
      ['Percentual Excedido', `${percentualExcedido.toFixed(1)}%`],
      ['Novo Orçamento Solicitado', formatCurrency(gastoTotal * 1.2)],
      ['Aumento Proposto', `${((gastoTotal * 1.2 - orcamentoOriginal) / orcamentoOriginal * 100).toFixed(1)}%`]
    ]

    doc.autoTable({
      startY: yPos + 10,
      body: sumarioData,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 5 }
    })

    // Justificativa
    yPos = (doc.lastAutoTable?.finalY || yPos) + 20
    doc.text('2. JUSTIFICATIVA DA SOLICITAÇÃO', 20, yPos)

    const justificativas = [
      ['1. Aumento dos Custos', 'Variação nos preços dos materiais e serviços'],
      ['2. Serviços Adicionais', 'Adequações necessárias identificadas'],
      ['3. Complexidade', 'Desafios técnicos da execução'],
      ['4. Fatores Externos', 'Condições adversas e imprevistos']
    ]

    doc.autoTable({
      startY: yPos + 10,
      body: justificativas,
      theme: 'grid',
      styles: { fontSize: 10 }
    })

    // Detalhamento simplificado dos custos
    yPos = (doc.lastAutoTable?.finalY || yPos) + 20
    doc.setFontSize(12)
    doc.text('3. DETALHAMENTO DE CUSTOS', 21, yPos)

    const custosData = (workspace.servicos || []).map(servico => [
      servico.nome || 'Sem nome',
      formatCurrency(servico.orcamento || 0),
      `${servico.progresso || 0}%`,
      servico.status || 'N/A'
    ])

    doc.autoTable({
      startY: yPos + 10,
      head: [['Serviço', 'Custo', 'Progresso', 'Status']], 
      body: custosData.length > 0 ? custosData : [['Sem dados disponíveis', '-', '-', '-']],
      theme: 'striped',
      styles: { 
        fontSize: 9,
        cellPadding: 5
      },
      headStyles: {
        fillColor: [0, 184, 148],
        textColor: 255,
        fontSize: 10,
        fontStyle: 'bold',
        halign: 'center',
        valign: 'middle'
      },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 40, halign: 'right' },
        2: { cellWidth: 30, halign: 'center' },
        3: { cellWidth: 40, halign: 'center' }
      },
      alternateRowStyles: {
        fillColor: [245, 247, 250]
      }
    })

    // Assinaturas
    yPos = (doc.lastAutoTable?.finalY || yPos) + 30
    doc.line(20, yPos, 90, yPos)
    doc.line(120, yPos, 190, yPos)
    
    doc.setFontSize(10)
    doc.text(workspace.gerente || 'Gerente', 55, yPos + 5, { align: 'center' })
    doc.setFontSize(8)
    doc.text('Gerente do Projeto', 55, yPos + 10, { align: 'center' })
    
    doc.setFontSize(10)
    doc.text('Diretor Financeiro', 155, yPos + 5, { align: 'center' })
    doc.setFontSize(8)
    doc.text('Aprovação', 155, yPos + 10, { align: 'center' })

    // Rodapé
    doc.setFontSize(8)
    doc.text(
      'Documento gerado pelo sistema ConstructEye',
      105,
      280,
      { align: 'center' }
    )

    const fileName = `aprovacao-orcamento-${workspace.nome || 'projeto'}-${format(new Date(), 'dd-MM-yyyy')}.pdf`
    doc.save(fileName)
    return true
  } catch (error) {
    console.error('Erro ao gerar relatório de aprovação:', error)
    throw new Error('Não foi possível gerar o relatório de aprovação')
  }
}

// Relatório de Cronograma
export async function generateScheduleReport(workspace: Workspace) {
  try {
    const doc = new jsPDF()
    let yPos = 20

    // Cabeçalho
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('RELATÓRIO DE CRONOGRAMA', 105, yPos, { align: 'center' })
    
    yPos += 15
    doc.setFontSize(14)
    doc.text(workspace.nome, 105, yPos, { align: 'center' })

    // Datas do Projeto
    yPos += 30
    doc.setFontSize(12)
    doc.text('1. PRAZOS DO PROJETO', 20, yPos)

    const diasRestantes = differenceInDays(new Date(workspace.dataFim), new Date())
    const prazoData = [
      ['Início do Projeto', format(new Date(workspace.dataInicio), 'dd/MM/yyyy')],
      ['Previsão de Término', format(new Date(workspace.dataFim), 'dd/MM/yyyy')],
      ['Dias Restantes', diasRestantes.toString()],
      ['Status do Prazo', diasRestantes < 0 ? 'ATRASADO' : 'NO PRAZO']
    ]

    doc.autoTable({
      startY: yPos + 10,
      body: prazoData,
      theme: 'grid',
      styles: { fontSize: 10 }
    })

    // Cronograma de Serviços
    yPos = doc.lastAutoTable.finalY + 20
    doc.text('2. CRONOGRAMA DE SERVIÇOS', 20, yPos)

    const servicosData = workspace.servicos?.map(servico => [
      servico.nome,
      format(new Date(servico.dataInicio), 'dd/MM/yyyy'),
      format(new Date(servico.dataFim), 'dd/MM/yyyy'),
      `${servico.progresso}%`,
      servico.status
    ]) || []

    doc.autoTable({
      startY: yPos + 10,
      head: [['Serviço', 'Início', 'Término', 'Progresso', 'Status']],
      body: servicosData,
      theme: 'grid',
      styles: { fontSize: 10 }
    })

    // ... resto do relatório de cronograma ...
    doc.save(`relatorio-cronograma-${workspace.nome}-${format(new Date(), 'dd-MM-yyyy')}.pdf`)
    return true
  } catch (error) {
    throw error
  }
}

// Relatório Geral
export async function generateGeneralReport(workspace: Workspace) {
  try {
    const doc = new jsPDF()
    let yPos = 20

    // Cabeçalho
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('RELATÓRIO GERAL DO PROJETO', 105, yPos, { align: 'center' })
    
    yPos += 15
    doc.setFontSize(14)
    doc.text(workspace.nome, 105, yPos, { align: 'center' })

    // Informações Básicas
    yPos += 20
    doc.setFontSize(10)
    doc.text([
      `Código do Projeto: #${workspace.id}`,
      `Local: ${workspace.localizacao}`,
      `Gerente: ${workspace.gerente}`,
      `Data do Relatório: ${format(new Date(), 'dd/MM/yyyy')}`
    ], 20, yPos)

    // 1. Visão Geral
    yPos += 40
    doc.setFontSize(12)
    doc.text('1. VISÃO GERAL DO PROJETO', 20, yPos)

    const visaoGeral = [
      ['Início do Projeto', format(new Date(workspace.dataInicio), 'dd/MM/yyyy')],
      ['Previsão de Término', format(new Date(workspace.dataFim), 'dd/MM/yyyy')],
      ['Progresso Geral', `${workspace.progresso}%`],
      ['Status', workspace.status],
      ['Orçamento Total', formatCurrency(workspace.orcamento)],
      ['Gasto Atual', formatCurrency(workspace.gasto)]
    ]

    doc.autoTable({
      startY: yPos + 10,
      body: visaoGeral,
      theme: 'grid',
      styles: { fontSize: 10 }
    })

    // 2. Resumo Financeiro
    yPos = doc.lastAutoTable.finalY + 20
    doc.text('2. RESUMO FINANCEIRO', 20, yPos)

    const gastoTotal = workspace.servicos?.reduce((acc, s) => acc + s.orcamento, 0) || 0
    const resumoFinanceiro = [
      ['Orçamento Previsto', formatCurrency(workspace.orcamento)],
      ['Gasto Total', formatCurrency(gastoTotal)],
      ['Variação', formatCurrency(gastoTotal - workspace.orcamento)],
      ['% Utilizado', `${((gastoTotal/workspace.orcamento) * 100).toFixed(1)}%`]
    ]

    doc.autoTable({
      startY: yPos + 10,
      body: resumoFinanceiro,
      theme: 'grid',
      styles: { fontSize: 10 }
    })

    // 3. Equipes e Serviços
    yPos = doc.lastAutoTable.finalY + 20
    doc.text('3. EQUIPES E SERVIÇOS', 20, yPos)

    const servicosData = workspace.servicos?.map(servico => [
      servico.nome,
      servico.team?.nome || '-',
      formatCurrency(servico.orcamento),
      `${servico.progresso}%`,
      servico.status
    ]) || []

    doc.autoTable({
      startY: yPos + 10,
      head: [['Serviço', 'Equipe', 'Orçamento', 'Progresso', 'Status']],
      body: servicosData,
      theme: 'grid',
      styles: { fontSize: 10 }
    })

    // 4. Cronograma
    yPos = doc.lastAutoTable.finalY + 20
    doc.text('4. CRONOGRAMA', 20, yPos)

    const diasRestantes = differenceInDays(new Date(workspace.dataFim), new Date())
    const cronogramaData = [
      ['Dias Decorridos', differenceInDays(new Date(), new Date(workspace.dataInicio)).toString()],
      ['Dias Restantes', diasRestantes.toString()],
      ['Status do Prazo', diasRestantes < 0 ? 'ATRASADO' : 'NO PRAZO'],
      ['Previsão de Conclusão', format(new Date(workspace.dataFim), 'dd/MM/yyyy')]
    ]

    doc.autoTable({
      startY: yPos + 10,
      body: cronogramaData,
      theme: 'grid',
      styles: { fontSize: 10 }
    })

    // 5. Materiais
    if (workspace.materiais && workspace.materiais.length > 0) {
      yPos = doc.lastAutoTable.finalY + 20
      doc.text('5. MATERIAIS', 20, yPos)

      const materiaisData = workspace.materiais.map(material => [
        material.nome,
        material.quantidade.toString(),
        material.unidade,
        material.status
      ])

      doc.autoTable({
        startY: yPos + 10,
        head: [['Material', 'Quantidade', 'Unidade', 'Status']],
        body: materiaisData,
        theme: 'grid',
        styles: { fontSize: 10 }
      })
    }

    // 6. Atualizações Recentes
    if (workspace.atualizacoes && workspace.atualizacoes.length > 0) {
      yPos = doc.lastAutoTable.finalY + 20
      doc.text('6. ATUALIZAÇÕES RECENTES', 20, yPos)

      const atualizacoesData = workspace.atualizacoes
        .slice(-5) // últimas 5 atualizações
        .map(update => [
          format(new Date(update.data), 'dd/MM/yyyy'),
          update.tipo,
          update.texto
        ])

      doc.autoTable({
        startY: yPos + 10,
        head: [['Data', 'Tipo', 'Descrição']],
        body: atualizacoesData,
        theme: 'grid',
        styles: { fontSize: 10 }
      })
    }

    // Assinaturas
    yPos = doc.lastAutoTable.finalY + 30
    doc.line(20, yPos, 90, yPos)
    doc.line(120, yPos, 190, yPos)
    
    doc.setFontSize(10)
    doc.text(workspace.gerente, 55, yPos + 5, { align: 'center' })
    doc.setFontSize(8)
    doc.text('Gerente do Projeto', 55, yPos + 10, { align: 'center' })
    
    doc.setFontSize(10)
    doc.text('Responsável Técnico', 155, yPos + 5, { align: 'center' })
    doc.setFontSize(8)
    doc.text('CREA/CAU', 155, yPos + 10, { align: 'center' })

    // Rodapé
    doc.setFontSize(8)
    doc.setTextColor(128, 128, 128)
    doc.text(
      'Documento gerado automaticamente pelo sistema ConstructEye',
      105,
      280,
      { align: 'center' }
    )
    doc.text(
      `Página 1 de 1 | ${format(new Date(), "dd/MM/yyyy 'às' HH:mm")}`,
      105,
      285,
      { align: 'center' }
    )

    doc.save(`relatorio-geral-${workspace.nome}-${format(new Date(), 'dd-MM-yyyy')}.pdf`)
    return true
  } catch (error) {
    throw error
  }
}

// Relatório Financeiro
export async function generateFinancialReport(workspace: Workspace) {
  try {
    const doc = new jsPDF()
    let yPos = 20

    // Cabeçalho com Logo
    doc.addImage('/logo.png', 'PNG', 20, yPos, 30, 30)
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('RELATÓRIO FINANCEIRO DETALHADO', 105, yPos + 15, { align: 'center' })
    
    // Informações do Projeto
    yPos += 40
    doc.setFontSize(10)
    doc.text([
      `Projeto: ${workspace.nome}`,
      `Código: #${workspace.id}`,
      `Local: ${workspace.localizacao}`,
      `Data: ${format(new Date(), 'dd/MM/yyyy')}`,
      `Responsável: ${workspace.gerente}`
    ], 20, yPos)

    // 1. Resumo Executivo Financeiro
    yPos += 40
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('1. RESUMO EXECUTIVO FINANCEIRO', 20, yPos)

    const gastoTotal = workspace.servicos?.reduce((acc, s) => acc + s.orcamento, 0) || 0
    const resumoFinanceiro = [
      ['Orçamento Aprovado', formatCurrency(workspace.orcamento)],
      ['Gasto Total Atual', formatCurrency(gastoTotal)],
      ['Variação', formatCurrency(gastoTotal - workspace.orcamento)],
      ['Percentual Utilizado', `${((gastoTotal/workspace.orcamento) * 100).toFixed(1)}%`],
      ['Status Financeiro', gastoTotal > workspace.orcamento ? 'EXCEDIDO' : 'DENTRO DO PREVISTO'],
      ['Previsão Final', formatCurrency(gastoTotal * 1.1)] // Estimativa de conclusão
    ]

    doc.autoTable({
      startY: yPos + 10,
      body: resumoFinanceiro,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 5 },
      headStyles: { fillColor: [79, 70, 229] }
    })

    // 2. Análise por Categoria de Gasto
    yPos = doc.lastAutoTable.finalY + 20
    doc.setFontSize(12)
    doc.text('2. ANÁLISE POR CATEGORIA DE GASTO', 20, yPos)

    // Gráfico de Pizza (simulado com texto/tabela)
    const categorias = workspace.servicos?.reduce((acc, servico) => {
      const categoria = servico.categoria || 'Outros'
      acc[categoria] = (acc[categoria] || 0) + servico.orcamento
      return acc
    }, {} as Record<string, number>)

    const categoriasData = Object.entries(categorias || {}).map(([categoria, valor]) => [
      categoria,
      formatCurrency(valor),
      `${((valor/gastoTotal) * 100).toFixed(1)}%`
    ])

    doc.autoTable({
      startY: yPos + 10,
      head: [['Categoria', 'Valor Total', '% do Orçamento']],
      body: categoriasData,
      theme: 'grid',
      styles: { fontSize: 10 }
    })

    // 3. Fluxo de Caixa
    yPos = doc.lastAutoTable.finalY + 20
    doc.text('3. FLUXO DE CAIXA', 20, yPos)

    // Organizar pagamentos por mês
    const fluxoCaixa = workspace.pagamentos?.reduce((acc, pagamento) => {
      const mes = format(new Date(pagamento.data), 'MM/yyyy')
      acc[mes] = (acc[mes] || 0) + pagamento.valor
      return acc
    }, {} as Record<string, number>)

    const fluxoCaixaData = Object.entries(fluxoCaixa || {}).map(([mes, valor]) => [
      mes,
      formatCurrency(valor),
      formatCurrency(valor - (workspace.orcamento / 12)) // Variação mensal
    ])

    doc.autoTable({
      startY: yPos + 10,
      head: [['Mês', 'Valor Pago', 'Variação']],
      body: fluxoCaixaData,
      theme: 'grid',
      styles: { fontSize: 10 }
    })

    // 4. Análise de Custos por Equipe
    yPos = doc.lastAutoTable.finalY + 20
    doc.text('4. ANÁLISE DE CUSTOS POR EQUIPE', 20, yPos)

    const custosEquipe = workspace.servicos?.reduce((acc, servico) => {
      if (servico.team) {
        acc[servico.team.nome] = {
          total: (acc[servico.team.nome]?.total || 0) + servico.orcamento,
          servicos: (acc[servico.team.nome]?.servicos || 0) + 1,
          mediaServico: 0
        }
        acc[servico.team.nome].mediaServico = 
          acc[servico.team.nome].total / acc[servico.team.nome].servicos
      }
      return acc
    }, {} as Record<string, { total: number, servicos: number, mediaServico: number }>)

    const custosEquipeData = Object.entries(custosEquipe || {}).map(([equipe, dados]) => [
      equipe,
      formatCurrency(dados.total),
      dados.servicos.toString(),
      formatCurrency(dados.mediaServico)
    ])

    doc.autoTable({
      startY: yPos + 10,
      head: [['Equipe', 'Custo Total', 'Qtd. Serviços', 'Média/Serviço']],
      body: custosEquipeData,
      theme: 'grid',
      styles: { fontSize: 10 }
    })

    // 5. Indicadores Financeiros
    yPos = doc.lastAutoTable.finalY + 20
    doc.text('5. INDICADORES FINANCEIROS', 20, yPos)

    const indicadores = [
      ['Custo por Dia', formatCurrency(gastoTotal / differenceInDays(new Date(), new Date(workspace.dataInicio)))],
      ['Projeção até Conclusão', formatCurrency(gastoTotal * (100 / workspace.progresso))],
      ['Variação Projetada', formatCurrency((gastoTotal * (100 / workspace.progresso)) - workspace.orcamento)],
      ['Índice de Desempenho de Custo', ((workspace.orcamento * (workspace.progresso / 100)) / gastoTotal).toFixed(2)]
    ]

    doc.autoTable({
      startY: yPos + 10,
      body: indicadores,
      theme: 'grid',
      styles: { fontSize: 10 }
    })

    // 6. Recomendações e Ações Corretivas
    if (gastoTotal > workspace.orcamento) {
      yPos = doc.lastAutoTable.finalY + 20
      doc.text('6. RECOMENDAÇÕES E AÇÕES CORRETIVAS', 20, yPos)
      
      const recomendacoes = [
        ['1', 'Revisar custos operacionais e identificar possíveis otimizações'],
        ['2', 'Avaliar necessidade de readequação do escopo'],
        ['3', 'Considerar renegociação com fornecedores'],
        ['4', 'Implementar controle mais rigoroso de gastos'],
        ['5', 'Avaliar possibilidade de aditivo contratual']
      ]

      doc.autoTable({
        startY: yPos + 10,
        body: recomendacoes,
        theme: 'grid',
        styles: { fontSize: 10 }
      })
    }

    // Assinaturas
    yPos = doc.lastAutoTable.finalY + 30
    doc.line(20, yPos, 90, yPos)
    doc.line(120, yPos, 190, yPos)
    
    doc.setFontSize(10)
    doc.text(workspace.gerente, 55, yPos + 5, { align: 'center' })
    doc.setFontSize(8)
    doc.text('Gerente do Projeto', 55, yPos + 10, { align: 'center' })
    
    doc.setFontSize(10)
    doc.text('Diretor Financeiro', 155, yPos + 5, { align: 'center' })
    doc.setFontSize(8)
    doc.text('Aprovação', 155, yPos + 10, { align: 'center' })

    // Rodapé
    doc.setFontSize(8)
    doc.setTextColor(128, 128, 128)
    doc.text(
      'Documento gerado automaticamente pelo sistema ConstructEye',
      105,
      280,
      { align: 'center' }
    )
    doc.text(
      `Página 1 de 1 | ${format(new Date(), "dd/MM/yyyy 'às' HH:mm")}`,
      105,
      285,
      { align: 'center' }
    )

    doc.save(`relatorio-financeiro-${workspace.nome}-${format(new Date(), 'dd-MM-yyyy')}.pdf`)
    return true
  } catch (error) {
    throw error
  }
}