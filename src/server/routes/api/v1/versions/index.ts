export async function modVersionsRoute() {
    // TODO: Fetch URLs from GitHub
    const url = "https://github.com/MediaModMC"
    return {
        fabric: [
            { target: "1.18.x", version: "1.0.0", url }
        ],
        forge: [
            { target: "1.8.9", version: "1.0.0", url },
            { target: "1.12.2", version: "1.0.0", url }
        ],
        browser: [
            { target: "Firefox", version: "1.0.0", url },
            { target: "Chrome", version: "1.0.0", url }
        ]
    }
}