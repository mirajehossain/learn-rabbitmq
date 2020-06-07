#!/usr/bin/env node

const amqp = require('amqplib/callback_api');

const args = process.argv.slice(2);

if (args.length === 0) {
    console.log("Usage: subscriber.js <facility>.<severity>");
    process.exit(1);
}

amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }


        const exchange = 'topic_logs';
        const exchangeType = 'topic';
        channel.assertExchange(exchange, exchangeType , { durable: false });

        channel.assertQueue('', { exclusive: true }, (error2, q) => {
                if (error2) throw error2;
                console.log(" [*] Waiting for messages in %s. To exit press CTRL+C");

                args.forEach((key) => {
                    channel.bindQueue(q.queue, exchange, key);
                })


                channel.consume(q.queue, (msg) => {
                    if (msg.content) console.log(" [x] %s %s",msg.fields.routingKey,  msg.content.toString());
                }, { noAck: true});
            })
    });
});
