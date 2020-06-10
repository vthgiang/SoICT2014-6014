//import { Slider, Tooltip} from '@material-ui/core';
//import React, { useState } from 'react';
// import 'rc-slider/assets/index.css';

// import 'rc-tooltip/assets/bootstrap.css';

import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';

import React, { Component, useState } from 'react';

import ReactSlider from 'react-slider';

import { connect } from 'react-redux';

import { kpiMemberActions } from '../redux/actions';
import { PaginateBar, DataTableSetting } from '../../../../../common-components';
import CanvasJSReact from '../../../../../chart/canvasjs.react';
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
            dataStatus: this.DATA_STATUS.NOT_AVAILABLE
        };
    }
    componentDidMount() {
        this.props.getKPIMemberById(this.props.id);
    }


    componentDidUpdate() {
        // this.handleResizeColumn();
    }
    handleResizeColumn = () => {
        window.$(function () {
            var pressed = false;
            var start = undefined;
            var startX, startWidth;

            window.$("table thead tr th").mousedown(function (e) {
                start = window.$(this);
                pressed = true;
                startX = e.pageX;
                startWidth = window.$(this).width();
                window.$(start).addClass("resizing");
            });

            window.$(document).mousemove(function (e) {
                if (pressed) {
                    window.$(start).width(startWidth + (e.pageX - startX));
                }
            });

            window.$(document).mouseup(function () {
                if (pressed) {
                    window.$(start).removeClass("resizing");
                    pressed = false;
                }
            });
        });
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
    handleChangeContent =(id, employeeId, date) => {
        console.log('====', id, employeeId, date);
        console.log('date', date.getMonth());
        var isoDate = date.toISOString();
        this.props.getTaskById(id, employeeId, isoDate);
        this.setState(state => {
               return {
                   ...state,
                   content: id,
               }
           });
    }

    handleSetPointKPI = () => {
        var date = this.props.date;
        console.log("eeeee",this.props.kpimembers.tasks);
        let data = this.state.tasks !== undefined ? this.state.tasks: this.props.kpimembers.tasks;
        console.log('dataatata', data);
        for (let n in data) {
            data[n]={
                taskId: data[n].taskId,
                date: date,
                point: data[n].taskImportanceLevel,
                employeeId: this.props.employeeId,
            }
        }
        console.log("efefefef",data);
        this.props.setPointKPI(this.state.content, data);
        console.log("iddddd",this.state.content);
        this.setState({
            editing: true,
        })
    }

    handleCloseModal = async (id) => {
        var element = document.getElementsByTagName("BODY")[0];
        element.classList.remove("modal-open");
        var modal = document.getElementById(`memberEvaluate${id}`);
        modal.classList.remove("in");
        modal.style = "display: none;";
    }

    setValueSlider = (e, id) => {
        var value = e.target.value;
        let tasks = this.props.kpimembers.tasks;
        console.log(tasks);
        tasks.map(x=>{
            if(x.taskId===id){
                x.taskImportanceLevel = value
            }
        })
        this.setState(state => {
            return {
                ...state,
                tasks: tasks
            }
        })
    }
    render() {
        var list, myTask = [], thisKPI = null;
        const { kpimembers } = this.props;
        if (kpimembers.tasks !== 'undefined' && kpimembers.tasks !== null) myTask = kpimembers.tasks;

        if (kpimembers.currentKPI) {
            list = kpimembers.currentKPI.kpis;
        }
        // if(kpimembers.result){
        //     thisKPI = kpimembers.result;
        // }
        console.log('-------------', this.props.kpimembers.tasks);
        return (
            <div className="modal modal-full fade" id={"memberEvaluate" + this.props.id} tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog-full modal-tasktemplate">
                    <div className="modal-content">
                        {/* Modal Header */}
                        <div className="modal-header" style={{ textAlign: "center", background: "#605ca8", color: "white" }}>
                            <button type="button" className="close" data-dismiss="modal" onClick={() => this.handleCloseModal(this.props.id)}>
                                <span aria-hidden="true">×</span>
                                <span className="sr-only">Close</span>
                            </button>
                            <h3 className="modal-title" id="myModalLabel"> KPI  {this.props.name}, tháng {this.formatMonth(this.props.date)}</h3>
                        </div>
                        {/* Modal Body */}
                        <div className="modal-body modal-body-perform-task" >
                            <div className="col-sm-3">
                                <div className="header-left-modal" style={{ fontWeight: "500", background: "slateblue", color: "white" }}>
                                    <h4>Danh sách mục tiêu</h4>
                                </div>
                                <div className="content-left-modal" id="style-1" >
                                    <div className="scroll-content" style={{ borderRight: "3px solid #ddd" }}>
                                        {list && list.map((item, index) =>
                                            <a href="#abc" style={{ color: "black" }} onClick={() => this.handleChangeContent(item._id, this.props.employeeId, new Date())} className="list-group-item" key={index}>
                                                {item.name}&nbsp;
                                                {/* <small style={{ float: "right", textDecoration: "underline", color: "blue" }}>(9 công việc - 0 điểm)</small> */}
                                                {/* <span className="badge">{15 + index}</span> */}
                                            </a>)}
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-9">
                                {
                                    list && list.map(item => {
                                        if (item._id === this.state.content) return <React.Fragment key={item._id}>
                                            <div className="qlcv">
                                                <h4>Thông tin mục tiêu</h4>
                                                <div className="col-sm-12">
                                                    <label style={{ width: "150px" }}>Tiêu chí đính giá:</label>
                                                    <label >{item.criteria}</label>
                                                </div>
                                                <div className="col-sm-12">
                                                    <label style={{ width: "150px" }}>Trọng số:</label>
                                                    <label style={{ display: "inline" }}>{item.weight}</label>
                                                </div>
                                            
                                                { item.automaticPoint && 
                                                <div className="row">
                                                <div className="col-sm-12">
                                                    <label style={{ width: "150px" }}>Điểm tự động:</label>
                                                    <label >{item.automaticPoint}</label>
                                                </div>
                                                <div className="col-sm-12">
                                                    <label style={{ width: "150px" }}>Điểm tự đánh giá:</label>
                                                    <label >{item.employeePoint}</label>
                                                </div>
                                                <div className="col-sm-12">
                                                    <label style={{ width: "150px" }}>Điểm phê duyệt:</label>
                                                    <label >{item.approvedPoint}</label>
                                                </div>
                                                </div>
                                               }
                                               { item.updatedAt &&
                                                <div className="col-sm-12">
                                                    <label style={{ width: "150px" }}>Ngày đánh giá gần nhất: </label>
                                                    <label >{this.formatDate(item.updatedAt)}</label>
                                                </div>

                                               }
                                                <div className="form-inline">
                                                    <button className="btn btn-success pull-right" onClick={() => this.handleSetPointKPI()}>Tính điểm KPI</button>
                                                </div>
                                            </div>
                                            <div className="body-content-right">
                                                <div className="col-sm-12" style={{ fontWeight: "500" }}>
                                                    <h4>Danh sách các công việc</h4>
                                                </div>

                                                <DataTableSetting class="pull-right" tableId="employeeKpiEvaluate" tableContainerId="tree-table-container" tableWidth="1300px"
                                                    columnArr={[
                                                        'STT',
                                                        'Tên công việc',
                                                        'Thời gian',
                                                        'Trạng thái',
                                                        'Đóng góp',
                                                        'Điểm',
                                                        'Độ quan trọng']}
                                                    limit={this.state.perPage}
                                                    setLimit={this.setLimit}
                                                    hideColumnOption={true} />

                                                <table id="employeeKpiEvaluate" className="table table-hover table-bordered">
                                                    <thead>
                                                        <tr>
                                                            <th title="STT" style={{ width: "20px" }}>Stt</th>
                                                            <th title="Tên công việc">Tên công việc</th>
                                                            <th title="Thời gian">Thời gian đánh giá</th>
                                                            <th title="Trạng thái">Trạng thái</th>
                                                            <th title="Đóng góp">Đóng góp</th>
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
                                                                        <td>{this.formatDate(itemTask.startDate) + "->\n" + this.formatDate(itemTask.endDate)}</td>
                                                                        <td>{itemTask.status}</td>
                                                                        <td>{itemTask.contribution}</td>
                                                                        <td>{itemTask.automaticPoint + '-' + itemTask.employeePoint + '-' + itemTask.approvedPoint}</td>
                                                                        <td>
                                                                            <input type="range"
                                                                                min="1"
                                                                                max='10'
                                                                                name={`taskImportanceLevel${itemTask.taskId}`}
                                                                                value={this.state[`taskImportanceLevel${itemTask.taskId}`]}
                                                                                defaultValue={itemTask.taskImportanceLevel}
                                                                                onChange={(e) => this.setValueSlider(e, itemTask.taskId)}
                                                                            /> 
                                                                            <div>
                                                                            Điểm tự động : {itemTask.taskImportanceLevelCal}
                                                                            </div>
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
                                                <div className="footer-content-right">
                                                    <button style={{ float: "right" }}>Xuất file</button>
                                                </div>
                                            </div>
                                        </React.Fragment>;
                                        return true;
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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