import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { CompanyActions } from '../redux/actions'
import { SystemLinkActions } from '../../system-link/redux/actions'
import { ButtonModal, DialogModal, ErrorLabel } from '../../../../common-components'
import ValidationHelper from '../../../../helpers/validationHelper'
function CompanyCreateForm(props) {
  const [state, setState] = useState({
    linkDefaultArr: []
  })

  useEffect(() => {
    props.getAllSystemLinks()
  }, [])

  const checkCheckBoxAll = (arr) => {
    if (arr.length > 0 && arr.length === state.linkDefaultArr.length) {
      return true
    } else {
      return false
    }
  }

  const checkedCheckbox = (item, arr) => {
    let index = arr.indexOf(item)
    if (index !== -1) {
      return true
    } else {
      return false
    }
  }

  const checkAll = (e) => {
    const { checked } = e.target
    const { systemLinks } = props

    if (checked) {
      setState({
        ...state,
        linkDefaultArr: systemLinks.list.map((link) => link._id)
      })
    } else {
      setState({
        ...state,
        linkDefaultArr: []
      })
    }
  }

  const handleCheckbox = (e) => {
    const { value, checked } = e.target
    if (checked) {
      setState({
        ...state,
        linkDefaultArr: [...state.linkDefaultArr, value]
      })
    } else {
      const arr = state.linkDefaultArr
      const index = arr.indexOf(value)

      arr.splice(index, 1)
      setState({
        ...state,
        linkDefaultArr: arr
      })
    }
  }

  /**
   * Hàm xử lý khi chọn theo danh mục
   */
  const handleCategoryCheckbox = async (e, link) => {
    const { checked } = e.target
    const { systemLinks } = props

    if (checked) {
      for (const element of systemLinks.list) {
        if (element.category === link.category) {
          // Nếu phần tử đó chưa tồn tại thì mới thêm vào state
          if (state.linkDefaultArr.indexOf(element._id) === -1) {
            await setState({
              ...state,
              linkDefaultArr: [...state.linkDefaultArr, element._id]
            })
          }
        }
      }
    } else {
      for (const element of systemLinks.list) {
        if (element.category === link.category) {
          const arr = state.linkDefaultArr
          const index = arr.indexOf(element._id)

          arr.splice(index, 1)
          await setState({
            ...state,
            linkDefaultArr: arr
          })
        }
      }
    }
  }

  const save = () => {
    const company = {
      name: state.companyName,
      shortName: state.companyShortName,
      description: state.companyDescription,
      email: state.companyEmail,
      links: state.linkDefaultArr
    }

    if (isFormValidated()) return props.createCompany(company)
  }

  const handleChangeName = (e) => {
    let { value } = e.target
    let { translate } = props
    let { message } = ValidationHelper.validateName(translate, value, 4, 255)
    setState({
      ...state,
      companyName: value,
      nameError: message
    })
  }

  const handleChangeShortName = (e) => {
    let { value } = e.target
    let { translate } = props
    let { message } = ValidationHelper.validateName(translate, value, 4, 255)
    setState({
      ...state,
      companyShortName: value,
      shortNameError: message
    })
  }

  const handleChangeDescription = (e) => {
    let { value } = e.target
    let { translate } = props
    let { message } = ValidationHelper.validateDescription(translate, value)
    setState({
      ...state,
      companyDescription: value,
      descriptionError: message
    })
  }

  const handleChangeEmail = (e) => {
    let { value } = e.target
    let { translate } = props
    let { message } = ValidationHelper.validateEmail(translate, value)
    setState({
      ...state,
      companyEmail: value,
      emailError: message
    })
  }

  const isFormValidated = () => {
    let { companyName, companyShortName, companyDescription, companyEmail } = state
    let { translate } = props
    if (
      !ValidationHelper.validateName(translate, companyName).status ||
      !ValidationHelper.validateName(translate, companyShortName).status ||
      !ValidationHelper.validateEmail(translate, companyEmail).status ||
      !ValidationHelper.validateDescription(translate, companyDescription).status
    )
      return false
    return true
  }

  const { translate, systemLinks, company } = props
  const {
    // Phần edit nội dung của công ty
    nameError,
    shortNameError,
    descriptionError,
    emailError
  } = state

  let list = []
  let category

  for (let i = 0; i < systemLinks.list.length; i++) {
    const element = systemLinks.list[i]

    if (element.category !== category) {
      const group = {
        _id: i,
        category: element.category,
        isGroup: true
      }

      list.push(group)
      category = element.category
    }

    list.push(element)
  }

  return (
    <React.Fragment>
      <ButtonModal modalID='modal-create-company' button_name={translate('general.add')} title={translate('system_admin.company.add')} />

      <DialogModal
        modalID='modal-create-company'
        size='75'
        formID='form-create-company'
        isLoading={company.isLoading}
        title={translate('system_admin.company.add')}
        func={save}
        disableSubmit={!isFormValidated()}
      >
        <form id='form-create-company'>
          <div className='row' style={{ padding: '20px' }}>
            <div className='col-xs-12 col-sm-12 col-md-6 col-lg-6'>
              <div className={`form-group ${nameError === undefined ? '' : 'has-error'}`}>
                <label>
                  {translate('system_admin.company.table.name')}
                  <span className='text-red'> * </span>
                </label>
                <input type='text' className='form-control' onChange={handleChangeName} />
                <ErrorLabel content={nameError} />
              </div>
              <div className={`form-group ${shortNameError === undefined ? '' : 'has-error'}`}>
                <label>
                  {translate('system_admin.company.table.short_name')}
                  <span className='text-red'> * </span>
                </label>
                <input type='text' className='form-control' onChange={handleChangeShortName} />
                <ErrorLabel content={shortNameError} />
              </div>
              <div className={`form-group ${emailError === undefined ? '' : 'has-error'}`}>
                <label>
                  {translate('system_admin.company.table.super_admin')}
                  <span className='text-red'> * </span>
                </label>
                <input type='email' className='form-control' onChange={handleChangeEmail} />
                <ErrorLabel content={emailError} />
              </div>
            </div>

            <div className='col-xs-12 col-sm-12 col-md-6 col-lg-6'>
              <div className={`form-group ${descriptionError === undefined ? '' : 'has-error'}`}>
                <label>
                  {translate('system_admin.company.table.description')}
                  <span className='text-red'> * </span>
                </label>
                <textarea style={{ height: '182px' }} type='text' className='form-control' onChange={handleChangeDescription} />
                <ErrorLabel content={descriptionError} />
              </div>
            </div>

            <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
              <fieldset className='scheduler-border' style={{ minHeight: '300px' }}>
                <legend className='scheduler-border'>{translate('system_admin.company.service')}</legend>

                <table className='table table-hover table-striped table-bordered'>
                  <thead>
                    <tr>
                      <th style={{ width: '32px' }} className='col-fixed'>
                        <input type='checkbox' onChange={checkAll} />
                      </th>
                      <th>{translate('system_admin.system_link.table.category')}</th>
                      <th>{translate('system_admin.system_link.table.url')}</th>
                      <th>{translate('system_admin.system_link.table.description')}</th>
                    </tr>
                  </thead>

                  <tbody>
                    {list.length > 0 ? (
                      list.map((link) =>
                        link.isGroup ? (
                          <tr key={link._id}>
                            <td>
                              <input type='checkbox' value={link._id} onChange={(e) => handleCategoryCheckbox(e, link)} />
                            </td>
                            <th>{link.category}</th>
                            <td>{link.url}</td>
                            <td>{link.description}</td>
                          </tr>
                        ) : (
                          <tr key={link._id}>
                            <td>
                              <input
                                type='checkbox'
                                value={link._id}
                                onChange={handleCheckbox}
                                checked={checkedCheckbox(link._id, state.linkDefaultArr)}
                              />
                            </td>
                            <td>{link.category}</td>
                            <td>{link.url}</td>
                            <td>{link.description}</td>
                          </tr>
                        )
                      )
                    ) : systemLinks.isLoading ? (
                      <tr>
                        <td colSpan={4}>{translate('general.loading')}</td>
                      </tr>
                    ) : (
                      <tr>
                        <td colSpan={4}>{translate('general.no_data')}</td>
                      </tr>
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

function mapState(state) {
  const { systemLinks, company } = state
  return { systemLinks, company }
}
const action = {
  createCompany: CompanyActions.createCompany,
  getAllSystemLinks: SystemLinkActions.getAllSystemLinks
}

const connectedCompanyCreateForm = connect(mapState, action)(withTranslate(CompanyCreateForm))
export { connectedCompanyCreateForm as CompanyCreateForm }
