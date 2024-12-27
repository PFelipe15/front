// src/app/api/services/route.ts
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/services
export async function GET() {
  try {
    const services = await prisma.service.findMany()
    return NextResponse.json(services)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erro ao buscar serviços' }, { status: 500 })
  }
}

// POST /api/services
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const service = await prisma.service.create({
      data: {
        nome: body.nome,
        orcamento: body.orcamento,
        categoria: body.categoria,
        dataInicio: new Date(body.dataInicio),
        dataFim: new Date(body.dataFim),
        status: body.status,
        ultimaAtualizacao: new Date(body.ultimaAtualizacao),
        observacoes: body.observacoes,
        teamId: body.teamId,
        projetoId: body.projetoId,
      },
    })
     
    return NextResponse.json(service)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erro ao criar serviço' }, { status: 500 })
  }
}

 

