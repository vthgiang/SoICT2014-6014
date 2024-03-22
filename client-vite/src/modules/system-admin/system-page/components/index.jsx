import React from 'react'

import { withTranslate } from 'react-redux-multilingual'
import { TableSystemAdminPage } from './tableSystemAdminPage'

function ManageSystemAdminPage() {
  return (
    <div className='box' style={{ minHeight: '450px' }}>
      <div className='box-body'>
        <TableSystemAdminPage />
      </div>
    </div>
  )
}

export default withTranslate(ManageSystemAdminPage)
