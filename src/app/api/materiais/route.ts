'use server'

import { prisma } from "@/lib/utils"
import { NextResponse } from "next/server"

export async function GET() {
    const materiais = await prisma.material.findMany()
    return NextResponse.json(materiais)
}


export async function POST(request: Request) {
    const { nome, quantidade, valor, workspaceId, fornecedorId } = await request.json()
    const materiais = await prisma.material.create({ data: { nome, quantidade, valor, workspaceId, fornecedorId } })
    return NextResponse.json(materiais)
}


