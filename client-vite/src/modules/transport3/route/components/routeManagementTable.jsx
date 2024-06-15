import React, {useState} from 'react';
import {withTranslate} from 'react-redux-multilingual';
import {DataTableSetting, DeleteNotification, PaginateBar} from '@common-components';
import {useEffect} from 'react';
import {getTableConfiguration} from '@helpers/tableConfiguration';
import {formatDate} from '@helpers/formatDate.js';
import {useDispatch, useSelector} from 'react-redux';
import {RouteActions} from '@modules/transport3/route/redux/actions.js';

const RouteManagementTable = (props) => {
  const getTableId = 'table-manage-vehicle';
  const defaultConfig = {limit: 5}
  const getLimit = getTableConfiguration(getTableId, defaultConfig).limit;

  const dispatch = useDispatch();
  const route = useSelector(state => state.T3route);
  useEffect(() => {
    dispatch(RouteActions.getAllVehicleTransporting());
    dispatch(RouteActions.getAllOrderTransporting());
  }, []);
  console.log(route);
  const [state, setState] = useState({
    page: 1,
    perPage: getLimit,
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
    'Mã phương tiện',
    'Tên phương tiện',
    'Trọng tải',
    'Thể tích thùng',
    'Mức tiêu thụ nhiên liệu',
    'Chi phí vận chuyển',
    'Hạn bảo hành',
    'Tốc độ',
    'Trạng thái',
  ]

  return (
    <>
      <fieldset className="scheduler-border" style={{height: '100%'}}>
        <legend className="scheduler-border">Danh sách phương tiện đang vận chuyển</legend>
        <div className="row">
          <div className="col-xs-12">
            <table id={getTableId} className="table table-striped table-bordered table-hover">
              <thead>
                <tr>
                  {columns.map((column, index) => <th key={index}>{column}</th>)}
                </tr>
              </thead>
              <tbody>
              </tbody>
            </table>
          </div>
        </div>
        </fieldset>
    </>
  )

}

export default withTranslate(RouteManagementTable);
