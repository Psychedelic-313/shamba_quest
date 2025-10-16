import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (error) {
            console.error("Error exchanging code:", error.message)
            return NextResponse.redirect(
                new URL(`/auth/error?message=${encodeURIComponent(error.message)}`, request.url)
            )
        }
    }

    return NextResponse.redirect(new URL("/onboarding", request.url))
}
