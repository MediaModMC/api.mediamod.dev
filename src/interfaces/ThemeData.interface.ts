export interface ThemeData {
    version: string
    name: string
    colors: ThemeColors
}

export interface ThemeColors {
    background: string
    text: string
    progress_bar: string
    progress_bar_text: string
    progress_bar_background: string
}
