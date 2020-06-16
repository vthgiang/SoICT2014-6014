export const AutomaticTaskPointCalculator = {
    calculateAutomaticPoint,
    calcAutoPoint
}

// task: this.state.task,
// progress: this.state.progress,
// date: this.state.date,
// info: this.state.info,

function calcAutoPoint(data) {
    let { task, date, progress, info } = data;

    let splitter = date.split('-');
    let progressTask = progress;
    let evaluationsDate = new Date(splitter[2], splitter[1]-1, splitter[0]);
    let startDate = new Date(task.startDate);
    let endDate = new Date(task.endDate);

    let timeLimitOfWork = endDate.getTime() - startDate.getTime();
    let dayOfWork = evaluationsDate.getTime() - startDate.getTime();

    console.log('timelimit, dayofWork', timeLimitOfWork, dayOfWork, dayOfWork/timeLimitOfWork, progressTask);

    // Tính điểm theo độ trễ ngày tương đối
    let autoDependOnDay = 100 * progressTask / (100 * dayOfWork/timeLimitOfWork); // tiến độ thực tế / tiến độ lí thuyết
    console.log('------------autoDependOnDay-------------', autoDependOnDay);

    // Các hoạt động (chỉ lấy những hoạt động đã đánh giá)
    let taskActions = task.taskActions;
    let actionRating = taskActions.filter(item => (
        item.rating !== -1 
        // && item.createdAt.getMonth() >= evaluationsDate.getMonth() 
        // && item.createdAt.getFullYear() >= evaluationsDate.getFullYear()
    )).map(action => action.rating);
    
    // Tổng số hoạt động
    let a = actionRating.length;

    // Tổng số điểm của các hoạt động
    let reduceAction = actionRating.reduce( (accumulator, currentValue) => accumulator + currentValue, 0);
    reduceAction = reduceAction > 0 ? reduceAction : 0;

    let autoHasActionInfo = 100 * (1 - (1-(progress*timeLimitOfWork)/dayOfWork ) - (10*a - reduceAction)/10/a )
    console.log('---------autoHasActionInfo-----------',autoHasActionInfo);

    let automaticPoint = 0;
    if(task.taskTemplate === null || task.taskTemplate === undefined){ // Công việc không theo mẫu
        automaticPoint = a ? autoHasActionInfo : autoDependOnDay;
        console.log('---------- automaticPoint-----------', automaticPoint);
    }
    else{ // Công việc theo mẫu
        // Tổng số lần duyệt "Chưa đạt" cho các hoạt động
        let ad = actionRating.filter(x => x.rating > 5).length; // mấy điểm thì đạt???
        console.log('formulaaaaaaaaaaaaaa', task.taskTemplate.formula);

        let formula = task.taskTemplate.formula;
        let taskInformations = info;

        // thay mã code bằng giá trị(chỉ dùng cho kiểu số)
        for(let i in taskInformations){
            console.log(`${taskInformations[i].code}`, `${taskInformations[i].value}-------------`);
            if(taskInformations[i].type === 'Number'){
                formula = formula.replace(`${taskInformations[i].code}`, `${taskInformations[i].value}`); 
                console.log(`${taskInformations[i].code}`, `${taskInformations[i].value}-------------`);
            }
        }
        console.log('----------------------new form', formula);
        automaticPoint = eval(formula);            

        console.log('autoooooFormulaaaaa1111', automaticPoint);
        automaticPoint = automaticPoint * timeLimitOfWork / dayOfWork;
        console.log('autoooooFormulaaaaa2222', automaticPoint);
    }
    
    return Math.round(Math.min(automaticPoint, 100));
}





function calculateAutomaticPoint(task) {
    let lastEvaluations = task.evaluations[task.evaluations.length - 1];
    let progress = task.progress;
    let evaluationsDate = new Date(lastEvaluations.date);
    console.log('evaluateDateeeeeeeeee', evaluationsDate);
    let startDate = new Date(task.startDate);
    let endDate = new Date(task.endDate);
    evaluationsDate = evaluationsDate.getTime() < endDate.getTime() ? evaluationsDate : endDate;

    // Tổng số ngày thực hiện công việc tính đến thời điểm đánh giá
    let d = evaluationsDate.getTime() - startDate.getTime();

    // Số ngày quá hạn tương đối
    let d0 = (evaluationsDate.getTime() - startDate.getTime()) - (progress * (endDate.getTime() - startDate.getTime()) ) / 100;
    console.log('d00000000000000, d', d0, d, (d0)/(d));
    // Các hoạt động (chỉ lấy những hoạt động đã đánh giá)
    let taskActions = task.taskActions;
    let actionRating = taskActions.filter(item => item.rating !== -1).map(action => action.rating);
    // Tổng số hoạt động
    let a = actionRating.length;

    let automaticPoint = -1;
    console.log('----------------actionRating, a----------------', actionRating, a);
    if(task.taskTemplate === null || task.taskTemplate === undefined){ // Công việc không theo mẫu
        // Tổng số điểm của các hoạt động
        let reduceAction = actionRating.reduce( (accumulator, currentValue) => accumulator + currentValue, 0);
        reduceAction = reduceAction > 0 ? reduceAction : 0;
        console.log('reduceActionnnnnnnnnnnnn2222', reduceAction);
        automaticPoint = a ? ( 100 - (d0)/(d)*100 - ( (10*a - reduceAction)/10/a )*100 ) : ( 100 - (d0)/(d)*100 );
        console.log('---------- automaticPoint-----------', automaticPoint);
    }
    else{ // Công việc theo mẫu
        // Tổng số lần duyệt "Chưa đạt" cho các hoạt động
        let ad = actionRating.filter(x => x.rating > 5).length; // mấy điểm thì đạt???

        let formula = task.taskTemplate.formula;
        let taskInformations = lastEvaluations.taskInformations;

        // thay mã code bằng giá trị(chỉ dùng cho kiểu số)
        for(let item of taskInformations){
            if(item.type === 'Number'){
                formula = formula.replace(`${item.code}`, `${item.value}`); 
            }
        }
        
        automaticPoint = eval(formula);            

        automaticPoint = automaticPoint * (endDate.getTime() - startDate.getTime()) / d;
    }
    
    return Math.round(Math.min(automaticPoint, 100));
}



// function calculateAutomaticPoint(task) {
//     let today = new Date();
//     let startDate = new Date(task.startDate);
//     let endDate = new Date(task.endDate);

//     // Số ngày quá hạn
//     let dO = today.getTime() - endDate.getTime() > 0 ? today.getTime() - endDate.getTime() : 0;

//     // Tổng số ngày thực hiện công việc
//     let d = endDate.getTime() - startDate.getTime();

//     let taskActions = task.taskActions;
//     let actionRating = taskActions.map(action => action.rating)

//     let automaticPoint = -1;
    
//     if(task.taskTemplate === null || task.taskTemplate === undefined){ // Công việc không theo mẫu
//         // Tổng số điểm của các hoạt động
//         let reduceAction = actionRating.reduce( (accumulator, currentValue) => accumulator + currentValue, 0);
//         reduceAction = reduceAction > 0 ? reduceAction : 0;

//         automaticPoint = 100 - (dO)/(d)*100 - ( (10*3-reduceAction)/10/3 )*100;
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
