import React from 'react'
import { connect } from 'react-redux'
import { ListProjectEvaluation } from './listProjectEvaluation'

const index = (props) => {
  return <ListProjectEvaluation />
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(index)
