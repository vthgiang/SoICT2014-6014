import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import c3 from 'c3';
import 'c3/c3.css';

import { CustomLegendC3js } from '../../../../common-components';
import { customAxisC3js } from '../../../../helpers/customAxisC3js';

const LoadTaskOrganizationChart = (props) => {
    const { translate, tasks } = props
    const { taskDashboardCharts } = tasks
    const { startMonthTitle, endMonthTitle, units, idsUnit, typeChart } = props;

    const [state, setState] = useState({
        legend: [],
        dataChart: [],
    });
    const refMultiLineChart = React.createRef();
    const chart = useRef();
    const { legend } = state

    useEffect(() => {
        let data = getData("load-task-organization-chart")
        if (data)
            setState({
                ...state,
                dataChart: data.dataChart,
                legend: data.legend
            })
    }, [JSON.stringify(taskDashboardCharts)])

    useEffect(() => {
        if (typeChart === "followTime") {
            lineChartFollowTime();
        } else {
            barChartFollowUnit();
        }
    }, [JSON.stringify(state.dataChart)])

    function getData(chartName) {
        let dataChart;
        let data = taskDashboardCharts?.[chartName]
        if (data) {
            dataChart = data
        }
        return data;
    }

    const removePreviousChart = () => {
        let chart = refMultiLineChart.current;
        if (chart)
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
    }

    const lineChartFollowTime = () => {
        removePreviousChart();
        const { dataChart } = state
        chart.current = c3.generate({
            bindto: refMultiLineChart.current,

            data: {
                x: 'x',
                columns: dataChart,

            },

            // Căn lề biểu đồ
            padding: {
                top: 20,
                right: 20,
                bottom: 20
            },

            axis: {
                x: {
                    label: {
                        text: translate('task.task_management.time'),
                        position: 'outer-right',
                    },

                    type: 'timeseries',
                    tick: {
                        format: function (x) { return (x.getMonth() + 1) + "-" + x.getFullYear(); }
                    }
                },
                y: {
                    label: {
                        text: translate('task.task_management.load_task'),
                        position: 'outer-top',
                    },

                }

            },
            tooltip: {
                format: {
                    value: function (value, ratio, id) {
                        return value.toFixed(2);
                    }
                }
            },

            legend: {
                show: false
            }
        });
    }

    const barChartFollowUnit = () => {
        let dataChart = [translate('task.task_management.load_task')]
        let titleX = ["x"]
        let { data } = state
        if (data?.length > 0) {
            data.map(item => {
                titleX.push(item?.[0])
                dataChart.push(item?.[1])
            })
        }

        chart.current = c3.generate({
            bindto: refMultiLineChart.current,

            data: {
                x: "x",
                columns: [
                    titleX,
                    dataChart
                ],
                type: 'bar',
                labels: true,
            },

            padding: {
                top: 20,
                bottom: 50,
                right: 20
            },

            axis: {
                x: {
                    type: 'category',
                    tick: {
                        format: function (index) {
                            let result = customAxisC3js('trendsInUnitChart', titleX.filter((item, i) => i > 0), index);
                            return result;
                        }
                    }
                },
                y: {
                    label: {
                        text: translate('task.task_management.load_task'),
                        position: 'outer-top',
                    },

                }
            },

            bar: {
                width: {
                    ratio: titleX?.length < 5 ? 0.3 : 0.7 // this makes bar width 50% of length between ticks
                }
            },

            tooltip: {
                format: {
                    title: function (d) {
                        if (titleX?.length > 1)
                            return titleX?.[d + 1];
                    }
                }
            }
        });
    }

    const showLoadTaskDoc = () => {
        Swal.fire({
            icon: "question",

            html: `<h3 style="color: red"><div>Tải công việc đơn vị</div> </h3>
            <div style="font-size: 1.3em; text-align: left; margin-top: 15px; line-height: 1.7">
            <p>Tải công việc đơn vị trong 1 tháng được tính như sau</p>
            <ul>
                <li>Lấy tất cả các công việc do đơn vị đó quản lý</li>
                <li>Tải của một công việc = Số ngày thực hiện công việc trong tháng đó/tổng số người thực hiện, phê duyệt, tư vấn trong công việc</li>
                <li>Tải công việc đơn vị trong tháng = Tổng tải của tất cả các công việc trong tháng đó</li>
            </ul>
            <p>Ví dụ, 1 công việc kéo dài từ 15/3 đến 20/5, có 1 người thực hiện, 1 người phê duyệt và 1 người tư vấn</p>
            <ul>
                <li>Tải công việc đó trong tháng 3 = 15/(1+1+1)</li>
                <li>Tải công việc đó trong tháng 4 = 31/(1+1+1)</li>
                <li>Tải công việc đó trong tháng 5 = 20/(1+1+1)</li>
            </ul>`,
            width: "50%",
        })
    }
    return (
        <React.Fragment>
            <div className="box box-primary">
                <div className="box-header with-border">
                    <div className="box-title" >
                        {translate('task.task_management.load_task_chart_unit')}
                        {
                            idsUnit && idsUnit.length < 2 ?
                                <>
                                    <span>{` ${props.getUnitName(units, idsUnit).map(o => o).join(", ")} `}</span>
                                </>
                                :
                                <span onClick={() => props.showUnitTask(units, idsUnit)} style={{ cursor: 'pointer' }}>
                                    <a style={{ cursor: 'pointer', fontWeight: 'bold' }}> {idsUnit?.length}</a>
                                    <span>{` ${translate('task.task_dashboard.unit_lowercase')} `}</span>
                                </span>
                        }
                        {typeChart === "followTime" ? <>{startMonthTitle}<i className="fa fa-fw fa-caret-right"></i>{endMonthTitle}</> : <>{startMonthTitle}</>}

                        <a onClick={() => showLoadTaskDoc()}>
                            <i className="fa fa-question-circle" style={{ cursor: 'pointer', marginLeft: '5px' }} />
                        </a>
                    </div>
                </div>
                <div className="box-body">
                    {state?.dataChart?.length > 0 ?
                        <section id={"weightTaskOrganizationChart"} className="c3-chart-container">
                            <div ref={refMultiLineChart}></div>
                            {typeChart === "followTime"
                                && <CustomLegendC3js
                                    chart={chart.current}
                                    chartId={"weightTaskOrganizationChart"}
                                    legendId={"weightTaskOrganizationChartLegend"}
                                    title={`${translate('general.list_unit')} (${legend?.length > 0 ? legend?.length : 0})`}
                                    dataChartLegend={legend && legend}
                                />
                            }
                        </section>
                        : <section>{translate('kpi.organizational_unit.dashboard.no_data')}</section>
                    }
                </div>
            </div>
        </React.Fragment>
    )
}

function mapState(state) {
    const { tasks } = state;
    return { tasks }
}
const actions = {
}

const connectedWeightTaskOrganization = connect(mapState, actions)(withTranslate(LoadTaskOrganizationChart));
export { connectedWeightTaskOrganization as LoadTaskOrganizationChart };
