import amqp from "amqplib"

let channel: amqp.Channel

export const connectRabbitMQ = async() => {
    try {
        const connection = await amqp.connect({
            protocol:"amqp",
            hostname:process.env.Rabbitmq_Host,
            port:5672,
            username: process.env.Rabbitmq_Username,
            password:process.env.Rabbitmq_Password
        });
        channel = await connection.createChannel();
        console.log("RabbitMQ connected successfully");
    } catch (error) {
        console.error("Failed to connect to RabbitMQ:", error);
        throw error;
    }
}

export const publishToQueue = async (queueName:string , message:any) =>{
    try {
        await channel.assertQueue(queueName, { durable: true });
        channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)),{
            persistent:true
        });
        console.log(`Message published to queue ${queueName}`);
    } catch (error) {
        console.error(`Failed to publish message to queue ${queueName}:`, error);
        throw error;
    }
} 