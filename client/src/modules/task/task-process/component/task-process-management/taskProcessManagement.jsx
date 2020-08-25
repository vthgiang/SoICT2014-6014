import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from "react-redux-multilingual";


import { PaginateBar, SelectMulti, DataTableSetting } from '../../../../../common-components';

import { TaskProcessActions } from '../../redux/actions';
import { ModalViewProcess } from './modalViewProcess';

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
    this.props.getAllTaskProcess(this.state.pageNumber, this.state.noResultsPerPage, "");
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
    window.$(`#modal-view-process-task-list`).modal("show");
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
    this.props.getAllTaskProcess(this.state.pageNumber, this.state.noResultsPerPage, "");
  }
  setLimit = (pageTotal) => {
    if (pageTotal !== this.state.noResultsPerPage) {
      this.setState(state => {
        return {
          ...state,
          noResultsPerPage: pageTotal
        }
      })
      // this.props.getAllTaskProcess(this.state.pageNumber, this.state.noResultsPerPage, "");
      this.props.getAllTaskProcess( 1, this.state.noResultsPerPage, "");
    }
  }
  render() {
    const { translate, taskProcess, department } = this.props
    const { showModalCreateProcess, currentRow } = this.state
    let listTaskProcess = [];
    if(taskProcess && taskProcess.listTaskProcess){
      listTaskProcess = taskProcess.listTaskProcess
    }

    let totalPage = taskProcess.totalPage
    let listOrganizationalUnit = department?.list
    return (
      <div className="box">
        <div className="box-body qlcv">
          {
            this.state.currentRow !== undefined &&
            <ModalViewProcess
              title={'Xem quy trình công việc'}
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
          <div className="form-inline">
            <div className="form-group">
              <label className="form-control-static">{translate('task_template.name')}</label>
              <input className="form-control" type="text" placeholder={translate('task_template.search_by_name')} ref={input => this.name = input} />
              <button type="button" className="btn btn-success" title="Tìm tiếm mẫu công việc" onClick={this.handleUpdateData}>{translate('task_template.search')}</button>
            </div>
          </div>

          {/* <div className="form-inline">
            <div className="form-group">
              <label className="form-control-static"></label>
              <button type="button" className="btn btn-success" title="Tìm tiếm mẫu công việc" onClick={this.handleUpdateData}>{translate('task_template.search')}</button>
            </div>
          </div> */}
          <DataTableSetting
            tableId="table-task-template"
            columnArr={[
              'Tên mẫu công việc',
              'Mô tả',
              'Người tạo mẫu',
            ]}
            limit={this.state.noResultsPerPage}
            setLimit={this.setLimit}
            hideColumnOption={true}
          />
          <table className="table table-bordered table-striped table-hover" id="table-task-template">
            <thead>
              <tr>
                <th title="Tên quy trình công việc">Tên quy trình công việc</th>
                <th title="Mô tả">{translate('task_template.description')}</th>
                <th title="Người tạo quy trình">Người tạo quy trình</th>
                <th style={{ width: '120px', textAlign: 'center' }}>{translate('table.action')}</th>
              </tr>
            </thead>
            <tbody className="task-table">
              {
                (listTaskProcess && listTaskProcess.length !== 0) ? listTaskProcess.map((item, key) => {
                  return <tr key={key} >
                    <td>{item.processName}</td>
                    <td>{item.processDescription}</td>
                    <td>{item.creator?.name}</td>
                    <td>
                      <a onClick={() => { this.viewProcess(item) }} title={translate('task.task_template.view_detail_of_this_task_template')}>
                        <i className="material-icons">view_list</i>
                      </a>
                      {/* <a className="edit" onClick={() => { this.showEditProcess(item) }} title={translate('task_template.edit_this_task_template')}>
                        <i className="material-icons">edit</i>
                      </a>
                      <a className="delete" onClick={() => { this.deleteDiagram(item._id) }} title={translate('task_template.delete_this_task_template')}>
                        <i className="material-icons"></i>
                      </a>
                      <a className="" style={{ color: "#008D4C" }} onClick={() => { this.showModalCreateTask(item) }} title={translate('task_template.delete_this_task_template')}>
                        <i className="material-icons">add_box</i>
                      </a> */}
                    </td>
                  </tr>
                }) : <tr><td colSpan={4}>Không có dữ liệu</td></tr>
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
  getAllTaskProcess: TaskProcessActions.getAllTaskProcess,
};
const connectedTaskProcessManagement = connect(mapState, actionCreators)(withTranslate(TaskProcessManagement));
export { connectedTaskProcessManagement as TaskProcessManagement };
