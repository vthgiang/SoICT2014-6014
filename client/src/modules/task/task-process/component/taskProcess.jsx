import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { PaginateBar, SelectMulti, DataTableSetting } from '../../../../common-components';
class TaskProcess extends Component {
  render() {
    const { translate } = this.props
    return (
      <div className="box qlcv">
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
              <th title="Số lần sử dụng">{translate('task_template.count')}</th>
              <th title="Người tạo mẫu">{translate('task_template.creator')}</th>
              <th title="Đơn vị">{translate('task_template.unit')}</th>

              <th style={{ width: '120px', textAlign: 'center' }}>{translate('table.action')}</th>
            </tr>
          </thead>
          <tbody className="task-table">
          <tr>
            <td>Thành đẹp trai</td>
          </tr>

            {/* {
              (typeof list !== 'undefined' && list.length !== 0) ?
                list.map(item => item &&
                  <tr key={item._id}>
                    <td title={item.name}>{item.name}</td>
                    <td title={item.description}>{item.description}</td>
                    <td title={item.numberOfUse}>{item.numberOfUse}</td>
                    <td title={item.creator && item.creator.name}>{item.creator ? item.creator.name : translate('task.task_template.error_task_template_creator_null')}</td>
                    <td title={item.organizationalUnit && item.organizationalUnit.name}>{item.organizationalUnit ? item.organizationalUnit.name : translate('task_template.error_task_template_organizational_unit_null')}</td>
                    <td>
                      <a href="#abc" onClick={() => this.handleView(item._id)} title={translate('task.task_template.view_detail_of_this_task_template')}>
                        <i className="material-icons" style={!this.checkPermisson(currentUnit && currentUnit[0].deans) ? { paddingLeft: "35px" } : { paddingLeft: "0px" }}>view_list</i>
                      </a>
                      {this.checkPermisson(item.organizationalUnit.deans) &&
                        <React.Fragment>
                          <a onClick={() => this.handleEdit(item._id)} className="edit" title={translate('task_template.edit_this_task_template')}>
                            <i className="material-icons">edit</i>
                          </a>
                          <a onClick={() => this.handleDelete(item._id, item.numberOfUse)} className="delete" title={translate('task_template.delete_this_task_template')}>
                            <i className="material-icons"></i>
                          </a>
                        </React.Fragment>
                      }
                    </td>
                  </tr>
                ) :
                <tr><td colSpan={6}><center>{translate('task_template.no_data')}</center></td></tr>
            } */}
          </tbody>
        </table>
        {/* <PaginateBar pageTotal={pageTotal} currentPage={currentPage} func={this.setPage} /> */}
      </div>
    );
  }
}



function mapState(state) {
  const {  user, auth } = state;
  return {  user, auth };
}

const actionCreators = {
  // getTaskTemplateByUser: taskTemplateActions.getAllTaskTemplateByUser,
  // getDepartment: UserActions.getDepartmentOfUser,
  // _delete: taskTemplateActions._delete
};
const connectedTaskProcess = connect(mapState, actionCreators)(withTranslate(TaskProcess));
export { connectedTaskProcess as TaskProcess };