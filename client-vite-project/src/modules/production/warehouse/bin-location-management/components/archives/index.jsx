import React, { useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import ArchiveManagementTable from './archiveManagementTable'

function ArchiveManagement(props) {
  const [state, setState] = useState({})

  return (
    <div className='box-body' style={{ minHeight: '450px' }}>
      <ArchiveManagementTable />
    </div>
  )
}
export default connect(null, null)(withTranslate(ArchiveManagement))
