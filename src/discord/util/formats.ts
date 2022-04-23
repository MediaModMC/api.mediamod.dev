export function toDiscordTimestamp(date: Date): string {
    const epoch = (date.getTime() / 1000).toFixed(0)
    return `<t:${epoch}>`
}
