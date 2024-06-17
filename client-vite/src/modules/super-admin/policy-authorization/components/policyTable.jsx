import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useTranslate } from 'react-redux-multilingual'
import { DeleteNotification, PaginateBar, SmartTable } from '../../../../common-components'

import { PolicyCreateForm } from './policyCreateForm'
import { PolicyEditForm } from './policyEditForm'
import { PolicyDetailInfo } from './policyDetailInfo'
import { AttributeActions } from '../../attribute/redux/actions'
import { PolicyActions } from '../redux/actions'
import { getTableConfiguration } from '../../../../helpers/tableConfiguration'

export function PolicyTable() {
  const getTableId = 'table-manage-policy1-hooks'
  const defaultConfig = { limit: 5 }
  const getLimit = getTableConfiguration(getTableId, defaultConfig).limit
  const dispatch = useDispatch()
  const policyAuthorization = useSelector((x) => x.policyAuthorization)
  const translate = useTranslate()

  // Khởi tạo state
  const [state, setState] = useState({
    name: '',
    page: 1,
    perPage: getLimit,
    tableId: getTableId,
    i: 0
  })
  const [selectedData, setSelectedData] = useState()

  const { name, page, perPage, currentRow, curentRowDetail, tableId } = state

  useEffect(() => {
    dispatch(PolicyActions.getPolicies({ name, page, perPage }))
    dispatch(AttributeActions.getAttributes())
  }, [])

  const handleChangeAddRowAttribute = (name, value) => {
    setState({
      ...state,
      [name]: value
    })
  }

  /**
   * Hàm xử lý khi tên ví dụ thay đổi
   * @param {*} e
   */
  const handleChangePolicyName = (e) => {
    const { value } = e.target
    setState({
      ...state,
      name: value
    })
  }

  /**
   * Hàm xử lý khi click nút tìm kiếm
   */
  const handleSubmitSearch = () => {
    dispatch(
      PolicyActions.getPolicies({
        name,
        perPage,
        page: 1
      })
    )
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

    dispatch(
      PolicyActions.getPolicies({
        name,
        perPage,
        page: parseInt(pageNumber)
      })
    )
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
    dispatch(
      PolicyActions.getPolicies({
        name,
        perPage: parseInt(number),
        page: 1
      })
    )
  }

  /**
   * Hàm xử lý khi click xóa 1 ví dụ
   * @param {*} id của ví dụ cần xóa
   */
  const handleDelete = (id) => {
    dispatch(
      PolicyActions.deletePolicies({
        policyIds: [id]
      })
    )
    dispatch(
      PolicyActions.getPolicies({
        name,
        perPage,
        page: policyAuthorization && policyAuthorization.listPaginate && policyAuthorization.listPaginate.length === 1 ? page - 1 : page
      })
    )
  }

  const onSelectedRowsChange = (value) => {
    setSelectedData(value)
  }

  const handleDeleteOptions = () => {
    dispatch(
      PolicyActions.deletePolicies({
        policyIds: selectedData
      })
    )
  }

  /**
   * Hàm xử lý khi click edit một ví vụ
   * @param {*} policy thông tin của ví dụ cần chỉnh sửa
   */
  const handleEdit = (policy) => {
    setState({
      ...state,
      currentRow: policy
    })
    window.$('#modal-edit-policy-hooks').modal('show')
  }

  /**
   * Hàm xử lý khi click xem chi tiết một ví dụ
   * @param {*} policy thông tin của ví dụ cần xem
   */
  const handleShowDetailInfo = (policy) => {
    setState({
      ...state,
      curentRowDetail: policy
    })
    window.$(`#modal-detail-info-policy-hooks`).modal('show')
  }

  let lists = []
  if (policyAuthorization) {
    lists = policyAuthorization.listPaginate
  }

  const { totalPages } = policyAuthorization

  return (
    <>
      <PolicyEditForm
        policyID={currentRow && currentRow._id}
        name={currentRow && currentRow.name}
        description={currentRow && currentRow.description}
        effect={currentRow && currentRow.effect}
        effectiveStartTime={currentRow && currentRow.effectiveStartTime}
        effectiveEndTime={currentRow && currentRow.effectiveEndTime}
        requesterAttributes={currentRow && currentRow.requesterRequirements.attributes}
        roleAttributes={currentRow && currentRow.roleRequirements.attributes}
        resourceAttributes={currentRow && currentRow.resourceRequirements.attributes}
        environmentAttributes={currentRow && currentRow.environmentRequirements.attributes}
        requesterRule={currentRow && currentRow.requesterRequirements.rule}
        roleRule={currentRow && currentRow.roleRequirements.rule}
        resourceRule={currentRow && currentRow.resourceRequirements.rule}
        environmentRule={currentRow && currentRow.environmentRequirements.rule}
        i={state.i}
        handleChangeAddRowAttribute={handleChangeAddRowAttribute}
      />

      <PolicyDetailInfo policyID={curentRowDetail && curentRowDetail._id} />

      <PolicyCreateForm handleChangeAddRowAttribute={handleChangeAddRowAttribute} i={state.i} />

      <div className='box-body qlcv'>
        <div className='form-inline'>
          {/* Button thêm mới */}
          <div className='dropdown pull-right' style={{ marginTop: '5px' }}>
            <button
              type='button'
              className='btn btn-success pull-right'
              title={translate('manage_authorization_policy.add_title')}
              onClick={() => window.$('#modal-create-policy-hooks').modal('show')}
            >
              {translate('manage_authorization_policy.add')}
            </button>
            {/* <ul className="dropdown-menu pull-right" style={{ marginTop: 0 }}>
                            <li><a style={{ cursor: 'pointer' }} onClick={() => window.$('#modal-create-policy-hooks').modal('show')} title={translate('manage_authorization_policy.add_one_policy')}>
                                {translate('manage_authorization_policy.add_policy')}</a></li>
                            <li><a style={{ cursor: 'pointer' }} onClick={() => window.$('#modal-import-file-policy-hooks').modal('show')} title={translate('manage_authorization_policy.add_multi_policy')}>
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
            <label className='form-control-static'>{translate('manage_authorization_policy.name')}</label>
            <input
              type='text'
              className='form-control'
              name='name'
              onChange={handleChangePolicyName}
              placeholder={translate('manage_authorization_policy.name')}
              autoComplete='off'
            />
          </div>
          <div className='form-group'>
            <button
              type='button'
              className='btn btn-success'
              title={translate('manage_authorization_policy.search')}
              onClick={() => handleSubmitSearch()}
            >
              {translate('manage_authorization_policy.search')}
            </button>
          </div>
        </div>

        <SmartTable
          tableId={tableId}
          columnData={{
            index: translate('manage_authorization_policy.index'),
            name: translate('manage_authorization_policy.name'),
            description: translate('manage_authorization_policy.description'),
            effectiveStartTime: translate('manage_authorization_policy.effective_start_time'),
            effectiveEndTime: translate('manage_authorization_policy.effective_end_time'),
            effect: translate('manage_authorization_policy.effect')
          }}
          tableHeaderData={{
            index: (
              <th className='col-fixed' style={{ width: 60 }}>
                {translate('manage_authorization_policy.index')}
              </th>
            ),
            name: <th>{translate('manage_authorization_policy.name')}</th>,
            description: <th>{translate('manage_authorization_policy.description')}</th>,
            effect: <th>{translate('manage_authorization_policy.effect')}</th>,
            effectiveStartTime: <th>{translate('manage_authorization_policy.effective_start_time')}</th>,
            effectiveEndTime: <th>{translate('manage_authorization_policy.effective_end_time')}</th>,
            action: <th style={{ width: '120px', textAlign: 'center' }}>{translate('general.action')}</th>
          }}
          tableBodyData={
            lists?.length > 0 &&
            lists.map((item, index) => {
              return {
                id: item?._id,
                index: <td>{index + 1}</td>,
                name: <td>{item?.name}</td>,
                description: <td>{item?.description}</td>,
                effect: <td>{item?.effect}</td>,
                effectiveStartTime: <td>{item?.effectiveStartTime}</td>,
                effectiveEndTime: <td>{item?.effectiveEndTime}</td>,
                action: (
                  <td style={{ textAlign: 'center' }}>
                    <a
                      className='edit text-green'
                      style={{ width: '5px' }}
                      title={translate('manage_authorization_policy.detail_info_policy')}
                      onClick={() => handleShowDetailInfo(item)}
                    >
                      <i className='material-icons'>visibility</i>
                    </a>
                    <a
                      className='edit text-yellow'
                      style={{ width: '5px' }}
                      title={translate('manage_authorization_policy.edit')}
                      onClick={() => handleEdit(item)}
                    >
                      <i className='material-icons'>edit</i>
                    </a>
                    <DeleteNotification
                      content={translate('manage_authorization_policy.delete')}
                      data={{
                        id: item._id,
                        info: item.name
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
        {policyAuthorization && policyAuthorization.isLoading ? (
          <div className='table-info-panel'>{translate('confirm.loading')}</div>
        ) : (
          (typeof lists === 'undefined' || lists.length === 0) && <div className='table-info-panel'>{translate('confirm.no_data')}</div>
        )}
        <PaginateBar
          pageTotal={totalPages || 0}
          currentPage={page}
          display={lists && lists.length !== 0 && lists.length}
          total={policyAuthorization && policyAuthorization.totalPolicies}
          func={setPage}
        />
      </div>
    </>
  )
}
