import fetch from "node-fetch"
import { SpotifyAuthenticationErrorResponse, SpotifyTokenResponse } from "../../interfaces/SpotifyResponse.interface"
import { URLSearchParams } from "url"
import config from "./config"

export type AuthorizeResult =
    | { ok: true, value: SpotifyTokenResponse }
    | { ok: false, error: SpotifyAuthenticationErrorResponse }

async function authorize(code: string): Promise<AuthorizeResult> {
    console.log(config)
    const authorization = Buffer.from(`${config.spotify.id}:${config.spotify.secret}`).toString("base64")
    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "authorization": `Basic ${authorization}`,
            "content-type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": config.spotify.redirect_uri
        }).toString()
    })

    const json = await response.json()
    if (!response.ok) {
        return { error: json as SpotifyAuthenticationErrorResponse, ok: false }
    }

    return { value: json as SpotifyTokenResponse, ok: true }
}

export { authorize }