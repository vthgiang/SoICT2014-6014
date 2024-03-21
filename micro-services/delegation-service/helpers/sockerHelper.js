const socketIO = require('socket.io');

let CONNECTED_CLIENTS = [];

const SOCKET_IO = (server) => {
    return socketIO(server, {
        cors: {
            origin: [
                'http://localhost:3000',
                'https://dxclan.com',
                'https://dxclan.com:3000',
                'https://dx.vietanhviavet.com',
                'https://dx.vietanhviavet.com:3000',
            ],
            allowedHeaders: ['my-custom-header'],
            credentials: true,
        },
    });
};

const buildSocketConnection = (server) => {
    const io = SOCKET_IO(server);

    io.on('connection', (socket) => {
        CONNECTED_CLIENTS.push({
            socketId: socket.id,
            userId: socket.handshake.query.userId,
        });

        socket.on('disconnect', () => {
            CONNECTED_CLIENTS = CONNECTED_CLIENTS.filter(
                (client) => client.socketId !== socket.id
            );
        });

        console.log('User connected: ', CONNECTED_CLIENTS);
    });
};

module.exports = {
    SOCKET_IO,
    CONNECTED_CLIENTS,
    buildSocketConnection,
};
