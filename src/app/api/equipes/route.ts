import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/utils"

export async function GET() {
    try {
        const equipes = await prisma.team.findMany({
            include: {
                servicos: true
            }
        })
        return NextResponse.json(equipes)
    } catch (error) {
        console.error('Erro detalhado:', error)
        return NextResponse.json({ error: "Erro ao buscar equipes" }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const { nome, representante, quantidade } = await request.json()
        
        const equipe = await prisma.team.create({
            data: {
                nome,
                representante,
                quantidade
            }
        })
        
        return NextResponse.json(equipe)
    } catch (error) {
        console.error('Erro detalhado:', error)
        return NextResponse.json({ error: "Erro ao criar equipe" }, { status: 500 })
    }
}
