'use client'
import Form from "next/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useActionState, useEffect } from "react";
import registerAction from "../_actions/registerAction";
import { redirect } from "next/navigation";
   export default function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerAction, null)

  useEffect(() => {
    if (state?.sucess) {
    
     redirect('/')
    }
  }, [state?.sucess])
 
  return (
    <>
   
      {/* Formulário */}
      <Form
        action={formAction}
        className="space-y-6"
      >
        {/* Mensagem de Erro/Sucesso */}
        {state?.message && (
          <div
            className={`w-full p-3 mb-4 rounded-lg text-xs font-medium text-center ${
              state.sucess
                ? 'bg-green-100 text-green-700 border border-green-200'
                : 'bg-red-100 text-red-700 border border-red-200'
            }`}
          >
            {state.message}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="name" className="block text-sm text-gray-700">
            Nome
          </Label>
          <Input
            id="name"
            type="text"
            name="name"
            placeholder="Digite seu nome"
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="block text-sm text-gray-700">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="seu@email.com"
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="block text-sm text-gray-700">
            Senha
          </Label>
          <div className="relative">
            <Input
              id="password"
              type="password"
              name="password"
              placeholder="Digite sua senha"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
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
          disabled={isPending}
          className="w-full h-11 bg-[#4F46E5] hover:bg-[#6366F1] text-white rounded-lg font-medium transition-colors"
        >
          Registrar
        </Button>

        {/* Link para Cadastro */}
        <div className="text-center text-sm text-gray-600">
           Já tem uma conta?{" "}
          <Link
            href="/login"
            className="text-[#4F46E5] hover:text-[#6366F1] hover:underline font-medium"
          >
            Faça login
          </Link>
        </div>
      </Form>
    </>
  );
}
