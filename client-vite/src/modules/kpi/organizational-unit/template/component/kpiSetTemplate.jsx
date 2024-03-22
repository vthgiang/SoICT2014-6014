import parse from 'html-react-parser'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import Swal from 'sweetalert2'
import { DataTableSetting, PaginateBar, SelectMulti } from '../../../../../common-components'
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration'
import { UserActions } from '../../../../super-admin/user/redux/actions'
import { kpiTemplateActions } from '../redux/actions'
import { ModalAddKpiTemplate } from './addKpiTemplateModal'
import { ModalEditKpiTemplate } from './editKpiTemplateModal'
import { UseKpiTemplateModal } from './useKpiTemplateModal'
import { ModalViewKpiTemplate } from './viewKpiTemplateModal'
import { ModalViewUsedLog } from './viewUsedLogModal'

const tableId = 'table-kpi-template'
const defaultConfig = { limit: 10 }
const limitDefault = getTableConfiguration(tableId, defaultConfig).limit

function TemplateKpi(props) {
  const { kpitemplates, user } = props
  const [unit, setUnit] = useState()
  const [keyword, setKeyword] = useState()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(limitDefault)
  const [state, setState] = useState({
    currentEditRow: null,
    currentEditRowId: null,
    currentViewRow: null
  })

  const changePage = (number) => {
    if (page !== number) {
      setPage(number)
      props.getKpiTemplates(unit, keyword, number, limit)
    }
  }
  const changeLimit = (number) => {
    if (number !== limit) {
      setLimit(number)
      setPage(1)
      props.getKpiTemplates(unit, keyword, 1, number)
    }
  }

  const handleChangeUnit = (value) => {
    if (value.length === 0) {
      value = null
    }
    setUnit(value)
  }

  const handleChangeKeyword = (e) => {
    const value = e.target.value
    setKeyword(value)
  }

  const handleSearchData = () => {
    props.getKpiTemplates(unit, keyword, page, limit)
  }

  const handleDelete = (id, numberOfUse) => {
    if (numberOfUse === 0) {
      Swal.fire({
        title: 'Bạn có chắc muốn xóa mẫu KPI này',
        type: 'success',
        showCancelButton: true,
        cancelButtonColor: '#d33',
        cancelButtonText: 'Hủy',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Xác nhận'
      }).then((res) => {
        if (res.value) {
          props.deleteDeleteTemplateById(id)

          // props.getKpiTemplates(unit, keyword, 1, limit);
        }
      })
    } else {
      Swal.fire({
        title: 'Không thể xóa mẫu KPI này do đang được sử dụng',
        type: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Xác nhận'
      })
    }
  }

  /**Mở modal chỉnh sửa 1 mẫu kpi */
  const handleViewUsedLog = (kpiTemplate) => {
    setState({
      ...state,
      currentRow: kpiTemplate
    })
    setTimeout(() => {
      window.$('#modal-view-used-log-kpi-template').modal('show')
    }, [300])
  }

  /**Mở modal chỉnh sửa 1 mẫu kpi */
  const handleEdit = (kpiTemplate) => {
    setState({
      ...state,
      currentEditRow: kpiTemplate,
      currentEditRowId: kpiTemplate._id
    })
    setTimeout(() => {
      window.$(`#modal-edit-kpi-template${kpiTemplate._id}`).modal('show')
    }, [300])
  }

  /**Mở modal chỉnh sửa 1 mẫu kpi */
  const handleUse = (kpiTemplate) => {
    setState({
      ...state,
      currentViewRow: kpiTemplate
    })
    setTimeout(() => {
      window.$('#modal-use-kpi-template').modal('show')
    }, [300])
  }

  const handleView = (kpiTemplate) => {
    setState({
      ...state,
      currentViewRow: kpiTemplate
    })
    setTimeout(() => {
      window.$('#modal-view-kpi-template').modal('show')
    }, [300])
  }

  useEffect(() => {
    props.getKpiTemplates(unit, keyword, page, limit)
    props.getDepartment()
  }, [])

  const { items, totalPage } = kpitemplates

  const { organizationalUnitsOfUser: unitArr } = user
  const { currentEditRow, currentEditRowId, currentViewRow, currentRow } = state

  return (
    <React.Fragment>
      <div className='box'>
        <div className='box-body qlcv' id='table-kpi-template'>
          {currentRow && <ModalViewUsedLog kpiTemplate={currentRow} />}
          {currentViewRow && <UseKpiTemplateModal unit={unitArr} kpiTemplate={currentViewRow} />}
          {currentViewRow && <ModalViewKpiTemplate kpiTemplate={currentViewRow} />}
          {currentEditRow && <ModalEditKpiTemplate kpiTemplate={currentEditRow} kpiTemplateId={currentEditRowId} />}
          <ModalAddKpiTemplate limit={limit} />
          <div className='form-inline'>
            <div className='dropdown pull-right' style={{ marginBottom: 15 }}>
              <a
                className='btn btn-success pull-right'
                data-toggle='modal'
                data-target='#modal-add-kpi-template'
                data-backdrop='static'
                data-keyboard='false'
                title='Thêm'
              >
                Thêm mới
              </a>
            </div>
          </div>

          <div className='form-inline'>
            <div className='form-group'>
              <label className='form-control-static'>Tên mẫu</label>
              <input className='form-control' type='text' placeholder='Tìm theo tên' onChange={(e) => handleChangeKeyword(e)} />
            </div>
          </div>

          <div className='form-inline'>
            <div className='form-group'>
              <label className='form-control-static'>Đơn vị quản lý</label>
              {unitArr && (
                <SelectMulti
                  id='multiSelectUnit'
                  value={unit}
                  onChange={handleChangeUnit}
                  items={unitArr.map((item) => {
                    return { value: item._id, text: item.name }
                  })}
                  options={{
                    nonSelectedText: 'Chọn tất cả đơn vị',
                    allSelectedText: 'Chọn tất cả đơn vị'
                  }}
                ></SelectMulti>
              )}
              <button type='button' className='btn btn-success' title='Tìm tiếm mẫu KPI' onClick={handleSearchData}>
                Tìm kiếm
              </button>
            </div>
          </div>

          <DataTableSetting
            tableId={'kpi-set-template'}
            columnArr={['Tên mẫu KPI', 'Đơn vị', 'Mô tả', 'Số lần sử dụng', 'Người tạo mẫu']}
            setLimit={changeLimit}
          />

          {/**Table chứa các mẫu công việc trong 1 trang */}
          <table className='table table-bordered table-striped table-hover' id={'kpi-set-template'}>
            <thead>
              <tr>
                <th title='STT'>STT</th>
                <th title='Tên mẫu KPI'>Tên mẫu KPI</th>
                <th title='Đơn vị'>Đơn vị</th>
                <th title='Mô tả'>Mô tả</th>
                <th title='Số lần sử dụng'>Số lần sử dụng</th>
                <th title='Người tạo mẫu'>Người tạo mẫu</th>
                <th style={{ width: '120px', textAlign: 'center' }}>Hành động</th>
              </tr>
            </thead>
            <tbody className='kpi-table'>
              {typeof items !== 'undefined' && items?.length !== 0
                ? items.map(
                    (item, index) =>
                      item && (
                        <tr key={item?._id}>
                          <td title={index}>{index + 1}</td>
                          <td title={item?.name}>{item?.name}</td>
                          <td title={item?.organizationalUnit?.name}>
                            {item?.organizationalUnit?.name ? item.organizationalUnit.name : ''}
                          </td>
                          <td title={item?.description}>{parse(item?.description ? item.description : '')}</td>
                          <td title={item?.kpiSet}>
                            <a onClick={() => handleViewUsedLog(item)} title={'Chi tiết'}>
                              {item?.kpiSet.length}
                            </a>
                          </td>
                          <td title={item?.creator?.name}>{item?.creator?.name ? item.creator.name : ''}</td>
                          <td>
                            <a onClick={() => handleView(item)} title={'Xem'}>
                              <i className='material-icons'>view_list</i>
                            </a>
                            <a onClick={() => handleEdit(item)} className='edit' title={'Sửa'}>
                              <i className='material-icons'>edit</i>
                            </a>
                            <a onClick={() => handleUse(item)} className='' title={'Sử dụng'}>
                              <i className='fa fa-play-circle text-success' style={{ fontSize: 19 }}></i>
                            </a>
                            <a onClick={() => handleDelete(item?._id, item?.numberOfUse)} className='delete' title={'Xóa'}>
                              <i className='material-icons'></i>
                            </a>
                          </td>
                        </tr>
                      )
                  )
                : null}
            </tbody>
          </table>
          {items && items?.length === 0 && <div className='table-info-panel'>{'Không có dữ liệu'}</div>}
          <PaginateBar pageTotal={totalPage || 1} currentPage={page} func={changePage} />
        </div>
      </div>
    </React.Fragment>
  )
}

function mapState(state) {
  const { kpitemplates, user } = state
  return { kpitemplates, user }
}

const actions = {
  getKpiTemplates: kpiTemplateActions.getKpiTemplates,
  deleteDeleteTemplateById: kpiTemplateActions.deleteKpiTemplateById,
  getDepartment: UserActions.getDepartmentOfUser
}

export default connect(mapState, actions)(withTranslate(TemplateKpi))
