import React, {Component, useEffect, useState} from 'react';
import {connect} from 'react-redux';

import {createKpiSetActions} from '../../../employee/creation/redux/actions';

import {DatePicker, CustomLegendC3js} from '../../../../../common-components';

import {withTranslate} from 'react-redux-multilingual'

import Swal from 'sweetalert2';
import c3 from 'c3';
import 'c3/c3.css';

function ResultsOfAllEmployeeKpiSetChart(props) {
    let today = new Date(),
        month = today.getMonth() + 1,
        year = today.getFullYear();
    let endMonth;

    if (month < 10) {
        endMonth = '0' + month;
    } else {
        endMonth = month;
    }

    const INFO_SEARCH = {
        startMonth: year + '-01',
        endMonth: [year, endMonth].join('-')
    };

    const DATA_STATUS = {NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3};
    const KIND_OF_POINT = {AUTOMATIC: 1, EMPLOYEE: 2, APPROVED: 3};

    const [state, setState] = useState({
        userRoleId: localStorage.getItem("currentRole"),

        startMonth: INFO_SEARCH.startMonth,
        endMonth: INFO_SEARCH.endMonth,

        infosearch: {
            startMonth: INFO_SEARCH.startMonth,
            endMonth: INFO_SEARCH.endMonth,
        },

        defaultEndMonth: [endMonth, year].join('-'),
        defaultStartMonth: ['01', year].join('-'),

        dataStatus: DATA_STATUS.NOT_AVAILABLE,
        kindOfPoint: KIND_OF_POINT.AUTOMATIC
    });
    const { defaultEndMonth, defaultStartMonth } = state;
    const refMultiLineChart = React.createRef();

    useEffect(() => {
        let data = multiLineChart();
        setState({
            ...state,
            chart: data?.chart,
            dataChart: data?.dataChart
        })
    }, [state.kindOfPoint]);

    useEffect(() => {
        setState({
            ...state,
            dataStatus: DATA_STATUS.QUERYING
        });
    }, [props.organizationalUnitIds, state.infosearch.startMonth, state.infosearch.endMonth]);

    useEffect(() => {
        if (state.dataStatus === DATA_STATUS.NOT_AVAILABLE) {
            props.getAllEmployeeKpiSetInOrganizationalUnitsByMonth(props.organizationalUnitIds, state.startMonth, state.endMonth);

            setState({
                ...state,
                dataStatus: DATA_STATUS.QUERYING,
            });
        } else if (state.dataStatus === DATA_STATUS.QUERYING) {
            if (props.createEmployeeKpiSet.employeeKpiSetsInOrganizationalUnitByMonth) {
                setState({
                    ...state,
                    dataStatus: DATA_STATUS.AVAILABLE
                });
            }
        } else if (state.dataStatus === DATA_STATUS.AVAILABLE) {
            let data = multiLineChart();
            setState({
                ...state,
                chart: data?.chart,
                dataChart: data?.dataChart,
                dataStatus: DATA_STATUS.FINISHED,
            });
        }

    });

    if (props.organizationalUnitIds !== state.organizationalUnitIds) {
        props.getAllEmployeeKpiSetInOrganizationalUnitsByMonth(props.organizationalUnitIds, state.startMonth, state.endMonth);

        setState({
            ...state,
            organizationalUnitIds: props.organizationalUnitIds
        })
    }

    /** Select kind of point */
    const handleSelectKindOfPoint = (value) => {
        if (Number(value) !== state.kindOfPoint) {
            setState({
                ...state,
                kindOfPoint: Number(value)
            })
        }
    };

    /** Select month start in box */
    const handleSelectMonthStart = (value) => {
        let month = value.slice(3, 7) + '-' + value.slice(0, 2);
        setState({
            ...state,
            startMonth: month
        })
    };

    /** Select month end in box */
    const handleSelectMonthEnd = async (value) => {
        let month = value.slice(3, 7) + '-' + value.slice(0, 2);
        setState({
            ...state,
            endMonth: month
        })
    };

    /** Search data */
    const handleSearchData = async () => {
        let startMonth = new Date(state.startMonth);
        let endMonth = new Date(state.endMonth);

        if (startMonth.getTime() > endMonth.getTime()) {
            const {translate} = props;
            Swal.fire({
                title: translate('kpi.evaluation.employee_evaluation.wrong_time'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm')
            })
        } else {
            await setState({
                ...state,
                infosearch: {
                    ...state.infosearch,
                    startMonth: state.startMonth,
                    endMonth: state.endMonth
                }
            })

            props.getAllEmployeeKpiSetInOrganizationalUnitsByMonth(props.organizationalUnitIds, state.startMonth, state.endMonth);
        }
    };

    const filterAndSetDataPoint = (name, arrayPoint) => {
        let dateAxisX = [], point = [];

        dateAxisX.push('date-' + name);
        point.push(name);

        for (let i = 0; i < arrayPoint.length; i++) {
            let newDate = new Date(arrayPoint[i].date);
            newDate = newDate.getFullYear() + "-" + (newDate.getMonth() + 1) + "-01";

            dateAxisX.push(newDate);

            if (state.kindOfPoint === KIND_OF_POINT.AUTOMATIC) {
                point.push(arrayPoint[i].automaticPoint);
            } else if (state.kindOfPoint === KIND_OF_POINT.EMPLOYEE) {
                point.push(arrayPoint[i].employeePoint);
            } else if (state.kindOfPoint === KIND_OF_POINT.APPROVED) {
                point.push(arrayPoint[i].approvedPoint);
            }
        }

        return [
            dateAxisX,
            point
        ]
    };

    const setDataMultiLineChart = () => {
        const {createEmployeeKpiSet} = props;
        let employeeKpiSetsInOrganizationalUnitByMonth, point = [], exportData;

        if (createEmployeeKpiSet.employeeKpiSetsInOrganizationalUnitByMonth) {
            employeeKpiSetsInOrganizationalUnitByMonth = createEmployeeKpiSet.employeeKpiSetsInOrganizationalUnitByMonth
            exportData = convertDataToExportData(employeeKpiSetsInOrganizationalUnitByMonth)
            handleExportData(exportData);
        }

        if (employeeKpiSetsInOrganizationalUnitByMonth) {
            for (let i = 0; i < employeeKpiSetsInOrganizationalUnitByMonth.length; i++) {
                point = point.concat(filterAndSetDataPoint(employeeKpiSetsInOrganizationalUnitByMonth[i]._id, employeeKpiSetsInOrganizationalUnitByMonth[i].employeeKpi));
            }
        }

        return point;
    };

    const removePreviousChart = () => {
        const chart = refMultiLineChart.current;

        if (chart) {
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
        }
    };

    const multiLineChart = () => {
        const {translate} = props;
        let xs = {};

        removePreviousChart();
        let dataChart = setDataMultiLineChart();

        for (let i = 0; i < dataChart.length; i = i + 2) {
            let temporary = {};
            temporary[dataChart[i + 1][0]] = dataChart[i][0];
            xs = Object.assign(xs, temporary);
        }

        const chart = c3.generate({
            bindto: refMultiLineChart.current,

            padding: {
                top: 20,
                bottom: 20,
                right: 20
            },

            data: {
                xs: xs,
                columns: dataChart
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
                        text: translate('kpi.organizational_unit.dashboard.point'),
                        position: 'outer-right'
                    },
                    padding: {
                        top: 10,
                        bottom: 10
                    }
                }
            },

            legend: {
                show: false
            }
        })
        setState({
            ...state,
            chart: chart
        })

        return {
            chart, 
            dataChart
        }
    };

    const handleExportData = (exportData) => {
        const {onDataAvailable} = props;
        if (onDataAvailable) {
            onDataAvailable(exportData);
        }
        setState({
                ...state,
                exportData: exportData
            }
        )
    };

    /*Chuyển đổi dữ liệu KPI nhân viên thành dữ liệu export to file excel */
    const convertDataToExportData = (data) => {
        let fileName = "Kết quả KPI nhân viên toàn đơn vị theo từng tháng";
        let convertToObjectData = {}, finalData = [], employeeKpiArray = [];
        if (data) {

            if (data) {
                for (let i = 0; i < data.length; i++) {
                    if (data[i].employeeKpi.length > 1) {
                        for (let j = 0; j < data[i].employeeKpi.length; j++) {

                            data[i].employeeKpi[j]["name"] = data[i]._id;

                            let d = new Date(data[i].employeeKpi[j].date),
                                month = (d.getMonth() + 1) + "-" + d.getFullYear();
                            data[i].employeeKpi[j]["month"] = month;
                            data[i].employeeKpi[j]["date"] = d;

                            employeeKpiArray.push(data[i].employeeKpi[j]);
                        }
                    }
                }
            }

            for (let i = 0; i < employeeKpiArray.length; i++) {
                let objectName = employeeKpiArray[i].month;
                let checkDuplicate = (Object.keys(convertToObjectData)).find(element => element === objectName);
                if (!checkDuplicate) {
                    convertToObjectData[objectName] = [];
                    convertToObjectData[objectName].push(employeeKpiArray[i]);
                } else {
                    convertToObjectData[objectName].push(employeeKpiArray[i]);
                }

            }
            finalData = Object.values(convertToObjectData);

        }

        let exportData = {
            fileName: fileName,
            dataSheets: finalData.map((x, index) => {
                return {
                    sheetName: x[0].month ? x[0].month : "",
                    sheetTitle: "Thống kê kết quả KPI " + (x[0].month ? x[0].month : ""),
                    tables: [
                        {
                            columns: [
                                {key: "date", value: "Thời gian"},
                                {key: "name", value: "Tên nhân viên"},
                                {key: "automaticPoint", value: "Điểm KPI tự động"},
                                {key: "employeePoint", value: "Điểm KPI tự đánh giá"},
                                {key: "approvedPoint", value: "Điểm KPI được phê duyệt"}
                            ],
                            data: x
                        }
                    ]
                }
            })
        }
        return exportData;
    };

    const {createEmployeeKpiSet, translate} = props;

    let employeeKpiSetsInOrganizationalUnitByMonth;

    if (createEmployeeKpiSet.employeeKpiSetsInOrganizationalUnitByMonth) {
        employeeKpiSetsInOrganizationalUnitByMonth = createEmployeeKpiSet.employeeKpiSetsInOrganizationalUnitByMonth;
    }
    
    return (
        <React.Fragment>
            <section className="form-inline">
                <div className="form-group">
                    <label>{translate('kpi.evaluation.employee_evaluation.from')}</label>
                    <DatePicker
                        id="monthStartInResultsOfAllEmployeeKpiSetChart"
                        dateFormat="month-year"
                        value={defaultStartMonth}
                        onChange={handleSelectMonthStart}
                        disabled={false}
                    />
                </div>
            </section>
            <section className="form-inline">
                <div>
                </div>
                <div className="form-group">
                    <label>{translate('kpi.evaluation.employee_evaluation.to')}</label>
                    <DatePicker
                        id="monthEndInResultsOfAllEmployeeKpiSetChart"
                        dateFormat="month-year"
                        value={defaultEndMonth}
                        onChange={handleSelectMonthEnd}
                        disabled={false}
                    />
                </div>
                <div className="form-group">
                    <button type="button" className="btn btn-success"
                            onClick={handleSearchData}>{translate('kpi.evaluation.employee_evaluation.search')}</button>
                </div>
            </section>

            <section className="box-body" style={{textAlign: "right"}}>

                <div className="btn-group">
                    <button type="button"
                            className={`btn btn-xs ${state.kindOfPoint === KIND_OF_POINT.AUTOMATIC ? 'btn-danger' : null}`}
                            onClick={() => handleSelectKindOfPoint(KIND_OF_POINT.AUTOMATIC)}>{translate('kpi.evaluation.dashboard.auto_point')}</button>
                    <button type="button"
                            className={`btn btn-xs ${state.kindOfPoint === KIND_OF_POINT.EMPLOYEE ? 'btn-danger' : null}`}
                            onClick={() => handleSelectKindOfPoint(KIND_OF_POINT.EMPLOYEE)}>{translate('kpi.evaluation.dashboard.employee_point')}</button>
                    <button type="button"
                            className={`btn btn-xs ${state.kindOfPoint === KIND_OF_POINT.APPROVED ? 'btn-danger' : null}`}
                            onClick={() => handleSelectKindOfPoint(KIND_OF_POINT.APPROVED)}>{translate('kpi.evaluation.dashboard.approve_point')}</button>
                </div>
            </section>
            {employeeKpiSetsInOrganizationalUnitByMonth ?

            <section id={"resultsOfAllEmployeeKpiSet"} className="c3-chart-container">
                <div ref={refMultiLineChart}></div>
                <CustomLegendC3js
                    chart={state.chart}
                    chartId={"resultsOfAllEmployeeKpiSet"}
                    legendId={"resultsOfAllEmployeeKpiSetLegend"}
                    title={employeeKpiSetsInOrganizationalUnitByMonth && `${translate('general.list_employee')} (${employeeKpiSetsInOrganizationalUnitByMonth.length })`}
                    dataChartLegend={state.dataChart && state.dataChart.filter((item, index) => index % 2 === 1).map(item => item[0])}
                />
            </section>
                : employeeKpiSetsInOrganizationalUnitByMonth &&
                <section>{translate('kpi.organizational_unit.dashboard.no_data')}</section>
            }
        </React.Fragment>
    )
}

function mapState(state) {
    const {createEmployeeKpiSet} = state;
    return {createEmployeeKpiSet};
}

const actions = {
    getAllEmployeeKpiSetInOrganizationalUnitsByMonth: createKpiSetActions.getAllEmployeeKpiSetInOrganizationalUnitsByMonth
}

const connectedResultsOfAllEmployeeKpiSetChart = connect(mapState, actions)(withTranslate(ResultsOfAllEmployeeKpiSetChart));

export {connectedResultsOfAllEmployeeKpiSetChart as ResultsOfAllEmployeeKpiSetChart};
