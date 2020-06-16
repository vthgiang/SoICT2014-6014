export const AutomaticTaskPointCalculator = {
    calculateAutomaticPoint,
    calcAutoPoint
}

// task: this.state.task,
// progress: this.state.progress,
// date: this.state.date,
// info: this.state.info,

// Replaces all instances of the given substring.
String.prototype.replaceAll = function(
    strTarget, // The substring you want to replace
    strSubString // The string you want to replace in.
    ){
    var strText = this;
    var intIndexOfMatch = strText.indexOf( strTarget );
    
    // Keep looping while an instance of the target string
    // still exists in the string.
    while (intIndexOfMatch != -1){ // có thể bị lặp vô hạn vì có trường hợp thay x = x
    // Relace out the current instance.
    strText = strText.replace( strTarget, strSubString )
    
    // Get the index of any next matching substring.
    intIndexOfMatch = strText.indexOf( strTarget );
    }
    
    // Return the updated string with ALL the target strings
    // replaced out with the new substring.
    return( strText );
}

function calcAutoPoint(data) {
    let { task, date, progress, info } = data;

    let splitter = date.split('-');
    let progressTask = progress;
    let evaluationsDate = new Date(splitter[2], splitter[1]-1, splitter[0]);
    let startDate = new Date(task.startDate);
    let endDate = new Date(task.endDate);

    let timeLimitOfWork = endDate.getTime() - startDate.getTime();
    let dayOfWork = evaluationsDate.getTime() - startDate.getTime();
    let overdueDate = (dayOfWork - timeLimitOfWork > 0) ? dayOfWork - timeLimitOfWork : 0;

    console.log('timelimit, dayofWork', timeLimitOfWork, dayOfWork, dayOfWork/timeLimitOfWork, progressTask);

    // Tính điểm theo độ trễ ngày tương đối
    let autoDependOnDay = 100 * progressTask / (100 * dayOfWork/timeLimitOfWork); // tiến độ thực tế / tiến độ lí thuyết
    console.log('------------autoDependOnDay-------------', autoDependOnDay);

    // Các hoạt động (chỉ lấy những hoạt động đã đánh giá)
    let taskActions = task.taskActions;
        
    let actions = taskActions.filter(item => (
        // item.rating !== -1 && 
        item.evaluations.length !== 0
        && new Date(item.createdAt).getMonth() >= evaluationsDate.getMonth() 
        && new Date(item.createdAt).getFullYear() >= evaluationsDate.getFullYear()
    ))

    let actionEvaluations = actions.map(actions => actions.evaluations);
    let actionRating = [];
    for(let item of actionEvaluations){
        let lengthOfItem = item.length;
        let reduceItem = item.reduce( (accumulator, currentValue) => accumulator + currentValue.rating, 0);
        let avgItem = reduceItem/lengthOfItem;
        actionRating.push(avgItem);
    }
    // Tổng số hoạt động
    let a = actionRating.length;

    // Tổng số điểm của các hoạt động
    let reduceAction = actionRating.reduce( (accumulator, currentValue) => accumulator + currentValue, 0);
    reduceAction = reduceAction > 0 ? reduceAction : 0;

    let avgRating = reduceAction/a;
    let autoHasActionInfo = 100 * ((avgRating*a/10) + (((progress/100)*timeLimitOfWork)/dayOfWork ))/(a+1)
    console.log('==========autoHasActionInfo============',autoHasActionInfo);
    console.log('----------ACTIONRATING-----------', avgRating, a, actionRating);
    let automaticPoint = 0;
    if(task.taskTemplate === null || task.taskTemplate === undefined){ // Công việc không theo mẫu
        automaticPoint = a ? autoHasActionInfo : autoDependOnDay;
        console.log('----------automaticPoint-----------', automaticPoint);
    }
    else{ // Công việc theo mẫu
        // Tổng số lần duyệt "Chưa đạt" cho các hoạt động
        let ad = actionRating.filter(x => x.rating > 5).length; // mấy điểm thì đạt???
        
        var stringToGoIntoTheRegex = "1";
        var regex = new RegExp( stringToGoIntoTheRegex, "g");

        console.log('formulaaaaaaaaaaaaaa', task.taskTemplate.formula);

        let formula = task.taskTemplate.formula;
        let taskInformations = info;
        
        //  EX Formula: 100*(1-(p1/p2)-(p3/p4)-(od/d)-(ad/a)) ==> 100*(1-(p1/p2)-(p3/p4)-(od/d)-((10-a)/10))
        
        // thay các biến bằng giá trị
        formula = formula.replace(/od/g, overdueDate);
        formula = formula.replace(/dow/g, dayOfWork);
        formula = formula.replace(/a/g, avgRating);
        formula = formula.replace(/p0/g, progressTask);
        // formula = formula.replace('od', overdueDate);
        // formula = formula.replace('dow', dayOfWork);
        // formula = formula.replace('a', avgRating);
        // formula = formula.replace('p0', progressTask);
        
        // thay mã code bằng giá trị(chỉ dùng cho kiểu số)
        for(let i in taskInformations){
            if(taskInformations[i].type === 'Number'){
                var stringToGoIntoTheRegex = `${taskInformations[i].code}`;
                var regex = new RegExp( stringToGoIntoTheRegex, "g");
                formula = formula.replace(regex, `${taskInformations[i].value}`);
            }
        }
        
        console.log('formulaaaaaaaaaaaaaa2222', task.taskTemplate.formula);

        automaticPoint = eval(formula);

        console.log('autoooooFormulaaaaa1111', automaticPoint);
        automaticPoint = automaticPoint * timeLimitOfWork / dayOfWork;
        console.log('autoooooFormulaaaaa2222', automaticPoint);
    }
    
    // automaticPoint = automaticPoint > 0 ? automaticPoint : 0;
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
