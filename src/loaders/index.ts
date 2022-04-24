import { Connection } from "typeorm";
import { Application } from 'express'
import expressLoader from './express'
import websocketLoader from './websocket'

let loaded = false

export const load = async ({ server }: { server: Application}) => {
    if (loaded) {
        throw new Error('Application already loaded...')
    }

    console.log('--- loading express ---')
    const loadedExpress = await expressLoader({ server })
    console.log('--- EXPRESS LOADED ---')

    console.log('--- loading websockets ---')
    const websocket = websocketLoader(loadedExpress)
    console.log('--- WEBSOCKETS LOADED ---')

    loaded = true

    return { loadedExpress }
}
