import React, { useState, useEffect, useRef, useCallback } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ProjectActions } from '../redux/actions';
import { UserActions } from '../../../super-admin/user/redux/actions';
import moment from 'moment';
import 'c3/c3.css';
import { checkIfAbleToCRUDProject, getCurrentProjectDetails, processAffectedTasksChangeRequest, MILISECS_TO_DAYS, MILISECS_TO_HOURS, getNewTasksListAfterCR, getEndDateOfProject, getEstimateCostOfProject, renderLongList } from './functionHelper';
import Swal from 'sweetalert2';
import { taskManagementActions } from '../../../task/task-management/redux/actions';
import ModalChangeRequestInfo from './modalChangeRequestInfo';
import { getStorage } from '../../../../config';
import { ChangeRequestActions } from '../../change-requests/redux/actions';
import ModalCreateChangeRequest from '../../change-requests/components/modalCreateChangeRequest';
import { DataTableSetting, PaginateBar } from '../../../../common-components';

const TabChangeRequestProject = (props) => {
    const tableId = 'project-change-requests-table';
    // Khởi tạo state
    const [state, setState] = useState({
        changeRequestName: "",
        page: 1,
        perPage: 5,
    })
    const { translate, project, currentProjectTasks, user, changeRequest } = props;
    const currentChangeRequestsList = changeRequest && changeRequest.changeRequests;
    const projectDetail = getCurrentProjectDetails(project);
    const currentProjectId = window.location.href.split('?id=')[1].split('#')?.[0];
    const [currentRow, setCurrentRow] = useState();
    const [currentChangeRequestId, setCurrentChangeRequestId] = useState('');
    const { changeRequestName, page, perPage } = state;

    let lists = [];
    if (changeRequest) {
        lists = changeRequest.changeRequestsPaginate
    }
    const totalPage = changeRequest && Math.ceil(changeRequest.totalDocs / perPage);

    const setPage = (pageNumber) => {
        setState({
            ...state,
            page: parseInt(pageNumber)
        });
        props.getListProjectChangeRequestsDispatch({ projectId: currentProjectId, calledId: 'paginate', page: parseInt(pageNumber), perPage });
    }

    const setLimit = (number) => {
        setState({
            ...state,
            perPage: parseInt(number),
            page: 1
        });
        props.getListProjectChangeRequestsDispatch({ projectId: currentProjectId, calledId: 'paginate', page: 1, perPage: parseInt(number) });
    }

    const renderStatus = (statusValue) => {
        switch (statusValue) {
            case 0: return 'Chưa yêu cầu';
            case 1: return 'Đang yêu cầu';
            case 2: return 'Bị từ chối';
            case 3: return 'Đã đồng ý';
            default: return 'Chưa yêu cầu';
        }
    }


    const updateListRequests = (currentChangeRequestsList, currentProjectTasks) => {
        // Nếu projectTasks không có gì thì không xử lý tiếp nữa
        if (!currentProjectTasks || currentProjectTasks.length === 0) return;
        // Cap nhat lai cac changeRequest
        console.log('currentChangeRequestId', currentChangeRequestId)
        console.log('currentProjectTasks', currentProjectTasks)
        const requestsPendingListFromDB = currentChangeRequestsList
            .filter((CRItem => CRItem.requestStatus === 1))
            .map((CRItem => {
                if (String(CRItem._id) === currentChangeRequestId) {
                    return {
                        ...CRItem,
                        requestStatus: 3,
                    }
                }
                return CRItem;
            }));

        // const requestsPendingListFromDB = [...currentChangeRequestsList];
        console.log('requestsPendingListFromDB', requestsPendingListFromDB)
        let newChangeRequestsList = []
        for (let requestsPendingItem of requestsPendingListFromDB) {
            console.log('\n---------------------requestsPendingItem', requestsPendingItem)
            const tempCurrentTask = {
                ...requestsPendingItem.currentTask,
                _id: requestsPendingItem.currentTask.task,
                preceedingTasks: requestsPendingItem.currentTask.preceedingTasks.map((preItem) => preItem.task),
                estimateNormalTime: Number(requestsPendingItem.currentTask.estimateNormalTime) / (projectDetail.unitTime === 'days' ? MILISECS_TO_DAYS : MILISECS_TO_HOURS),
                estimateOptimisticTime: Number(requestsPendingItem.currentTask.estimateOptimisticTime) / (projectDetail.unitTime === 'days' ? MILISECS_TO_DAYS : MILISECS_TO_HOURS),
            }
            if (requestsPendingItem.type === 'add_task' && requestsPendingItem.requestStatus === 1) {
                const newAffectedTasksList = [
                    {
                        task: undefined,
                        old: undefined,
                        new: {
                            ...requestsPendingItem.affectedTasksList[0].new,
                        }
                    }
                ]
                const newTasksList = [...currentProjectTasks, tempCurrentTask];
                console.log('newTasksList', newTasksList);
                newChangeRequestsList.push({
                    ...requestsPendingItem,
                    baseline: {
                        oldEndDate: getEndDateOfProject(currentProjectTasks, false),
                        newEndDate: getEndDateOfProject(newTasksList, false),
                        oldCost: getEstimateCostOfProject(currentProjectTasks),
                        newCost: getEstimateCostOfProject(newTasksList),
                    },
                    affectedTasksList: newAffectedTasksList,
                })
                console.log('newChangeRequestsList', newChangeRequestsList)
            }
            else if (requestsPendingItem.type === 'edit_task' && requestsPendingItem.requestStatus === 1) {
                const currentProjectTasksFormatPreceedingTasks = currentProjectTasks.map((taskItem) => {
                    return {
                        ...taskItem,
                        preceedingTasks: taskItem.preceedingTasks.map((taskItemPreItem) => {
                            return taskItemPreItem.task
                        })
                    }
                })
                let allTasksNodeRelationArr = [];
                // Hàm đệ quy để lấy tất cả những tasks có liên quan tới task hiện tại
                const getAllRelationTasks = (currentProjectTasksFormatPreceedingTasks, currentTask) => {
                    const preceedsContainCurrentTask = currentProjectTasksFormatPreceedingTasks.filter((taskItem) => {
                        return taskItem.preceedingTasks.includes(currentTask._id)
                    });
                    for (let preConItem of preceedsContainCurrentTask) {
                        allTasksNodeRelationArr.push(preConItem);
                        getAllRelationTasks(currentProjectTasksFormatPreceedingTasks, preConItem);
                    }
                    if (!preceedsContainCurrentTask || preceedsContainCurrentTask.length === 0) {
                        return;
                    }
                }
                console.log('currentProjectTasksFormatPreceedingTasks', currentProjectTasksFormatPreceedingTasks)
                console.log('tempCurrentTask', tempCurrentTask)
                getAllRelationTasks(currentProjectTasksFormatPreceedingTasks, tempCurrentTask);
                // Tìm task cũ để cho vào đầu array
                const currentOldTask = currentProjectTasksFormatPreceedingTasks.find((item) => String(item._id) === (tempCurrentTask._id || tempCurrentTask.task))
                console.log('currentOldTask', currentOldTask)
                allTasksNodeRelationArr.unshift({
                    ...currentOldTask,
                    estimateNormalTime: Number(currentOldTask.estimateNormalTime),
                    estimateOptimisticTime: Number(currentOldTask.estimateOptimisticTime),
                });
                console.log('allTasksNodeRelationArr', allTasksNodeRelationArr)
                const allTasksNodeRelationFormattedArr = allTasksNodeRelationArr;
                console.log('allTasksNodeRelationFormattedArr', allTasksNodeRelationFormattedArr)
                const { affectedTasks, newTasksList } = processAffectedTasksChangeRequest(projectDetail, allTasksNodeRelationFormattedArr, tempCurrentTask);
                const newAffectedTasksList = affectedTasks.map(affectedItem => {
                    return {
                        ...affectedItem,
                        old: {
                            ...tempCurrentTask,
                            ...affectedItem.old,
                            preceedingTasks: affectedItem.old.preceedingTasks?.map(item => ({
                                task: item,
                                link: ''
                            })),
                            estimateNormalTime: Number(affectedItem.old.estimateNormalTime) * (projectDetail.unitTime === 'days' ? MILISECS_TO_DAYS : MILISECS_TO_HOURS),
                            estimateOptimisticTime: Number(affectedItem.old.estimateOptimisticTime) * (projectDetail.unitTime === 'days' ? MILISECS_TO_DAYS : MILISECS_TO_HOURS),
                        },
                        new: {
                            ...tempCurrentTask,
                            ...affectedItem.new,
                            preceedingTasks: affectedItem.new.preceedingTasks?.map(item => ({
                                task: item,
                                link: ''
                            })),
                            estimateNormalTime: Number(affectedItem.new.estimateNormalTime) * (projectDetail.unitTime === 'days' ? MILISECS_TO_DAYS : MILISECS_TO_HOURS),
                            estimateOptimisticTime: Number(affectedItem.new.estimateOptimisticTime) * (projectDetail.unitTime === 'days' ? MILISECS_TO_DAYS : MILISECS_TO_HOURS),
                        }
                    }
                })
                console.log('newAffectedTasksList', newAffectedTasksList)
                // newTasksList ngắn hơn currentProjectTasks vì ta chỉ xét những tasks có liên quan tới task hiện tại
                const newCurrentProjectTasks = currentProjectTasks.map((taskItem) => {
                    for (let newTaskItem of newTasksList) {
                        if (String(newTaskItem._id) === String(taskItem._id)) {
                            return {
                                ...taskItem,
                                ...newTaskItem,
                            }
                        }
                    }
                    return taskItem;
                })
                newChangeRequestsList.push({
                    ...requestsPendingItem,
                    baseline: {
                        oldEndDate: getEndDateOfProject(currentProjectTasks, false),
                        newEndDate: getEndDateOfProject(newCurrentProjectTasks, false),
                        oldCost: getEstimateCostOfProject(currentProjectTasks),
                        newCost: getEstimateCostOfProject(newCurrentProjectTasks),
                    },
                    affectedTasksList: newAffectedTasksList,
                })
                console.log('newChangeRequestsList', newChangeRequestsList)
            }
            else {
                newChangeRequestsList.push({
                    ...requestsPendingItem,
                });
                console.log('newChangeRequestsList', newChangeRequestsList)
            }
        }
        if (newChangeRequestsList.length > 0) {
            props.updateStatusProjectChangeRequestDispatch({
                newChangeRequestsList,
            });
        }
    }

    const handleApprove = (changeRequestId) => {
        setCurrentChangeRequestId(changeRequestId);
        const message = "Bạn có muốn phê duyệt yêu cầu thay đổi này?"
        Swal.fire({
            html: `<h4 style="color: red"><div>${message}</div></h4>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: translate('general.no'),
            confirmButtonText: translate('general.yes'),
        }).then((result) => {
            if (result.value) {
                props.updateStatusProjectChangeRequestDispatch({
                    changeRequestId,
                    requestStatus: 3,
                });
                setTimeout(() => {
                    props.getTasksByProject({ projectId: currentProjectId || projectDetail._id });
                }, 20);
                console.log('\n------- da bam phe duyet---------')
            }
        }).catch(err => {
            console.error('Change request', err)
        })
    }

    const handleCancel = (changeRequestId) => {
        const message = "Bạn có muốn từ chối yêu cầu thay đổi này?"
        Swal.fire({
            html: `<h4 style="color: red"><div>${message}</div></h4>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: translate('general.no'),
            confirmButtonText: translate('general.yes'),
        }).then((result) => {
            if (result.value) {
                props.updateStatusProjectChangeRequestDispatch({
                    changeRequestId,
                    requestStatus: 2,
                });
                setTimeout(() => {
                    props.getTasksByProject({ projectId: currentProjectId || projectDetail._id });
                }, 20);
            }
        })
    }

    const handleShowDetailInfo = (changeRequestId) => {
        const currentCRItem = currentChangeRequestsList.find((CRItem) => String(CRItem._id) === String(changeRequestId));
        setCurrentRow(currentCRItem);
        setTimeout(() => {
            window.$(`#modal-change-request-info-${changeRequestId}`).modal("show");
        }, 10);
    }

    const renderActionValueCell = (requestStatus, CRid, creatorObj) => {
        if (requestStatus === 1 && checkIfAbleToCRUDProject({ project, user, currentProjectId: currentProjectId || projectDetail._id, isInsideProject: true })) {
            return (
                <td style={{ textAlign: 'center' }}>
                    <a className="visibility text-yellow" style={{ width: '5px', cursor: 'pointer' }} onClick={() => handleShowDetailInfo(CRid)}>
                        <i className="material-icons">visibility</i>
                    </a>
                    <a className="do_not_disturb_on text-red" style={{ width: '5px', cursor: 'pointer' }} onClick={() => handleCancel(CRid)}>
                        <i className="material-icons">do_not_disturb_on</i>
                    </a>
                    <a className="check_circle text-green" style={{ width: '5px', cursor: 'pointer' }} onClick={() => handleApprove(CRid)}>
                        <i className="material-icons">check_circle</i>
                    </a>
                </td>
            )
        }
        return (
            <td style={{ textAlign: 'center' }}>
                <a className="visibility text-yellow" style={{ width: '5px', cursor: 'pointer' }} onClick={() => handleShowDetailInfo(CRid)}>
                    <i className="material-icons">visibility</i>
                </a>
                {
                    String(getStorage('userId')) === String(creatorObj.id) && requestStatus === 1 &&
                    <a className="do_not_disturb_on text-red" style={{ width: '5px', cursor: 'pointer' }} onClick={() => handleCancel(CRid)}>
                        <i className="material-icons">do_not_disturb_on</i>
                    </a>
                }
            </td>
        );
    }

    const renderCellColor = (requestStatus) => {
        if (requestStatus === 3) {
            return {
                backgroundColor: 'green',
            }
        }
        if (requestStatus === 2) {
            return {
                backgroundColor: 'red',
            }
        }
        return {}
    }

    const renderTextCellColor = (requestStatus) => {
        if (requestStatus === 3 || requestStatus === 2) {
            return {
                color: 'white',
                fontWeight: 'bold',
            }
        }
        return {
            color: 'black',
        }
    }

    const getTaskName = (currentProjectTasks, taskId) => {
        return currentProjectTasks.find((taskItem) => String(taskItem._id) === taskId)?.name;
    }

    const createNormalChangeRequest = () => {
        setTimeout(() => {
            window.$(`#modal-create-change-request`).modal("show");
        }, 10);
    }

    useEffect(() => {
        updateListRequests(currentChangeRequestsList, currentProjectTasks)
    }, [currentProjectTasks])

    useEffect(() => {
        props.getListProjectChangeRequestsDispatch({ projectId: currentProjectId, calledId: 'paginate', page, perPage });
        props.getListProjectChangeRequestsDispatch({ projectId: currentProjectId });
    }, [])

    
    useEffect(() => {
        props.getListProjectChangeRequestsDispatch({ projectId: currentProjectId, calledId: 'paginate', page, perPage });
    }, [changeRequest.changeRequests])

    return (
        <React.Fragment>
            <div className="box">
                <div className="box-body qlcv">
                    <ModalChangeRequestInfo
                        changeRequest={currentRow}
                        changeRequestId={currentRow && currentRow._id}
                        projectDetail={projectDetail}
                        currentProjectTasks={currentProjectTasks}
                    />
                    <ModalCreateChangeRequest
                        currentProjectTasks={currentProjectTasks}
                    />
                    <div className="row">
                        <div className="pull-right">
                            <button
                                type="button"
                                className="btn btn-success pull-right"
                                title="Tạo yêu cầu thay đổi"
                                onClick={createNormalChangeRequest}
                                style={{ marginRight: 10 }}
                            >Tạo yêu cầu thay đổi</button>
                        </div>
                    </div>

                    <div>
                        <DataTableSetting
                            tableId={tableId}
                            columnArr={[
                                'Tên yêu cầu',
                                'Người tạo yêu cầu',
                                'Thời gian tạo yêu cầu',
                                'Mô tả yêu cầu',
                                'Những công việc bị ảnh hưởng',
                                'Trạng thái yêu cầu',
                            ]}
                            setLimit={setLimit}
                        />
                    </div>

                    <table id={tableId} className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>Tên yêu cầu</th>
                                <th>Người tạo yêu cầu</th>
                                <th>Thời gian tạo yêu cầu</th>
                                <th>Mô tả yêu cầu</th>
                                <th>Những công việc bị ảnh hưởng</th>
                                <th>Trạng thái yêu cầu</th>
                                <th style={{ width: "120px", textAlign: "center" }}>{translate('table.action')}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentProjectTasks && (lists && lists.length !== 0) &&
                                lists.map((CRItem, index) => (
                                    <tr key={index}>
                                        <td>{CRItem?.name}</td>
                                        <td>{CRItem?.creator?.name}</td>
                                        <td>{moment(CRItem?.createdAt).format('HH:mm DD/MM/YYYY')}</td>
                                        <td>{CRItem?.description}</td>
                                        <td style={{ maxWidth: 500 }}>
                                            {
                                                renderLongList(
                                                    CRItem?.affectedTasksList?.map((affectedItem) => {
                                                        return getTaskName(currentProjectTasks, affectedItem?.task) || affectedItem?.new?.name
                                                    }), 5
                                                )
                                            }
                                        </td>
                                        <td style={{
                                            ...renderTextCellColor(CRItem?.requestStatus),
                                            ...renderCellColor(CRItem?.requestStatus),
                                            textAlign: 'center',
                                            verticalAlign: 'center'
                                        }}>
                                            {renderStatus(CRItem?.requestStatus)}
                                        </td>
                                        {renderActionValueCell(CRItem?.requestStatus, CRItem?._id, CRItem?.creator)}
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>

                     {/* PaginateBar */}
                     {changeRequest && changeRequest.isLoading ?
                        <div className="table-info-panel">{translate('confirm.loading')}</div> :
                        (!lists || lists.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }
                    <PaginateBar
                        pageTotal={totalPage ? totalPage : 0}
                        currentPage={page}
                        display={lists && lists.length !== 0 && lists.length}
                        total={changeRequest && changeRequest.totalDocs}
                        func={setPage}
                    />
                </div>
            </div>
        </React.Fragment>
    );
}

function mapStateToProps(state) {
    const { project, user, changeRequest } = state;
    return { project, user, changeRequest }
}

const mapDispatchToProps = {
    getProjectsDispatch: ProjectActions.getProjectsDispatch,
    deleteProjectDispatch: ProjectActions.deleteProjectDispatch,
    updateStatusProjectChangeRequestDispatch: ChangeRequestActions.updateStatusProjectChangeRequestDispatch,
    getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany,
    getTasksByProject: taskManagementActions.getTasksByProject,
    getListProjectChangeRequestsDispatch: ChangeRequestActions.getListProjectChangeRequestsDispatch,
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(TabChangeRequestProject));