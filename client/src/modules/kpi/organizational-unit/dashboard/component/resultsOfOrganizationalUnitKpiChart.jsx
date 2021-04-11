import React, {Component, useEffect, useState} from 'react';
import { connect } from 'react-redux';

import { createUnitKpiActions } from '../../creation/redux/actions';

import { DatePicker } from '../../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import Swal from 'sweetalert2';

import c3 from 'c3';
import 'c3/c3.css';

function ResultsOfOrganizationalUnitKpiChart(props) {

    let currentDate = new Date();
    let currentYear = currentDate.getFullYear();
    let currentMonth = currentDate.getMonth();

    const INFO_SEARCH = {
        startDate: currentYear + '-' + 1,
        endDate: (currentMonth > 10) ? ((currentYear + 1) + '-' + (currentMonth - 10)) : (currentYear + '-' + (currentMonth + 2))
    };

    const DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3 };

    const refMultiLineChart = React.createRef();

    const [state, setState] = useState({
        currentRole: localStorage.getItem("currentRole"),
        organizationalUnitId: null,
        startDate: INFO_SEARCH.startDate,
        endDate: INFO_SEARCH.endDate,
        dataStatus: DATA_STATUS.QUERYING
    });

    useEffect(() => {
        props.getAllOrganizationalUnitKpiSetByTime(localStorage.getItem("currentRole"), props.organizationalUnitId, state.startDate, state.endDate);

        setState( {
            ...state,
            dataStatus: DATA_STATUS.QUERYING,
        });
    },[]);

    useEffect(() => {
        if (props.organizationalUnitId !== state.organizationalUnitId) {
            props.getAllOrganizationalUnitKpiSetByTime(state.currentRole, props.organizationalUnitId, state.startDate, state.endDate);
            setState( {
                ...state,
                dataStatus: DATA_STATUS.QUERYING,
            });

        }

        // if (state.startDate !== state.startDate || state.endDate !== state.endDate) {
            props.getAllOrganizationalUnitKpiSetByTime(state.currentRole, state.organizationalUnitId, state.startDate, state.endDate);
            setState( {
                ...state,
                dataStatus: DATA_STATUS.QUERYING,
            });

        // }
    }, [props.organizationalUnitId, state.startDate, state.endDate])

    useEffect(() => {
        if (state.dataStatus === DATA_STATUS.QUERYING) {
            if (props.createKpiUnit.organizationalUnitKpiSets) {

                setState( {
                    ...state,
                    dataStatus: DATA_STATUS.AVAILABLE
                })
            }
        } else if (state.dataStatus === DATA_STATUS.AVAILABLE) {
            multiLineChart();

            setState( {
                ...state,
                dataStatus: DATA_STATUS.FINISHED
            })
        }

    });

    if (props.organizationalUnitId !== state.organizationalUnitId) {
        setState ({
            ...state,
            organizationalUnitId: props.organizationalUnitId
        })
    }

    const setDataMultiLineChart = () => {
        const { createKpiUnit, translate, organizationalUnit } = props;
        const { startDate, endDate, } = state;
        let listOrganizationalUnitKpiSetEachYear, automaticPoint, employeePoint, approvedPoint, date, dataMultiLineChart, exportData;

        if (createKpiUnit.organizationalUnitKpiSets) {
            listOrganizationalUnitKpiSetEachYear = createKpiUnit.organizationalUnitKpiSets
        }
        if (listOrganizationalUnitKpiSetEachYear && organizationalUnit) {
            exportData = convertDataToExportData(listOrganizationalUnitKpiSetEachYear, organizationalUnit, startDate, endDate);
            handleExportData(exportData);
        }

        if (listOrganizationalUnitKpiSetEachYear) {
            automaticPoint = [translate('kpi.organizational_unit.dashboard.result_kpi_unit_chart.automatic_point')];
            employeePoint = [translate('kpi.organizational_unit.dashboard.result_kpi_unit_chart.employee_point')];
            approvedPoint = [translate('kpi.organizational_unit.dashboard.result_kpi_unit_chart.approved_point')];
            date = ['x'];

            listOrganizationalUnitKpiSetEachYear.forEach(x => {
                automaticPoint.push(x?.automaticPoint);
                employeePoint.push(x?.employeePoint);
                approvedPoint.push(x?.approvedPoint);

                let newDate = new Date(x?.date);
                newDate = newDate?.getFullYear() + "-" + (newDate?.getMonth() + 1) + "-" + "01";
                date.push(newDate);
            });
        }

        dataMultiLineChart = [date, automaticPoint, employeePoint, approvedPoint];

        return dataMultiLineChart;
    };

    const handleSelectMonthStart = (value) => {
        let month = value.slice(3, 7) + '-' + value.slice(0, 2);

        INFO_SEARCH.startDate = month;
    };

    const handleSelectMonthEnd = async (value) => {
        let month;

        if (value.slice(0, 2) < 12) {
            month = value.slice(3, 7) + '-' + (new Number(value.slice(0, 2)) + 1);
        } else {
            month = (new Number(value.slice(3, 7)) + 1) + '-' + '1';
        }

        INFO_SEARCH.endDate = month;
    };

    const handleSearchData = async () => {
        let startDate = new Date(INFO_SEARCH.startDate);
        let endDate = new Date(INFO_SEARCH.endDate);
        const { translate } = props;
        if (startDate.getTime() >= endDate.getTime()) {
            Swal.fire({
                title: translate('kpi.organizational_unit.dashboard.alert_search.search'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi.organizational_unit.dashboard.alert_search.confirm')
            })
        } else {
            await setState( {
                ...state,
                startDate: INFO_SEARCH.startDate,
                endDate: INFO_SEARCH.endDate
            })
        }
    };

    const removePreviosMultiLineChart = () => {
        const chart = refMultiLineChart.current;

        if (chart) {
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild)
            }
        }
    };

    const multiLineChart = () => {
        removePreviosMultiLineChart();
        const { translate } = props;

        let dataMultiLineChart = setDataMultiLineChart();

        let chart = c3.generate({
            bindto: refMultiLineChart.current,

            padding: {
                top: 20,
                bottom: 20,
                right: 20
            },

            data: {
                x: 'x',
                columns: dataMultiLineChart
            },

            axis: {
                x: {
                    type: 'timeseries',
                    tick: {
                        format: function (x) { return (x?.getMonth() + 1) + "-" + x?.getFullYear(); }
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

            zoom: {
                enabled: false
            }
        });
    };

    const handleExportData = (exportData) => {
        const { onDataAvailable } = props;
        if (onDataAvailable) {
            onDataAvailable(exportData);
        }
    };

    /*Chuyển đổi dữ liệu KPI nhân viên thành dữ liệu export to file excel */
    const convertDataToExportData = (data, organizationalUnit, startDate, endDate) => {
        const { organizationalUnitId } = state;
        let name;
        if (organizationalUnitId) {
            let currentOrganizationalUnit = organizationalUnit.find(item => item.id === organizationalUnitId);
            name = currentOrganizationalUnit.name;
        }
        else {
            name = organizationalUnit[0].name;
        }

        let fileName = "Kết quả KPI " + (name ? name : name) + " từ " + (startDate ? startDate : "") + " đến " + (endDate ? endDate : "");
        if (data) {
            data = data.map((x, index) => {

                let automaticPoint = (x.automaticPoint === null) ? "Chưa đánh giá" : parseInt(x.automaticPoint);
                let employeePoint = (x.employeePoint === null) ? "Chưa đánh giá" : parseInt(x.employeePoint);
                let approverPoint = (x.approvedPoint === null) ? "Chưa đánh giá" : parseInt(x.approvedPoint);
                let d = new Date(x.date);

                return {
                    automaticPoint: automaticPoint,
                    employeePoint: employeePoint,
                    approverPoint: approverPoint,
                    date: d
                };
            })
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
                                { key: "date", value: "Thời gian" },
                                { key: "automaticPoint", value: "Điểm KPI tự động" },
                                { key: "employeePoint", value: "Điểm KPI tự đánh giá" },
                                { key: "approverPoint", value: "Điểm KPI được phê duyệt" }
                            ],
                            data: data
                        }
                    ]
                },
            ]
        }
        return exportData;
    };

    const { translate } = props;

    let d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;
    let defaultEndDate = [month, year].join('-');
    let defaultStartDate = ['01', year].join('-');

    return (
        <React.Fragment>
            {/* Search data trong một khoảng thời gian */}
            <section className="form-inline">
                <div className="form-group">
                    <label>{translate('kpi.organizational_unit.dashboard.start_date')}</label>
                    <DatePicker
                        id="monthStartInResultsOfOrganizationalUnitKpiChart"
                        dateFormat="month-year"
                        value={defaultStartDate}
                        onChange={handleSelectMonthStart}
                        disabled={false}
                    />
                </div>
            </section>
            <section className="form-inline">
                <div className="form-group">
                    <label>{translate('kpi.organizational_unit.dashboard.end_date')}</label>
                    <DatePicker
                        id="monthEndInResultsOfOrganizationalUnitKpiChart"
                        dateFormat="month-year"
                        value={defaultEndDate}
                        onChange={handleSelectMonthEnd}
                        disabled={false}
                    />
                </div>
                <div className="form-group">
                    <button type="button" className="btn btn-success" onClick={handleSearchData}>{translate('kpi.organizational_unit.dashboard.search')}</button>
                </div>
            </section>

            <section ref={refMultiLineChart}> </section>
        </React.Fragment>
    )
}

function mapState(state) {
    const { createKpiUnit } = state;
    return { createKpiUnit };
}

const actions = {
    getAllOrganizationalUnitKpiSetByTime: createUnitKpiActions.getAllOrganizationalUnitKpiSetByTime
}

const connectedResultsOfOrganizationalUnitKpiChart = connect(mapState, actions)(withTranslate(ResultsOfOrganizationalUnitKpiChart));
export { connectedResultsOfOrganizationalUnitKpiChart as ResultsOfOrganizationalUnitKpiChart }
