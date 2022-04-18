import prisma from "../../../../util/prisma"

export async function themesListRoute() {
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
