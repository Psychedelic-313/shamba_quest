import type { SupabaseClient } from "@supabase/supabase-js"

// --------------------
// Types
// --------------------

interface BadgeThreshold {
    name: string
    xpRequirement: number
}

interface UserBadge {
    badges: {
        name: string
    }
}

interface BadgeRecord {
    id: string
    name: string
    xp_requirement: number
}

// --------------------
// Badge thresholds (local XP milestones)
// --------------------

const BADGE_THRESHOLDS: BadgeThreshold[] = [
    { name: "Seedling", xpRequirement: 0 },
    { name: "Sprout", xpRequirement: 50 },
    { name: "Growing Strong", xpRequirement: 100 },
    { name: "Climate Champion", xpRequirement: 250 },
    { name: "Farming Expert", xpRequirement: 500 },
]

// --------------------
// Award Eligible Badges
// --------------------

export async function awardEligibleBadges(
    supabase: SupabaseClient,
    userId: string,
    newTotalXP: number
): Promise<string[]> {
    const newBadges: string[] = []

    // Fetch user's current badges (join to badges table)
    const { data: currentBadges, error: currentBadgesError } = await supabase
        .from("user_badges")
        .select("badges(name)")
        .eq("user_id", userId)
        .returns<UserBadge[]>()

    if (currentBadgesError) {
        console.error("Error fetching current badges:", currentBadgesError.message)
        return []
    }

    const earnedBadgeNames = currentBadges?.map((ub) => ub.badges.name) || []

    // Fetch all badge metadata
    const { data: badgeList, error: badgeError } = await supabase
        .from("badges")
        .select("id, name, xp_requirement")
        .returns<BadgeRecord[]>()

    if (badgeError || !badgeList) {
        console.error("Error fetching badges:", badgeError?.message)
        return []
    }

    // Check thresholds and award new ones
    for (const badge of BADGE_THRESHOLDS) {
        if (newTotalXP >= badge.xpRequirement && !earnedBadgeNames.includes(badge.name)) {
            const badgeData = badgeList.find((b) => b.name === badge.name)
            if (!badgeData) continue

            const { error: insertError } = await supabase.from("user_badges").insert({
                user_id: userId,
                badge_id: badgeData.id,
            })

            if (insertError) {
                console.error(`Error inserting badge ${badge.name}:`, insertError.message)
                continue
            }

            newBadges.push(badge.name)
        }
    }

    return newBadges
}

// --------------------
// Level & XP Utilities
// --------------------

const XP_PER_LEVEL = 100

export function calculateLevel(totalXP: number): number {
    return Math.floor(totalXP / XP_PER_LEVEL) + 1
}

export function getXPForNextLevel(currentLevel: number): number {
    return currentLevel * XP_PER_LEVEL
}

export function getLevelProgress(totalXP: number): number {
    const xpInCurrentLevel = totalXP % XP_PER_LEVEL
    return (xpInCurrentLevel / XP_PER_LEVEL) * 100
}
