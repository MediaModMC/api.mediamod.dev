import { model } from "mongoose"
import { ITheme, IThemeModel } from "./themes.types"
import ThemeSchema from "./themes.schema"

export const ThemeModel = model<ITheme, IThemeModel>("theme", ThemeSchema)
