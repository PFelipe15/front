import { prisma } from "@/lib/utils";
import { PerfilType } from "@prisma/client";
import { compareSync } from "bcryptjs";
  
 
type UserAuth = {
    name: string;
    email: string;
    type: PerfilType;
}

 



export default async function UserAuthByCredentials(email: string, password: string): Promise<UserAuth | null>{

    //busca o usuario no banco de dados
    const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    })

    //se o usuario nao existe, retorna null
    if(!user) return null

    //compara a senha do usuario com a senha do banco de dados
    const passwordMatch =  compareSync(password, user.password)

    //se a senha nao corresponde, retorna null
    if(!passwordMatch) return null


     //se a senha corresponde, retorna o usuario
    return {
        name: user.name,
        email: user.email,
        type: user.type,
     }

     
 
}



