import prisma from "../../../../../util/prisma"

export async function themesIndexRoute() {
    const themes = await prisma.theme.findMany({
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

    return {
        ok: true,
        themes: themes
    }
}
