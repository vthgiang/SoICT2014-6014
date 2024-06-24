import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { useTranslate } from 'react-redux-multilingual'
import { DialogModal, SelectBox } from '../../../../common-components'
import { ProposedRequirement } from './proposedRequirement'

export function ChooseResource(props) {
  const translate = useTranslate()
  // Khởi tạo state
  const [state, setState] = useState({
    selectedResourceIds: [],
    selectedResources: [],
    proposedResourceAttributes: [],
    proposedResourceRule: ''
  })

  const { id, next, openEditAttributes, description, filterObject } = props
  const allResource = useSelector((x) => x.resource.list)
  const availableResources = allResource.filter(filterObject)
  const resourceLoading = useSelector((x) => x.resource.isLoading)
  const isLoading = useSelector((x) => x.policyAuthorization.isLoading)
  const attributeList = useSelector((x) => x.attribute.lists)

  useEffect(() => {
    setState((state) => ({
      ...state,
      selectedResources: availableResources.filter((x) => state.selectedResourceIds.includes(x.id))
    }))
  }, [resourceLoading])

  /**
   * Hàm dùng để kiểm tra xem form đã được validate hay chưa
   */
  const isFormValidated = () => {
    if (!state.selectedResourceIds || !state.selectedResourceIds.length) {
      return false
    }
    return true
  }

  const handleChangeSelectedResources = (value) => {
    const selectedResources = availableResources.filter((x) => value.includes(x.id))
    setState((state) => ({
      ...state,
      selectedResourceIds: value,
      selectedResources
    }))
  }

  const updateRequirement = (rule, attributes) => {
    setState((state) => ({
      ...state,
      proposedResourceRule: rule,
      proposedResourceAttributes: attributes
    }))
  }

  /**
   * Hàm dùng để lưu thông tin của form và gọi service tạo mới ví dụ
   */
  const save = () => {
    next(state.proposedResourceAttributes, state.proposedResourceRule)
  }

  const prettyAttributes = (attributes) => {
    let str = ''
    for (let i = 0; i < attributes.length; i++) {
      const attributeName = attributeList.find((x) => x._id === attributes[i].attributeId)?.attributeName
      str += `${attributeName}: ${attributes[i].value}\n`
    }
    return str
  }

  return (
    <DialogModal
      modalID={`modal-${id}`}
      isLoading={isLoading}
      formID={`form-${id}`}
      title={translate('manage_authorization_policy.wizard.resource.title')}
      msg_success={translate('manage_authorization_policy.add_success')}
      msg_failure={translate('manage_authorization_policy.add_fail')}
      func={save}
      disableSubmit={!isFormValidated()}
      size={75}
      maxWidth={850}
      saveText={translate('manage_authorization_policy.wizard.next')}
    >
      {/* Chooose resources */}
      <div className={`form-group authorization-wizard-row `}>
        <label>
          <div className='authorization-wizard-title'>
            {translate('manage_authorization_policy.wizard.resource.choose')}
            <span className='text-red'>*</span>
          </div>
          <div className='authorization-wizard-description'>{description}</div>
        </label>
        <SelectBox
          id={`select-${id}`}
          className='form-control select2'
          style={{ width: '100%' }}
          items={availableResources.map((x) => ({
            value: x.id,
            text: `${x.name} (${x.type})`
          }))}
          value={state.selectedResourceIds}
          onChange={handleChangeSelectedResources}
          multiple
          options={{ placeholder: 'Choose Resources' }}
        />
      </div>
      {/* Display authorized resources */}
      <div className={`form-group authorization-wizard-row `}>
        <label>
          <div className='authorization-wizard-title'>{translate('manage_authorization_policy.wizard.resource.authorized')}</div>
        </label>
        {/* Bảng dữ liệu */}
        <table className='table table-hover table-striped table-bordered' id='table-resource-wizard'>
          <thead>
            <tr>
              <th>{translate('manage_resource.index')}</th>
              <th>{translate('manage_resource.name')}</th>
              <th>{translate('manage_resource.type')}</th>
              <th>{translate('manage_resource.attribute')}</th>
              <th style={{ width: '120px' }}>{translate('table.action')}</th>
            </tr>
          </thead>
          <tbody>
            {state.selectedResources.map((x, index) => (
              <tr key={x.id}>
                <td>{index + 1}</td>
                <td>{x.name}</td>
                <td>{x.type}</td>
                <td>
                  <pre>{prettyAttributes(x.attributes)}</pre>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <a className='edit' onClick={() => openEditAttributes(x, 'Resource')}>
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
        selectedObjects={state.selectedResources}
        id={`${id}-proposed_requirement`}
        title={translate('manage_authorization_policy.wizard.resource.proposed_requirement')}
      />
    </DialogModal>
  )
}
