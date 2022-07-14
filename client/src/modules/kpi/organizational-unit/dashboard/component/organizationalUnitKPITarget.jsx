import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { taskManagementActions } from "../../../../task/task-management/redux/actions";
import { DashboardEvaluationEmployeeKpiSetAction } from "../../../evaluation/dashboard/redux/actions";
import { createUnitKpiActions } from "../../creation/redux/actions";
import { PreviewKpiEmployee } from "./previewKpiEmployee";
import { EmployeeResultChart } from "./sale-kpi-dashboard/employeeResultChart";
import { TargetKpiCard } from './targetKpiCard';

const getPrevDate = (date) => {
    const d = new Date(date);
    d.setMonth(d.getMonth() - 6);

    return `${d.getFullYear()}-${d.getMonth() + 1}`
}

const getCurrentDate = () => {
    const date = new Date();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    if (month >= 10) {
        return `${year}-${month}`
    } else return `${year}-0${month}`
}

const getMonthArr = (date) => {
    const current = new Date(date);
    const month = current.getMonth() + 1;
    const monthArr = [];
    for (let i = 0; i < 6; i++) {
        if (month >= 10) {
            monthArr.push(`${current.getFullYear()}-${current.getMonth() + 1}`);
        } else monthArr.push(`${current.getFullYear()}-0${current.getMonth() + 1}`);

        current.setMonth(current.getMonth() - 1)
    }
    return monthArr.reverse();
}

const OrganizationalUnitKPITarget = (props) => {
    const { tasks, createKpiUnit, dashboardEvaluationEmployeeKpiSet } = props;
    const { organizationalUnitIds, month, onChangeData } = props;

    const [dataKpis, setDataKpis] = useState();
    const [employeeKpiSet, setEmployeeKpiSet] = useState();

    const currentMonth = getCurrentDate();
    const monthArr = getMonthArr(currentMonth);

    useEffect(() => {
        props.getAllTasksThatHasEvaluation(organizationalUnitIds[0], getPrevDate(month), month);
        props.getCurrentKPIUnit(localStorage.getItem('currentRole'));
        props.getAllEmployeeKpiSetOfUnitByIds(organizationalUnitIds);
    }, [])

    // target kpi đơn vị
    useEffect(() => {
        if (tasks?.evaluatedTask && createKpiUnit?.currentKPI) {
            const { evaluatedTask } = tasks;
            const evaluations = {};

            for (let item of evaluatedTask) {
                for (let eva of item.evaluations) {
                    const key = eva.evaluatingMonth.slice(0, 7);
                    if (!evaluations[key]) {
                        evaluations[key] = {};
                    }
                    for (let info of eva.taskInformations) {
                        if (info.type === 'number') {
                            if (!evaluations[key][info.name]) {
                                evaluations[key][info.name] = 0;
                            }
                            evaluations[key][info.name] += info.value;
                        }
                    }
                }
            }

            const dataKpis = createKpiUnit?.currentKPI?.kpis.map((item) => {
                if (!item.target) {
                    //Mục tiêu không định lượng
                    return {
                        name: item.name,
                        type: 1
                    }
                }
                return {
                    name: item.name,
                    target: item.target,
                    unit: item.unit,
                    current: evaluations[currentMonth][item?.criteria],
                    resultByMonth: monthArr.map(x => {
                        if (evaluations[x] && evaluations[x][item?.criteria]) {
                            return evaluations[x][item?.criteria]
                        } else return 0;
                    })
                }
            })
            setDataKpis(dataKpis);
        }
    }, [tasks.evaluatedTask, createKpiUnit.currentKPI])

    useEffect(() => {
        if (dashboardEvaluationEmployeeKpiSet?.employeeKpiSets) {
            // loc cac kpi cua nhan vien trong thang 
            const employeeKpiSet = dashboardEvaluationEmployeeKpiSet.employeeKpiSets.filter(x => x.date.slice(0, 7) === currentMonth);

            if (tasks?.evaluatedTask) {
                const { evaluatedTask } = tasks;
                const evaluations = {};
                for (let item of evaluatedTask) {
                    for (let eva of item.evaluations) {

                        const responsibleResult = eva?.results?.filter(x => x.role = "responsible");
                        for (let res of responsibleResult) {

                            const key = res.employee;

                            const contribution = res ? res.contribution / 100 : 0;

                            if (!evaluations[key]) {
                                evaluations[key] = {};
                            }
                            for (let info of eva.taskInformations) {
                                if (info.type === 'number') {
                                    if (!evaluations[key][info.name]) {
                                        evaluations[key][info.name] = 0;
                                    }
                                    evaluations[key][info.name] += info.value * contribution;
                                }
                            }
                        }
                    }
                }
                console.log(137, evaluations)
                const employeeKpi = employeeKpiSet.map((item) => {

                    let employeeId = item.creator.id;
                    console.log(247, employeeId)

                    const employeeKpis = item.kpis?.map(kpis => {
                        console.log(2154, evaluations[employeeId])
                        if (!kpis.target) {
                            //Mục tiêu không định lượng
                            kpis.current = 'Đang thực hiện'
                        }
                        if (evaluations[employeeId]) {
                            kpis.current = evaluations[employeeId][kpis?.criteria] ?? 0
                        }
                        else {
                            kpis.current = 0;
                        }

                        return kpis
                    })
                    // console.log(272, employeeKpis)
                    item.kpis = employeeKpis
                    return item;
                })
                setEmployeeKpiSet(employeeKpi)
                onChangeData(employeeKpi)
            }
        }
    }, [dashboardEvaluationEmployeeKpiSet.employeeKpiSets, tasks.evaluatedTask])

    return (
        <React.Fragment>
            <div className="row"> {
                dataKpis?.map((item) => {
                    return (
                        <div className="col-sm-6">
                            <TargetKpiCard data={item} month={monthArr} />
                        </div>
                    )
                })
            }
            </div>
            <div className="row">
                {
                    employeeKpiSet?.map((item, index) => {
                        return (
                            <div key={`${index}_${item._id}`}>
                                <PreviewKpiEmployee data={item} />
                            </div>
                        )
                    })
                }
            </div>
            {
                employeeKpiSet?.length && <div>
                    <br />
                    <div className="row">
                        <div className="col-md-12">
                            <div className="box box-primary">
                                <div className="box-header with-border">
                                    <div className="box-title">Đóng góp nhân viên</div>
                                </div>
                                <EmployeeResultChart employeeKpi={employeeKpiSet} unitKpi={createKpiUnit?.currentKPI} />

                            </div>
                        </div>
                    </div>
                </div>
            }
        </React.Fragment>
    )

}

function mapState(state) {
    const { dashboardEvaluationEmployeeKpiSet, createKpiUnit, tasks } = state;
    return { dashboardEvaluationEmployeeKpiSet, createKpiUnit, tasks };
}

const actions = {
    getAllTasksThatHasEvaluation: taskManagementActions.getAllTasksThatHasEvaluation,
    getCurrentKPIUnit: createUnitKpiActions.getCurrentKPIUnit,
    getAllOrganizationalUnitKpiSetByTime: createUnitKpiActions.getAllOrganizationalUnitKpiSetByTime,
    getAllEmployeeKpiSetOfUnitByIds: DashboardEvaluationEmployeeKpiSetAction.getAllEmployeeKpiSetOfUnitByIds,

}

const connectedOrganizationalUnitKPITarget = connect(mapState, actions)(withTranslate(OrganizationalUnitKPITarget));
export default connectedOrganizationalUnitKPITarget;