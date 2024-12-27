'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Team = {
  id: number
  nome: string
  representante: string
  quantidade: number
}

export default function EquipesPage() {
  const [equipes, setEquipes] = useState<Team[]>([])
  const [novaEquipe, setNovaEquipe] = useState({
    nome: '',
    representante: '',
    quantidade: 0
  })

  useEffect(() => {
    fetchEquipes()
  }, [])

  const fetchEquipes = async () => {
    try {
      const response = await fetch('/api/equipes')
      const data = await response.json()
      setEquipes(data)
    } catch (error) {
      console.error('Erro ao carregar equipes:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/equipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(novaEquipe),
      })
      if (response.ok) {
        fetchEquipes()
        setNovaEquipe({
          nome: '',
          representante: '',
          quantidade: 0
        })
      }
    } catch (error) {
      console.error('Erro ao criar equipe:', error)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Gerenciamento de Equipes</h1>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Nova Equipe</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Nova Equipe</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="nome">Nome da Equipe</Label>
                    <Input
                      id="nome"
                      value={novaEquipe.nome}
                      onChange={(e) => setNovaEquipe({...novaEquipe, nome: e.target.value})}
                      placeholder="Ex: Pedreiros"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="representante">Representante</Label>
                    <Input
                      id="representante"
                      value={novaEquipe.representante}
                      onChange={(e) => setNovaEquipe({...novaEquipe, representante: e.target.value})}
                      placeholder="Nome do representante"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="quantidade">Quantidade de Membros</Label>
                    <Input
                      id="quantidade"
                      type="number"
                      value={novaEquipe.quantidade}
                      onChange={(e) => setNovaEquipe({...novaEquipe, quantidade: parseInt(e.target.value)})}
                      required
                      min="1"
                    />
                  </div>
                  <Button type="submit">Salvar</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome da Equipe</TableHead>
                <TableHead>Representante</TableHead>
                <TableHead>Quantidade de Membros</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {equipes.map((equipe) => (
                <TableRow key={equipe.id}>
                  <TableCell>{equipe.nome}</TableCell>
                  <TableCell>{equipe.representante}</TableCell>
                  <TableCell>{equipe.quantidade}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" className="mr-2">
                      Editar
                    </Button>
                    <Button variant="destructive" size="sm">
                      Excluir
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
