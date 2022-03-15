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

        const app = load({ server })

        server.listen(process.env.HTTP_PORT, () => {
            console.log(`
            LISTENING ON 
               ${process.env.HTTP_PORT}
              
=========  SERVER STARTED  =========
\n\n`)
        })
    } catch (error) {
        console.log('\n\n=========== 💥  TERROR 💥  ============\n\n')
    }
}

void boot() // API is started here