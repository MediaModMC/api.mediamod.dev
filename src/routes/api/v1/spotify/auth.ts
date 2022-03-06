import { FastifyRequest } from "fastify"
import { authorize } from "../../../util/spotify"

interface AuthQuery {
    code: string
}

export async function spotifyAuthRoute(request: FastifyRequest<{ Body: AuthQuery }>) {
    const { code } = request.body
    const result = await authorize(code)

    if (result.ok) {
        return result.value
    } else {
        return { "message": result.error.error_description }
    }
}