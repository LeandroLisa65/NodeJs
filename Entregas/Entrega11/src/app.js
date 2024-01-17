import { __dirname } from './dirname.js';
import express from 'express'
import { mongoInstance } from './config/objectConfig.js'
import { addLogger, logger } from './config/logger.js'
import cors from 'cors'
import { Server } from 'socket.io'
import { socketProduct } from './utils/socketProducts.js'
import { socketChat } from './utils/socketChat.js'
import mainRouter from './routes/index.js'
import handlebars from 'express-handlebars'
import passport from 'passport'
import { initPassport } from './config/passport.config.js'
import cookieParser from 'cookie-parser'

const app = express()
app.use(addLogger)

const PORT = process.env.PORT
const httpServer = app.listen(PORT, () => {
    logger.info('Server running on port: ' + PORT)
})

const hbs = handlebars.create({
    runtimeOptions:{
        allowProtoPropertiesByDefault: true
    }
})

app.set('views', __dirname+'/views')
app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/static', express.static(__dirname+'/public'))
app.use(cookieParser())
app.use(cors({
    
    credentials: true
}))

initPassport()
app.use(passport.initialize())

app.use(mainRouter)

const io = new Server(httpServer)
socketProduct(io)
socketChat(io)