import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import withTranslate from 'react-redux-multilingual/lib/withTranslate'
import { commandActions } from '../redux/actions'
import { manufacturingQualityCriteriaActions } from '../../manufacturing-quality/manufacturing-quality-criteria/redux/actions'
import { manufacturingQualityErrorActions } from '../../manufacturing-quality/manufacturing-quality-error/redux/actions'
import { manufacturingQualityInspectionActions } from '../../manufacturing-quality/manufacturing-quality-inspection/redux/actions'
import { DialogModal, SelectBox } from '../../../../../common-components'

const QualityControlForm = (props) => {
  const { manufacturingCommand, manufacturingQualityCriteria, manufacturingQualityError, commandId, code, translate } = props

  const [inspection, setInspection] = useState({
    inspectionNum: 0,
    passedNum: 0,
    errorNum: 0,
    criteria: '1',
    operation: '1',
    finalResult: 1,
    errorList: []
  })
  const [errorList, setErrorList] = useState([])

  const getOperationArray = () => {
    let operationArr = [
      { value: '1', text: translate('manufacturing.command.choose_qc_operation') },
      { value: '0', text: translate('manufacturing.command.oqc') }
    ]

    manufacturingCommand.currentCommand.workOrders?.map((wo, index) => {
      operationArr.push({
        value: index,
        text: wo.operation
      })
    })

    return operationArr
  }

  const getCriteriaArray = () => {
    let criteriaArr = [{ value: '1', text: translate('manufacturing.command.choose_qc_criteria') }]
    manufacturingQualityCriteria.listCriterias?.map((criteria) => {
      criteriaArr.push({ value: criteria._id, text: criteria.name })
    })

    return criteriaArr
  }

  const getFinalResultArr = () => {
    const finalResultArr = [
      { value: 1, text: translate('manufacturing.command.qc_status.2.content') },
      { value: 2, text: translate('manufacturing.command.qc_status.3.content') }
    ]

    return finalResultArr
  }

  const getErrorArray = () => {
    let errorArr = []
    manufacturingQualityError.listErrors?.map((error) => {
      errorArr.push({ value: error._id, text: error.name })
    })

    return errorArr
  }

  const handleInspectionInputChange = (e) => {
    const { name, value } = e.target
    setInspection({ ...inspection, [name]: value })
  }

  const handleInspectionSelectChange = (name, value) => {
    setInspection({ ...inspection, [name]: value })
  }

  const handleAddError = () => {
    setErrorList([...errorList, ''])
  }

  const handleRemoveError = (index) => {
    setErrorList((prev) => prev.filter((_, i) => i !== index))
  }

  const isFormValidated = () => {
    return true
  }

  const save = () => {
    const userId = localStorage.getItem('userId')
    const data = {
      code,
      manufacturingCommand: commandId,
      workOrder: inspection.operation,
      type: inspection.operation == '0' ? 2 : 1,
      responsible: userId,
      criteria: inspection.criteria,
      result: {
        inspectionNum: inspection.inspectionNum,
        passedNum: inspection.passedNum,
        errorNum: inspection.errorNum,
        errorList: inspection.errorList,
        final: inspection.finalResult
      }
    }

    const oqcData = {
      qualityControlStaff: {
        status: inspection.finalResult == 1 ? 2 : 3,
        content: ''
      }
    }

    if (inspection.operation == '0') {
      props.handleEditCommand(commandId, oqcData)
    }

    props.createManufacturingQualityInspection(data)
  }

  useEffect(() => {
    if (commandId) {
      props.getDetailManufacturingCommand(commandId)

      const data = {
        good: manufacturingCommand.currentCommand.good
      }

      props.getAllManufacturingQualityCriterias(data)
    }
  }, [commandId])

  useEffect(() => {
    props.getAllManufacturingQualityErrors()
  }, [])

  return (
    <>
      <DialogModal
        modalID='modal-quality-control'
        isLoading={manufacturingCommand.isLoading}
        formID='form-quality-control'
        title={translate('manufacturing.command.quality_control_command')}
        disableSubmit={!isFormValidated()}
        msg_success={translate('manufacturing.command.edit_successfully')}
        msg_failure={translate('manufacturing.command.edit_failed')}
        func={save}
        size={50}
        maxWidth={500}
      >
        <form id='form-quality-control'>
          <div className='row'>
            <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
              <div className='form-group'>
                <label>
                  {translate('manufacturing.command.code')}
                  <span className='text-red'>*</span>
                </label>
                <input type='text' value={code} className='form-control' disabled={true} />
              </div>
            </div>
            <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
              <div className='form-group'>
                <label>
                  {translate('manufacturing.command.qc_criteria')}
                  <span className='text-red'>*</span>
                </label>
                <SelectBox
                  id={`select-criteria`}
                  className='form-control select2'
                  items={getCriteriaArray()}
                  value={inspection.criteria}
                  onChange={(value) => handleInspectionSelectChange('criteria', value[0])}
                  style={{ width: '100%' }}
                  multiple={false}
                />
              </div>
            </div>
            <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
              <div className='form-group'>
                <label>
                  {translate('manufacturing.command.qc_operation')}
                  <span className='text-red'>*</span>
                </label>
                <SelectBox
                  id={`select-operation`}
                  className='form-control select2'
                  items={getOperationArray()}
                  // value={segment}
                  // onChange={getOperationArray()}
                  style={{ width: '100%' }}
                  multiple={false}
                />
              </div>
            </div>
            <div className='col-xs-12 col-sm-12 col-md-6 col-lg-6'>
              <div className='form-group'>
                <label>
                  {translate('manufacturing.command.inspection_num')}
                  <span className='text-red'>*</span>
                </label>
                <input
                  type='number'
                  className='form-control'
                  name='inspectionNum'
                  value={inspection.inspectionNum}
                  onChange={handleInspectionInputChange}
                />
              </div>
            </div>
            <div className='col-xs-12 col-sm-12 col-md-6 col-lg-6'>
              <div className='form-group'>
                <label>
                  {translate('manufacturing.command.passed_num')}
                  <span className='text-red'>*</span>
                </label>
                <input
                  type='number'
                  className='form-control'
                  name='passedNum'
                  value={inspection.passedNum}
                  onChange={handleInspectionInputChange}
                />
              </div>
            </div>
            <div className='col-xs-12 col-sm-12 col-md-6 col-lg-6'>
              <div className='form-group'>
                <label>
                  {translate('manufacturing.command.error_num')}
                  <span className='text-red'>*</span>
                </label>
                <input
                  type='number'
                  className='form-control'
                  name='errorNum'
                  value={inspection.errorNum}
                  onChange={handleInspectionInputChange}
                />
              </div>
            </div>
            <div className='col-xs-12 col-sm-12 col-md-6 col-lg-6'>
              <div className='form-group'>
                <label>
                  {translate('manufacturing.command.qc_result')}
                  <span className='text-red'>*</span>
                </label>
                <SelectBox
                  id={`select-final-result`}
                  className='form-control select2'
                  items={getFinalResultArr()}
                  value={inspection.finalResult}
                  onChange={(value) => handleInspectionSelectChange('finalResult', value[0])}
                  style={{ width: '100%' }}
                  multiple={false}
                />
              </div>
            </div>
            <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
              <div className='form-group'>
                <label>{translate('manufacturing.command.error_list')}</label>
                <table className='table table-hover table-striped table-bordered'>
                  <thead>
                    <tr>
                      <th>
                        <label>{translate('manufacturing.command.error_name')}</label>
                      </th>
                      <th style={{ width: '4rem' }} className='text-center'>
                        <a href='#add-manager' className='text-green' onClick={handleAddError}>
                          <i className='material-icons'>add_box</i>
                        </a>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {errorList.map((_, index) => (
                      <tr key={index}>
                        <td>
                          <SelectBox
                            id={`select-error-${index}`}
                            className='form-control select2'
                            items={getErrorArray()}
                            style={{ width: '100%' }}
                            value={errorList[index]}
                            onChange={(value) => handleErrorListChange(value, index)}
                            multiple={false}
                          />
                        </td>
                        <td>
                          <a href='#delete-error' className='text-red' style={{ border: 'none' }} onClick={() => handleRemoveError(index)}>
                            <i className='fa fa-trash'></i>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </form>
      </DialogModal>
    </>
  )
}

function mapStateToProps(state) {
  const { manufacturingCommand, manufacturingQualityCriteria, manufacturingQualityError } = state
  return { manufacturingCommand, manufacturingQualityCriteria, manufacturingQualityError }
}

const mapDispatchToProps = {
  getDetailManufacturingCommand: commandActions.getDetailManufacturingCommand,
  handleEditCommand: commandActions.handleEditCommand,
  getAllManufacturingQualityCriterias: manufacturingQualityCriteriaActions.getAllManufacturingQualityCriterias,
  getAllManufacturingQualityErrors: manufacturingQualityErrorActions.getAllManufacturingQualityErrors,
  createManufacturingQualityInspection: manufacturingQualityInspectionActions.createManufacturingQualityInspection
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(QualityControlForm))
