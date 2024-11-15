import React, { Component, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { generateCode } from '../../../../../helpers/generateCode'
import { SlaActions } from '../redux/actions'
import { DialogModal, ButtonModal, ErrorLabel, SelectBox } from '../../../../../common-components'
import ValidationHelper from '../../../../../helpers/validationHelper'

function SlaCreateForm(props) {
  const [state, setState] = useState({
    code: '',
    goods: [],
    descriptions: [],
    isAllGoodsSelected: false
  })

  const getAllGoods = () => {
    const { translate, goods } = props
    let listGoods = [
      {
        value: 'all',
        text: 'CHỌN TẤT CẢ'
      }
    ]

    const { listGoodsByType } = goods

    if (listGoodsByType) {
      listGoodsByType.map((item) => {
        listGoods.push({
          value: item._id,
          text: item.code + ' - ' + item.name
        })
      })
    }

    return listGoods
  }

  const handleTitleChange = (e) => {
    let { value } = e.target

    let { translate } = props
    let { message } = ValidationHelper.validateName(translate, value, 4, 255)
    setState({
      ...state,
      title: value,
      titleError: message
    })
  }

  const validateGoods = (goods) => {
    let msg = undefined
    if (!goods || goods.length === 0) {
      const { translate } = props
      msg = 'Chọn mặt hàng áp dụng'
    }
    return msg
  }

  const handleGoodsChange = (value) => {
    let { goods } = state
    let checkSelectAll = false
    value.forEach((item) => {
      if (item === 'all') {
        checkSelectAll = true
      }
    })
    if (!checkSelectAll) {
      setState((state) => {
        return {
          ...state,
          goods: value,
          goodsError: validateGoods(value),
          isAllGoodsSelected: false
        }
      })
    } else {
      setState({
        ...state,
        isAllGoodsSelected: true,
        goods: ['disSelectAll'],
        goodsError: validateGoods(value, true)
      })
    }
  }

  const handleClickCreateCode = () => {
    setState((state) => {
      return { ...state, code: generateCode('SLA_') }
    })
  }

  const validateDescriptions = (value, index, willUpdateState = true) => {
    let msg = undefined
    if (value.trim() === '') {
      msg = 'Tên trường dữ liệu không được để trống'
    }
    if (willUpdateState) {
      let { descriptions } = state
      descriptions[index] = value
      setState({
        ...state,
        errorOnDescription: msg,
        errorOnDescriptionPosition: msg ? index : null,
        descriptions: descriptions
      })
    }
    return msg
  }

  const handleAddDescription = () => {
    let { descriptions } = state
    console.log('descriptions', descriptions)

    if (descriptions) {
      let result

      for (let index = 0; index < descriptions.length; index++) {
        let temp = validateDescriptions(descriptions[index], index, false)
        console.log('temp', temp)
        if (temp) result = temp
      }
      if (!result) {
        setState({
          ...state,
          descriptions: [...descriptions, '']
        })
      }
    } else {
      setState({
        ...state,
        descriptions: ['']
      })
    }
  }

  const handleDescriptionChange = (e, index) => {
    var { value } = e.target
    validateDescriptions(value, index)
  }

  const deleteDescription = (index) => {
    let { descriptions } = state
    descriptions.splice(index, 1)
    setState({
      ...state,
      descriptions: descriptions
    })
    if (descriptions.length !== 0) {
      for (let i = 0; i < descriptions.length; i++) {
        validateDescriptions(descriptions[i], i)
      }
    } else {
      setState({
        ...state,
        errorOnDescription: undefined
      })
    }
  }

  const validateDescriptionsForSubmit = () => {
    let { descriptions } = state

    console.log(descriptions)
    if (descriptions.length === 0) {
      return false
    }

    let descriptionsValidation = true
    descriptions.forEach((item, key) => {
      if (validateDescriptions(item, key, false)) {
        descriptionsValidation = false
      }
    })
    return descriptionsValidation
  }

  const isFormValidated = () => {
    let { translate } = props
    let { title, goods } = state
    // console.log(validateDescriptionsForSubmit(),ValidationHelper.validateName(translate, title, 4, 255).message,validateGoods(goods));
    if (!validateDescriptionsForSubmit() || ValidationHelper.validateName(translate, title, 4, 255).message || validateGoods(goods)) {
      return false
    }
    return true
  }

  const getIdOfAllGoods = () => {
    const { translate, goods } = props
    const { listGoodsByType } = goods
    let goodsForSubmit = state.goods
    let checkSelectAll = false
    goodsForSubmit.forEach((item) => {
      if (item === 'disSelectAll') {
        checkSelectAll = true
      }
    })
    if (checkSelectAll) {
      if (listGoodsByType) {
        goodsForSubmit = listGoodsByType.map((item) => item._id)
      }
    }

    return goodsForSubmit
  }

  const save = async () => {
    if (isFormValidated()) {
      const { code, descriptions, goods, title } = state
      let goodsSubmit = await getIdOfAllGoods()
      let data = {
        code,
        descriptions,
        goods: goodsSubmit,
        title
      }
      await props.createNewSLA(data)
      await setState({
        ...state,
        code: '',
        descriptions: [],
        goods: [],
        title: ''
      })
    }
  }

  const { translate } = props
  let { code, titleError, title, goods, goodsError, isAllGoodsSelected, descriptions, errorOnDescription, errorOnDescriptionPosition } =
    state
  // console.log("DATA", descriptions);
  return (
    <React.Fragment>
      <ButtonModal
        onButtonCallBack={handleClickCreateCode}
        modalID={`modal-add-sla`}
        button_name={'Thêm mới'}
        title={'Thêm cam kết chất lượng'}
      />
      <DialogModal
        modalID={`modal-add-sla`}
        isLoading={false}
        formID={`form-add-sla`}
        title={'Thêm cam kết chất lượng'}
        msg_success={'Thêm thành công'}
        msg_failure={'Thêm không thành công'}
        disableSubmit={!isFormValidated()}
        func={save}
        size='50'
        style={{ backgroundColor: 'green' }}
      >
        <form id={`form-add-sla`}>
          <div className='form-group'>
            <label>
              {'Mã'}
              <span className='attention'> </span>
            </label>
            <input type='text' className='form-control' value={code} disabled='true' />
          </div>
          <div className={`form-group ${!titleError ? '' : 'has-error'}`}>
            <label>
              {'Tiêu đề'}
              <span className='attention'> * </span>
            </label>
            <input type='text' className='form-control' value={title} onChange={handleTitleChange} />
            <ErrorLabel content={titleError} />
          </div>
          <div className={`form-group ${!goodsError ? '' : 'has-error'}`}>
            <label>
              Chọn các mặt hàng
              <span className='attention'> * </span>
              <br></br>
            </label>
            <SelectBox
              id={`select-create-multi-good-sla`}
              className='form-control select2'
              style={{ width: '100%' }}
              items={
                isAllGoodsSelected
                  ? [
                      {
                        value: 'disSelectAll',
                        text: `Đã chọn tất cả (${getAllGoods().length - 1} mặt hàng)`
                      }
                    ]
                  : getAllGoods()
              }
              onChange={handleGoodsChange}
              multiple={true}
              value={goods}
            />
            <ErrorLabel content={goodsError} />
          </div>
          <div className='form-group'>
            <label>
              Các điều khoản
              <span className='attention'> * </span>:
              <a style={{ cursor: 'pointer' }} title={'Các điều khoản'}>
                <i className='fa fa-plus-square' style={{ color: '#28A745', marginLeft: 5 }} onClick={handleAddDescription} />
              </a>
            </label>
            {/* <div className="col-md-12"> */}
            {/* Bảng thông tin chi tiết */}
            <table className='table'>
              <thead>
                <tr>
                  <th style={{ paddingLeft: '0px' }}>{'Điều khoản'}</th>
                  <th style={{ width: '100px', textAlign: 'center' }}>{'Hành động'}</th>
                </tr>
              </thead>
              <tbody>
                {!descriptions || descriptions.length === 0 ? (
                  <tr>
                    <td colSpan={2}>
                      <center> {'Chưa có dữ liệu'}</center>
                    </td>
                  </tr>
                ) : (
                  descriptions.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td style={{ paddingLeft: '0px' }}>
                          <div
                            className={`form-group ${
                              parseInt(errorOnDescriptionPosition) === index && errorOnDescription ? 'has-error' : ''
                            }`}
                          >
                            <textarea
                              className='form-control'
                              type='text'
                              value={item}
                              name='value'
                              style={{ width: '100%' }}
                              onChange={(e) => handleDescriptionChange(e, index)}
                            />
                            {parseInt(errorOnDescriptionPosition) === index && errorOnDescription && (
                              <ErrorLabel content={errorOnDescription} />
                            )}
                          </div>
                        </td>

                        <td style={{ width: '100px', textAlign: 'center' }}>
                          <a className='delete' title='Delete' data-toggle='tooltip' onClick={() => deleteDescription(index)}>
                            <i className='material-icons'></i>
                          </a>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
            {/* </div> */}
          </div>
        </form>
      </DialogModal>
    </React.Fragment>
  )
}

function mapStateToProps(state) {
  const { goods } = state
  return { goods }
}

const mapDispatchToProps = {
  createNewSLA: SlaActions.createNewSLA
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(SlaCreateForm))
