import { FastifyRequest } from "fastify"
import prisma from "../../../../util/prisma"

type Params = {
    uuid: string
}

export async function banRoute(request: FastifyRequest<{ Params: Params }>) {
    // TODO: Authentication
    await prisma.user.update({ where: { id: request.params.uuid }, data: { banned: false } })
    return { ok: true }
}
