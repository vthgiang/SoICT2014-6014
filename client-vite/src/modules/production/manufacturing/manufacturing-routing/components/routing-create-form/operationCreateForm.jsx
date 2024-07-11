import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { SelectBox, DialogModal, ButtonModal, ConfirmNotification } from '../../../../../../common-components'
import { AssetManagerActions } from '../../../../../asset/admin/asset-information/redux/actions'
import { worksActions } from '../../../manufacturing-works/redux/actions'

const EMPTY_OPERATION = {
  name: '',
  mill: '1',
  setupTime: '',
  description: '',
  resources: []
}

const EMPTY_MACHINE = {
  machine: '1',
  hourProduction: '',
  costPerHour: '',
  workerRole: '1',
  minExpYears: ''
}

const OperationCreatForm = (props) => {
  const { translate, routing, onAddOperation, manufacturingWorks, assetsManager } = props

  const [operation, setOperation] = useState(EMPTY_OPERATION)
  const [machine, setMachine] = useState(EMPTY_MACHINE)

  const getMillArr = () => {
    const selectedWorks = manufacturingWorks.listWorks.find((works) => works._id === routing.works)
    let millArr = [{ value: '1', text: `---${translate('manufacturing.routing.choose_mill')}---` }]
    selectedWorks?.manufacturingMills.forEach((mill) => {
      millArr.push({ value: mill._id, text: mill.name })
    })

    return millArr
  }

  const getAssetArr = () => {
    let assetArr = [{ value: '1', text: `---${translate('manufacturing.routing.choose_machine')}---` }]
    assetsManager?.listAssets.forEach((asset) => {
      assetArr.push({ value: asset._id, text: asset.assetName })
    })

    return assetArr
  }

  const getWorkerRoleArr = () => {
    const { employeeRoles } = manufacturingWorks
    let workerRoleArr = [{ value: '1', text: `---${translate('manufacturing.routing.choose_worker_role')}---` }]
    employeeRoles?.forEach((role) => {
      workerRoleArr.push({ value: role._id, text: role.name })
    })

    return workerRoleArr
  }

  const handleOperationInputChange = (e) => {
    const { name, value } = e.target
    setOperation({
      ...operation,
      [name]: value
    })
  }

  const handleOperationSelectChange = (name, value) => {
    setOperation({
      ...operation,
      [name]: value
    })
  }

  const handleMachineInputChange = (e) => {
    const { name, value } = e.target
    setMachine({
      ...machine,
      [name]: value
    })
  }

  const handleMachineSelectChange = (name, value) => {
    setMachine({
      ...machine,
      [name]: value
    })
  }

  const isValidatedMachine = () => {
    if (
      machine.machine === '1' ||
      machine.costPerHour === '' ||
      machine.hourProduction === 0 ||
      machine.workerRole === '1' ||
      machine.minExpYears === 0
    ) {
      return false
    }

    return true
  }

  const handleAddMachine = () => {
    if (!isValidatedMachine()) return

    setOperation((prev) => ({
      ...prev,
      resources: [...prev.resources, machine]
    }))

    setMachine(EMPTY_MACHINE)
  }

  const handleSave = () => {
    onAddOperation(operation)
    setOperation(EMPTY_OPERATION)
    setMachine(EMPTY_MACHINE)
  }

  /* get machine & worker from id */
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
      await props.getAllAsset({ handoverUnit: routing.organizationalUnit })
      await props.getAllManufacturingEmployeeRoles(routing.works)
    }
    getData()
  }, [])

  return (
    <>
      <ButtonModal
        modalID='modal-create-new-operation'
        button_name={translate('manufacturing.routing.add_operation')}
        title={translate('manufacturing.routing.add_operation')}
      />
      <DialogModal
        modalID='modal-create-new-operation'
        isLoading={false}
        formID='form-create-new-operation'
        title={translate('manufacturing.routing.add_operation')}
        msg_success=''
        msg_failure=''
        func={handleSave}
        size={100}
        maxWidth={800}
      >
        <div className='row'>
          <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
            <fieldset className='scheduler-border'>
              <legend className='scheduler-border'>{translate('manufacturing.routing.operation_general_info')}</legend>
              <div className='row'>
                <div className='col-xs-12 col-sm-12 col-md-6 col-lg-6'>
                  <div className='form-group'>
                    <label>
                      {translate('manufacturing.routing.operation_name')}
                      <span className='text-red'>*</span>
                    </label>
                    <input type='text' className='form-control' name='name' value={operation.name} onChange={handleOperationInputChange} />
                  </div>
                  <div className='form-group'>
                    <label>{translate('manufacturing.routing.setup_time')}</label>
                    <input
                      type='number'
                      className='form-control'
                      name='setupTime'
                      value={operation.setupTime}
                      onChange={handleOperationInputChange}
                    />
                  </div>
                </div>
                <div className='col-xs-12 col-sm-12 col-md-6 col-lg-6'>
                  <div className='form-group'>
                    <label>
                      {translate('manufacturing.routing.mill')} <span className='text-red'>*</span>
                    </label>
                    <SelectBox
                      id='select-mill'
                      className='form-control select2'
                      style={{ width: '100%' }}
                      value={operation.mill}
                      onChange={(value) => handleOperationSelectChange('mill', value[0])}
                      items={getMillArr()}
                    />
                  </div>
                  <div className='form-group'>
                    <label>{translate('manufacturing.routing.description')}</label>
                    <textarea
                      type='text'
                      className='form-control'
                      value={operation.description}
                      onChange={(e) => handleUpdateOperationField({ description: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </fieldset>
          </div>
          <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
            <fieldset className='scheduler-border'>
              <legend className='scheduler-border'>{translate('manufacturing.routing.machine_info')}</legend>
              <div className='form-group'>
                <label>
                  {translate('manufacturing.routing.machine_name')}
                  <span className='text-red'>*</span>
                </label>
                <SelectBox
                  id='select-machine'
                  className='form-control select2'
                  style={{ width: '100%' }}
                  value={machine.machine}
                  onChange={(value) => handleMachineSelectChange('machine', value[0])}
                  items={getAssetArr()}
                />
              </div>
              <div className='form-group'>
                <label>
                  {translate('manufacturing.routing.cost_per_hour')}
                  <span className='text-red'>*</span>
                </label>
                <input
                  type='number'
                  className='form-control'
                  name='costPerHour'
                  value={machine.costPerHour}
                  onChange={handleMachineInputChange}
                />
              </div>
              <div className='form-group'>
                <label>
                  {translate('manufacturing.routing.hour_production')}
                  <span className='text-red'>*</span>
                </label>
                <input
                  type='number'
                  className='form-control'
                  name='hourProduction'
                  value={machine.hourProduction}
                  onChange={handleMachineInputChange}
                />
              </div>
              <div className='form-group'>
                <label>
                  {translate('manufacturing.routing.worker_role')} <span className='text-red'>*</span>{' '}
                </label>
                <SelectBox
                  id='select-worker-role'
                  className='form-control select2'
                  style={{ width: '100%' }}
                  value={machine.workerRole}
                  onChange={(value) => handleMachineSelectChange('workerRole', value[0])}
                  items={getWorkerRoleArr()}
                />
              </div>
              <div className='form-group'>
                <label>
                  {translate('manufacturing.routing.exp_years')} <span className='text-red'>*</span>
                </label>
                <input
                  type='number'
                  className='form-control'
                  name='minExpYears'
                  value={machine.minExpYears}
                  onChange={handleMachineInputChange}
                />
              </div>
              <div className='form-group'>
                <button className='btn btn-success pull-right' onClick={handleAddMachine} disabled={!isValidatedMachine()}>
                  {translate('manufacturing.routing.add')}
                </button>
              </div>
            </fieldset>
          </div>
          <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
            <table className='table table-striped'>
              <thead>
                <tr>
                  <th>{translate('manufacturing.routing.machine_name')}</th>
                  <th>{translate('manufacturing.routing.cost_per_hour')}</th>
                  <th>{translate('manufacturing.routing.hour_production')}</th>
                  <th>{translate('manufacturing.routing.worker_role')}</th>
                  <th>{translate('manufacturing.routing.exp_years')}</th>
                  <th>{translate('table.action')}</th>
                </tr>
              </thead>
              <tbody>
                {operation.resources.length > 0 ? (
                  operation.resources.map((machine, index) => (
                    <tr key={index}>
                      <td>{getMachineNameById(machine.machine)}</td>
                      <td>{machine.costPerHour}</td>
                      <td>{machine.hourProduction}</td>
                      <td>{getWorkerRoleNameById(machine.workerRole)}</td>
                      <td>{machine.minExpYears}</td>
                      <td>
                        <a className='edit text-yellow' style={{ width: '5px' }} title={translate('manufacturing.routing.edit_resource')}>
                          <i className='material-icons'>edit</i>
                        </a>
                        <ConfirmNotification
                          icon='question'
                          title={translate('manufacturing.routing.delete_resource')}
                          name='delete'
                          className='text-red'
                          content={`<h4>${translate('manufacturing.routing.delete_resource')} ${'Ép khuôn thân xe'}</h4>`}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8}>{translate('table.no_data')}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </DialogModal>
    </>
  )
}

const mapStateToProps = (state) => {
  const { manufacturingWorks, assetsManager } = state
  return { manufacturingWorks, assetsManager }
}

const mapDispatchToProps = {
  getAllManufacturingWorks: worksActions.getAllManufacturingWorks,
  getAllManufacturingEmployeeRoles: worksActions.getAllManufacturingEmployeeRoles,
  getAllAsset: AssetManagerActions.getAllAsset
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(OperationCreatForm))
