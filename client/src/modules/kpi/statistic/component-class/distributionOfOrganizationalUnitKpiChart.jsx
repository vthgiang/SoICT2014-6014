import React, { useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { customAxisC3js } from '../../../../helpers/customAxisC3js';

import c3 from 'c3';
import 'c3/c3.css';

function DistributionOfOrganizationalUnitKpiChart(props) {
    const { translate, createKpiUnit, dataTreeUnitKpi, organizationalUnitKPI, maxDeg } = props;
    const chartOrganizationalUnitKpiRef = useRef(null);

    useEffect(() => {
        multiLineChart(organizationalUnitKPI, dataTreeUnitKpi, maxDeg);
    })

    /** Thiết lập object độ quan trọng của nhân viên */
    const setOrganizationalUnitImportance = () => {
        let currentKpi, organizationalUnitImportances, objectOrganizationalUnitImportance = {};

        if (createKpiUnit) {
            currentKpi = createKpiUnit.currentKPI;
        }
        if (currentKpi) {
            organizationalUnitImportances = currentKpi.organizationalUnitImportances;
            if (organizationalUnitImportances && organizationalUnitImportances.length !== 0) {
                organizationalUnitImportances.map(item => {
                    objectOrganizationalUnitImportance[item?.organizationalUnit?._id] = item?.importance;
                })
            } 
        }

        return objectOrganizationalUnitImportance;
    }

    /** Tính trọng số trung bình dựa vào độ quan trọng */
    const averageWeight = (organizationalUnitWeights, objectOrganizationalUnitImportance) => {
        let totalPoint = 0, totalImportance = 0, average; 
        if (organizationalUnitWeights && organizationalUnitWeights.length > 0) {
            organizationalUnitWeights.map(kpi => {
                if (kpi && objectOrganizationalUnitImportance[kpi?.organizationalUnitId]) {
                    totalPoint = totalPoint + kpi?.weight * objectOrganizationalUnitImportance[kpi?.organizationalUnitId];
                    totalImportance = totalImportance + objectOrganizationalUnitImportance[kpi?.organizationalUnitId];
                }
            })
        }
        
        if (totalImportance === 0) {
            average = 0;
        } else {
            average = Math.round(Number(totalPoint / totalImportance) * 1000) / 1000;
        }

        return average;
    }

    /** Thiết lập dữ liệu biểu đồ */
    const setDataMultiChart = (organizationalUnitKPI, dataTreeUnitKpi, maxDeg) => {
        let dataChartAnalysisChidrenUnit = [translate('kpi.organizational_unit.statistics.weight_analysis_children_unit')],
            dataChartAnalysisTreeUnit = [translate('kpi.organizational_unit.statistics.weight_analysis_tree_unit')],
            dataChartDefault = [translate('kpi.organizational_unit.statistics.weight_established')],
            xs = ['x'];
        let objectChidrenKpiWeight = {};
        
        let objectOrganizationalUnitImportance;
        objectOrganizationalUnitImportance = setOrganizationalUnitImportance();


        // Phân tích trọng số cây KPI
        if (dataTreeUnitKpi) {
            let index = maxDeg;
            while (index > 0) {
                dataTreeUnitKpi && dataTreeUnitKpi.filter(item => item?.deg === index)
                    .map(kpi => {
                        if (!objectChidrenKpiWeight[kpi?.id]) {
                            if (!objectChidrenKpiWeight[kpi?.parent]) {
                                objectChidrenKpiWeight[kpi?.parent] = [];
                            }
                            objectChidrenKpiWeight[kpi?.parent].push({
                                organizationalUnitId: kpi?.organizationalUnitId,
                                weight: kpi?.weight
                            })
                        } else {
                            if (objectChidrenKpiWeight[kpi?.id].length !== 0) {
                                let totalPoint = 0, totalImportance = 0; 

                                objectChidrenKpiWeight[kpi?.id].map(childrenKpi => {
                                    let importance = [];
                                    importance = kpi?.listEmployeeKpi?.[0]?.organizationalUnitImportances?.filter(item => item?.organizationalUnit === childrenKpi?.organizationalUnitId)
                                    importance = importance?.length > 0 ? importance?.[0]?.importance : 0;

                                    totalPoint = totalPoint + childrenKpi?.weight * importance;
                                    totalImportance = totalImportance + importance;
                                })

                                if (!objectChidrenKpiWeight[kpi?.parent]) {
                                    objectChidrenKpiWeight[kpi?.parent] = [];
                                }
                                objectChidrenKpiWeight[kpi?.parent].push({
                                    organizationalUnitId: kpi?.organizationalUnitId,
                                    weight: totalImportance ? totalPoint / totalImportance : 0
                                })
                            }
                        }
                    })
                
                index--;
            }
        }
        
        if (organizationalUnitKPI && organizationalUnitKPI.length !== 0) {
            organizationalUnitKPI.map(unitKpi => {
                let averageAnalysisChidrenUnit, averageAnalysisTreeUnit; 
                let chidrenKpi, chidrenKpiByTree;
                chidrenKpi = dataTreeUnitKpi && dataTreeUnitKpi.filter(item => item?.deg === 1 && item?.parent === unitKpi?.id);
                chidrenKpiByTree = objectChidrenKpiWeight?.[unitKpi?.id];

                averageAnalysisChidrenUnit = averageWeight(chidrenKpi, objectOrganizationalUnitImportance);
                averageAnalysisTreeUnit = averageWeight(chidrenKpiByTree, objectOrganizationalUnitImportance);
                    
                    
                xs = [...xs, unitKpi.name];
                dataChartAnalysisChidrenUnit = [...dataChartAnalysisChidrenUnit, averageAnalysisChidrenUnit];
                dataChartAnalysisTreeUnit = [...dataChartAnalysisTreeUnit, averageAnalysisTreeUnit];
                dataChartDefault = [...dataChartDefault, unitKpi.weight];
            })
        }
        
        return {
            xs: xs,
            dataChart: [
                dataChartDefault,
                dataChartAnalysisChidrenUnit,
                dataChartAnalysisTreeUnit
            ]
        }
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
    const multiLineChart = (organizationalUnitKPI, dataTreeUnitKpi, maxDeg) => {
        removePreviousChart(chartOrganizationalUnitKpiRef.current);

        let dataChart, xs;
        let dataChartTemp = setDataMultiChart(organizationalUnitKPI, dataTreeUnitKpi, maxDeg);
        if (dataChartTemp) {
            dataChart = dataChartTemp.dataChart;
            xs = dataChartTemp.xs;
        }

        let chart = c3.generate({
            bindto: chartOrganizationalUnitKpiRef.current,

            padding: {
                top: 20,
                bottom: 50,
                right: 20
            },

            data: {
                columns: dataChart,
            },

            axis: {
                x: {
                    type: 'category',
                    tick: {
                        format: function (index) {
                            let result = customAxisC3js('chartOrganizationalUnitKpiRef', xs.filter((item, i) => i > 0), index);
                            return result;
                        }
                    }
                },
                
                y: {
                    min: 0,
                    label: {
                        text: translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.weight'),
                        position: 'outer-right'
                    }
                }
            },

            tooltip: {
                format: {
                    title: function (d) {
                        if (xs && xs.length > 1)
                            return xs[d + 1];
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
                <div id="chartOrganizationalUnitKpiRef" ref={chartOrganizationalUnitKpiRef}></div>
                : organizationalUnitKpiLoading && <section>{translate('kpi.organizational_unit.dashboard.no_data')}</section>
            }
        </React.Fragment>
    )
}

function mapState(state) {
    const { createKpiUnit, dashboardOrganizationalUnitKpi } = state;
    return { createKpiUnit, dashboardOrganizationalUnitKpi };
}
const actions = {

}

const connectedDistributionOfOrganizationalUnitKpiChart = connect(mapState, actions)(withTranslate(DistributionOfOrganizationalUnitKpiChart));
export { connectedDistributionOfOrganizationalUnitKpiChart as DistributionOfOrganizationalUnitKpiChart }