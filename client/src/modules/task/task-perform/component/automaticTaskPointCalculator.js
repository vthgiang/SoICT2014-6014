export const AutomaticTaskPointCalculator = {
    calculateAutomaticPoint,
    
}

function calculateAutomaticPoint(task) {
    let today = new Date();
    let startDate = new Date(task.startDate);
    let endDate = new Date(task.endDate);

    // Số ngày quá hạn
    let d0 = today.getTime() - endDate.getTime() > 0 ? today.getTime() - endDate.getTime() : 0;

    // Tổng số ngày thực hiện công việc
    let d = endDate.getTime() - startDate.getTime();

    let taskActions = task.taskActions;
    let actionRating = taskActions.map(action => action.rating)

    let automaticPoint = -1;
    
    if(task.taskTemplate === null || task.taskTemplate === undefined){ // Công việc không theo mẫu
        // Tổng số điểm của các hoạt động
        let reduceAction = actionRating.reduce( (accumulator, currentValue) => accumulator + currentValue, 0);
        reduceAction = reduceAction > 0 ? reduceAction : 0;

        automaticPoint = 100 - (d0)/(d)*100 - ( (10*3-reduceAction)/10/3 )*100;
    }
    else{ // Công việc theo mẫu

        // Tổng số hoạt động
        let a = actionRating.length;

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
    }
    
    return automaticPoint;
}