import React, { Component, useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { ShowMoreShowLess } from '../../../../common-components'
import { colorfyLog } from './functionHelper'
import moment from 'moment'
import 'moment/locale/vi'

function LogActivityTab(props) {
  const [state, setState] = useState({
    name: '',
    description: ''
  })

  // setState từ props mới
  useEffect(() => {
    if (props.delegationID !== state.delegationID || props.logs !== state.logs) {
      setState({
        ...state,
        delegationID: props.delegationID,
        name: props.name,
        description: props.description,
        delegator: props.delegator,
        delegatee: props.delegatee,
        delegatePrivileges: props.delegatePrivileges,
        delegateType: props.delegateType,
        delegateObject: props.delegateObject,
        status: props.status,
        allPrivileges: props.allPrivileges,
        startDate: props.startDate,
        endDate: props.endDate,
        revokedDate: props.revokedDate,
        revokeReason: props.revokeReason,
        logs: props.logs
      })
    }
  }, [props.delegationID, props.logs])

  const { translate } = props
  const { delegationID, delegator, delegatee, startDate, endDate, revokedDate, logs } = state

  return (
    <div id={props.id} className='tab-pane'>
      {logs && (
        <ShowMoreShowLess id={`detail_log_activity_${delegationID}`} styleShowMoreLess={{ display: 'inline-block', marginBotton: 15 }}>
          {logs.map((item, index) => (
            <div key={item._id} className={`item-box ${index > 5 ? 'hide-component' : ''}`}>
              <a style={{ fontWeight: 700, cursor: 'pointer' }}>
                {item.requester
                  ? item.requester == delegator._id
                    ? delegator.name
                    : delegatee.name
                  : translate('manage_delegation.log_activity_tab.system')}{' '}
              </a>
              <span> - </span>
              <span
                style={{ fontStyle: 'italic' }}
                className={item.requester ? (item.requester == delegator._id ? 'text-green' : 'text-red') : 'text-orange'}
              >
                {item.requester
                  ? item.requester == delegator._id
                    ? translate('manage_delegation.delegator')
                    : translate('manage_delegation.delegate_receiver')
                  : translate('manage_delegation.log_activity_tab.automatic')}
              </span>
              <br></br>
              {colorfyLog(item.category, translate)}
              <span style={{ fontWeight: 600 }}>{item.content ? item.content : ''}</span>&nbsp;
              <span>({moment(item.time).format('HH:mm:ss DD/MM/YYYY')})</span>
            </div>
          ))}
        </ShowMoreShowLess>
      )}
    </div>
  )
}

function mapState(state) {
  const { delegation } = state
  return { delegation }
}

const actionCreators = {}
const logActivityTab = connect(mapState, actionCreators)(withTranslate(LogActivityTab))
export { logActivityTab as LogActivityTab }
