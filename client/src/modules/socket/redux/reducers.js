import SocketIO from 'socket.io-client';
import { getStorage } from "../../../config";
import { SocketConstants } from "./constants";

const connectSocketIO = (userId) => {
    return SocketIO(process.env.REACT_APP_SERVER, {
        query: { userId }
    });
} 

export function socket(state, action) {
    switch (action.type) {
        case SocketConstants.CONNECT_SOCKET_IO: 
            const userId = getStorage('userId');
            if(userId)
                return connectSocketIO(userId);
            else    
                return {...state};
        
        case SocketConstants.DISCONNECT_SOCKET_IO:
            state.io.disconnect();

        default: 
            return {...state}
    }
}