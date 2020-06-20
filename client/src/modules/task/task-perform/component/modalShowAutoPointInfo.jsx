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
        const { task, progress, date, info} = this.props; 
        
        let taskInformations = task.taskInformations;

        let splitter = date.split('-');
        let evaluationsDate = new Date(splitter[2], splitter[1]-1, splitter[0]);
        let startDate = new Date(task.startDate);
        let endDate = new Date(task.endDate);

        let timeLimitOfWork = endDate.getTime() - startDate.getTime();
        let dayOfWork = evaluationsDate.getTime() - startDate.getTime();
        let overdueDate = (dayOfWork - timeLimitOfWork > 0) ? dayOfWork - timeLimitOfWork : 0;

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

        let avgRating = reduceAction/a;

        return (
            <React.Fragment>
                <DialogModal
                    size="50"
                    modalID={`modal-automatic-point-info`}
                    formID="form-automatic-point-info"
                    title={`Thông tin điểm tự động của công việc`} 
                    // bodyStyle={{padding: "0px"}}
                    hasSaveButton={false}
                >
                    {
                        (task.taskTemplate !== null && task.taskTemplate !== undefined) &&
                        <div>
                            <p><strong>Công thức tính: </strong>{task.taskTemplate.formula}</p>
                            <p>Trong đó: </p>
                            <ul>
                                <li>od: Thời gian quá hạn: {overdueDate} (ms)</li>
                                <li>dow: Thời gian làm việc tính đến ngày đánh giá: {dayOfWork} (ms)</li>
                                <li>a: Trung bình cộng điểm đánh giá hoạt động: {avgRating} </li>
                                <li>p0: Tiến độ công việc: {progress} (%)</li>
                                {
                                    taskInformations && taskInformations.map(e => {
                                        if(e.type === 'Number'){
                                            return <li>{e.code}: {e.name}: {(info[`${e.code}`].value === undefined) ? "Chưa có giá trị" : info[`${e.code}`].value}</li>
                                        }
                                    })
                                }
                            </ul>
                        </div> 
                    }
                    {
                        ((task.taskTemplate === null || task.taskTemplate === undefined) && a === 0) &&
                        <div>
                            <p><strong>Công thức tính: </strong> progress/(dayOfWork/timeLimitOfWork)</p>
                            <p>Trong đó: </p>
                            <ul>
                                <li>progress: Tiến độ công việc: {progress} (%)</li>
                                <li>dayOfWork: Thời gian làm việc tính đến ngày đánh giá: {dayOfWork} (ms)</li>
                                <li>timeLimitOfWork: Thời gian từ ngày bắt đầu đến ngày kết thúc công việc: {timeLimitOfWork} (ms)</li>
                            </ul>
                        </div>
                    }
                    {
                        ((task.taskTemplate === null || task.taskTemplate === undefined) && a !== 0) &&
                        <div>
                            <p><strong>Công thức tính: </strong> progress/(dayOfWork/timeLimitOfWork) - 0.5*(10-avgRating)*10</p>
                            <p>Trong đó: </p>
                            <ul>
                                <li>progressTask: Tiến độ công việc: {progress} (%)</li>
                                <li>avgRating: Trung bình cộng điểm đánh giá hoạt động: {avgRating}</li>
                                <li>dayOfWork: Thời gian làm việc tính đến ngày đánh giá: {dayOfWork} (ms)</li>
                                <li>timeLimitOfWork: Thời gian từ ngày bắt đầu đến ngày kết thúc công việc: {timeLimitOfWork} (ms)</li>
                            </ul>
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


