import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { createKpiSetActions } from '../../../employee/creation/redux/actions';

import { DatePicker, CustomLegendC3js, PaginateBar, ExportExcel } from '../../../../../common-components';

import { withTranslate } from 'react-redux-multilingual'

import Swal from 'sweetalert2';
import c3 from 'c3';
import 'c3/c3.css';
import dayjs from 'dayjs';
import cloneDeep from 'lodash/cloneDeep';
import { showListInSwal } from '../../../../../helpers/showListInSwal';

const formatString = (String) => {
    let part = String.split('-');
    return [part[1], part[0]].join('-');
}

function ResultsOfAllEmployeeKpiSetChart(props) {
    const INFO_SEARCH = {
        startMonth: dayjs().subtract(7, 'month').format("YYYY-MM"),
        endMonth: dayjs().format("YYYY-MM"),
    };

    const KIND_OF_POINT = { AUTOMATIC: 1, EMPLOYEE: 2, APPROVED: 3 };

    const [state, setState] = useState({
        userRoleId: localStorage.getItem("currentRole"),

        startMonth: INFO_SEARCH.startMonth,
        endMonth: INFO_SEARCH.endMonth,

        infosearch: {
            startMonth: INFO_SEARCH.startMonth,
            endMonth: INFO_SEARCH.endMonth,
        },

        defaultEndMonth: formatString(INFO_SEARCH.endMonth),
        defaultStartMonth: formatString(INFO_SEARCH.startMonth),

        kindOfPoint: KIND_OF_POINT.AUTOMATIC,
        page: 1,
        limit: 5
    });

    const { defaultEndMonth, defaultStartMonth, display, totalList, pageTotal, currentPage } = state;
    const { organizationalUnitsName } = props;
    const refMultiLineChart = React.createRef();

    const filterAndSetDataPoint = (dateAxisX, name, arrayPoint) => {
        let point = [];
        point.push(name);
        for (let index = 0; index < dateAxisX.length; index++) {
            let currentPoint = null;
            for (let i = 0; i < arrayPoint.length; i++) {
                if (dayjs(formatString(dateAxisX[index])).format("MM-YYYY") === dayjs(arrayPoint[i].date).format("MM-YYYY")) {
                    if (state.kindOfPoint === KIND_OF_POINT.AUTOMATIC) {
                        currentPoint = arrayPoint[i].automaticPoint;
                    } else if (state.kindOfPoint === KIND_OF_POINT.EMPLOYEE) {
                        currentPoint = arrayPoint[i].employeePoint;
                    } else if (state.kindOfPoint === KIND_OF_POINT.APPROVED) {
                        currentPoint = arrayPoint[i].approvedPoint;
                    }
                }
            }
            point.push(currentPoint)
        }

        return point
    };

    // Lấy dữ liệu
    useEffect(() => {
        const { startMonth, endMonth } = state;
        props.getAllEmployeeKpiSetInOrganizationalUnitsByMonth(props.organizationalUnitIds, startMonth, endMonth);
    }, [JSON.stringify(props?.organizationalUnitIds)])


    // Lấy dữ liệu xong xử lý
    useEffect(() => {
        const { createEmployeeKpiSet } = props;
        let { page, limit, startMonth, endMonth } = state;

        let employeeKpiSetsInOrganizationalUnitByMonth, point = [], exportData;

        if (createEmployeeKpiSet.employeeKpiSetsInOrganizationalUnitByMonth) {
            employeeKpiSetsInOrganizationalUnitByMonth = cloneDeep(createEmployeeKpiSet.employeeKpiSetsInOrganizationalUnitByMonth); // sap chép mảng mới độc lập
        }
        let totalList = employeeKpiSetsInOrganizationalUnitByMonth ? employeeKpiSetsInOrganizationalUnitByMonth?.length : 0;
        let pageTotal = ((totalList % limit) === 0) ?
            parseInt(totalList / limit) :
            parseInt((totalList / limit) + 1);

        let currentPage = parseInt((page / limit) + 1);

        // calculate start and end item indexes
        const startIndex = (currentPage - 1) * limit;
        const endIndex = Math.min(startIndex + limit - 1, totalList - 1);

        const employeeKpiSetsInOrganizationalUnitByMonthPaginate = employeeKpiSetsInOrganizationalUnitByMonth && employeeKpiSetsInOrganizationalUnitByMonth.slice(startIndex, endIndex + 1);

        if (employeeKpiSetsInOrganizationalUnitByMonth && props.dashboardPage === 'KPI') {
            exportData = convertDataToExportData(employeeKpiSetsInOrganizationalUnitByMonth)
        }

        let dateAxisX = [];
        const period = dayjs(endMonth).diff(startMonth, 'month');
        for (let i = 0; i <= period; i++) {
            dateAxisX = [
                ...dateAxisX,
                dayjs(startMonth).add(i, 'month').format("MM-YYYY"),
            ];
        }


        if (employeeKpiSetsInOrganizationalUnitByMonthPaginate) {
            for (let i = 0; i < employeeKpiSetsInOrganizationalUnitByMonthPaginate.length; i++) {
                let data = filterAndSetDataPoint(dateAxisX, employeeKpiSetsInOrganizationalUnitByMonthPaginate[i]._id, employeeKpiSetsInOrganizationalUnitByMonthPaginate[i].employeeKpi);
                point = [...point, data]
            }
        }

        if (point)
            setState({
                ...state,
                dataChart: point,
                dateAxisX: dateAxisX,
                display: employeeKpiSetsInOrganizationalUnitByMonthPaginate?.length,
                totalList,
                pageTotal,
                currentPage,
                exportData
            })
    }, [JSON.stringify(props?.createEmployeeKpiSet?.employeeKpiSetsInOrganizationalUnitByMonth), state.kindOfPoint, state.infosearch.startMonth, state.infosearch.endMonth, state.page])

    const removePreviousChart = () => {
        const chart = refMultiLineChart.current;

        if (chart) {
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
        }
    };

    const renderChart = (dataChart, dateAxisX) => {
        removePreviousChart();
        const chart = c3.generate({
            bindto: refMultiLineChart.current,

            padding: {
                top: 20,
                bottom: 20,
                right: 20
            },

            data: {
                columns: dataChart
            },

            axis: {
                x: {
                    type: 'category',
                    categories: dateAxisX
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
        setState({ ...state, chart })
    }

    // Xử lý xong có dữ liệu thì vẽ chart
    useEffect(() => {
        const { dataChart, dateAxisX } = state;
        if (dataChart?.length) {
            renderChart(dataChart, dateAxisX)
        }
    }, [JSON.stringify(state.dataChart)])


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
    const handleSearchData = () => {
        let startMonth = new Date(state.startMonth);
        let endMonth = new Date(state.endMonth);

        if (startMonth.getTime() > endMonth.getTime()) {
            const { translate } = props;
            Swal.fire({
                title: translate('kpi.evaluation.employee_evaluation.wrong_time'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm')
            })
        } else {
            props.organizationalUnitIds && props.getAllEmployeeKpiSetInOrganizationalUnitsByMonth(props.organizationalUnitIds, state.startMonth, state.endMonth);
            setState({
                ...state,
                infosearch: {
                    ...state.infosearch,
                    startMonth: state.startMonth,
                    endMonth: state.endMonth
                },
                page: 1,

            })
        }
    };


    // const handleExportData = (exportData) => {
    //     const { onDataAvailable } = props;
    //     if (onDataAvailable) {
    //         onDataAvailable(exportData);
    //     }
    //     setState({
    //         ...state,
    //         exportData: exportData
    //     }
    //     )
    // };

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
                                { key: "date", value: "Thời gian" },
                                { key: "name", value: "Tên nhân viên" },
                                { key: "automaticPoint", value: "Điểm KPI tự động" },
                                { key: "employeePoint", value: "Điểm KPI tự đánh giá" },
                                { key: "approvedPoint", value: "Điểm KPI được phê duyệt" }
                            ],
                            data: x
                        }
                    ]
                }
            })
        }
        return exportData;
    };

    const handlePagination = (page) => {
        const { limit } = state;
        let pageConvert = (page - 1) * (limit);

        setState({
            ...state,
            page: parseInt(pageConvert),
        })
    }

    const { createEmployeeKpiSet, translate } = props;

    let employeeKpiSetsInOrganizationalUnitByMonth;

    if (createEmployeeKpiSet.employeeKpiSetsInOrganizationalUnitByMonth) {
        employeeKpiSetsInOrganizationalUnitByMonth = createEmployeeKpiSet.employeeKpiSetsInOrganizationalUnitByMonth;
    }

    return (
        <div className="box box-solid">
            <div className="box-header with-border">
                <div className="box-title">
                    {`${translate('kpi.evaluation.dashboard.result_kpi_titile')} `}
                    {
                        organizationalUnitsName && organizationalUnitsName.length < 2 ?
                            <>
                                <span>{` ${organizationalUnitsName?.[0]} `}</span>
                            </>
                            :
                            <span onClick={() => showListInSwal(organizationalUnitsName, translate('general.list_unit'))} style={{ cursor: 'pointer' }}>
                                <a style={{ cursor: 'pointer', fontWeight: 'bold' }}> {organizationalUnitsName?.length}</a>
                                <span>{` ${translate('task.task_dashboard.unit_lowercase')} `}</span>
                            </span>
                    }
                    {formatString(state.startMonth)}<i className="fa fa-fw fa-caret-right"></i>{formatString(state.endMonth)}
                </div>
                {
                    state.exportData && props?.dashboardPage === 'KPI' &&
                    <ExportExcel
                        type="link" id="export-all-employee-kpi-evaluate-result-dashboard"
                        exportData={state.exportData}
                        style={{ marginTop: 5 }}
                    />
                }

            </div>
            <div className="box-body qlcv">
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

                <section className="box-body" style={{ textAlign: "right" }}>
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
                {createEmployeeKpiSet.loading
                    ? <p>{translate('general.loading')}</p>
                    : employeeKpiSetsInOrganizationalUnitByMonth ?
                        <>
                            <section id={"resultsOfAllEmployeeKpiSet"} className="c3-chart-container">
                                <div ref={refMultiLineChart}></div>
                                <CustomLegendC3js
                                    chart={state?.chart}
                                    chartId={"resultsOfAllEmployeeKpiSet"}
                                    legendId={"resultsOfAllEmployeeKpiSetLegend"}
                                    title={employeeKpiSetsInOrganizationalUnitByMonth && `${translate('general.list_employee')} (${employeeKpiSetsInOrganizationalUnitByMonth.length})`}
                                    dataChartLegend={state.dataChart && state.dataChart.map(item => item[0])}
                                />
                            </section>
                            <PaginateBar
                                display={display}
                                total={totalList}
                                pageTotal={pageTotal}
                                currentPage={currentPage}
                                func={handlePagination}
                            />
                        </>
                        : employeeKpiSetsInOrganizationalUnitByMonth &&
                        <section>{translate('kpi.organizational_unit.dashboard.no_data')}</section>
                }
            </div>
        </div>
    )
}

function mapState(state) {
    const { createEmployeeKpiSet } = state;
    return { createEmployeeKpiSet };
}

const actions = {
    getAllEmployeeKpiSetInOrganizationalUnitsByMonth: createKpiSetActions.getAllEmployeeKpiSetInOrganizationalUnitsByMonth
}

const connectedResultsOfAllEmployeeKpiSetChart = connect(mapState, actions)(withTranslate(ResultsOfAllEmployeeKpiSetChart));

export { connectedResultsOfAllEmployeeKpiSetChart as ResultsOfAllEmployeeKpiSetChart };
