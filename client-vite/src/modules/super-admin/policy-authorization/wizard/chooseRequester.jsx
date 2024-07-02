import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { useTranslate } from 'react-redux-multilingual'
import { DialogModal, SelectBox } from '../../../../common-components'
import { ProposedRequirement } from './proposedRequirement'

export function ChooseRequester(props) {
  const translate = useTranslate()
  // Khởi tạo state
  const [state, setState] = useState({
    selectedRequesterIds: [],
    selectedRequesters: [],
    proposedRequesterAttributes: [],
    proposedRequesterRule: ''
  })

  const { id, next, openEditAttributes, description, filterObject, attributeType, translation } = props
  const allRequester = useSelector((x) => x.requester.list)
  const availableRequesters = allRequester.filter(filterObject)
  const requesterLoading = useSelector((x) => x.requester.isLoading)
  const isLoading = useSelector((x) => x.policyAuthorization.isLoading)
  const attributeList = useSelector((x) => x.attribute.lists.filter((x) => attributeType.includes(x.type)))

  useEffect(() => {
    setState((state) => ({
      ...state,
      selectedRequesters: availableRequesters.filter((x) => state.selectedRequesterIds.includes(x.id))
    }))
  }, [requesterLoading])

  /**
   * Hàm dùng để kiểm tra xem form đã được validate hay chưa
   */
  const isFormValidated = () => {
    if (!state.selectedRequesterIds || !state.selectedRequesterIds.length) {
      return false
    }
    return true
  }

  const handleChangeSelectedRequesters = (value) => {
    const selectedRequesters = availableRequesters.filter((x) => value.includes(x.id))
    setState((state) => ({
      ...state,
      selectedRequesterIds: value,
      selectedRequesters
    }))
  }

  const updateRequirement = (rule, attributes) => {
    setState((state) => ({
      ...state,
      proposedRequesterRule: rule,
      proposedRequesterAttributes: attributes
    }))
  }

  /**
   * Hàm dùng để lưu thông tin của form và gọi service tạo mới ví dụ
   */
  const save = () => {
    next(state.proposedRequesterAttributes, state.proposedRequesterRule)
  }

  const prettyAttributes = (attributes) => {
    let str = ''
    for (let i = 0; i < attributes.length; i++) {
      const attributeName = attributeList.find((x) => x._id === attributes[i].attributeId)?.attributeName
      if (attributeName) {
        str += `${attributeName}: ${attributes[i].value}\n`
      }
    }
    return str
  }

  return (
    <DialogModal
      modalID={`modal-${id}`}
      isLoading={isLoading}
      formID={`form-${id}`}
      title={translate(`manage_authorization_policy.wizard.${translation ?? 'requester'}.title`)}
      msg_success={translate('manage_authorization_policy.add_success')}
      msg_failure={translate('manage_authorization_policy.add_fail')}
      func={save}
      disableSubmit={!isFormValidated()}
      size={75}
      maxWidth={850}
      saveText={translate('manage_authorization_policy.wizard.next')}
    >
      {/* Chooose requesters */}
      <div className={`form-group authorization-wizard-row `}>
        <label>
          <div className='authorization-wizard-title'>
            {translate(`manage_authorization_policy.wizard.${translation ?? 'requester'}.choose`)}
            <span className='text-red'>*</span>
          </div>
          <div className='authorization-wizard-description'>{description}</div>
        </label>
        <SelectBox
          id={`select-${id}`}
          className='form-control select2'
          style={{ width: '100%' }}
          items={availableRequesters.map((x) => ({
            value: x.id,
            text: `${x.name} (${x.type})`
          }))}
          value={state.selectedRequesterIds}
          onChange={handleChangeSelectedRequesters}
          multiple
          options={{ placeholder: 'Choose Requesters' }}
        />
      </div>
      {/* Display authorized requesters */}
      <div className={`form-group authorization-wizard-row `}>
        <label>
          <div className='authorization-wizard-title'>{translate(`manage_authorization_policy.wizard.${translation ?? 'requester'}.authorized`)}</div>
        </label>
        {/* Bảng dữ liệu */}
        <table className='table table-hover table-striped table-bordered' id='table-requester-wizard'>
          <thead>
            <tr>
              <th>{translate('manage_requester.index')}</th>
              <th>{translate('manage_requester.name')}</th>
              <th>{translate('manage_requester.type')}</th>
              <th>{translate('manage_requester.attribute')}</th>
              <th style={{ width: '120px' }}>{translate('table.action')}</th>
            </tr>
          </thead>
          <tbody>
            {state.selectedRequesters.map((x, index) => (
              <tr key={x.id}>
                <td>{index + 1}</td>
                <td>{x.name}</td>
                <td>{x.type}</td>
                <td>
                  <pre>{prettyAttributes(x.attributes)}</pre>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <a className='edit' onClick={() => openEditAttributes(x, 'Requester')}>
                    <i className='material-icons'>edit</i>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Proposed requirement section */}
      <ProposedRequirement
        updateRequirement={updateRequirement}
        selectedObjects={state.selectedRequesters}
        id={`${id}-proposed_requirement`}
        title={translate(`manage_authorization_policy.wizard.${translation ?? 'requester'}.proposed_requirement`)}
        attributeType={attributeType}
      />
    </DialogModal>
  )
}
