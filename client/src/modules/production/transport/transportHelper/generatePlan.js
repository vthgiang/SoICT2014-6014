import { isTimeZoneDateSmaller } from './compareDateTimeZone'
const calMinDistance = require('./generatePlan/calMinDistanceOneDay')

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
let saveArr = [];
const generatePlanShortestDistance = (listRequirement, countDay, listVehiclesDays, numVehiclesDays, k) => {
    if (k >= listRequirement-1){
        let distance = 0;
        for (let i = 0; i< countDay; i++){
            if (day[i] && day[i].length!==0){
                distance+=calMinDistance.calMinDistanceOneDay(day[i], listVehiclesDays[i], numVehiclesDays[i])
            }
        }
        if (distance<totalDistance){
            saveArr = day;
            totalDistance = distance;
        }
        return;
    }
    for (let i=0; i<listRequirement.length;i++) {
        if (!selectedRequirement[i]){
            for (let j=0; j< countDay; j++){
                selectedRequirement[i] = true;
                day[i].push(selectedRequirement);
                generatePlanShortestDistance(listRequirement, countDay, listVehiclesDays, numVehiclesDays, k+1);
                day[i].pop();
                selectedRequirement[i] = false;
            }
        }
    }
}
exports.generatePlanFastestMove = (listRequirement, listPlan, allVehicles, allCarriers, inDay) => {
    let listVehiclesDays = [];
    let numVehiclesDays = [];
    let usableCarriers, usableVehicles;
    for (let i=1;i<=inDay;i++){
        let resultVehicleCarrierUsable = getVehicleCarrierUsable(getNextDay(i), listPlan, allCarriers, allVehicles);
        usableCarriers = resultVehicleCarrierUsable.usableCarriers;
        usableVehicles = resultVehicleCarrierUsable.usableVehicles;
        listVehiclesDays.push(usableVehicles);
        if (usableVehicles.length > Math.floor(usedCarriers.length / 2)){
            numVehiclesDays.push(Math.floor(usedCarriers.length / 2));
        }
        else {
            numVehiclesDays.push(usableVehicles.length);
        }
    }
    generatePlanShortestDistance(listRequirement, inDay, listVehiclesDays, numVehiclesDays, 0);
    return saveArr;
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