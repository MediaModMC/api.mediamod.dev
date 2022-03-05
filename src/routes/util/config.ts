import "dotenv/config"

const environment = {
    spotify: {
        id: process.env.SPOTIFY_CLIENT_ID as string,
        secret: process.env.SPOTIFY_CLIENT_SECRET as string,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI as string
    }
}

export default environment