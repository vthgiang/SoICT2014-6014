import React from 'react'

import ManageServiceTable from './manageServiceTable'

function ManageService() {
  return (
    <div className='box' style={{ minHeight: '450px' }}>
      <div className='box-body'>
        <ManageServiceTable />
      </div>
    </div>
  )
}

export default ManageService
