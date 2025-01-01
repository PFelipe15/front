'use client'
import Form from "next/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import loginAction from "../_actions/loginAction";
import { Loader2 } from "lucide-react";
import { useActionState, useEffect } from "react";
import { redirect } from "next/navigation";
  
export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, null)
 
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
        {state?.sucess === false && (
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
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="seu@email.com"
            className="w-full h-11 bg-white/80 border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5]"
            required
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="password"
            className="text-sm font-medium text-gray-700"
          >
            Senha
          </Label>
          <div className="relative">
            <Input
              id="password"
              type="password"
              name="password"
              placeholder="Digite sua senha"
              className="w-full h-11 bg-white/80 border-gray-200 focus:border-[#4F46E5] focus:ring-[#4F46E5] pr-10"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#4F46E5]"
            ></button>
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
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Entrar'}
        </Button>

        {/* Link para Cadastro */}
        <div className="text-center text-sm text-gray-600">
          Não tem uma conta?{" "}
          <Link
            href="/register"
            className="text-[#4F46E5] hover:text-[#6366F1] hover:underline font-medium"
          >
            Cadastre-se
          </Link>
        </div>
      </Form>
    </>
  );
}
