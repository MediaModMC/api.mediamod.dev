import { FastifyRequest } from "fastify"
import { refresh } from "../../../../lib/spotify"

interface AuthQuery {
    refresh_token: string
}

export async function spotifyRefreshRoute(request: FastifyRequest<{ Body: AuthQuery }>) {
    const { refresh_token } = request.body
    const result = await refresh(refresh_token)

    if (result.ok) {
        return result.value
    } else {
        return { "message": result.error.error_description }
    }
}