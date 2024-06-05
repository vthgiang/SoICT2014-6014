import React, {useState} from 'react';
import {connect} from 'react-redux';
import {withTranslate} from 'react-redux-multilingual';
import {DataTableSetting, DeleteNotification, PaginateBar, SelectMulti} from '@common-components';
import {useEffect} from 'react';
import {UserActions} from '@modules/super-admin/user/redux/actions';
import {EmployeeActions} from '../redux/actions';
import {formatDate} from '@helpers/formatDate';

const EmployeeTable = (props) => {

  const {translate, employee} = props;

  const [state, setState] = useState({
    page: 1,
    perPage: 5,
    employeeEdit: null,
    employeeId: null,
    tableId: 'employee-table',
  })
  const {
    employeeName,
    page,
    perPage,
    tableId,
  } = state;

  useEffect(() => {
    props.getAllEmployee({page: page, perPage: perPage});
  }, []);

  const handleChangeSearchingName = (e) => {
    setState({
      ...state,
      employeeName: e.target.value
    })
  }

  const setPage = (pageNumber) => {
    setState({
      ...state,
      page: parseInt(pageNumber)
    });

    props.getAllEmployee({page: pageNumber, perPage: perPage});
  }

  const setLimit = (number) => {
    setState({
      ...state,
      perPage: parseInt(number)
    });
    props.getAllEmployee({page: page, perPage: number});
  }

  const handleDelete = (employeeId) => {
    props.removeEmployee(employeeId);
    props.getAllEmployee({page: page, perPage: perPage});
  }

  const handleEdit = (employee) => {
    setState({
      ...state,
      employeeEdit: employee
    });
    window.$('#modal-edit-employee-info').modal('show');
  }

  const handleConfirmShipper = (dataUser) => {
    props.confirmEmployee(dataUser._id);
    props.getAllEmployee({page: page, perPage: perPage});
  }

  const itemSelectSearchingLicense = [
    {value: 'A2', text: 'Bằng xe máy A2'},
    {value: 'B1', text: 'Bằng ô tô hạng B1'},
    {value: 'B2', text: 'Bằng ô tô hạng B2'},
    {value: 'C', text: 'Bằng ô tô hạng C'},
    {value: 'FB1', text: 'Bằng ô tô hạng FB1'},
    {value: 'FB2', text: 'Bằng ô tô hạng FB2'},
    {value: 'FC', text: 'Bằng ô tô hạng FC'},
  ]

  const COLUMN_NHAN_VIEN = [
    'STT',
    'Tên nhân viên',
    'Chứng chỉ',
    'Lương',
  ]

  const COLUMNS_DUYET_NHAN_SU = [
    'STT',
    'Mã nhân viên',
    'Tên nhân viên',
    'Giới tính',
    'Ngày sinh',
    'Ngày hết hạn hợp đồng',
    'Loại hợp đồng',
    'Trạng thái',
  ]

  return (
    <React.Fragment>
      <div className="box-body qlcv">
        <div className="form-inline">
          <div className="form-group">
            <label className="form-control-static">Tìm kiếm theo chứng chỉ</label>
            <SelectMulti
              id={`select-license-to-search`}
              className="form-control select2"
              multiple="multiple"
              options={{nonSelectedText: 'Chọn chứng chỉ', allSelectedText: 'Chọn tất cả'}}
              style={{width: '100%'}}
              items={itemSelectSearchingLicense}
              // onChange={handleChangeSearchingLicense}
            />
          </div>
        </div>
        <div className="form-inline">
          <div className="form-group">
            <label className="form-control-static">Tên nhân viên</label>
            <input type="text" className="form-control" value={employeeName} name="employeeName" autoComplete="off"
                   onChange={(e) => handleChangeSearchingName(e)}/>
          </div>
          <div className="form-group">
            <button type="button" className="btn btn-success" title={'Tìm kiếm'}>Tìm kiếm
            </button>
          </div>
        </div>
        <fieldset className="scheduler-border">
          <legend className="scheduler-border">Duyệt nhân sự</legend>
          <table id={'duyet-nhan-su'} className="table table-striped table-bordered table-hover"
                 style={{marginTop: '20px'}}>
            <thead>
            <tr>
              {COLUMNS_DUYET_NHAN_SU.map((column, index) => (
                <th key={index}>{column}</th>
              ))}
              <th style={{width: '120px', textAlign: 'center'}}>{translate('table.action')}
                <DataTableSetting
                  tableId={'duyet-nhan-su'}
                  columnArr={COLUMNS_DUYET_NHAN_SU}
                  setLimit={setLimit}
                />
              </th>
            </tr>
            </thead>
            <tbody>
            {props.listEmployeesNotConfirm && props.listEmployeesNotConfirm.length > 0 ?
              <>
                {props.listEmployeesNotConfirm.map((employee, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{employee.employeeNumber}</td>
                    <td>{employee.fullName}</td>
                    <td>{employee.gender === 'female' ? 'Nữ' : 'Nam'}</td>
                    <td>{formatDate(employee.birthdate)}</td>
                    <td>{formatDate(employee.contractEndDate)}</td>
                    <td>{employee.contractType}</td>
                    <td>{employee.status === 'active' ? 'Đang làm việc' : 'Đã nghỉ việc'}</td>
                    <td>
                      <a className="text-green" onClick={() => handleConfirmShipper(employee)}><i
                        className="material-icons">check</i></a>
                    </td>
                  </tr>
                ))}
              </>
              : <>
                <tr>
                  <td colSpan={9}>
                    <center>Không có dữ liệu</center>
                  </td>
                </tr>
              </>}
            </tbody>
          </table>
        </fieldset>
        <fieldset className="scheduler-border">
          <legend className="scheduler-border">Nhân viên giao hàng</legend>
          <table id={tableId} className="table table-striped table-bordered table-hover" style={{marginTop: '20px'}}>
            <thead>
            <tr>
              {COLUMN_NHAN_VIEN.map((column, index) => (
                <th key={index}>{column}</th>
              ))}
              <th style={{width: '120px', textAlign: 'center'}}>{translate('table.action')}
                <DataTableSetting
                  tableId={tableId}
                  columnArr={COLUMN_NHAN_VIEN}
                  setLimit={setLimit}
                />
              </th>
            </tr>
            </thead>
            <tbody>
            {props.listEmployees && props.listEmployees.length > 0 ?
              <>
                {props.listEmployees.map((employee, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{employee.employee.fullName}</td>
                    <td>{employee.license}</td>
                    <td>{employee.salary}</td>
                    <td>
                      <a className="text-green" onClick={() => handleEdit(employee)}><i
                        className="material-icons">edit</i></a>
                      <DeleteNotification
                        content={'Xác nhận xóa nhân viên?'}
                        data={{id: employee._id}}
                        func={handleDelete}
                        />
                    </td>
                  </tr>
                ))}
              </>
              : <>
                <tr>
                  <td colSpan={6}>
                    <center>Không có dữ liệu</center>
                  </td>
                </tr>
              </>}
            </tbody>
          </table>
          <PaginateBar
            pageTotal={employee && employee.totalPages}
            currentPage={page}
            func={setPage}
          />
        </fieldset>
      </div>
    </React.Fragment>
  )

}


function mapStateToProps(state) {
  const {listEmployees, listEmployeesNotConfirm} = state.T3employee;
  return {listEmployees, listEmployeesNotConfirm}
}

const mapDispatchToProps = {
  getAllEmployee: EmployeeActions.getAllEmployee,
  confirmEmployee: EmployeeActions.confirmEmployee,
  removeEmployee: EmployeeActions.removeEmployee,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(EmployeeTable));
