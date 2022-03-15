import { json, Application} from 'express'

export default ({ server }: { server: Application}) => {
    server.use(json())

    return server
}