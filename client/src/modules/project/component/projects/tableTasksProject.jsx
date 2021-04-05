import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { DataTableSetting, DatePicker, PaginateBar, SelectBox, SelectMulti, Tree, TreeTable, ExportExcel, DeleteNotification } from '../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import ValidationHelper from '../../../../helpers/validationHelper';
import { ProjectActions } from "../../redux/actions";
import { UserActions } from '../../../super-admin/user/redux/actions';
import { formatDate } from '../../../../helpers/formatDate';
import { taskManagementActions } from '../../../task/task-management/redux/actions';
import { ModalPerform } from '../../../task/task-perform/component/modalPerform';

const TableTasksProject = (props) => {
    const [state, setState] = useState({
        taskName: "",
        page: 1,
        limit: 5,
        currentTaskId: null,
    })
    const currentProjectId = window.location.href.split('?id=')[1];
    const { translate, currentProjectTasks, user } = props;
    const { page, limit, taskName, currentTaskId } = state;
    let units = []
    if (user) units = user.organizationalUnitsOfUser;

    useEffect(() => {
        props.getAllUserInAllUnitsOfCompany();
    }, [])

    // const handleChangeProjectName = (e) => {
    //     const { value } = e.target;
    //     setState({
    //         ...state,
    //         taskName: value
    //     });
    // }

    // const handleSubmitSearch = () => {
    //     props.getExamples({
    //         taskName,
    //         limit,
    //         page: 1
    //     });
    //     setState({
    //         ...state,
    //         page: 1
    //     });
    // }

    // const setPage = (pageNumber) => {
    //     setState({
    //         ...state,
    //         page: parseInt(pageNumber)
    //     });

    //     props.getProjectsDispatch({
    //         callId: "paginate",
    //         taskName,
    //         limit,
    //         page: parseInt(pageNumber)
    //     });
    // }

    // const setLimit = (number) => {
    //     setState({
    //         ...state,
    //         limit: parseInt(number),
    //         page: 1
    //     });
    //     props.getTasksByProject({
    //         taskName,
    //         limit: parseInt(number),
    //         page: 1
    //     });
    // }

    const handleDelete = (id) => {
        // props.deleteProjectDispatch(id);
        // props.getProjectsDispatch({
        //     taskName,
        //     limit,
        //     page: project && project.lists && project.lists.length === 1 ? page - 1 : page
        // });
    }

    const handleEdit = (project) => {
        setState({
            ...state,
            currentRow: project
        });
        window.$('#modal-edit-task').modal('show');
    }

    const handleShowDetailInfo = (id) => {
        console.log('show detail id', id)
        setState({
            currentTaskId: id
        })
        window.$(`#modelPerformTask${id}`).modal('show');
    }

    // let lists = [];
    // if (project) {
    //     lists = project.data.paginate
    // }

    // const totalPage = project && project.data.totalPage;

    return (
        <React.Fragment>
            {
                currentTaskId &&
                <ModalPerform
                    units={units}
                    id={currentTaskId}
                />
            }
            <table id="project-table" className="table table-striped table-bordered table-hover">
                <thead>
                    <tr>
                        <th>{translate('task.task_management.col_name')}</th>
                        <th>{translate('task.task_management.responsible')}</th>
                        <th>{translate('task.task_management.accountable')}</th>
                        <th>{translate('task.task_management.creator')}</th>
                        <th>{translate('task.task_management.col_status')}</th>
                        <th>{translate('task.task_management.col_progress')}</th>
                        <th style={{ width: "120px", textAlign: "center" }}>
                            {translate('table.action')}
                            <DataTableSetting
                                tableId="example-table"
                                columnArr={[
                                    translate('manage_example.index'),
                                    translate('manage_example.exampleName'),
                                    translate('manage_example.description'),
                                    "Mã số",
                                ]}
                            // limit={limit}
                            // hideColumnOption={true}
                            // setLimit={setLimit}
                            />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {(currentProjectTasks && currentProjectTasks.length !== 0) &&
                        currentProjectTasks.map((taskItem, index) => (
                            <tr key={index}>
                                <td>{taskItem?.name}</td>
                                <td>{taskItem?.responsibleEmployees.map(o => o.name).join(", ")}</td>
                                <td>{taskItem?.accountableEmployees?.map(o => o.name).join(", ")}</td>
                                <td>{taskItem?.creator?.name}</td>
                                <td>{taskItem?.status}</td>
                                <td>{taskItem?.progress}%</td>
                                <td style={{ textAlign: "center" }}>
                                    <a className="edit text-green" style={{ width: '5px' }} onClick={() => handleShowDetailInfo(taskItem?._id)}><i className="material-icons">visibility</i></a>
                                    <a className="edit text-yellow" style={{ width: '5px' }} onClick={() => handleEdit(taskItem)}><i className="material-icons">edit</i></a>
                                    <DeleteNotification
                                        content={translate('project.delete')}
                                        data={{
                                            id: taskItem?._id,
                                            info: taskItem?.name
                                        }}
                                        func={handleDelete}
                                    />
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </React.Fragment>
    );
}

function mapStateToProps(state) {
    const { project, user, tasks } = state;
    return { project, user, tasks }
}

const mapDispatchToProps = {
    deleteProjectDispatch: ProjectActions.deleteProjectDispatch,
    getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany,
    getTasksByProject: taskManagementActions.getTasksByProject,
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(TableTasksProject));