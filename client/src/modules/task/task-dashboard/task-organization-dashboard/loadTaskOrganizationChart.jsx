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
    const { translate, tasks, organizationUnitTasks } = props
    const { startMonth, endMonth, startMonthTitle, endMonthTitle, units, idsUnit, typeChart = "followTime" } = props;

    const [dataChart, setDataChart] = useState();
    const ref = useRef({
        chart: null,
        dataChart: null
    });

    useEffect(() => {
        let dataChart = setDateBarChart()

        if (typeChart === "followTime") {
            barChartFollowTime(dataChart?.data, dataChart?.category);
        } else {
            barChartFollowUnit(dataChart?.data);
        }
    })

    function setDateBarChart() {
        let data = [], category = []
        let taskList = typeChart === "followTime" && organizationUnitTasks
        if (taskList?.length > 0) {
            let selectedUnit = idsUnit;

            // Lấy tất cả các công việc thay vì mỗi các công việc đang thực hiện
            // let improcessTask = taskList?.filter(x => x.status === "inprocess");
            let improcessTask = taskList;
            let startTime = new Date(startMonth.split("-")[0], startMonth.split('-')[1] - 1, 1);
            let endTime = new Date(endMonth.split("-")[0], endMonth.split('-')[1] ? endMonth.split('-')[1] : 1, 1);
            let m = startMonth.slice(5, 7);
            let y = startMonth.slice(0, 4);
            let period = Math.round((endTime - startTime) / 2592000000);
            let array = [];
            for (let i = 0; i < period; i++) {
                category.push(dayjs([y, m].join('-')).format("M-YYYY"));
                m++;
                array[i] = 0;
            }

            for (let i in selectedUnit) {
                data[i] = [];
                array.fill(0, 0);
                let findUnit = units.find(elem => (elem.value === selectedUnit[i]) || (elem.id === selectedUnit[i]))
                if (findUnit) {
                    data[i].push(findUnit.text || findUnit.name);
                }

                for (let k in improcessTask) {
                    if (improcessTask[k] && improcessTask[k].organizationalUnit && improcessTask[k].organizationalUnit._id === selectedUnit[i]) {
                        let improcessDay = 0;
                        let startDate = new Date(improcessTask[k].startDate);
                        let endDate = new Date(improcessTask[k].endDate);

                        if (startTime < endDate) {
                            for (let j = 0; j < period; j++) {
                                let tmpStartMonth = new Date(parseInt(category[j].split('-')[1]), parseInt(category[j].split('-')[0]) - 1, 1);
                                let tmpEndMonth = new Date(parseInt(category[j].split('-')[1]), parseInt(category[j].split('-')[0]), 0);

                                if (tmpStartMonth > startDate && tmpEndMonth < endDate) {
                                    improcessDay = tmpEndMonth.getDate();
                                }
                                // thang dau
                                else if (tmpStartMonth < startDate && tmpEndMonth > startDate) {
                                    improcessDay = tmpEndMonth.getDate() - startDate.getDate();
                                }
                                else if (tmpStartMonth < endDate && endDate < tmpEndMonth) {
                                    improcessDay = endDate.getDate();
                                }
                                else {
                                    improcessDay = 0;
                                }
                                array[j] += Math.round(improcessDay /
                                    (improcessTask[k].accountableEmployees.length + improcessTask[k].consultedEmployees.length + improcessTask[k].responsibleEmployees.length))
                            }

                        }
                    }

                }

                data[i] = [...data[i], ...array];
            }

            if (data?.length > 0) {
                data = data.map(item => {
                    item = item.map(x => {
                        if (!x || x === NaN || x === Infinity) {
                            return 0
                        } else {
                            return x
                        }
                    });
                    return item;
                })
            }
            let check = false;
            if (data?.length !== ref.current.dataChart?.length) {
                check = true;
            } else if (data?.length > 0) {
                data.map(item => item[0]).map(item => {
                    if (!ref.current.dataChart?.map(item => item[0])?.includes(item)) {
                        check = true;
                    }
                })
            }
            if (check) {
                ref.current.dataChart = data;
                setDataChart(data)
            }
        }

        return {
            data,
            category
        }
    }

    const barChartFollowTime = (data, category) => {
        ref.current.chart = c3.generate({
            bindto: document.getElementById("weightTaskOrganization"),

            data: {
                columns: data,
                type: 'line',

            },

            axis: {
                x: {
                    label: {
                        text: translate('task.task_management.time'),
                        position: 'outer-right',
                    },

                    type: 'category',
                    categories: category?.length > 0 ? category : [],
                },
                y: {
                    label: {
                        text: translate('task.task_management.load_task'),
                        position: 'outer-top',
                    },

                }

            },

            legend: {
                show: false
            }
        });
    }

    const barChartFollowUnit = (data) => {
        let dataChart = [translate('task.task_management.load_task')]
        let titleX = ["x"]

        if (data?.length > 0) {
            data.map(item => {
                titleX.push(item?.[0])
                dataChart.push(item?.[1])
            })
        }

        ref.current.chart = c3.generate({
            bindto: document.getElementById("weightTaskOrganization"),

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
                    {tasks.isLoading
                        ? <p>{translate('general.loading')}</p>
                        : organizationUnitTasks
                            ? <section id={"weightTaskOrganizationChart"} className="c3-chart-container enable-pointer">
                                <div id="weightTaskOrganization"></div>
                                {typeChart === "followTime"
                                    && <CustomLegendC3js
                                        chart={ref.current.chart}
                                        chartId={"weightTaskOrganizationChart"}
                                        legendId={"weightTaskOrganizationChartLegend"}
                                        title={`${translate('general.list_unit')} (${dataChart?.length > 0 ? dataChart?.length : 0})`}
                                        dataChartLegend={dataChart && dataChart.map(item => item[0])}
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
