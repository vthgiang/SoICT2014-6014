import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { ConfirmNotification } from '../../../../../../common-components'
import OperationCreateForm from './operationCreateForm'
import { worksActions } from '../../../manufacturing-works/redux/actions'

const RoutingSheet = (props) => {
  const { translate, routing, validateField, errorMsg, onAddOperation, manufacturingWorks, assetsManager } = props

  const getMillNameById = (id) => {
    const selectedWorks = manufacturingWorks.listWorks.find((work) => work._id === routing.works)
    const mill = selectedWorks?.manufacturingMills.find((mill) => mill._id === id)
    return mill ? mill.name : ''
  }

  const getMachineNameById = (id) => {
    const machine = assetsManager.listAssets.find((asset) => asset._id === id)
    return machine ? machine.assetName : ''
  }

  const getWorkerRoleNameById = (id) => {
    const { employeeRoles } = manufacturingWorks
    const workerRole = employeeRoles.find((role) => role._id == id)
    return workerRole ? workerRole.name : ''
  }

  useEffect(() => {
    const getData = async () => {
      await props.getAllManufacturingWorks()
    }
    getData()
  }, [])

  return (
    <>
      <OperationCreateForm 
				routing={routing} 
				onAddOperation={onAddOperation} 
				validateField={validateField} 
				errorMsg={errorMsg} 
			/>
      <table id='routing-sheet' className='table table-striped table-bordered table-hover'>
        <thead>
          <tr>
            <th>{translate('manufacturing.routing.index')}</th>
            <th>{translate('manufacturing.routing.operation_name')}</th>
            <th>{translate('manufacturing.routing.implementation_mill')}</th>
            <th>{translate('manufacturing.routing.setup_time')}</th>
            <th>{translate('manufacturing.routing.resource')}</th>
            <th style={{ width: '120px', textAlign: 'center' }}>{translate('general.action')}</th>
          </tr>
        </thead>
        <tbody>
          {routing.operations.length > 0 ? (
            routing.operations.map((operation, index) => (
              <tr key={index}>
                <td key={index}>{index + 1}</td>
                <td>{operation.name}</td>
                <td>{getMillNameById(operation.mill)}</td>
                <td className='text-center'>{operation.setupTime ? operation.setupTime : 0} giờ</td>
                <td>
                  <ul>
                    {operation.resources?.map((machine, index) => (
                      <li key={index}>
                        {getMachineNameById(machine.id)},{getWorkerRoleNameById(machine.workerRole)}
                      </li>
                    ))}
                  </ul>
                </td>
                <td>
                  <a className='edit text-yellow' style={{ width: '5px' }} title={translate('manufacturing.routing.edit_operation')}>
                    <i className='material-icons'>edit</i>
                  </a>
                  <ConfirmNotification
                    icon='question'
                    title={translate('manufacturing.routing.delete_operation')}
                    name='delete'
                    className='text-red'
                    content={`<h4>${translate('manufacturing.routing.delete_operation')} ${'Ép khuôn thân xe'}</h4>`}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7}>
                <center>{translate('table.no_data')}</center>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  )
}

const mapStateToProps = (state) => {
  const { manufacturingWorks, assetsManager } = state
  return { manufacturingWorks, assetsManager }
}

const mapDispatchToProps = {
  getAllManufacturingWorks: worksActions.getAllManufacturingWorks
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(RoutingSheet))
