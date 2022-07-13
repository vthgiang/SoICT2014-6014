import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal } from '../../../../common-components'
import { ProjectActions } from "../../projects/redux/actions";
import { UserActions } from '../../../super-admin/user/redux/actions';
import { taskManagementActions } from '../../../task/task-management/redux/actions';
import moment from 'moment';
import { getStorage } from '../../../../config';
import { numberWithCommas } from '../../../task/task-management/component/functionHelpers';
import { StatisticActions } from '../../statistic/redux/actions';

const ModalEVMData = (props) => {
    const { projectDetailId, projectDetail, translate, project, tasks, evmData } = props;
    const [currentProjectId, setCurrentProjectId] = useState('');
    const currentTasks = tasks?.tasksByProject;
    const userId = getStorage("userId");
    const [currentMonth, setCurrentMonth] = useState(moment().startOf('month'));

    useEffect(() => {
        let projectId = projectDetailId || projectDetail?._id
        props.getAllTasksByProject( projectId );
        props.getListTasksEvalDispatch(projectId, currentMonth.format());

        if (projectId != currentProjectId) {
            setCurrentProjectId(projectId);
        }
    }, [projectDetailId, currentMonth, projectDetail?._id])

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
                                <tr key={`evmData-${currentProjectId}`}>
                                    <th>Khoảng thời gian</th>
                                    <th>Tên công việc</th>
                                    <th>Thời gian bắt đầu</th>
                                    <th>Thời gian kết thúc</th>
                                    <th>Planned Value (VND)</th>
                                    <th>Actual Cost (VND)</th>
                                    <th>Earned Value (VND)</th>
                                    <th>Test</th>
                                </tr>
                            </thead>

                            {
                                evmData?.map((evmItem, evmIndex) => {
                                    return evmItem?.listTasksEachMoment?.map((taskMomentItem, taskMomentIndex) => {
                                        if (taskMomentIndex === evmItem?.listTasksEachMoment.length - 1) {
                                            return (
                                                <tbody key={`summary_row-${taskMomentIndex}-${evmIndex}`}>
                                                    <tr key={`${taskMomentIndex}-${evmIndex}`}>
                                                        <td><strong>{
                                                            taskMomentIndex === 0
                                                                ? `${evmItem?.category} (${evmItem?.startOfCurrentMoment.format('DD/MM/YYYY')} - ${evmItem?.endOfCurrentMoment.format('DD/MM/YYYY')})`
                                                                : ''
                                                        }
                                                        </strong></td>
                                                        <td style={{ color: '#385898' }}>{taskMomentItem?.name}</td>
                                                        <td>{moment(taskMomentItem?.startDate).format('HH:mm DD/MM/YYYY')}</td>
                                                        <td>{moment(taskMomentItem?.endDate).format('HH:mm DD/MM/YYYY')}</td>
                                                        <td>{numberWithCommas(taskMomentItem?.plannedValue)}</td>
                                                        <td>{numberWithCommas(taskMomentItem?.actualCost)}</td>
                                                        <td>{numberWithCommas(taskMomentItem?.earnedValue)}</td>
                                                        <td>{`${taskMomentIndex}-${evmIndex}`}</td>
                                                    </tr>

                                                    <tr key={`${taskMomentItem._id} - ${taskMomentIndex} - ${evmIndex}`} style={{ backgroundColor: '#28A745' }}>
                                                        <td style={{ color: 'white', fontWeight: 'bold' }}>{translate('project.total')}</td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td style={{ color: 'white', fontWeight: 'bold' }}>{numberWithCommas(evmItem?.totalPVEachMoment)}</td>
                                                        <td style={{ color: 'white', fontWeight: 'bold' }}>{numberWithCommas(evmItem?.totalACEachMoment)}</td>
                                                        <td style={{ color: 'white', fontWeight: 'bold' }}>{numberWithCommas(evmItem?.totalEVEachMoment)}</td>
                                                        <td>{`${taskMomentItem._id}-${taskMomentIndex}-${evmIndex}`}</td>
                                                    </tr>
                                                </tbody>
                                            )
                                        }

                                        return (
                                            <tbody key={`normal_row-${taskMomentIndex}-${evmIndex}`}>
                                                <tr key={`${taskMomentIndex}-${evmIndex}`}>
                                                    <td><strong>{
                                                        taskMomentIndex === 0
                                                            ? `${evmItem?.category} (${evmItem?.startOfCurrentMoment.format('DD/MM/YYYY')} - ${evmItem?.endOfCurrentMoment.format('DD/MM/YYYY')})`
                                                            : ''
                                                    }
                                                    </strong></td>
                                                    <td style={{ color: '#385898' }}>{taskMomentItem?.name}</td>
                                                    <td>{moment(taskMomentItem?.startDate).format('HH:mm DD/MM/YYYY')}</td>
                                                    <td>{moment(taskMomentItem?.endDate).format('HH:mm DD/MM/YYYY')}</td>
                                                    <td>{numberWithCommas(taskMomentItem?.plannedValue)}</td>
                                                    <td>{numberWithCommas(taskMomentItem?.actualCost)}</td>
                                                    <td>{numberWithCommas(taskMomentItem?.earnedValue)}</td>
                                                    <td>{`${taskMomentIndex}-${evmIndex}`}</td>
                                                </tr>
                                            </tbody>
                                        )
                                    })
                                })

                            }

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
    getAllTasksByProject: taskManagementActions.getAllTasksByProject,
    getListTasksEvalDispatch: StatisticActions.getListTasksEvalDispatch,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ModalEVMData));
