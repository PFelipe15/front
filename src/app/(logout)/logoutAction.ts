'use server'
import { signOut } from "../../../auth";

export default async function LogoutAction() {
    await signOut()
  }
  