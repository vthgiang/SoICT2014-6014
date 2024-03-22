import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { DialogModal, ErrorLabel, SelectBox, TreeSelect } from '../../../../common-components'
import { CareerReduxAction } from '../redux/actions'
import ValidationHelper from '../../../../helpers/validationHelper'
class CreateForm extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  handleName = (e) => {
    const { value } = e.target
    const { translate } = this.props
    const { message } = ValidationHelper.validateName(translate, value, 1, 255)
    this.setState({
      name: value,
      nameError: message
    })
  }

  handleDescription = (e) => {
    const { value } = e.target
    this.setState({
      description: value
    })
  }

  handleCode = (e) => {
    const { value } = e.target
    const { translate } = this.props
    const { message } = ValidationHelper.validateCode(translate, value, 1, 255)
    this.setState({
      code: value,
      codeError: message
    })
  }

  isValidateForm = () => {
    let { name } = this.state
    let { translate } = this.props
    if (!ValidationHelper.validateName(translate, name, 1, 255).status) return false
    return true
  }

  save = () => {
    const data = {
      name: this.state.name,
      code: this.state.code,
      otherNames: this.state.otherNames,
      description: this.state.description
    }
    this.props.createCareerPosition(data)
  }

  render() {
    const { translate, career } = this.props
    const { list } = this.props
    let { parent, field, nameError, codeError } = this.state
    return (
      <React.Fragment>
        <DialogModal
          modalID='modal-create-career-position'
          formID='form-create-career-position'
          title='Thêm vị trí công việc'
          disableSubmit={!this.isValidateForm()}
          func={this.save}
        >
          <form id='form-create-career-position'>
            <div className={`form-group ${!nameError ? '' : 'has-error'}`}>
              <label>
                Tên<span className='text-red'>*</span>
              </label>
              <input type='text' className='form-control' onChange={this.handleName} />
              <ErrorLabel content={nameError} />
            </div>

            <div className={`form-group ${!codeError ? '' : 'has-error'}`}>
              <label>
                Nhãn<span className='text-red'>*</span>
              </label>
              <input type='text' className='form-control' onChange={this.handleCode} />
              <ErrorLabel content={codeError} />
            </div>

            <div className={`form-group`}>
              <label>Mô tả</label>
              <input type='text' className='form-control' onChange={this.handleDescription} />
            </div>
          </form>
        </DialogModal>
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => state

const mapDispatchToProps = {
  createCareerPosition: CareerReduxAction.createCareerPosition
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CreateForm))
