import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { DialogModal } from '../../../../../common-components'
import { formatDate } from '../../../../../helpers/formatDate'
import RoutingFlowBuilder from './routing-flow-builder'
import { manufacturingRoutingActions } from '../redux/actions'

const RoutingDetailInfo = (props) => {
  const { translate, manufacturingRouting, detailRoutingId } = props
  const { currentRouting } = manufacturingRouting

  useEffect(() => {
    const getData = async () => {
      await props.getDetailManufacturingRouting(detailRoutingId)
    }
    if (detailRoutingId) {
      getData()
    }
  }, [detailRoutingId])

  return (
    <>
      <DialogModal
        modalID='modal-detail-info-manufacturing-routing'
        title={translate('manufacturing.routing.detail_title')}
        formID={`form-detail-manufacturing-routing`}
        size={75}
        maxWidth={800}
        hasSaveButton={false}
        hasNote={false}
      >
        <form id={`form-detail-manufacturing-routing`}>
          <div className='row'>
            <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
              <div className='form-group'>
                <strong>{translate('manufacturing.routing.code')}:&emsp;</strong>
                {currentRouting?.code}
              </div>
              <div className='form-group'>
                <strong>{translate('manufacturing.routing.name')}:&emsp;</strong>
                {currentRouting?.name}
              </div>
              <div className='form-group'>
                <strong>{translate('manufacturing.routing.works')}:&emsp;</strong>
                {currentRouting?.manufacturingWorks.name}
              </div>
            </div>
            <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
              <div className='form-group'>
                <strong>{translate('manufacturing.routing.created_at')}:&emsp;</strong>
                {formatDate(currentRouting?.createdAt)}
              </div>
              <div className='form-group'>
                <strong>{translate('manufacturing.routing.status')}:&emsp;</strong>
                <span style={{ color: currentRouting ? translate(`manufacturing.routing.${currentRouting.status}.color`) : '' }}>
                  {currentRouting ? translate(`manufacturing.routing.${currentRouting.status}.content`) : ''}
                </span>
              </div>
              <div className='form-group'>
                <strong>{translate('manufacturing.routing.product')}:&emsp;</strong>
                <ul>
                  {currentRouting?.goods.map((good) => (
                    <li key={good._id}>{good.name}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <RoutingFlowBuilder mode='view' operations={currentRouting?.operations} />
          <div className='row'>
            <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
              <fieldset className='scheduler-border'>
                <legend className='scheduler-border'>{translate('manufacturing.routing.operation_list')}</legend>
                <div className={`form-group`}>
                  <table className='table table-striped'>
                    <thead>
                      <tr>
                        <th>{translate('manufacturing.routing.index')}</th>
                        <th>{translate('manufacturing.routing.operation_name')}</th>
                        <th>{translate('manufacturing.routing.mill')}</th>
                        <th>{translate('manufacturing.routing.resource')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentRouting?.operations.map((operation) => (
                        <tr key={operation.id}>
                          <td>{operation.id}</td>
                          <td>{operation.name}</td>
                          <td>{operation.manufacturingMill.name}</td>
                          <td style={{ textAlign: 'left' }}>
                            <ul>
                              {operation.resources.map((item) => (
                                <li key={item._id}>
                                  <div>{item.machine?.assetName}</div>
                                  <div>{item.workerRole?.name}</div>
                                  <div>
                                    {`${translate('manufacturing.routing.hour_production')}: 
                                                                        ${item.hourProduction}`}
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </fieldset>
            </div>
          </div>
        </form>
      </DialogModal>
    </>
  )
}

function mapStateToProps(state) {
  const { manufacturingRouting } = state
  return { manufacturingRouting }
}

const mapDispatchToProps = {
  getDetailManufacturingRouting: manufacturingRoutingActions.getDetailManufacturingRouting
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(RoutingDetailInfo))
