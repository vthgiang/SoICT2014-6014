import React, { useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { createKpiSetActions } from "../../../kpi/employee/creation/redux/actions";
import c3 from 'c3';
import 'c3/c3.css';
import { useState } from "react";

function KpiUser(props) {
    useEffect(() => {
        if (props.unitId) {
            props.getAllEmployeeKpiSetByMonth([props.unitId], props.user._id, props.startDate, props.endDate)
        }
    }, [props.user._id])
   
    const barChart = () => {
        const { translate } = props;
        const { createEmployeeKpiSet } = props;
        const { employeeKpiSetByMonth } = createEmployeeKpiSet;
        let dataChart = [["approvedPoint", 0], ["automaticPoint", 0], ["employeePoint", 0]]
        if (employeeKpiSetByMonth) {
            let approvedPoint = 0, automaticPoint = 0, employeePoint = 0;
            for (let i = 0; i < employeeKpiSetByMonth.length; i++) {
                approvedPoint = approvedPoint + employeeKpiSetByMonth[i].approvedPoint
                automaticPoint = automaticPoint + employeeKpiSetByMonth[i].automaticPoint
                employeePoint = employeePoint + employeeKpiSetByMonth[i].employeePoint
            }
            dataChart = [["approvedPoint", approvedPoint], ["automaticPoint", automaticPoint], ["employeePoint", employeePoint]]
        }
        let x = ["Điểm KPI"];
        let chart = c3.generate({
            bindto: "#id",


            // Căn lề biểu đồ
            padding: {
                top: 20,
                bottom: 20,
                right: 20,
                left: 20
            },
            axis: {
                x: {
                    type: 'category',
                    categories: x,
                    tick: {
                        multiline: false
                    }
                },
                //  rotated: true
            },
            data: {
                columns: dataChart,
                type: 'bar'
            },

        })

    }
    if (props.createEmployeeKpiSet.employeeKpiSetByMonth){
        barChart()
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



export default connect(mapState, mapDispatchToProps)(withTranslate(KpiUser));