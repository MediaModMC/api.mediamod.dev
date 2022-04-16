import { FastifyRequest } from "fastify"

interface PublishQuery {
    // TODO
}

export async function themesPublishRoute(request: FastifyRequest<{ Body: PublishQuery }>) {
    return { ok: true }
}
