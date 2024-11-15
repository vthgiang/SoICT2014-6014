import React, { useEffect, useState } from 'react'
import { withTranslate } from 'react-redux-multilingual'
import { formatDate } from '@helpers/formatDate'
import { DataTableSetting, DeleteNotification } from '@common-components'
import { useDispatch, useSelector } from 'react-redux'
import { ScheduleActions } from '../../redux/actions'

function OntimeDeliveryPredict(props) {
  const TableId = 'parameters-table'
  let T3schedules = useSelector(state => state.T3schedule)
  let dispatch = useDispatch()
  useEffect(() => {
    dispatch(ScheduleActions.getHyperparamter())
  }, [dispatch])
  const [state, setState] = useState({
    tableId: TableId,
    loading: false
  })
  const columns = [
    'STT',
    'learning_rate',
    'n_estimators',
    'max_depth',
    'min_child_weight',
    'reg_alpha',
    'reg_lambda',
    'Độ chính xác',
    'Thời gian cập nhật'
  ]

  const handleParameterTuning = async () => {
    setState(prevState => ({ ...prevState, loading: true }));
    await dispatch(ScheduleActions.postHyperparameter());
    await dispatch(ScheduleActions.getHyperparamter());
    setState(prevState => ({ ...prevState, loading: false }));
  }

  return (
    <>
      <div className="box-body qlcv">
        <div className="form-inline">
          <div className="dropdown pull-right" style={{ marginTop: 5 }}>
            <button
              type="button"
              className="btn btn-success"
              data-toggle="modal"
              onClick={handleParameterTuning}
              disabled={state.loading}
            >
              {state.loading ? 'Đang cập nhật...' : 'Cập nhật tham số mô hình'}
            </button>
          </div>
        </div>
        {state.loading && <div>Loading...</div>}
        <table id={state.tableId} className="table table-striped table-bordered table-hover" style={{ marginTop: 20 }}>
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index}>{column}</th>
              ))}
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
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {T3schedules.hyperparameters && T3schedules.hyperparameters.length !== 0 ? T3schedules.hyperparameters.map((hyperparameter, index) => {
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{hyperparameter.learning_rate}</td>
                  <td>{hyperparameter.n_estimators}</td>
                  <td>{hyperparameter.max_depth}</td>
                  <td>{hyperparameter.min_child_weight}</td>
                  <td>{hyperparameter.reg_alpha}</td>
                  <td>{hyperparameter.reg_lambda}</td>
                  <td>{hyperparameter.accuracy}</td>
                  <td>{formatDate(hyperparameter.createdAt)}</td>
                  <td>
                    <td style={{ textAlign: 'center' }}>
                      <a onClick={() => handleShowDetailInfo()}><i className="material-icons">visibility</i></a>
                      <a><i className="material-icons">edit</i></a>
                      <DeleteNotification
                        content={'Xác nhận xóa lịch trình?'}
                      // func={handleDeleteVehicle}
                      />
                    </td>
                  </td>
                </tr>
              )
            }) : <tr>
              <td colSpan={columns.length + 1}>
                <center>Không có dữ liệu</center>
              </td>
            </tr>
            }
          </tbody>
        </table>
      </div>
    </>
  )
}

export default withTranslate(OntimeDeliveryPredict)