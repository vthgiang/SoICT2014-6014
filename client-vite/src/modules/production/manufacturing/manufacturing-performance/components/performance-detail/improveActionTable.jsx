import React from 'react'
import IconButton from '@mui/material/IconButton'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { formatDate } from '../../../../../../helpers/formatDate'

import styles from './index.module.css'

const ImproveActionTable = (props) => {
  const { translate, actions = [], onCurrentActionChange } = props
  const tableId = 'action-management-table'

  const handleShowCreateKpiModal = () => {
    window.$('#modal-create-action').modal('show')
  }

  const handleShowEditKpiModal = (index) => {
    onCurrentActionChange(index)
    window.$('#modal-edit-action').modal('show')
  }

  return (
    <>
      <div className={styles['action_table']}>
        <div className={styles['widget-header']}>
          <span>{translate('manufacturing.performance.action_improvement')}</span>
          <IconButton sx={{ color: '#333' }} onClick={handleShowCreateKpiModal}>
            <i className='material-icons' style={{ fontWeight: 'bold' }}>
              add
            </i>
          </IconButton>
        </div>
        <table id={tableId} className='table action_table-table table-striped table-bordered table-hover'>
          <thead>
            <tr>
              <th>{translate('manufacturing.performance.index')}</th>
              <th>{translate('manufacturing.performance.problem')}</th>
              <th>{translate('manufacturing.performance.target')}</th>
              <th>{translate('manufacturing.performance.startDate')}</th>
              <th>{translate('manufacturing.performance.endDate')}</th>
              <th>{translate('manufacturing.performance.responsibles')}</th>
              <th>{translate('manufacturing.performance.progress')}</th>
              <th>{translate('general.action')}</th>
            </tr>
          </thead>
          <tbody>
            {actions.map((action, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{action.name}</td>
                <td>{action.target}</td>
                <td>{formatDate(action.startDate)}</td>
                <td>{formatDate(action.endDate)}</td>
                <td>
                  {action.responsibles.map((x, index) => {
                    if (index === action.responsibles.length - 1) {
                      return x.name
                    } else {
                      return x.name + ', '
                    }
                  })}
                </td>
                <td>{action.progress + '%'}</td>
                <td>
                  <a href='#!' className='delete' title={translate('manufacturing.performance.delete')}>
                    <i className='material-icons'>visibility</i>
                  </a>
                  <a href='#!' className='edit' title={translate('manufacturing.performance.edit')}>
                    <i className='material-icons' onClick={() => handleShowEditKpiModal(index)}>
                      edit
                    </i>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default connect(null, null)(withTranslate(ImproveActionTable))
