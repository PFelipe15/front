 
import Logo from '@/components/Logo'
import RegisterForm from './_components/register-form'
import { redirect } from 'next/navigation'
import { auth } from '../../../auth'
  
 
export default async function RegisterPage() {
  const session = await auth()
  if(session) {
    return redirect('/dashboard')
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a2b42] via-[#2a3b52] to-[#4F46E5] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card de Register */}
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          {/* Logo e Cabeçalho */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
                <Logo width={200} height={70} />
              </div>
              <p className="text-gray-600 mt-3">Registre-se para acessar o dashboard</p>
            </div>

          <RegisterForm />
         
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-white/80">
          <p>© 2024 BuildHub. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  )
}

