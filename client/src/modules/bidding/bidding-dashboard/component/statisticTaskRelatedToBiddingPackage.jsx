import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { forceCheckOrVisible, SelectBox, SlimScroll, LazyLoadComponent } from '../../../../common-components';
import { filterDifference } from '../../../../helpers/taskModuleHelpers';
import { NewsFeed } from '../../../home/components/newsFeed';
import { GanttCalendar } from '../../../task/task-dashboard/task-personal-dashboard/ganttCalendar';
import GeneralTaskPersonalChart from '../../../task/task-dashboard/task-personal-dashboard/generalTaskPersonalChart';
import { taskManagementActions } from '../../../task/task-management/redux/actions';
import moment from 'moment';
import Swal from 'sweetalert2';
import { ViewAllTasks } from '../../../dashboard-personal/components/viewAllTasks';

const StatisticTaskRelatedBiddingPackage = (props) => {
    const { biddingPackagesManager, biddingContract, translate, tasks } = props;
    const listBiddingPackages = biddingPackagesManager?.listBiddingPackages.filter(x => x.status !== 0);

    /**
     * Function format dữ liệu Date thành string
     * @param {*} date : Ngày muốn format
     * @param {*} monthYear : true trả về tháng năm, false trả về ngày tháng năm
     */
    const formatDate = (date, monthYear = false, monthChange) => {
        if (date) {
            let d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();
            if (monthChange) {
                if (month <= monthChange) {
                    year = year - 1
                    month = Number(month) + 12 - monthChange
                } else {
                    month = month - monthChange
                }
            }
            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            if (monthYear === true) {
                return [month, year].join('-');
            } else return [day, month, year].join('-');
        }
        return date;
    };

    const [state, setState] = useState({
        startDate: formatDate(Date.now(), true, 3),
        endDate: formatDate(Date.now(), true),
        bid: listBiddingPackages[0],
    })

    const checkTaskInPackage = (task, bid) => {
        const contract = biddingContract.listBiddingContractStatistic.find(x => x.biddingPackage?._id === bid?._id);
        const projectBP = contract?.project;

        let projectID = projectBP?._id;
        let taskPrj = task?.taskProject;

        if (String(taskPrj) === String(projectID)) {
            return true;
        }

        return false;
    }

    useEffect(() => {
        let bp = listBiddingPackages[0];
        
        if (bp) {
            const contract = biddingContract.listBiddingContractStatistic.find(x => x.biddingPackage?._id === bp._id);
            const project = contract?.project;
            setState({
                ...state,
                bid: bp,
                contract: contract,
                projectBP: project,
            })
        }
    }, [JSON.stringify(listBiddingPackages), JSON.stringify(biddingContract.listBiddingContractStatistic)]);

    useEffect(() => {
        const { tasks } = props;
        const { loadingInformed, loadingCreator, loadingConsulted, loadingAccountable, loadingResponsible
        } = tasks;
        const { userId, bid } = state;
        if (tasks && !loadingInformed && !loadingCreator && !loadingConsulted && !loadingAccountable && !loadingResponsible) {
            let currentMonth = new Date().getMonth() + 1;
            let currentYear = new Date().getFullYear();
            let notLinkedTasks = [], taskList = [], unconfirmedTask = [], noneUpdateTask = [], distinctTasks = [],
                taskHasActionsResponsible = [], taskHasActionsAccountable = [], taskHasNotEvaluationResultIncurrentMonth = [], taskHasNotApproveResquestToClose = [];
            const taskOfUser = tasks?.tasks;

            let accTasks = tasks.accountableTasks;
            let resTasks = tasks.responsibleTasks;
            let conTasks = tasks.consultedTasks;

            if (accTasks && accTasks.length > 0)
                accTasks = accTasks.filter(task => task.status === "inprocess" && checkTaskInPackage(task, bid));
            if (resTasks && resTasks.length > 0)
                resTasks = resTasks.filter(task => task.status === "inprocess" && checkTaskInPackage(task, bid));
            if (conTasks && conTasks.length > 0)
                conTasks = conTasks.filter(task => task.status === "inprocess" && checkTaskInPackage(task, bid));

            // Láy công việc chưa phê duyệt yêu cầu kết thúc
            accTasks && accTasks.forEach(o => {
                if (o.requestToCloseTask && o.requestToCloseTask.requestStatus === 1) {
                    taskHasNotApproveResquestToClose = [...taskHasNotApproveResquestToClose, o]
                }
            })

            // tính toán lấy số công việc chưa được đánh giá kpi
            if (accTasks && resTasks && conTasks) {
                taskList = [...accTasks, ...resTasks, ...conTasks];
                if (taskList && taskList.length > 0) {
                    distinctTasks = filterDifference(taskList);

                    distinctTasks.length && distinctTasks.map(x => {
                        let evaluations;
                        let currentEvaluate = [];
                        let created = moment(x.createdAt);
                        let lastUpdate = moment(x.updatedAt);
                        let now = moment(new Date());
                        let updatedToNow = now.diff(lastUpdate, 'days');
                        let createdToNow = now.diff(created, 'days');
                        if (updatedToNow >= 7) {
                            let add = {
                                ...x,
                                updatedToNow
                            }
                            noneUpdateTask.push(add);
                        }

                        if (x?.confirmedByEmployees.length === 0 || !x?.confirmedByEmployees.includes(localStorage.getItem("userId"))) {
                            let add = {
                                ...x,
                                createdToNow
                            }
                            unconfirmedTask.push(add)
                        }

                        evaluations = x.evaluations.length && x.evaluations;
                        for (let i in evaluations) {
                            let month = evaluations[i] && evaluations[i].evaluatingMonth && evaluations[i].evaluatingMonth.slice(5, 7);
                            let year = evaluations[i] && evaluations[i].evaluatingMonth && evaluations[i].evaluatingMonth.slice(0, 4);
                            if (month == currentMonth && year == currentYear) {
                                currentEvaluate.push(evaluations[i]);
                            }
                        }
                        if (currentEvaluate.length === 0) notLinkedTasks.push(x);

                        else {
                            let break1 = false;
                            let add = true;
                            if (currentEvaluate.length !== 0)
                                for (let i in currentEvaluate) {
                                    if (currentEvaluate[i].results.length !== 0) {
                                        for (let j in currentEvaluate[i].results) {
                                            let res = currentEvaluate[i].results[j];

                                            if (res.employee === userId) {
                                                add = false;
                                                if (res.kpis.length === 0) {
                                                    notLinkedTasks.push(x);
                                                    break1 = true
                                                }
                                            };
                                            if (break1) break;
                                        }
                                        if (break1) break;
                                        if (add) notLinkedTasks.push(x);
                                    }
                                }
                        }
                    })

                    // Lấy các công việc chưa có kết quả đánh giá ở tháng hiện tại
                    distinctTasks.length && distinctTasks.forEach((o, index) => {
                        if (o.evaluations && o.evaluations.length > 0) {
                            let lengthEvaluations = o.evaluations.length;
                            let add = true;
                            for (let i = 0; i <= lengthEvaluations; i++) {
                                let currentEvaluationsMonth = o.evaluations[i] && o.evaluations[i].evaluatingMonth && o.evaluations[i].evaluatingMonth.slice(5, 7);
                                let currentEvaluationsYear = o.evaluations[i] && o.evaluations[i].evaluatingMonth && o.evaluations[i].evaluatingMonth.slice(0, 4);

                                if (parseInt(currentEvaluationsMonth) === currentMonth && parseInt(currentEvaluationsYear) === currentYear) {
                                    add = false;
                                }
                            }
                            if (add)
                                taskHasNotEvaluationResultIncurrentMonth.push(o);
                        } else {
                            taskHasNotEvaluationResultIncurrentMonth.push(o);
                        }
                    })
                }
            }

            // Tính toán lấy số công việc chưa được đánh gia
            if (resTasks?.length > 0) {
                resTasks.forEach(x => {
                    let taskActions;

                    taskActions = x.taskActions.length && x.taskActions;
                    for (let i in taskActions) {
                        let month = taskActions[i].createdAt.slice(5, 7);
                        let year = taskActions[i].createdAt.slice(0, 4)
                        if (month == currentMonth && year == currentYear) {
                            if (taskActions[i].rating == -1) {
                                taskHasActionsResponsible.push(x);
                                break;
                            }
                        }
                    }
                })
            }

            // Tính toán lấy số công việc cần đánh giá
            if (accTasks?.length > 0) {
                accTasks.forEach(x => {
                    let taskActions;

                    taskActions = x.taskActions.length && x.taskActions;
                    for (let i in taskActions) {
                        let month = taskActions[i].createdAt.slice(5, 7);
                        let year = taskActions[i].createdAt.slice(0, 4)
                        if (month == currentMonth && year == currentYear) {
                            if (taskActions[i].rating == -1) {
                                taskHasActionsAccountable.push(x);
                                break;
                            }
                        }
                    }
                })
            }

            setState({
                ...state,
                listTasksGeneral: distinctTasks,
                listAlarmTask: {
                    notLinkedTasks,
                    unconfirmedTask,
                    noneUpdateTask,
                    taskHasActionsAccountable,
                    taskHasActionsResponsible,
                    taskHasNotEvaluationResultIncurrentMonth,
                    taskHasNotApproveResquestToClose,
                }
            })
        }
    }, [JSON.stringify(tasks), JSON.stringify(state.bid)])

    useEffect(() => {
        let { startDate, endDate } = state;
        let startDateWork = moment(startDate, 'MM-YYYY').format('YYYY-MM');
        let endDateWork = moment(endDate, 'MM-YYYY').format('YYYY-MM');
        props.getResponsibleTaskByUser([], 1, 1000, [], [], [], null, startDateWork, endDateWork, null, null, true);
        props.getAccountableTaskByUser([], 1, 1000, [], [], [], null, startDateWork, endDateWork, null, null, true);
        props.getConsultedTaskByUser([], 1, 1000, [], [], [], null, startDateWork, endDateWork, null, null, true);
        props.getInformedTaskByUser([], 1, 1000, [], [], [], null, startDateWork, endDateWork, null, null, true);
        props.getCreatorTaskByUser([], 1, 1000, [], [], [], null, startDateWork, endDateWork, null, null, true);
    }, [])


    const viewAllTask = () => {
        window.$('#modal-view-all-task').modal('show')
    }

    const handleChangeBiddingPackage = (value) => {
        if (value.length === 0) {
            value = null
        };
        let bp = biddingPackagesManager?.listActiveBiddingPackage?.find(x => x._id == value[0])
        if (bp) {
            const contract = biddingContract.listBiddingContractStatistic.find(x => x.biddingPackage?._id === value[0]);
            const project = contract?.project;

            setState({
                ...state,
                bid: bp,
                contract: contract,
                projectBP: project,
            })
        }
        else {
            setState({
                ...state,
                bid: null,
                contract: null,
                projectBP: null,
            })
        }
    }

    const handleSearchData = async () => {
        let { startDate, endDate } = state;
        /* console.log("startDate", startDate)
        console.log("endDate",endDate) */
        let startTimeMiliSeconds = new Date(moment(startDate, 'MM-YYYY').format()).getTime();
        let endTimeMiliSeconds = new Date(moment(endDate, 'MM-YYYY').format()).getTime();
        if (startTimeMiliSeconds > endTimeMiliSeconds) {
            const { translate } = props;
            Swal.fire({
                title: translate('kpi.evaluation.employee_evaluation.wrong_time'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm'),
            })
        } else {
            let { startDate, endDate } = state;
            let startDateWork = moment(startDate, 'MM-YYYY').format('YYYY-MM');
            let endDateWork = moment(endDate, 'MM-YYYY').format('YYYY-MM');
            props.getResponsibleTaskByUser([], 1, 1000, [], [], [], null, startDateWork, endDateWork, null, null, true);
            props.getAccountableTaskByUser([], 1, 1000, [], [], [], null, startDateWork, endDateWork, null, null, true);
            props.getConsultedTaskByUser([], 1, 1000, [], [], [], null, startDateWork, endDateWork, null, null, true);
            props.getInformedTaskByUser([], 1, 1000, [], [], [], null, startDateWork, endDateWork, null, null, true);
        }
    }

    const { loadingInformed, loadingCreator, loadingConsulted, loadingAccountable } = tasks;

    const { listAlarmTask, listTasksGeneral, startDate, endDate, bid } = state;
    let startDateWork = moment(startDate, 'MM-YYYY').format('YYYY-MM');
    let endDateWork = moment(endDate, 'MM-YYYY').format('YYYY-MM');

    return (
        <div className='box box-primary'>
            <div className="box-header with-border">
                <div className="box-title">Tổng quan công việc gói thầu</div>
            </div>
            <div className="box-body qlcv">
                <div className="form-inline" style={{ marginBottom: 15 }}>
                    {/* Tên gói thầu */}
                    <div className="form-group">
                        <label className="form-control-static">Chọn gói thầu</label>
                        <SelectBox
                            id={`bid-package-of-task-related-select-statistic`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={listBiddingPackages?.map(x => {
                                return { text: x.name, value: x._id }
                            })}
                            options={{ placeholder: "Chọn gói thầu" }}
                            onChange={handleChangeBiddingPackage}
                            value={bid?._id}
                            multiple={false}
                        />
                    </div>
                </div>
                <React.Fragment>
                    {/* 
                    <div className="box-header with-border">
                        <div className="box-title">{`Tổng quan công việc (${listTasksGeneral ? listTasksGeneral.length : 0})`}</div>
                    </div> */}
                    {
                        listTasksGeneral && listTasksGeneral.length > 0 ?
                            <LazyLoadComponent once={true}>
                                <GeneralTaskPersonalChart
                                    tasks={listTasksGeneral}
                                />
                            </LazyLoadComponent>
                            : (loadingInformed && loadingCreator && loadingConsulted && loadingAccountable) ?
                                <div className="table-info-panel">{translate('confirm.loading')}</div> :
                                <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }
                </React.Fragment>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => (state)

const mapDispatchToProps = {
    getResponsibleTaskByUser: taskManagementActions.getResponsibleTaskByUser,
    getAccountableTaskByUser: taskManagementActions.getAccountableTaskByUser,
    getConsultedTaskByUser: taskManagementActions.getConsultedTaskByUser,
    getInformedTaskByUser: taskManagementActions.getInformedTaskByUser,
    getCreatorTaskByUser: taskManagementActions.getCreatorTaskByUser,
}

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(withTranslate(StatisticTaskRelatedBiddingPackage));
export { connectedComponent as StatisticTaskRelatedBiddingPackage }
