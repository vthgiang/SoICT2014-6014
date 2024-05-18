import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { DisciplineActions } from '../../commendation-discipline/redux/actions'
function areEqual(prevProps, nextProps) {
  if (
    prevProps.user._id === nextProps.user._id &&
    prevProps.search === nextProps.search &&
    prevProps.email === nextProps.email &&
    JSON.stringify(prevProps.discipline.listCommendations) === JSON.stringify(nextProps.discipline.listCommendations)
  ) {
    return true
  } else {
    return false
  }
}

function CommendationUser(props) {
  useEffect(() => {
    if (props.unitId) {
      props.getListPraise({
        organizationalUnits: props.unitId,
        employeeName: props.user.name,
        startDate: props.startDate,
        endDate: props.endDate,
        page: 0,
        limit: 100000
      })
    }
  }, [props.user._id, props.search])
  const formatDate = (date, monthYear = false) => {
    if (date) {
      let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear()

      if (month.length < 2) month = '0' + month
      if (day.length < 2) day = '0' + day

      if (monthYear === true) {
        return [month, year].join('-')
      } else return [day, month, year].join('-')
    }

    return date
  }
  const { discipline, translate } = props
  let { listCommendations } = discipline
  return (
    <React.Fragment>
      <table className='table table-striped table-bordered table-hover' style={{ marginBottom: 0 }}>
        <thead>
          <tr>
            <th>{translate('human_resource.commendation_discipline.commendation.table.decision_date')}</th>
            <th>{translate('human_resource.commendation_discipline.commendation.table.decision_number')}</th>
            <th>{translate('human_resource.commendation_discipline.commendation.table.reward_forms')}</th>
            <th>{translate('human_resource.commendation_discipline.commendation.table.reason_praise')}</th>
          </tr>
        </thead>
        <tbody>
          {listCommendations &&
            listCommendations.length !== 0 &&
            listCommendations.map((x, index) => {
              return (
                <tr key={index}>
                  <td>{formatDate(x.startDate)}</td>
                  <td>{x.decisionNumber}</td>
                  <td>{x.type}</td>
                  <td>{x.reason}</td>
                </tr>
              )
            })}
        </tbody>
      </table>
      {discipline.isLoading ? (
        <div className='table-info-panel'>{translate('confirm.loading')}</div>
      ) : (
        (!listCommendations || listCommendations.length === 0) && <div className='table-info-panel'>{translate('confirm.no_data')}</div>
      )}
    </React.Fragment>
  )
}
function mapState(state) {
  const { discipline } = state
  return { discipline }
}

const mapDispatchToProps = {
  getListPraise: DisciplineActions.getListPraise
}

export default connect(mapState, mapDispatchToProps)(withTranslate(React.memo(CommendationUser, areEqual)))