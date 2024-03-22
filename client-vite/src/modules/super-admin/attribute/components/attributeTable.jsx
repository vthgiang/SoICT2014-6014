import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { DeleteNotification, PaginateBar, SmartTable } from '../../../../common-components'

import { AttributeCreateForm } from './attributeCreateForm'
import { AttributeEditForm } from './attributeEditForm'
import { AttributeDetailInfo } from './attributeDetailInfo'
import { AttributeImportForm } from './attributeImortForm'

import { AttributeActions } from '../redux/actions'
import { getTableConfiguration } from '../../../../helpers/tableConfiguration'

function AttributeTable(props) {
  const getTableId = 'table-manage-attribute1-hooks'
  const defaultConfig = { limit: 5 }
  const getLimit = getTableConfiguration(getTableId, defaultConfig).limit

  // Khởi tạo state
  const [state, setState] = useState({
    attributeName: '',
    page: 1,
    perPage: getLimit,
    tableId: getTableId
  })
  const [selectedData, setSelectedData] = useState()

  const { attribute, translate } = props
  const { attributeName, page, perPage, currentRow, curentRowDetail, tableId } = state

  useEffect(() => {
    props.getAttributes({ attributeName, page, perPage })
  }, [])

  /**
   * Hàm xử lý khi tên ví dụ thay đổi
   * @param {*} e
   */
  const handleChangeAttributeName = (e) => {
    const { value } = e.target
    setState({
      ...state,
      attributeName: value
    })
  }

  /**
   * Hàm xử lý khi click nút tìm kiếm
   */
  const handleSubmitSearch = () => {
    props.getAttributes({
      attributeName,
      perPage,
      page: 1
    })
    setState({
      ...state,
      page: 1
    })
  }

  /**
   * Hàm xử lý khi click chuyển trang
   * @param {*} pageNumber Số trang định chuyển
   */
  const setPage = (pageNumber) => {
    setState({
      ...state,
      page: parseInt(pageNumber)
    })

    props.getAttributes({
      attributeName,
      perPage,
      page: parseInt(pageNumber)
    })
  }

  /**
   * Hàm xử lý thiết lập giới hạn hiển thị số bản ghi
   * @param {*} number số bản ghi sẽ hiển thị
   */
  const setLimit = (number) => {
    setState({
      ...state,
      perPage: parseInt(number),
      page: 1
    })
    props.getAttributes({
      attributeName,
      perPage: parseInt(number),
      page: 1
    })
  }

  /**
   * Hàm xử lý khi click xóa 1 ví dụ
   * @param {*} id của ví dụ cần xóa
   */
  const handleDelete = (id) => {
    props.deleteAttributes({
      attributeIds: [id]
    })
    props.getAttributes({
      attributeName,
      perPage,
      page: attribute && attribute.lists && attribute.lists.length === 1 ? page - 1 : page
    })
  }

  const onSelectedRowsChange = (value) => {
    setSelectedData(value)
  }

  const handleDeleteOptions = () => {
    props.deleteAttributes({
      attributeIds: selectedData
    })
  }

  /**
   * Hàm xử lý khi click edit một ví vụ
   * @param {*} attribute thông tin của ví dụ cần chỉnh sửa
   */
  const handleEdit = (attribute) => {
    setState({
      ...state,
      currentRow: attribute
    })
    window.$('#modal-edit-attribute-hooks').modal('show')
  }

  /**
   * Hàm xử lý khi click xem chi tiết một ví dụ
   * @param {*} attribute thông tin của ví dụ cần xem
   */
  const handleShowDetailInfo = (attribute) => {
    setState({
      ...state,
      curentRowDetail: attribute
    })
    window.$(`#modal-detail-info-attribute-hooks`).modal('show')
  }

  let lists = []
  if (attribute) {
    lists = attribute.lists
  }

  const totalPage = attribute && Math.ceil(attribute.totalList / perPage)

  return (
    <React.Fragment>
      <AttributeEditForm
        attributeID={currentRow && currentRow._id}
        attributeName={currentRow && currentRow.attributeName}
        description={currentRow && currentRow.description}
        type={currentRow && currentRow.type}
      />

      <AttributeDetailInfo
        attributeID={curentRowDetail && curentRowDetail._id}
        attributeName={curentRowDetail && curentRowDetail.attributeName}
        description={curentRowDetail && curentRowDetail.description}
        type={curentRowDetail && curentRowDetail.type}
      />

      <AttributeCreateForm page={page} perPage={perPage} />

      <AttributeImportForm page={page} perPage={perPage} />

      <div className='box-body qlcv'>
        <div className='form-inline'>
          {/* Button thêm mới */}
          <div className='dropdown pull-right' style={{ marginTop: '5px' }}>
            <button
              type='button'
              className='btn btn-success pull-right'
              onClick={() => window.$('#modal-create-attribute-hooks').modal('show')}
              title={translate('manage_attribute.add_title')}
            >
              {translate('manage_attribute.add')}
            </button>
            {/* <ul className="dropdown-menu pull-right" style={{ marginTop: 0 }}>
                            <li><a style={{ cursor: 'pointer' }} onClick={() => window.$('#modal-create-attribute-hooks').modal('show')} title={translate('manage_attribute.add_one_attribute')}>
                                {translate('manage_attribute.add_attribute')}</a></li>
                            <li><a style={{ cursor: 'pointer' }} onClick={() => window.$('#modal-import-file-attribute-hooks').modal('show')} title={translate('manage_attribute.add_multi_attribute')}>
                                {translate('human_resource.salary.add_import')}</a></li>
                        </ul> */}
          </div>
          {selectedData?.length > 0 && (
            <button
              type='button'
              className='btn btn-danger pull-right'
              title={translate('general.delete_option')}
              onClick={() => handleDeleteOptions()}
            >
              {translate('general.delete_option')}
            </button>
          )}

          {/* Tìm kiếm */}
          <div className='form-group'>
            <label className='form-control-static'>{translate('manage_attribute.attributeName')}</label>
            <input
              type='text'
              className='form-control'
              name='attributeName'
              onChange={handleChangeAttributeName}
              placeholder={translate('manage_attribute.attributeName')}
              autoComplete='off'
            />
          </div>
          <div className='form-group'>
            <button
              type='button'
              className='btn btn-success'
              title={translate('manage_attribute.search')}
              onClick={() => handleSubmitSearch()}
            >
              {translate('manage_attribute.search')}
            </button>
          </div>
        </div>

        <SmartTable
          tableId={tableId}
          columnData={{
            index: translate('manage_attribute.index'),
            attributeName: translate('manage_attribute.attributeName'),
            type: translate('manage_attribute.add_type'),
            description: translate('manage_attribute.description')
          }}
          tableHeaderData={{
            index: (
              <th className='col-fixed' style={{ width: 60 }}>
                {translate('manage_attribute.index')}
              </th>
            ),
            attributeName: <th>{translate('manage_attribute.attributeName')}</th>,
            type: <th>{translate('manage_attribute.add_type')}</th>,
            description: <th>{translate('manage_attribute.description')}</th>,
            action: <th style={{ width: '120px', textAlign: 'center' }}>{translate('general.action')}</th>
          }}
          tableBodyData={
            lists?.length > 0 &&
            lists.map((item, index) => {
              return {
                id: item?._id,
                index: <td>{index + 1}</td>,
                attributeName: <td>{item?.attributeName}</td>,
                type: <td>{translate('manage_attribute.type' + '.' + item?.type)}</td>,
                description: <td>{item?.description}</td>,
                action: (
                  <td style={{ textAlign: 'center' }}>
                    <a
                      className='edit text-green'
                      style={{ width: '5px' }}
                      title={translate('manage_attribute.detail_info_attribute')}
                      onClick={() => handleShowDetailInfo(item)}
                    >
                      <i className='material-icons'>visibility</i>
                    </a>
                    <a
                      className='edit text-yellow'
                      style={{ width: '5px' }}
                      title={translate('manage_attribute.edit')}
                      onClick={() => handleEdit(item)}
                    >
                      <i className='material-icons'>edit</i>
                    </a>
                    <DeleteNotification
                      content={translate('manage_attribute.delete')}
                      data={{
                        id: item._id,
                        info: item.attributeName
                      }}
                      func={handleDelete}
                    />
                  </td>
                )
              }
            })
          }
          dataDependency={lists}
          onSetNumberOfRowsPerpage={setLimit}
          onSelectedRowsChange={onSelectedRowsChange}
        />

        {/* PaginateBar */}
        {attribute && attribute.isLoading ? (
          <div className='table-info-panel'>{translate('confirm.loading')}</div>
        ) : (
          (typeof lists === 'undefined' || lists.length === 0) && <div className='table-info-panel'>{translate('confirm.no_data')}</div>
        )}
        <PaginateBar
          pageTotal={totalPage ? totalPage : 0}
          currentPage={page}
          display={lists && lists.length !== 0 && lists.length}
          total={attribute && attribute.totalList}
          func={setPage}
        />
      </div>
    </React.Fragment>
  )
}

function mapState(state) {
  const attribute = state.attribute
  return { attribute }
}

const actions = {
  getAttributes: AttributeActions.getAttributes,
  deleteAttributes: AttributeActions.deleteAttributes
}

const connectedAttributeTable = connect(mapState, actions)(withTranslate(AttributeTable))
export { connectedAttributeTable as AttributeTable }
