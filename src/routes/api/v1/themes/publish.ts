import { FastifyRequest } from "fastify"
import { sessionHasJoined } from "../../../../lib/mojang"
import { getServerIdHash } from "../../../../lib/hash"

interface PublishQuery {
    username: string
    sharedSecret: string

    // TODO: Theme data
}

export async function themesPublishRoute(request: FastifyRequest<{ Body: PublishQuery }>) {
    const serverIdHash = getServerIdHash(request.body.sharedSecret)
    const result = await sessionHasJoined(request.body.username, serverIdHash)

    if (!result.ok) {
        return { ok: false, message: result.error }
    }

    return { ok: true }
}
