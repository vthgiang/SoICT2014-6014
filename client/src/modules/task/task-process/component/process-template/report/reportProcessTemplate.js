import React, { Component, useEffect, useState } from "react";
import { connect } from 'react-redux';
import { withTranslate } from "react-redux-multilingual";
import { DatePicker } from "../../../../../../common-components";
import { TaskProcessActions } from "../../../redux/actions";
import { TaskProcessService } from "../../../redux/services";
import { ChartCountByMonth } from "./chartCountByMonth";
import { ChartReportTask } from "./chartReportTask";
import { TableReportTask } from "./tableReportTask";
import c3 from 'c3';
import 'c3/c3.css';
import moment from 'moment';

function areEqual(prevProps, nextProps) {
    if (prevProps.idProcess === nextProps.idProcess) {
        return true
    } else {
        return false
    }
}
function ReportProcessTemplate(props) {
    const formatDate = (date, monthYear = false) => {
        if (!date) return null;
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) {
            month = '0' + month;
        }

        if (day.length < 2) {
            day = '0' + day;
        }

        if (monthYear === true) {
            return [month, year].join('-');
        } else {
            return [day, month, year].join('-');
        }
    }
    // let { data } = props;
    let date = new Date()
    let _startDate = formatDate(date.setMonth(new Date().getMonth() - 6), true);
    const [state, setState] = useState({
        startDate: _startDate,
        endDate: formatDate(Date.now(), true),
        search:0
    })
    useEffect(()=>{
        pieChart()
        pieChart123()
    },[state.dataTaskProcess])
    useEffect(()=>{
        let partMonth1 = state.startDate.split('-');
        let startDate = [partMonth1[1], partMonth1[0]].join('-');
        let partMonth2 = state.endDate.split('-');
        let endDate = [partMonth2[1], partMonth2[0]].join('-');
        TaskProcessService.getAllTaskProcess(1, 100000, "",startDate,endDate,props.idProcess).then(res=>{
            setState({
                ...state,
                dataTaskProcess: res.data.content.data
            })
        });
    },[state.search,props.idProcess])
    const handleSunmitSearch = () => {
        setState({
            ...state,
            search:state.search+1
        })
     }
    const handleStartMonthChange = (value) => {
        setState({
            ...state,
            startDate: value
        })
    }

    const handleEndMonthChange = (value) => {
        setState({
            ...state,
            endDate: value,
        })
    }
    function removePreviousPieChart() {
        const chart = refCategory.current;
        if (chart) {
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
        }
    }
    function removePreviousPieChart123() {
        const chart = refCategory123.current;
        if (chart) {
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
        }
    }
    const { translate } = props
    const refCategory = React.createRef()
    const refCategory123 = React.createRef()
    const pieChart123 = () => {
        removePreviousPieChart123();
        let dataChart =[[
            "Trễ Hạn",
            0
        ],
        [
            "Quá Hạn",
            0
        ],
        [
            "Đúng tiến độ",
            0
        ]]
        
        if (state.dataTaskProcess){
            state.dataTaskProcess.forEach(element => {
                let end = moment(element.endDate);
                let endT = moment(element.actualEndDate);
                let now = moment(new Date());
                if (element.status == "finished") {
                    let uptonow1 = now.diff(end, 'hour');
                    let uptonow2 = now.diff(endT, 'hour');
                    if (uptonow1 < uptonow2) {
                        dataChart[2][1] = dataChart[2][1]+1;
                    } else {
                        dataChart[0][1] = dataChart[0][1]+1;
                    }
                } else {
                    let uptonow1 = now.diff(end, 'hour');
                    let uptonow2 = now.diff(endT, 'hour');
                    if (uptonow1 > uptonow2) {
                        dataChart[1][1] = dataChart[1][1]+1;
                    };
                }
            });
        }
        console.log(dataChart);
        let chart = c3.generate({
            bindto: refCategory123.current,

            // Căn lề biểu đồ
            padding: {
                top: 20,
                bottom: 20,
                right: 20,
                left: 20
            },

            data: { // Dữ liệu biểu đồ
                columns: dataChart,
                type: 'pie',
                labels: true,
            }
        })
    }
    const pieChart = () => {
        removePreviousPieChart();
        let dataChart =[[
            "Đã Hoàn Thành",
            0
        ],
        [
            "Đang thực hiện",
            0
        ],
        [
            "Chưa khởi tạo cụ thể công việc",
            0
        ]]
        
        if (state.dataTaskProcess){
            state.dataTaskProcess.forEach(element => {
                if (element.status ==='finished'){
                    dataChart[0][1] = dataChart[0][1]+1;
                }
                if (element.status ==='inprocess'){
                    dataChart[1][1] = dataChart[1][1]+1;
                }
                if (element.status ==='not_initialized'){
                    dataChart[2][1] = dataChart[2][1]+1;
                }
            });
        }
       
        let chart = c3.generate({
            bindto: refCategory.current,

            // Căn lề biểu đồ
            padding: {
                top: 20,
                bottom: 20,
                right: 20,
                left: 20
            },

            data: { // Dữ liệu biểu đồ
                columns: dataChart,
                type: 'pie',
                labels: true,
            }
        })
    }
    console.log(state)
    return (
        <React.Fragment>
            <div className="form-inline" >
                <div className="form-group">
                    <label style={{ width: "auto" }}>Từ ngày</label>
                    <DatePicker
                        id="form-month-annual-leave"
                        dateFormat="month-year"
                        deleteValue={false}
                        value={state.startDate}
                        onChange={handleStartMonthChange}
                    />
                </div>
                <div className='form-group'>
                    <label style={{ width: "auto" }}>Đến ngày</label>
                    <DatePicker
                        id="to-month-annual-leave"
                        dateFormat="month-year"
                        deleteValue={false}
                        value={state.endDate}
                        onChange={handleEndMonthChange}
                    />
                </div>
                <button type="button" className="btn btn-success" title={translate('general.search')} onClick={() => handleSunmitSearch()} >{translate('general.search')}</button>
            </div>
            <ChartCountByMonth startDate={state.startDate} dataTaskProcess={state.dataTaskProcess} endDate={state.endDate}/>
            {/*<ChartReportTask startDate={state.startDate}  endDate={state.endDate} info={props.info} dataTaskProcess={state.dataTaskProcess}/>*/}
            <TableReportTask startDate={state.startDate}  endDate={state.endDate} info={props.info} dataTaskProcess={state.dataTaskProcess}/>
            <div className="row">
                <div className="col-xs-6" >
                    <div className="box box-solid">
                        <div className="box-header">
                            <div className="box-title">Trạng thái các quy trình sử dụng mẫu</div>
                        </div>
                        <div className="box-body qlcv" style={{ minHeight: "400px" }}>
                            <div ref={refCategory}></div>
                        </div>
                    </div>
                </div>
                <div className="col-xs-6" >
                    <div className="box box-solid">
                        <div className="box-header">
                            <div className="box-title">Tiến độ các quy trình sử dụng mẫu</div>
                        </div>
                        <div className="box-body qlcv" style={{ minHeight: "400px" }}>
                            <div ref={refCategory123}></div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment> 
    );
}

function mapState(state) {
    const { user, auth, role, taskProcess } = state;
    return { user, auth, role, taskProcess };
}

const actionCreators = {
    getAllTaskProcess: TaskProcessActions.getAllTaskProcess,
    //getXmlDiagramById: TaskProcessActions.getXmlDiagramById,
};
const connectedReportProcessTemplate = connect(mapState, actionCreators)(withTranslate(React.memo(ReportProcessTemplate, areEqual)));
export { connectedReportProcessTemplate as ReportProcessTemplate };
