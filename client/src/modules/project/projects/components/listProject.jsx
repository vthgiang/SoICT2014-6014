import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { TreeTable, PaginateBar, ToolTip, SelectMulti } from "../../../../common-components";
import ProjectCreateForm from "./createProject";
import ProjectEditForm from './editProject';
import ProjectDetailForm from './detailProject';
import { ProjectActions } from '../redux/actions';
import { UserActions } from '../../../super-admin/user/redux/actions';
import { getStorage } from "../../../../config";
import { checkIfAbleToCRUDProject, renderLongList, renderProjectTypeText } from "./functionHelper";
import { taskManagementActions } from "../../../task/task-management/redux/actions";
import _cloneDeep from 'lodash/cloneDeep';
import Swal from 'sweetalert2';

function ListProject(props) {
    const tableId = 'project-table';
    // Khởi tạo state
    const [state, setState] = useState({
        projectName: "",
        projectType: "",
        page: 1,
        creatorEmployee: null,
        responsibleEmployees: null,
        projectManager: null,
        perPage: 5,
        currentRow: null,
        projectDetail: null,
        data: [],
    })
    const { project, translate, user, tasks } = props;
    const userId = getStorage("userId");
    const { projectName, projectType, page, creatorEmployee, responsibleEmployees, projectManager, perPage, currentRow, projectDetail, data } = state;

    useEffect(() => {
        props.getProjectsDispatch({ calledId: "paginate", page, perPage, userId, projectName });
        props.getProjectsDispatch({ calledId: "user_all", userId });
        props.getAllUserInAllUnitsOfCompany();
    }, [])

    useEffect(() => {
        let data = [];
        if (user?.isLoading === false && project?.isLoading === false) {
            let currentProjects = _cloneDeep(project.data.paginate); // Sao chép ra mảng mới
            for (let n in currentProjects) {
                data[n] = {
                    ...currentProjects[n],
                    rawData:currentProjects[n],
                    name: currentProjects[n]?.name,
                    projectType: translate(renderProjectTypeText(currentProjects[n]?.projectType)),
                    creator: currentProjects[n]?.creator?.name,
                    manager: currentProjects[n]?.projectManager ? <ToolTip dataTooltip={currentProjects[n]?.projectManager.map(o => o.name)} /> : null,
                    member: currentProjects[n]?.responsibleEmployees ? <ToolTip dataTooltip={currentProjects[n]?.responsibleEmployees.map(o => o.name)} /> : null,
                    action: ["view"]
                }
                if(checkIfAbleToCRUDProject({ project, user, currentProjectId: currentProjects[n]._id })) {
                    data[n] = { ...data[n], action: ["view", "edit", "delete"] }
                }
            }

            setState({
                ...state,
                data: data
            })
        }
    }, [user?.isLoading, project?.isLoading])
    

    // Sau khi add project mới hoặc edit project thì call lại tất cả list project
    const handleAfterCreateProject = () => {
        props.getProjectsDispatch({ calledId: "paginate", page, perPage, userId, projectName });
    }

    // Thay đổi tên dự án
    const handleChangeName = (e) => {
        const { value } = e.target;
        setState({
            ...state,
            projectName: value
        });
    }

    // Thay đổi hình thức quản lý dự án
    const handleSelectProjectType = (value) => {
        setState({
            ...state,
            projectType: value
        });
    }

    // Thay đổi thành viên tham gia
    const handleChangeMember = (e) => {
        const { value } = e.target;
        setState({
            ...state,
            responsibleEmployees: value,
        })
    }

    // Thay đổi người quản lý
    const handleChangeManager = (e) => {
        const { value } = e.target;
        setState({
            ...state,
            projectManager: value,
        })
    }

    // Thay đổi người thiết lập
    const handleChangeCreator = (e) => {
        const { value } = e.target;
        setState({
            ...state,
            creatorEmployee: value,
        })
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

    // Hiển thị thông tin dự án
    const handleShowDetailInfo = (id) => {
        setState({
            ...state,
            projectDetail: project.data.paginate.find(p => p?._id === id)
        });
        props.getAllTasksByProject(id);
        setTimeout(() => {
            window.$(`#modal-detail-project-${id}`).modal('show');
        }, 10);
    }

    // Mở modal thay đổi thông tin
    const handleEdit = (id) => {
        setState({
            ...state,
            currentRow: project.data.paginate.find(p => p?._id === id)
        })
        setTimeout(() => {
            window.$(`#modal-edit-project-${id}`).modal('show')
        }, 10);
    }

    // Xoá dự án
    const handleDelete = (id) => {
        let currentProject = project.data.paginate.find(p => p?._id === id)
        Swal.fire({
            title: `Bạn có chắc chắn muốn xóa dự án "${currentProject.name}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: props.translate('general.no'),
            confirmButtonText: props.translate('general.yes'),
        }).then((result) => {
            if (result.value) {
                props.deleteProjectDispatch(id);
                props.getProjectsDispatch({
                    projectName,
                    perPage,
                    page: project && project.lists && project.lists.length === 1 ? page - 1 : page
                });
            }
        }) 
    }

    // Mở modal tạo dự án
    const handleOpenCreateForm = () => {
        window.$('#modal-create-project').modal('show')
    }

    const handleUpdateData = () => {
        let data = {
            calledId: 'paginate',
            projectName: projectName,
            projectType: projectType,
            page: 1,
            perPage: perPage,
            creatorEmployee: creatorEmployee,
            responsibleEmployees: responsibleEmployees,
            projectManager: projectManager,
            userId: userId
        }

        props.getProjectsDispatch(data);
        setState({
            ...state,
            page: 1
        })
    }

    // Khởi tạo danh sách các cột
    let column = [
        { name: translate('project.name'), key: "name" },
        { name: translate('project.projectType'), key: "projectType" },
        { name: translate('project.creator'), key: "creator" },
        { name: translate('project.manager'), key: "manager" },
        { name: translate('project.member'), key: "member" },
    ];

    const totalPage = project && Math.ceil(project.data.totalDocs / perPage);

    return (
        <React.Fragment>
            <ProjectDetailForm
                projectDetailId={projectDetail && projectDetail._id}
                projectDetail={projectDetail}
                currentProjectTasks={tasks && tasks.tasksByProject}
            />

            <ProjectEditForm
                currentProjectTasks={tasks && tasks.tasksByProject}
                projectEditId={currentRow && currentRow._id}
                projectEdit={currentRow}
                handleAfterCreateProject={handleAfterCreateProject}
            />
            <ProjectCreateForm
                handleAfterCreateProject={handleAfterCreateProject}
            />

            <div className="box">
                <div className="box-body qlcv">
                    <div style={{ height: "40px", display: 'flex', justifyContent: 'space-between' }}>
                        {/* Lọc */}
                        <div>
                            <button className="btn btn-primary" type="button" style={{ borderRadius: 0, marginLeft: 10, backgroundColor: 'transparent', borderRadius: '4px', color: '#367fa9' }} onClick={() => { window.$('#projects-filter').slideToggle() }}><i className="fa fa-filter"></i> {translate('general.filter')} </button>
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

                    <div id="projects-filter" className="form-inline" style={{ display: 'none' }}>
                        {/* Tên dự án */}
                        <div className="form-group">
                            <label>{translate('project.name')}</label>
                            <input className="form-control" type="text" placeholder={translate('project.search_by_name')} name="name" onChange={(e) => handleChangeName(e)} />
                        </div>

                        {/* Hình thức quản lý */}
                        <div className="form-group">
                            <label>{translate('project.projectType')}</label>
                            <SelectMulti id="multiSelectProjectType" defaultValue={[
                                translate('project.cpm'),
                                translate('project.simple')
                            ]}
                                items={[
                                    { value: "2", text: translate('project.cpm') },
                                    { value: "1", text: translate('project.simple') },
                                ]}
                                onChange={handleSelectProjectType}
                                options={{ nonSelectedText: translate('project.select_type'), allSelectedText: translate('project.select_all_type') }}>
                            </SelectMulti>
                        </div>

                        {/* Thành viên dự án */}
                        <div className="form-group">
                            <label>{translate('project.member')}</label>
                            <input className="form-control" type="text" placeholder={translate('project.search_by_employees')} name="name" onChange={(e) => handleChangeMember(e)} />
                        </div>

                        {/* Người quản trị */}
                        <div className="form-group">
                            <label>{translate('project.manager')}</label>
                            <input className="form-control" type="text" placeholder={translate('project.search_by_employees')} name="name" onChange={(e) => handleChangeManager(e)} />
                        </div>

                        {/* Người tạo dự án */}
                        <div className="form-group">
                            <label>{translate('project.creator')}</label>
                            <input className="form-control" type="text" placeholder={translate('project.search_by_employees')} name="name" onChange={(e) => handleChangeCreator(e)} />
                        </div>

                        <div className="form-group">
                            <label></label>
                            <button type="button" className="btn btn-success" onClick={() => handleUpdateData()}>{translate('project.search')}</button>
                        </div>

                    </div>
                    {/* Danh sách các dự án */}
                    <div className="qlcv StyleScrollDiv StyleScrollDiv-y" style={{ maxHeight: '600px' }}>
                        <TreeTable
                            behaviour="show-children"
                            tableSetting={true}
                            tableId='list-project-table'
                            viewWhenClickName={true}
                            column={column}
                            data={data}
                            onSetNumberOfRowsPerPage={setLimit}
                            titleAction={{
                                view: '',
                                edit: '',
                                delete: '',
                            }}
                            funcView={handleShowDetailInfo}
                            funcEdit={handleEdit}
                            funcDelete={handleDelete}
                        />
                    </div>
                    {/* <table id={tableId} className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>{translate('project.name')}</th>
                                <th>Hình thức quản lý</th>
                                <th>{translate('project.creator')}</th>
                                <th>{translate('project.manager')}</th>
                                <th>{translate('project.member')}</th>
                                <th style={{ width: "120px", textAlign: "center" }}>
                                    {translate('table.action')}
                                    <DataTableSetting
                                        tableId={tableId}
                                        columnArr={[
                                            translate('project.name'),
                                            'Hình thức quản lý',
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
                                lists.map((projectItem, index) => {
                                    // console.log('projectItem?.creator?.name', projectItem?.creator?.name, 'projectItem?.responsibleEmployees', projectItem?.responsibleEmployees);
                                    return (
                                        <tr key={index}>
                                            <td style={{ color: '#385898' }}>{projectItem?.name}</td>
                                            <td>{renderProjectTypeText(projectItem?.projectType)}</td>
                                            <td>{projectItem?.creator?.name}</td>
                                            <td>{projectItem?.projectManager.map(o => o.name).join(", ")}</td>
                                            <td style={{ maxWidth: 450 }}>{renderLongList(projectItem?.responsibleEmployees.map(o => o.name))}</td>
                                            <td style={{ textAlign: "center" }}>
                                                <a className="edit text-green" style={{ width: '5px' }} onClick={() => handleShowDetailInfo(projectItem?._id)}><i className="material-icons">visibility</i></a>
                                                {checkIfAbleToCRUDProject({ project, user, currentProjectId: projectItem._id }) && <a className="edit text-yellow" style={{ width: '5px' }} onClick={() => handleEdit(projectItem?._id)}><i className="material-icons">edit</i></a>}
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
                                    )
                                }
                                )
                            }
                        </tbody>
                    </table> */}

                    {/* PaginateBar */}

                    <PaginateBar
                        pageTotal={totalPage ? totalPage : 0}
                        currentPage={page}
                        display={data && data.length !== 0 && data.length}
                        total={project && project.data.totalDocs}
                        func={setPage}
                    />
                </div>
            </div>
        </React.Fragment>
    )
}

function mapState(state) {
    const { project, user, tasks } = state;
    return { project, user, tasks }
}
const actions = {
    getProjectsDispatch: ProjectActions.getProjectsDispatch,
    deleteProjectDispatch: ProjectActions.deleteProjectDispatch,
    createProjectDispatch: ProjectActions.createProjectDispatch,
    getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany,
    getAllTasksByProject: taskManagementActions.getAllTasksByProject,
}

const connectedExampleManagementTable = connect(mapState, actions)(withTranslate(ListProject));
export { connectedExampleManagementTable as ListProject };