import UserAuthByCredentials from "@/app/_models/User"
import { PerfilType } from "@prisma/client"
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [CredentialsProvider({
    credentials: {
      email: {},
      password: {},
    },
    authorize: async (credentials) => {
      const user = await UserAuthByCredentials(credentials.email as string, credentials.password as string)
      return user
    },
  })],
  callbacks: {
    //funcao para adicionar o tipo de perfil ao usuário
   
  },
})