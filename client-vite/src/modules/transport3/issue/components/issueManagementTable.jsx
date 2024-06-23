import React, {useState, useEffect} from 'react';
import {withTranslate} from 'react-redux-multilingual';
import {DataTableSetting, DeleteNotification, PaginateBar} from '@common-components';
import {useDispatch, useSelector} from 'react-redux';
import {IssueActions} from '../redux/actions';
import {getTableConfiguration} from '@helpers/tableConfiguration.js';

const IssueManagement = (props) => {
  const getTableId = 'table-manage-issue';
  const defaultConfig = {limit: 5}
  const getLimit = getTableConfiguration(getTableId, defaultConfig).limit;

  const dispatch = useDispatch();
  const issues = useSelector(state => state.T3issue).issues;
  useEffect(() => {
    dispatch(IssueActions.getIssues());
  }, []);
  const [state, setState] = useState({
    page: 1,
    perPage: getLimit,
    totalPage: 0,
  })

  const setPage = (pageNumber) => {
    setState({
      ...state,
      page: parseInt(pageNumber)
    });
  }

  const setLimit = (number) => {
    setState({
      ...state,
      perPage: parseInt(number)
    });
  }

  const columns = [
    'STT',
    'Mã sự cố',
    'Kiểu sự cố',
    'Mô tả',
    'Trạng thái',
    'Ghi chú',
    'Người yêu cầu',
    'Lịch trình',
    'Người xử lý',
    'Hành động'
  ]

  const status = {
    1: 'Chưa xử lý',
    2: 'Đang xử lý',
    3: 'Đã xử lý'
  }

  const type = {
    1: 'Lỗi xe',
    2: 'Lỗi tuyến đường',
    3: 'Lỗi hàng hóa',
    4: 'Lỗi khác'
  }

  const {page, totalPages, perPage} = state;
  return (
    <>
      <div className="nav-tabs-custom">
        <div className="box-body qlcv">
      <fieldset className="scheduler-border" style={{height: '100%'}}>
        <legend className="scheduler-border">Danh sách sự cố</legend>
        <div className="row">
          <div className="col-xs-12">
            {/* Tim kiem */}
            <div className="form-inline">
              <div className="form-group">
                <label className="form-control-static">Mã sự cố:</label>
                <input
                  type="text"
                  className="form-control"
                  name="codeQuery"
                  // onChange={handleOrderCodeChange}
                  placeholder="Nhập vào mã sự cố"
                  autoComplete="off"
                />
              </div>
              <div className="form-group">
                <button type="button" className="btn btn-success" title="Lọc">
                  Tìm kiếm
                </button>
              </div>
            </div>
            {/* Bang */}
            <table id={getTableId} className="table table-striped table-bordered table-hover" style={{marginTop: 20}}>
              <thead>
              <tr>
                {columns.map((column, index) => <th key={index}>{column}</th>)}
                <th
                  style={{
                    width: '120px',
                    textAlign: 'center'
                  }}
                >
                  {'Hành động'}
                  <DataTableSetting
                    tableId={state.tableId}
                    columnArr={columns}
                    setLimit={setLimit}
                  />
                </th>
              </tr>
              </thead>
              <tbody>
              {issues.length > 0 ? issues.map((issue, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{issue.code}</td>
                  <td>{type[issue.type]}</td>
                  <td>{issue.reason}</td>
                  <td>{status[issue.status]}</td>
                  <td>{issue.description}</td>
                  <td>{issue.schedule.employee[0].name}</td>
                  <td>{issue.schedule.code}</td>
                  <td>{issue.receiver_solve.name}</td>
                </tr>
              )) : <tr>
                <td colSpan={columns.length + 1}>
                  <center>Không có dữ liệu</center>
                </td>
              </tr>}
              </tbody>
            </table>
            <PaginateBar pageTotal={totalPages ? totalPages : 0} currentPage={page} func={setPage}/>
          </div>
        </div>
      </fieldset>
    </div>
    </div>
    </>
  )

}

export default withTranslate(IssueManagement);
