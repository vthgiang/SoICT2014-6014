export const AutomaticTaskPointCalculator = {
    calculateAutomaticPoint,
    
}

function calculateAutomaticPoint(task) {
    let lastEvaluations = task.evaluations[task.evaluations.length - 1];
    let progress = task.progress;
    let evaluationsDate = new Date(lastEvaluations.date);

    let startDate = new Date(task.startDate);
    let endDate = new Date(task.endDate);
    evaluationsDate = evaluationsDate.getTime() < endDate.getTime() ? evaluationsDate : endDate;

    // Tổng số ngày thực hiện công việc tính đến thời điểm đánh giá
    let d = evaluationsDate.getTime() - startDate.getTime();

    // Số ngày quá hạn tương đối
    let d0 = (evaluationsDate - startDate.getTime()) - (progress * (endDate.getTime() - startDate.getTime()) ) / 100;

    // Các hoạt động (chỉ lấy những hoạt động đã đánh giá)
    let taskActions = task.taskActions;
    let actionRating = taskActions.filter(item => item.rating !== -1).map(action => action.rating);
    // Tổng số hoạt động
    let a = actionRating.length;

    let automaticPoint = -1;
    
    if(task.taskTemplate === null || task.taskTemplate === undefined){ // Công việc không theo mẫu
        // Tổng số điểm của các hoạt động
        let reduceAction = actionRating.reduce( (accumulator, currentValue) => accumulator + currentValue, 0);
        reduceAction = reduceAction > 0 ? reduceAction : 0;

        automaticPoint = 100 - (d0)/(d)*100 - ( (10*a - reduceAction)/10/a )*100;
    }
    else{ // Công việc theo mẫu
        // Tổng số lần duyệt "Chưa đạt" cho các hoạt động
        let ad = actionRating.filter(x => x.rating > 5).length; // mấy điểm thì đạt???

        let formula = task.taskTemplate.formula;
        let taskInformations = task.taskInformations;

        // thay mã code bằng giá trị(chỉ dùng cho kiểu số)
        for(let item of taskInformations){
            if(item.type === 'Number'){
                formula = formula.replace(`${item.code}`, `${item.value}`); 
            }
        }

        automaticPoint = eval(formula);            

        automaticPoint = automaticPoint * (endDate.getTime() - startDate.getTime()) / d;
    }
    
    return min(automaticPoint, 100);
}



// function calculateAutomaticPoint(task) {
//     let today = new Date();
//     let startDate = new Date(task.startDate);
//     let endDate = new Date(task.endDate);

//     // Số ngày quá hạn
//     let d0 = today.getTime() - endDate.getTime() > 0 ? today.getTime() - endDate.getTime() : 0;

//     // Tổng số ngày thực hiện công việc
//     let d = endDate.getTime() - startDate.getTime();

//     let taskActions = task.taskActions;
//     let actionRating = taskActions.map(action => action.rating)

//     let automaticPoint = -1;
    
//     if(task.taskTemplate === null || task.taskTemplate === undefined){ // Công việc không theo mẫu
//         // Tổng số điểm của các hoạt động
//         let reduceAction = actionRating.reduce( (accumulator, currentValue) => accumulator + currentValue, 0);
//         reduceAction = reduceAction > 0 ? reduceAction : 0;

//         automaticPoint = 100 - (d0)/(d)*100 - ( (10*3-reduceAction)/10/3 )*100;
//     }
//     else{ // Công việc theo mẫu

//         // Tổng số hoạt động
//         let a = actionRating.length;

//         // Tổng số lần duyệt "Chưa đạt" cho các hoạt động
//         let ad = actionRating.filter(x => x.rating > 5).length; // mấy điểm thì đạt???

//         let formula = task.taskTemplate.formula;
//         let taskInformations = task.taskInformations;

//         // thay mã code bằng giá trị(chỉ dùng cho kiểu số)
//         for(let item of taskInformations){
//             if(item.type === 'Number'){
//                 formula = formula.replace(`${item.code}`, `${item.value}`); 
//             }
//         }

//         automaticPoint = eval(formula);            
//     }
    
//     return automaticPoint;
// }
