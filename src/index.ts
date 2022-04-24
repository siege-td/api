import dotenv from 'dotenv'
import express from 'express'
import { load } from './loaders'

dotenv.config()

/**
 * This is where the magic starts
 */
async function boot() {
    try {
        const server = express()

        await load({ server })

        server.listen(process.env.HTTP_PORT)
        console.log(`Listening on 8080`)
        console.log('\n========== SERVER STARTED ===========\n')
    } catch (error) {
        console.log('\n=========== 💥  TERROR 💥  ============\n')
    }

}

void boot() // API is started here