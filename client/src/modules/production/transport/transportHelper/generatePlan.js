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
const getNextDay = (n)=> {
    let currentDay = new Date();
    let date = currentDay.getDate();
    currentDay.setDate(date+n);
    currentDay.setHours(0,0,0);
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
                                                for (let j =0;j<allCarriers.length;j++){
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
let totalDistance = 99999999;
let day = new Array(99999);
let selectedRequirement = new Array(99999);
let saveArr;
let saveArrVehicle;
const generatePlanShortestDistance = (listRequirement, countDay, listVehiclesDays, numVehiclesDays, k) => {
    if (k >= listRequirement.length){
        let distance = 0;
        let minR;
        let vehicleUsedRes = new Array(99999);
        for (let i = 0; i< countDay; i++){
            if (day[i] && day[i].length!==0){
                let k = calMinDistance.calMinDistanceOneDay(day[i], listVehiclesDays[i], numVehiclesDays[i]);
                minR = k.minR;
                vehicleUsedRes[i] = k.vehicleUsedRes?.slice();
                distance+=minR;
            }
        }
        if (distance<totalDistance){
            saveArrVehicle = new Array(99999);
            saveArr = new Array(99999);
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
        if (!selectedRequirement[i]){
            for (let j=0; j< countDay; j++){
                selectedRequirement[i] = true;
                day[j].push(listRequirement[i]);
                generatePlanShortestDistance(listRequirement, countDay, listVehiclesDays, numVehiclesDays, k+1);
                day[j].pop();
                selectedRequirement[i] = false;
            }
        }
    }
}
exports.generatePlanFastestMove = (listRequirement, listPlan, allVehicles, allCarriers, inDay) => {
    saveArr = [];
    saveArrVehicle = new Array(99999)
    let listVehiclesDays = [];
    let numVehiclesDays = [];
    let usableCarriers, usableVehicles;
    for (let i=1;i<=inDay;i++){
        let resultVehicleCarrierUsable = getVehicleCarrierUsable(getNextDay(i), listPlan, allCarriers, allVehicles);
        usableCarriers = resultVehicleCarrierUsable.usableCarriers;
        usableVehicles = resultVehicleCarrierUsable.usableVehicles;
        listVehiclesDays.push(usableVehicles);
        if (usableVehicles.length > Math.floor(usableCarriers.length / 2)){
            numVehiclesDays.push(Math.floor(usableCarriers.length / 2));
        }
        else {
            numVehiclesDays.push(usableVehicles.length);
        }
    }
    for (let i =0; i<inDay;i++){
        day[i] = [];
    }
    generatePlanShortestDistance(listRequirement, inDay, listVehiclesDays, numVehiclesDays, 0);
    let startDay = getNextDay(1);
    return {saveArr, saveArrVehicle, startDay};
}

exports.generatePlan = (listRequirement, listPlan, listVehicles, listCarriers) => {
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
                "lat": 21.032564798002824,
                "lng": 105.88014401746638
            },
            "toAddress": {
                "lat": 21.0107450626611,
                "lng": 105.64554083412237
            }
        },
        "_id": "607d25c59daea504e4902331",
        "status": 2,
        "code": "YCVC20210419.167305",
        "type": 5,
        "creator": null,
        "fromAddress": "95 Ng. 105 Bạch Mai, Thanh Nhàn, Hai Bà Trưng, Hà Nội, Vietnam",
        "toAddress": "2 Phượng Cách, Quốc Oai, Hà Nội, Vietnam",
        "timeRequests": [
            {
                "_id": "607fbec40d35f4290c228e0a",
                "timeRequest": "2021-04-21",
                "description": ""
            },
            {
                "_id": "607fbec40d35f4290c228e0b",
                "timeRequest": "2021-04-22",
                "description": "123"
            },
            {
                "_id": "607fbec40d35f4290c228e0c",
                "timeRequest": "2021-04-21",
                "description": ""
            },
            {
                "_id": "607fbec40d35f4290c228e0d",
                "timeRequest": "2021-04-24",
                "description": ""
            }
        ],
        "volume": 1,
        "payload": 1,
        "createdAt": "2021-04-19T06:40:05.459Z",
        "updatedAt": "2021-05-13T15:26:41.879Z",
        "__v": 0,
        "goods": [
            {
                "_id": "607fbec40d35f4290c228e0e",
                "payload": 1,
                "quantity": 1,
                "volume": 1,
                "good": null
            }
        ],
        "transportPlan": null,
        "historyTransport": []
    },
    {
        "geocode": {
            "fromAddress": {
                "lat": 20.9764601000001,
                "lng": 105.7369397
            },
            "toAddress": {
                "lat": 20.997942715,
                "lng": 105.816376617
            }
        },
        "_id": "60864aa2d7028c1c4ce359b1",
        "status": 2,
        "code": "YCVC20210426.136676",
        "type": 5,
        "creator": null,
        "fromAddress": "la phù hoài đức hà nội",
        "toAddress": "thanh xuân hà nội",
        "goods": [
            {
                "_id": "60864aa2d7028c1c4ce359b2",
                "good": null,
                "quantity": 1,
                "volume": 3,
                "payload": 1
            }
        ],
        "timeRequests": [
            {
                "_id": "60864aa2d7028c1c4ce359b3",
                "timeRequest": "2021-04-26",
                "description": ""
            },
            {
                "_id": "60864aa2d7028c1c4ce359b4",
                "timeRequest": "2021-04-27",
                "description": ""
            }
        ],
        "volume": 3,
        "payload": 1,
        "createdAt": "2021-04-26T05:07:46.773Z",
        "updatedAt": "2021-05-13T15:26:46.278Z",
        "__v": 0,
        "transportPlan": null,
        "historyTransport": []
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
        "_id": "6099f286a77f491b2453da6f",
        "status": 2,
        "code": "YCVC20210511.203280",
        "type": 1,
        "creator": {
            "active": true,
            "status": 0,
            "deleteSoft": false,
            "numberDevice": 1,
            "avatar": "/upload/avatars/user.png",
            "pushNotificationTokens": [],
            "_id": "60950b854fd0700d10bfbadc",
            "name": "Admin VNIST",
            "email": "admin.vnist@gmail.com",
            "password": "$2a$10$CH6wRW5DZ9A3ZnqmIv4/AughjRuQ8fRL4zysrrEL7ZBpeYsGSe9Om",
            "company": "60950b854fd0700d10bfbada",
            "__v": 0,
            "createdAt": "2021-05-07T09:42:29.667Z",
            "updatedAt": "2021-05-10T15:37:20.767Z",
            "id": "60950b854fd0700d10bfbadc"
        },
        "fromAddress": "Trần Đại Nghĩa - Hai Bà Trưng - Hà Nội",
        "toAddress": "Ngọc mỹ, Quốc Oai, Hà Nội",
        "goods": [
            {
                "_id": "6099f287a77f491b2453da70",
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
                "_id": "6099f287a77f491b2453da71",
                "timeRequest": "2021-05-12",
                "description": ""
            },
            {
                "_id": "6099f287a77f491b2453da72",
                "timeRequest": "2021-05-13",
                "description": ""
            },
            {
                "_id": "6099f287a77f491b2453da73",
                "timeRequest": "2021-05-14",
                "description": ""
            }
        ],
        "volume": 10,
        "payload": 10,
        "approver": "60950b854fd0700d10bfbadc",
        "bill": "609565928b0a9a22844c7d97",
        "historyTransport": [],
        "createdAt": "2021-05-11T02:57:11.082Z",
        "updatedAt": "2021-05-13T15:26:46.280Z",
        "__v": 0,
        "transportPlan": null
    }
]

//========================================================================
let allCarriers = [
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
        "updatedAt": "2021-05-11T08:44:00.449Z",
        "id": "60950b854fd0700d10bfbadd"
    },
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
        "updatedAt": "2021-05-07T09:42:29.668Z",
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
        "updatedAt": "2021-05-07T09:42:29.668Z",
        "id": "60950b854fd0700d10bfbae1"
    },
    {
        "active": true,
        "status": 0,
        "deleteSoft": false,
        "numberDevice": 0,
        "avatar": "/upload/avatars/user.png",
        "pushNotificationTokens": [],
        "_id": "60950b854fd0700d10bfbae2",
        "name": "Phạm Đình Phúc",
        "email": "pdp.vnist@gmail.com",
        "password": "$2a$10$CH6wRW5DZ9A3ZnqmIv4/AughjRuQ8fRL4zysrrEL7ZBpeYsGSe9Om",
        "company": "60950b854fd0700d10bfbada",
        "__v": 0,
        "createdAt": "2021-05-07T09:42:29.668Z",
        "updatedAt": "2021-05-07T09:42:29.668Z",
        "id": "60950b854fd0700d10bfbae2"
    },
    {
        "active": true,
        "status": 0,
        "deleteSoft": false,
        "numberDevice": 0,
        "avatar": "/upload/avatars/user.png",
        "pushNotificationTokens": [],
        "_id": "60950b854fd0700d10bfbae5",
        "name": "Trần Minh Đức",
        "email": "tmd.vnist@gmail.com",
        "password": "$2a$10$CH6wRW5DZ9A3ZnqmIv4/AughjRuQ8fRL4zysrrEL7ZBpeYsGSe9Om",
        "company": "60950b854fd0700d10bfbada",
        "__v": 0,
        "createdAt": "2021-05-07T09:42:29.669Z",
        "updatedAt": "2021-05-07T09:42:29.669Z",
        "id": "60950b854fd0700d10bfbae5"
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

// let o = generatePlanFastestMove(allTransportRequirements, null, allVehicles, allCarriers, 2);
// console.log("haha")
// console.log(k);