"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Sprout } from "lucide-react"

const experienceLevels = [
    {
        value: "beginner",
        label: "Beginner",
        description: "New to farming or climate-smart practices"
    },
    {
        value: "intermediate",
        label: "Intermediate",
        description: "Some farming experience"
    },
    {
        value: "advanced",
        label: "Advanced",
        description: "Experienced farmer looking to learn more"
    },
]

const interestOptions = [
    {
        id: "soil",
        label: "Soil Management"
    },
    {
        id: "water",
        label: "Water Conservation"
    },
    {
        id: "climate",
        label: "Climate Adaptation"
    },
    {
        id: "crops",
        label: "Crop Selection"
    },
    {
        id: "pests",
        label: "Pest Management"
    },
    {
        id: "sustainability",
        label: "Sustainable Practices"
    },
]

export default function OnboardingPage() {
    const [experienceLevel, setExperienceLevel] = useState("beginner")
    const [interests, setInterests] = useState<string[]>([])
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleInterestToggle = (interestId: string) => {
        setInterests((prev) => (prev.includes(interestId) ? prev.filter((id) => id !== interestId) : [...prev, interestId]))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        const supabase = createClient()

        try {
            // Get current user
            const {
                data: { user },
            } = await supabase.auth.getUser()
            if (!user) throw new Error("Not authenticated")

            // Update profile with onboarding data
            const { error: updateError } = await supabase
                .from("profiles")
                .update({
                    experience_level: experienceLevel,
                    interests: interests,
                })
                .eq("id", user.id)

            if (updateError) throw updateError

            router.push("/dashboard")
            router.refresh()
        } catch (error: unknown) {
            setError(error instanceof Error ? error.message : "An error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen w-full items-center justify-center p-6 bg-gradient-to-b from-background to-muted">
            <div className="w-full max-w-2xl">
                <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Sprout className="h-8 w-8 text-primary" />
                        <h1 className="text-2xl font-bold">ShambaQuest</h1>
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">Welcome to ShambaQuest!</CardTitle>
                            <CardDescription>Let&apos;s personalize your learning experience</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit}>
                                <div className="flex flex-col gap-8">
                                    {/* Experience Level */}
                                    <div className="grid gap-4">
                                        <Label className="text-lg font-semibold">What&apos;s your farming experience level?</Label>
                                        <RadioGroup value={experienceLevel} onValueChange={setExperienceLevel}>
                                            {experienceLevels.map((level) => (
                                                <div key={level.value} className="flex items-start space-x-3 space-y-0">
                                                    <RadioGroupItem value={level.value} id={level.value} />
                                                    <div className="flex flex-col gap-1">
                                                        <Label htmlFor={level.value} className="font-medium cursor-pointer">
                                                            {level.label}
                                                        </Label>
                                                        <p className="text-sm text-muted-foreground">{level.description}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </RadioGroup>
                                    </div>

                                    {/* Interests */}
                                    <div className="grid gap-4">
                                        <Label className="text-lg font-semibold">What topics interest you? (Select all that apply)</Label>
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            {interestOptions.map((interest) => (
                                                <div key={interest.id} className="flex items-center space-x-3">
                                                    <Checkbox
                                                        id={interest.id}
                                                        checked={interests.includes(interest.id)}
                                                        onCheckedChange={() => handleInterestToggle(interest.id)}
                                                    />
                                                    <Label htmlFor={interest.id} className="font-normal cursor-pointer">
                                                        {interest.label}
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}

                                    <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                                        {isLoading ? "Setting up your profile..." : "Start Learning"}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
