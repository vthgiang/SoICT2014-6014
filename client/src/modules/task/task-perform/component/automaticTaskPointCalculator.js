export const AutomaticTaskPointCalculator = {
    calcAutoPoint
}

// Replaces all instances of the given substring.
String.prototype.replaceAll = function(
    strTarget, // The substring you want to replace
    strSubString // The string you want to replace in.
    ){
    let strText = this;
    let intIndexOfMatch = strText.indexOf( strTarget );
    
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
    console.log('data', data);

    let splitter = date.split('-');
    let progressTask = progress;
    let evaluationsDate = new Date(splitter[2], splitter[1]-1, splitter[0]);
    let startDate = new Date(task.startDate);
    let endDate = new Date(task.endDate);

    let timeLimitOfWork = endDate.getTime() - startDate.getTime();
    let dayOfWork = evaluationsDate.getTime() - startDate.getTime();
    let overdueDate = (dayOfWork - timeLimitOfWork > 0) ? dayOfWork - timeLimitOfWork : 0;

    console.log('timelimit, dayofWork', timeLimitOfWork, dayOfWork, dayOfWork/timeLimitOfWork);

    // Tính điểm theo độ trễ ngày tương đối
    let autoDependOnDay = progressTask / (dayOfWork/timeLimitOfWork); // tiến độ thực tế / tiến độ lí thuyết
    console.log('------------autoDependOnDay-------------', autoDependOnDay);

    // Các hoạt động (chỉ lấy những hoạt động đã đánh giá)
    let taskActions = task.taskActions;
    let actions = taskActions.filter(item => (
        item.rating !== -1 &&
        // item.evaluations.length !== 0 &&
        new Date(item.createdAt).getMonth() >= evaluationsDate.getMonth() 
        && new Date(item.createdAt).getFullYear() >= evaluationsDate.getFullYear()
    ))

    let actionRating = actions.map(action => action.rating);

    // Tổng số hoạt động
    let a = actionRating.length;

    // Tổng số điểm của các hoạt động
    let reduceAction = actionRating.reduce( (accumulator, currentValue) => accumulator + currentValue, 0);
    reduceAction = reduceAction > 0 ? reduceAction : 0;

    let avgRating = reduceAction/a;
    let autoHasActionInfo = progress/(dayOfWork/timeLimitOfWork) - 0.5*(10-avgRating)*10;
    console.log('==========autoHasActionInfo============',autoHasActionInfo);
    console.log('----------ACTIONRATING-----------', avgRating, a, actionRating);
    let automaticPoint = 0;
    if(task.taskTemplate === null || task.taskTemplate === undefined){ // Công việc không theo mẫu
        automaticPoint = a ? autoHasActionInfo : autoDependOnDay;
    }
    else{ // Công việc theo mẫu
       console.log('formula', task.taskTemplate.formula);

        let formula = task.taskTemplate.formula;
        let taskInformations = info;
        
        // thay các biến bằng giá trị
        formula = formula.replace(/od/g, overdueDate);
        formula = formula.replace(/dow/g, dayOfWork);
        formula = formula.replace(/a/g, avgRating);
        formula = formula.replace(/p0/g, progressTask);
        
        // thay mã code bằng giá trị(chỉ dùng cho kiểu số)
        for(let i in taskInformations){
            if(taskInformations[i].type === 'Number'){
                let stringToGoIntoTheRegex = `${taskInformations[i].code}`;
                let regex = new RegExp( stringToGoIntoTheRegex, "g");
                formula = formula.replace(regex, `${taskInformations[i].value}`);
            }
        }
        
        // thay tất cả các biến có dạng p0, p1, p2,... còn lại thành undefined, để nếu không có giá trị thì sẽ trả về NaN, tránh được lỗi undefined
        for(let i = 0; i < 100; i++){
            let stringToGoIntoTheRegex = 'p'+i;
            let regex = new RegExp( stringToGoIntoTheRegex, "g");
            formula = formula.replace(regex, undefined);
        }

        console.log('new formula', formula);

        automaticPoint = eval(formula);

        console.log('automaticPoint', automaticPoint);
    }
    
    // automaticPoint = ( !isNaN(automaticPoint) && automaticPoint > 0 ) ? automaticPoint : 0;
    return Math.round(Math.min(automaticPoint, 100));
}
