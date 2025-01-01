import { NextRequest, NextResponse } from "next/server"
import { auth } from "./auth"

export default async function middleware(req: NextRequest) {
    const session = await auth()
    console.log('passow rota')
    if(!session) {
        return NextResponse.redirect(new URL('/login', req.url))
    }
}


