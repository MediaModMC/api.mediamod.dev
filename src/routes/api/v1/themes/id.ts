import { FastifyRequest } from "fastify"
import prisma from "../../../../util/prisma"

type Params = {
    id: string
}

export async function themesIdRoute(request: FastifyRequest<{ Params: Params }>) {
    const theme = await prisma.theme.findFirst({
        where: { id: request.params.id },
        include: {
            author: {
                select: {
                    name: true,
                    id: true
                }
            },
            colors: {
                select: {
                    background: true,
                    progress_bar: true,
                    progress_bar_background: true,
                    progress_bar_text: true,
                    text: true
                }
            }
        }
    })

    if (!theme) return { ok: false, message: "Unknown theme!" }
    return {
        ok: true,
        theme
    }
}
