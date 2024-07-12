const RABBITMQ = 'amqp://guest:guest@localhost:5672';

const open = require('amqplib').connect(RABBITMQ);
const q = 'task_service_queue';
const internalCall = require('./internal_call');
// Consumer
open
  .then(function (conn) {
    console.log(`[ ${new Date()} ] Server rabbitmq started`);
    return conn.createChannel();
  })
  .then(function (ch) {
    return ch.assertQueue(q).then(function () {
      return ch.consume(q, async function (msg) {
        console.log(`[ ${new Date()} ] Message received: ${JSON.stringify(JSON.parse(msg.content.toString('utf8')))}`);
        if (msg !== null) {
          let response = {};
          let msgContent = JSON.parse(msg.content.toString('utf8'));

          response = await internalCall.internalCall(msgContent.link, JSON.parse(msgContent.params));
          console.log(`[ ${new Date()} ] Message sent`);

          ch.sendToQueue(msg.properties.replyTo, Buffer.from(JSON.stringify(response)), {
            correlationId: msg.properties.correlationId,
          });

          ch.ack(msg);
        }
      });
    });
  })
  .catch(console.warn);
