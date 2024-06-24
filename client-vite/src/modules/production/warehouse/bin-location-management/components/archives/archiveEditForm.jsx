import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { BinLocationActions } from '../../redux/actions'

import { SelectBox, TreeSelect, ErrorLabel, DialogModal } from '../../../../../../common-components'

function ArchiveEditForm(props) {
  const EMPTY_GOOD = {
    good: '',
    capacity: '',
    contained: ''
  }

  const [state, setState] = useState({
    currentRole: localStorage.getItem('currentRole'),
    binEnableGoods: [],
    good: Object.assign({}, EMPTY_GOOD),
    editInfo: false
  })

  useEffect(() => {
    if (props.binId !== state.binId) {
      setState({
        ...state,
        binId: props.binId,
        binStatus: props.binStatus,
        binCapacity: props.binCapacity,
        binContained: props.binContained,
        binEnableGoods: props.binEnableGoods,
        binParent: props.binParent,
        binUnit: props.binUnit,
        page: props.page,
        limit: props.limit,
        errorGood: undefined,
        errorCapacity: undefined
      })
    }
  }, [props.binId])

  // const getAllDepartment = () => {
  //     let { translate, department } = props;
  //     let manageDepartmentArr = [{ value: '', text: translate('manage_warehouse.bin_location_management.choose_department') }];

  //     department.list.map(item => {
  //         manageDepartmentArr.push({
  //             value: item._id,
  //             text: item.name
  //         })
  //     })

  //     return manageDepartmentArr;
  // }

  const getAllGoods = () => {
    let { translate, goods } = props
    let goodArr = [{ value: '', text: translate('manage_warehouse.bin_location_management.choose_good') }]

    goods.listALLGoods.map((item) => {
      goodArr.push({
        value: item._id,
        text: item.name
      })
    })

    return goodArr
  }

  const handleGoodChange = (value) => {
    let good = value[0]
    validateGood(good, true)
  }

  const validateGood = (value, willUpdateState = true) => {
    const dataGood = getAllGoods()

    let msg = undefined
    const { translate } = props
    let { good } = state
    if (!value) {
      msg = translate('manage_warehouse.bin_location_management.validate_good')
    }
    if (willUpdateState) {
      let goodName = dataGood.find((x) => x.value === value)
      good.good = { _id: value, name: goodName.text }
      setState({
        ...state,
        good: { ...good },
        errorGood: msg
      })
    }
    return msg === undefined
  }

  const handleContainedChange = (e) => {
    let value = e.target.value
    state.good.contained = value
    setState({
      ...state
    })
  }

  const handleCapacityChange = (e) => {
    let value = e.target.value
    validateCapacity(value, true)
  }

  const validateCapacity = (value, willUpdateState = true) => {
    let msg = undefined
    const { translate } = props

    if (!value) {
      msg = translate('manage_warehouse.bin_location_management.validate_capacity')
    }

    if (willUpdateState) {
      state.good.capacity = value
      setState({
        ...state,
        errorCapacity: msg
      })
    }
    return msg === undefined
  }

  const isGoodsValidated = () => {
    let result = validateGood(state.good.good, false)
    return result
  }

  const isFormValidated = () => {
    let result = validateContainedTotal(state.binContained, false)
    return result
  }

  const handleAddGood = async (e) => {
    e.preventDefault()
    let binEnableGoods = [...state.binEnableGoods, state.good]
    await setState({
      ...state,
      binEnableGoods: binEnableGoods,
      good: Object.assign({}, EMPTY_GOOD)
    })
  }

  const handleClearGood = () => {
    setState({
      ...state,
      good: Object.assign({}, EMPTY_GOOD)
    })
  }

  const handleEditGood = (good, index) => {
    setState({
      ...state,
      editInfo: true,
      indexInfo: index,
      good: Object.assign({}, good)
    })
  }

  const handleSaveEditGood = async (e) => {
    e.preventDefault()
    const { indexInfo, binEnableGoods } = state
    let newEnableGoods
    if (binEnableGoods) {
      newEnableGoods = binEnableGoods.map((item, index) => {
        return index === indexInfo ? state.good : item
      })
    }

    await setState({
      ...state,
      editInfo: false,
      binEnableGoods: newEnableGoods,
      good: Object.assign({}, EMPTY_GOOD)
    })
  }

  const handleCancelEditGood = (e) => {
    e.preventDefault()
    setState({
      ...state,
      editInfo: false,
      good: Object.assign({}, EMPTY_GOOD)
    })
  }

  const handleDeleteGood = async (index) => {
    let { binEnableGoods } = state
    let newEnableGoods
    if (binEnableGoods) {
      newEnableGoods = binEnableGoods.filter((item, x) => index !== x)
    }

    setState({
      ...state,
      binEnableGoods: newEnableGoods
    })
  }

  const handleStatusChange = (value) => {
    setState({
      ...state,
      binStatus: value[0]
    })
  }

  const handleContainedTotalChange = (e) => {
    let value = e.target.value
    validateContainedTotal(value, true)
  }

  const validateContainedTotal = (value, willUpdateState = true) => {
    let msg = undefined
    const { translate } = props

    if (!value) {
      msg = translate('manage_warehouse.bin_location_management.validate_capacity')
    }

    if (Number(value) > Number(state.binCapacity)) {
      msg = `Không thể vượt qua công suất chứa ${state.binCapacity} ${state.binUnit}`
    }

    if (willUpdateState) {
      setState({
        ...state,
        binContained: value,
        errorContained: msg
      })
    }
    return msg === undefined
  }

  const save = async () => {
    const { binId, binContained, binEnableGoods, binStatus, binParent, page, limit, currentRole } = state

    let array = []

    await props.editBinLocation(binId, {
      status: binStatus,
      enableGoods: binEnableGoods,
      parent: binParent,
      contained: binContained ? binContained : 0,
      array: array
    })

    await props.getChildBinLocations({ page, limit, managementLocation: currentRole })
  }

  const { translate, binLocations } = props
  const { binStatus, binContained, binEnableGoods, errorCapacity, errorGood, good, errorContained } = state
  const dataGoods = getAllGoods()

  return (
    <React.Fragment>
      <DialogModal
        modalID={`modal-edit-archive-stock`}
        isLoading={binLocations.isLoading}
        formID={`form-edit-archive-stock`}
        title={translate('manage_warehouse.bin_location_management.edit_title')}
        msg_success={translate('manage_warehouse.bin_location_management.edit_success')}
        msg_failure={translate('manage_warehouse.bin_location_management.edit_faile')}
        disableSubmit={!isFormValidated()}
        func={save}
        size={75}
      >
        <form id={`form-edit-archive-stock`}>
          <div className='row'>
            <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
              <div className={`form-group`}>
                <label>
                  {translate('manage_warehouse.bin_location_management.status')}
                  <span className='text-red'> * </span>
                </label>
                <SelectBox
                  id={`select-status-bin-location-edit`}
                  className='form-control select2'
                  style={{ width: '100%' }}
                  value={binStatus}
                  items={[
                    { value: '1', text: translate('manage_warehouse.bin_location_management.1.status') },
                    { value: '2', text: translate('manage_warehouse.bin_location_management.2.status') },
                    { value: '3', text: translate('manage_warehouse.bin_location_management.3.status') },
                    { value: '4', text: translate('manage_warehouse.bin_location_management.4.status') },
                    { value: '5', text: translate('manage_warehouse.bin_location_management.5.status') }
                  ]}
                  onChange={handleStatusChange}
                  multiple={false}
                />
              </div>
            </div>
            <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
              <div className={`form-group ${!errorContained ? '' : 'has-error'}`}>
                <label>
                  {translate('manage_warehouse.bin_location_management.contained')}
                  <span className='text-red'> * </span>
                </label>
                <input
                  type='number'
                  className='form-control'
                  value={binContained ? binContained : 0}
                  onChange={handleContainedTotalChange}
                />
                <ErrorLabel content={errorContained} />
              </div>
            </div>
            <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
              <fieldset className='scheduler-border'>
                <legend className='scheduler-border'>{translate('manage_warehouse.bin_location_management.enable_good')}</legend>

                <div className={`form-group ${!errorGood ? '' : 'has-error'}`}>
                  <label>{translate('manage_warehouse.good_management.good')}</label>
                  <SelectBox
                    id={`select-good-by-bin-edit`}
                    className='form-control select2'
                    style={{ width: '100%' }}
                    value={
                      good.good._id ? good.good._id : { value: '', text: translate('manage_warehouse.bin_location_management.choose_good') }
                    }
                    items={dataGoods}
                    onChange={handleGoodChange}
                    multiple={false}
                  />
                  <ErrorLabel content={errorGood} />
                </div>
                <div className={`form-group`}>
                  <label className='control-label'>{translate('manage_warehouse.bin_location_management.contained')}</label>
                  <div>
                    <input
                      type='number'
                      className='form-control'
                      value={good.contained}
                      // disabled
                      placeholder={translate('manage_warehouse.good_management.contained')}
                      onChange={handleContainedChange}
                    />
                  </div>
                </div>
                <div className={`form-group ${!errorCapacity ? '' : 'has-error'}`}>
                  <label className='control-label'>{translate('manage_warehouse.bin_location_management.max_quantity')}</label>
                  <div>
                    <input
                      type='number'
                      className='form-control'
                      value={good.capacity}
                      placeholder={translate('manage_warehouse.good_management.max_quantity')}
                      onChange={handleCapacityChange}
                    />
                  </div>
                  <ErrorLabel content={errorCapacity} />
                </div>

                <div className='pull-right' style={{ marginBottom: '10px' }}>
                  {state.editInfo ? (
                    <React.Fragment>
                      <button className='btn btn-success' onClick={handleCancelEditGood} style={{ marginLeft: '10px' }}>
                        {translate('task_template.cancel_editing')}
                      </button>
                      <button
                        className='btn btn-success'
                        disabled={!isGoodsValidated()}
                        onClick={handleSaveEditGood}
                        style={{ marginLeft: '10px' }}
                      >
                        {translate('task_template.save')}
                      </button>
                    </React.Fragment>
                  ) : (
                    <button
                      className='btn btn-success'
                      style={{ marginLeft: '10px' }}
                      disabled={!isGoodsValidated()}
                      onClick={handleAddGood}
                    >
                      {translate('task_template.add')}
                    </button>
                  )}
                  <button className='btn btn-primary' style={{ marginLeft: '10px' }} onClick={handleClearGood}>
                    {translate('task_template.delete')}
                  </button>
                </div>

                <table className='table table-bordered'>
                  <thead>
                    <tr>
                      <th title={translate('manage_warehouse.bin_location_management.good')}>
                        {translate('manage_warehouse.bin_location_management.good')}
                      </th>
                      <th title={translate('manage_warehouse.bin_location_management.contained')}>
                        {translate('manage_warehouse.bin_location_management.contained')}
                      </th>
                      <th title={translate('manage_warehouse.bin_location_management.max_quantity')}>
                        {translate('manage_warehouse.bin_location_management.max_quantity')}
                      </th>
                      <th>{translate('task_template.action')}</th>
                    </tr>
                  </thead>
                  <tbody id={`good-manage-by-stock`}>
                    {typeof binEnableGoods === 'undefined' || binEnableGoods.length === 0 ? (
                      <tr>
                        <td colSpan={4}>
                          <center>{translate('task_template.no_data')}</center>
                        </td>
                      </tr>
                    ) : (
                      binEnableGoods.map((x, index) => (
                        <tr key={index}>
                          <td>{x.good.name}</td>
                          <td>{x.contained}</td>
                          <td>{x.capacity}</td>
                          <td>
                            <a href='#abc' className='edit' title={translate('general.edit')} onClick={() => handleEditGood(x, index)}>
                              <i className='material-icons'></i>
                            </a>
                            <a href='#abc' className='delete' title={translate('general.delete')} onClick={() => handleDeleteGood(index)}>
                              <i className='material-icons'></i>
                            </a>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </fieldset>
            </div>
          </div>
        </form>
      </DialogModal>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => state

const mapDispatchToProps = {
  editBinLocation: BinLocationActions.editBinLocation,
  getChildBinLocations: BinLocationActions.getChildBinLocations
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ArchiveEditForm))
