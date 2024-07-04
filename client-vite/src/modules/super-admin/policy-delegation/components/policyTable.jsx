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
import { PolicyWizard } from '../wizard/policyWizard'
import { RequesterActions } from '../../../system-admin/requester-management/redux/actions'
import { ResourceActions } from '../../../system-admin/resource-management/redux/actions'

export function PolicyTable() {
  const getTableId = 'table-manage-policy1-hooks'
  const defaultConfig = { limit: 5 }
  const getLimit = getTableConfiguration(getTableId, defaultConfig).limit
  const dispatch = useDispatch()
  const policyDelegation = useSelector((x) => x.policyDelegation)
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
    dispatch(PolicyActions.getPolicies())
    dispatch(RequesterActions.getAll())
    dispatch(ResourceActions.getAll())
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
        page: policyDelegation && policyDelegation.listPaginate && policyDelegation.listPaginate.length === 1 ? page - 1 : page
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
  if (policyDelegation) {
    lists = policyDelegation.listPaginate
  }

  const { totalPages } = policyDelegation

  return (
    <>
      <PolicyEditForm
        policyID={currentRow && currentRow._id}
        name={currentRow && currentRow.name}
        description={currentRow && currentRow.description}
        effect={currentRow && currentRow.effect}
        effectiveStartTime={currentRow && currentRow.effectiveStartTime}
        effectiveEndTime={currentRow && currentRow.effectiveEndTime}
        delegatorAttributes={currentRow && currentRow.delegatorRequirements.attributes}
        delegateObjectAttributes={currentRow && currentRow.delegateObjectRequirements.attributes}
        delegateeAttributes={currentRow && currentRow.delegateeRequirements.attributes}
        environmentAttributes={currentRow && currentRow.environmentRequirements.attributes}
        delegatorRule={currentRow && currentRow.delegatorRequirements.rule}
        delegateObjectRule={currentRow && currentRow.delegateObjectRequirements.rule}
        delegateeRule={currentRow && currentRow.delegateeRequirements.rule}
        environmentRule={currentRow && currentRow.environmentRequirements.rule}
        i={state.i}
        handleChangeAddRowAttribute={handleChangeAddRowAttribute}
      />

      <PolicyDetailInfo policyID={curentRowDetail && curentRowDetail._id} />

      <PolicyCreateForm handleChangeAddRowAttribute={handleChangeAddRowAttribute} i={state.i} />

      <PolicyWizard
        handleChangeAddRowAttribute={handleChangeAddRowAttribute}
        i={state.i}
        id='wizard-delegation-ui'
        delegatorDescription={translate('manage_delegation_policy.wizard.delegator.description_ui')}
        delegateeDescription={translate('manage_delegation_policy.wizard.delegatee.description_ui')}
        delegateObjectDescription={translate('manage_delegation_policy.wizard.delegateObject.description_ui')}
        filterDelegator={(x) => x.type === 'User'}
        filterDelegatee={(x) => x.type === 'User'}
        filterDelegateObject={(x) => x.type === 'Link' || x.type === 'Component'}
      />

      <PolicyWizard
        handleChangeAddRowAttribute={handleChangeAddRowAttribute}
        i={state.i}
        id='wizard-delegation-service'
        delegatorDescription={translate('manage_delegation_policy.wizard.delegator.description_service')}
        delegateeDescription={translate('manage_delegation_policy.wizard.delegatee.description_service')}
        delegateObjectDescription={translate('manage_delegation_policy.wizard.delegateObject.description_service')}
        filterDelegator={(x) => x.type === 'Service' || x.type === 'User'}
        filterDelegatee={(x) => x.type === 'Service'}
        filterDelegateObject={(x) => x.type === 'SystemApi'}
      />

      <div className='box-body qlcv'>
        <div className='form-inline'>
          {/* Button thêm mới */}
          <button
            type='button'
            className='btn btn-success pull-right'
            title={translate('manage_delegation_policy.add_title')}
            onClick={() => window.$('#modal-create-policy-hooks').modal('show')}
          >
            {translate('manage_delegation_policy.add')}
          </button>
          {/* Button wizard */}
          <div className='dropdown pull-right' style={{ marginTop: '5px' }}>
            <button
              type='button'
              className='btn btn-primary dropdown-toggle pull-right'
              data-toggle='dropdown'
              aria-expanded='true'
              title={translate('manage_user.add_title')}
            >
              Wizard
            </button>
            <ul className='dropdown-menu pull-right' style={{ marginTop: 0 }}>
              <li>
                <a
                  style={{ cursor: 'pointer' }}
                  onClick={() => window.$('#modal-wizard-delegation-ui-delegator').modal('show')}
                  title={translate('manage_delegation_policy.wizard.delegation_ui')}
                >
                  {translate('manage_delegation_policy.wizard.delegation_ui')}
                </a>
              </li>
              <li>
                <a
                  style={{ cursor: 'pointer' }}
                  onClick={() => window.$('#modal-wizard-delegation-service-delegator').modal('show')}
                  title={translate('manage_delegation_policy.wizard.delegation_service')}
                >
                  {translate('manage_delegation_policy.wizard.delegation_service')}
                </a>
              </li>
            </ul>
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
            <label className='form-control-static'>{translate('manage_delegation_policy.name')}</label>
            <input
              type='text'
              className='form-control'
              name='name'
              onChange={handleChangePolicyName}
              placeholder={translate('manage_delegation_policy.name')}
              autoComplete='off'
            />
          </div>
          <div className='form-group'>
            <button
              type='button'
              className='btn btn-success'
              title={translate('manage_delegation_policy.search')}
              onClick={() => handleSubmitSearch()}
            >
              {translate('manage_delegation_policy.search')}
            </button>
          </div>
        </div>

        <SmartTable
          tableId={tableId}
          columnData={{
            index: translate('manage_delegation_policy.index'),
            name: translate('manage_delegation_policy.name'),
            description: translate('manage_delegation_policy.description')
          }}
          tableHeaderData={{
            index: (
              <th className='col-fixed' style={{ width: 60 }}>
                {translate('manage_delegation_policy.index')}
              </th>
            ),
            name: <th>{translate('manage_delegation_policy.name')}</th>,
            description: <th>{translate('manage_delegation_policy.description')}</th>,
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
                action: (
                  <td style={{ textAlign: 'center' }}>
                    <a
                      className='edit text-green'
                      style={{ width: '5px' }}
                      title={translate('manage_delegation_policy.detail_info_policy')}
                      onClick={() => handleShowDetailInfo(item)}
                    >
                      <i className='material-icons'>visibility</i>
                    </a>
                    <a
                      className='edit text-yellow'
                      style={{ width: '5px' }}
                      title={translate('manage_delegation_policy.edit')}
                      onClick={() => handleEdit(item)}
                    >
                      <i className='material-icons'>edit</i>
                    </a>
                    <DeleteNotification
                      content={translate('manage_delegation_policy.delete')}
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
        {policyDelegation && policyDelegation.isLoading ? (
          <div className='table-info-panel'>{translate('confirm.loading')}</div>
        ) : (
          (typeof lists === 'undefined' || lists.length === 0) && <div className='table-info-panel'>{translate('confirm.no_data')}</div>
        )}
        <PaginateBar
          pageTotal={totalPages || 0}
          currentPage={page}
          display={lists && lists.length !== 0 && lists.length}
          total={policyDelegation && policyDelegation.totalPolicies}
          func={setPage}
        />
      </div>
    </>
  )
}
