import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, forceCheckOrVisible } from '../../../../common-components'
import { ProjectGantt } from '../../../../common-components/src/gantt/projectGantt';
import { ProjectActions } from "../../projects/redux/actions";
import { UserActions } from '../../../super-admin/user/redux/actions';
import { taskManagementActions } from '../../../task/task-management/redux/actions';
import moment from 'moment';
import { getStorage } from '../../../../config';
import TabEvalProject from './tabEvalProject';
import TabEvalProjectMember from './tabEvalProjectMember';
import { numberWithCommas } from '../../../task/task-management/component/functionHelpers';
import { StatisticActions } from '../../statistic/redux/actions';

const ModalEVMData = (props) => {
    const { projectDetailId, projectDetail, translate, project, tasks, evmData } = props;
    const userId = getStorage("userId");
    const [currentProjectId, setCurrentProjectId] = useState('');
    const currentTasks = tasks?.tasksbyproject;
    const [currentMonth, setCurrentMonth] = useState(moment().startOf('month'));

    useEffect(() => {
        props.getProjectsDispatch({ calledId: "all", userId });
        props.getAllUserInAllUnitsOfCompany();
        props.getTasksByProject(projectDetailId || projectDetail?._id)
        props.getListTasksEvalDispatch(currentProjectId, currentMonth.format());
    }, [currentProjectId, currentMonth])

    if (projectDetailId != currentProjectId) {
        setCurrentProjectId(projectDetailId);
    }

    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-evm-${projectDetailId || projectDetail?._id}`} isLoading={false}
                formID={`form-evm-${projectDetailId || projectDetail?._id}`}
                title={`Bảng chi tiết dữ liệu EVM`}
                hasSaveButton={false}
                size={75}
                resetOnClose={true}
            >
                <div className="box">
                    <div className="box-body qlcv">
                        <table id="high-points-members-table" className="table table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th>Khoảng thời gian</th>
                                    <th>Tên công việc</th>
                                    <th>Thời gian bắt đầu</th>
                                    <th>Thời gian kết thúc</th>
                                    <th>Planned Value (VND)</th>
                                    <th>Actual Cost (VND)</th>
                                    <th>Earned Value (VND)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {evmData?.map((evmItem, evmIndex) => {
                                    return evmItem?.listTasksEachMoment?.map((taskMomentItem, taskMomentIndex) => {
                                        if (taskMomentIndex === evmItem?.listTasksEachMoment.length - 1) {
                                            return (
                                                <>
                                                    <tr key={`${taskMomentItem.id}-${taskMomentIndex}`}>
                                                        <td><strong>{
                                                            taskMomentIndex === 0
                                                                ? `${evmItem?.category} (${evmItem?.startOfCurrentMoment.format('DD/MM/YYYY')} - ${evmItem?.endOfCurrentMoment.format('DD/MM/YYYY')})`
                                                                : ''
                                                        }
                                                        </strong></td>
                                                        <td>{taskMomentItem?.name}</td>
                                                        <td>{moment(taskMomentItem?.startDate).format('HH:mm DD/MM/YYYY')}</td>
                                                        <td>{moment(taskMomentItem?.endDate).format('HH:mm DD/MM/YYYY')}</td>
                                                        <td>{numberWithCommas(taskMomentItem?.plannedValue)}</td>
                                                        <td>{numberWithCommas(taskMomentItem?.actualCost)}</td>
                                                        <td>{numberWithCommas(taskMomentItem?.earnedValue)}</td>
                                                    </tr>
                                                    <tr key={taskMomentIndex} style={{backgroundColor: '#28A745'}}>
                                                        <td style={{color: 'white', fontWeight: 'bold'}}>Tổng</td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td style={{color: 'white', fontWeight: 'bold'}}>{numberWithCommas(evmItem?.totalPVEachMoment)}</td>
                                                        <td style={{color: 'white', fontWeight: 'bold'}}>{numberWithCommas(evmItem?.totalACEachMoment)}</td>
                                                        <td style={{color: 'white', fontWeight: 'bold'}}>{numberWithCommas(evmItem?.totalEVEachMoment)}</td>
                                                    </tr>
                                                </>
                                            )
                                        }
                                        return (
                                            <tr key={taskMomentIndex}>
                                                <td><strong>{
                                                    taskMomentIndex === 0
                                                        ? `${evmItem?.category} (${evmItem?.startOfCurrentMoment.format('DD/MM/YYYY')} - ${evmItem?.endOfCurrentMoment.format('DD/MM/YYYY')})`
                                                        : ''
                                                }
                                                </strong></td>
                                                <td>{taskMomentItem?.name}</td>
                                                <td>{moment(taskMomentItem?.startDate).format('HH:mm DD/MM/YYYY')}</td>
                                                <td>{moment(taskMomentItem?.endDate).format('HH:mm DD/MM/YYYY')}</td>
                                                <td>{numberWithCommas(taskMomentItem?.plannedValue)}</td>
                                                <td>{numberWithCommas(taskMomentItem?.actualCost)}</td>
                                                <td>{numberWithCommas(taskMomentItem?.earnedValue)}</td>
                                            </tr>
                                        )
                                    })
                                })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </DialogModal>
        </React.Fragment>
    )
}

function mapStateToProps(state) {
    const { project, user, tasks } = state;
    return { project, user, tasks }
}

const mapDispatchToProps = {
    getProjectsDispatch: ProjectActions.getProjectsDispatch,
    deleteProjectDispatch: ProjectActions.deleteProjectDispatch,
    getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany,
    getTasksByProject: taskManagementActions.getTasksByProject,
    getListTasksEvalDispatch: StatisticActions.getListTasksEvalDispatch,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ModalEVMData));
