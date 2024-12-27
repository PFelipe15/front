import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/utils"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const workspaceId = params.id

    const documentos = await prisma.documento.findMany({
      where: { workspaceId: Number(workspaceId) }
    })

    return NextResponse.json(documentos)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar documentos' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const workspaceId = params.id
    const { tipo, url } = await request.json()

    const documento = await prisma.documento.create({
      data: {
        tipo,
        url,
        workspaceId: Number(workspaceId)
      }
    })

    return NextResponse.json(documento)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao criar documento' },
      { status: 500 }
    )
  }
} 