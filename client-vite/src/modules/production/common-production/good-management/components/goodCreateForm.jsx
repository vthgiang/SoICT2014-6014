import React, { useState, useEffect } from 'react'
import { withTranslate } from 'react-redux-multilingual'
import { connect } from 'react-redux'
import { DialogModal, TreeSelect, ErrorLabel, ButtonModal, SelectBox } from '../../../../../common-components'
import { GoodActions } from '../redux/actions'
import { CategoryActions } from '../../category-management/redux/actions'
import UnitCreateForm from './unitCreateForm'
import PriceCreateForm from './priceCreateForm'
import ComponentCreateForm from './componentCreateForm'
import InfoMillCreateForm from './infoMillCreateForm'
import { generateCode } from '../../../../../helpers/generateCode'
import Swal from 'sweetalert2'
import VariantCreateForm from './variantCreateForm'
import OptionalAttributeCreateForm from './optionalAttributeCreateForm'
import ImportGoodModal from './importGoodModal'

function GoodCreateForm(props) {
  const [state, setState] = useState({
    code: '',
    name: '',
    baseUnit: '',
    units: [],
    // packingRule: '',
    prices: [],
    materials: [],
    quantity: 0,
    description: '',
    type: props.type,
    category: '',
    pricePerBaseUnit: '',
    salesPriceVariance: '',
    numberExpirationDate: '',
    sourceType: '',
    optionalAttributes: [],
    variants: [],
    excludingGoods: []
  })

  let dataSource = [
    {
      value: '0',
      text: 'Chọn nguồn hàng hóa'
    },
    {
      value: '1',
      text: 'Hàng hóa tự sản xuất'
    },
    {
      value: '2',
      text: 'Hàng hóa nhập từ nhà cung cấp'
    }
  ]

  useEffect(() => {
    props.getAllGoods()
  }, [])

  useEffect(() => {
    if (props.type !== state.type) {
      setState({
        type: props.type,
        baseUnit: props.baseUnit ? props.baseUnit : '',
        units: props.units ? props.units : [],
        // packingRule: props.packingRule ? props.packingRule : '',
        materials: props.materials ? props.materials : [],
        description: props.description ? props.description : '',
        code: props.code ? props.code : '',
        name: props.name ? props.name : '',
        pricePerBaseUnit: props.pricePerBaseUnit ? props.pricePerBaseUnit : '',
        salesPriceVariance: props.salesPriceVariance ? props.salesPriceVariance : '',
        numberExpirationDate: props.numberExpirationDate ? props.numberExpirationDate : '',
        width: props.width ? props.width : '',
        height: props.height ? props.height : '',
        depth: props.depth ? props.depth : '',
        weight: props.weight ? props.weight : '',
        volume: props.volume ? props.volume : ''
      })
    }
  }, [props.type])

  const validatePrice = (value) => {
    let msg = undefined
    if (value && parseInt(value) < 0) {
      msg = 'Giá trị không được âm'
    }
    return msg
  }

  const handlePricePerBaseUnitChange = (e) => {
    let { value } = e.target
    setState({
      ...state,
      pricePerBaseUnit: value,
      pricePerBaseUnitError: validatePrice(value)
    })
  }

  const handleSalesPriceVarianceChange = (e) => {
    let { value } = e.target
    setState({
      ...state,
      salesPriceVariance: value,
      salesPriceVarianceError: validatePrice(value)
    })
  }

  const handleCodeChange = (e) => {
    let value = e.target.value
    validateCode(value, true)
  }

  const validateCode = (value, willUpdateState = true) => {
    let msg = undefined
    const { translate, type } = props
    if (!value) {
      msg = translate('manage_warehouse.category_management.validate_code')
    }
    if (willUpdateState) {
      setState({
        ...state,
        errorOnCode: msg,
        code: value,
        type: type
      })
    }
    return msg === undefined
  }

  const handleNameChange = (e) => {
    let value = e.target.value
    validateName(value, true)
  }

  const validateName = (value, willUpdateState = true) => {
    let msg = undefined
    const { translate } = props
    if (!value) {
      msg = translate('manage_warehouse.category_management.validate_name')
    }
    if (willUpdateState) {
      setState({
        ...state,
        errorOnName: msg,
        name: value
      })
    }
    return msg === undefined
  }

  const handleSourceChange = (value) => {
    validateSourceProduct(value[0], true)
  }

  const validateSourceProduct = (value, willUpdateState = true) => {
    let msg = undefined
    const { translate } = props
    if (value !== '1' && value !== '2') {
      msg = translate('manage_warehouse.good_management.validate_source_product')
    }
    if (willUpdateState) {
      setState({
        ...state,
        errorOnSourceProduct: msg,
        sourceType: value,
        materials: value === '2' ? [] : state.materials,
        manufacturingMills: value === '2' ? [] : state.manufacturingMills
      })
    }
    return msg === undefined
  }

  const getDataGoods = () => {
    const { goods } = props
    let dataGoods = []
    goods.listALLGoods.map((item) => {
      dataGoods.push({
        value: item._id,
        text: item.name
      })
    })

    return dataGoods
  }

  const handleBaseUnitChange = (e) => {
    let value = e.target.value
    validateBaseUnit(value, true)
  }

  const validateBaseUnit = (value, willUpdateState = true) => {
    let msg = undefined
    const { translate } = props
    if (!value) {
      msg = translate('manage_warehouse.category_management.validate_name')
    }
    if (willUpdateState) {
      setState({
        ...state,
        errorOnBaseUnit: msg,
        baseUnit: value
      })
    }
    return msg === undefined
  }

  const handleCategoryChange = (value) => {
    let category = value[0]
    validateCategory(category, true)
  }

  const validateCategory = (category, willUpdateState = true) => {
    let msg = undefined
    const { translate } = props
    if (!category) {
      msg = translate('manage_warehouse.category_management.validate_name')
    }
    if (willUpdateState) {
      setState({
        ...state,
        errorOnCategory: msg,
        category: category
      })
    }
    return msg === undefined
  }

  const getAllCategory = () => {
    let { categories } = props
    let categoryArr = []
    if (categories.categoryToTree.list.length > 0) {
      categories.categoryToTree.list.map((item) => {
        categoryArr.push({
          _id: item._id,
          id: item._id,
          state: { open: true },
          name: item.name,
          parent: item.parent ? item.parent.toString() : null
        })
      })
    }
    return categoryArr
  }

  const handleDescriptionChange = (e) => {
    let value = e.target.value
    setState({
      ...state,
      description: value
    })
  }

  const handleListUnitChange = (litsUnits, packingRule) => {
    setState({
      ...state,
      units: litsUnits
      // packingRule: packingRule,
    })
  }

  const handlePriceChange = (data) => {
    setState({
      ...state,
      pricePerBaseUnit: data.defaultPrice,
      prices: data
    })
  }

  const handleListMaterialChange = (data) => {
    setState({
      ...state,
      materials: data
    })
  }

  const handleListMillsChange = (data) => {
    setState({
      ...state,
      manufacturingMills: data
    })
  }

  const handleDimensionChange = (data, type) => {
    setState({
      ...state,
      [type]: data
    })
  }

  const handleNumberExpirationDateChange = (e) => {
    const { value } = e.target
    validateNumberExpirationDate(value, true)
  }

  const validateNumberExpirationDate = (value, willUpdateState = true) => {
    let msg = undefined
    const { translate } = props
    if (value === '') {
      msg = translate('manage_warehouse.good_management.validate_number_expiration_date')
    }
    if (value < 1) {
      msg = translate('manage_warehouse.good_management.validate_number_expiration_date_input')
    }
    if (willUpdateState) {
      setState({
        ...state,
        errorOnNumberExpirationDate: msg,
        numberExpirationDate: value
      })
    }
    return msg === undefined
  }

  const handleExcludingGoodsChange = (value) => {
    setState({
      ...state,
      excludingGoods: value
    })
  }

  const isFormValidated = () => {
    let { name, code, baseUnit, category, materials, numberExpirationDate, type, sourceType } = state
    let result
    result =
      validateName(name, false) &&
      validateCode(code, false) &&
      validateBaseUnit(baseUnit, false) &&
      validateCategory(category, false) &&
      // ((type && type === "product") && sourceType === "1") ? materials.length > 0 : true &&
      validateNumberExpirationDate(numberExpirationDate, false) &&
      validateSourceProduct(sourceType, false)
    return result
  }

  // Function lưu các trường thông tin vào state
  const handleChangeOptionalAttribute = (data) => {
    setState({
      ...state,
      optionalAttributes: data
    })
  }

  const handleChangeVariant = (data) => {
    setState({
      ...state,
      variants: data
    })
  }

  const save = () => {
    if (isFormValidated()) {
      props.createGoodByType(state)
    }
  }

  const showListExplainVariance = () => {
    Swal.fire({
      icon: 'question',

      html: `<h3 style="color: red"><div>Khối lượng một đơn vị tính cơ bản</div> </h3>
            <div style="font-size: 1.3em; text-align: left; margin-top: 15px; line-height: 1.7">
            <p>Đơn vị tính: Kg</p>
            <p>Nhập vào khối lượng hàng hóa, khối lượng dùng để tính chi phí vận chuyển hàng hóa .</p>`,
      width: '50%'
    })
  }
  const showExplainExcludingGoods = () => {
    Swal.fire({
      icon: 'question',
      html: `<h3 style="color: red"><div>Hàng hóa loại trừ</div> </h3>
            <div style="font-size: 1.3em; text-align: left; margin-top: 15px; line-height: 1.7">
            <p>Thông tin này sử dụng để lưu trữ hàng hóa trong kho hoặc khi vận chuyển, tránh xảy ra xung đột hàng hóa .</p>`,
      width: '50%'
    })
  }

  const handleClickCreate = (event, type) => {
    let code = generateCode('HH')
    setState({
      ...state,
      code: code
    })
    event.preventDefault()
    window.$(`#modal-create-${type}`).modal('show')
  }
  let listUnit = []
  let priceInfomation = []
  let listMaterial = []
  const { translate, goods, categories, type } = props
  const {
    errorOnName,
    errorOnCode,
    errorOnBaseUnit,
    errorOnCategory,
    errorOnSourceProduct,
    code,
    name,
    category,
    units,
    // packingRule,
    prices,
    baseUnit,
    description,
    materials,
    pricePerBaseUnit,
    pricePerBaseUnitError,
    salesPriceVariance,
    salesPriceVarianceError,
    numberExpirationDate,
    errorOnNumberExpirationDate,
    sourceType,
    excludingGoods,
    width,
    height,
    depth,
    weight,
    volume
  } = state
  const dataSelectBox = getAllCategory()

  if (units) listUnit = units
  if (prices) priceInfomation = prices
  if (materials) listMaterial = materials
  let dataGoods = getDataGoods()
  return (
    <React.Fragment>
      <div className='dropdown pull-right'>
        <button
          type='button'
          className='btn btn-success dropdown-toggler pull-right'
          data-toggle='dropdown'
          aria-expanded='true'
          title={translate('manage_warehouse.category_management.add')}
        >
          {translate('manage_warehouse.category_management.add')}
        </button>
        <ul className='dropdown-menu pull-right'>
          <li>
            <a
              href='#modal-create-good'
              title='Add goood'
              onClick={(event) => {
                handleClickCreate(event, type)
              }}
            >
              {translate('manage_warehouse.category_management.add')}
            </a>
          </li>
          <li>
            <a
              style={{ cursor: 'pointer' }}
              onClick={() => {
                window.$('#import_good').modal('show')
              }}
            >
              {translate('human_resource.profile.employee_management.add_import')}
            </a>
          </li>
        </ul>
        <ImportGoodModal />
      </div>
      <DialogModal
        modalID={`modal-create-${type}`}
        isLoading={goods.isLoading}
        formID={`form-create-${type}`}
        title={translate(`manage_warehouse.good_management.add_title.${type}`)}
        msg_success={translate('manage_warehouse.good_management.add_success')}
        msg_failure={translate('manage_warehouse.good_management.add_faile')}
        disableSubmit={!isFormValidated()}
        func={save}
        size={75}
      >
        <form id={`form-create-${type}`}>
          <div className='row'>
            <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
              <div className={`form-group ${!errorOnCode ? '' : 'has-error'}`}>
                <label>
                  {translate('manage_warehouse.good_management.code')}
                  <span className='text-red'> * </span>
                </label>
                <input type='text' className='form-control' disabled={true} value={code} onChange={handleCodeChange} />
                <ErrorLabel content={errorOnCode} />
              </div>
              <div className={`form-group ${!errorOnName ? '' : 'has-error'}`}>
                <label>
                  {translate('manage_warehouse.good_management.name')}
                  <span className='text-red'> * </span>
                </label>
                <input type='text' className='form-control' value={name} onChange={handleNameChange} />
                <ErrorLabel content={errorOnName} />
              </div>
            </div>

            <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
              <div className={`form-group ${!errorOnSourceProduct ? '' : 'has-error'}`}>
                <label>{translate('manage_warehouse.good_management.good_source')}</label>
                <span className='text-red'> * </span>
                <SelectBox
                  id={`select-source-type`}
                  className='form-control select2'
                  style={{ width: '100%' }}
                  value={sourceType}
                  items={dataSource}
                  onChange={handleSourceChange}
                  multiple={false}
                />
                <ErrorLabel content={errorOnSourceProduct} />
              </div>
              <div className={`form-group ${!errorOnCategory ? '' : 'has-error'}`}>
                <label>
                  {translate('manage_warehouse.good_management.category')}
                  <span className='text-red'> * </span>
                </label>
                <TreeSelect data={dataSelectBox} value={category} handleChange={handleCategoryChange} mode='hierarchical' />
                <ErrorLabel content={errorOnCategory} />
              </div>
            </div>
            <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
              <div className={`form-group ${!errorOnBaseUnit ? '' : 'has-error'}`}>
                <label>
                  {translate('manage_warehouse.good_management.baseUnit')}
                  <span className='text-red'> * </span>
                </label>
                <input type='text' className='form-control' value={baseUnit} onChange={handleBaseUnitChange} />
                <ErrorLabel content={errorOnBaseUnit} />
              </div>
              <div className={`form-group ${!errorOnNumberExpirationDate ? '' : 'has-error'}`}>
                <label>
                  {translate('manage_warehouse.good_management.numberExpirationDate')}
                  <span className='text-red'> * </span>
                </label>
                <input type='number' className='form-control' value={numberExpirationDate} onChange={handleNumberExpirationDateChange} />
                <ErrorLabel content={errorOnNumberExpirationDate} />
              </div>
            </div>
            <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
              <div className={`form-group ${!pricePerBaseUnitError ? '' : 'has-error'}`}>
                <label>
                  {'Giá một đơn vị tính cơ bản'}
                  <span className='text-red'> </span>
                </label>
                <input
                  type='number'
                  className='form-control'
                  value={pricePerBaseUnit}
                  onChange={handlePricePerBaseUnitChange}
                  placeholder='Ví dụ: 1000000'
                />
                <ErrorLabel content={pricePerBaseUnitError} />
              </div>
              <div className={`form-group ${!salesPriceVarianceError ? '' : 'has-error'}`}>
                <label>
                  {'Phương sai giá bán'}
                  <span className='text-red'> </span>
                </label>
                <a onClick={() => showListExplainVariance()}>
                  <i className='fa fa-question-circle' style={{ cursor: 'pointer', marginLeft: '5px' }} />
                </a>
                <input
                  type='number'
                  className='form-control'
                  value={salesPriceVariance}
                  onChange={handleSalesPriceVarianceChange}
                  placeholder='Ví dụ: 50000'
                />
                <ErrorLabel content={salesPriceVarianceError} />
              </div>
            </div>
            <div className='col-xs-12 col-sm-3 col-md-3 col-lg-3'>
              <div className={`form-group`}>
                <label>{'Chiều dài (m)'}</label>
                <input
                  type='number'
                  className='form-control'
                  value={height}
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
                  value={width}
                  onChange={(e) => handleDimensionChange(e.target.value, 'width')}
                  placeholder='Ví dụ: 0.1m'
                />
              </div>
            </div>
            <div className='col-xs-12 col-sm-3 col-md-3 col-lg-3'>
              <div className={`form-group`}>
                <label>{'Chiều cao (m)'}</label>
                <input
                  type='number'
                  className='form-control'
                  value={depth}
                  onChange={(e) => handleDimensionChange(e.target.value, 'depth')}
                  placeholder='Ví dụ: 1m'
                />
              </div>
            </div>
            <div className='col-xs-12 col-sm-3 col-md-3 col-lg-3'>
              <div className={`form-group`}>
                <label>{'Thể tích (m3)'}</label>
                <input
                  type='number'
                  className='form-control'
                  value={volume}
                  onChange={(e) => handleDimensionChange(e.target.value, 'volume')}
                  placeholder='Ví dụ: 1m3'
                />
              </div>
            </div>
            <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
              <div className={`form-group`}>
                <label>{translate('manage_warehouse.good_management.excluding_good')}</label>
                <a onClick={() => showExplainExcludingGoods()}>
                  <i className='fa fa-question-circle' style={{ cursor: 'pointer', marginLeft: '5px' }} />
                </a>
                <SelectBox
                  id={`select-excluding-good`}
                  className='form-control select2'
                  style={{ width: '100%' }}
                  value={excludingGoods}
                  items={dataGoods}
                  onChange={handleExcludingGoodsChange}
                  multiple={true}
                />
              </div>
            </div>
            <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
              <div className={`form-group`}>
                <label>{'Khối lượng (kg)'}</label>
                <input
                  type='number'
                  className='form-control'
                  value={weight}
                  onChange={(e) => handleDimensionChange(e.target.value, 'weight')}
                  placeholder='Ví dụ: 1kg'
                />
              </div>
            </div>
            <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
              <div className='form-group'>
                <label>{translate('manage_warehouse.good_management.description')}</label>
                <textarea type='text' className='form-control' value={description} onChange={handleDescriptionChange} />
              </div>
              <UnitCreateForm baseUnit={baseUnit} initialData={listUnit} onDataChange={handleListUnitChange} />
              <PriceCreateForm
                productDefaultPrice={state.pricePerBaseUnit}
                initialData={priceInfomation}
                onDataChange={handlePriceChange}
              />
              <VariantCreateForm
                productCode={state.code}
                productWeight={state.weight}
                productDefaultPrice={state.pricePerBaseUnit}
                handleChange={handleChangeVariant}
              />
              <OptionalAttributeCreateForm handleChange={handleChangeOptionalAttribute} />

              <React.Fragment>
                {type === 'product' && sourceType === '1' ? (
                  <ComponentCreateForm initialData={listMaterial} onDataChange={handleListMaterialChange} />
                ) : (
                  ''
                )}
                {sourceType === '1' ? <InfoMillCreateForm onDataChange={handleListMillsChange} /> : ''}
              </React.Fragment>
            </div>
          </div>
        </form>
      </DialogModal>
    </React.Fragment>
  )
}
function mapStateToProps(state) {
  const { goods, categories } = state
  return { goods, categories }
}

const mapDispatchToProps = {
  createGoodByType: GoodActions.createGoodByType,
  getCategoriesByType: CategoryActions.getCategoriesByType,
  getAllGoods: GoodActions.getAllGoods
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(GoodCreateForm))
