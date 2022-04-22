import "dotenv/config"

const environment = {
    spotify: {
        id: process.env.SPOTIFY_CLIENT_ID as string,
        secret: process.env.SPOTIFY_CLIENT_SECRET as string,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI as string
    },
    port: process.env.PORT as unknown as number,
    database: {
        url: process.env.DATABASE_URL as string
    },
    discord: {
        token: process.env.DISCORD_TOKEN as string,
        admin_role: process.env.DISCORD_ADMIN_ROLE as string
    }
}

export default environment
