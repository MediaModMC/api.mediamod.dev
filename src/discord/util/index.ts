import { Theme, User } from "@prisma/client"
import { BaseCommandInteraction, ButtonInteraction } from "discord.js"
import { ThemeColors } from "../../interfaces/ThemeData.interface"

export type DatabaseUserWithThemes = User & { themes: Theme[] }
export type DatabaseThemeWithAuthorAndColors = Theme & { author: User; colors: ThemeColors }
export type MessageBasedInteraction = ButtonInteraction | BaseCommandInteraction
