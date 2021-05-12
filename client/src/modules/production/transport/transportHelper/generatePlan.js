import { isTimeZoneDateSmaller } from './compareDateTimeZone'
getBusyday = (date, listPlan, listCarriers, listVehicles) => { // date timezone
        let usedVehicles=[];
        let usedCarriers=[];
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
        })
        
}
const calDistanceGeocode = (lat1, lng1, lat2, lng2) => {
    return Math.sqrt((lat2- lat1)*(lat2- lat1) + (lng2-lng1)*(lng2-lng1));
}
exports.generatePlan = (listRequirement, listPlan, listVehicle, listCarriers) => {
    const CURRENT_DAY = new Date();
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
                            mark = 5*86400000;
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
    }
}