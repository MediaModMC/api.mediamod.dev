import { ThemeModel } from "../../../../database/themes/themes.model"

export async function themesListRoute() {
    const themes = await ThemeModel.find().exec()
    return {
        ok: true,
        themes: themes.map((it) => ({
            id: it._id,
            name: it.name,
            author: it.author,
            upload_date: it.upload_date,
            colors: it.colors
        }))
    }
}
