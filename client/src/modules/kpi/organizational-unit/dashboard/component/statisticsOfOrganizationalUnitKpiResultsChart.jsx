import React, {Component, useEffect, useState} from 'react';
import { connect } from 'react-redux';

import { dashboardOrganizationalUnitKpiActions } from '../redux/actions';

import { forceCheckOrVisible } from '../../../../../common-components/index';

import { withTranslate } from 'react-redux-multilingual';

import c3 from 'c3';
import 'c3/c3.css';
import * as d3 from "d3";

function StatisticsOfOrganizationalUnitKpiResultsChart(props) {
    const DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3 };
    const KIND_OF_POINT = { AUTOMATIC: 1, EMPLOYEE: 2, APPROVED: 3 };

    const today = new Date();

    const [state, setState] = useState({
        month: today.getFullYear() + '-' + (today.getMonth() + 1),
        dataStatus: DATA_STATUS.QUERYING,
        kindOfPoint: KIND_OF_POINT.AUTOMATIC,
        exportData:null
    });

    const refColumnChart = React.createRef();


    const { dashboardOrganizationalUnitKpi, translate, month } = props;
    let { exportData, kindOfPoint } =state;
    let listEmployeeKpiSet, employeeKpiSetsLoading;

    useEffect(() => {
        props.getAllEmployeeKpiSetInOrganizationalUnit(localStorage.getItem("currentRole"), props.organizationalUnitId, state.month);
        forceCheckOrVisible(true, true);
    },[]);

    useEffect(() => {
        columnChart();
    });

    if (props.organizationalUnitId !== state.organizationalUnitId || props.month !== state.month) {
        props.getAllEmployeeKpiSetInOrganizationalUnit(localStorage.getItem("currentRole"), props.organizationalUnitId, props.month);

        setState ({
            ...state,
            organizationalUnitId: props.organizationalUnitId,
            month: props.month,
            dataStatus: DATA_STATUS.QUERYING
        })
    }

    const handleSelectKindOfPoint = (value) => {
        if (Number(value) !== state.kindOfPoint) {
            setState({
                ...state,
                kindOfPoint: Number(value)
            })
        }
    };

   const filterAndCountEmployeeWithTheSamePoint = (arrayPoint) => {
        let point = Array.from(new Set(arrayPoint));
        let employeeWithTheSamePoints, countEmployeeWithTheSamePoint = [];
        const { translate } = props;
        point.sort(function (a, b) {
            return a - b;
        });

        point = point.filter(point => point).map(point => {
            if (point) {
                let index = arrayPoint.indexOf(point);
                let theSamePoints = [];

                while (index !== -1) {
                    theSamePoints.push(index);
                    index = arrayPoint.indexOf(point, index + 1);
                }

                countEmployeeWithTheSamePoint.push(theSamePoints.length);
                return point;
            }
        })

        point.unshift('x');
        countEmployeeWithTheSamePoint.unshift(translate('kpi.organizational_unit.dashboard.statistic_kpi_unit.count_employee_same_point'));

        employeeWithTheSamePoints = [
            point,
            countEmployeeWithTheSamePoint
        ]

        return employeeWithTheSamePoints;
    };

   const  countEmployeeWithTheSamePoint =(arrayPoint)=>
    {
        let pointAndEmployeesWithSamePoint={};
        for (let i=0;i<arrayPoint.length;i++){
            let check = Object.keys(pointAndEmployeesWithSamePoint).find(x=>x===arrayPoint[i])
            if(!check){
                pointAndEmployeesWithSamePoint[arrayPoint[i]]=1;
                continue;
            }
            pointAndEmployeesWithSamePoint[arrayPoint[i]]++ ;
        }
        return pointAndEmployeesWithSamePoint;
    };

    const setDataColumnChart = () => {
        const { dashboardOrganizationalUnitKpi, translate,month, organizationalUnit,organizationalUnitId } = props;
        let listEmployeeKpiSet, automaticPoint = [], employeePoint = [], approvedPoint = [] ;
        let employeeWithTheSamePoints, textLabel;
        if (dashboardOrganizationalUnitKpi.employeeKpiSets) {
            listEmployeeKpiSet = dashboardOrganizationalUnitKpi.employeeKpiSets
        }

        if (listEmployeeKpiSet) {
            listEmployeeKpiSet.map(kpi => {
                automaticPoint.push(kpi.automaticPoint);
                employeePoint.push(kpi.employeePoint);
                approvedPoint.push(kpi.approvedPoint);
            })
        }

        if (state.kindOfPoint === KIND_OF_POINT.AUTOMATIC) {
            employeeWithTheSamePoints = filterAndCountEmployeeWithTheSamePoint(automaticPoint);
            textLabel = translate('kpi.organizational_unit.dashboard.statistic_kpi_unit.automatic_point');
        } else if (state.kindOfPoint === KIND_OF_POINT.EMPLOYEE) {
            employeeWithTheSamePoints = filterAndCountEmployeeWithTheSamePoint(employeePoint);
            textLabel = translate('kpi.organizational_unit.dashboard.statistic_kpi_unit.employee_point');
        } else if (state.kindOfPoint === KIND_OF_POINT.APPROVED) {
            employeeWithTheSamePoints = filterAndCountEmployeeWithTheSamePoint(approvedPoint);
            textLabel = translate('kpi.organizational_unit.dashboard.statistic_kpi_unit.approved_point');
        }

        //phan xu ly cua exportData
        let countAutomaticPoint =countEmployeeWithTheSamePoint(automaticPoint);
        let countEmployeePoint =countEmployeeWithTheSamePoint(employeePoint);
        let countApprovedPoint =countEmployeeWithTheSamePoint(approvedPoint);

        if(listEmployeeKpiSet && month && organizationalUnit){
            let exportData =convertDataToExportData(listEmployeeKpiSet,organizationalUnit,organizationalUnitId,month,countAutomaticPoint,countEmployeePoint,countApprovedPoint)
            handleExportData(exportData);
        }

        return {
            'employeeWithTheSamePoints': employeeWithTheSamePoints,
            'textLabel': textLabel
        };
    };

    const removePreviosChart = () => {
        const chart = refColumnChart.current;
        if (chart) {
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
        }
    };

   const columnChart = () => {
        removePreviosChart();

        let dataPoints, dataChart, textLabel;

        dataPoints = setDataColumnChart();
        dataChart = dataPoints.employeeWithTheSamePoints;
        textLabel = dataPoints.textLabel;

        let chart = c3.generate({
            bindto: refColumnChart.current,

            data: {
                x: 'x',
                columns: dataChart,
                type: 'bar'
            },

            bar: {
                width: {
                    ratio: 0.1
                }
            },

            axis: {
                x: {
                    label: {
                        text: 'Điểm',
                        position: 'outer-center',
                    },
                    padding: {
                        top: 10,
                        bottom: 10
                    }
                },
                y: {
                    label: {
                        text: 'Số người cùng điểm',
                        position: 'outer-middle',
                    },
                    padding: {
                        right: 10,
                        left: 10
                    },
                    tick: {
                        format: function(d) {
                            if (d - parseInt(d) === 0) {
                                return d;
                            } else {
                                return "";
                            }
                        }
                    }
                }
            },

            legend: {
                show: false
            }
        })
    };

   const handleExportData =(exportData)=>
    {
        const { onDataAvailable } = props;
        if (onDataAvailable) {
            onDataAvailable(exportData);
        }
    };

    /*Chuyển đổi dữ liệu KPI nhân viên thành dữ liệu export to file excel */
    const convertDataToExportData = (data,organizationalUnit,organizationalUnitId, month,countAutomaticPoint,countEmployeePoint,countApprovedPoint) => {
        let name;
        if(organizationalUnitId){
            let currentOrganizationalUnit = organizationalUnit.find(item => item.id===organizationalUnitId);
            name = currentOrganizationalUnit.name;
        }
        else{
            name = organizationalUnit[0].name;
        }

        let fileName = "Thống kê kết quả KPI " +(name?name:"")+" "+ ( month?("tháng "+month):"" );
        if (data) {
            data = data.map((x, index) => {

                let automaticPoint = (x.automaticPoint === null)?"Chưa đánh giá":parseInt(x.automaticPoint);
                let numberEmployeesWithSameAutomaticPoint = countAutomaticPoint[automaticPoint];
                let employeePoint = (x.employeePoint === null)?"Chưa đánh giá":parseInt(x.employeePoint);
                let numberEmployeesWithSameEmployeePoint = countEmployeePoint[employeePoint];
                let approverPoint =(x.approvedPoint===null)?"Chưa đánh giá":parseInt(x.approvedPoint);
                let numberEmployeesWithSameApprovedPoint = countApprovedPoint[approverPoint];

                return {
                    automaticPoint: automaticPoint,
                    numberEmployeesWithSameAutomaticPoint:numberEmployeesWithSameAutomaticPoint,
                    employeePoint: employeePoint,
                    numberEmployeesWithSameEmployeePoint:numberEmployeesWithSameEmployeePoint,
                    approverPoint: approverPoint,
                    numberEmployeesWithSameApprovedPoint:numberEmployeesWithSameApprovedPoint
                };
            })
        }

        let exportData = {
            fileName: fileName,
            dataSheets: [
                {
                    sheetName: "sheet1",
                    sheetTitle : fileName,
                    tables: [
                        {
                            columns: [
                                { key: "automaticPoint", value: "Điểm KPI tự động" },
                                { key: "employeePoint", value: "Điểm KPI tự đánh giá" },
                                { key: "approverPoint", value: "Điểm KPI được phê duyệt" },
                                { key: "numberEmployeesWithSameAutomaticPoint", value: "Số nhân viên có cùng điểm KPI tự động " },
                                { key: "numberEmployeesWithSameEmployeePoint", value: "Số nhân viên có cùng điểm KPI tự đánh giá " },
                                { key: "numberEmployeesWithSameApprovedPoint", value: "Số nhân viên có cùng điểm KPI được phê duyệt " },
                            ],
                            data: data
                        }
                    ]
                },
            ]
        }
        return exportData;
    };

    if (dashboardOrganizationalUnitKpi.employeeKpiSets) {
        listEmployeeKpiSet = dashboardOrganizationalUnitKpi.employeeKpiSets;
        employeeKpiSetsLoading = dashboardOrganizationalUnitKpi.employeeKpiSetsLoading
    }

    return (
        <React.Fragment>
            {listEmployeeKpiSet && (listEmployeeKpiSet.length !== 0) ?
                <section className="box-body" style={{ textAlign: "right" }}>
                    <section className="btn-group">
                        <button type="button" className={`btn btn-xs ${kindOfPoint === KIND_OF_POINT.AUTOMATIC ? 'btn-danger' : null}`} onClick={() => handleSelectKindOfPoint(KIND_OF_POINT.AUTOMATIC)}>Automatic Point</button>
                        <button type="button" className={`btn btn-xs ${kindOfPoint === KIND_OF_POINT.EMPLOYEE ? 'btn-danger' : null}`} onClick={() => handleSelectKindOfPoint(KIND_OF_POINT.EMPLOYEE)}>Employee Point</button>
                        <button type="button" className={`btn btn-xs ${kindOfPoint === KIND_OF_POINT.APPROVED ? 'btn-danger' : null}`} onClick={() => handleSelectKindOfPoint(KIND_OF_POINT.APPROVED)}>Approved Point</button>
                    </section>

                    <section ref={refColumnChart}> </section>
                </section>
                : employeeKpiSetsLoading && <section>{translate('kpi.organizational_unit.dashboard.no_data')}</section>

            }
        </React.Fragment>
    )

}

function mapState(state) {
    const { dashboardOrganizationalUnitKpi } = state;
    return { dashboardOrganizationalUnitKpi }
}
const actions = {
    getAllEmployeeKpiSetInOrganizationalUnit: dashboardOrganizationalUnitKpiActions.getAllEmployeeKpiSetInOrganizationalUnit
};

const connectedStatisticsOfOrganizationalUnitKpiResultsChart = connect(mapState, actions)(withTranslate(StatisticsOfOrganizationalUnitKpiResultsChart));
export { connectedStatisticsOfOrganizationalUnitKpiResultsChart as StatisticsOfOrganizationalUnitKpiResultsChart }
