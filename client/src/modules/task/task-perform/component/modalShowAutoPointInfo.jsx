import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal } from '../../../../common-components';

class ModalShowAutoPointInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {}
        
    }

    formatDate = (date) => {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
    
        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
        
        return [day, month, year].join('-');
    }

    render() {
        const { task, progress, date, info} = this.props; // props from parent component
        
        let taskInformations = task.taskInformations;

        let splitter = date.split('-');
        let evaluationsDate = new Date(splitter[2], splitter[1]-1, splitter[0]);
        let startDate = new Date(task.startDate);
        let endDate = new Date(task.endDate);

        let totalDay = endDate.getTime() - startDate.getTime();
        let dayUsed = evaluationsDate.getTime() - startDate.getTime();
        let overdueDate = (dayUsed - totalDay > 0) ? dayUsed - totalDay : 0;

        // chuyển về đơn vị ngày
        totalDay = totalDay/86400000;
        dayUsed = dayUsed/86400000;
        overdueDate = overdueDate/86400000;

        // Các hoạt động (chỉ lấy những hoạt động đã đánh giá)
        let taskActions = task.taskActions;
        let actions = taskActions.filter(item => (
            item.rating !== -1 &&
            new Date(item.createdAt).getMonth() >= evaluationsDate.getMonth() 
            && new Date(item.createdAt).getFullYear() >= evaluationsDate.getFullYear()
        ))

        let actionRating = actions.map(action => action.rating);

        // Tổng số hoạt động
        let a = actionRating.length;

        // Tổng số điểm của các hoạt động
        let reduceAction = actionRating.reduce( (accumulator, currentValue) => accumulator + currentValue, 0);
        reduceAction = reduceAction > 0 ? reduceAction : 0;

        let averageActionRating = reduceAction/a;
        let formula = task.taskTemplate && task.taskTemplate.formula;
        if(task.taskTemplate){

            let taskInformations = info;
            // formula = task.taskTemplate.formula;
        
            // thay các biến bằng giá trị
            formula = formula.replace(/overdueDate/g, overdueDate);
            formula = formula.replace(/totalDay/g, totalDay);
            formula = formula.replace(/dayUsed/g, dayUsed);
            formula = formula.replace(/averageActionRating/g, averageActionRating);
            formula = formula.replace(/progress/g, progress);
            
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
        }

        return (
            <React.Fragment>
                <DialogModal
                    size="50"
                    modalID={`modal-automatic-point-info`}
                    formID="form-automatic-point-info"
                    title={`Thông tin điểm tự động của công việc`} 
                    hasSaveButton={false}
                >
                    {
                        (task.taskTemplate !== null && task.taskTemplate !== undefined) &&
                        <div>
                            <p><strong>Công thức tính: </strong>{task.taskTemplate.formula}</p>
                            <p>Trong đó: </p>
                            <ul>
                                <li>overdueDate: Thời gian quá hạn: {overdueDate} (ngày)</li>
                                <li>dayUsed: Thời gian làm việc tính đến ngày đánh giá: {dayUsed} (ngày)</li>
                                <li>averageActionRating: Trung bình cộng điểm đánh giá hoạt động: {averageActionRating} </li>
                                <li>progress: Tiến độ công việc: {progress} (%)</li>
                                {
                                    taskInformations && taskInformations.map(e => {
                                        if(e.type === 'Number'){
                                            return <li>{e.code}: {e.name}: {(info[`${e.code}`] && info[`${e.code}`].value) ? info[`${e.code}`].value: "Chưa có giá trị" }</li>
                                        }
                                    })
                                }
                            </ul>
                            <p><strong>Công thức hiện tại: </strong>{formula} = {this.props.autoPoint}</p>
                        </div> 
                    }
                    {
                        ((task.taskTemplate === null || task.taskTemplate === undefined) && a === 0) &&
                        <div>
                            <p><strong>Công thức tính: </strong> progress/(dayUsed/totalDay)</p>
                            <p>Trong đó: </p>
                            <ul>
                                <li>progress: Tiến độ công việc: {progress} (%)</li>
                                <li>dayUsed: Thời gian làm việc tính đến ngày đánh giá: {dayUsed} (ngày)</li>
                                <li>totalDay: Thời gian từ ngày bắt đầu đến ngày kết thúc công việc: {totalDay} (ngày)</li>
                            </ul>
                            <p><strong>Công thức hiện tại: </strong>{progress}/({dayUsed}/{totalDay}) = {this.props.autoPoint}</p>
                        </div>
                    }
                    {
                        ((task.taskTemplate === null || task.taskTemplate === undefined) && a !== 0) &&
                        <div>
                            <p><strong>Công thức tính: </strong> progress/(dayUsed/totalDay) - 0.5*(10-averageActionRating)*10</p>
                            <p>Trong đó: </p>
                            <ul>
                                <li>progress: Tiến độ công việc: {progress} (%)</li>
                                <li>averageActionRating: Trung bình cộng điểm đánh giá hoạt động: {averageActionRating}</li>
                                <li>dayUsed: Thời gian làm việc tính đến ngày đánh giá: {dayUsed} (ngày)</li>
                                <li>totalDay: Thời gian từ ngày bắt đầu đến ngày kết thúc công việc: {totalDay} (ngày)</li>
                            </ul>
                        <p><strong>Công thức hiện tại: </strong>{progress}/({dayUsed}/{totalDay}) - {0.5}*({10}-{averageActionRating})*{10} = {this.props.autoPoint}</p>
                        </div>
                    }

                </DialogModal>
            </React.Fragment>
        );
    }
}

function mapState(state) {
    const { tasks } = state;
    return { tasks };
}

const modalShowAutoPointInfo = connect(mapState, null)(withTranslate(ModalShowAutoPointInfo));
export { modalShowAutoPointInfo as ModalShowAutoPointInfo }


