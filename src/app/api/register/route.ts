import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/utils"
import bcrypt from "bcryptjs"
import { signOut } from "next-auth/react"

export async function POST(request: NextRequest) {
  try {
    const { nome, email, password, cargo, registro } = await request.json()

    // Verifica se o usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Email já cadastrado" },
        { status: 400 }
      )
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10)

    // Cria o usuário
    const user = await prisma.user.create({
      data: {
        nome,
        email,
        password: hashedPassword,
        cargo,
        registro
      }
    })

    // Remove a senha do objeto retornado
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Erro ao criar usuário" },
      { status: 500 }
    )
  }
}

// Em algum evento/função
await signOut() 