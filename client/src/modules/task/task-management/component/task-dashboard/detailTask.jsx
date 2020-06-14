import React, { Component } from 'react';
// import { Component } from '@fullcalendar/core';
import { connect } from 'react-redux';
import { DialogModal} from '../../../../../common-components/index';
import {taskManagementActions} from '../../../task-management/redux/actions'

class ModelDetailTask2 extends Component{
    constructor (props) {
        super(props);
    }
    // componentDidMount(){
    //     this.props.getTaskById(this.props.id);
    // }
    // componentDidMount() {
    //     this.props.getAllUserSameDepartment(localStorage.getItem("currentRole"));
    //     this.props.getAllKPIMemberOfUnit(this.state.infosearch);
    // }
    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [day, month, year].join('/');
    }
    render(){
        const {tasks} = this.props;
        // var task = tasks && tasks.tasks;

        // console.log(this.props.id);
        // console.log(tasks.responsibleTasks);
        if(tasks.responsibleTasks){
        var task = tasks.responsibleTasks.find((Obj => Obj._id === this.props.id));
        console.log(task);
        }
          (task && task.responsibleEmployees.length !== 0) && console.log(task.responsibleEmployees);
            // task.responsibleEmployees.map(item => {
            //     // if (task.inactiveEmployees.indexOf(item._id) !== -1) {
            //         console.log(item.name)
            //     // } else {
            //     //     console.log(item.name); 
            //     // }

            // })
        return(
            <React.Fragment>
            <DialogModal
                modalID={`modal-detail-task`}
                title={`Thông tin chi tiết công việc`}
                hasSaveButton ={false}
                size={75}>
                
                <div className="row">
                            <div className="col-sm-6">
                                <fieldset className="scheduler-border" style={{ /*border: "1px solid #fff" */ }}>
                                    <legend className="scheduler-border">Thông tin chung</legend>

                                    {/* Description */}
                                    <div>
                                        <dt>Mô tả</dt>
                                        <dd>
                                            {task && task.description}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt>Ngày bắt đầu</dt>
                                        <dd>{task && this.formatDate(task.startDate)}</dd>

                                        <dt>Ngày kết thúc</dt>
                                        <dd>{task && this.formatDate(task.endDate)}</dd>
                                    </div>
                                    {/* <div>
                                        <dt>Người thực hiện</dt>
                                        <dd>
                                            <ul>
                                                {
                                                    (task && task.responsibleEmployees.length !== 0) &&
                                                    task.responsibleEmployees.map(item => {
                                                        if (task.inactiveEmployees.indexOf(item._id) !== -1) {
                                                            return <li><u>{item.name}</u></li>
                                                        } else {
                                                            return <li>{item.name}</li>
                                                        }

                                                    })
                                                }
                                            </ul>
                                        </dd>
                                        <dt>Người phê duyệt</dt>
                                        <dd>
                                            <ul>
                                                {
                                                    (task && task.accountableEmployees.length !== 0) &&
                                                    task.accountableEmployees.map(item => {
                                                        if (task.inactiveEmployees.indexOf(item._id) !== -1) {
                                                            return <li><u>{item.name}</u></li>
                                                        } else {
                                                            return <li>{item.name}</li>
                                                        }
                                                    })
                                                }
                                            </ul>
                                        </dd>

                                        {
                                            (task && task.consultedEmployees.length !== 0) &&
                                            <React-Fragment>
                                                <dt>Người hỗ trợ</dt>
                                                <dd>
                                                    <ul>
                                                        {
                                                            (task && task.consultedEmployees.length !== 0) &&
                                                            task.consultedEmployees.map(item => {
                                                                if (task.inactiveEmployees.indexOf(item._id) !== -1) {
                                                                    return <li><u>{item.name}</u></li>
                                                                } else {
                                                                    return <li>{item.name}</li>
                                                                }
                                                            })
                                                        }
                                                    </ul>
                                                </dd>
                                            </React-Fragment>
                                        }
                                        {
                                            (task && task.informedEmployees.length !== 0) &&
                                            <React-Fragment>
                                            <dt>Người quan sát</dt>
                                            <dd>
                                                <ul>
                                                    {
                                                        (task && task.informedEmployees.length !== 0) &&
                                                        task.informedEmployees.map(item => {
                                                            if (task.inactiveEmployees.indexOf(item._id) !== -1) {
                                                                return <li><u>{item.name}</u></li>
                                                            } else {
                                                                return <li>{item.name}</li>
                                                            }
                                                        })
                                                    }
                                                </ul>
                                            </dd>
                                            </React-Fragment>
                                        }
                                    </div> */}

                                    <div>
                                        {/* Task information*/}
                                        <dt>Thông tin công việc</dt>
                                        <dd>
                                            <ul>
                                                <li>Mức độ hoàn thành: &nbsp;&nbsp; {task && task.progress}%</li>
                                                {(task && task.point && task.point !== -1) ?
                                                    <li>Điểm công việc &nbsp;&nbsp; {task && task.point}%</li> :
                                                    <li>Điểm công việc &nbsp;&nbsp; Chưa được tính</li>
                                                }
                                                {
                                                    (task && task.taskInformations.length !== 0) &&
                                                    task.taskInformations.map(info => {
                                                        
                                                        if(info.type === "Date") {
                                                            return <li>{info.name}&nbsp;-&nbsp;Giá trị: {info.value ? this.formatDate(info.value) : "Chưa đánh giá tháng này"}</li>
                                                        }
                                                        return <li>{info.name}: &nbsp;&nbsp;{info.value? info.value: "Chưa có thông tin"}</li>
                                                    })
                                                }
                                            </ul>
                                        </dd>
                                    </div>
                                </fieldset>
                            </div>
                            <div className="col-sm-6">
                                <fieldset className="scheduler-border">
                                    <legend className="scheduler-border">Đánh giá công việc</legend>

                                    {/* Evaluations */}
                                    <div>
                                        {
                                            (task && task.evaluations && task.evaluations.length !== 0 ) && 
                                            task.evaluations.map(eva => {
                                                return (
                                                <div style={{paddingBottom: 10}}>
                                                    
                                                    {/* { eva.results.length !== 0 ? */}
                                                        {/* // <dt>Đánh giá ngày {this.formatDate(eva.date)}</dt> : <dt>Đánh giá tháng {new Date(eva.date).getMonth() + 1}</dt> */}
                                                        <dt>Đánh giá ngày {this.formatDate(eva.date)}</dt>
                                                    {/* } */}
                                                    
                                                    <dd>
                                                        {
                                                        eva.results.length !== 0 &&
                                                        <div>
                                                            <div><strong>Điểm các thành viên</strong> (Tự động - Tự đánh giá - Người phê duyệt đánh giá)</div>
                                                            <ul>
                                                            { (eva.results.length !== 0) ?
                                                                eva.results.map((res) => {
                                                                    return <li>{res.employee.name} - {res.automaticPoint?res.automaticPoint:"Chưa có điểm tự động"} - {res.employeePoint?res.employeePoint:"Chưa tự đánh giá"} - {res.approvedPoint?res.approvedPoint:"Chưa có điểm phê duyệt"}</li>
                                                                }) : <li>Chưa có ái đánh giá công việc tháng này</li>
                                                            }
                                                            </ul>

                                                            {/* Danh gia theo task infomation - thoong tin cong viec thang vua qua lam duoc nhung gi */}
                                                            <div><strong>Thông tin công việc</strong></div>
                                                            <ul>
                                                            <li>Mức độ hoàn thành &nbsp;&nbsp; {task && task.progress}%</li>
                                                            {(task && task.point && task.point !== -1) ?
                                                                <li>Điểm công việc &nbsp;&nbsp; {task && task.point}%</li> :
                                                                <li>Điểm công việc &nbsp;&nbsp; Chưa được tính</li>
                                                            }

                                                            {
                                                                eva.taskInformations.map(info => {
                                                                    if( !isNaN(Date.parse(info.value)) && isNaN(info.value) ){
                                                                        return <li>{info.name}&nbsp;-&nbsp;Giá trị: {info.value ? this.formatDate(info.value) : "Chưa đánh giá tháng này"}</li>
                                                                    }
                                                                    return <li>{info.name}&nbsp;-&nbsp;Giá trị: {info.value ? info.value : "Chưa đánh giá tháng này"}</li>
                                                                })
                                                            }
                                                            </ul>
                                                        </div>     
                                                        }
                                                        

                                                    {/* </dd>

                                                    <dd> */}
                                                        {/* KPI */}
                                                        {/* <div><strong>Liên kết KPI</strong></div>
                                                        <ul>
                                                        {(eva.kpis.length !== 0) ?
                                                            (
                                                                eva.kpis.map(item => {
                                                                    return (<li>KPI {item.employee.name}
                                                                        {(item.kpis.length !== 0) ?
                                                                            <ol>
                                                                                {
                                                                                    item.kpis.map(kpi => {
                                                                                        return <li>{kpi.name}</li>
                                                                                    })
                                                                                }
                                                                            </ol>
                                                                            : <span>&nbsp;&nbsp; Chưa liên kết công việc với KPI</span>
                                                                        }
                                                                    </li>)
                                                                })
                                                            ): <li>Chưa ai liên kết công việc với KPI</li>
                                                        }
                                                        </ul> */}
                                                    </dd>
                                                </div>);
                                            })
                                        }
                                        {(task && (!task.evaluations || task.evaluations.length === 0 )) && <dt>Chưa được đánh giá lần nào</dt>}
                                    
                                    </div>
                                </fieldset>
                            </div>

                        </div>
                {/* <div>
                    
                    <div><strong>Thông tin công việc</strong></div>
                    <ul>
                    <li>Mức độ hoàn thành &nbsp;&nbsp; {task && task.progress}%</li>
                    {(task && task.point && task.point !== -1) ?
                        <li>Điểm công việc &nbsp;&nbsp; {task && task.point}%</li> :
                        <li>Điểm công việc &nbsp;&nbsp; Chưa được tính</li>
                    }

                    {
                        task && task.evaluation.taskInformations.map(info => {
                            if( !isNaN(Date.parse(info.value)) && isNaN(info.value) ){
                                return <li>{info.name}&nbsp;-&nbsp;Giá trị: {info.value ? this.formatDate(info.value) : "Chưa đánh giá tháng này"}</li>
                            }
                            return <li>{info.name}&nbsp;-&nbsp;Giá trị: {info.value ? info.value : "Chưa đánh giá tháng này"}</li>
                        })
                    }
                </ul>
            </div>      */}
            </DialogModal>
            </React.Fragment>
        )
    }
}
function mapState(state){
    const {tasks} = state;
    return {tasks}
}
const Actions = {
    // getTaskById: taskManagementActions.getTaskById
}
const connectedModelDetailTask2 = connect (mapState, Actions)(ModelDetailTask2)
export { connectedModelDetailTask2 as ModelDetailTask2 };