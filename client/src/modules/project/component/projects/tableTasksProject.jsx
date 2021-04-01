import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { DataTableSetting, DatePicker, PaginateBar, SelectBox, SelectMulti, Tree, TreeTable, ExportExcel } from '../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import ValidationHelper from '../../../../helpers/validationHelper';
import { ProjectActions } from "../../redux/actions";
import { UserActions } from '../../../super-admin/user/redux/actions';
import { formatDate } from '../../../../helpers/formatDate';

const TableTasksProject = (props) => {
    const [state, setState] = useState({
        exampleName: "",
        page: 1,
        limit: 5,
    })
    const { project, translate, user } = props;
    const { projectName, page, limit, currentRow } = state;

    // khởi tạo dữ liệu TreeTable
    let column = [
        { name: translate('task.task_management.col_name'), key: "name" },
        { name: translate('task.task_management.detail_description'), key: "description" },
        { name: translate('task.task_management.col_organization'), key: "organization" },
        { name: translate('task.task_management.col_project'), key: "project" },
        { name: translate('task.task_management.col_priority'), key: "priority" },
        { name: translate('task.task_management.responsible'), key: "responsibleEmployees" },
        { name: translate('task.task_management.accountable'), key: "accountableEmployees" },
        { name: translate('task.task_management.creator'), key: "creatorEmployees" },
        { name: translate('task.task_management.col_start_date'), key: "startDate" },
        { name: translate('task.task_management.col_end_date'), key: "endDate" },
        { name: translate('task.task_management.col_status'), key: "status" },
        { name: translate('task.task_management.col_progress'), key: "progress" },
        { name: translate('task.task_management.col_logged_time'), key: "totalLoggedTime" }
    ];
    let data = [];

    useEffect(() => {
        props.getProjectsDispatch({ calledId: "paginate", page, limit });
        props.getProjectsDispatch({ calledId: "all" });
        props.getAllUserInAllUnitsOfCompany();
    }, [])

    const handleChangeProjectName = (e) => {
        const { value } = e.target;
        setState({
            ...state,
            projectName: value
        });
    }

    const handleSubmitSearch = () => {
        props.getExamples({
            projectName,
            limit,
            page: 1
        });
        setState({
            ...state,
            page: 1
        });
    }

    const setPage = (pageNumber) => {
        setState({
            ...state,
            page: parseInt(pageNumber)
        });

        props.getProjectsDispatch({
            callId: "paginate",
            projectName,
            limit,
            page: parseInt(pageNumber)
        });
    }

    const setLimit = (number) => {
        setState({
            ...state,
            limit: parseInt(number),
            page: 1
        });
        props.getExamples({
            projectName,
            limit: parseInt(number),
            page: 1
        });
    }

    const handleDelete = (id) => {
        props.deleteProjectDispatch(id);
        props.getProjectsDispatch({
            projectName,
            limit,
            page: project && project.lists && project.lists.length === 1 ? page - 1 : page
        });
    }

    const handleEdit = (project) => {
        setState({
            ...state,
            currentRow: project
        });
        window.$('#modal-edit-project').modal('show');
    }

    const handleShowDetailInfo = (data) => {
        setState({
            ...state,
            projectDetail: data
        });

        window.$(`#modal-detail-project`).modal('show');
    }

    const handleOpenCreateForm = () => {
        window.$('#modal-create-project').modal('show')
    }


    let lists = [];
    if (project) {
        lists = project.data.paginate
    }

    const totalPage = project && project.data.totalPage;

    return (
        <React.Fragment>
            <div id="tree-table-container" style={{ marginTop: '20px' }}>
                <TreeTable
                    tableId={"tableId"}
                    behaviour="show-children"
                    column={column}
                    data={data}
                    titleAction={{
                        edit: translate('task.task_management.action_edit'),
                        delete: translate('task.task_management.action_delete'),
                        store: translate('task.task_management.action_store'),
                        restore: translate('task.task_management.action_restore'),
                        add: translate('task.task_management.action_add'),
                        startTimer: translate('task.task_management.action_start_timer'),
                    }}
                    funcEdit={() => { }}
                    funcAdd={() => { }}
                    funcStartTimer={() => { }}
                    funcStore={() => { }}
                    funcDelete={() => { }}
                />
            </div>
        </React.Fragment>
    );
}

function mapStateToProps(state) {
    const project = state.project;
    return { project }
}

const mapDispatchToProps = {
    getProjectsDispatch: ProjectActions.getProjectsDispatch,
    deleteProjectDispatch: ProjectActions.deleteProjectDispatch,
    getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany,
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(TableTasksProject));