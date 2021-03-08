import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { CustomLegendC3js } from '../../../../common-components';

import c3 from 'c3';
import 'c3/c3.css';

const LoadTaskOrganizationChart = (props) => {
    const { translate, units, idsUnit } = props;
    let { startMonth, endMonth } = props;

    const ref = useRef({
        chart: null,
        dataChart: null
    });

    useEffect(() => {
        let { tasks } = props;
        let taskList = tasks?.organizationUnitTasks?.tasks;
        // let data = [];
        if (taskList.length) {
            let selectedUnit = idsUnit;
            if (selectedUnit.length == 0) selectedUnit = units.map(item => { return item.id });

            // Lấy tất cả các công việc thay vì mỗi các công việc đang thực hiện
            // let improcessTask = taskList?.filter(x => x.status === "inprocess");
            let improcessTask = taskList;
            let startTime = new Date(startMonth.split("-")[0], startMonth.split('-')[1] - 1, 1);
            let endTime = new Date(endMonth.split("-")[0], endMonth.split('-')[1] ? endMonth.split('-')[1] : 1, 1);
            let listMonth = [], category = [];
            let m = startMonth.slice(5, 7);
            let y = startMonth.slice(0, 4);
            let period = Math.round((endTime - startTime) / 2592000000);

            let data = [], array = [];
            for (let i = 0; i < period; i++) {
                if (m > 12) {
                    m = 1;
                    y++;
                }
                if (m < 10) {
                    m = '0' + m;
                }
                category.push([m, y].join('-'));
                listMonth.push([y, m].join(','));
                m++;
                array[i] = 0;
            }

            for (let i in selectedUnit) {

                data[i] = [];
                array.fill(0, 0);
                let findUnit = units.find(elem => elem.id === selectedUnit[i])
                if (findUnit) {
                    data[i].push(findUnit.name);
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
            barChart(data, category);
        }


    }, [props])

    const barChart = (data, category) => {
        ref.current.dataChart = data;
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
                    categories: category,
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


    return (
        <React.Fragment>
            <section id={"weightTaskOrganizationChart"} className="c3-chart-container enable-pointer">
                <div id="weightTaskOrganization"></div>
                <CustomLegendC3js
                    chart={ref.current.chart}
                    chartId={"weightTaskOrganizationChart"}
                    legendId={"weightTaskOrganizationChartLegend"}
                    title={`${translate('general.list_unit')} (${ref.current.dataChart && ref.current.dataChart.length})`}
                    dataChartLegend={ref.current.dataChart && ref.current.dataChart.map(item => item[0])}
                />
            </section>
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
