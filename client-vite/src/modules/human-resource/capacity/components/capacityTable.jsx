import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

// import { PaginateBar, DataTableSetting, ConfirmNotification } from '../../../../common-components'

// import { CapacityActions } from '../redux/actions'
// import EditForm from './editForm'
// import CreateForm from './createForm'

import { getTableConfiguration } from '../../../../helpers/tableConfiguration'
import { CapacityActions } from '../redux/actions'
import { ConfirmNotification, DataTableSetting, PaginateBar, ToolTip } from '../../../../common-components'

function CapacityTable(props) {
  console.log('prob ------', props)

  const tableId_constructor = 'table-manage-capacity'
  const defaultConfig = { name: '', page: 1, limit: 100 }
  const { limit } = getTableConfiguration(tableId_constructor, defaultConfig)

  const [state, setState] = useState({
    tableId: tableId_constructor,
    limit,
    page: 1,
    name: '' // Mặc định tìm kiếm theo tên
  })

  const { capacityDuplicateName } = state
  const { capacity, translate } = props
  
  // Cac ham xu ly du lieu voi modal
  const handleAddCapacity = async (capacity) => {
    await setState({
      ...state
    })
    window.$('#modal-create-capacity').modal('show')
  }

  const setName = (e) => {
    const { value } = e.target
    setState({
      ...state,
      name: value
    })
  }

  const handleEdit = async (capacity) => {
    await setState({
      ...state,
      currentRow: capacity
    })
    window.$('#edit-capacity').modal('show')
  }

  const setPage = (page) => {
    setState({
      ...state,
      page
    })
    const { name, limit } = state
    const data = {
      limit,
      page,
      name
    }
    props.getListCapacity(data)
  }

  const setLimit = (number) => {
    setState({
      ...state,
      limit: number
    })
    const { name, page } = state
    const data = {
      limit: number,
      page,
      name
    }
    props.getListCapacity(data)
  }

  const searchWithOption = async () => {
    const data = {
      limit: state.limit,
      page: state.page,
      name: state.name
    }
    await props.getListCapacity(data)
  }

  const { currentRow, tableId } = state


  useEffect(() => {
    props.getListCapacity({ name: state.name, page: state.page, limit: state.limit })
  }, [])


  return (
    <>
      {/* Button thêm bằng cấp - chứng chỉ mới */}
      <div style={{ display: 'flex', marginBottom: 20, marginTop: 20, float: 'right' }}>
        <a className='btn btn-success pull-right' href='#modal-create-capacity' title='Add capacity' onClick={handleAddCapacity}>
          Thêm
        </a>
      </div>

      {/* <CreateForm list={major?.listMajor} /> */}

      {/* Thanh tìm kiếm */}
      <div className='form-inline' style={{ marginBottom: '20px', marginTop: '20px' }}>
        <div className='form-group' style={{ marginRight: '20px' }}>
          <label className='form-control-static' style={{ marginRight: '20px' }}>
            Tên năng lực
          </label>
          <input
            type='text'
            className='form-control'
            name='name'
            onChange={setName}
            placeholder='Nhập tên năng lực'
            autoComplete='off'
          />
        </div>
        <div className='form-group'>
          <label />
          <button
            type='button'
            className='btn btn-success'
            title={translate('asset.general_information.search')}
            onClick={searchWithOption}
          >
            {translate('asset.general_information.search')}
          </button>
        </div>
      </div>

      {/* Bảng dữ liệu bằng cấp - chứng chỉ */}
      <table className='table table-hover table-striped table-bordered' id={tableId}>
        <thead>
          <tr>
            <th>Tên</th>
            <th>Tên viết tắt (key)</th>
            {/* <th>Chuyên ngành</th> */}
            <th>Mô tả</th>
            <th>Giá trị năng lực: Điểm quy đổi</th>
            <th style={{ width: '20px', textAlign: 'center' }}>
              {translate('table.action')}
              <DataTableSetting
                columnName={translate('table.action')}
                columnArr={['Tên', 'Tên viết tắt (key) ', 'Chuyên ngành']}
                setLimit={setLimit}
                tableId={tableId}
              />
            </th>
          </tr>
        </thead>
        <tbody>
          {capacity?.listCapacity?.map((capacity) => (
            <tr
              key={`capacityList${capacity._id}`}
              style={
                capacityDuplicateName && capacityDuplicateName.includes(capacity.name.trim().toLowerCase().replaceAll(' ', ''))
                  ? { color: 'orangered', fontWeight: 'bold' }
                  : { color: '' }
              }
            >
              <td> {capacity?.name} </td>
              <td> {capacity?.key} </td>
              {/* <td><ToolTip dataTooltip={capacity?.majors?.length ? capacity.majors.map(major => major ? major.name : "") : []} /></td> */}
              <td> {capacity?.description}</td>
              <td>
                <span>
                  {capacity?.values && capacity?.values.map((item, index) => `${item?.key}: ${item?.value}`).join(", ")}
                </span>
                {/* <ToolTip dataTooltip={capacity?.values && capacity?.values.map((item, index) => `${item?.key}: ${item?.value}`)} />
                <ul>
                  {capacity?.values && capacity?.values.map((item, index) => (
                  <li key={index}>
                    {`${item?.key}: ${item?.value}`}
                  </li>
                  ))}
                </ul> */}
              </td>
              <td style={{ textAlign: 'center' }}>
                <a className='edit' href={`#${capacity._id}`} onClick={() => handleEdit(capacity)}>
                  <i className='material-icons'>edit</i>
                </a>
                {/* <a className="delete" href={`#${capacity._id}`} onClick={() => handleDelete(capacity)}><i className="material-icons">delete</i></a> */}
                <ConfirmNotification
                  icon='question'
                  title='Xóa năng lực'
                  name='delete'
                  className='text-red'
                  content={`<h4>Delete ${capacity.name}</h4>`}
                  func={() => props.deleteCapacity(capacity._id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Form chỉnh sửa thông tin bằng cấp - chứng chỉ */}

      {currentRow && (
        <EditForm
          capacityId={currentRow._id}
          capacityName={currentRow.name}
          capacityAbbreviation={currentRow.abbreviation}
          capacityDescription={currentRow.description}
          listData={major?.listMajor}
          capacityScore={currentRow.score}
        />
      )}
      {capacity.isLoading ? (
        <div className='table-info-panel'>{translate('confirm.loading')}</div>
      ) : (
        capacity.listCapacity &&
        capacity.listCapacity.length === 0 && <div className='table-info-panel'>{translate('confirm.no_data')}</div>
      )}
      <PaginateBar
        display={capacity.listCapacity?.length}
        total={capacity?.totalDocs}
        pageTotal={capacity?.totalPages}
        currentPage={capacity?.page}
        func={setPage}
      />
    </>
  )
}

function mapStateToProps(state) {
  const { major, capacity } = state
  return { major, capacity }
}

const mapDispatchToProps = {
  // get: CapacityActions.getListCapacity,
  // getListMajor: MajorActions.getListMajor,
  // deleteCapacity: CapacityActions.deleteCapacity
  getListCapacity: CapacityActions.getListCapacity
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CapacityTable))
