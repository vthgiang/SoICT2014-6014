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

const InprocessTask = (props) => {
    const [role, setRole] = useState(["res", "acc", "con", "inf"]);
    const { translate } = props;

    useEffect(() => {
        let { tasks } = props;

        if (tasks) {
            let res = tasks.responsibleTasks;
            let acc = tasks.accountableTasks;
            let con = tasks.consultedTasks;
            let inf = tasks.informedTasks;

            if (res && acc && con && inf) {
                let allTask = { res, acc, con, inf }
                let taskList = [];

                for (let i in role) {
                    taskList = taskList.concat(allTask[role[i]]);
                }

                let inprocessTask = taskList?.filter(x => x.status === "inprocess");
                let delayed = [translate('task.task_management.delayed_time')];
                let intime = [translate('task.task_management.in_time')];
                let notAchived = [translate('task.task_management.not_achieved')];
                let currentTime = new Date();
                let delayedCnt = 0, intimeCnt = 0, notAchivedCnt = 0;

                for (let i in inprocessTask) {
                    let startTime = new Date(inprocessTask[i].startDate);
                    let endTime = new Date(inprocessTask[i].endDate);

                    if (currentTime > endTime && inprocessTask[i].progress < 100) {
                        notAchivedCnt++; // not achieved
                    }
                    else {
                        let workingDayMin = (endTime - startTime) * inprocessTask[i].progress / 100;
                        let dayFromStartDate = currentTime - startTime;
                        let timeOver = workingDayMin - dayFromStartDate;
                        if (inprocessTask[i].status === 'finished' || timeOver >= 0) {
                            intimeCnt++;
                        }
                        else {
                            delayedCnt++;
                        }
                    }
                }
                delayed.push(delayedCnt);
                intime.push(intimeCnt);
                notAchived.push(notAchivedCnt);

                pieChart(delayed, intime, notAchived);
            }
        }
    }, [props, role])

    const handleSelectStatus = (value) => {
        if (value == []) value = ["res", "acc", "con", "inf"];
        CHART_INFO.currentRoles = value;
    }

    const handleSearchData = () => {
        let { currentRoles } = CHART_INFO;
        setRole(currentRoles);
    }

    const pieChart = (delayed, intime, notAchived) => {
        const pie = c3.generate({
            bindto: document.getElementById("inprocess"),

            data: {
                columns: [
                    intime,
                    delayed,
                    notAchived
                ],
                type: 'pie',
            },
            tooltip: {
                format: {
                    value: function (value) {
                        return value;

                    }
                }
            },

            color: {
                pattern: ['#28A745 ', '#f39c12', '#DD4B39']
            },

            padding: {
                top: 20,
                bottom: 20,
                right: 20,
                left: 20
            },

            legend: {
                show: true
            }
        });
    }

    return (
        <React.Fragment>
            <section className="form-inline" style={{ textAlign: "right" }}>
                {/* Chọn trạng thái công việc */}
                <div className="form-group">
                    <label style={{ minWidth: "150px" }}>{translate('task.task_management.role')}</label>

                    <SelectMulti id="multiSelectStatusInprocessTask"
                        items={[
                            { value: "res", text: translate('task.task_management.responsible') },
                            { value: "acc", text: translate('task.task_management.accountable') },
                            { value: "con", text: translate('task.task_management.consulted') },
                            { value: "inf", text: translate('task.task_management.informed') },
                        ]}
                        onChange={handleSelectStatus}
                        options={{ nonSelectedText: translate('task.task_management.select_all_role'), allSelectedText: translate('task.task_management.select_all_role') }}
                        value={role}
                    >
                    </SelectMulti>

                </div>
                <div className="form-group">
                    <button className="btn btn-success"
                        onClick={handleSearchData}
                    >{translate('task.task_management.filter')}</button>
                </div>
            </section>

            <section id="inprocess"></section>
        </React.Fragment>
    )
}

function mapState(state) {
    const { tasks } = state;
    return { tasks }
}
const actions = {
}

const connectedInprocessTask = connect(mapState, actions)(withTranslate(InprocessTask));
export { connectedInprocessTask as InprocessTask };
