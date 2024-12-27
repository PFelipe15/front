import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { PrismaClient } from '@prisma/client'


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// Formata valor monetário
export function formatCurrency(value: number | string): string {
  if (!value && value !== 0) return ""
  
  const numericValue = typeof value === "string" ? parseFloat(value) : value
  
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(numericValue)
} 



 

export const prisma = new PrismaClient()
