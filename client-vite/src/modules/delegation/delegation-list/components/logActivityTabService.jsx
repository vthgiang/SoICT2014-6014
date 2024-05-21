import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import moment from 'moment'
import { ShowMoreShowLess } from '../../../../common-components'
import { colorfyLog } from './functionHelper'
import 'moment/locale/vi'
import { UserActions } from '../../../super-admin/user/redux/actions'

function LogActivityTabService(props) {
  const [state, setState] = useState({
    delegationName: '',
    description: ''
  })

  const { translate, getUser } = props
  const { user } = props
  const {
    delegationID,
    delegationName,
    description,
    delegator,
    delegatee,
    delegateType,
    status,
    startDate,
    endDate,
    revokedDate,
    revokeReason,
    logs
  } = props

  useEffect(() => {
    if (!user?.list || user.list.length === 0) {
      getUser()
    }
  }, [])

  // setState từ props mới
  useEffect(() => {
    if (delegationID !== state.delegationID || logs !== state.logs) {
      setState({
        ...state,
        delegationID,
        delegationName,
        description,
        delegator,
        delegatee,
        delegateType,
        status,
        startDate,
        endDate,
        revokedDate,
        revokeReason,
        logs
      })
    }
  }, [delegationID, logs])

  return (
    <div id={props.id} className='tab-pane'>
      {logs && (
        <ShowMoreShowLess id={`detail_log_activity_${delegationID}`} styleShowMoreLess={{ display: 'inline-block', marginBotton: 15 }}>
          {logs.map((item, index) => (
            <div key={item._id} className={`item-box ${index > 5 ? 'hide-component' : ''}`}>
              <a style={{ fontWeight: 700, cursor: 'pointer' }}>
                {item.user
                  ? user.list.find((x) => x._id == item.user)?.name
                  : `${translate('manage_delegation.log_activity_tab.system')} - ${translate('manage_delegation.log_activity_tab.automatic')}`}{' '}
              </a>
              <br />
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
  const { user } = state
  return { user }
}

const actionCreators = {
  getUser: UserActions.get
}
const logActivityTabService = connect(mapState, actionCreators)(withTranslate(LogActivityTabService))
export { logActivityTabService as LogActivityTabService }
