"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { FileText, Upload, Trash } from "lucide-react"
import { toast } from "sonner"

interface Documento {
  id: number
  tipo: string
  url: string
}

interface DocumentosListProps {
  workspaceId: number
}

export function DocumentosList({ workspaceId }: DocumentosListProps) {
  const [documentos, setDocumentos] = useState<Documento[]>([])
 
  useEffect(() => {
    fetchDocumentos()
  }, [workspaceId])

  const fetchDocumentos = async () => {
    try {
      const response = await fetch(`/api/workspaces/${workspaceId}/documentos`)
      const data = await response.json()
      setDocumentos(data)
    } catch (error) {
      toast.error('Erro ao carregar documentos')
    }
  }

  const handleUpload = async (file: File) => {
    // Implementar lógica de upload
    // Pode usar S3, Firebase Storage, etc
  }

  const handleDelete = async (documentoId: number) => {
    if (!confirm('Deseja realmente excluir este documento?')) return

    try {
      await fetch(`/api/workspaces/${workspaceId}/documentos/${documentoId}`, {
        method: 'DELETE'
      })
      toast.success('Documento excluído com sucesso')
      fetchDocumentos()
    } catch (error) {
      toast.error('Erro ao excluir documento')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Documentos Técnicos
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Upload de Documento */}
        {(userRole === 'ENGENHEIRO' || userRole === 'ARQUITETO') && (
          <div className="mb-4">
            <Button variant="outline" className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              Upload de Documento
            </Button>
          </div>
        )}

        {/* Lista de Documentos */}
        <div className="space-y-2">
          {documentos.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-2 rounded-lg border"
            >
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-500" />
                <span>{doc.tipo}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <a href={doc.url} target="_blank" rel="noopener noreferrer">
                    Visualizar
                  </a>
                </Button>
                {(userRole === 'ENGENHEIRO' || userRole === 'ARQUITETO') && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(doc.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 