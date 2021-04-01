import React, { useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

import { DataTableSetting, DeleteNotification, PaginateBar } from "../../../../common-components";

import ProjectCreateForm from "./createProject";
import ProjectEditForm from "./editProject";
import ProjectDetailForm from './detailProject';

import { ProjectActions } from "../../redux/actions";
import { UserActions } from '../../../super-admin/user/redux/actions';
import { formatDate } from '../../../../helpers/formatDate';
import ItemRowProject from "./itemRowProject";

function ListProject(props) {
    // Khởi tạo state
    const [state, setState] = useState({
        exampleName: "",
        page: 1,
        limit: 5,
        currentFocusedProject: {}
    })
    const { project, translate, user } = props;
    const { projectName, page, limit, currentFocusedProject } = state;

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

    const handleOpenCreateForm = () => {
        window.$('#modal-create-project').modal('show')
    }


    let lists = [];
    if (project) {
        lists = project.data.paginate
    }

    const totalPage = project && project.data.totalPage;

    const renderList = () => {
        return project?.data?.list?.map(projectItem => {
            const { _id, codeName, fullName } = projectItem;
            return <ItemRowProject
                key={_id}
                projectEdit={projectItem}
                currentId={_id}
                codeName={codeName}
                fullName={fullName}
                handleDelete={(id) => handleDelete(id)}
            />
        })
    }

    return (
        <React.Fragment>
            <ProjectCreateForm
                page={page}
                limit={limit}
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
                        <div className="dropdown pull-right" style={{ marginBottom: 15 }}>
                            <button type="button" className="btn btn-success dropdown-toggle pull-right" data-toggle="dropdown" aria-expanded="true" title={translate('project.add_btn_new')}>{translate('project.add_btn_new')}</button>
                            <ul className="dropdown-menu pull-right" style={{ marginTop: 0 }}>
                                <li><a style={{ cursor: 'pointer' }} onClick={handleOpenCreateForm} title={translate('project.add_btn_normal')}>
                                    {translate('project.add_btn_normal')}</a></li>
                                <li><a style={{ cursor: 'pointer' }} onClick={() => window.$('#modal-import-file-project-hooks').modal('show')} title={translate('project.add_btn_scheduling')}>
                                    {translate('project.add_btn_scheduling')}</a></li>
                            </ul>
                        </div>
                    </div>

                    {/* Danh sách các ví dụ */}
                    {/* <table id="project-table" className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th className="col-fixed" style={{ width: 60 }}>{translate('general.stt')}</th>
                                <th>{translate('project.code')}</th>
                                <th>{translate('project.name')}</th>
                                <th>{translate('project.description')}</th>
                                <th>{translate('project.startDate')}</th>
                                <th>{translate('project.endDate')}</th>
                                <th>{translate('project.parent')}</th>
                                <th>{translate('project.manager')}</th>
                                <th style={{ width: "120px", textAlign: "center" }}>{translate('table.action')}
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
                                lists.map((project, index) => (
                                    <tr key={index}>
                                        <td>{index + 1 + (page - 1) * limit}</td>
                                        <td>{project.code}</td>
                                        <td>{project.name}</td>
                                        <td>{project.description}</td>
                                        <td>{formatDate(project.startDate)}</td>
                                        <td>{formatDate(project.endDate)}</td>
                                        <td>{formatDate(project.endDate)}</td>
                                        <td>{project.projectManager && project.projectManager.map(o => o.name).join(", ")}</td>
                                        <td style={{ textAlign: "center" }}>
                                            <a className="edit text-green" style={{ width: '5px' }} title={translate('manage_example.detail_info_example')} onClick={() => handleShowDetailInfo(project)}><i className="material-icons">visibility</i></a>
                                            <a className="edit text-yellow" style={{ width: '5px' }} title={translate('manage_example.edit')} onClick={() => handleEdit(project)}><i className="material-icons">edit</i></a>
                                            <DeleteNotification
                                                content={translate('manage_example.delete')}
                                                data={{
                                                    id: project._id,
                                                    info: project.name
                                                }}
                                                func={handleDelete}
                                            />
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table> */}

                    {renderList()}

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
    getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany,
}

const connectedExampleManagementTable = connect(mapState, actions)(withTranslate(ListProject));
export { connectedExampleManagementTable as ListProject };