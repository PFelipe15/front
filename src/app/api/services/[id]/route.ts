import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/utils"

export async function PATCH(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const id = context.params.id
    const body = await request.json()

    if (!body) {
      return NextResponse.json(
        { error: "Dados inválidos" },
        { status: 400 }
      )
    }

    const service = await prisma.service.update({
      where: {
        id: Number(id)
      },
      data: {
        nome: body.nome,
        status: body.status,
        
        categoria: body.categoria,
        orcamento: Number(body.orcamento),
        observacoes: body.observacoes,
        teamId: Number(body.teamId),
        dataFim: new Date(body.dataFim),
        ultimaAtualizacao: new Date(),
      },
    })
    
    return NextResponse.json(service)
  } catch (error) {
    console.error('Erro ao atualizar serviço:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar serviço' }, 
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const id = context.params.id

    await prisma.service.delete({ 
      where: { 
        id: Number(id) 
      } 
    })

    return NextResponse.json({ 
      message: 'Serviço deletado com sucesso' 
    })
  } catch (error) {
    console.error('Erro ao deletar serviço:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar serviço' }, 
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
