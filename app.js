import dotenv from "dotenv"
import express from "express"
import nodemailer from "nodemailer"
import winston from "winston"


dotenv.config({
    path:'.env'
})
const app = express()

const logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
    ]
})


const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    port: 465,
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS 
    }

})

app.post('/send-mail', (req, res)=>{
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.RECEIVER_MAIL,
        subject: "Nodejs mail testing",
        text: "Hello"
    }

    transporter.sendMail(mailOptions, (error, info)=>{
        if (error){
            logger.error(`Error occurred ${error.message}`)
            return res.status(500).send("Internal server error")
        }

        logger.info('Email sent successfully!')
        res.status(200).send('Email sent successfully!')
    })
})

app.listen(process.env.PORT || 8000, ()=>{
    logger.info(`Server is running on port ${process.env.PORT}`);
})


process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received. Shutting down gracefully.');
    process.exit(0);
});
























// level: 'info',
// 



// format: winston.format.json(),






// transports: [
//     new winston.transports.File({ filename: 'error.log', level: 'error' }),
//     new winston.transports.File({ filename: 'combined.log' }),
// ],


// filename: Specifies the file to which log messages are written. In this case, errors will be logged to error.log.
// level: Sets the logging level for this transport. Here, only error level messages will be logged to this file. Messages with a level lower than error (e.g., info, warn) will not be written to this file.



//filename: Specifies the file to which log messages are written. In this case, it logs to combined.log.

// No level Specified: Since no level is specified, this transport will log messages at all levels (e.g., info, warn, error).

