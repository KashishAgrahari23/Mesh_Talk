import amqp from "amqplib"
//A channel is how we communicate with RabbitMQ like connection pipe
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
        await channel.assertQueue(queueName, { durable: true }); // true means Queue survives server restart.
        channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)),{
            persistent:true
        }); // agian true means message survives RabbitMQ restart.
        console.log(`Message published to queue ${queueName}`);
    } catch (error) {
        console.error(`Failed to publish message to queue ${queueName}:`, error);
        throw error;
    }
} 