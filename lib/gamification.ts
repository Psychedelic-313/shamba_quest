import type { SupabaseClient } from "@supabase/supabase-js"

interface BadgeCheck {
    name: string
    xpRequirement: number
}

const BADGE_THRESHOLDS: BadgeCheck[] = [
    { name: "Seedling", xpRequirement: 0 },
    { name: "Sprout", xpRequirement: 50 },
    { name: "Growing Strong", xpRequirement: 100 },
    { name: "Climate Champion", xpRequirement: 250 },
    { name: "Farming Expert", xpRequirement: 500 },
]

export async function checkAndAwardBadges(supabase: SupabaseClient, userId: string, newTotalXP: number) {
    const newBadges: string[] = []

    // Get user's current badges
    const { data: currentBadges } = await supabase.from("user_badges").select("badges(name)").eq("user_id", userId)

    const earnedBadgeNames = currentBadges?.map((ub: any) => ub.badges.name) || []

    // Check each badge threshold
    for (const badge of BADGE_THRESHOLDS) {
        if (newTotalXP >= badge.xpRequirement && !earnedBadgeNames.includes(badge.name)) {
            // Award this badge
            const { data: badgeData } = await supabase.from("badges").select("id").eq("name", badge.name).single()

            if (badgeData) {
                const { error } = await supabase.from("user_badges").insert({
                    user_id: userId,
                    badge_id: badgeData.id,
                })

                if (!error) {
                    newBadges.push(badge.name)
                }
            }
        }
    }

    return newBadges
}

export function calculateLevel(totalXP: number): number {
    return Math.floor(totalXP / 100) + 1
}

export function getXPForNextLevel(currentLevel: number): number {
    return currentLevel * 100
}

export function getLevelProgress(totalXP: number, currentLevel: number): number {
    const xpInCurrentLevel = totalXP % 100
    const xpNeededForLevel = 100
    return (xpInCurrentLevel / xpNeededForLevel) * 100
}
