import { ThemeModel } from "../../../../database/themes/themes.model"
import { FastifyRequest } from "fastify"

type Params = {
    id: string
}

export async function themesIdRoute(request: FastifyRequest<{ Params: Params }>) {
    const theme = await ThemeModel.findById(request.params.id).exec()
    if (!theme) return { ok: false, message: "Unknown theme!" }

    return {
        ok: true,
        theme: {
            name: theme.name,
            colors: theme.colors
        }
    }
}
