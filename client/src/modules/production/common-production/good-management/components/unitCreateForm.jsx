import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { ErrorLabel, SelectMulti } from '../../../../../common-components'
import Swal from 'sweetalert2'

function UnitCreateForm(props) {
  const EMPTY_UNIT = {
    name: '',
    conversionRate: '',
    description: '',
    width: '',
    height: '',
    depth: '',
    weight: '',
    volume: ''
  }

  const [state, setState] = useState({
    unit: Object.assign({}, EMPTY_UNIT),
    listUnit: props.initialData,
    editInfo: false,
    listUnitSelected: []
  })

  const getListUnitArray = () => {
    let listUnitArray = []
    if (state.baseUnit !== '') {
      listUnitArray.push({
        value: state.baseUnit,
        text: state.baseUnit,
        conversionRate: 1
      })
    }

    if (props.initialData.length) {
      props.initialData.map((unit, index) => {
        listUnitArray.push({
          value: index,
          text: unit.name,
          conversionRate: parseFloat(unit.conversionRate)
        })
      })
    }
    return listUnitArray
  }

  // const handleSelectMultiBaseUnit = (value) => {
  //     if (value.length == 0) {
  //         value = null;
  //     }
  //     validateMultiBaseUnit(value, true)
  // }

  // const validateMultiBaseUnit = (value, willUpdateState) => {
  //     let msg = undefined;

  //     const { translate } = props;
  //     if (!value) {
  //         msg = translate('manage_warehouse.good_management.choose_base_unit')
  //     }
  //     if (willUpdateState) {
  //         let packingRule = "";
  //         if (value) {
  //             packingRule = convertToPackingRule(value);
  //         }
  //         if (packingRule !== "") {
  //             setState({
  //                 ...state,
  //                 packingRule: packingRule,
  //                 listUnitSelected: value,
  //                 errorOnBaseUnit: msg
  //             });
  //         } else {
  //             setState({
  //                 ...state,
  //                 listUnitSelected: value,
  //                 packingRule: packingRule,
  //                 errorOnBaseUnit: value ? translate("manage_warehouse.good_management.error_packing_rule") : msg
  //             })
  //         }

  //         props.onDataChange(state.listUnit);
  //         props.onDataChange(state.listUnit, state.packingRule);

  //     }

  //     return msg
  // }

  // Hàm sắp xếp subListUnitArray theo thứ tự conversion rate tăng dần
  // const sortListUnitArray = (array) => {
  //     for (let i = 0; i < array.length; i++) {
  //         for (let j = i + 1; j < array.length; j++) {
  //             if (array[i].conversionRate > array[j].conversionRate) {
  //                 let tmp = array[i];
  //                 array[i] = array[j];
  //                 array[j] = tmp
  //             }
  //         }
  //     }
  //     return array;
  // }

  // Hàm này validate xem list unit có hợp lệ để tạo thành một packingRule hay không
  // Input là 1 array chứa các phần tử có conversion rate tăng dần
  // const validateListUnitArray = (array) => {
  //     for (let i = 0; i < array.length - 1; i++) {
  //         let rate = array[i + 1].conversionRate / array[i].conversionRate;
  //         if (!Number.isInteger(rate)) {
  //             return false;
  //         }
  //     }
  //     return true;
  // }

  // const convertToPackingRule = (value) => {
  //     let packingRule = '';
  //     let listUnitArray = getListUnitArray();
  //     let subListUnitArray = [];
  //     for (let i = 0; i < listUnitArray.length; i++) {
  //         for (let j = 0; j < value.length; j++) {
  //             if (listUnitArray[i].value == value[j]) {
  //                 subListUnitArray.push(listUnitArray[i]);
  //                 break;
  //             }
  //         }
  //     }
  //     let sortListUnitArr = sortListUnitArray(subListUnitArray);
  //     let resultValidate = validateListUnitArray(sortListUnitArr);
  //     // Nếu chuỗi tạo thành được 1 packingRule
  //     if (resultValidate) {
  //         let maxIndexOfArray = sortListUnitArr.length - 1;
  //         packingRule += sortListUnitArr[maxIndexOfArray].text;
  //         if (maxIndexOfArray > 0) {
  //             for (let i = maxIndexOfArray - 1; i >= 0; i--) {
  //                 packingRule += " x " + (sortListUnitArr[i + 1].conversionRate / sortListUnitArr[i].conversionRate) + sortListUnitArr[i].text
  //             }

  //         }
  //     }
  //     return packingRule;
  // }

  if (props.id !== state.id || props.baseUnit !== state.baseUnit) {
    setState({
      ...state,
      baseUnit: props.baseUnit,
      id: props.id,
      // packingRule: props.packingRule,
      listUnit: props.initialData
    })
  }

  const handleUnitNameChange = (e) => {
    let value = e.target.value
    validateUnitName(value, true)
  }

  const validateUnitName = (value, willUpdateState = true) => {
    let msg = undefined
    const { translate } = props
    if (!value) {
      msg = translate('manage_warehouse.category_management.validate_name')
    }
    if (willUpdateState) {
      state.unit.name = value
      setState({
        ...state,
        errorOnUnitName: msg
      })
    }
    return msg === undefined
  }

  const handleConversionRateChange = (e) => {
    let value = e.target.value
    validateConversionRate(value, true)
  }

  const validateConversionRate = (value, willUpdateState = true) => {
    let msg = undefined
    const { translate } = props
    if (!value) {
      msg = translate('manage_warehouse.category_management.validate_name')
    }
    if (willUpdateState) {
      state.unit.conversionRate = value
      setState({
        ...state,
        errorOnUnitConversionRate: msg
      })
    }
    return msg === undefined
  }

  const handleDescriptionChange = (e) => {
    let value = e.target.value
    state.unit.description = value
    setState({
      ...state
    })
  }

  const handleDimensionChange = (data, type) => {
    state.unit[type] = data
    setState({
      ...state,
      [type]: data
    })
  }

  const isUnitsValidated = () => {
    let result = validateUnitName(state.unit.name, false) && validateConversionRate(state.unit.conversionRate, false)
    return result
  }

  const handleAddUnit = async (e) => {
    e.preventDefault()
    let { listUnit, unit } = state
    listUnit.push(unit)
    await setState({
      ...state,
      listUnit: [...listUnit],
      unit: Object.assign({}, EMPTY_UNIT)
    })
    props.onDataChange(state.listUnit)
    // props.onDataChange(state.listUnit, state.packingRule);
  }

  const handleEditUnit = async (unit, index) => {
    setState({
      ...state,
      editInfo: true,
      indexInfo: index,
      unit: Object.assign({}, unit)
    })
  }

  const handleSaveEditUnit = async (e) => {
    e.preventDefault()
    const { listUnit, unit, indexInfo } = state
    listUnit[indexInfo] = unit
    await setState({
      ...state,
      listUnit: [...listUnit],
      editInfo: false,
      unit: Object.assign({}, EMPTY_UNIT)
    })
    // props.onDataChange(state.listUnit, state.packingRule);
    props.onDataChange(state.listUnit)
  }

  const handleCancelEditUnit = async (e) => {
    e.preventDefault()
    setState({
      ...state,
      editInfo: false,
      unit: Object.assign({}, EMPTY_UNIT)
    })
  }

  const handleClearUnit = async (e) => {
    e.preventDefault()
    setState({
      ...state,
      unit: Object.assign({}, EMPTY_UNIT)
    })
  }

  const handleDeleteUnit = async (index) => {
    const { listUnit } = state
    let newListUnit
    if (listUnit) {
      newListUnit = listUnit.filter((item, x) => index !== x)
    }
    await setState({
      ...state,
      listUnit: newListUnit
    })

    // props.onDataChange(state.listUnit, state.packingRule);
    props.onDataChange(state.listUnit)
  }
  const showListExplainUnit = () => {
    Swal.fire({
      icon: 'question',

      html: `<h3 style="color: red"><div>Đơn vị tính</div> </h3>
            <div style="font-size: 1.3em; text-align: left; margin-top: 15px; line-height: 1.7">
            <p>Đơn vị quy đổi từ đơn vị cơ bản</p>
            <p>Ví dụ : đơn vị tính cơ bản chiếc
            Đơn vị quy đổi : Hộp
            1 Hộp = 20 chiếc.</b></p>`,
      width: '50%'
    })
  }

  const { translate, id } = props
  let { listUnit, unit, errorOnUnitName, errorOnConversionRate, description, conversionRate, errorOnBaseUnit, listUnitSelected } = state
  return (
    <fieldset className='scheduler-border'>
      <legend className='scheduler-border'>
        {'Quy tắc đóng gói'}
        <a onClick={() => showListExplainUnit()}>
          <i className='fa fa-question-circle' style={{ cursor: 'pointer', marginLeft: '5px' }} />
        </a>
      </legend>
      <div className='col-xs-12 col-sm-4 col-md-4 col-lg-4'>
        <div className={`form-group ${!errorOnUnitName ? '' : 'has-error'}`}>
          <label className='control-label'>{translate('manage_warehouse.good_management.unit_name')}</label>
          <div>
            <input
              type='text'
              className='form-control'
              placeholder={translate('manage_warehouse.good_management.unit_name')}
              value={unit.name}
              onChange={handleUnitNameChange}
            />
          </div>
          <ErrorLabel content={errorOnUnitName} />
        </div>
      </div>
      <div className='col-xs-12 col-sm-4 col-md-4 col-lg-4'>
        <div className={`form-group ${!errorOnConversionRate ? '' : 'has-error'}`}>
          <label className='control-label'>{translate('manage_warehouse.good_management.conversion_rate')}</label>
          <div>
            <input
              type='number'
              className='form-control'
              placeholder={translate('manage_warehouse.good_management.conversion_rate')}
              value={unit.conversionRate}
              onChange={handleConversionRateChange}
            />
          </div>
          <ErrorLabel content={errorOnConversionRate} />
        </div>
      </div>
      <div className='col-xs-12 col-sm-4 col-md-4 col-lg-4'>
        <div className={`form-group`}>
          <label>{'Khối lượng (kg)'}</label>
          <input
            type='number'
            className='form-control'
            value={unit.weight}
            onChange={(e) => handleDimensionChange(e.target.value, 'weight')}
            placeholder='Ví dụ: 1kg'
          />
        </div>
      </div>
      <div className='col-xs-12 col-sm-3 col-md-3 col-lg-3'>
        <div className={`form-group`}>
          <label>{'Chiều dài (m)'}</label>
          <input
            type='number'
            className='form-control'
            value={unit.height}
            onChange={(e) => handleDimensionChange(e.target.value, 'height')}
            placeholder='Ví dụ: 0.5m'
          />
        </div>
      </div>
      <div className='col-xs-12 col-sm-3 col-md-3 col-lg-3'>
        <div className={`form-group`}>
          <label>{'Chiều rộng (m)'}</label>
          <input
            type='number'
            className='form-control'
            value={unit.width}
            onChange={(e) => handleDimensionChange(e.target.value, 'width')}
            placeholder='Ví dụ: 0.1 m'
          />
        </div>
      </div>
      <div className='col-xs-12 col-sm-3 col-md-3 col-lg-3'>
        <div className={`form-group`}>
          <label>{'Chiều cao (m)'}</label>
          <input
            type='number'
            className='form-control'
            value={unit.depth}
            onChange={(e) => handleDimensionChange(e.target.value, 'depth')}
            placeholder='Ví dụ: 1m'
          />
        </div>
      </div>
      <div className='col-xs-12 col-sm-3 col-md-3 col-lg-3'>
        <div className={`form-group`}>
          <label>{'Thể tích'}</label>
          <input
            type='number'
            className='form-control'
            value={unit.volume}
            onChange={(e) => handleDimensionChange(e.target.value, 'volume')}
            placeholder='Ví dụ: 1m3'
          />
        </div>
      </div>
      <div className='col-xs-12'>
        <div className='form-group'>
          <label className='control-label'>{translate('manage_warehouse.good_management.description')}</label>
          <div>
            <textarea
              type='number'
              className='form-control'
              placeholder={translate('manage_warehouse.good_management.description')}
              value={unit.description}
              onChange={handleDescriptionChange}
            />
          </div>
        </div>
      </div>

      <div className='pull-right' style={{ marginBottom: '10px' }}>
        {state.editInfo ? (
          <React.Fragment>
            <button className='btn btn-success' onClick={handleCancelEditUnit} style={{ marginLeft: '10px' }}>
              {translate('task_template.cancel_editing')}
            </button>
            <button className='btn btn-success' disabled={!isUnitsValidated()} onClick={handleSaveEditUnit} style={{ marginLeft: '10px' }}>
              {translate('task_template.save')}
            </button>
          </React.Fragment>
        ) : (
          <button className='btn btn-success' style={{ marginLeft: '10px' }} disabled={!isUnitsValidated()} onClick={handleAddUnit}>
            {translate('task_template.add')}
          </button>
        )}
        <button className='btn btn-primary' style={{ marginLeft: '10px' }} onClick={handleClearUnit}>
          {translate('task_template.delete')}
        </button>
      </div>

      <table className='table table-bordered'>
        <thead>
          <tr>
            <th title={'Tên đơn vị'}>{'Tên đơn vị'}</th>
            <th title={translate('manage_warehouse.good_management.conversion_rate')}>
              {translate('manage_warehouse.good_management.conversion_rate')}
            </th>
            <th title={'Chiều dài'}>{'Chiều dài'}</th>
            <th title={'Chiều rộng'}>{'Chiều rộng'}</th>
            <th title={'Chiều cao'}>{'Chiều cao'}</th>
            <th title={'Thể tích'}>{'Thể tích'}</th>
            <th title={'Khối lượng'}>{'Khối lượng'}</th>
            <th title={translate('manage_warehouse.good_management.description')}>
              {translate('manage_warehouse.good_management.description')}
            </th>
            <th>{translate('task_template.action')}</th>
          </tr>
        </thead>
        <tbody id={`unit-create-good${id}`}>
          {typeof listUnit === 'undefined' || listUnit.length === 0 ? (
            <tr>
              <td colSpan={4}>
                <center>{translate('task_template.no_data')}</center>
              </td>
            </tr>
          ) : (
            listUnit.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.conversionRate}</td>
                <td>{item.height ? item.height : ''}</td>
                <td>{item.width ? item.width : ''}</td>
                <td>{item.depth ? item.depth : ''}</td>
                <td>{item.volume ? item.volume : ''}</td>
                <td>{item.weight ? item.weight : ''}</td>
                <td>{item.description}</td>
                <td>
                  <a href='#abc' className='edit' title={translate('general.edit')} onClick={() => handleEditUnit(item, index)}>
                    <i className='material-icons'></i>
                  </a>
                  <a href='#abc' className='delete' title={translate('general.delete')} onClick={() => handleDeleteUnit(index)}>
                    <i className='material-icons'></i>
                  </a>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {/* <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                <div className={`form-group ${!errorOnBaseUnit ? "" : "has-error"}`}>
                    <label style={{ width: 'auto' }}>{translate('manage_warehouse.good_management.packing_rule')} <span className="text-red"> * </span></label>
                    <SelectMulti
                        id={`multi-select-base-unit-${id}`}
                        items={getListUnitArray()}
                        options={{ nonSelectedText: translate('manage_warehouse.good_management.non_choose_base_unit'), allSelectedText: translate('manage_warehouse.good_management.choose_base_unit_all') }}
                        onChange={handleSelectMultiBaseUnit}
                    >
                    </SelectMulti>

                </div>
            </div>
            <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                <div className={`form-group ${!errorOnBaseUnit ? "" : "has-error"}`}>
                    <ErrorLabel content={errorOnBaseUnit} />
                    {
                        packingRule || !errorOnBaseUnit && listUnitSelected.length > 0 && packingRule
                    }
                </div>
            </div> */}
    </fieldset>
  )
}

export default connect(null, null)(withTranslate(UnitCreateForm))
