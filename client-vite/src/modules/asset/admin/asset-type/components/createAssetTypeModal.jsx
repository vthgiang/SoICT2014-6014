import React, { Component, useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { DialogModal, TreeSelect, ErrorLabel } from '../../../../../common-components'

import { AssetTypeActions } from '../redux/actions'
import { generateCode } from '../../../../../helpers/generateCode'
import ValidationHelper from '../../../../../helpers/validationHelper'

function CreateAssetTypeModal(props) {
  const [state, setState] = useState({
    domainParent: '',
    defaultInfo: [],
    errorOnNameField: undefined,
    errorOnValue: undefined
  })
  const [prevProps, setPrevProps] = useState({
    domainParent: null
  })

  const { translate, assetType } = props
  const { documentCode, domainParent, defaultInfo, errorOnNameField, errorOnValue } = state

  const { list } = assetType.administration.types

  if (prevProps.domainParent !== props.domainParent && props.domainParent.length) {
    console.log(props.domainParent)
    setState({
      ...state,
      // cai cu la  let dm = prevState.domainParent;domainParent: dm,
      domainParent: props.domainParent
    })
    setPrevProps(props)
  }

  useEffect(() => {
    // Mỗi khi modal mở, cần sinh lại code
    window.$(`#modal-create-asset-type`).on('shown.bs.modal', regenerateCode)
    return () => {
      // Unsuscribe event
      window.$(`#modal-create-asset-type`).unbind('shown.bs.modal', regenerateCode)
    }
  }, [])

  const regenerateCode = () => {
    let code = generateCode('TYP')
    setState((state) => ({
      ...state,
      documentCode: code
    }))
  }

  const handleCode = (e) => {
    const value = e.target.value
    setState({
      ...state,
      documentCode: value
    })
  }

  const handleName = (e) => {
    const value = e.target.value
    setState({
      ...state,
      documentName: value
    })
  }

  const handleDescription = (e) => {
    const value = e.target.value
    setState({
      ...state,
      documentDescription: value
    })
  }

  const handleParent = (value) => {
    setState({
      ...state,
      domainParent: value[0]
    })
  }

  /**
   * Bắt sự kiện click thêm Thông tin mặc định
   */
  const handleAddDefaultInfo = () => {
    var defaultInfo = state.defaultInfo

    if (defaultInfo.length !== 0) {
      let result

      for (let n in defaultInfo) {
        result = validateNameField(defaultInfo[n].nameField, n) && validateValue(defaultInfo[n].value, n)
        if (!result) {
          validateNameField(defaultInfo[n].nameField, n)
          validateValue(defaultInfo[n].value, n)
          break
        }
      }

      if (result) {
        setState({
          ...state,
          defaultInfo: [...defaultInfo, { nameField: '', value: '' }]
        })
      }
    } else {
      setState({
        ...state,
        defaultInfo: [...defaultInfo, { nameField: '', value: '' }]
      })
    }
  }

  /**
   * Bắt sự kiện chỉnh sửa tên trường dữ liệu thông tin mặc định
   */
  const handleChangeNameField = (e, index) => {
    var { value } = e.target
    validateNameField(value, index)
  }
  const validateNameField = (value, className, willUpdateState = true) => {
    let { message } = ValidationHelper.validateEmpty(props.translate, value)

    if (willUpdateState) {
      var { defaultInfo } = state
      defaultInfo[className] = { ...defaultInfo[className], nameField: value }
      setState((state) => {
        return {
          ...state,
          errorOnNameField: message,
          defaultInfo: defaultInfo
        }
      })
    }
    return message === undefined
  }

  /**
   * Bắt sự kiện chỉnh sửa giá trị trường dữ liệu thông tin mặc định
   */
  const handleChangeValue = (e, index) => {
    var { value } = e.target
    validateValue(value, index)
  }
  const validateValue = (value, className, willUpdateState = true) => {
    let msg = undefined
    if (willUpdateState) {
      var { defaultInfo } = state
      defaultInfo[className] = { ...defaultInfo[className], value: value }
      setState((state) => {
        return {
          ...state,
          errorOnValue: msg,
          defaultInfo: defaultInfo
        }
      })
    }
    return msg === undefined
  }

  /**
   * Bắt sự kiện xóa thông tin mặc định
   */
  const delete_function = (index) => {
    var { defaultInfo } = state
    defaultInfo.splice(index, 1)
    setState({
      ...state,
      defaultInfo: defaultInfo
    })
    if (defaultInfo.length !== 0) {
      for (let n in defaultInfo) {
        validateNameField(defaultInfo[n].nameField, n)
        validateValue(defaultInfo[n].value, n)
      }
    } else {
      setState({
        ...state,
        errorOnValue: undefined,
        errorOnNameField: undefined
      })
    }
  }

  const save = () => {
    const { documentCode, documentName, documentDescription, domainParent, defaultInfo } = state
    props.createAssetTypes({
      typeNumber: documentCode,
      typeName: documentName,
      description: documentDescription,
      parent: domainParent ? domainParent : '',
      defaultInformation: defaultInfo
    })
  }

  let dataList = list.map((node) => {
    return {
      ...node,
      id: node._id,
      name: node.typeName
    }
  })

  return (
    <React.Fragment>
      <DialogModal modalID='modal-create-asset-type' formID='form-create-asset-type' title='Thêm mới loại tài sản' func={save}>
        {/* Thêm loại tài sản mới */}
        <form id='form-create-asset-type'>
          {/* Mã loại tài sản */}
          <div className='form-group'>
            <label>{translate('asset.asset_type.asset_type_code')}</label>
            <input type='text' className='form-control' onChange={handleCode} value={documentCode} />
          </div>

          {/* Tên loại tài sản */}
          <div className='form-group'>
            <label>
              {translate('asset.asset_type.asset_type_name')}
              <span className='text-red'>*</span>
            </label>
            <input type='text' className='form-control' onChange={handleName} />
          </div>

          {/* Loại tài sản cha */}
          <div className='form-group'>
            <label>{translate('asset.asset_type.parent_asset_type')}</label>
            <TreeSelect data={dataList} value={[domainParent]} handleChange={handleParent} mode='radioSelect' />
          </div>

          {/* Mô tả */}
          <div className='form-group'>
            <label>{translate('asset.general_information.description')}</label>
            <textarea style={{ minHeight: '100px' }} type='text' className='form-control' onChange={handleDescription} />
          </div>

          {/* Thông tin mặc định */}
          <div className='form-group'>
            <label>
              Thông tin mặc định:
              <a style={{ cursor: 'pointer' }} title='Thêm thông tin mặc định'>
                <i className='fa fa-plus-square' style={{ color: '#28A745', marginLeft: 5 }} onClick={handleAddDefaultInfo} />
              </a>
            </label>
            <div className={`form-group ${!errorOnNameField && !errorOnValue ? '' : 'has-error'}`}>
              {/* Bảng thông tin chi tiết */}
              <table className='table'>
                <thead>
                  <tr>
                    <th style={{ paddingLeft: '0px' }}>{translate('asset.asset_info.field_name')}</th>
                    <th style={{ paddingLeft: '0px' }}>{translate('asset.asset_info.value')}</th>
                    <th style={{ width: '120px', textAlign: 'center' }}>{translate('table.action')}</th>
                  </tr>
                </thead>
                <tbody>
                  {!defaultInfo || defaultInfo.length === 0 ? (
                    <tr>
                      <td colSpan={3}>
                        <center> {translate('table.no_data')}</center>
                      </td>
                    </tr>
                  ) : (
                    defaultInfo.map((x, index) => {
                      return (
                        <tr key={index}>
                          {/* Tên trường dữ liệu */}
                          <td style={{ paddingLeft: '0px' }}>
                            <input
                              className='form-control'
                              type='text'
                              value={x.nameField}
                              name='nameField'
                              style={{ width: '100%' }}
                              onChange={(e) => handleChangeNameField(e, index)}
                            />
                          </td>
                          <td style={{ paddingLeft: '0px' }}>
                            <input
                              className='form-control'
                              type='text'
                              value={x.value}
                              name='value'
                              style={{ width: '100%' }}
                              onChange={(e) => handleChangeValue(e, index)}
                            />
                          </td>
                          {/* Hành động */}
                          <td style={{ textAlign: 'center' }}>
                            <a className='delete' title='Delete' data-toggle='tooltip' onClick={() => delete_function(index)}>
                              <i className='material-icons'></i>
                            </a>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
              <ErrorLabel content={errorOnNameField} />
              <ErrorLabel content={errorOnValue} />
            </div>
          </div>
        </form>
      </DialogModal>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => state

const mapDispatchToProps = {
  createAssetTypes: AssetTypeActions.createAssetTypes
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CreateAssetTypeModal))
