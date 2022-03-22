import { Application } from "express";
import http from 'http'
import { Server, Socket } from "socket.io";


export default async (expressApp: Application) => {
    const httpServer = http.createServer(expressApp)

    const socketServer = new Server(httpServer, {
        cors: { origin: '*' }
    })

    const socketRooms: Map<number, string | string[]> = new Map()

    socketServer.on('connection', (socketConnection: Socket) => {
        console.log(`Socket: ${socketConnection.id} connected`)

        socketConnection.on('new_lobby', (newPin: number) => {
            const roomName = `room${socketRooms.size}`
            socketConnection.join(roomName)
            socketRooms.set(newPin, roomName)
        })

        socketConnection.on('join_lobby', (pin: number) => {
            socketConnection.join(socketRooms.get(pin)!)
        })

        socketConnection.on('close_lobby', (pin: number) => {
            // Close socket room
            socketServer.in(socketRooms.get(pin)!).disconnectSockets(true)
            socketRooms.delete(pin)
        })
    })

    httpServer.listen(process.env.WS_PORT)
}