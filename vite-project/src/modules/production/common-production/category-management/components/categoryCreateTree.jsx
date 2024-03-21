import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { DialogModal, ErrorLabel, TreeSelect } from '../../../../../common-components'
import { CategoryActions } from '../redux/actions'
function CategoryCreateTree(props) {
  const [state, setState] = useState({
    categoryParent: props.categoryParent
  })

  const handleName = (e) => {
    const value = e.target.value
    setState({
      ...state,
      categoryName: value
    })
  }
  const handleCode = (e) => {
    const value = e.target.value
    setState({
      ...state,
      categoryCode: value
    })
  }

  const handleDescription = (e) => {
    const value = e.target.value
    setState({
      ...state,
      categoryDesription: value
    })
  }

  const handleParent = (value) => {
    setState({
      ...state,
      categoryParent: value[0]
    })
  }

  const validateName = (value, willUpdateState) => {
    let msg = undefined
    const { translate } = props
    if (!value) {
      msg = translate('document.no_blank_name')
    }
    if (willUpdateState) {
      setState({
        ...state,
        categoryName: value,
        errorName: msg
      })
    }
    return msg === undefined
  }
  const handleValidateName = (e) => {
    const value = e.target.value.trim()
    validateName(value, true)
  }

  const validateCode = (value, willUpdateState) => {
    let msg = undefined
    const { translate } = props
    if (!value) {
      msg = translate('document.no_blank_name')
    }
    if (willUpdateState) {
      setState({
        ...state,
        categoryCode: value,
        errorCode: msg
      })
    }
    return msg === undefined
  }
  const handleValidateCode = (e) => {
    const value = e.target.value.trim()
    validateCode(value, true)
  }

  const isValidateForm = () => {
    return validateName(state.categoryName, false) && validateCode(state.categoryCode, false)
  }

  const save = () => {
    const { categoryName, categoryCode, categoryDesription, categoryParent } = state
    props.createCategory({
      name: categoryName,
      code: categoryCode,
      description: categoryDesription,
      parent: categoryParent
    })
  }

  if (props.categoryParent !== state.categoryParent && props.categoryParent && props.categoryParent.length) {
    setState({
      ...state,
      categoryParent: props.categoryParent
    })
  }

  const { translate, categories } = props
  const { list } = categories.categoryToTree
  const { categoryParent, errorName, errorCode } = state
  return (
    <React.Fragment>
      <DialogModal
        modalID='modal-create-category-good'
        formID='form-create-category-good'
        title={translate('manage_warehouse.category_management.add')}
        disableSubmit={!isValidateForm()}
        func={save}
      >
        <form id='form-create-category-good'>
          <div className={`form-group ${!errorCode ? '' : 'has-error'}`}>
            <label>
              {translate('manage_warehouse.category_management.code')}
              <span className='text-red'>*</span>
            </label>
            <input type='text' className='form-control' onChange={handleValidateCode} />
            <ErrorLabel content={errorCode} />
          </div>
          <div className={`form-group ${!errorName ? '' : 'has-error'}`}>
            <label>
              {translate('manage_warehouse.category_management.name')}
              <span className='text-red'>*</span>
            </label>
            <input type='text' className='form-control' onChange={handleValidateName} />
            <ErrorLabel content={errorName} />
          </div>
          <div className='form-group'>
            <label>{translate('document.administration.archives.parent')}</label>
            <TreeSelect data={list} value={!categoryParent ? '' : [categoryParent]} handleChange={handleParent} mode='radioSelect' />
          </div>
          <div className='form-group'>
            <label>{translate('manage_warehouse.category_management.description')}</label>
            <textarea style={{ minHeight: '100px' }} type='text' className='form-control' onChange={handleDescription} />
          </div>
        </form>
      </DialogModal>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => state

const mapDispatchToProps = {
  createCategory: CategoryActions.createCategory
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CategoryCreateTree))
