import React, { Component } from 'react'
import { withTranslate } from 'react-redux-multilingual'
import { connect } from 'react-redux'
import { DialogModal, formatDate } from '../../../../../common-components'
import { worksActions } from '../redux/actions'

class ManufacturingWorksDetailForm extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.worksDetail !== this.props.worksDetail) {
      this.props.getDetailManufacturingWorks(nextProps.worksDetail._id)
      return false
    }
    return true
  }

  render() {
    const { manufacturingWorks, translate } = this.props
    let currentWorks = {}
    if (manufacturingWorks.currentWorks) {
      currentWorks = manufacturingWorks.currentWorks
    }
    return (
      <React.Fragment>
        <DialogModal
          modalID={`modal-detail-info-works`}
          isLoading={manufacturingWorks.isLoading}
          title={translate('manufacturing.manufacturing_works.detail_works')}
          formID={`form-detail-works`}
          size={50}
          maxWidth={500}
          hasSaveButton={false}
          hasNote={false}
        >
          <form id={`form-detail-works`}>
            <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
              <div className={`form-group`}>
                <strong>{translate('manufacturing.manufacturing_works.code')}:&emsp;</strong>
                {currentWorks.code}
              </div>
              <div className={`form-group`}>
                <strong>{translate('manufacturing.manufacturing_works.name')}:&emsp;</strong>
                {currentWorks.name}
              </div>
              <div className={`form-group`}>
                <strong>{translate('manufacturing.manufacturing_works.status')}:&emsp;</strong>
                {currentWorks.status ? (
                  <span style={{ color: 'green' }}>{translate('manufacturing.manufacturing_works.1')}</span>
                ) : (
                  <span style={{ color: 'orange' }}>{translate('manufacturing.manufacturing_works.0')}</span>
                )}
              </div>
              <div className={`form-group`}>
                <strong>{translate('manufacturing.manufacturing_works.phone')}:&emsp;</strong>
                {currentWorks.phoneNumber}
              </div>
            </div>
            <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
              <div className={`form-group`}>
                <strong>{translate('manufacturing.manufacturing_works.address')}:&emsp;</strong>
                {currentWorks.address}
              </div>
              <div className={`form-group`}>
                <strong>{translate('manufacturing.manufacturing_works.turn')}:&emsp;</strong>
                {currentWorks.turn ? currentWorks.turn : ''}
              </div>
              <div className={`form-group`}>
                <strong>{translate('manufacturing.manufacturing_works.created_at')}:&emsp;</strong>
                {formatDate(currentWorks.createdAt)}
              </div>
              <div className={`form-group`}>
                <strong>{translate('manufacturing.manufacturing_works.description')}:&emsp;</strong>
                {currentWorks.description}
              </div>
            </div>
            <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
              <fieldset className='scheduler-border'>
                <legend className='scheduler-border'>{translate('manufacturing.manufacturing_works.list_roles')}</legend>
                {currentWorks.organizationalUnit &&
                  currentWorks.organizationalUnit.managers.map((role, index) => {
                    return (
                      <div className={`form-group`} key={index}>
                        <strong>{role.name}: &emsp;</strong>
                        {role.users.map((user, index) => {
                          if (index === role.users.length - 1) {
                            return user.userId.name
                          }
                          return user.userId.name + ', '
                        })}
                      </div>
                    )
                  })}
              </fieldset>
            </div>
            <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
              <fieldset className='scheduler-border'>
                <legend className='scheduler-border'>{translate('manufacturing.manufacturing_works.role_manages_another')}</legend>
                {currentWorks.manageRoles && currentWorks.manageRoles.length ? (
                  <div>
                    {currentWorks.manageRoles.map((role, index) => (
                      <p key={index}>{role.name}</p>
                    ))}
                  </div>
                ) : (
                  translate('manufacturing.manufacturing_works.no_roles')
                )}
              </fieldset>
            </div>
            <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
              <fieldset className='scheduler-border'>
                <legend className='scheduler-border'>{translate('manufacturing.manufacturing_works.list_mills')}</legend>
                <table className='table table-bordered'>
                  <thead>
                    <tr>
                      <th>{translate('manufacturing.manufacturing_works.index')}</th>
                      <th>{translate('manufacturing.manufacturing_works.mill_code')}</th>
                      <th>{translate('manufacturing.manufacturing_works.mill_name')}</th>
                      <th>{translate('manufacturing.manufacturing_works.description')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentWorks.manufacturingMills && currentWorks.manufacturingMills.length === 0 && (
                      <tr>
                        <td colSpan={4}>{translate('confirm.no_data')}</td>
                      </tr>
                    )}
                    {currentWorks.manufacturingMills &&
                      currentWorks.manufacturingMills.length !== 0 &&
                      currentWorks.manufacturingMills.map((mill, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{mill.code}</td>
                          <td>{mill.name}</td>
                          <td>{mill.description}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </fieldset>
            </div>
          </form>
        </DialogModal>
      </React.Fragment>
    )
  }
}

function mapStateToProps(state) {
  const manufacturingWorks = state.manufacturingWorks
  return { manufacturingWorks }
}

const mapDispatchToProps = {
  getDetailManufacturingWorks: worksActions.getDetailManufacturingWorks
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ManufacturingWorksDetailForm))
