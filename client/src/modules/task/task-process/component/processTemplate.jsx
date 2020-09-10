import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from "react-redux-multilingual";


import { PaginateBar, SelectMulti, DataTableSetting, ConfirmNotification } from '../../../../common-components';


import { ModalEditTaskProcess } from './modalEditTaskProcess'
import { ModalCreateTaskProcess } from './modalCreateTaskProcess'
import { ModalViewTaskProcess } from './modalViewTaskProcess';
import { ModalCreateTaskByProcess } from './modalCreateTaskByProcess';

import { TaskProcessActions } from '../redux/actions';
import { RoleActions } from '../../../super-admin/role/redux/actions';
import { DepartmentActions } from '../../../super-admin/organizational-unit/redux/actions';
import Swal from 'sweetalert2';
// import { FormImportProcessTemplate } from './formImportProcessTemplate';
class ProcessTemplate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentRow: {},
            pageNumber: 1,
            noResultsPerPage: 5,
        };

    }
    componentDidMount = () => {
        this.props.getAllDepartments()
        this.props.getAllXmlDiagram(this.state.pageNumber, this.state.noResultsPerPage, "");
        this.props.getRoles();
    }
    checkHasComponent = (name) => {
        var { auth } = this.props;
        var result = false;
        auth.components.forEach(component => {
            if (component.name === name) result = true;
        });
        return result;
    }
    showEditProcess = async (item) => {
        this.setState(state => {
            return {
                ...state,
                currentRow: item,
            }
        });
        window.$(`#modal-edit-process`).modal("show");
    }

    deleteDiagram = async (xmlId) => {
        this.props.deleteXmlDiagram(xmlId, this.state.pageNumber, this.state.noResultsPerPage, "");
    }

    viewProcess = async (item) => {
        console.log(item)
        this.setState(state => {
            return {
                ...state,
                currentRow: item,
            }
        });
        window.$(`#modal-view-process-task`).modal("show");
    }
    showModalCreateProcess = async () => {
        await this.setState(state => {
            return {
                ...state,
                showModalCreateProcess: true
            }
        });
        window.$(`#modal-create-process-task`).modal("show");
    }

    handImportFile = async () => {
        await this.setState(state => {
            return {
                ...state,
                showModalImportProcess: true
            }
        });
        window.$(`#modal-import-process-task`).modal("show");
    }

    showModalCreateTask = async (item) => {
        await this.setState(state => {
            return {
                ...state,
                showModalCreateTask: true,
                currentRow: item,
            }
        });
        window.$(`#modal-create-task-by-process`).modal("show");
    }
    showCreateTask = (item) => {
        this.setState(state => {
            return {
                template: item
            }
        });
        window.$(`#modal-create-task`).modal('show')
    }
    setPage = async (pageTotal) => {
        let oldCurrentPage = this.state.pageNumber;
        await this.setState(state => {
            return {
                ...state,
                pageNumber: pageTotal
            }
        })
        let newCurrentPage = this.state.pageNumber;
        this.props.getAllXmlDiagram(this.state.pageNumber, this.state.noResultsPerPage, "");
    }
    setLimit = (pageTotal) => {
        if (pageTotal !== this.state.noResultsPerPage) {
            this.setState(state => {
                return {
                    ...state,
                    noResultsPerPage: pageTotal
                }
            })
            this.props.getAllXmlDiagram(1, this.state.noResultsPerPage, "");
        }
    }
    render() {
        const { translate, taskProcess, department } = this.props
        const { showModalCreateProcess, currentRow, showModalImportProcess } = this.state
        let listDiagram = [];
        if (taskProcess && taskProcess.xmlDiagram) {
            listDiagram = taskProcess.xmlDiagram.filter((item) => {
                return listDiagram.find(e => e._id === item._id) ? '' : listDiagram.push(item)
            });
        }

        let totalPage = taskProcess.totalPage
        let listOrganizationalUnit = department?.list
        return (
            <div className="box">
                <div className="box-body qlcv">
                    {
                        this.state.currentRow !== undefined &&
                        <ModalViewTaskProcess
                            title={translate("task.task_process.add_modal")}
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
                        this.state.currentRow !== undefined &&
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

                            pageNumber={this.state.pageNumber}
                            noResultsPerPage={this.state.noResultsPerPage}
                            name={""}
                        />
                    }
                    {
                        this.state.currentRow !== undefined &&
                        <ModalCreateTaskByProcess
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
                    {this.checkHasComponent('create-task-process-button') &&
                        <React.Fragment>
                            {/* <div className="pull-right">
                                <button className="btn btn-success" onClick={() => { this.showModalCreateProcess() }}>
                                    {translate("task.task_process.create")}
                                </button>
                            </div> */}
                            <div className="form-inline">
                                <div className="dropdown pull-right" style={{ marginBottom: 15 }}>
                                    <button type="button" className="btn btn-success dropdown-toggler pull-right" data-toggle="dropdown" aria-expanded="true" title='Thêm'>{translate('task_template.add')}</button>
                                    <ul className="dropdown-menu pull-right">
                                        <li><a href="#modal-add-task-template" title="ImportForm" onClick={(event) => { this.showModalCreateProcess(event) }}>{translate('task_template.add')}</a></li>
                                        <li><a href="#modal_import_file" title="ImportForm" onClick={(event) => { this.handImportFile(event) }}>Thêm file</a></li>
                                    </ul>
                                </div>
                            </div>
                            {
                                showModalCreateProcess &&
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
                            <input className="form-control" type="text" placeholder={translate('task_template.search_by_name')} ref={input => this.name = input} />
                            <button type="button" className="btn btn-success" title={translate('task_template.search')} onClick={this.handleUpdateData}>{translate('task_template.search')}</button>
                        </div>
                    </div>

                    <DataTableSetting
                        tableId="table-process-template"
                        columnArr={[
                            translate("task.task_process.process_name"),
                            translate('task_template.description'),
                            translate('task_template.creator'),
                        ]}
                        limit={this.state.noResultsPerPage}
                        setLimit={this.setLimit}
                        hideColumnOption={true}
                    />
                    <table className="table table-bordered table-striped table-hover" id="table-process-template">
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
                                        <td>{item.tasks.length}</td>
										<td>{(item.manager && item.manager.length !== 0) && item.manager.map(x => x.name + ', ')}</td>
                                        <td>{item.creator?.name}</td>
                                        <td>
                                            <a onClick={() => { this.viewProcess(item) }} title={translate('task.task_template.view_task_process_template')}>
                                                <i className="material-icons">view_list</i>
                                            </a>
                                            <a className="edit" onClick={() => { this.showEditProcess(item) }} title={translate('task_template.edit_this_task_template')}>
                                                <i className="material-icons">edit</i>
                                            </a>
                                            {/* <a className="delete" onClick={() => { this.deleteDiagram(item._id) }} title={translate('task_template.delete_this_task_template')}>
                                                <i className="material-icons"></i>
                                            </a> */}
                                            <ConfirmNotification
                                                icon="warning"
                                                title={translate('task_template.delete_this_task_template')}
                                                content={`<h3>${translate('task_template.delete_this_task_template')} "${item.processName}"</h3>`}
                                                name="delete_outline"
                                                className="text-red"
                                                func={()=>this.deleteDiagram(item._id)}
                                            />
                                            <a className="" style={{ color: "#008D4C" }} onClick={() => { this.showModalCreateTask(item) }} title={translate('task_template.create_task_by_process')}>
                                                <i className="material-icons">add_box</i>
                                            </a>
                                        </td>
                                    </tr>
                                }) : <tr><td colSpan={6}>{translate("task.task_process.no_data")}</td></tr>
                            }
                        </tbody>
                    </table>
                    <PaginateBar pageTotal={totalPage} currentPage={this.state.pageNumber} func={this.setPage} />
                </div>
            </div>
        );
    }
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
