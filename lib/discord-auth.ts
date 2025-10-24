// Discord OAuth configuration
const DISCORD_CLIENT_ID = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID || "YOUR_DISCORD_CLIENT_ID"
const DISCORD_REDIRECT_URI = process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI || "https://bitbee.app/auth/discord/callback"
const DISCORD_GUILD_ID = process.env.NEXT_PUBLIC_DISCORD_GUILD_ID || "YOUR_DISCORD_GUILD_ID"

export interface DiscordUser {
  id: string
  username: string
  discriminator: string
  avatar: string
  verified: boolean
  email: string
}

export interface DiscordGuildMember {
  user: DiscordUser
  nick: string | null
  roles: string[]
  joined_at: string
}

// Generate Discord OAuth URL
export function getDiscordAuthUrl(): string {
  const params = new URLSearchParams({
    client_id: DISCORD_CLIENT_ID,
    redirect_uri: DISCORD_REDIRECT_URI,
    response_type: "code",
    scope: "identify guilds.join guilds.members.read",
  })

  return `https://discord.com/api/oauth2/authorize?${params.toString()}`
}

// Exchange authorization code for access token
export async function exchangeCodeForToken(code: string): Promise<string> {
  const response = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: DISCORD_CLIENT_ID,
      client_secret: process.env.DISCORD_CLIENT_SECRET || "",
      grant_type: "authorization_code",
      code,
      redirect_uri: DISCORD_REDIRECT_URI,
    }),
  })

  const data = await response.json()
  return data.access_token
}

// Get Discord user information
export async function getDiscordUser(accessToken: string): Promise<DiscordUser> {
  const response = await fetch("https://discord.com/api/users/@me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  return response.json()
}

// Check if user is member of the guild
export async function checkGuildMembership(accessToken: string): Promise<boolean> {
  try {
    const response = await fetch(`https://discord.com/api/users/@me/guilds/${DISCORD_GUILD_ID}/member`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    return response.ok
  } catch (error) {
    console.error("Error checking guild membership:", error)
    return false
  }
}

// Verify Discord task completion
export async function verifyDiscordTask(userId: string): Promise<boolean> {
  try {
    // Get stored Discord access token for this user
    const accessToken = localStorage.getItem(`discord_token_${userId}`)

    if (!accessToken) {
      return false
    }

    // Check if user is still a member of the guild
    const isMember = await checkGuildMembership(accessToken)

    return isMember
  } catch (error) {
    console.error("Error verifying Discord task:", error)
    return false
  }
}
