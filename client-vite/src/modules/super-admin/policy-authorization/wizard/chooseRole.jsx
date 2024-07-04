import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { useTranslate } from 'react-redux-multilingual'
import { DialogModal, SelectBox } from '../../../../common-components'
import { ProposedRequirement } from './proposedRequirement'

export function ChooseRole(props) {
  const translate = useTranslate()
  // Khởi tạo state
  const [state, setState] = useState({
    selectedRoleIds: [],
    selectedRoles: [],
    proposedRoleAttributes: [],
    proposedRoleRule: ''
  })

  const { id, next, openEditAttributes, description, filterObject, attributeType } = props
  const allRole = useSelector((x) => x.role.list)
  const availableRoles = allRole.filter(filterObject)
  const roleLoading = useSelector((x) => x.role.isLoading)
  const isLoading = useSelector((x) => x.policyAuthorization.isLoading)
  const attributeList = useSelector((x) => x.attribute.lists.filter((x) => attributeType.includes(x.type)))

  useEffect(() => {
    setState((state) => ({
      ...state,
      selectedRoles: availableRoles.filter((x) => state.selectedRoleIds.includes(x.id))
    }))
  }, [roleLoading])

  const handleChangeSelectedRoles = (value) => {
    const selectedRoles = availableRoles.filter((x) => value.includes(x.id))
    setState((state) => ({
      ...state,
      selectedRoleIds: value,
      selectedRoles
    }))
  }

  const updateRequirement = (rule, attributes) => {
    setState((state) => ({
      ...state,
      proposedRoleRule: rule,
      proposedRoleAttributes: attributes
    }))
  }

  /**
   * Hàm dùng để lưu thông tin của form và gọi service tạo mới ví dụ
   */
  const save = () => {
    next(state.proposedRoleAttributes, state.proposedRoleRule)
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
      title={translate('manage_authorization_policy.wizard.role.title')}
      msg_success={translate('manage_authorization_policy.add_success')}
      msg_failure={translate('manage_authorization_policy.add_fail')}
      func={save}
      disableSubmit={false}
      size={75}
      maxWidth={850}
      saveText={translate('manage_authorization_policy.wizard.next')}
    >
      {/* Chooose roles */}
      <div className={`form-group authorization-wizard-row `}>
        <label>
          <div className='authorization-wizard-title'>
            {translate('manage_authorization_policy.wizard.role.choose')}
            <span className='text-red'>*</span>
          </div>
          <div className='authorization-wizard-description'>{description}</div>
          <div className='authorization-wizard-description'>{translate('manage_authorization_policy.wizard.role.note')}</div>
        </label>
        <SelectBox
          id={`select-${id}`}
          className='form-control select2'
          style={{ width: '100%' }}
          items={availableRoles.map((x) => ({
            value: x.id,
            text: `${x.name}`
          }))}
          value={state.selectedRoleIds}
          onChange={handleChangeSelectedRoles}
          multiple
          options={{ placeholder: 'Choose Roles' }}
        />
      </div>
      {/* Display authorized roles */}
      <div className={`form-group authorization-wizard-row `}>
        <label>
          <div className='authorization-wizard-title'>{translate('manage_authorization_policy.wizard.role.authorized')}</div>
        </label>
        {/* Bảng dữ liệu */}
        <table className='table table-hover table-striped table-bordered' id='table-role-wizard'>
          <thead>
            <tr>
              <th>{translate('manage_role.index')}</th>
              <th>{translate('manage_role.name')}</th>
              <th>{translate('manage_role.attributes')}</th>
              <th style={{ width: '120px' }}>{translate('table.action')}</th>
            </tr>
          </thead>
          <tbody>
            {state.selectedRoles.map((x, index) => (
              <tr key={x.id}>
                <td>{index + 1}</td>
                <td>{x.name}</td>
                <td>
                  <pre>{prettyAttributes(x.attributes)}</pre>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <a className='edit' onClick={() => openEditAttributes(x, 'Role')}>
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
        selectedObjects={state.selectedRoles}
        id={`${id}-proposed_requirement`}
        title={translate('manage_authorization_policy.wizard.role.proposed_requirement')}
        attributeType={attributeType}
      />
    </DialogModal>
  )
}
