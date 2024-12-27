'use server'

import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/workspaces
export async function GET() {
   try {
     const workspaces = await prisma.workspace.findMany({
      include: {
        servicos: true,
        materiais: true,
        atualizacoes: true,
       },
    })
      return NextResponse.json(workspaces)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erro ao buscar workspaces' }, { status: 500 })
  }
}

// POST /api/workspaces
export async function POST(request: Request) {
  try {
    const body = await request.json()

 
    const workspace = await prisma.workspace.create({
      data: {
        nome: body.nome,
        orcamento: body.orcamento,
        gasto: 0,
        status: 'EM_ANDAMENTO',
        localizacao: body.localizacao,
        dataInicio: new Date(),
        dataFim: new Date(),
        gerente: body.gerente,
        descricao: body.descricao,
        categoria: body.categoria,
        prioridade: body.prioridade,
        riscos: 0,
          
      },
    })


    return NextResponse.json({
      success: true,
      data: workspace
    })

  } catch (error) {
    console.log('Erro ao criar workspace:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Erro ao criar workspace. Verifique os dados enviados.'
    }, { status: 500 })
  }
}


// DELETE /api/workspaces/[id]
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.workspace.delete({
      where: { id: parseInt(params.id) },
    })
    return NextResponse.json({ message: 'Workspace deletado com sucesso' })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erro ao deletar workspace' }, { status: 500 })
  }
}