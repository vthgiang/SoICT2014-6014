const convertIntToString = (number) => {
    return number < 10 ? ("0" + number) : number;
}

const getIconURL = (type) => {
    switch (type) {
        case "default":
            return "";
        case "TRUCK":
            return "http://maps.google.com/mapfiles/kml/shapes/truck.png";
        case "BIKE":
            return "http://maps.google.com/mapfiles/kml/shapes/motorcycling.png";
        case "DEPOT":
            return "http://maps.google.com/mapfiles/kml/shapes/homegardenbusiness.png";
        default:
            return "";
    }
}

const checkExistNode = (checkedNode, nodes) => {
    for (let index = 0; index < nodes.length; index++) {
        const node = nodes[index];
        if (node.code === checkedNode.code)
            return index;
    }
    return null;
}

const getCustomersOfJourney = (journey) => {
    let customers = [];
    journey.routes.map((route, ind) => {
        route.orders.map((order, index) => {
            customers.push(order.customer)
        });
    });
    return customers;
}

const getDepotsOfJourney = (journey) => {
    let depots = [];
    journey.routes.map((route, ind) => {
        depots.push(route.startDepot);
        depots.push(route.endDepot);
    });
    return depots;
}

const secondsToHHMMSS = (ms) => {
    var seconds = ms;
    var hours = parseInt(seconds / 3600);
    seconds = seconds % 3600;
    var minutes = parseInt(seconds / 60);
    seconds = seconds % 60;
    let humanized = convertIntToString(hours) + ":" + convertIntToString(minutes) + ":" + convertIntToString(seconds);
    return humanized;
}

const convertTimeStringToInt = (time) => {
    let intTime = 0;
    let hours = parseInt((time.split(":")[0]));
    let minutes = parseInt(time.split(":")[1].split(" ")[0]);
    let isMorning = time.split(" ")[1];

    if (hours == 12 && isMorning == "PM") {
        intTime = minutes*60
    } else if (hours != 12 && isMorning == "AM") {
        intTime = hours*3600+minutes*60;
    } else if (hours != 12 && isMorning == "PM") {
        intTime = (hours+12)*3600+minutes*60;
    }
    return intTime;
}

function convertHHMMSSToInt (time) {
    let intTime = 0;
    let hours = parseInt((time.split(":")[0]));
    let minutes = parseInt(time.split(":")[1]);
    let seconds = parseInt(time.split(":")[2]);

    return intTime = hours*3600 + minutes*60 + seconds;
}

export {getIconURL, checkExistNode, getCustomersOfJourney, getDepotsOfJourney, secondsToHHMMSS, convertTimeStringToInt, convertHHMMSSToInt}