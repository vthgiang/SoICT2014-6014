import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { CustomLegendC3js } from '../../../../common-components'

import c3 from 'c3';
import 'c3/c3.css';

function DistributionOfOrganizationalUnitChart(props) {
    const { translate, createKpiUnit, organizationalUnitKPI } = props;
    const chartRef = useRef(null);

    useEffect(() => {
        multiLineChart(organizationalUnitKPI);
    })

    /** Thiết lập object độ quan trọng của nhân viên */
    const setEmployeeImportance = () => {
        let currentKpi, employeeImportances, objectEmployeeImportance = {};

        if (createKpiUnit) {
            currentKpi = createKpiUnit.currentKPI;
        }
        if (currentKpi) {
            employeeImportances = currentKpi.employeeImportances;
            if (employeeImportances && employeeImportances.length !== 0) {
                employeeImportances.map(item => {
                    objectEmployeeImportance[item.employee] = item.importance;
                })
            } 
        }

        return objectEmployeeImportance;
    }

    /** Thiết lập dữ liệu biểu đồ */
    const setDataMultiChart = (organizationalUnitKPI) => {
        let dataChartAnalysis = ['Điểm phân tích'], dataChartDefault = ['Điểm mặc định'], xs = ['x'];
        let objectEmployeeImportance;

        objectEmployeeImportance = setEmployeeImportance();

        console.log("organizationalUnitKPI", organizationalUnitKPI)
        if (organizationalUnitKPI && organizationalUnitKPI.length !== 0) {
            organizationalUnitKPI.map(unitKpi => {
                let totalPoint = 0, totalImportance = 0, average; 
                if (unitKpi && unitKpi.listEmployeeKpi && unitKpi.listEmployeeKpi.length !== 0) {
                    unitKpi.listEmployeeKpi.map(employeeKpi => {
                        if (employeeKpi.creator && employeeKpi.creator[0] && objectEmployeeImportance[employeeKpi.creator[0]]) {
                            totalPoint = totalPoint + employeeKpi.weight * objectEmployeeImportance[employeeKpi.creator[0]];
                            totalImportance = totalImportance + objectEmployeeImportance[employeeKpi.creator[0]]
                        }
                    })
                }

                if (totalImportance === 0) {
                    average = 0;
                } else {
                    average = Math.round(Number(totalPoint / totalImportance) * 1000) / 1000;
                }

                xs = [...xs, unitKpi.name];
                dataChartAnalysis = [...dataChartAnalysis, average];
                dataChartDefault = [...dataChartDefault, unitKpi.weight];
            })
        }

        return [
            xs,
            dataChartDefault,
            dataChartAnalysis
        ]
    }

    /** Xóa biểu đồ cũ */
    const removePreviousChart = (chart) => {
        if (chart) {
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
        } 
    } 

    /** Render biểu đồ */
    const multiLineChart = (organizationalUnitKPI) => {
        removePreviousChart(chartRef.current);

        let dataChartTemp = setDataMultiChart(organizationalUnitKPI);

        console.log("dataChartTemp", dataChartTemp)
        let chartTemp = c3.generate({
            bindto: chartRef.current,

            padding: {
                top: 20,
                bottom: 20,
                right: 20
            },

            data: {
                x: 'x',
                columns: dataChartTemp,
                type: 'spline'
            },

            axis: {
                x: {
                    type: 'category' // this needed to load string x value
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
            }
        })
    }

    let currentKpi, organizationalUnitKpiLoading;

    if (createKpiUnit) {
        currentKpi = createKpiUnit.currentKPI;
        organizationalUnitKpiLoading = createKpiUnit.organizationalUnitKpiLoading;
    }


    return (
        <React.Fragment>
            {currentKpi ?
                <div ref={chartRef}></div>
                : organizationalUnitKpiLoading && <section>{translate('kpi.organizational_unit.dashboard.no_data')}</section>
            }
        </React.Fragment>
    )
}

function mapState(state) {
    const { createKpiUnit } = state;
    return { createKpiUnit };
}
const actions = {

}

const connectedDistributionOfOrganizationalUnitChart = connect(mapState, actions)(withTranslate(DistributionOfOrganizationalUnitChart));
export { connectedDistributionOfOrganizationalUnitChart as DistributionOfOrganizationalUnitChart }