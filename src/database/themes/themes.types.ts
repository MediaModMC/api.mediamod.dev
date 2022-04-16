import { ThemeColors } from "../../interfaces/ThemeData.interface"
import { Document, Model } from "mongoose"

export interface ITheme {
    name: string
    author: string
    upload_date: Date
    colors: ThemeColors
}

export interface IThemeDocument extends ITheme, Document {}

export interface IThemeModel extends Model<IThemeDocument> {}
