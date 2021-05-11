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

exports.generatePlan = (listRequirement, listPlan, listVehicle, listCarriers) => {

}