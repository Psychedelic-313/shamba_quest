"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader, Sprout } from "lucide-react"

export default function SignUpPage() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [displayName, setDisplayName] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const router = useRouter()

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        const supabase = createClient()
        setIsLoading(true)
        setError(null)

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/onboarding`,
                    data: {
                        display_name: displayName,
                    },
                },
            })
            if (error) throw error
            router.push("/auth/check-email")
        } catch (error: unknown) {
            setError(error instanceof Error ? error.message : "An error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen w-full items-center justify-center p-6 bg-gradient-to-b from-background to-muted">
            <div className="w-full max-w-md">
                <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Sprout className="h-8 w-8 text-primary" />
                        <h1 className="text-2xl font-bold">ShambaQuest</h1>
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">Create Account</CardTitle>
                            <CardDescription>Start your climate-smart farming journey today</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSignUp}>
                                <div className="flex flex-col gap-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="displayName">Display Name</Label>
                                        <Input
                                            id="displayName"
                                            type="text"
                                            placeholder="Your name"
                                            required
                                            value={displayName}
                                            onChange={(e) => setDisplayName(e.target.value)}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="farmer@example.com"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            required
                                            minLength={6}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <p className="text-xs text-muted-foreground">Must be at least 6 characters</p>
                                    </div>
                                    {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}
                                    <Button type="submit" className="w-full " disabled={isLoading}>
                                        {isLoading ? (<Loader className="animate-spin" />) : "Sign Up"}
                                    </Button>
                                </div>
                                <div className="mt-4 text-center text-sm">
                                    Already have an account?{" "}
                                    <Link href="/auth/login" className="underline underline-offset-4 text-primary font-medium">
                                        Login
                                    </Link>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
