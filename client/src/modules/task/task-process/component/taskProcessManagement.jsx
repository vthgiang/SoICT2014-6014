import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from "react-redux-multilingual";


import { PaginateBar, SelectMulti, DataTableSetting } from '../../../../common-components';


import { ModalEditTaskProcess } from './modalEditTaskProcess'
import { ModalCreateTaskProcess } from './modalCreateTaskProcess'
import { ModalViewTaskProcess } from './modalViewTaskProcess';

import { TaskProcessActions } from '../redux/actions';
import { RoleActions } from '../../../super-admin/role/redux/actions';
import { DepartmentActions } from '../../../super-admin/organizational-unit/redux/actions';
class TaskProcessManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentRow: {},
      pageNumber: 1, 
      noResultsPerPage: 5,
    };

  }
  componentDidMount = () => {
    console.log('this.state.pageNumber, this.state.noResultsPerPage,', this.state.pageNumber, this.state.noResultsPerPage);
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
    this.props.deleteXmlDiagram(xmlId)
  }

  viewProcess = async (item) => {
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
  showCreateTask = (item) => {
    this.setState(state => {
      return {
        template: item
      }
    });
    window.$(`#modal-create-task`).modal('show')
  }
  setPage = async (pageTotal) => {
    var test = window.$("#multiSelectUnit").val();
    var oldCurrentPage = this.state.currentPage;
    await this.setState(state => {
        return {
            ...state,
            currentPage: pageTotal
        }
    })
    var newCurrentPage = this.state.currentPage;
    // if (oldCurrentPage !== newCurrentPage) this.props.getTaskTemplateByUser(this.state.currentPage, this.state.perPage, test, this.name.value);
}
  render() {
    const { translate, taskProcess,department } = this.props
    const { showModalCreateProcess, currentRow } = this.state
    let listDiagram = taskProcess && taskProcess.xmlDiagram;
    let listOrganizationalUnit = department?.list
    return (
      <div className="box">
        <div className="box-body qlcv">
          {
            this.state.currentRow !== undefined &&
            <ModalViewTaskProcess
              title={'Xem quy trình công việc'}
              listOrganizationalUnit= {listOrganizationalUnit}
              data={currentRow}
              idProcess={currentRow._id}
              xmlDiagram={currentRow.xmlDiagram}
              nameProcess={currentRow.nameProcess}
              description={currentRow.description}
              infoTask={currentRow.infoTask}
              creator={currentRow.creator}
            />
          }
          {
            this.state.currentRow !== undefined &&
            <ModalEditTaskProcess
              title={'Sửa quy trình công việc'}
              data={currentRow}
              listOrganizationalUnit= {listOrganizationalUnit}
              idProcess={currentRow._id}
              xmlDiagram={currentRow.xmlDiagram}
              nameProcess={currentRow.nameProcess}
              description={currentRow.description}
              infoTask={currentRow.infoTask}
              creator={currentRow.creator}
            />
          }
          {this.checkHasComponent('create-task-process-button') &&
            <React.Fragment>
              <div className="pull-right">
                <button className="btn btn-success" onClick={() => { this.showModalCreateProcess() }}>
                  Thêm mới
              </button>
              </div>
              {
                showModalCreateProcess &&
                <ModalCreateTaskProcess
                  listOrganizationalUnit={listOrganizationalUnit}
                  title="Thêm mới quy trình công việc"
                />
              }
            </React.Fragment>
          }
          <div className="form-inline">
            <div className="form-group">
              <label className="form-control-static">{translate('task_template.name')}</label>
              <input className="form-control" type="text" placeholder={translate('task_template.search_by_name')} ref={input => this.name = input} />
            </div>
          </div>

          <div className="form-inline">
            <div className="form-group">
              <label className="form-control-static">{translate('task_template.unit')}</label>
              {/* {units &&
                      <SelectMulti id="multiSelectUnit"
                          defaultValue={units.map(item => { return item._id })}
                          items={units.map(item => { return { value: item._id, text: item.name } })}
                          options={{ nonSelectedText: translate('task_template.select_all_units'), allSelectedText: "Tất cả các đơn vị" }}>
                      </SelectMulti>
                    } */}
              <button type="button" className="btn btn-success" title="Tìm tiếm mẫu công việc" onClick={this.handleUpdateData}>{translate('task_template.search')}</button>
            </div>
          </div>
          <DataTableSetting
            tableId="table-task-template"
            columnArr={[
              'Tên mẫu công việc',
              'Mô tả',
              'Người tạo mẫu',
            ]}
            limit={5}
            // setLimit={t}
            hideColumnOption={true}
          />
          <table className="table table-bordered table-striped table-hover" id="table-task-template">
            <thead>
              <tr>
                <th title="Tên mẫu công việc">{translate('task_template.tasktemplate_name')}</th>
                <th title="Mô tả">{translate('task_template.description')}</th>
                <th title="Người tạo quy trình">{translate('task_template.creator')}</th>
                <th style={{ width: '120px', textAlign: 'center' }}>{translate('table.action')}</th>
              </tr>
            </thead>
            <tbody className="task-table">
              {
                listDiagram && listDiagram.map((item, key) => {
                  return <tr key={key} >
                    <td>{item.nameProcess}</td>
                    <td>{item.description}</td>
                    <td>{item.creator?.name}</td>
                    <td>
                      <a onClick={() => { this.viewProcess(item) }} title={translate('task.task_template.view_detail_of_this_task_template')}>
                        <i className="material-icons">view_list</i>
                      </a>
                      <a className="edit" onClick={() => { this.showEditProcess(item) }} title={translate('task_template.edit_this_task_template')}>
                        <i className="material-icons">edit</i>
                      </a>
                      <a className="delete" onClick={() => { this.deleteDiagram(item._id) }} title={translate('task_template.delete_this_task_template')}>
                        <i className="material-icons"></i>
                      </a>
                      <a className="delete" onClick= {()=> { this.showCreateTask(item)}} title={translate('task_template.delete_this_task_template')}>
                        <i className="material-icons">add_box</i>
                      </a>
                    </td>
                  </tr>
                })
              }
            </tbody>
          </table>
          <PaginateBar pageTotal={4} currentPage={this.state.currentPage} func={this.setPage} />
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
const connectedTaskProcessManagement = connect(mapState, actionCreators)(withTranslate(TaskProcessManagement));
export { connectedTaskProcessManagement as TaskProcessManagement };
