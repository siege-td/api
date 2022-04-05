import { Application } from "express";
import http from 'http';
import { Server, Socket } from "socket.io";

interface IGameData {
    playerName: string
    hitpoints: number
    currency: number
}

export default async (expressApp: Application) => {
    const httpServer = http.createServer(expressApp)

    const socketServer = new Server(httpServer, {
        cors: { origin: '*' }
    })

    const socketRooms: Map<number, string | string[]> = new Map()
    const gameSessionsData: Map<number, IGameData[] | undefined> = new Map()

    socketServer.on('connection', (socketConnection: Socket) => {
        console.log(`Socket: ${socketConnection.id} connected`)

        socketConnection.on('new_lobby', (newPin: number) => {
            const roomName = `room${socketRooms.size}`
            socketConnection.join(roomName)

            socketRooms.set(newPin, roomName)
            gameSessionsData.set(newPin, [{
                playerName: socketConnection.id,
                hitpoints: 100,
                currency: 0
            }])
        })

        socketConnection.on('join_lobby', (pin: number) => {
            socketConnection.join(socketRooms.get(pin)!)
            const currentData = gameSessionsData.get(pin)
            
            currentData?.push({playerName: socketConnection.id,
                hitpoints: 100,
                currency: 0}
            )
            
            gameSessionsData.set(pin, currentData!)
        })

        socketConnection.on('close_lobby', (pin: number) => {
            // Close socket room
            socketServer.in(socketRooms.get(pin)!).disconnectSockets(true)
            socketRooms.delete(pin)
            gameSessionsData.delete(pin)
        })

        socketConnection.on('update_game_data', (
            {
                pin, 
                playerName, 
                hitpoints, 
                currency
            }: {
                pin: number, 
                playerName: string, 
                hitpoints: number, 
                currency: number
            }) => {
            // First, check if room exists
            if (!socketRooms.get(pin)) {
                socketConnection.emit("error", { message: "Pin invalid" })
                return
            }
            // If exists, update data and emit
            const tempData = gameSessionsData.get(pin)

            if (tempData?.length === 1) {
                tempData[0] = { playerName, hitpoints, currency }
                gameSessionsData.set(pin, tempData)
            } else if (tempData !== undefined && tempData.length > 1) {
                for (let i = 0; i < tempData.length; i++) {
                    if (playerName === tempData[i].playerName) {
                        tempData[i] = { playerName, hitpoints, currency }
                        gameSessionsData.set(pin, tempData)
                    }
                }
            }
            console.log(gameSessionsData.get(pin))
            socketConnection.to(socketRooms.get(pin)!).emit("updated_data", gameSessionsData.get(pin!))
        })
    })

    httpServer.listen(process.env.WS_PORT)
}