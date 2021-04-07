import React, { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from "react-redux-multilingual";

import { PaginateBar, SelectMulti, DataTableSetting, ConfirmNotification, ExportExcel } from '../../../../../common-components';

import { ModalEditTaskProcess } from './modalEditTaskProcess'
import { ModalCreateTaskProcess } from './modalCreateTaskProcess'
import { ModalViewTaskProcess } from './modalViewTaskProcess';
import { ModalCreateTaskByProcessTemplate } from './modalCreateTaskByProcessTemplate';

import { TaskProcessActions } from '../../redux/actions';
import { RoleActions } from '../../../../super-admin/role/redux/actions';
import { DepartmentActions } from '../../../../super-admin/organizational-unit/redux/actions';
import { FormImportProcessTemplate } from './formImportProcessTemplate';
import Swal from 'sweetalert2';
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration'
import { getStorage } from '../../../../../config';

function ProcessTemplate(props) {
    const TableId = "table-process-template";
    const defaultConfig = { limit: 5 }
    const Limit = getTableConfiguration(TableId, defaultConfig).limit;
    let currentRole = getStorage("currentRole");

    const [state, setState] = useState({
        currentRow: {},
        pageNumber: 1,
        noResultsPerPage: Limit,
        tableId: TableId,
        currentRole: currentRole,
        NameSerach:""
    })
    useEffect(() => {
        props.getAllDepartments()
        props.getAllXmlDiagram(state.pageNumber, state.noResultsPerPage, "");
        props.getRoles();
    }, [])
    const handleChangeNameSerach=(e)=>{
        setState({
            ...state,
            NameSerach:e.target.value
        })
    }
    const checkHasComponent = (name) => {
        var { auth } = props;
        var result = false;
        auth.components.forEach(component => {
            if (component.name === name) result = true;
        });
        return result;
    }
    const showEditProcess = async (item) => {
        setState({
            ...state,
            currentRow: item,
        });
        window.$(`#modal-edit-process`).modal("show");
    }

    const deleteDiagram = async (xmlId) => {
        props.deleteXmlDiagram(xmlId, state.pageNumber, state.noResultsPerPage, "");
    }

    const viewProcess = async (item) => {
        await setState({
            ...state,
            currentRow: item,
        });
        await window.$(`#modal-view-process-task`).modal("show");
    }
    const showModalCreateProcess = async () => {
        await setState({
            ...state,
            showmodalCreateProcess: true
        });
        window.$(`#modal-create-process-task`).modal("show");
    }

    const handImportFile = async () => {
        await setState({
            ...state,
            showModalImportProcess: true
        });
        window.$(`#modal-import-process-task`).modal("show");
    }

    const showModalCreateTask = async (item) => {
        await setState({
            ...state,
            showModalCreateTask: true,
            currentRow: item,
        });
        window.$(`#modal-create-task-by-process-template`).modal("show");
    }
    const showCreateTask = (item) => {
        setState({
            ...state,
            template: item
        });
        window.$(`#modal-create-task`).modal('show')
    }
    const setPage = async (pageTotal) => {
        let oldCurrentPage = state.pageNumber;
        await setState(state => {
            return {
                ...state,
                pageNumber: pageTotal
            }
        })
        let newCurrentPage = state.pageNumber;
        props.getAllXmlDiagram(pageTotal, state.noResultsPerPage, "");
    }
    const setLimit = (pageTotal) => {
        if (pageTotal !== state.noResultsPerPage) {
            setState({
                ...state,
                noResultsPerPage: pageTotal
            })
            props.getAllXmlDiagram(1, pageTotal, state.NameSerach);
        }
    }

    /**
     * convert data export
     */
    const convertDataExport = (dataExport) => {
        let datas = [];

        for (let idx = 0; idx < dataExport.length; idx++) {
            let dataItem = dataExport[idx];
            let taskList = dataExport[idx].tasks;
            let lengthOfTask = 0;

            for (let k = 0; k < taskList?.length; k++) {
                let x = taskList[k];
                let length = 0;
                let actionName = [], actionDescription = [], mandatory = [];

                if (x.taskActions && x.taskActions.length > 0) {
                    if (x.taskActions.length > length) {
                        length = x.taskActions.length;
                    }
                    for (let i = 0; i < x.taskActions.length; i++) {
                        actionName[i] = x.taskActions[i].name;
                        actionDescription[i] = x.taskActions[i].description;
                        if (x.taskActions[i].mandatory) {
                            mandatory[i] = "true";
                        } else {
                            mandatory[i] = "false";
                        }
                    }
                }
                let infomationName = [], type = [], infomationDescription = [], filledByAccountableEmployeesOnly = [];
                if (x.taskInformations && x.taskInformations.length !== 0) {
                    if (x.taskInformations.length > length) {
                        length = x.taskInformations.length;
                    }
                    for (let i = 0; i < x.taskInformations.length; i++) {
                        infomationName[i] = x.taskInformations[i].name;
                        infomationDescription[i] = x.taskInformations[i].description;
                        type[i] = x.taskInformations[i].type;
                        filledByAccountableEmployeesOnly[i] = x.taskInformations[i].filledByAccountableEmployeesOnly;
                    }
                }
                let code = '';
                if (x.code !== 0) {
                    code = x.code;
                }
                let responsibleEmployees, accountableEmployees, consultedEmployees, informedEmployees;

                if (Array.isArray(x.responsibleEmployees)) {
                    responsibleEmployees = x.responsibleEmployees.map(x => x?.email).join(', ');
                } else {
                    responsibleEmployees = x.responsibleEmployees.name;
                }
                if (Array.isArray(x.accountableEmployees)) {
                    accountableEmployees = x.accountableEmployees.map(x => x?.email).join(', ');
                } else {
                    accountableEmployees = x.accountableEmployees.name;
                }
                if (Array.isArray(x.consultedEmployees)) {
                    consultedEmployees = x.consultedEmployees.map(x => x?.email).join(', ');
                } else {
                    consultedEmployees = x.consultedEmployees.name;
                }
                if (Array.isArray(x.informedEmployees)) {
                    informedEmployees = x.informedEmployees.map(x => x?.email).join(', ');
                } else {
                    informedEmployees = x.informedEmployees.name;
                }
                let generalData;
                if (k === 0) {
                    generalData = {
                        STT: idx + 1,
                        processName: dataItem.processName,
                        processDescription: dataItem.processDescription,
                        manager: dataItem.manager.map(x => x?.name).join(', '),
                        viewer: dataItem.viewer.map(x => x?.name).join(', '),
                        xmlDiagram: dataItem.xmlDiagram,
                    }
                } else {
                    generalData = {
                        STT: "",
                        processName: "",
                        processDescription: "",
                        manager: "",
                        viewer: "",
                        xmlDiagram: "",
                    }
                }
                let out = {
                    STT: generalData.STT,
                    processName: generalData.processName,
                    processDescription: generalData.processDescription,
                    manager: generalData.manager,
                    viewer: generalData.viewer,
                    xmlDiagram: generalData.xmlDiagram,

                    taskName: x.name,
                    taskDescription: x.description,
                    code: code,
                    responsibleEmployees: responsibleEmployees,
                    accountableEmployees: accountableEmployees,
                    consultedEmployees: consultedEmployees,
                    informedEmployees: informedEmployees,
                    organizationalUnit: x.organizationalUnit? x.organizationalUnit.name:"",
                    collaboratedWithOrganizationalUnits: x.collaboratedWithOrganizationalUnits.map(e => e?.name).join(', '),
                    priority: x.priority,
                    formula: x.formula,

                    actionName: actionName[0],
                    actionDescription: actionDescription[0],
                    mandatory: mandatory[0],

                    infomationName: infomationName[0],
                    infomationDescription: infomationDescription[0],
                    type: type[0],
                    filledByAccountableEmployeesOnly: filledByAccountableEmployeesOnly[0]
                }

                datas = [...datas, out];

                if (length > 1) {
                    for (let i = 1; i < length; i++) {
                        out = {
                            STT: "",
                            processName: "",
                            processDescription: "",
                            manager: "",
                            viewer: "",
                            xmlDiagram: "",

                            taskName: "",
                            taskDescription: "",
                            code: "",
                            creator: "",
                            responsibleEmployees: "",
                            accountableEmployees: "",
                            consultedEmployees: "",
                            informedEmployees: "",
                            organizationalUnit: "",
                            collaboratedWithOrganizationalUnits: "",
                            priority: "",
                            formula: "",

                            actionName: actionName[i],
                            actionDescription: actionDescription[i],
                            mandatory: mandatory[i],

                            infomationName: infomationName[i],
                            infomationDescription: infomationDescription[i],
                            type: type[i],
                            filledByAccountableEmployeesOnly: filledByAccountableEmployeesOnly[i]
                        };
                        lengthOfTask = lengthOfTask + length;
                        datas = [...datas, out];
                    }

                }
            }
        }

        let res = {
            fileName: "Danh sách quy trình mẫu",
            dataSheets: [{
                sheetName: "Sheet1",
                sheetTitle: 'Danh sách mẫu quy trình',
                tables: [{
                    rowHeader: 3,
                    merges: [{
                        key: "generalInfoTask",
                        columnName: "Thông tin chung",
                        keyMerge: 'taskName',
                        colspan: 11,
                    }, {
                        key: "taskActions",
                        columnName: "Danh sách hoạt động",
                        keyMerge: 'actionName',
                        colspan: 3,
                    }, {
                        key: "taskInfomations",
                        columnName: "Danh sách thông tin",
                        keyMerge: 'infomationName',
                        colspan: 4,
                    }, {
                        key: "tasks",
                        columnName: "Danh sách công việc",
                        keyMerge: 'generalInfoTask',
                        colspan: 18,
                    }],
                    columns: [
                        { key: "STT", value: "STT" },
                        { key: "processName", value: "Tên mẫu quy trình" },
                        { key: "processDescription", value: "Mô tả mẫu quy trình" },
                        { key: "manager", value: "Người quản lý quy trình" },
                        { key: "viewer", value: "Người được xem quy trình" },
                        { key: "xmlDiagram", value: "Biểu đồ quy trình" },

                        { key: "taskName", value: "Tên công việc" },
                        { key: "code", value: "Mã công việc trong quy trình" },
                        { key: "taskDescription", value: "Mô tả công việc" },
                        { key: "organizationalUnit", value: "Đơn vị" },
                        { key: "collaboratedWithOrganizationalUnits", value: "Đơn vị phối hợp thực hiện công việc" },
                        { key: "priority", value: "Độ ưu tiên" },
                        { key: "responsibleEmployees", value: "Người thực hiện" },
                        { key: "accountableEmployees", value: "Người phê duyệt" },
                        { key: "consultedEmployees", value: "Người tư vấn" },
                        { key: "informedEmployees", value: "Người quan sát" },
                        { key: "formula", value: "Công thức tính điểm" },

                        { key: "actionName", value: "Tên hoạt động" },
                        { key: "actionDescription", value: "Mô tả hoạt động" },
                        { key: "mandatory", value: "Bắt buộc" },

                        { key: "infomationName", value: "Tên thông tin" },
                        { key: "infomationDescription", value: "Mô tả thông tin" },
                        { key: "type", value: "Kiểu dữ liệu" },
                        { key: "filledByAccountableEmployeesOnly", value: "Chỉ quản lý được điền" }
                    ],
                    // Do ở file export, dữ liệu được đọc theo dòng nên đối với dữ liệu mảng (taskAction, taskInfomation), mỗi phần tử của mảng là 1 dòng
                    data: datas
                }]
            }]
        }

        return res;
    }

    /**
     * Hàm kiểm tra phân quyền quản lý quy trình
     * @param {Object} itemProcess quy trình cần xét
     * @returns kết quả kiểm tra có phải là người quản lý hay k
     */
    const isManager = (itemProcess) => {
        let { currentRole } = state;
        let check = false;
        let manager = itemProcess.manager;
        for (let x in manager) {
            if (String(manager[x].id) === String(currentRole)) {
                check = true;
            }
        }
        return check;
    }
    const handleUpdateData = () =>{
        props.getAllXmlDiagram(state.pageNumber, state.noResultsPerPage, state.NameSerach);
    }

    const { translate, taskProcess, department } = props
    const { showmodalCreateProcess, currentRow, showModalImportProcess, tableId } = state
    let listDiagram = [];
    if (taskProcess && taskProcess.xmlDiagram) {
        listDiagram = taskProcess.xmlDiagram.filter((item) => {
            return listDiagram.find(e => e._id === item._id) ? '' : listDiagram.push(item)
        });
    }
    let exportData = convertDataExport([]);
    if (listDiagram && listDiagram.length !== 0) {
        exportData = convertDataExport(listDiagram);
    }
// console.log("");
    let totalPage = taskProcess.totalPage
    let listOrganizationalUnit = department?.list
    return (
        <div className="box">
            <div className="box-body qlcv">
                {
                    state.currentRow !== undefined &&
                    <ModalViewTaskProcess
                        title={translate("task.task_process.view_process_template_modal")}
                        listOrganizationalUnit={listOrganizationalUnit}
                        data={currentRow}
                        idProcess={currentRow._id}
                        xmlDiagram={currentRow.xmlDiagram}
                        processName={currentRow.processName}
                        processDescription={currentRow.processDescription}
                        infoTask={currentRow.taskList}
                        creator={currentRow.creator}
                    />
                }
                {
                    state.currentRow !== undefined &&
                    <ModalEditTaskProcess
                        title={translate("task.task_process.edit_modal")}
                        data={currentRow}
                        listOrganizationalUnit={listOrganizationalUnit}
                        idProcess={currentRow._id}
                        xmlDiagram={currentRow.xmlDiagram}
                        processName={currentRow.processName}
                        processDescription={currentRow.processDescription}
                        infoTask={currentRow.taskList}
                        creator={currentRow.creator}

                        pageNumber={state.pageNumber}
                        noResultsPerPage={state.noResultsPerPage}
                        name={""}
                    />
                }
                {
                    state.currentRow !== undefined &&
                    <ModalCreateTaskByProcessTemplate
                        title={translate("task.task_process.add_task_process_modal")}
                        data={currentRow}
                        listOrganizationalUnit={listOrganizationalUnit}
                        idProcess={currentRow._id}
                        xmlDiagram={currentRow.xmlDiagram}
                        processName={currentRow.processName}
                        processDescription={currentRow.processDescription}
                        infoTask={currentRow.taskList}
                        creator={currentRow.creator}
                    />
                }
                {checkHasComponent('create-task-process-button') &&
                    <React.Fragment>
                        {/* <div className="pull-right">
                                <button className="btn btn-success" onClick={() => { showModalCreateProcess() }}>
                                    {translate("task.task_process.create")}
                                </button>
                            </div> */}

                        {/* nút export excel */}
                        {<ExportExcel id="export-process-template" exportData={exportData} style={{ marginLeft: 5, marginTop: 5 }} />}
                        {/* Button thêm mới */}
                        <div className="dropdown pull-right" style={{ marginTop: 5 }}>
                            <button type="button" className="btn btn-success dropdown-toggler pull-right" data-toggle="dropdown" aria-expanded="true" title='Thêm'>{translate('task_template.add')}</button>
                            <ul className="dropdown-menu pull-right">
                                <li><a href="#modal-add-task-template" title="ImportForm" onClick={(event) => { showModalCreateProcess(event) }}>{translate('task_template.add')}</a></li>
                                <li><a href="#modal_import_file" title="ImportForm" onClick={(event) => { handImportFile(event) }}>Thêm file</a></li>
                            </ul>
                        </div>
                        {
                            showmodalCreateProcess &&
                            <ModalCreateTaskProcess
                                listOrganizationalUnit={listOrganizationalUnit}
                                title={translate("task.task_process.add_modal")}
                            />
                        }
                        {
                            showModalImportProcess &&
                            <FormImportProcessTemplate
                                listOrganizationalUnit={listOrganizationalUnit}
                                title={translate("task.task_process.add_modal")}
                            />
                        }
                    </React.Fragment>
                }
                <div className="form-inline">
                    <div className="form-group">
                        <label className="form-control-static">{translate('task_template.name')}</label>
                        <input className="form-control" type="text" onChange={handleChangeNameSerach} placeholder={translate('task_template.search_by_name')}
                        // ref={input => name = input}
                        />
                        <button type="button" className="btn btn-success" title={translate('task_template.search')} onClick={handleUpdateData}>{translate('task_template.search')}</button>
                    </div>
                </div>

                <DataTableSetting
                    tableId={tableId}
                    columnArr={[
                        translate("task.task_process.process_name"),
                        translate('task_template.description'),
                        translate('task_template.creator'),
                    ]}
                    setLimit={setLimit}
                />
                <table className="table table-bordered table-striped table-hover" id={tableId}>
                    <thead>
                        <tr>
                            <th title={translate('task_template.tasktemplate_name')}>{translate('task_template.tasktemplate_name')}</th>
                            <th title={translate('task_template.description')}>{translate('task_template.description')}</th>
                            <th title={translate('task.task_process.num_task')}>{translate('task.task_process.num_task')}</th>
                            <th title={translate('task.task_process.manager')}>{translate('task.task_process.manager')}</th>
                            <th title={translate('task_template.creator')}>{translate('task_template.creator')}</th>
                            <th style={{ width: '120px', textAlign: 'center' }}>{translate('table.action')}</th>
                        </tr>
                    </thead>
                    <tbody className="task-table">
                        {
                            (listDiagram && listDiagram.length !== 0) ? listDiagram.map((item, key) => {
                                return <tr key={key} >
                                    <td>{item.processName}</td>
                                    <td>{item.processDescription}</td>
                                    <td>{item.tasks?.length}</td>
                                    <td>{(item.manager && item.manager.length !== 0) && item.manager.map(x => x.name).join(', ')}</td>
                                    <td>{item.creator?.name}</td>
                                    <td>
                                        <a onClick={() => { viewProcess(item) }} title={translate('task.task_template.view_task_process_template')}>
                                            <i className="material-icons">view_list</i>
                                        </a>
                                        {
                                            isManager(item) &&
                                            <React.Fragment>
                                                <a className="edit" onClick={() => { showEditProcess(item) }} title={translate('task_template.edit_this_task_template')}>
                                                    <i className="material-icons">edit</i>
                                                </a>
                                                <ConfirmNotification
                                                    icon="warning"
                                                    title={translate('task_template.delete_this_task_template')}
                                                    content={`<h3>${translate('task_template.delete_this_task_template')} "${item.processName}"</h3>`}
                                                    name="delete_outline"
                                                    className="text-red"
                                                    func={() => deleteDiagram(item._id)}
                                                />
                                            </React.Fragment>
                                        }
                                        <a className="" style={{ color: "#28A745" }} onClick={() => { showModalCreateTask(item) }} title={translate('task_template.create_task_by_process')}>
                                            <i className="material-icons">add_box</i>
                                        </a>
                                    </td>
                                </tr>
                            }) : null
                        }
                    </tbody>
                </table>
                {(listDiagram && listDiagram.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>}
                <PaginateBar pageTotal={totalPage} currentPage={state.pageNumber} func={setPage} />
            </div>
        </div>
    );
}



function mapState(state) {
    const { user, auth, taskProcess, role, department } = state;
    return { user, auth, taskProcess, role, department };
}

const actionCreators = {
    getAllDepartments: DepartmentActions.get,
    getRoles: RoleActions.get,
    getAllXmlDiagram: TaskProcessActions.getAllXmlDiagram,
    deleteXmlDiagram: TaskProcessActions.deleteXmlDiagram,
};
const connectedProcessTemplate = connect(mapState, actionCreators)(withTranslate(ProcessTemplate));
export { connectedProcessTemplate as ProcessTemplate };