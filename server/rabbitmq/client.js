const amqp = require('amqplib');
const EventEmitter = require('events');
const uuid = require('uuid');

const RABBITMQ = 'amqp://guest:guest@rabbitmq:5672';

// pseudo-queue for direct reply-to
const REPLY_QUEUE = 'amq.rabbitmq.reply-to';

// Credits for Event Emitter goes to https://github.com/squaremo/amqp.node/issues/259

const createClient = (rabbitmqconn) =>
  amqp
    .connect(rabbitmqconn)
    .then((conn) => conn.createChannel())
    .then((channel) => {
      channel.responseEmitter = new EventEmitter();
      channel.responseEmitter.setMaxListeners(0);
      channel.consume(
        REPLY_QUEUE,
        (msg) => {
          channel.responseEmitter.emit(msg.properties.correlationId, msg.content.toString('utf8'));
        },
        { noAck: true }
      );
      return channel;
    });

const sendRPCMessage = (channel, message, rpcQueue) => {
  return new Promise((resolve) => {
    const correlationId = uuid.v4();
    channel.responseEmitter.once(correlationId, resolve);
    channel.sendToQueue(rpcQueue, Buffer.from(message), {
      correlationId,
      replyTo: REPLY_QUEUE,
    });
  });
};

const gRPC = async (link, params, rpcQueue) => {
  const channel = await createClient(RABBITMQ);
  const message = {
    link: link,
    params: params,
  };
  const response = await sendRPCMessage(channel, JSON.stringify(message), rpcQueue);

  return response;
};

module.exports = {
  gRPC,
};
