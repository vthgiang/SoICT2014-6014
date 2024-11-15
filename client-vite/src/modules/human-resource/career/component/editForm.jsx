import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { DialogModal, ErrorLabel, TreeSelect } from '../../../../common-components'
import { CareerReduxAction } from '../redux/actions'
import ValidationHelper from '../../../../helpers/validationHelper'

class EditForm extends Component {
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

  handleCode = (e) => {
    const { value } = e.target
    const { translate } = this.props
    const { message } = ValidationHelper.validateCode(translate, value, 1, 255)
    this.setState({
      code: value,
      codeError: message
    })
  }

  handleDescription = (e) => {
    const { value } = e.target
    this.setState({
      description: value
    })
  }

  isValidateForm = () => {
    let { name, description, showParent, parent } = this.state
    let { translate } = this.props
    if (!ValidationHelper.validateName(translate, name, 1, 255).status) return false
    if (showParent && !parent) return false
    return true
  }

  findNode = (element, id) => {
    if (element.id === id) {
      return element
    } else if (element.children) {
      let i
      let result = ''
      for (i = 0; i < element.children.length; i++) {
        result = this.findNode(element.children[i], id)
      }
      return result
    }
    return null
  }
  // tìm các node con cháu
  findChildrenNode = (list, node) => {
    let array = []
    let queue_children = [node]
    while (queue_children.length > 0) {
      let tmp = queue_children.shift()
      array = [...array, tmp._id]
      let children = list.filter((child) => child.parent === tmp._id)
      queue_children = queue_children.concat(children)
    }
    return array
  }

  save = () => {
    const { documents } = this.props
    const { majorId, name, code, majorParent } = this.state
    const { list } = documents.administration.archives

    this.props.editCareerPosition(this.state)
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.careerPositionId !== prevState.careerPositionId) {
      return {
        ...prevState,
        careerPositionId: nextProps.careerPositionId,
        name: nextProps.careerPositionName,
        code: nextProps.careerPositionCode,
        otherNames: nextProps.careerPositionOtherName,
        description: nextProps.careerPositionDescription,

        nameError: undefined,
        codeError: undefined
      }
    } else {
      return null
    }
  }

  render() {
    const { translate } = this.props
    console.log('state', this.state)
    const { name, code, description, otherNames, codeError, nameError } = this.state

    const disabled = !this.isValidateForm()
    return (
      <React.Fragment>
        <DialogModal
          modalID='edit-career-position'
          formID='edit-career-position'
          title='Chỉnh sửa vị trí công việc'
          disableSubmit={!this.isValidateForm()}
          func={this.save}
        >
          <form id='edit-career-position'>
            <div className={`form-group ${nameError === undefined ? '' : 'has-error'}`}>
              <label>
                Tên<span className='text-red'>*</span>
              </label>
              <input type='text' className='form-control' onChange={this.handleName} value={name} />
              <ErrorLabel content={nameError} />
            </div>
            <div className={`form-group ${codeError === undefined ? '' : 'has-error'}`}>
              <label>
                Nhãn dán<span className='text-red'>*</span>
              </label>
              <input type='text' className='form-control' onChange={this.handleCode} value={code} />
              <ErrorLabel content={codeError} />
            </div>
            <div className={`form-group`}>
              <label>Mô tả</label>
              <input type='text' className='form-control' onChange={this.handleDescription} value={description} />
            </div>
            {/* <div className="form-group">
                            <button className="btn btn-success pull-right" style={{ marginLeft: '5px' }} disabled={disabled} onClick={this.save}>{translate('form.save')}</button>
                            <button className="btn btn-danger" onClick={() => {
                                window.$(`#edit-career-position`).slideUp()
                            }}>{translate('form.close')}</button>
                        </div> */}
          </form>
        </DialogModal>
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => state

const mapDispatchToProps = {
  editCareerPosition: CareerReduxAction.editCareerPosition
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(EditForm))
