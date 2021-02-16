import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

import { DataTableSetting, DeleteNotification, PaginateBar } from "../../../common-components";

import ProjectCreateForm from "./createProject";
import ProjectEditForm from "./editProject";
// import { ExampleDetailInfo } from "./exampleDetailInfo";
// import { ExampleImportForm } from "./exampleImortForm";

import { ProjectActions } from "../redux/actions";
import { UserActions } from '../../super-admin/user/redux/actions';
function ListProject(props) {

    // Khởi tạo state
    const [state, setState] = useState({
        exampleName: "",
        page: 1,
        limit: 5,
    })

    const { project, translate, user } = props;
    const { projectName, page, limit, currentRow } = state;

    useEffect(() => {
        props.getProjects({ calledId: "paginate", page, limit });
        props.getProjects({ calledId: "all" });
        props.getAllUser();
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

        props.getProjects({
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
        props.deleteProject(id);
        props.getProjects({
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

    const handleShowDetailInfo = (id) => {
        setState({
            ...state,
            exampleId: id
        });

        window.$(`#modal-detail-info-example-hooks`).modal('show');
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
            <ProjectEditForm
                projectId={currentRow && currentRow._id}
                projectName={currentRow && currentRow.name}
                code={currentRow && currentRow.code}
                parent={currentRow && currentRow.parent}
            />
            {/* <ExampleDetailInfo
                exampleId={state.exampleId}
            /> */}
            <ProjectCreateForm
                page={page}
                limit={limit}
            />
            {/* <ExampleImportForm
                page={page}
                limit={limit}
            /> */}

            <div className="box-body qlcv">
                <div className="form-inline">
                    {/* Button thêm mới */}
                    <div className="dropdown pull-right" style={{ marginBottom: 15 }}>
                        <button type="button" className="btn btn-success dropdown-toggle pull-right" data-toggle="dropdown" aria-expanded="true" title="Thêm mới" >Thêm mới</button>
                        <ul className="dropdown-menu pull-right" style={{ marginTop: 0 }}>
                            <li><a style={{ cursor: 'pointer' }} onClick={() => window.$('#modal-import-file-project-hooks').modal('show')} title={translate('manage_example.add_multi_example')}>
                                {translate('human_resource.salary.add_import')}</a></li>
                            <li><a style={{ cursor: 'pointer' }} onClick={handleOpenCreateForm} title={translate('manage_example.add_one_example')}>
                                {translate('manage_example.add_example')}</a></li>
                        </ul>
                    </div>

                    {/* Tìm kiếm */}
                    <div className="form-group">
                        <label className="form-control-static">{translate('manage_example.exampleName')}</label>
                        <input type="text" className="form-control" name="exampleName" onChange={handleChangeProjectName} placeholder={translate('manage_example.exampleName')} autoComplete="off" />
                    </div>
                    <div className="form-group">
                        <button type="button" className="btn btn-success" title={translate('manage_example.search')} onClick={() => handleSubmitSearch()}>{translate('manage_example.search')}</button>
                    </div>
                </div>

                {/* Danh sách các ví dụ */}
                <table id="project-table" className="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th className="col-fixed" style={{ width: 60 }}>{translate('manage_example.index')}</th>
                            <th>{translate('manage_example.exampleName')}</th>
                            <th>{translate('manage_example.description')}</th>
                            <th>Mã số</th>
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
                                    <td>{project.name}</td>
                                    <td>{project.description}</td>
                                    <td>{project.code}</td>
                                    <td style={{ textAlign: "center" }}>
                                        <a className="edit text-green" style={{ width: '5px' }} title={translate('manage_example.detail_info_example')} onClick={() => handleShowDetailInfo(project._id)}><i className="material-icons">visibility</i></a>
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
        </React.Fragment>
    )
}

function mapState(state) {
    const { project, user } = state;

    return { project, user }
}
const actions = {
    getProjects: ProjectActions.getProjects,
    deleteProject: ProjectActions.deleteProject,


    getAllUser: UserActions.get,

}

const connectedExampleManagementTable = connect(mapState, actions)(withTranslate(ListProject));
export { connectedExampleManagementTable as ListProject };