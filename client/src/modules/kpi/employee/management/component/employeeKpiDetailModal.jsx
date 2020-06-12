//import { Slider, Tooltip} from '@material-ui/core';
//import React, { useState } from 'react';
// import 'rc-slider/assets/index.css';

// import 'rc-tooltip/assets/bootstrap.css';

import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';

import React, { Component, useState } from 'react';

import ReactSlider from 'react-slider';

import { connect } from 'react-redux';
import { DialogModal, ErrorLabel, DatePicker, SelectBox } from '../../../../../common-components/index';


import { kpiMemberActions } from '../../../evaluation/employee-evaluation/redux/actions';
import { PaginateBar, DataTableSetting } from '../../../../../common-components';
import CanvasJSReact from '../../../../../chart/canvasjs.react';
//const Handle = Slider.Handle;
class ModalDetailKPIPersonal extends Component {
    constructor(props) {
        super(props);
        this.DATA_STATUS = {NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3};
        this.state = {
            organizationalUnit: "",
            content: "",
            name: "",
            description: "",
            point: 0,
            status: 0,
            value: 0,
            valueNow : 0,
            dataStatus: this.DATA_STATUS.NOT_AVAILABLE
        };
    }
    static getDerivedStateFromProps(nextProps, prevState){
        if (nextProps.employeeKpiSet && nextProps.employeeKpiSet._id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.employeeKpiSet._id,
            } 
        } else {
            return null;
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        if (nextProps.employeeKpiSet &&  nextProps.employeeKpiSet._id !== this.state.id) {
            if (nextProps.employeeKpiSet._id){
                this.props.getKPIMemberById(nextProps.employeeKpiSet._id);
            }
            return false;
        }

        if (this.state.dataStatus === this.DATA_STATUS.QUERYING){
            if (!nextProps.kpimembers.tasks){
                return false;
            } else { // Dữ liệu đã về
                let tasks = nextProps.kpimembers.tasks;
                this.setState(state=>{
                    return{
                        ...state,
                        tasks: tasks,
                        dataStatus: this.DATA_STATUS.FINISHED,
                    }
                });
                return false;
            }
        }
        return true;
    }
    
    formatDate(date) {
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
    formatMonth(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [month, year].join('-');
    }
    handleChangeContent =(id, employeeId, kpiType) => {
        let date = this.props.employeeKpiSet.date;
        this.props.getTaskById(id, employeeId, date, kpiType);
        this.setState(state => {
               return {
                   ...state,
                   content: id,
                   dataStatus: this.DATA_STATUS.QUERYING,
               }
           });
    }

    handleSetPointKPI = () => {
        var date = new Date();
        let data = this.state.tasks !== undefined ? this.state.tasks: this.props.kpimembers.tasks;
        for (let n in data) {
            data[n]={
                taskId: data[n].taskId,
                date: date.toISOString(),
                point: data[n].taskImportanceLevel,
                employeeId: this.props.employeeId,
            }
        }
        console.log(data);
        this.props.setPointKPI(this.state.content, data);
        this.setState({
            editing: true,
        })
    }
    
    render() {
        var kpimember;
        var list, myTask = [], thisKPI = null;
        const { kpimembers } = this.props;
        if (kpimembers.tasks !== 'undefined' && kpimembers.tasks !== null) myTask = kpimembers.tasks;
        kpimember = kpimembers && kpimembers.kpimembers;
        if (kpimembers.currentKPI) {
            list = kpimembers.currentKPI.kpis;
        }
        
        let {employeeKpiSet} = this.props;

        return (
            <React.Fragment>
                <DialogModal
                modalID={`modal-detail-KPI-personal`}
                title={employeeKpiSet && employeeKpiSet.creator && `KPI ${employeeKpiSet.creator.name}, tháng ${this.formatMonth(employeeKpiSet.date)}`}
                hasSaveButton ={false}
                size={100}>
                    <div className="col-xs-12 col-sm-4">
                        <div className="box box-solid" style={{border: "1px solid #ecf0f6", borderBottom: "none"}}>
                            <div className="box-header with-border">
                                <h3 className="box-title" style={{fontWeight: 800}}>Danh sách KPI</h3>
                            </div>
                            <div className="box-body no-padding">
                                <ul className="nav nav-pills nav-stacked">
                                    {list && list.map((item, index) =>
                                    <li key={index} className={this.state.content===item._id && "active"}>
                                        <a href="#abc" onClick={() => this.handleChangeContent(item._id, employeeKpiSet.creator._id, item.type)}>
                                            {item.name}&nbsp;
                                        </a>
                                    </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="col-xs-12 col-sm-8 qlcv">
                        {list && list.map(item => {
                            if (item._id === this.state.content) return (
                            <React.Fragment key={item._id}>
                                <h4>{`Thông tin KPI "${item.name}"`}</h4>
                                <div style={{lineHeight: 2}}>
                                    <div>
                                        <label>Tiêu chí:</label>
                                        <span> {item.criteria}</span>
                                    </div>
                                    
                                    <div>
                                        <label>Trọng số:</label>
                                        <span> {item.weight}/100</span>
                                    </div>

                                    <div>
                                        <label>Điểm (Tự động - Tự đánh giá - Người phê duyệt đánh giá):</label>
                                        <span> {item.automaticPoint? item.automaticPoint: "Chưa có điểm"}</span>
                                        <span> - {item.employeePoint? item.employeePoint: "Chưa có điểm"}</span>
                                        <span> - {item.approvedPoint? item.approvedPoint: "Chưa có điểm"}</span>
                                    </div>

                                    { item.updatedAt &&
                                    <div>
                                        <label>Lần đánh giá cuối: </label>
                                        <span> {this.formatDate(item.updatedAt)}</span>
                                    </div>
                                    }
                                </div>
                                <br/>
                                <br/>


                                <h4>Danh sách các công việc</h4>
                                <DataTableSetting class="pull-right" tableId="employeeKpiEvaluate" tableContainerId="tree-table-container" tableWidth="1300px"
                                columnArr={[
                                    'STT',
                                    'Tên công việc',
                                    'Thời gian thực hiện',
                                    'Thời gian đánh giá',
                                    'Trạng thái',
                                    'Đóng góp (%)',
                                    'Điểm',
                                    'Độ quan trọng']}
                                limit={this.state.perPage}
                                setLimit={this.setLimit}
                                hideColumnOption={true} />


                                <table id="employeeKpiEvaluate" className="table table-hover table-bordered">
                                    <thead>
                                        <tr>
                                            <th title="STT" style={{ width: "40px" }} className="col-fixed">Stt</th>
                                            <th title="Tên công việc">Tên công việc</th>
                                            <th title="Thời gian thực hiện">Thời gian thực hiện</th>
                                            <th title="Thời gian đánh giá">Thời gian đánh giá</th>
                                            <th title="Trạng thái">Trạng thái</th>
                                            <th title="Đóng góp (%)">Đóng góp (%)</th>
                                            <th title="Điểm">Điểm</th>
                                            <th title="Độ quan trọng">Độ quan trọng</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            ( kpimembers.tasks !== undefined && Array.isArray(kpimembers.tasks)) ?
                                                (kpimembers.tasks.map((itemTask, index) =>

                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{itemTask.name}</td>
                                                        <td>{this.formatDate(itemTask.startDate)}<br/> <i className="fa fa-angle-double-down"></i><br/> {this.formatDate(itemTask.endDate)}</td>
                                                        <td>{this.formatDate(itemTask.preEvaDate)}<br/> <i className="fa fa-angle-double-down"></i><br/> {this.formatDate(itemTask.date)}</td>
                                                        <td>{itemTask.status}</td>
                                                        <td>{itemTask.contribution}%</td>
                                                        <td>{itemTask.automaticPoint + '-' + itemTask.employeePoint + '-' + itemTask.approvedPoint}</td>
                                                        <td>
                                                            <div>
                                                            GT được duyệt: {itemTask.taskImportanceLevel}
                                                            </div>
                                                            <div>
                                                            GT tự động: {itemTask.taskImportanceLevelCal}
                                                            </div>
                                                        </td>
                                                    </tr>)) : <tr><td colSpan={8}>Không có dữ liệu</td></tr>
                                        }

                                    </tbody>
                                </table>
                            </React.Fragment>);
                            return true;
                        })}
                    </div>
                </DialogModal>
            </React.Fragment>
        );
    }
}

function mapState(state) {
    const { kpimembers } = state;
    return { kpimembers };
}

const actionCreators = {
    getKPIMemberById: kpiMemberActions.getKPIMemberById,
    getTaskById: kpiMemberActions.getTaskById,
    setPointKPI: kpiMemberActions.setPointKPI
};
const connectedModalDetailKPIPersonal = connect(mapState, actionCreators)(ModalDetailKPIPersonal);
export { connectedModalDetailKPIPersonal as ModalDetailKPIPersonal };