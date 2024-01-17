import cluster from 'cluster'
import express from 'express'
import { cpus } from 'os'
import { logger } from './config/logger.js'

const app = express()

if(cluster.isPrimary)
{
    logger.info(`Proceso principal: ${process.pid}`)
    for (let index = 0; index < 1/*cpus().length*/; index++) 
        cluster.fork()
    
    cluster.on('exit', (worker)=>{
        logger.info(`Proceso worker ha terminado ${worker.process.pid}`)
        cluster.fork()
    })

}
else {
    app.get('/simple', ['PUBLIC'], async (req,res) => {
        let sum = 0
        for (let index = 0; index < 1000000; index++) {
            sum += index
        }
        res.sendSuccess(`La suma simple es ${sum}`)
    })

    app.get('/compleja', ['PUBLIC'], async (req,res) => {
        let sum = 0
        for (let index = 0; index < 5e8; index++) {
            sum += index
        }
        res.sendSuccess(`La suma compleja es ${sum}`)
    })

    app.listen(8080, () => {
        logger.info(`Escuchando al puerto 8080, Proceso worker: ${process.pid}`)
    })
}