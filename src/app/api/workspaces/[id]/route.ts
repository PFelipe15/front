'use server'
import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from '@prisma/client'


const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id

    const workspace = await prisma.workspace.findUnique({
      where: {
        id: Number(id)
      },
      include: {
        servicos: {
          include:{
            team: true
          },
          orderBy:{
            dataInicio:'desc'
          }
        },


        materiais: true,
         atualizacoes: {
          orderBy: {
            data: 'desc'
          },
          take: 5
        }
      }
    })

     if (!workspace) {
      return NextResponse.json(
        { error: "Workspace não encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json(workspace)
  } catch (error) {
    console.error('Erro ao buscar workspace:', error)
    return NextResponse.json(
      { error: "Erro ao buscar workspace" },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
)  {
  try {
    const id = (await params).id
    const body = await request.json()

    if (!body) {
      return NextResponse.json(
        { error: "Dados inválidos" },
        { status: 400 }
      )
    }

    const workspace = await prisma.workspace.update({
      where: { 
        id: Number(id) 
      },
      data: {
        nome: body.nome,
        localizacao: body.localizacao,
        gerente: body.gerente,
        orcamento: Number(body.orcamento),
        dataInicio: new Date(body.dataInicio),
        dataFim: new Date(body.dataFim)
      }
    })

    return NextResponse.json(workspace)
  } catch (error) {
    console.error('Erro ao atualizar workspace:', error)
    return NextResponse.json(
      { error: "Erro ao atualizar workspace" },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// PUT /api/workspaces/[id]
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id
    const body = await request.json()

    if (!body) {
      return NextResponse.json(
        { error: "Dados inválidos" },
        { status: 400 }
      )
    }

    const workspace = await prisma.workspace.update({
        where: { id: Number(id) },
      data: {
        nome: body.nome,
        orcamento: body.orcamento,
        gasto: body.gasto,
        progresso: body.progresso,
        localizacao: body.localizacao,
        dataInicio: new Date(body.dataInicio),
        dataFim: new Date(body.dataFim),
        gerente: body.gerente,
         riscos: body.riscos,
      },
    })
    return NextResponse.json(workspace)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erro ao atualizar workspace' }, { status: 500 })
  }
}