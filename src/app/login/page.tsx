'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import Link from 'next/link'
import Logo from '@/components/Logo'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Lógica de autenticação aqui
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Login realizado com sucesso!')
      router.push('/')
    } catch (error) {
      toast.error('Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a2b42] via-[#2a3b52] to-[#4F46E5] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card de Login */}
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          {/* Logo e Cabeçalho */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <Logo width={200} height={70} />
            </div>
            <p className="text-gray-600 mt-3">Entre na sua conta para acessar o dashboard</p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                className="w-full h-11 bg-white/80 border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5]"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Senha
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  className="w-full h-11 bg-white/80 border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5] pr-10"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#4F46E5]"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Link Esqueceu a senha */}
            <div className="text-right">
              <Link 
                href="/forgot-password"
                className="text-sm text-[#4F46E5] hover:text-[#6366F1] hover:underline"
              >
                Esqueceu sua senha?
              </Link>
            </div>

            {/* Botão de Login */}
            <Button 
              type="submit" 
              className="w-full h-11 bg-[#4F46E5] hover:bg-[#6366F1] text-white rounded-lg font-medium transition-colors"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Entrando...</span>
                </div>
              ) : (
                "Entrar"
              )}
            </Button>

            {/* Link para Cadastro */}
            <div className="text-center text-sm text-gray-600">
              Não tem uma conta?{' '}
              <Link 
                href="/signup"
                className="text-[#4F46E5] hover:text-[#6366F1] hover:underline font-medium"
              >
                Cadastre-se
              </Link>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-white/80">
          <p>© 2024 BuildHub. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  )
}

