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
        this.state = {
            organizationalUnit: "",
            content: "",
            name: "",
            description: "",
            point: 0,
            status: 0,
            value: 0
        };
    }
    componentDidMount() {
        this.props.getKPIMemberById(this.props.id);
    }


    componentDidUpdate() {
        this.handleResizeColumn();
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
    handleChangeContent = async (id, employeeId, date) => {
        console.log('====', id, employeeId, date);
        console.log('date', date.getMonth());
        await this.setState(state => {
            this.props.getTaskById(id, employeeId,date);
            return {
                ...state,
                content: id
            }
        });

    }

    handleSetPointKPI = async (id_kpi, id_target, input, date) => {
        //event.preventDefault();
        var point = { point: input };
        this.props.setPointKPI(id_kpi, id_target, point, date)
        // await this.setState({
        //     editing: true,
        //     this.props.setPointKPI( id_kpi, id_target, point)
        // })
    }

    handleCloseModal = async (id) => {
        var element = document.getElementsByTagName("BODY")[0];
        element.classList.remove("modal-open");
        var modal = document.getElementById(`memberEvaluate${id}`);
        modal.classList.remove("in");
        modal.style = "display: none;";
    }

    setValueSlider = async (point) => {
        await this.setState(state => {
            return {
                ...state,
                value: point
            }

        })
    }
    // handle = () => {
    //     const { value, dragging, index, ...restProps } = this.props;
    //     return (
    //         <Tooltip
    //             prefixCls="rc-slider-tooltip"
    //             overlay={value}
    //             visible={dragging}
    //             placement="top"
    //             key={index}
    //         >
    //             <Handle value={value} {...restProps} />
    //         </Tooltip>
    //     );
    // };
    render() {
        var { value } = this.state
        var list;
        var myTask = [];
        const { kpimembers } = this.props;
        if (typeof kpimembers.tasks !== 'undefined' && kpimembers.tasks !== null) myTask = kpimembers.tasks;

        if (kpimembers.currentKPI) {
            list = kpimembers.currentKPI.kpis;
        }
        console.log('-------------', this.props);
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
                            <div className="left-modal">
                                <div className="header-left-modal" style={{ fontWeight: "500", background: "slateblue", color: "white" }}>
                                    <h4>Danh sách mục tiêu</h4>
                                </div>
                                <div className="content-left-modal" id="style-1" style={{ width: "24.5%" }}>
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
                            <div className="right-modal">
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

                                                <div className="form-inline">
                                                    <button className="btn btn-success pull-right" onClick={() => this.handleSetPointKPI(this.props.id, item.creator._id, this.approvepoint.value, new Date())}>Tính điểm KPI</button>
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
                                                            <th title="Thời gian">Thời gian</th>
                                                            <th title="Trạng thái">Trạng thái</th>
                                                            <th title="Đóng góp">Đóng góp</th>
                                                            <th title="Điểm">Điểm</th>
                                                            <th title="Độ quan trọng">Độ quan trọng</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {

                                                            (typeof kpimembers.tasks !== "undefined" && kpimembers.tasks) ?
                                                                (kpimembers.tasks.map((itemTask, index) =>

                                                                    <tr key={index}>
                                                                        <td>{index + 1}</td>
                                                                        <td>{itemTask.name}</td>
                                                                        <td>{this.formatDate(itemTask.startDate) + "->\n" + this.formatDate(itemTask.endDate)}</td>
                                                                        <td>{itemTask.status}</td>
                                                                        <td>{itemTask.contribution}</td>
                                                                        <td>{itemTask.automaticPoint + '-' + itemTask.employeePoint + '-' + itemTask.approvedPoint}</td>
                                                                        <td>
                                                                            <div>
                                                                                <ReactSlider
                                                                                    className="horizontal-slider"
                                                                                    thumbClassName="thumb-1"
                                                                                    trackClassName="track-1"
                                                                                    defaultValue={itemTask.taskImportanceLevel}
                                                                                    renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
                                                                                />
                                                                            </div> 
                                                                                {/* <Slider
                                                                                //     defaultValue={itemTask.taskImportanceLevel}
                                                                                //     getAriaValueText={this.state.valuetext}
                                                                                //     aria-labelledby="discrete-slider"
                                                                                //     valueLabelDisplay="auto"
                                                                                //     step={0.1}
                                                                                //     // marks
                                                                                //     min={0}
                                                                                //     max={10}
                                                                                    >*/}

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