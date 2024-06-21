import React from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { ListProjectNew } from './listProjectNew'

function ManagementTableProject(props) {
  return <ListProjectNew />
}
function mapState(state) {
  const { project, user } = state
  return { project, user }
}

export default connect(mapState, null)(withTranslate(ManagementTableProject))
