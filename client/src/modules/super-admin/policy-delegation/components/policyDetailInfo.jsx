import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import withTranslate from 'react-redux-multilingual/lib/withTranslate'
import './policyAttributeTable.css'

import { DialogModal } from '../../../../common-components'

const PolicyDetailInfo = (props) => {
  const [state, setState] = useState({
    policyID: undefined
  })

  const { translate, policyDelegation, attribute } = props
  const { policyID } = state

  // Nhận giá trị từ component cha
  useEffect(() => {
    if (props.policyID !== policyID || props.curentRowDetail != state.curentRowDetail) {
      setState({
        ...state,
        curentRowDetail: props.curentRowDetail,
        policyID: props.policyID,
        policyName: props.policyName,
        description: props.description,
        delegatorAttributes: props.delegatorAttributes,
        delegateeAttributes: props.delegateeAttributes,
        delegatedObjectAttributes: props.delegatedObjectAttributes,
        resourceAttributes: props.resourceAttributes,
        delegatorRule: props.delegatorRule,
        delegateeRule: props.delegateeRule,
        delegatedObjectRule: props.delegatedObjectRule,
        resourceRule: props.resourceRule,
        delegateType: props.delegateType
      })
    }
  }, [props.policyID, props.curentRowDetail])

  const {
    delegateType,
    policyName,
    description,
    delegatorRule,
    delegateeRule,
    delegatedObjectRule,
    resourceRule,
    delegatorAttributes,
    delegateeAttributes,
    delegatedObjectAttributes,
    resourceAttributes
  } = state

  return (
    <React.Fragment>
      <DialogModal
        modalID={`modal-detail-info-policy-hooks`}
        isLoading={policyDelegation.isLoading}
        title={translate('manage_delegation_policy.detail_info_policy')}
        formID={`form-detail-policy-hooks`}
        hasSaveButton={false}
        hasNote={false}
        size={50}
      >
        {/* Tên ví dụ */}
        <div className={`form-group`}>
          <label>{translate('manage_delegation_policy.policyName')}:</label>
          <span> {policyName}</span>
        </div>

        {/* Mô tả ví dụ */}
        <div className={`form-group`}>
          <label>{translate('manage_delegation_policy.description')}:</label>
          <span> {description}</span>
        </div>

        <div className={`form-group`}>
          <label>{translate('manage_delegation_policy.delegateType')}:</label>
          <span> {translate('manage_delegation_policy.delegateType' + delegateType)}</span>
        </div>

        <div className={`form-group`}>
          <label>{translate('manage_delegation_policy.delegation_information')}:</label>
          <table className='table table-hover table-bordered detail-policy-attribute-table not-sort'>
            <thead>
              <tr>
                <th style={{ width: '25%' }}>
                  <label>{translate('manage_delegation_policy.attribute_owner_table')}</label>
                </th>
                <th style={{ width: '15%' }}>
                  <label>{translate('manage_delegation_policy.rule_table')}</label>
                </th>
                <th style={{ width: '45%' }}>
                  <label>{translate('manage_delegation_policy.attribute_name')}</label>
                </th>
                <th style={{ width: '15%' }}>
                  <label>{translate('manage_delegation_policy.attribute_value')}</label>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td rowSpan={!delegatorAttributes || delegatorAttributes.length == 0 ? 1 : delegatorAttributes.length + 1}>
                  {translate('manage_delegation_policy.delegator_table')}
                </td>
                {!delegatorAttributes || delegatorAttributes.length == 0 ? (
                  <td colSpan={3}>
                    <center> {translate('table.no_data')}</center>
                  </td>
                ) : (
                  <React.Fragment>
                    <td rowSpan={delegatorAttributes.length + 1}>{delegatorRule}</td>
                  </React.Fragment>
                )}
              </tr>
              {!delegatorAttributes || delegatorAttributes.length <= 0
                ? null
                : delegatorAttributes.map((attr, index) => {
                    return (
                      <tr key={index}>
                        <td>{attribute.lists.map((a) => (a._id == attr.attributeId ? a.attributeName : ''))}</td>

                        <td style={{ textAlign: 'left' }}>{attr.value}</td>
                      </tr>
                    )
                  })}

              <tr>
                <td rowSpan={!delegateeAttributes || delegateeAttributes.length == 0 ? 1 : delegateeAttributes.length + 1}>
                  {translate('manage_delegation_policy.delegatee_table')}
                </td>
                {!delegateeAttributes || delegateeAttributes.length == 0 ? (
                  <td colSpan={3}>
                    <center> {translate('table.no_data')}</center>
                  </td>
                ) : (
                  <React.Fragment>
                    <td rowSpan={delegateeAttributes.length + 1}>{delegateeRule}</td>
                  </React.Fragment>
                )}
              </tr>
              {!delegateeAttributes || delegateeAttributes.length <= 0
                ? null
                : delegateeAttributes.map((attr, index) => {
                    return (
                      <tr key={index}>
                        <td>{attribute.lists.map((a) => (a._id == attr.attributeId ? a.attributeName : ''))}</td>

                        <td style={{ textAlign: 'left' }}>{attr.value}</td>
                      </tr>
                    )
                  })}

              <tr>
                <td
                  rowSpan={!delegatedObjectAttributes || delegatedObjectAttributes.length == 0 ? 1 : delegatedObjectAttributes.length + 1}
                >
                  {delegateType == 'Role'
                    ? translate('manage_delegation_policy.delegatedObject_table')
                    : translate('manage_delegation_policy.delegatedObject_tableTask')}
                </td>
                {!delegatedObjectAttributes || delegatedObjectAttributes.length == 0 ? (
                  <td colSpan={3}>
                    <center> {translate('table.no_data')}</center>
                  </td>
                ) : (
                  <React.Fragment>
                    <td rowSpan={delegatedObjectAttributes.length + 1}>{delegatedObjectRule}</td>
                  </React.Fragment>
                )}
              </tr>
              {!delegatedObjectAttributes || delegatedObjectAttributes.length <= 0
                ? null
                : delegatedObjectAttributes.map((attr, index) => {
                    return (
                      <tr key={index}>
                        <td>{attribute.lists.map((a) => (a._id == attr.attributeId ? a.attributeName : ''))}</td>

                        <td style={{ textAlign: 'left' }}>{attr.value}</td>
                      </tr>
                    )
                  })}

              {delegateType == 'Role' ? (
                <tr>
                  <td rowSpan={!resourceAttributes || resourceAttributes.length == 0 ? 1 : resourceAttributes.length + 1}>
                    {translate('manage_delegation_policy.resource_table')}
                  </td>
                  {!resourceAttributes || resourceAttributes.length == 0 ? (
                    <td colSpan={3}>
                      <center> {translate('table.no_data')}</center>
                    </td>
                  ) : (
                    <React.Fragment>
                      <td rowSpan={resourceAttributes.length + 1}>{resourceRule}</td>
                    </React.Fragment>
                  )}
                </tr>
              ) : null}
              {delegateType == 'Role'
                ? !resourceAttributes || resourceAttributes.length <= 0
                  ? null
                  : resourceAttributes.map((attr, index) => {
                      return (
                        <tr key={index}>
                          <td>{attribute.lists.map((a) => (a._id == attr.attributeId ? a.attributeName : ''))}</td>

                          <td style={{ textAlign: 'left' }}>{attr.value}</td>
                        </tr>
                      )
                    })
                : null}
            </tbody>
          </table>
        </div>
      </DialogModal>
    </React.Fragment>
  )
}

function mapStateToProps(state) {
  const { policyDelegation, attribute } = state
  return { policyDelegation, attribute }
}

const connectedPolicyDetailInfo = React.memo(connect(mapStateToProps, null)(withTranslate(PolicyDetailInfo)))
export { connectedPolicyDetailInfo as PolicyDetailInfo }
