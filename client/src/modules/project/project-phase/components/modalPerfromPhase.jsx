import React, { Component, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { DialogModal } from '../../../../common-components'
import PhaseComponent from './phaseComponent'

function ModalPerformPhase(props) {
  const { projectPhase, units, phaseName } = props

  return (
    <React.Fragment>
      <DialogModal
        size='100'
        modalID={`modelPerformPhase${props.id}`}
        formID='form-perform-phase'
        title={projectPhase?.performPhase?.name ? projectPhase.performPhase.name : phaseName}
        bodyStyle={{ padding: '0px' }}
        hasSaveButton={false}
      >
        <PhaseComponent units={units} id={props.id} />
      </DialogModal>
    </React.Fragment>
  )
}

function mapState(state) {
  const { projectPhase } = state
  return { projectPhase }
}

const actionDispatch = {}

const modalPerformPhase = connect(mapState, actionDispatch)(withTranslate(ModalPerformPhase))
export { modalPerformPhase as ModalPerformPhase }
