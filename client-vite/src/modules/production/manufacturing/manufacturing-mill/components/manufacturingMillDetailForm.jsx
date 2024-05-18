import React, { useEffect, useState } from 'react'
import { withTranslate } from 'react-redux-multilingual'
import { connect } from 'react-redux'
import { DialogModal, formatDate } from '../../../../../common-components'
import { millActions } from '../redux/actions'

const ManufacturingMillDetailForm = (props) => {
  const { manufacturingMill, translate } = props
  const [prevProps, setPrevProps] = useState(props)

  useEffect(() => {
    if (prevProps.millDetail !== props.millDetail) {
      props.getDetailManufacturingMill(props.millDetail._id)
      setPrevProps(props)
    }
  }, [props])

  let currentMill = {}
  if (manufacturingMill.currentMill) {
    currentMill = manufacturingMill.currentMill
  }

  return (
    <React.Fragment>
      <DialogModal
        modalID={`modal-detail-info-mill`}
        isLoading={manufacturingMill.isLoading}
        title={translate('manufacturing.manufacturing_mill.mill_detail')}
        formID={`form-detail-mill`}
        size={50}
        maxWidth={500}
        hasSaveButton={false}
        hasNote={false}
      >
        <form id={`form-detail-mill`}>
          <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
            <div className={`form-group`}>
              <strong>{translate('manufacturing.manufacturing_mill.code')}:&emsp;</strong>
              {currentMill.code}
            </div>
            <div className={`form-group`}>
              <strong>{translate('manufacturing.manufacturing_mill.name')}:&emsp;</strong>
              {currentMill.name}
            </div>
            <div className={`form-group`}>
              <strong>{translate('manufacturing.manufacturing_mill.team_leader')}:&emsp;</strong>
              {currentMill.teamLeader && currentMill.teamLeader.name}
            </div>
            <div className={`form-group`}>
              <strong>{translate('manufacturing.manufacturing_mill.works_name')}:&emsp;</strong>
              {currentMill.manufacturingWorks && currentMill.manufacturingWorks.name}
            </div>
            <div className={`form-group`}>
              <strong>{translate('manufacturing.manufacturing_mill.created_at')}:&emsp;</strong>
              {formatDate(currentMill.createdAt)}
            </div>
            <div className={`form-group`}>
              <strong>{translate('manufacturing.manufacturing_mill.description')}:&emsp;</strong>
              {currentMill.description}
            </div>
            <div className={`form-group`}>
              <strong>{translate('manufacturing.manufacturing_mill.status')}:&emsp;</strong>
              {currentMill.status ? (
                <span style={{ color: 'green' }}>{translate('manufacturing.manufacturing_mill.1')}</span>
              ) : (
                <span style={{ color: 'orange' }}>{translate('manufacturing.manufacturing_mill.0')}</span>
              )}
            </div>
          </div>
        </form>
      </DialogModal>
    </React.Fragment>
  )
}

function mapStateToProps(state) {
  const manufacturingMill = state.manufacturingMill
  return { manufacturingMill }
}

const mapDispatchToProps = {
  getDetailManufacturingMill: millActions.getDetailManufacturingMill
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ManufacturingMillDetailForm))
