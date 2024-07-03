const amqp = require('amqplib');

//step 1 : Connect to the rabbitmq server
//step 2 : Create a new channel on that connection
//step 3 : Create the exchange
//step 4 : Publish the message to the exchange with a routing key

const rabbitMQ = {
    url: 'amqp://localhost',
    exchangeName: 'logExchange',
};

class Producer {
    channel;

    async createChannel() {
        const connection = await amqp.connect(rabbitMQ.url);
        this.channel = await connection.createChannel();
    }

    async publishMessage(routingKey, message) {
        if (!this.channel) {
            await this.createChannel();
        }

        const exchangeName = rabbitMQ.exchangeName;
        await this.channel.assertExchange(exchangeName, 'direct');

        const logDetails = {
            logType: routingKey,
            message: message,
            dateTime: new Date(),
        };
        await this.channel.publish(exchangeName, routingKey, Buffer.from(JSON.stringify(logDetails)));

        console.log(`The new ${routingKey} log is sent to exchange ${exchangeName}`);
    }
}

module.exports = Producer;
