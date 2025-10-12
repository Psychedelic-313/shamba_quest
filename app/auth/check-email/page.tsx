import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Mail, Sprout } from "lucide-react"

export default function CheckEmailPage() {
    return (
        <div className="flex min-h-screen w-full items-center justify-center p-6 bg-gradient-to-b from-green-50 to-muted">
            <div className="w-full max-w-md">
                <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Sprout className="h-8 w-8 text-primary" />
                        <h1 className="text-2xl font-bold">ShambaQuest</h1>
                    </div>
                    <Card>
                        <CardHeader>
                            <div className="flex justify-center mb-4">
                                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Mail className="h-8 w-8 text-primary" />
                                </div>
                            </div>
                            <CardTitle className="text-2xl text-center">Check Your Email</CardTitle>
                            <CardDescription className="text-center">
                                We&apos;ve sent you a confirmation link. Please check your email to verify your account and complete
                                your registration.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <p className="text-sm text-muted-foreground text-center">
                                After confirming your email, you&apos;ll be redirected to complete your profile setup.
                            </p>
                            <Button asChild variant="outline" className="w-full bg-transparent">
                                <Link href="/auth/login">Back to Login</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
