import nodemailer from 'nodemailer';
import winston from 'winston';
import dotenv from "dotenv"

dotenv.config({
    path: '.env'
})

// Set up logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
    ],
});

// Set up nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    port: 465,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Controller function to handle feedback
export const submitFeedback = (req, res) => {
    const { name, email, feedback } = req.body;

    // Validate and process the feedback
    if (!name || !email || !feedback) {
        return res.status(400).send('All fields are required');
    }

    // Prepare email options
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email, 
        subject: 'Feedback Received',
        text: `Dear ${name},\n\nThank you for your valuable feedback. We appreciate your input and are taking it into consideration.\n\nYour feedback:\n"${feedback}"`
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            logger.error(`Error occurred: ${error.message}`);
            return res.status(500).send('Internal server error');
        }

        logger.info('Email sent successfully!');
        res.status(200).json({
            status: 'Success',
            message: 'Feedback received and email sent successfully!',
        });
    });
};