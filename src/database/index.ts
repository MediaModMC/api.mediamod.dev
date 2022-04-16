import mongoose from "mongoose"
import config from "../util/config"

let connection: mongoose.Connection

async function connect() {
    if (connection) return

    mongoose.connect(config.database.uri, {})
    connection = mongoose.connection

    connection.once("open", async () => {
        console.log("Connected to database!")
    })

    connection.on("error", () => {
        console.log("Error connecting to database")
    })
}

async function disconnect() {
    if (!connection) return
    await mongoose.disconnect()
}

const database = { connect, disconnect }
export default database
