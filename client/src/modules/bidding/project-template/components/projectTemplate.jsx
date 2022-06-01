import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { DataTableSetting, DeleteNotification, PaginateBar } from "../../../../common-components";
import { ProjectTemplateActions } from '../redux/actions';
import { UserActions } from '../../../super-admin/user/redux/actions';
import { getStorage } from "../../../../config";
import { renderLongList } from "./functionHelper";
import { taskManagementActions } from "../../../task/task-management/redux/actions";
import CreateProjectTemplateForm from "./createProjectTemplate";
import EditProjectTemplateForm from "./editProjectTemplate";

function ProjectTemplateManage(props) {
    const tableId = 'project-template-table';
    // Khởi tạo state
    const [state, setState] = useState({
        searchName: "",
        page: 1,
        perPage: 5,
        currentRow: null,
        projectTemplateDetail: null,
    })
    const { projectTemplate, translate, user, tasks } = props;
    const userId = getStorage("userId");
    const { searchName, page, perPage, currentRow, projectDetail } = state;

    useEffect(() => {
        props.getProjectTemplateDispatch({ calledId: "paginate", page, perPage, userId, searchName });
        // props.getProjectTemplateDispatch({ calledId: "user_all", userId });
        props.getAllUserInAllUnitsOfCompany();
    }, [])

    // Sau khi add project mới hoặc edit project thì call lại tất cả list project
    const handleAfterCreateProject = () => {
        props.getProjectTemplateDispatch({ calledId: "paginate", page, perPage, userId, searchName });
        // props.getProjectTemplateDispatch({ calledId: "user_all", userId });
    }

    const handleChangeSearchName = (e) => {
        const { value } = e.target;
        setState({
            ...state,
            searchName: value
        });
    }

    const handleSubmitSearch = () => {
        props.getProjectTemplateDispatch({ calledId: "paginate", page: 1, perPage, userId, searchName });
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

        props.getProjectTemplateDispatch({ calledId: "paginate", page: parseInt(pageNumber), perPage, userId, searchName });
    }

    const setLimit = (number) => {
        setState({
            ...state,
            perPage: parseInt(number),
            page: 1
        });
        props.getProjectTemplateDispatch({ calledId: "paginate", page: 1, perPage: parseInt(number), userId, searchName });
    }

    const handleShowDetailInfo = (item) => {
        setState({
            ...state,
            projectDetail: item
        });
        props.getTasksByProject(item?._id);
        setTimeout(() => {
            window.$(`#modal-detail-project-template-${item?._id}`).modal('show');
        }, 10);
    }

    const handleEdit = (item) => {
        setState({
            ...state,
            currentRow: item
        })
        setTimeout(() => {
            window.$(`#modal-edit-project-template-${item?._id}`).modal('show')
        }, 10);
    }

    const handleDelete = (id) => {
        props.deleteProjectTemplateDispatch(id);
        props.getProjectTemplateDispatch({
            searchName,
            perPage,
            page: projectTemplate && projectTemplate.lists && projectTemplate.lists.length === 1 ? page - 1 : page
        });
    }

    const handleOpenCreateForm = () => {
        window.$('#modal-create-project-template').modal('show')
    }

    let lists = [];
    if (projectTemplate) {
        lists = projectTemplate.list
    }

    const totalPage = projectTemplate && projectTemplate.totalItems;

    return (
        <React.Fragment>
            {/* <ProjectDetailForm
                projectDetailId={projectDetail && projectDetail._id}
                projectDetail={projectDetail}
                currentProjectTasks={tasks && tasks.tasksbyproject}
            /> */}

            <EditProjectTemplateForm
                projectEditId={currentRow && currentRow._id}
                projectEdit={currentRow}
                handleAfterCreateProject={handleAfterCreateProject}
            />
            <CreateProjectTemplateForm
                handleAfterCreateProject={handleAfterCreateProject}
            />

            <div className="box">
                <div className="box-body qlcv">
                    <div className="form-inline">
                        {/* Tìm kiếm */}
                        <div className="form-group">
                            <label className="form-control-static">Tên mẫu dự án</label>
                            <input type="text" className="form-control" name="projectTemplateName" onChange={handleChangeSearchName} placeholder={"Tên mẫu dự án"} autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <button type="button" className="btn btn-success" title={translate('manage_example.search')} onClick={() => handleSubmitSearch()}>{translate('manage_example.search')}</button>
                        </div>

                        {/* Button thêm mới */}
                        <div className="dropdown pull-right" style={{ marginTop: 5 }}>
                            <button type="button" className="btn btn-success dropdown-toggle pull-right"
                                onClick={handleOpenCreateForm}
                                data-toggle="dropdown" aria-expanded="true" title={"Thêm mới mẫu dự án"}>
                                {"Thêm mới mẫu dự án"}
                            </button>
                        </div>

                    </div>

                    <table id={tableId} className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>Tên mẫu</th>
                                <th>Số lần sử dụng</th>
                                <th>Người tạo</th>
                                <th>Người quản lý</th>
                                <th>Thành viên</th>
                                <th style={{ width: "120px", textAlign: "center" }}>
                                    {translate('table.action')}
                                    <DataTableSetting
                                        tableId={tableId}
                                        columnArr={[
                                            "Tên mẫu",
                                            'Số lần sử dụng',
                                            'Người tạo',
                                            'Người quản lý',
                                            'Thành viên',
                                        ]}
                                        setLimit={setLimit}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {(lists && lists.length !== 0) &&
                                lists.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{item?.name}</td>
                                            <td>{item?.numberOfUse}</td>
                                            <td>{item?.creator?.name}</td>
                                            <td>{item?.projectManager.map(o => o.name).join(", ")}</td>
                                            <td style={{ maxWidth: 450 }}>{renderLongList(item?.responsibleEmployees.map(o => o.name))}</td>
                                            <td style={{ textAlign: "center" }}>
                                                <a className="edit text-green" style={{ width: '5px' }} onClick={() => handleShowDetailInfo(item)}><i className="material-icons">visibility</i></a>
                                                {<a className="edit text-yellow" style={{ width: '5px' }} onClick={() => handleEdit(item)}><i className="material-icons">edit</i></a>}
                                                {<DeleteNotification
                                                    content={translate('project.delete')}
                                                    data={{
                                                        id: item?._id,
                                                        info: item?.name
                                                    }}
                                                    func={handleDelete}
                                                />}
                                            </td>
                                        </tr>
                                    )
                                }
                                )
                            }
                        </tbody>
                    </table>

                    {/* PaginateBar */}
                    {projectTemplate && projectTemplate.isLoading ?
                        <div className="table-info-panel">{translate('confirm.loading')}</div> :
                        (!lists || lists.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }
                    <PaginateBar
                        pageTotal={totalPage ? totalPage : 0}
                        currentPage={page}
                        display={lists && lists.length !== 0 && lists.length}
                        total={projectTemplate && projectTemplate.totalItems}
                        func={setPage}
                    />
                </div>
            </div>
        </React.Fragment>
    )
}

function mapState(state) {
    const { projectTemplate, user, tasks } = state;
    return { projectTemplate, user, tasks }
}
const actions = {
    getProjectTemplateDispatch: ProjectTemplateActions.getProjectTemplateDispatch,
    deleteProjectTemplateDispatch: ProjectTemplateActions.deleteProjectTemplateDispatch,
    createProjectTemplateDispatch: ProjectTemplateActions.createProjectTemplateDispatch,
    getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany,
    getTasksByProject: taskManagementActions.getTasksByProject,
}

const connectedProjectTemplateManager = connect(mapState, actions)(withTranslate(ProjectTemplateManage));
export { connectedProjectTemplateManager as ProjectTemplateManage };