import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/utils"

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string, documentoId: string } }
) {
  try {
    const { documentoId } = params

    await prisma.documento.delete({
      where: { id: Number(documentoId) }
    })

    return NextResponse.json({ message: 'Documento excluído com sucesso' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao excluir documento' },
      { status: 500 }
    )
  }
} 