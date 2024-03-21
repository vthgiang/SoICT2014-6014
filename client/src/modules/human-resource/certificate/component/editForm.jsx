import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { DialogModal, ErrorLabel, SelectBox, TreeSelect } from '../../../../common-components'
import { CertificateActions } from '../redux/actions'
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

  handleAbbreviation = (e) => {
    const { value } = e.target
    const { translate } = this.props
    const { message } = ValidationHelper.validateCode(translate, value, 1, 255)
    this.setState({
      abbreviation: value,
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
    let { name } = this.state
    let { translate } = this.props
    if (!ValidationHelper.validateName(translate, name, 1, 255).status) return false
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
    console.log(list, node, 'findChildrenNode')
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

    console.log('state data', this.state)
    console.log('props data', this.props)

    this.props.editCertificate(this.state)
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.certificateId !== prevState.certificateId) {
      return {
        ...prevState,
        oldData: {
          certificateId: nextProps.certificateId,
          name: nextProps.certificateName,
          abbreviation: nextProps.certificateAbbreviation,
          description: nextProps.certificateDescription
        },
        certificateId: nextProps.certificateId,
        name: nextProps.certificateName,
        abbreviation: nextProps.certificateAbbreviation,
        description: nextProps.certificateDescription,

        nameError: undefined,
        codeError: undefined
      }
    } else {
      return null
    }
  }

  render() {
    const { translate } = this.props
    const { listData } = this.props
    let { name, abbreviation, description, codeError, nameError } = this.state
    console.log('listData', this.state)

    const disabled = !this.isValidateForm()
    return (
      <React.Fragment>
        <DialogModal
          modalID='edit-certificate'
          formID='edit-certificate'
          title='Chỉnh sửa bằng cấp - chứng chỉ'
          disableSubmit={!this.isValidateForm()}
          func={this.save}
        >
          <form id='edit-certificate'>
            <div className={`form-group ${nameError === undefined ? '' : 'has-error'}`}>
              <label>
                Tên<span className='text-red'>*</span>
              </label>
              <input type='text' className='form-control' onChange={this.handleName} value={name} />
              <ErrorLabel content={nameError} />
            </div>
            <div className={`form-group ${codeError === undefined ? '' : 'has-error'}`}>
              <label>
                Tên viết tắt<span className='text-red'>*</span>
              </label>
              <input type='text' className='form-control' onChange={this.handleAbbreviation} value={abbreviation} />
              <ErrorLabel content={codeError} />
            </div>
            <div className='form-group'>
              <label>Mô tả</label>
              <input type='text' className='form-control' onChange={this.handleDescription} value={description} />
            </div>
            {/* <div className="form-group">
                        <button className="btn btn-success pull-right" style={{ marginLeft: '5px' }} disabled={disabled} onClick={this.save}>{translate('form.save')}</button>
                        <button className="btn btn-danger" onClick={() => {
                            window.$(`#edit-certificate`).slideUp()
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
  editCertificate: CertificateActions.editCertificate
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(EditForm))
