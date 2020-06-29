//import { Slider, Tooltip} from '@material-ui/core';
//import React, { useState } from 'react';
// import 'rc-slider/assets/index.css';

// import 'rc-tooltip/assets/bootstrap.css';

import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import {TaskDialog} from './taskImpotanceDialog';
import React, { Component, useState } from 'react';

import ReactSlider from 'react-slider';

import { connect } from 'react-redux';

import { kpiMemberActions } from '../redux/actions';
import { PaginateBar, DataTableSetting } from '../../../../../common-components';

import { DialogModal } from '../../../../../common-components/index';
//const Handle = Slider.Handle;
class ModalMemberEvaluate extends Component {
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
            dataStatus: this.DATA_STATUS.NOT_AVAILABLE,
            type: 0
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
                let importanceLevels = {};
                tasks.forEach(element => {
                    importanceLevels[element.taskId] = element.results.taskImportanceLevel;
                });
                this.setState(state=>{
                    return{
                        ...state,
                        tasks: tasks,
                        points: importanceLevels,
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
                   type : kpiType,
                   dataStatus: this.DATA_STATUS.QUERYING,
               }
           });
    }

    handleSetPointKPI = () => {
        let date = this.props.employeeKpiSet.date;
        let employeeId = this.props.employeeKpiSet.creator._id;
        let tasks = this.state.tasks;
        let points = this.state.points;
        if (tasks && tasks.length>0){
            let data=[];
            tasks.forEach(element => {
                data.push({
                    taskId: element.taskId,
                    date: date,
                    point: points[element.taskId],
                    type : this.state.type,
                    employeeId: employeeId
                })
            });

            this.props.setPointKPI(this.state.content, data);
        }
    }

    setValueSlider = (e, id) => {
        // this.state[`taskImportanceLevel${itemTask.taskId}`]
        var value = e.target.value;
        let points = this.state.points;
        points[id] = value;

        this.setState(state => {
            return {
                ...state,
                points: points,
            }
        })
    }
    showDetailTaskImportanceCal = async(item) =>{
        await this.setState(state => {
            return {
                ...state,
                taskImportanceDetail: item
            }
        })

        window.$(`#modal-taskimportance-auto`).modal('show')
    }


    render() {
        var list, myTask = [], thisKPI = null;
        const { kpimembers } = this.props;
        if (kpimembers.tasks !== 'undefined' && kpimembers.tasks !== null) myTask = kpimembers.tasks;

        if (kpimembers.currentKPI) {
            list = kpimembers.currentKPI.kpis;
        }

        let {employeeKpiSet} = this.props;
        
        return (
            <DialogModal
            modalID={"employee-kpi-evaluation-modal"}
            title={employeeKpiSet && employeeKpiSet.creator && `KPI ${employeeKpiSet.creator.name}, tháng ${this.formatMonth(employeeKpiSet.date)}`}
            hasSaveButton={false}
            size={100}>
                {/* {<taskDialog task = {this.state.taskImportanceDetail}/>} */}
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
                    <div className="form-inline pull-right">
                        <button className="btn btn-success" onClick={() => this.handleSetPointKPI()}>Tính điểm KPI</button>
                        <button className="btn btn-primary">Xuất file</button>
                    </div>

                    {list && list.map(item => {
                        if (item._id === this.state.content) return <React.Fragment key={item._id}>
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
                                        <th title="STT" style={{ width: "50px" }} className="col-fixed">Stt</th>
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
                                                    <td>{itemTask.results.contribution}%</td>
                                                    <td>{itemTask.results.automaticPoint + '-' + itemTask.results.employeePoint + '-' + itemTask.results.approvedPoint}</td>
                                                    <td>
                                                        {this.state.points && this.state.tasks &&
                                                        <React.Fragment>
                                                            <input type="range"
                                                            min="1"
                                                            max='10'
                                                            name={`taskImportanceLevel${itemTask.taskId}`}
                                                            value={this.state.points[itemTask.taskId]}
                                                            onChange={(e) => this.setValueSlider(e, itemTask.taskId)}/>
                                                            <div>
                                                                GT mới: {this.state.points[itemTask.taskId]}
                                                            </div>
                                                            <div>
                                                                GT cũ: {itemTask.results.taskImportanceLevel}
                                                            </div>
                                                            <div>
                                                                <a href= "#modal-taskimportance-auto" onClick = {()=>this.showDetailTaskImportanceCal(itemTask)}>
                                                                    GT tự động: {itemTask.taskImportanceLevelCal}
                                                                </a>

                                                            </div>
                                                        </React.Fragment>
                                                        }
                                                        {/*<ReactSlider
                                                            className="horizontal-slider"
                                                            thumbClassName="thumb-1"
                                                            trackClassName="track-1"
                                                            min="0"
                                                            max='10'
                                                            name={`taskImportanceLevel${itemTask.taskId}`}
                                                            value={this.state[`taskImportanceLevel${itemTask.taskId}`]}
                                                            defaultValue={itemTask.taskImportanceLevel}
                                                            onChange={(e) => this.setValueSlider(e, itemTask.taskId)}
                                                            renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
                                                        /> */}
                                                        {/*<Slider
                                                            //     ValueLabelComponent={this.ValueLabelComponent}
                                                            //     aria-label="custom thumb label"
                                                            //     defaultValue={itemTask.taskImportanceLevel*10}
                                                            //     // getAriaValueText={this.state.valuetext}
                                                            //     // onChange={this.handleChangeSlider}
                                                            // />*/}
                                                    </td>
                                                    {/* <td>{itemTask.point === -1 ? 'Chưa đánh giá' : itemTask.point}</td> */}
                                                </tr>)) : <tr><td colSpan={7}>Không có dữ liệu</td></tr>
                                    }

                                </tbody>
                            </table>
                            {
                                this.state.taskImportanceDetail !== undefined && 
                                <TaskDialog 
                                    task = {this.state.taskImportanceDetail}
                                />

                            }
                        </React.Fragment>;
                        return true;
                    })}
                </div>
            </DialogModal>
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
const connectedModalMemberEvaluate = connect(mapState, actionCreators)(ModalMemberEvaluate);
export { connectedModalMemberEvaluate as ModalMemberEvaluate };