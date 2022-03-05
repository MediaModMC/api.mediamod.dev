export interface SpotifyTokenResponse {
    access_token: string
    refresh_token: string
    scope: string
    token_type: string
    expires_in: number
}

export interface SpotifyAuthenticationErrorResponse {
    error: string
    error_description: string
}