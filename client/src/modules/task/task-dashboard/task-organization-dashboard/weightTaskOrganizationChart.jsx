import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { SelectMulti } from '../../../../common-components';
import { taskManagementActions } from '../../task-management/redux/actions';
import c3 from 'c3';
import 'c3/c3.css';

const CHART_INFO = {
    currentRoles: []
}

const WeightTaskOrganizationChart = (props) => {
    const [unit, setUnit] = useState();
    const { translate, units, idsUnit } = props;
    let { startMonth, endMonth } = props;
    useEffect(() => {
        let { tasks } = props;
        let taskList = tasks?.organizationUnitTasks?.tasks;
        // let data = [];
        if (taskList.length) {
            let selectedUnit = idsUnit;
            if (selectedUnit.length == 0) selectedUnit = units.map(item => { return item.id });

            let improcessTask = taskList?.filter(x => x.status === "inprocess");

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
                data[i].push(findUnit.name);
                for (let k in improcessTask) {
                    if (improcessTask[k] && improcessTask[k].organizationalUnit && improcessTask[k].organizationalUnit._id === selectedUnit[i]) {
                        let improcessDay = 0;
                        let startDate = new Date(improcessTask[k].startDate);
                        let endDate = new Date(improcessTask[k].endDate);

                        if (startTime < endDate) {
                            for (let j = 0; j < period; j++) {

                                let tmpStartDate = new Date(parseInt(category[j].split('-')[1]), parseInt(category[j].split('-')[0]), 1);
                                let tmpEndDate = new Date(parseInt(category[j].split('-')[1]), parseInt(category[j].split('-')[0]) + 1, 0);

                                if (tmpStartDate > startDate && tmpEndDate < endDate) {
                                    improcessDay = tmpEndDate.getDate();
                                }
                                // thang dau
                                else if (tmpStartDate < startDate && tmpEndDate > startDate) {
                                    improcessDay = tmpEndDate.getDate() - startDate.getDate();
                                }
                                else if (tmpStartDate < endDate && endDate < tmpEndDate) {
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

    const handleSelectUnit = (value) => {
        CHART_INFO.currentUnits = value;
    }

    const handleSearchData = () => {
        let { currentUnits } = CHART_INFO;
        setUnit(currentUnits);
    }
    const barChart = (data, category) => {
        const pie = c3.generate({
            bindto: document.getElementById("weightTaskOrganization"),

            data: {
                columns: data,
                type: 'line',

            },

            axis: {
                x: {
                    label: {
                        text: 'Thời gian',
                        position: 'outer-right',
                    },

                    type: 'category',
                    categories: category,
                },
                y: {
                    label: {
                        text: "Tải công việc",
                        position: 'outer-top',
                    },

                }

            },


        });
    }



    return (
        <React.Fragment>
            <section className="form-inline" style={{ textAlign: "right" }}>
                {/* Chọn đơn vị */}
                {/* <div className="form-group">
                    <label style={{ minWidth: "150px" }}>{translate('kpi.evaluation.dashboard.organizational_unit')}</label>
                    <SelectMulti id="multiSelectUnitInUnitWeightTask"
                        items={units.map(item => { return { value: item.id, text: item.name } })}
                        onChange={handleSelectUnit}
                        options={{ nonSelectedText: translate('task_template.select_all_units'), allSelectedText: translate('kpi.evaluation.dashboard.all_unit') }}>
                    </SelectMulti>
                </div>
                <div className="form-group">
                    <button className="btn btn-success" onClick={handleSearchData}>{translate('task.task_management.filter')}</button>
                </div> */}
            </section>

            <section id="weightTaskOrganization"></section>
        </React.Fragment>
    )
}

function mapState(state) {
    const { tasks } = state;
    return { tasks }
}
const actions = {
}

const connectedWeightTaskOrganization = connect(mapState, actions)(withTranslate(WeightTaskOrganizationChart));
export { connectedWeightTaskOrganization as WeightTaskOrganizationChart };
