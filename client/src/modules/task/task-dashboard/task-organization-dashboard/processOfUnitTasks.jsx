import React from 'react'
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import c3 from 'c3';
import 'c3/c3.css';
import useDeepCompareEffect from 'use-deep-compare-effect'

const InprocessOfUnitTask = (props) => {
    const { translate, unitSelected, unitNameSelected } = props;

    useDeepCompareEffect(() => {
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

    }, [props.tasks])

    const barChart = (delayed, intime, notAchived) => {
        let height = unitNameSelected?.length ?  unitNameSelected.length * 60 : 0;
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
                    categories: unitNameSelected
                },
                rotated: true
            }
        });
    }

    return (
        <React.Fragment>
            <section id="inprocessOfUnitTask"></section>
        </React.Fragment>
    )
}

function mapState(state) {
    const { tasks } = state;
    return { tasks }
}

const connectedInprocessOfUnitTask = connect(mapState, null)(withTranslate(InprocessOfUnitTask));
export { connectedInprocessOfUnitTask as InprocessOfUnitTask };
