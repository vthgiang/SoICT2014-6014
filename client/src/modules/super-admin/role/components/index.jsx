import React, { useState } from 'react'

import RoleTable from './roleTable'

function ManageRole() {
  return (
    <div className='box' style={{ minHeight: '450px' }}>
      <div className='box-body'>
        <RoleTable />
      </div>
    </div>
  )
}

export default ManageRole
