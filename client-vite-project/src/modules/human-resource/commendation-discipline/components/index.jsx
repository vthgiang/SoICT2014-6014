import React, { Component, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { DisciplineManager } from './disciplineManagement'
import { CommendationManagement } from './commendationManagement'

import { DepartmentActions } from '../../../super-admin/organizational-unit/redux/actions'

const ManagerPraiseDiscipline = (props) => {
  let search = window.location.search.split('?')
  let keySearch = 'page'
  let _pageActive = 'commendation'

  for (let n in search) {
    let index = search[n].lastIndexOf(keySearch)
    if (index !== -1) {
      _pageActive = search[n].slice(keySearch.length + 1, search[n].length)
      break
    }
  }

  const [state, setState] = useState({
    pageActive: _pageActive
  })

  useEffect(() => {
    const { getDepartment } = props
    getDepartment()
  }, [])

  const { translate } = props

  const { pageActive } = state

  return (
    <div className='nav-tabs-custom'>
      <ul className='nav nav-tabs'>
        <li className={pageActive === 'commendation' ? 'active' : null}>
          <a
            title={translate('human_resource.commendation_discipline.commendation.list_commendation_title')}
            data-toggle='tab'
            href='#khenthuong'
          >
            {translate('human_resource.commendation_discipline.commendation.list_commendation')}
          </a>
        </li>
        <li className={pageActive === 'discipline' ? 'active' : null}>
          <a title={translate('human_resource.commendation_discipline.discipline.list_discipline_title')} data-toggle='tab' href='#kyluat'>
            {translate('human_resource.commendation_discipline.discipline.list_discipline')}
          </a>
        </li>
      </ul>
      <div className='tab-content' style={{ padding: 0 }}>
        <CommendationManagement pageActive={pageActive} />
        <DisciplineManager pageActive={pageActive} />
      </div>
    </div>
  )
}

function mapState(state) {
  const { department } = state
  return { department }
}

const actionCreators = {
  getDepartment: DepartmentActions.get
}

export default connect(mapState, actionCreators)(withTranslate(ManagerPraiseDiscipline))
