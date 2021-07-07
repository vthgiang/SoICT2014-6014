// import { isTimeZoneDateSmaller } from './compareDateTimeZone'
const calMinDistance = require('./generatePlan/calMinDistanceOneDay')
const isTimeZoneDateSmaller = (date1, date2) => { //Ngày bắt đầu trước ngày kết thúc
    let startTimeZoneDate = new Date(date1);
    let endTimeZoneDate = new Date(date2);
    startTimeZoneDate.setHours(11,0,1);
    endTimeZoneDate.setHours(10,0,1);
    if (startTimeZoneDate.getTime() < endTimeZoneDate.getTime()) {
        return true
    } else {
        return false
    }
}
let startDatePlan;
const getNextDay = (n)=> {
    let currentDay;
    if (!startDatePlan){
        currentDay = new Date();
    }
    else {
        currentDay = new Date(startDatePlan);
    }
    let date = currentDay.getDate();
    currentDay.setDate(date+n);
    currentDay.setHours(10,0,1);
    return new Date(currentDay);
}

// Trả về danh sách người, xe có thể sử dụng
const getVehicleCarrierUsable = (date, listPlan, listCarriers, listVehicles) => { // date timezone
        let usedVehicles=[];
        let usedCarriers=[];
        let usableVehicles = listVehicles;
        let usableCarriers = listCarriers;
        let currentPlan;
        if (listPlan && listPlan.length!==0){
            listPlan.map(plan => {
                // nếu có kế hoạch khác bị trùng thời gian
                if (!(isTimeZoneDateSmaller(date, plan.startTime) || isTimeZoneDateSmaller(plan.endTime, date))){
                    if(plan.transportVehicles && plan.transportVehicles.length!==0){
                        plan.transportVehicles.map(transportVehicles => {
                            // xét xe đã sử dụng trong kế hoạch đó
                            if (transportVehicles.vehicle?._id){
                                for (let j=0;j<listVehicles.length;j++){
                                    if (String(listVehicles[j]._id) === String(transportVehicles.vehicle._id)){
                                        usedVehicles.push(listVehicles[j]);
                                        usableVehicles = usableVehicles.filter(r => String(r._id) === String(transportVehicles.vehicle._id))
                                        currentPlan=plan;
                                    }
                                }
                            }
                            // xét người đã sử dụng trong kế hoạch đó                            
                            if (plan.transportVehicles && plan.transportVehicles.length!==0){
                                plan.transportVehicles.map(transportVehicles => {
                                    if (transportVehicles.carriers && transportVehicles.carriers.length !==0){
                                        transportVehicles.carriers.map(carriers => {
                                            if(carriers.carrier){
                                                for (let j =0;j<listCarriers.length;j++){
                                                    if (String(listCarriers[j]._id) === String(carriers.carrier._id)){
                                                        usedCarriers.push(listCarriers[j]);
                                                        usableCarriers = usableCarriers.filter(r => String(r._id) === String(carriers.carrier._id))
                                                        currentPlan=plan;
                                                    }
                                                }                                                            
                                            }
                                        })
                                    }
                                })
                            }
                            
                        })
                    }
                } 
            })
        }

        return({
            date: date,
            usedVehicles: usedVehicles,
            usedCarriers: usedCarriers,
            transportPlan: currentPlan,
            usableCarriers: usableCarriers,
            usableVehicles: usableVehicles,
        })
        
}

// Trả về xe có thể sử dụng sau khi phân công người
let totalDistance = 999;
let day;
let selectedRequirement;
let saveArr;
let saveArrVehicle;
let c=0;
const generatePlanShortestDistance = (listRequirement, countDay, listVehiclesDays, numVehiclesDays, k) => {
    if (k >= listRequirement.length){
        let distance = 0;
        let minR;
        let vehicleUsedRes = new Array(countDay);
        for (let i = 0; i< countDay; i++){
            if (day[i] && day[i].length!==0){
                
                // console.time('start');
                let k = calMinDistance.calMinDistanceOneDay(day[i], listVehiclesDays[i], numVehiclesDays[i], totalDistance);
                // console.timeEnd('start');  
                minR = k.minR;
                vehicleUsedRes[i] = k.vehicleUsedRes?.slice();
                distance+=minR;
                if (distance>totalDistance) return;
            }
        }
        if (distance<totalDistance){
            saveArrVehicle = new Array(countDay);
            saveArr = new Array(countDay);
            // for (let i=0;i<99999;i++){
            //     saveArrVehicle[i] = new Array(99999) 
            // }
            // console.log(vehicleUsedRes);
            for (let i = 0; i<countDay;i++){
                saveArr[i] = [...day[i]]
                if (vehicleUsedRes[i]){
                    saveArrVehicle[i] = vehicleUsedRes[i].slice()
                }
            }
            // saveArr = [...day];
            totalDistance = distance;
        }
        return;
    }
    for (let i=0; i<listRequirement.length;i++) {
        if (!selectedRequirement[i] && check(i, listRequirement.length)){
            for (let j=0; j< countDay; j++){
                // let checkIsHaveVehicleCanCarry = false;
                // for (let z=0;z<listVehiclesDays[j].length;z++){
                //     if (listVehiclesDays[j][z].payload >= listRequirement[i].payload 
                //         && listVehiclesDays[j][z].volume >= listRequirement[i].volume){
                //             checkIsHaveVehicleCanCarry = true;
                //             break; 
                //         }
                // }
                // if (!checkIsHaveVehicleCanCarry) continue;
                selectedRequirement[i] = true;
                day[j].push(listRequirement[i]);
                generatePlanShortestDistance(listRequirement, countDay, listVehiclesDays, numVehiclesDays, k+1);
                day[j].pop();
                selectedRequirement[i] = false;
            }
        }
    }
}
const check = (start, end) => {
    for (let i = start+1; i<end;i++){
        if (selectedRequirement[i]===true){
            return false;
        }
    }
    return true;
}
export const generatePlanFastestMove = (listRequirement, listPlan, allVehicles, allCarriers, inDay, startDate) => {
    startDatePlan = startDate;
    if (!(listRequirement && allVehicles && allCarriers 
        && listRequirement.length!==0 && allVehicles.length!==0 && allCarriers.length!==0)){
            return;
        }
    saveArr = [];
    saveArrVehicle = new Array(inDay+3)
    totalDistance = 9999;
    day = new Array(inDay+5);
    selectedRequirement = new Array(listRequirement.length+5);
    let listVehiclesDays = [];
    let listCarriersDays = [];
    let numVehiclesDays = [];
    let usableCarriers, usableVehicles;
    let listAvailableRequirement = [];
    let listUnavailableRequirement = [];
    let listCheckAvailableRequirement = new Array(listRequirement.length+5);
    for (let i=0;i<listRequirement.length;i++){
        listCheckAvailableRequirement[i] = false;
    }
    for (let i=0;i<inDay;i++){
        let resultVehicleCarrierUsable = getVehicleCarrierUsable(getNextDay(i), listPlan, allCarriers, allVehicles);
        usableCarriers = resultVehicleCarrierUsable.usableCarriers;
        usableVehicles = resultVehicleCarrierUsable.usableVehicles;
        // lọc yêu cầu vận chuyển có trọng tải, thế tích xếp được lên xe
        if (usableVehicles && usableVehicles.length!==0 && listRequirement && listRequirement.length!==0){
            usableVehicles.map(vehicle => {
                listRequirement.map((requirement,index) => {
                    if (Number(requirement.volume) <= Number(vehicle.volume) && Number(requirement.payload) <= Number(vehicle.payload)){
                        listCheckAvailableRequirement[index] = true;
                    }
                })
            })
        }
        listVehiclesDays.push(usableVehicles);
        listCarriersDays.push(usableCarriers);
        if (usableVehicles.length > Math.ceil(usableCarriers.length / 2)){
            numVehiclesDays.push(Math.ceil(usableCarriers.length / 2));
        }
        else {
            numVehiclesDays.push(usableVehicles.length);
        }
    }
    console.log(listRequirement);
    console.log(listCheckAvailableRequirement);
    for (let i=0;i<listRequirement.length;i++){
        if (listCheckAvailableRequirement[i] === true){
            listAvailableRequirement.push(listRequirement[i]);
        }
        else {
            listUnavailableRequirement.push(listRequirement[i]);
        }
    }
    listRequirement = listAvailableRequirement;
    for (let i =0; i<inDay;i++){
        day[i] = [];
    }
    generatePlanShortestDistance(listRequirement, inDay, listVehiclesDays, numVehiclesDays, 0);
    // let startDay = getNextDay(1);
    let plans = [];
    if (saveArr && saveArr.length!==0 && saveArrVehicle && saveArrVehicle.length!==0){
        for (let i = 0;i< inDay; i++){
            let requirements = [];
            let vehicles = [];
            let listCarrier = listCarriersDays[i];
            if (saveArr[i] && saveArr[i].length!==0){
                saveArr[i].map(item => {
                    requirements.push(item);
                })
                saveArrVehicle[i].map((vehicleDay, index) => {
                    if (vehicleDay && vehicleDay.length!==0){

                        // vehicleDay.map((r, index) => {
                        //     if(r && r.length!==0){
                                vehicles.push({
                                    vehicle: listVehiclesDays[i][index],
                                    carriers: [
                                        {
                                            carrier: listCarrier[index],
                                            pos: 1,
                                        }
                                    ]
                                })
                            // }
                        // })
                    }
                })
            }
            plans.push({
                date: getNextDay(i).toISOString(),
                transportRequirements: requirements,
                transportVehicles: vehicles,
            })
        }
    }
    // console.log(saveArrVehicle);
    return {saveArr, saveArrVehicle, plans, listUnavailableRequirement};
}

export const generatePlan = (listRequirement, listPlan, listVehicles, listCarriers) => {
    let res = [];
    let flag = true;
    let nextDay = 0;
    let listRequirementCal = []
    for (let i=0; i< listRequirement.length;i++){
        listRequirementCal.push({
            requirement: listRequirement[i],
            plan: null,
        })
    }

    while (flag){
        nextDay++;
        if (nextDay > 10) break;
        let date = getNextDay(nextDay);
        let result = [];
        let calArr = [];
        let needArrangeRequirement = listRequirementCal.filter(r=> r.plan === null);
        if(needArrangeRequirement && needArrangeRequirement.length !==0){
            needArrangeRequirement.map((requirement, index)=> {
                let mark = 0;
                if (requirement.timeRequests && requirement.timeRequests.length !==0){
                    requirement.timeRequests.map(time => {
                        let timeRequest = new Date(time.timeRequest);
                        if(timeRequest.getTime() === date.getTime()){
                            mark = 10*86400000;
                        }
                    })
                }
                const createdAt = new Date(requirement.createdAt);
                mark += date.getTime() - createdAt.getTime();
                calArr.push({
                    requirement: requirement,
                    mark: mark,
                })
            })
            calArr.sort((a, b)=> {
                return b.mark-a.mark;
              });
            for (let i=0;i<calArr.length;i++){
                result.push(calArr[i].requirement);
            }
        }
        else {
            flag = false;
            break;
        }
        let {usableVehicles, usableCarriers} = getVehicleCarrierUsable(date, listPlan, listCarriers, listVehicles);

        
    }
}

let allTransportRequirements = [
    {
        "geocode": {
            "fromAddress": {
                "lat": 21.159679876,
                "lng": 105.416145673
            },
            "toAddress": {
                "lat": 20.6639930000001,
                "lng": 105.787069
            }
        },
        "_id": "609e4c2267f35d07748ce4c5",
        "status": 2,
        "code": "YCVC20210514.455270",
        "type": 5,
        "creator": {
            "active": true,
            "status": 0,
            "deleteSoft": false,
            "numberDevice": 2,
            "avatar": "/upload/avatars/user.png",
            "pushNotificationTokens": [],
            "_id": "60950b854fd0700d10bfbadc",
            "name": "Admin VNIST",
            "email": "admin.vnist@gmail.com",
            "password": "$2a$10$CH6wRW5DZ9A3ZnqmIv4/AughjRuQ8fRL4zysrrEL7ZBpeYsGSe9Om",
            "company": "60950b854fd0700d10bfbada",
            "__v": 0,
            "createdAt": "2021-05-07T09:42:29.667Z",
            "updatedAt": "2021-05-16T09:11:29.138Z",
            "id": "60950b854fd0700d10bfbadc"
        },
        "fromAddress": "Ba Vì, Sơn Tây",
        "toAddress": "Thanh Oai, Hà Nội",
        "goods": [
            {
                "_id": "609e4c2267f35d07748ce4c6",
                "good": {
                    "quantity": 10,
                    "returnRules": [],
                    "serviceLevelAgreements": [],
                    "discounts": [],
                    "taxs": [],
                    "_id": "60950b874fd0700d10bfbde3",
                    "company": "60950b854fd0700d10bfbada",
                    "category": "60950b874fd0700d10bfbddc",
                    "name": "Bình ắc quy",
                    "code": "EQ001",
                    "type": "material",
                    "baseUnit": "Chiếc",
                    "description": "Công cụ dụng cụ thuốc thú y",
                    "units": [],
                    "materials": [],
                    "manufacturingMills": [],
                    "__v": 0,
                    "createdAt": "2021-05-07T09:42:31.407Z",
                    "updatedAt": "2021-05-07T09:42:31.407Z"
                },
                "quantity": 1,
                "volume": 1,
                "payload": 1
            }
        ],
        "timeRequests": [
            {
                "_id": "609e4c2267f35d07748ce4c7",
                "timeRequest": "2021-05-13",
                "description": ""
            }
        ],
        "volume": 1,
        "payload": 1,
        "approver": "60950b854fd0700d10bfbadc",
        "historyTransport": [],
        "createdAt": "2021-05-14T10:08:34.609Z",
        "updatedAt": "2021-05-16T10:45:36.829Z",
        "__v": 0
    },
    {
        "geocode": {
            "fromAddress": {
                "lat": 20.9991964035554,
                "lng": 105.845662549979
            },
            "toAddress": {
                "lat": 20.988961633,
                "lng": 105.628865767
            }
        },
        "_id": "609e7faaf8f20f287881dabd",
        "status": 2,
        "code": "YCVC20210514.186100",
        "type": 1,
        "creator": {
            "active": true,
            "status": 0,
            "deleteSoft": false,
            "numberDevice": 2,
            "avatar": "/upload/avatars/user.png",
            "pushNotificationTokens": [],
            "_id": "60950b854fd0700d10bfbadc",
            "name": "Admin VNIST",
            "email": "admin.vnist@gmail.com",
            "password": "$2a$10$CH6wRW5DZ9A3ZnqmIv4/AughjRuQ8fRL4zysrrEL7ZBpeYsGSe9Om",
            "company": "60950b854fd0700d10bfbada",
            "__v": 0,
            "createdAt": "2021-05-07T09:42:29.667Z",
            "updatedAt": "2021-05-16T09:11:29.138Z",
            "id": "60950b854fd0700d10bfbadc"
        },
        "fromAddress": "Trần Đại Nghĩa - Hai Bà Trưng - Hà Nội",
        "toAddress": "Ngọc mỹ, Quốc Oai, Hà Nội",
        "goods": [
            {
                "_id": "609e7faaf8f20f287881dabe",
                "good": {
                    "quantity": 20,
                    "returnRules": [],
                    "serviceLevelAgreements": [],
                    "discounts": [],
                    "taxs": [],
                    "_id": "60950b874fd0700d10bfbde5",
                    "company": "60950b854fd0700d10bfbada",
                    "category": "60950b874fd0700d10bfbdda",
                    "name": "ĐƯỜNG ACESULFAME K",
                    "code": "PR001",
                    "type": "product",
                    "baseUnit": "Thùng",
                    "materials": [
                        {
                            "_id": "60950b874fd0700d10bfbde6",
                            "good": "60950b874fd0700d10bfbde1",
                            "quantity": 5
                        },
                        {
                            "_id": "60950b874fd0700d10bfbde7",
                            "good": "60950b874fd0700d10bfbde2",
                            "quantity": 3
                        }
                    ],
                    "numberExpirationDate": 800,
                    "description": "Sản phẩm thuốc thú y",
                    "manufacturingMills": [
                        {
                            "_id": "60950b874fd0700d10bfbde8",
                            "manufacturingMill": "60950b874fd0700d10bfbdd3",
                            "productivity": 100,
                            "personNumber": 3
                        },
                        {
                            "_id": "60950b874fd0700d10bfbde9",
                            "manufacturingMill": "60950b874fd0700d10bfbdd4",
                            "productivity": 50,
                            "personNumber": 4
                        }
                    ],
                    "pricePerBaseUnit": 90000,
                    "salesPriceVariance": 9000,
                    "units": [],
                    "__v": 0,
                    "createdAt": "2021-05-07T09:42:31.438Z",
                    "updatedAt": "2021-05-07T09:42:31.438Z"
                },
                "quantity": 12,
                "volume": 10,
                "payload": 10
            }
        ],
        "timeRequests": [
            {
                "_id": "609e7faaf8f20f287881dabf",
                "timeRequest": "2021-05-15",
                "description": ""
            }
        ],
        "volume": 10,
        "payload": 10,
        "approver": "60950b854fd0700d10bfbadc",
        "bill": "609565928b0a9a22844c7d97",
        "historyTransport": [],
        "createdAt": "2021-05-14T13:48:26.171Z",
        "updatedAt": "2021-05-16T10:45:38.071Z",
        "__v": 0,
        "transportPlan": null
    },
    {
        "geocode": {
            "fromAddress": {
                "lat": 21.081394706,
                "lng": 105.710463162
            },
            "toAddress": {
                "lat": 21.037254283,
                "lng": 105.774934226
            }
        },
        "_id": "60a0c6749086b517143858e0",
        "status": 2,
        "code": "YCVC20210516.317765",
        "type": 5,
        "creator": {
            "active": true,
            "status": 0,
            "deleteSoft": false,
            "numberDevice": 0,
            "avatar": "/upload/avatars/user.png",
            "pushNotificationTokens": [],
            "_id": "60950b9db4bdcc25fca41f68",
            "name": "Trần Văn Sơn",
            "email": "tranvanson.vnist@gmail.com",
            "password": "$2a$10$7ox/Dwm./ZqloPWFSNYO/u3GX9m3WITAEOlItC/Xl56TZdITkyTWi",
            "company": "60950b854fd0700d10bfbada",
            "__v": 0,
            "createdAt": "2021-05-07T09:42:53.853Z",
            "updatedAt": "2021-05-16T07:17:50.499Z",
            "id": "60950b9db4bdcc25fca41f68"
        },
        "fromAddress": "tân lập đan phượng hà nội",
        "toAddress": "đại học thương mại hà nội",
        "goods": [
            {
                "_id": "60a0c6749086b517143858e1",
                "good": {
                    "quantity": 20,
                    "returnRules": [],
                    "serviceLevelAgreements": [],
                    "discounts": [],
                    "taxs": [],
                    "_id": "60950b874fd0700d10bfbde1",
                    "company": "60950b854fd0700d10bfbada",
                    "category": "60950b874fd0700d10bfbddc",
                    "name": "Jucca Nước",
                    "code": "MT001",
                    "type": "material",
                    "baseUnit": "ml",
                    "description": "Nguyên liệu thuốc thú u",
                    "units": [],
                    "materials": [],
                    "manufacturingMills": [],
                    "__v": 0,
                    "createdAt": "2021-05-07T09:42:31.406Z",
                    "updatedAt": "2021-05-07T09:42:31.406Z"
                },
                "quantity": 10,
                "volume": 10,
                "payload": 10
            }
        ],
        "timeRequests": [
            {
                "_id": "60a0c6749086b517143858e2",
                "timeRequest": "2021-05-18",
                "description": ""
            }
        ],
        "volume": 10,
        "payload": 10,
        "approver": "60950b854fd0700d10bfbadc",
        "historyTransport": [],
        "createdAt": "2021-05-16T07:15:00.783Z",
        "updatedAt": "2021-05-16T10:45:39.275Z",
        "__v": 0
    },
    {
        "geocode": {
            "fromAddress": {
                "lat": 21.0077937,
                "lng": 105.84602459
            },
            "toAddress": {
                "lat": 21.006212008,
                "lng": 105.939005613
            }
        },
        "_id": "60a0c8acf69e1d1e34956cbe",
        "status": 2,
        "code": "YCVC20210516.244032",
        "type": 5,
        "creator": {
            "active": true,
            "status": 0,
            "deleteSoft": false,
            "numberDevice": 0,
            "avatar": "/upload/avatars/user.png",
            "pushNotificationTokens": [],
            "_id": "60950b854fd0700d10bfbae0",
            "name": "Nguyễn Văn Danh",
            "email": "nvd.vnist@gmail.com",
            "password": "$2a$10$CH6wRW5DZ9A3ZnqmIv4/AughjRuQ8fRL4zysrrEL7ZBpeYsGSe9Om",
            "company": "60950b854fd0700d10bfbada",
            "__v": 0,
            "createdAt": "2021-05-07T09:42:29.668Z",
            "updatedAt": "2021-05-16T09:10:52.877Z",
            "id": "60950b854fd0700d10bfbae0"
        },
        "fromAddress": "Vĩnh Phú, Hai Bà Trưng, Hà Nội, Vietnam",
        "toAddress": "trâu quỳ gia lâm hà nội",
        "goods": [
            {
                "_id": "60a0c8acf69e1d1e34956cbf",
                "good": {
                    "quantity": 30,
                    "returnRules": [],
                    "serviceLevelAgreements": [],
                    "discounts": [],
                    "taxs": [],
                    "_id": "60950b874fd0700d10bfbde2",
                    "company": "60950b854fd0700d10bfbada",
                    "category": "60950b874fd0700d10bfbddc",
                    "name": "Propylen Glycon",
                    "code": "MT002",
                    "type": "material",
                    "baseUnit": "kg",
                    "description": "Nguyên vật liệu thuốc thú y",
                    "units": [],
                    "materials": [],
                    "manufacturingMills": [],
                    "__v": 0,
                    "createdAt": "2021-05-07T09:42:31.407Z",
                    "updatedAt": "2021-05-07T09:42:31.407Z"
                },
                "quantity": 10,
                "volume": 10,
                "payload": 10
            }
        ],
        "timeRequests": [
            {
                "_id": "60a0c8acf69e1d1e34956cc0",
                "timeRequest": "2021-05-18",
                "description": ""
            }
        ],
        "volume": 10,
        "payload": 10,
        "approver": "60950b854fd0700d10bfbadc",
        "historyTransport": [],
        "createdAt": "2021-05-16T07:24:28.376Z",
        "updatedAt": "2021-05-16T10:45:41.665Z",
        "__v": 0
    },
    {
        "geocode": {
            "fromAddress": {
                "lat": 21.004764138,
                "lng": 105.852570697
            },
            "toAddress": {
                "lat": 21.010422815,
                "lng": 105.636422007
            }
        },
        "_id": "60a0c925f69e1d1e34956cc1",
        "status": 2,
        "code": "YCVC20210516.461896",
        "type": 5,
        "creator": {
            "active": true,
            "status": 0,
            "deleteSoft": false,
            "numberDevice": 0,
            "avatar": "/upload/avatars/user.png",
            "pushNotificationTokens": [],
            "_id": "60950b854fd0700d10bfbae0",
            "name": "Nguyễn Văn Danh",
            "email": "nvd.vnist@gmail.com",
            "password": "$2a$10$CH6wRW5DZ9A3ZnqmIv4/AughjRuQ8fRL4zysrrEL7ZBpeYsGSe9Om",
            "company": "60950b854fd0700d10bfbada",
            "__v": 0,
            "createdAt": "2021-05-07T09:42:29.668Z",
            "updatedAt": "2021-05-16T09:10:52.877Z",
            "id": "60950b854fd0700d10bfbae0"
        },
        "fromAddress": "thanh nhàn, hai bà trưng, hà nội",
        "toAddress": "quốc oai hà nội",
        "goods": [
            {
                "_id": "60a0c925f69e1d1e34956cc2",
                "good": {
                    "quantity": 10,
                    "returnRules": [],
                    "serviceLevelAgreements": [],
                    "discounts": [],
                    "taxs": [],
                    "_id": "60950b874fd0700d10bfbde3",
                    "company": "60950b854fd0700d10bfbada",
                    "category": "60950b874fd0700d10bfbddc",
                    "name": "Bình ắc quy",
                    "code": "EQ001",
                    "type": "material",
                    "baseUnit": "Chiếc",
                    "description": "Công cụ dụng cụ thuốc thú y",
                    "units": [],
                    "materials": [],
                    "manufacturingMills": [],
                    "__v": 0,
                    "createdAt": "2021-05-07T09:42:31.407Z",
                    "updatedAt": "2021-05-07T09:42:31.407Z"
                },
                "quantity": 15,
                "volume": 10,
                "payload": 10
            }
        ],
        "timeRequests": [
            {
                "_id": "60a0c925f69e1d1e34956cc3",
                "timeRequest": "2021-05-16",
                "description": ""
            }
        ],
        "volume": 10,
        "payload": 10,
        "approver": "60950b854fd0700d10bfbadc",
        "historyTransport": [],
        "createdAt": "2021-05-16T07:26:29.031Z",
        "updatedAt": "2021-05-16T10:45:43.348Z",
        "__v": 0,
        "transportPlan": null
    },
    {
        "geocode": {
            "fromAddress": {
                "lat": 21.032005984,
                "lng": 105.909988812
            },
            "toAddress": {
                "lat": 20.984650683,
                "lng": 105.842763967
            }
        },
        "_id": "60a0d1e5044fa62168777adc",
        "status": 2,
        "code": "YCVC20210516.132236",
        "type": 5,
        "creator": {
            "active": true,
            "status": 0,
            "deleteSoft": false,
            "numberDevice": 2,
            "avatar": "/upload/avatars/user.png",
            "pushNotificationTokens": [],
            "_id": "60950b854fd0700d10bfbadc",
            "name": "Admin VNIST",
            "email": "admin.vnist@gmail.com",
            "password": "$2a$10$CH6wRW5DZ9A3ZnqmIv4/AughjRuQ8fRL4zysrrEL7ZBpeYsGSe9Om",
            "company": "60950b854fd0700d10bfbada",
            "__v": 0,
            "createdAt": "2021-05-07T09:42:29.667Z",
            "updatedAt": "2021-05-16T09:11:29.138Z",
            "id": "60950b854fd0700d10bfbadc"
        },
        "fromAddress": "long biên hà nội",
        "toAddress": "kim đồng giáp bát hà nội",
        "goods": [
            {
                "_id": "60a0d1e5044fa62168777add",
                "good": {
                    "quantity": 10,
                    "returnRules": [],
                    "serviceLevelAgreements": [],
                    "discounts": [],
                    "taxs": [],
                    "_id": "60950b874fd0700d10bfbde4",
                    "company": "60950b854fd0700d10bfbada",
                    "category": "60950b874fd0700d10bfbddc",
                    "name": "Máy nén",
                    "code": "EQ002",
                    "type": "material",
                    "baseUnit": "Chiếc",
                    "description": "Công cụ dụng cụ thuốc thú y",
                    "units": [],
                    "materials": [],
                    "manufacturingMills": [],
                    "__v": 0,
                    "createdAt": "2021-05-07T09:42:31.407Z",
                    "updatedAt": "2021-05-07T09:42:31.407Z"
                },
                "quantity": 10,
                "volume": 100,
                "payload": 100
            }
        ],
        "timeRequests": [
            {
                "_id": "60a0d1e5044fa62168777ade",
                "timeRequest": "2021-05-19",
                "description": ""
            },
            {
                "_id": "60a0d1e5044fa62168777adf",
                "timeRequest": "2021-05-25",
                "description": ""
            }
        ],
        "volume": 100,
        "payload": 100,
        "approver": "60950b854fd0700d10bfbadc",
        "historyTransport": [],
        "createdAt": "2021-05-16T08:03:49.776Z",
        "updatedAt": "2021-05-16T10:45:44.753Z",
        "__v": 0
    },
    {
        "geocode": {
            "fromAddress": {
                "lat": 20.9830403964559,
                "lng": 105.73100465623
            },
            "toAddress": {
                "lat": 20.997942715,
                "lng": 105.816376617
            }
        },
        "_id": "60a0d232044fa62168777ae3",
        "status": 2,
        "code": "YCVC20210516.128377",
        "type": 5,
        "creator": {
            "active": true,
            "status": 0,
            "deleteSoft": false,
            "numberDevice": 2,
            "avatar": "/upload/avatars/user.png",
            "pushNotificationTokens": [],
            "_id": "60950b854fd0700d10bfbadc",
            "name": "Admin VNIST",
            "email": "admin.vnist@gmail.com",
            "password": "$2a$10$CH6wRW5DZ9A3ZnqmIv4/AughjRuQ8fRL4zysrrEL7ZBpeYsGSe9Om",
            "company": "60950b854fd0700d10bfbada",
            "__v": 0,
            "createdAt": "2021-05-07T09:42:29.667Z",
            "updatedAt": "2021-05-16T09:11:29.138Z",
            "id": "60950b854fd0700d10bfbadc"
        },
        "fromAddress": "la phù hoài đức hà nội",
        "toAddress": "thanh xuân hà nội",
        "goods": [
            {
                "_id": "60a0d232044fa62168777ae4",
                "good": {
                    "quantity": 20,
                    "returnRules": [],
                    "serviceLevelAgreements": [],
                    "discounts": [],
                    "taxs": [],
                    "_id": "60950b874fd0700d10bfbde5",
                    "company": "60950b854fd0700d10bfbada",
                    "category": "60950b874fd0700d10bfbdda",
                    "name": "ĐƯỜNG ACESULFAME K",
                    "code": "PR001",
                    "type": "product",
                    "baseUnit": "Thùng",
                    "materials": [
                        {
                            "_id": "60950b874fd0700d10bfbde6",
                            "good": "60950b874fd0700d10bfbde1",
                            "quantity": 5
                        },
                        {
                            "_id": "60950b874fd0700d10bfbde7",
                            "good": "60950b874fd0700d10bfbde2",
                            "quantity": 3
                        }
                    ],
                    "numberExpirationDate": 800,
                    "description": "Sản phẩm thuốc thú y",
                    "manufacturingMills": [
                        {
                            "_id": "60950b874fd0700d10bfbde8",
                            "manufacturingMill": "60950b874fd0700d10bfbdd3",
                            "productivity": 100,
                            "personNumber": 3
                        },
                        {
                            "_id": "60950b874fd0700d10bfbde9",
                            "manufacturingMill": "60950b874fd0700d10bfbdd4",
                            "productivity": 50,
                            "personNumber": 4
                        }
                    ],
                    "pricePerBaseUnit": 90000,
                    "salesPriceVariance": 9000,
                    "units": [],
                    "__v": 0,
                    "createdAt": "2021-05-07T09:42:31.438Z",
                    "updatedAt": "2021-05-07T09:42:31.438Z"
                },
                "quantity": 10,
                "volume": 1000,
                "payload": 100
            }
        ],
        "timeRequests": [
            {
                "_id": "60a0d232044fa62168777ae5",
                "timeRequest": "2021-05-22",
                "description": ""
            }
        ],
        "volume": 1000,
        "payload": 100,
        "approver": "60950b854fd0700d10bfbadc",
        "historyTransport": [],
        "createdAt": "2021-05-16T08:05:06.506Z",
        "updatedAt": "2021-05-16T10:45:45.991Z",
        "__v": 0
    }
]
//========================================================================
let allCarriers = [
    {
        "active": true,
        "status": 0,
        "deleteSoft": false,
        "numberDevice": 0,
        "avatar": "/upload/avatars/user.png",
        "pushNotificationTokens": [],
        "_id": "60950b854fd0700d10bfbade",
        "name": "Trần Văn Bình",
        "email": "tvb.vnist@gmail.com",
        "password": "$2a$10$CH6wRW5DZ9A3ZnqmIv4/AughjRuQ8fRL4zysrrEL7ZBpeYsGSe9Om",
        "company": "60950b854fd0700d10bfbada",
        "__v": 0,
        "createdAt": "2021-05-07T09:42:29.667Z",
        "updatedAt": "2021-05-07T09:42:29.667Z",
        "id": "60950b854fd0700d10bfbade"
    },
    {
        "active": true,
        "status": 0,
        "deleteSoft": false,
        "numberDevice": 6,
        "avatar": "/upload/avatars/user.png",
        "pushNotificationTokens": [],
        "_id": "60950b854fd0700d10bfbadd",
        "name": "Nguyễn Văn An",
        "email": "nva.vnist@gmail.com",
        "password": "$2a$10$CH6wRW5DZ9A3ZnqmIv4/AughjRuQ8fRL4zysrrEL7ZBpeYsGSe9Om",
        "company": "60950b854fd0700d10bfbada",
        "__v": 0,
        "createdAt": "2021-05-07T09:42:29.667Z",
        "updatedAt": "2021-05-15T15:53:21.368Z",
        "id": "60950b854fd0700d10bfbadd"
    },
    {
        "active": true,
        "status": 0,
        "deleteSoft": false,
        "numberDevice": 0,
        "avatar": "/upload/avatars/user.png",
        "pushNotificationTokens": [],
        "_id": "60950b854fd0700d10bfbadf",
        "name": "Vũ Thị Cúc",
        "email": "vtc.vnist@gmail.com",
        "password": "$2a$10$CH6wRW5DZ9A3ZnqmIv4/AughjRuQ8fRL4zysrrEL7ZBpeYsGSe9Om",
        "company": "60950b854fd0700d10bfbada",
        "__v": 0,
        "createdAt": "2021-05-07T09:42:29.668Z",
        "updatedAt": "2021-05-07T09:42:29.668Z",
        "id": "60950b854fd0700d10bfbadf"
    },
    {
        "active": true,
        "status": 0,
        "deleteSoft": false,
        "numberDevice": 0,
        "avatar": "/upload/avatars/user.png",
        "pushNotificationTokens": [],
        "_id": "60950b854fd0700d10bfbae0",
        "name": "Nguyễn Văn Danh",
        "email": "nvd.vnist@gmail.com",
        "password": "$2a$10$CH6wRW5DZ9A3ZnqmIv4/AughjRuQ8fRL4zysrrEL7ZBpeYsGSe9Om",
        "company": "60950b854fd0700d10bfbada",
        "__v": 0,
        "createdAt": "2021-05-07T09:42:29.668Z",
        "updatedAt": "2021-05-16T09:10:52.877Z",
        "id": "60950b854fd0700d10bfbae0"
    },
    {
        "active": true,
        "status": 0,
        "deleteSoft": false,
        "numberDevice": 0,
        "avatar": "/upload/avatars/user.png",
        "pushNotificationTokens": [],
        "_id": "60950b854fd0700d10bfbae1",
        "name": "Trần Thị Én",
        "email": "tte.vnist@gmail.com",
        "password": "$2a$10$CH6wRW5DZ9A3ZnqmIv4/AughjRuQ8fRL4zysrrEL7ZBpeYsGSe9Om",
        "company": "60950b854fd0700d10bfbada",
        "__v": 0,
        "createdAt": "2021-05-07T09:42:29.668Z",
        "updatedAt": "2021-05-16T09:11:25.217Z",
        "id": "60950b854fd0700d10bfbae1"
    }
]

let allVehicles = [
    {
        "useInTransportPlan": [],
        "_id": "6095138c33fa651a2874f211",
        "asset": {
            "assetType": [
                "60950b874fd0700d10bfbd8e"
            ],
            "readByRoles": [
                "60950b854fd0700d10bfbaf0",
                "609512a133fa651a2874f1fd"
            ],
            "cost": 0,
            "usefulLife": 0,
            "startDepreciation": null,
            "residualValue": null,
            "_id": "6095138133fa651a2874f20e",
            "company": "60950b854fd0700d10bfbada",
            "avatar": "",
            "assetName": "xe 1",
            "code": "VVTM20210507.299233",
            "serial": "123",
            "group": "vehicle",
            "purchaseDate": "2021-05-07T00:00:00.000Z",
            "warrantyExpirationDate": "2021-10-15T00:00:00.000Z",
            "managedBy": "60950b854fd0700d10bfbadc",
            "assignedToUser": null,
            "assignedToOrganizationalUnit": null,
            "location": "60950b874fd0700d10bfbdb2",
            "status": "ready_to_use",
            "typeRegisterForUse": 3,
            "description": "",
            "detailInfo": [
                {
                    "_id": "6095138133fa651a2874f20f",
                    "nameField": "payload",
                    "value": "2500"
                },
                {
                    "_id": "6095138133fa651a2874f210",
                    "nameField": "volume",
                    "value": "16"
                }
            ],
            "depreciationType": "none",
            "maintainanceLogs": [],
            "usageLogs": [],
            "incidentLogs": [],
            "locationLogs": [],
            "disposalDate": null,
            "disposalType": "",
            "disposalCost": null,
            "disposalDesc": "",
            "documents": [],
            "unitsProducedDuringTheYears": [],
            "informations": [],
            "createdAt": "2021-05-07T10:16:33.797Z",
            "updatedAt": "2021-05-07T10:16:33.797Z",
            "__v": 0,
            "id": "6095138133fa651a2874f20e"
        },
        "code": "VVTM20210507.299233",
        "name": "xe 1",
        "payload": 2500,
        "volume": 16,
        "usable": 1,
        "__v": 0
    },
    {
        "useInTransportPlan": [],
        "_id": "6095138e33fa651a2874f212",
        "asset": {
            "assetType": [
                "60950b874fd0700d10bfbd8e"
            ],
            "readByRoles": [
                "60950b854fd0700d10bfbaf0",
                "609512a133fa651a2874f1fd"
            ],
            "cost": 0,
            "usefulLife": 0,
            "startDepreciation": null,
            "residualValue": null,
            "_id": "6095133733fa651a2874f20b",
            "company": "60950b854fd0700d10bfbada",
            "avatar": "",
            "assetName": "xe 3",
            "code": "VVTM20210507.140562",
            "serial": "123",
            "group": "vehicle",
            "purchaseDate": "2021-05-07T00:00:00.000Z",
            "warrantyExpirationDate": "2021-08-28T00:00:00.000Z",
            "managedBy": "60950b854fd0700d10bfbadc",
            "assignedToUser": null,
            "assignedToOrganizationalUnit": null,
            "location": "60950b874fd0700d10bfbdb2",
            "status": "ready_to_use",
            "typeRegisterForUse": 3,
            "description": "",
            "detailInfo": [
                {
                    "_id": "6095133733fa651a2874f20c",
                    "nameField": "payload",
                    "value": "3000"
                },
                {
                    "_id": "6095133733fa651a2874f20d",
                    "nameField": "volume",
                    "value": "25"
                }
            ],
            "depreciationType": "none",
            "maintainanceLogs": [],
            "usageLogs": [],
            "incidentLogs": [],
            "locationLogs": [],
            "disposalDate": null,
            "disposalType": "",
            "disposalCost": null,
            "disposalDesc": "",
            "documents": [],
            "unitsProducedDuringTheYears": [],
            "informations": [],
            "createdAt": "2021-05-07T10:15:19.593Z",
            "updatedAt": "2021-05-07T10:15:19.593Z",
            "__v": 0,
            "id": "6095133733fa651a2874f20b"
        },
        "code": "VVTM20210507.140562",
        "name": "xe 3",
        "payload": 3000,
        "volume": 25,
        "usable": 1,
        "__v": 0
    }
]

// let o = generatePlanFastestMove(allTransportRequirements, null, allVehicles, allCarriers, 2, "2021-05-16");
// console.log("haha")
// console.log(k);