import nodemailer from 'nodemailer'

const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth:{
        user: process.env.NODEMAILER_GMAIL,
        pass: process.env.NODEMAILER_PASS
    }
})

export default transport