#!/usr/bin/env node

const amqp = require('amqplib/callback_api');

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
        const args = process.argv.slice(2);
        const key  = args.length > 0 ? args[0] : 'anonymous.info';
        const message = args.slice(1).join(' ') || 'Hello world';

        channel.assertExchange(exchange, exchangeType , { durable: false });

        channel.publish(exchange, key, Buffer.from(message));
        console.log(" [x] Sent %s %s", key, message);
      });

        setTimeout(function() {
            connection.close();
            process.exit(0);
        }, 500);
});
