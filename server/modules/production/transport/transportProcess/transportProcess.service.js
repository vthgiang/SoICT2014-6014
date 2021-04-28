// bắt đầu gửi vị trí
exports.startLocate = async (portal, data) => {
    if (data){
        if(data?.manageId && data?.driverId && data?.manageId!==data?.driverId){
            let manageId = data.manageId;
            let driverId = data.driverId;
            if (CONNECTED_CLIENTS && CONNECTED_CLIENTS.length > 1){
                let driverConnected = CONNECTED_CLIENTS.filter(r => r.userId === driverId);
                if (driverConnected && driverConnected.length!==0){
                    let driverSocket = driverConnected[0].socketId;
                    SOCKET_IO.to(driverSocket).emit("start locate", {manageId: manageId});
                }
            }
        }

    }
    // console.log(data);
    // console.log(SOCKET_IO)
    // console.log("=====================================")
    // console.log(CONNECTED_CLIENTS)
    // SOCKET_IO.to().emit("start locate", )
}
// gửi vị trí
exports.sendCurrentLocate = async (portal, data) => {
    if (data){
        if(data?.manageId && data?.location){
            let manageId = data.manageId;
            let location = data.location;
            if (CONNECTED_CLIENTS && CONNECTED_CLIENTS.length > 1){
                let managerConnected = CONNECTED_CLIENTS.filter(r => r.userId === manageId);
                if (managerConnected && managerConnected.length!==0){
                    let managerSocket = managerConnected[0].socketId;
                    // console.log(managerSocket, location, interval, "aaa");
                    SOCKET_IO.to(managerSocket).emit("send current locate", {location: location, interval: data.interval});
                }
            }
        }

    }
    // console.log(data);
    // console.log(SOCKET_IO)
    // console.log("=====================================")
    // console.log(CONNECTED_CLIENTS)
    // SOCKET_IO.to().emit("start locate", )
}
// dừng gửi
exports.stopLocate = async (portal, data) => {
    if (data){
        if(data?.driverId){
            let driverId = data.driverId;
            if (CONNECTED_CLIENTS && CONNECTED_CLIENTS.length > 1){
                let driverConnected = CONNECTED_CLIENTS.filter(r => r.userId === driverId);
                if (driverConnected && driverConnected.length!==0){
                    let driverSocket = driverConnected[0].socketId;
                    SOCKET_IO.to(driverSocket).emit("stop locate", {interval: data.interval});
                }
            }
        }

    }
}
