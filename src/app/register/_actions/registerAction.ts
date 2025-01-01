"use server";

import { hashSync } from "bcryptjs";
import { prisma } from "@/lib/utils";
import { signIn } from "../../../../auth";

type ActionState = {
  message: string;
  sucess: boolean;
};

export default async function registerAction(
  _prevState: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  if (!email || !password) {
    return {
      message: "Email e senha são obrigatórios",
      sucess: false,
    };
  }


  const userExists = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (userExists) {
    return {
      message: "Usuário já existe",
      sucess: false,
    };
  }

  const senhaHash = hashSync(password, 10)

  await prisma.user.create({
    data: {
      name: name || `Usuário ${email}`,
      email,
      password: senhaHash,
      type: "ADMIN",
    },
  });

  await signIn("credentials", {
    email,
    password,
    redirect: false,
  });

  return {
    message: "Usuário criado com sucesso",
    sucess: true,
  };

 }
