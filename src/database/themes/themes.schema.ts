import { Schema } from "mongoose"
import { ITheme, IThemeModel } from "./themes.types"

const ThemeSchema = new Schema<ITheme, IThemeModel>({
    name: { type: String, required: true },
    author: { type: String, required: true },
    upload_date: { type: Date, required: true },
    colors: { type: Map, required: true }
})

export default ThemeSchema
