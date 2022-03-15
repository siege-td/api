import { Connection } from "typeorm";
import { Application } from 'express'
import expressLoader from './express'
import typeOrmLoader from './typeorm'
import websocketLoader from './websocket'

let database!: Connection

let loaded = false

export const load = async ({ server }: { server: Application}) => {
    if (loaded) {
        throw new Error('Application already loaded...')
    }

    console.log('--- loading express ---')
    const loadedExpress = await expressLoader({ server })
    console.log('--- EXPRESS LOADED ---')

    console.log('--- loading typeORM ---')
    const loadedTypeOrm = await typeOrmLoader()
    console.log('--- TYPEORM LOADED ---')

    database = loadedTypeOrm

    console.log('--- loading websockets ---')
    const websocket = websocketLoader(loadedExpress)
    console.log('--- WEBSOCKETS LOADED ---')

    loaded = true

    return { loadedExpress, loadedTypeOrm }
}

export { database }