"use server";

 import { signIn } from "../../../../auth";

export default async function loginAction( _prevState: any, formData: FormData) {
  try {
    await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirect: false
      
    });

 
    return {
      message: "Login realizado com sucesso",
      sucess: true,
    };
  } catch (error) {
    if (error instanceof Error && "type" in error && error.type === "CredentialsSignin") {
      return {
        message: "Email ou senha incorretos",
        sucess: false,
      };
    }

    console.log(error)

    return {
      message: "Ops. Ocorreu um erro ao fazer login",
      sucess: false,
    };
  }
}
