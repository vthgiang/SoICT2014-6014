import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { SelectMulti } from '../../../../common-components';
import c3 from 'c3';
import 'c3/c3.css';

const CHART_INFO = {
    currentUnits: []
}

const InprocessOfUnitTask = (props) => {
    const [unit, setUnit] = useState([]);
    const { translate, units, unitSelected } = props;

    useEffect(() => {
        let { tasks } = props;
        let taskList = tasks?.organizationUnitTasks?.tasks;
        let delayed = [translate('task.task_management.delayed_time')];
        let intime = [translate('task.task_management.in_time')];
        let notAchived = [translate('task.task_management.not_achieved')];

        if (taskList && taskList.length !== 0) {
            let selectedUnit = unitSelected;

            for (let i in selectedUnit) {
                let delayedCnt = 0, intimeCnt = 0, notAchivedCnt = 0;
                let currentTime = new Date();

                for (let j in taskList) {
                    if (taskList[j] && taskList[j].organizationalUnit && taskList[j].organizationalUnit._id === selectedUnit[i]) {
                        let startTime = new Date(taskList[j].startDate);
                        let endTime = new Date(taskList[j].endDate);

                        if (currentTime > endTime && taskList[j].progress < 100) {
                            notAchivedCnt++; // not achieved
                        }
                        else {
                            let workingDayMin = (endTime - startTime) * taskList[j].progress / 100;
                            let dayFromStartDate = currentTime - startTime;
                            let timeOver = workingDayMin - dayFromStartDate;
                            if (taskList[j].status === 'finished' || timeOver >= 0) {
                                intimeCnt++;
                            }
                            else {
                                delayedCnt++;
                            }
                        }
                    }

                }
                delayed.push(delayedCnt);
                intime.push(intimeCnt);
                notAchived.push(notAchivedCnt);
            }
        }
        barChart(delayed, intime, notAchived);

    }, [props, unit])

    const handleSelectUnit = (value) => {
        CHART_INFO.currentUnits = value;
    }

    const handleSearchData = () => {
        let { currentUnits } = CHART_INFO;
        setUnit(currentUnits);
    }

    const barChart = (delayed, intime, notAchived) => {
        let height = unit.length * 60;
        let heightOfChart = height > 500 ? height : 500;

        const pie = c3.generate({
            bindto: document.getElementById("inprocessOfUnitTask"),

            data: {
                columns: [
                    intime,
                    delayed,
                    notAchived
                ],
                type: 'bar',
                groups: [
                    [translate('task.task_management.delayed_time'),
                    translate('task.task_management.in_time'),
                    translate('task.task_management.not_achieved')]
                ]
            },

            size: {
                height: heightOfChart
            },

            color: {
                pattern: ['#28A745 ', '#f39c12', '#DD4B39']
            },

            axis: {
                x: {
                    type: 'category',
                    categories: units?.map(item => { return item.name })
                },
                rotated: true
            }


        });
    }

    return (
        <React.Fragment>
            {/* <section className="form-inline" style={{ textAlign: "right" }}>
                <div className="form-group">
                    <label style={{ minWidth: "150px" }}>{translate('kpi.evaluation.dashboard.organizational_unit')}</label>
                    <SelectMulti id="multiSelectUnitInUnitTask"
                        items={units?.map(item => { return { value: item.id, text: item.name } })}
                        onChange={handleSelectUnit}
                        options={{ nonSelectedText: translate('task_template.select_all_units'), allSelectedText: translate('kpi.evaluation.dashboard.all_unit') }}>
                    </SelectMulti>
                </div>
                <div className="form-group">
                    <button className="btn btn-success" onClick={handleSearchData}>{translate('task.task_management.filter')}</button>
                </div>
            </section> */}

            <section id="inprocessOfUnitTask"></section>
        </React.Fragment>
    )
}

function mapState(state) {
    const { tasks } = state;
    return { tasks }
}
const actions = {

}

const connectedInprocessOfUnitTask = connect(mapState, actions)(withTranslate(InprocessOfUnitTask));
export { connectedInprocessOfUnitTask as InprocessOfUnitTask };
