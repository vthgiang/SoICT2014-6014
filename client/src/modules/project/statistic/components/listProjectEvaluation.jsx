import React, { useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { DataTableSetting, PaginateBar } from "../../../../common-components";
import { ProjectActions } from "../../projects/redux/actions";
import { UserActions } from '../../../super-admin/user/redux/actions';
import { getStorage } from "../../../../config";
import ModalProjectEvaluation from "./modalProjectEvaluation";
import { taskManagementActions } from "../../../task/task-management/redux/actions";
import { renderLongList } from "../../projects/components/functionHelper";

function ListProjectEvaluation(props) {
    const tableId = "project-statistical-table";
    // Khởi tạo state
    const [state, setState] = useState({
        projectName: "",
        page: 1,
        perPage: 5,
        currentRow: null,
        projectDetail: null,
    })
    const { project, translate, user } = props;
    const userId = getStorage("userId");
    const { projectName, page, perPage, currentRow, projectDetail } = state;

    useEffect(() => {
        props.getProjectsDispatch({ calledId: "paginate", page, perPage, userId, projectName });
        props.getProjectsDispatch({ calledId: "user_all", userId });
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
        props.getProjectsDispatch({ calledId: "paginate", page: 1, perPage, userId, projectName });
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

        props.getProjectsDispatch({ calledId: "paginate", page: parseInt(pageNumber), perPage, userId, projectName });
    }

    const setLimit = (number) => {
        setState({
            ...state,
            perPage: parseInt(number),
            page: 1
        });
        props.getProjectsDispatch({ calledId: "paginate", page: 1, perPage: parseInt(number), userId, projectName });
    }

    const handleShowDetailInfo = async (projectItem) => {
        await setState({
            ...state,
            projectDetail: {}
        });
        await setState({
            ...state,
            projectDetail: projectItem
        });
        setTimeout(() => {
            window.$(`#modal-show-project-eval-${projectItem?._id}`).modal('show');
        }, 100);
    }

    let lists = [];
    if (project) {
        lists = project.data.paginate
    }

    const totalPage = project && Math.ceil(project.data.totalDocs / perPage);

    return (
        <React.Fragment>
            {/* Modal chi tiết báo cáo dự án */}
            {
                projectDetail && projectDetail._id &&
                <ModalProjectEvaluation
                    projectDetailId={projectDetail && projectDetail._id}
                    projectDetail={projectDetail} />
            }

            <div className="box">
                <div className="box-body qlcv">
                    <div className="form-inline">
                        {/* Tìm kiếm */}
                        <div className="form-group">
                            <label className="form-control-static">{translate('project.name')}</label>
                            <input type="text" className="form-control" name="exampleName" onChange={handleChangeProjectName} placeholder={translate('project.name')} autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <button type="button" className="btn btn-success" title={translate('manage_example.search')} onClick={() => handleSubmitSearch()}>{translate('manage_example.search')}</button>
                        </div>

                    </div>

                    <table id={tableId} className="table table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>{translate('project.name')}</th>
                                <th>{translate('project.creator')}</th>
                                <th>{translate('project.manager')}</th>
                                <th>{translate('project.member')}</th>
                                <th>{translate('table.action')}
                                    <DataTableSetting
                                        tableId={tableId}
                                        columnArr={[
                                            translate('project.name'),
                                            translate('project.creator'),
                                            translate('project.manager'),
                                            translate('project.member'),
                                        ]}
                                        setLimit={setLimit}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {(lists && lists.length !== 0) &&
                                lists.map((projectItem, index) => (
                                    <tr key={index} style={{ cursor: 'pointer' }} onClick={() => handleShowDetailInfo(projectItem)}>
                                        <td style={{ color: '#385898' }}>{projectItem?.name}</td>
                                        <td>{projectItem?.creator?.name}</td>
                                        <td>{projectItem?.projectManager.map(o => o.name).join(", ")}</td>
                                        <td style={{ maxWidth: 400 }}>{renderLongList(projectItem?.responsibleEmployees.map(o => o.name))}</td>
                                        <td style={{ textAlign: "center" }}>
                                            <span className="visibility text-green" style={{ width: '5px' }}><i className="material-icons">visibility</i></span>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>

                    {/* PaginateBar */}
                    {project && project.isLoading ?
                        <div className="table-info-panel">{translate('confirm.loading')}</div> :
                        (!lists || lists.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }
                    <PaginateBar
                        pageTotal={totalPage ? totalPage : 0}
                        currentPage={page}
                        display={lists && lists.length !== 0 && lists.length}
                        total={project && project.data.totalDocs}
                        func={setPage}
                    />
                </div>
            </div>
        </React.Fragment>
    )
}

function mapState(state) {
    const { project, user } = state;
    return { project, user }
}
const actions = {
    getProjectsDispatch: ProjectActions.getProjectsDispatch,
    deleteProjectDispatch: ProjectActions.deleteProjectDispatch,
    createProjectDispatch: ProjectActions.createProjectDispatch,
    getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany,
    getTasksByProject: taskManagementActions.getTasksByProject,
}

const connectedExampleManagementTable = connect(mapState, actions)(withTranslate(ListProjectEvaluation));
export { connectedExampleManagementTable as ListProjectEvaluation };