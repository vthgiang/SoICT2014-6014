import { compareByFieldSpec } from '@fullcalendar/react'
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { translate } from 'react-redux-multilingual/lib/utils'
import withTranslate from 'react-redux-multilingual/lib/withTranslate'
import { ErrorLabel, SelectBox } from '../../../../../common-components'
import { millActions } from '../../../manufacturing/manufacturing-mill/redux/actions'

function InfoMillCreateForm(props) {
  const EMPTY_MILL = {
    manufacturingMill: {
      _id: '1'
    },
    productivity: '',
    personNumber: ''
  }

  const [state, setState] = useState({
    manufacturingMill: Object.assign({}, EMPTY_MILL),
    editInfo: false,
    listManufacturingMills: []
  })

  useEffect(() => {
    props.getAllManufacturingMills()
  }, [])

  const getListManufacturingMills = () => {
    const { translate, manufacturingMill } = props
    let listManufacturingMillArr = [
      {
        value: '1',
        text: translate('manage_warehouse.good_management.choose_mill')
      }
    ]

    const { listMills } = manufacturingMill
    if (listMills) {
      listMills.map((item) => {
        listManufacturingMillArr.push({
          value: item._id,
          text: item.name + ' - ' + item.code
        })
      })
    }
    return listManufacturingMillArr
  }

  const handleManufacturingMillChange = (value) => {
    const millId = value[0]
    validateManufacturingMillChange(millId, true)
  }

  function validateManufacturingMillChange(value, willUpdateState) {
    let msg = undefined
    const { translate } = props
    if (!value || value === '1') {
      msg = translate('manage_warehouse.good_management.error_choose_mill')
    }
    if (willUpdateState) {
      let { manufacturingMill } = state
      const { listMills } = props.manufacturingMill
      let mill = listMills.filter((x) => x._id === value)[0]
      if (mill) {
        manufacturingMill.manufacturingMill = mill
      } else {
        manufacturingMill.manufacturingMill = Object.assign({}, EMPTY_MILL)
      }
      setState({
        ...state,
        manufacturingMill: { ...manufacturingMill },
        errorOnManufacturingMill: msg
      })
    }
    return msg
  }

  const handleProductivityChange = (e) => {
    const { value } = e.target
    validateProductivity(value, true)
  }

  function validateProductivity(value, willUpdateState = true) {
    let msg = undefined
    const { translate } = props
    if (value < 1) {
      msg = translate('manage_warehouse.good_management.error_productivity')
    }
    if (willUpdateState) {
      const { manufacturingMill } = state
      manufacturingMill.productivity = value
      setState({
        ...state,
        manufacturingMill: { ...manufacturingMill },
        errorOnProductivity: msg
      })
    }
    return msg
  }

  const handlePersonNumberChange = (e) => {
    const { value } = e.target
    validatePersonNumber(value, true)
  }

  function validatePersonNumber(value, willUpdateState = true) {
    let msg = undefined
    const { translate } = props
    if (value < 1) {
      msg = translate('manage_warehouse.good_management.error_person_number')
    }
    if (willUpdateState) {
      const { manufacturingMill } = state
      manufacturingMill.personNumber = value
      setState({
        ...state,
        manufacturingMill: { ...manufacturingMill },
        errorOnPersonNumber: msg
      })
    }
    return msg
  }

  const isMillValidated = () => {
    const { manufacturingMill } = state
    if (
      validateManufacturingMillChange(manufacturingMill.manufacturingMill._id, false) ||
      validateProductivity(manufacturingMill.productivity, false) ||
      validatePersonNumber(manufacturingMill.personNumber, false)
    ) {
      return false
    }
    return true
  }

  const handleAddMill = async (e) => {
    e.preventDefault()
    let { listManufacturingMills, manufacturingMill } = state
    listManufacturingMills.push(manufacturingMill)
    await setState({
      ...state,
      listManufacturingMills: [...listManufacturingMills],
      manufacturingMill: Object.assign({}, EMPTY_MILL)
    })
    props.onDataChange(state.listManufacturingMills)
  }

  const handleClearMill = (e) => {
    e.preventDefault()
    setState({
      ...state,
      manufacturingMill: Object.assign({}, EMPTY_MILL)
    })
  }

  const handleEditMill = (manufacturingMill, index) => {
    setState({
      ...state,
      indexInfo: index,
      manufacturingMill: Object.assign({}, manufacturingMill),
      editInfo: true
    })
  }
  const handleCancelEditMill = (e) => {
    e.preventDefault()
    setState({
      ...state,
      manufacturingMill: Object.assign({}, EMPTY_MILL),
      editInfo: false
    })
  }

  const handleDeleteMill = async (index) => {
    let { listManufacturingMills } = state
    listManufacturingMills.splice(index, 1)

    await setState({
      ...state,
      listManufacturingMills: [...listManufacturingMills]
    })

    props.onDataChange(state.listManufacturingMills)
  }

  const handleSaveEditMill = async (e) => {
    e.preventDefault()
    const { listManufacturingMills, manufacturingMill, indexInfo } = state
    listManufacturingMills[indexInfo] = manufacturingMill
    await setState({
      ...state,
      editInfo: false,
      manufacturingMill: Object.assign({}, EMPTY_MILL),
      listManufacturingMills: [...listManufacturingMills]
    })

    props.onDataChange(state.listManufacturingMills)
  }

  if (props.id !== state.id) {
    setState({
      ...state,
      id: props.id,
      listManufacturingMills: props.initialData
    })
  }

  const { translate, id } = props
  const { errorOnProductivity, errorOnPersonNumber, errorOnManufacturingMill, manufacturingMill, listManufacturingMills } = state
  return (
    <fieldset className='scheduler-border'>
      <legend className='scheduler-border'>{translate('manage_warehouse.good_management.info_mill')}</legend>
      <div className={`form-group ${!errorOnManufacturingMill ? '' : 'has-error'}`}>
        <label>{translate('manage_warehouse.good_management.manufacturingMill')}</label>
        <SelectBox
          id={`select-manufacturingMill-${id}`}
          className='form-control select2'
          style={{ width: '100%' }}
          value={manufacturingMill.manufacturingMill._id}
          items={getListManufacturingMills()}
          onChange={handleManufacturingMillChange}
          multiple={false}
        />
        <ErrorLabel content={errorOnManufacturingMill} />
      </div>

      <div className={`form-group ${!errorOnProductivity ? '' : 'has-error'}`}>
        <label className='control-label'>{translate('manage_warehouse.good_management.productivity')}</label>
        <div>
          <input
            type='number'
            className='form-control'
            placeholder={translate('manage_warehouse.good_management.productivity')}
            value={manufacturingMill.productivity}
            onChange={handleProductivityChange}
          />
        </div>
        <ErrorLabel content={errorOnProductivity} />
      </div>
      <div className={`form-group ${!errorOnPersonNumber ? '' : 'has-error'}`}>
        <label className='control-label'>{translate('manage_warehouse.good_management.person_number')}</label>
        <div>
          <input
            type='number'
            className='form-control'
            placeholder={translate('manage_warehouse.good_management.person_number')}
            value={manufacturingMill.personNumber}
            onChange={handlePersonNumberChange}
          />
        </div>
        <ErrorLabel content={errorOnPersonNumber} />
      </div>

      <div className='pull-right' style={{ marginBottom: '10px' }}>
        {state.editInfo ? (
          <React.Fragment>
            <button className='btn btn-success' onClick={handleCancelEditMill} style={{ marginLeft: '10px' }}>
              {translate('task_template.cancel_editing')}
            </button>
            <button className='btn btn-success' disabled={!isMillValidated()} onClick={handleSaveEditMill} style={{ marginLeft: '10px' }}>
              {translate('task_template.save')}
            </button>
          </React.Fragment>
        ) : (
          <button className='btn btn-success' style={{ marginLeft: '10px' }} disabled={!isMillValidated()} onClick={handleAddMill}>
            {translate('task_template.add')}
          </button>
        )}
        <button className='btn btn-primary' style={{ marginLeft: '10px' }} onClick={handleClearMill}>
          {translate('task_template.delete')}
        </button>
      </div>
      <table className='table table-bordered'>
        <thead>
          <tr>
            <th>{translate('manage_warehouse.good_management.index')}</th>
            <th>{translate('manage_warehouse.good_management.mill_code')}</th>
            <th>{translate('manage_warehouse.good_management.mill_name')}</th>
            <th>{translate('manage_warehouse.good_management.productivity')}</th>
            <th>{translate('manage_warehouse.good_management.person_number')}</th>
            <th>{translate('task_template.action')}</th>
          </tr>
        </thead>
        <tbody id={`manufacturingMill-create-1`}>
          {typeof listManufacturingMills === 'undefined' || listManufacturingMills.length === 0 ? (
            <tr>
              <td colSpan={6}>
                <center>{translate('task_template.no_data')}</center>
              </td>
            </tr>
          ) : (
            listManufacturingMills.map((x, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{x.manufacturingMill.code}</td>
                <td>{x.manufacturingMill.name}</td>
                <td>{x.productivity}</td>
                <td>{x.personNumber}</td>
                <td>
                  <a href='#abc' className='edit' title={translate('general.edit')} onClick={() => handleEditMill(x, index)}>
                    <i className='material-icons'></i>
                  </a>
                  <a href='#abc' className='delete' title={translate('general.delete')} onClick={() => handleDeleteMill(index)}>
                    <i className='material-icons'></i>
                  </a>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </fieldset>
  )
}

function mapStateToProps(state) {
  const { manufacturingMill } = state
  return { manufacturingMill }
}

const mapDispatchToProps = {
  getAllManufacturingMills: millActions.getAllManufacturingMills
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(InfoMillCreateForm))
