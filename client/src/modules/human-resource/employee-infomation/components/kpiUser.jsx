import React, { useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { createKpiSetActions } from "../../../kpi/employee/creation/redux/actions";
import c3 from 'c3';
import 'c3/c3.css';
function areEqual(prevProps, nextProps) {
    if (prevProps.user._id === nextProps.user._id && prevProps.search === nextProps.search  && JSON.stringify(prevProps.createEmployeeKpiSet.employeeKpiSetByMonth)===JSON.stringify(nextProps.createEmployeeKpiSet.employeeKpiSetByMonth)){
        return true
    } else {
        return false
    }
}
function KpiUser(props) {
    useEffect(() => {
        if (props.unitId) {
            props.getAllEmployeeKpiSetByMonth([props.unitId], props.user._id, props.startDate, props.endDate)
        }
    }, [props.user._id, props.search])
    const renderChart = (data) => {
        // {nameApprovedPoint,nameAutomaticPoint,nameEmployeePointt,ratioX,approvedPoint,automaticPoint,employeePoint}
        let chart = c3.generate({
            bindto: "#id",
            data: {
                x: 'x',
                columns: [],
                hide: true,
                type: 'bar',
                names: {
                    data1: data.nameApprovedPoint,
                    data2: data.nameAutomaticPoint,
                    data3: data.nameEmployeePointt
                },
            },
            bar: {
                width: {
                    ratio: 0.8
                }
            },
            axis: {
                x: {
                    type: 'timeseries',
                    tick: {
                        format: '%m - %Y',
                        outer: false,
                        rotate: -45,
                        multiline: false
                    },
                },
                y: {
                    tick: {
                        outer: false
                    },
                }
            },
        });

        setTimeout(function () {
            chart.load({
                columns: [data.ratioX, ['data1', ...data.approvedPoint],
                ['data2', ...data.automaticPoint], ['data3', ...data.employeePoint]
                ],
            });
        }, 100);
        setTimeout(function () {
            chart.load({
                columns: [data.ratioX, ['data1', ...data.approvedPoint],
                ['data2', ...data.automaticPoint], ['data3', ...data.employeePoint]
                ],
            });
        }, 300);
    };

    if (props.createEmployeeKpiSet.employeeKpiSetByMonth) {
        let data = props.createEmployeeKpiSet.employeeKpiSetByMonth
        let ratioX = ['x'];
        let approvedPoint = [], automaticPoint = [], employeePoint = [];
        data.forEach(element => {

            let date = element.date.slice(0, 7) + '-01'
            ratioX = [...ratioX, date]
            approvedPoint = [...approvedPoint, element.approvedPoint]
            automaticPoint = [...automaticPoint, element.automaticPoint]
            employeePoint = [...employeePoint, element.employeePoint]
        });
        let nameApprovedPoint = `ApprovedPoint`
        let nameAutomaticPoint = `AutomaticPoint`
        let nameEmployeePointt = `EmployeePointt`
        renderChart({ nameApprovedPoint, nameAutomaticPoint, nameEmployeePointt, ratioX, approvedPoint, automaticPoint, employeePoint })
    }
    return (
        <div id="id">
        </div>
    )
}
function mapState(state) {
    const { createEmployeeKpiSet } = state;

    return { createEmployeeKpiSet }
}

const mapDispatchToProps = {
    getAllEmployeeKpiSetByMonth: createKpiSetActions.getAllEmployeeKpiSetByMonth
}



export default connect(mapState, mapDispatchToProps)(withTranslate(React.memo(KpiUser,areEqual)));