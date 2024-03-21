import React, { useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import BinManagementTable from './binManagementTable'

function BinManagement(props) {
  const [state, setState] = useState({})

  return (
    <div className='box-body' style={{ minHeight: '450px' }}>
      <BinManagementTable />
    </div>
  )
}
export default connect(null, null)(withTranslate(BinManagement))
