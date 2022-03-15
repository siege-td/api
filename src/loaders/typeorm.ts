import { ConnectionOptions, createConnection } from "typeorm"
import dotenv from 'dotenv'
import models from '../models'

export default async () => {
    dotenv.config()

    const typeormConfig: ConnectionOptions = {
        type: 'postgres',
        host: process.env.DB_HOST,
        port: Number.parseInt(process.env.DB_PORT!),
        database: process.env.POSTGRES_DB,
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        synchronize: true,
        entities: models 
    }

    const connection = await createConnection(typeormConfig)

    return connection
}