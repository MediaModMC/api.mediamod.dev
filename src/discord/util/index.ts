import { Theme, User } from "@prisma/client"
import { BaseCommandInteraction, ButtonInteraction } from "discord.js"

export type DatabaseUserWithThemes = User & { themes: Theme[] }
export type MessageBasedInteraction = ButtonInteraction | BaseCommandInteraction
