import { FastifyReply, FastifyRequest } from "fastify"
import { authorize } from "../../../util/spotify"

interface AuthQuery {
    code: string
}

export async function spotifyAuthRoute(request: FastifyRequest<{ Querystring: AuthQuery }>, reply: FastifyReply) {
    const { code } = request.query
    const result = await authorize(code)

    if (result.ok) {
        return result.value
    } else {
        return { "description": result.error.error_description }
    }
}