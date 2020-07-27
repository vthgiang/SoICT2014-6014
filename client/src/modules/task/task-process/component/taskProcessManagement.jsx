import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { PaginateBar, SelectMulti, DataTableSetting } from '../../../../common-components';
import { ModalProcessTask } from './modalProcessTask'
import { TaskProcessActions } from '../redux/actions';
class TaskProcessManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {};

  }
  showProcess = () => {
    window.$(`#modal-process`).modal("show");
  }
  componentDidMount = () => {
    this.props.getAllXmlDiagram()
  }
  render() {
    const { translate, taskProcess } = this.props
    let listDiagram = taskProcess && taskProcess.xmlDiagram;
    return (
      <div className="box">
        <div className="box-body qlcv">
          {
            <ModalProcessTask
              title={'Xem quy trình công việc'}

            />
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
                      <td>{item.creator.name}</td>
                      <td><a href="#abc" onClick={() => { this.showProcess() }} title={translate('task.task_template.view_detail_of_this_task_template')}>
                        <i className="material-icons">view_list</i>
                      </a>
                        <a className="edit" title={translate('task_template.edit_this_task_template')}>
                          <i className="material-icons">edit</i>
                        </a>
                        <a className="delete" title={translate('task_template.delete_this_task_template')}>
                          <i className="material-icons"></i>
                        </a>
                      </td>
                    </tr>
                })
              }

            </tbody>
          </table>
          {/* <PaginateBar pageTotal={pageTotal} currentPage={currentPage} func={this.setPage} /> */}
        </div>
      </div>
    );
  }
}



function mapState(state) {
  const { user, auth, taskProcess } = state;
  return { user, auth, taskProcess };
}

const actionCreators = {
  getAllXmlDiagram: TaskProcessActions.getAllXmlDiagram
};
const connectedTaskProcessManagement = connect(mapState, actionCreators)(withTranslate(TaskProcessManagement));
export { connectedTaskProcessManagement as TaskProcessManagement };