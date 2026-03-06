import amqp from "amqplib"
import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config()

export const startSendOtpConsumer =async()=>{
    try {
        const connection = await amqp.connect({
            protocol:"amqp",
            hostname:process.env.Rabbitmq_Host,
            port:5672,
            username: process.env.Rabbitmq_Username,
            password:process.env.Rabbitmq_Password
        }
        )
        const channel = await connection.createChannel()

        await channel.assertQueue("send-otp" , {durable:true} )
        console.log("mail service consumer started , listening for otp emails")
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        })

        await channel.consume("send-otp", async (msg) => {
            if (msg) {
                const content = JSON.parse(msg.content.toString())
                console.log(content)
                try {
                    await transporter.sendMail({
                        from:"chat app",
                        to: content.email,
                        subject: "Your OTP",
                        text: `Your OTP is: ${content.otp}`
                    })
                    console.log(`otp sent to ${content.email}`)
                    channel.ack(msg)
                } catch (error) {
                    console.error("Failed to send otp:", error)
                    channel.nack(msg, false, false)
                }
            }
        })
    } catch (error) {
        console.error("Failed to start rabbitmq consumer ", error)
    }
}