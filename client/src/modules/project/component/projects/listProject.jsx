import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { DataTableSetting, DeleteNotification, PaginateBar } from "../../../../common-components";
import ProjectCreateForm from "./createProject";
import ProjectEditForm from './editProject';
import ProjectDetailForm from './detailProject';
import { ProjectActions } from "../../redux/actions";
import { UserActions } from '../../../super-admin/user/redux/actions';
import { getStorage } from "../../../../config";
import { checkIfAbleToCRUDProject } from "./functionHelper";

function ListProject(props) {
    // Khởi tạo state
    const [state, setState] = useState({
        exampleName: "",
        page: 1,
        limit: 5,
        currentRow: null,
        projectDetail: null,
    })
    const { project, translate, user } = props;
    const userId = getStorage("userId");
    const { projectName, page, limit, currentRow, projectDetail } = state;

    useEffect(() => {
        props.getProjectsDispatch({ calledId: "paginate", page, limit, userId });
        props.getProjectsDispatch({ calledId: "all", userId });
        props.getAllUserInAllUnitsOfCompany();
    }, [])

    const handleCreateProject = () => {
        props.getProjectsDispatch({ calledId: "paginate", page, limit, userId });
        props.getProjectsDispatch({ calledId: "all", userId });
    }

    const handleChangeProjectName = (e) => {
        const { value } = e.target;
        setState({
            ...state,
            projectName: value
        });
    }

    const handleSubmitSearch = () => {
        props.getProjectsDispatch({
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
        props.getProjectsDispatch({
            projectName,
            limit: parseInt(number),
            page: 1
        });
    }

    const handleShowDetailInfo = (projectItem) => {
        setState({
            ...state,
            projectDetail: projectItem
        });
        setTimeout(() => {
            window.$(`#modal-detail-project-${projectItem?._id}`).modal('show');
        }, 10);
    }

    const handleEdit = (projectItem) => {
        setState({
            ...state,
            currentRow: projectItem
        })
        setTimeout(() => {
            window.$(`#modal-edit-project-${projectItem?._id}`).modal('show')
        }, 10);
    }

    const handleDelete = (id) => {
        props.deleteProjectDispatch(id);
        props.getProjectsDispatch({
            projectName,
            limit,
            page: project && project.lists && project.lists.length === 1 ? page - 1 : page
        });
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
            <ProjectDetailForm
                projectDetailId={projectDetail && projectDetail._id}
                projectDetail={projectDetail}
            />

            <ProjectEditForm
                projectEditId={currentRow && currentRow._id}
                projectEdit={currentRow}
            />

            <ProjectCreateForm
                page={page}
                limit={limit}
                handleCreateProject={handleCreateProject}
            />

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

                        {/* Button thêm mới */}
                        {checkIfAbleToCRUDProject({ project, user }) &&
                            <div className="dropdown pull-right" style={{ marginTop: 5 }}>
                                <button type="button" className="btn btn-success dropdown-toggle pull-right"
                                    onClick={handleOpenCreateForm}
                                    data-toggle="dropdown" aria-expanded="true" title={translate('project.add_btn_new')}>
                                    {translate('project.add_btn_new')}
                                </button>
                            </div>
                        }

                    </div>

                    <table id="project-table" className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>{translate('project.name')}</th>
                                <th>{translate('project.code')}</th>
                                <th>{translate('project.creator')}</th>
                                <th>{translate('project.manager')}</th>
                                <th>{translate('project.member')}</th>
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
                                        limit={limit}
                                        hideColumnOption={true}
                                        setLimit={setLimit}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {(lists && lists.length !== 0) &&
                                lists.map((projectItem, index) => (
                                    <tr key={index}>
                                        <td>{projectItem?.name}</td>
                                        <td>{projectItem?.code}</td>
                                        <td>{projectItem?.creator?.name}</td>
                                        <td>{projectItem?.projectManager.map(o => o.name).join(", ")}</td>
                                        <td>{projectItem?.responsibleEmployees.map(o => o.name).join(", ")}</td>
                                        <td style={{ textAlign: "center" }}>
                                            <a className="edit text-green" style={{ width: '5px' }} onClick={() => handleShowDetailInfo(projectItem)}><i className="material-icons">visibility</i></a>
                                            {checkIfAbleToCRUDProject({ project, user, currentProjectId: projectItem._id }) && <a className="edit text-yellow" style={{ width: '5px' }} onClick={() => handleEdit(projectItem)}><i className="material-icons">edit</i></a>}
                                            {checkIfAbleToCRUDProject({ project, user, currentProjectId: projectItem._id }) && <DeleteNotification
                                                content={translate('project.delete')}
                                                data={{
                                                    id: projectItem?._id,
                                                    info: projectItem?.name
                                                }}
                                                func={handleDelete}
                                            />}
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>

                    {/* PaginateBar */}
                    {project && project.isLoading ?
                        <div className="table-info-panel">{translate('confirm.loading')}</div> :
                        (typeof lists === 'undefined' || lists.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }
                    <PaginateBar
                        pageTotal={totalPage ? totalPage : 0}
                        currentPage={project.data.page}
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
}

const connectedExampleManagementTable = connect(mapState, actions)(withTranslate(ListProject));
export { connectedExampleManagementTable as ListProject };