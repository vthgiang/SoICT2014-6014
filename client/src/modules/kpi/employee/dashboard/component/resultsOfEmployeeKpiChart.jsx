import React, {Component, useEffect, useState} from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { createKpiSetActions } from '../../creation/redux/actions';

import { DatePicker } from '../../../../../common-components';

import Swal from 'sweetalert2';
import c3 from 'c3';
import 'c3/c3.css';


function ResultsOfEmployeeKpiChart(props) {
    const { translate, createEmployeeKpiSet, auth } = props

    let today = new Date(),
        month = today.getMonth() + 1,
        year = today.getFullYear();
    let endMonth;

    if (month < 10) {
        endMonth = '0' + month;
    } else {
        endMonth = month;
    }

    const DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3 };

    const INFO_SEARCH = {
        startMonth: year + '-0' + 1,
        endMonth: [year, endMonth].join('-')
    }

    const[state, setState]  = useState({
        dataStatus: DATA_STATUS.QUERYING,

        userId: localStorage.getItem("userId"),
        roleId: localStorage.getItem("currentRole"),
        startMonth: INFO_SEARCH.startMonth,
        endMonth: INFO_SEARCH.endMonth,
        defaultendMonth: [endMonth, year].join('-'),
        defaultstartMonth: ['01', year].join('-'),

        infosearch: {
            startMonth: INFO_SEARCH.startMonth,
            endMonth: INFO_SEARCH.endMonth,
        }
    });
    const { defaultstartMonth, defaultendMonth } = state


    let listEmployeeKpiSetEachYear;

    useEffect(() => {
        props.getAllEmployeeKpiSetByMonth(state.roleId, state.userId, state.startMonth, state.endMonth);

        setState( {
            ...state,
            dataStatus: DATA_STATUS.QUERYING,
        });
    }, [])

    useEffect(() => { 
            setState( {
                ...state,
                dataStatus: DATA_STATUS.QUERYING,
            });
    }, [state.infosearch.startMonth, state.infosearch.endMonth]);

    useEffect(()=>{
        if(state.dataStatus === DATA_STATUS.QUERYING) {
            if(props.createEmployeeKpiSet.employeeKpiSetByMonth) {
                setState({
                    ...state,
                    dataStatus: DATA_STATUS.AVAILABLE
                })
            }
        } else if(state.dataStatus === DATA_STATUS.AVAILABLE) {
            multiLineChart();

            setState({
                ...state,
                dataStatus: DATA_STATUS.FINISHED
            })
        }
    });

    /**
     *
     * Chọn các thông tin để vẽ biểu đồ
     */

    const handleSelectMonthStart = (value) => {
        let month = value.slice(3, 7) + '-' + value.slice(0, 2);
        setState({
            ...state,
            startMonth: month
        })
    };

    const handleSelectMonthEnd = (value) => {
        let month = value.slice(3, 7) + '-' + value.slice(0, 2);
        setState({
            ...state,
            endMonth: month
        })
    };

    /**Gửi req và vẽ biểu đồ */
    const handleSearchData = async () => {
        let startMonth = new Date(state.startMonth);
        let endMonth = new Date(state.endMonth);

        if (startMonth && endMonth && startMonth.getTime() > endMonth.getTime()) {
            Swal.fire({
                title: translate('kpi.evaluation.employee_evaluation.wrong_time'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText:  translate('kpi.evaluation.employee_evaluation.confirm')
            })
        } else {
            await setState( {
                    ...state,
                    startMonth: state.startMonth,
                    endMonth: state.endMonth
            })

            props.getAllEmployeeKpiSetByMonth(state.roleId, state.userId, state.startMonth, state.endMonth);
        }
    };

    const filterEmloyeeKpiSetSameOrganizationaUnit = () => {
        let listEmployeeKpiSet, listOrganizationalUnit, listEmployeeKpiSetSameOrganizationalUnit = [], dataChart,
            exportData;

        if (createEmployeeKpiSet) {
            listEmployeeKpiSet = createEmployeeKpiSet.employeeKpiSetByMonth
        }

        if (listEmployeeKpiSet && listEmployeeKpiSet.length !== 0) {
            listOrganizationalUnit = listEmployeeKpiSet.map(kpi => {
                if (kpi.organizationalUnit) {
                    return kpi.organizationalUnit.name;
                }
            })
        }
        listOrganizationalUnit = Array.from(new Set(listOrganizationalUnit));

        if (listOrganizationalUnit && listOrganizationalUnit.length !== 0) {
            listOrganizationalUnit.map((unit, index) => {
                listEmployeeKpiSetSameOrganizationalUnit[index] = listEmployeeKpiSet.filter(kpi => kpi.organizationalUnit && kpi.organizationalUnit.name === unit);

            })
        }
        if (listEmployeeKpiSetSameOrganizationalUnit) {
            exportData = convertDataToExportData(listEmployeeKpiSetSameOrganizationalUnit, auth?.user?.name)
            handleExportData(exportData);
        }

        if (listEmployeeKpiSetSameOrganizationalUnit.length !== 0) {
            dataChart = listEmployeeKpiSetSameOrganizationalUnit.map(kpi => {
                return setDataMultiLineChart(kpi);
            })
        }

        return dataChart;
    };

    const setDataMultiLineChart = (listEmployeeKpiSet) => {

        let title;
        let dataMultiLineChart, automaticPoint, employeePoint, approvedPoint, date;


        if (listEmployeeKpiSet[0] && listEmployeeKpiSet[0].organizationalUnit) {
            title = auth?.user?.name + ' - ' + listEmployeeKpiSet[0].organizationalUnit.name;
        }

        if (listEmployeeKpiSet) {
            automaticPoint = [translate('kpi.evaluation.dashboard.auto_eva')].concat(listEmployeeKpiSet.map(x => x.automaticPoint ? x.automaticPoint : 0));
            employeePoint = [translate('kpi.evaluation.dashboard.employee_eva')].concat(listEmployeeKpiSet.map(x => x.employeePoint ? x.employeePoint : 0));
            approvedPoint = [translate('kpi.evaluation.dashboard.approver_eva')].concat(listEmployeeKpiSet.map(x => x.approvedPoint ? x.approvedPoint : 0));
            date = listEmployeeKpiSet.map(x => {
                date = new Date(x.date);
                return date.getFullYear() + "-" + (date.getMonth() + 1) + "-01";
            })
        }

        dataMultiLineChart = {
            "title": title,
            "data": [['x'].concat(date), automaticPoint, employeePoint, approvedPoint]
        };
        return dataMultiLineChart;
    };

    /**Xóa các chart đã render trước khi đủ dữ liệu */
    const removePreviosMultiLineChart = () => {
        const chart = document.getElementById("refMultiLineChart");
        if (chart) {
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild)
            }
        }
    };

    /**Khởi tạo MultiLineChart bằng C3 */
    const multiLineChart = () => {
        removePreviosMultiLineChart();

        // Tạo mảng dữ liệu
        let dataMultiLineChart = filterEmloyeeKpiSetSameOrganizationaUnit();
        if (dataMultiLineChart && dataMultiLineChart.length !== 0) {
            dataMultiLineChart.map(data => {
                let div = document.createElement('div');
                div.id = data.title;
                let section = document.getElementById("refMultiLineChart");
                section.appendChild(div);

                let chart = c3.generate({
                    bindto: document.getElementById(data.title),
                    title: {
                        show: false,
                        text: data.title,
                        position: 'top-left',   // top-left, top-center and top-right
                        padding: {
                            top: 20,
                            bottom: 5,
                        }
                    },
                    padding: {
                        top: 20,
                        right: 20,
                        left: 20
                    },
                    data: {
                        x: 'x',
                        columns: data.data
                    },
                    axis: {
                        x: {
                            type: 'timeseries',
                            tick: {
                                format: function (x) {
                                    return (x.getMonth() + 1) + "-" + x.getFullYear();
                                }
                            }
                        },
                        y: {
                            max: 100,
                            min: 0,
                            label: {
                                text: translate('kpi.evaluation.employee_evaluation.point'),
                                position: 'outer-right'
                            },
                            padding: {
                                top: 10,
                                bottom: 10
                            }
                        }
                    },
                    zoom: {
                        enabled: false
                    }

                })
            })
        } else {
            let div = document.createElement('div');
            div.innerHTML = "Không có dữ liệu";
            let section = document.getElementById("refMultiLineChart");
            section.appendChild(div);
        }
    };

    const handleExportData =(exportData)=>
    {
        const { onDataAvailable } = props;
        if (onDataAvailable) {
            onDataAvailable(exportData);
        }
    };

    /*Chuyển đổi dữ liệu KPI nhân viên thành dữ liệu export to file excel */
    const convertDataToExportData = (data, name) => {
        let convertedData = [], names = name?.split("("), temp;
        let fileName = "Kết quả KPI " + (names ? names?.[0] : "") + " theo từng tháng ";
        if (data) {
            for (let i = 0; i < data.length; i++) {
                for (let j = 0; j < data[i].length; j++) {
                    convertedData.push(data[i][j])
                }
            }
            let d1, d2;
            //Sap xep tap kpi theo thu tu thoi gian
            for (let i = 0; i < convertedData.length - 1; i++) {
                for (let j = i + 1; j < convertedData.length; j++) {
                    d1 = new Date(convertedData[i].date);
                    d2 = new Date(convertedData[j].date)
                    if (d1 > d2) {
                        temp = convertedData[i];
                        convertedData[i] = convertedData[j];
                        convertedData[j] = temp;
                    }
                }
            }


            for (let i = 0; i < convertedData.length; i++) {
                let d = new Date(convertedData[i].date);
                convertedData[i]["time"] = d;
                convertedData[i]["STT"] = i + 1;
                convertedData[i]["unit"] = convertedData[i].organizationalUnit.name
            }
        }


        let exportData = {
            fileName: fileName,
            dataSheets: [
                {
                    sheetName: "sheet1",
                    sheetTitle: fileName,
                    tables: [
                        {
                            columns: [
                                {key: "STT", value: "STT"},
                                {key: "time", value: "Thời gian"},
                                {key: "unit", value: "Đơn vị "},
                                {key: "automaticPoint", value: "Điểm KPI tự động"},
                                {key: "employeePoint", value: "Điểm KPI tự đánh giá"},
                                {key: "approvedPoint", value: "Điểm KPI được phê duyệt"}
                            ],
                            data: convertedData
                        }
                    ]
                },
            ]


        };
        return exportData;
    };

    if (createEmployeeKpiSet.employeeKpiSetByMonth) {
        listEmployeeKpiSetEachYear = createEmployeeKpiSet.employeeKpiSetByMonth;
    }

    return (
        <React.Fragment>
            {/**Chọn ngày bắt đầu */}
            <section className="form-inline">
                <div className="form-group">
                    <label>{translate('kpi.evaluation.employee_evaluation.from')}</label>
                    <DatePicker
                        id="monthStartInDashBoardEmployeeKpiSet"
                        dateFormat="month-year"             // sử dụng khi muốn hiện thị tháng - năm, mặc định là ngày-tháng-năm
                        value={defaultstartMonth}                 // giá trị mặc định cho datePicker
                        onChange={handleSelectMonthStart}
                        disabled={false}                    // sử dụng khi muốn disabled, mặc định là false
                    />
                </div>
            </section>

            {/**Chọn ngày kết thúc */}
            <section className="form-inline">
                <div className="form-group">
                    <label>{translate('kpi.evaluation.employee_evaluation.to')}</label>
                    <DatePicker
                        id="monthEndInDashBoardEmployeeKpiSet"
                        dateFormat="month-year"             // sử dụng khi muốn hiện thị tháng - năm, mặc định là ngày-tháng-năm
                        value={defaultendMonth}                 // giá trị mặc định cho datePicker
                        onChange={handleSelectMonthEnd}
                        disabled={false}                    // sử dụng khi muốn disabled, mặc định là false
                    />
                </div>

                {/**button tìm kiếm data để vẽ biểu đồ */}
                <div className="form-group">
                    <button type="button" className="btn btn-success" onClick={handleSearchData}>{translate('kpi.evaluation.employee_evaluation.search')}</button>
                </div>
            </section>

            <section id={"refMultiLineChart"}> </section>
        </React.Fragment>
    )

}

function mapState(state) {
    const { createEmployeeKpiSet, auth } = state;
    return { createEmployeeKpiSet, auth };
}

const actions = {
    getAllEmployeeKpiSetByMonth: createKpiSetActions.getAllEmployeeKpiSetByMonth
}

const connectedResultsOfEmployeeKpiChart = connect(mapState, actions)(withTranslate(ResultsOfEmployeeKpiChart));
export { connectedResultsOfEmployeeKpiChart as ResultsOfEmployeeKpiChart }
