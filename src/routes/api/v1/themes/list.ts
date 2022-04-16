import { FastifyRequest } from "fastify"

export async function themesListRoute(request: FastifyRequest) {
    return { ok: true }
}
