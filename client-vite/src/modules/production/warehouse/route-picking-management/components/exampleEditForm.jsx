import React, { Component } from 'react'
import { connect } from 'react-redux'
import withTranslate from 'react-redux-multilingual/lib/withTranslate'

import { exampleActions } from '../redux/actions'

import { DialogModal, ErrorLabel } from '../../../../../common-components'
import ValidationHelper from '../../../../../helpers/validationHelper'

class ExampleEditForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      exampleName: '',
      description: '',
      exampleNameError: {
        message: undefined,
        status: true
      }
    }
  }

  /**
   * Hàm dùng để kiểm tra xem form đã được validate hay chưa
   */
  isFormValidated = () => {
    const { exampleNameError } = this.state
    if (!exampleNameError.status) {
      return false
    }
    return true
  }

  /**
   * Hàm dùng để lưu thông tin của form và gọi service tạo mới ví dụ
   */
  save = () => {
    if (this.isFormValidated) {
      const { exampleID, exampleName, description } = this.state
      this.props.editExample(exampleID, { exampleName, description })
    }
  }

  /**
   * Hàm xử lý khi tên ví dụ thay đổi
   * @param {*} e
   */
  handleExampleName = (e) => {
    const { value } = e.target

    let { translate } = this.props
    let result = ValidationHelper.validateName(translate, value, 6, 255)

    this.setState((state) => {
      return {
        ...state,
        exampleName: value,
        exampleNameError: result
      }
    })
  }

  /**
   * Hàm xử lý khi mô tả ví dụ thay đổi
   * @param {*} e
   */
  handleExampleDescription = (e) => {
    const { value } = e.target
    this.setState({
      description: value
    })
  }

  static getDerivedStateFromProps = (nextProps, prevState) => {
    if (nextProps.exampleID !== prevState.exampleID) {
      return {
        ...prevState,
        exampleID: nextProps.exampleID,
        exampleName: nextProps.exampleName,
        description: nextProps.description,
        exampleNameError: {
          message: undefined,
          status: true
        }
      }
    } else {
      return null
    }
  }

  render() {
    const { example, translate } = this.props
    const { exampleName, exampleNameError, description } = this.state
    return (
      <React.Fragment>
        <DialogModal
          modalID={`modal-edit-example`}
          isLoading={example.isLoading}
          formID={`form-edit-example`}
          title={translate('manage_example.edit_title')}
          disableSubmit={!this.isFormValidated()}
          func={this.save}
          size={50}
          maxWidth={500}
        >
          <form id={`form-edit-example`}>
            {/* Tên ví dụ */}
            <div className={`form-group ${exampleNameError.status ? '' : 'has-error'}`}>
              <label>
                {translate('manage_example.exampleName')}
                <span className='text-red'>*</span>
              </label>
              <input type='text' className='form-control' value={exampleName} onChange={this.handleExampleName} />
              <ErrorLabel content={exampleNameError.message} />
            </div>

            {/* Mô tả ví dụ */}
            <div className={`form-group`}>
              <label>{translate('manage_example.description')}</label>
              <input type='text' className='form-control' value={description} onChange={this.handleExampleDescription} />
            </div>
          </form>
        </DialogModal>
      </React.Fragment>
    )
  }
}

function mapStateToProps(state) {
  const example = state.example1
  return { example }
}

const mapDispatchToProps = {
  editExample: exampleActions.editExample
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ExampleEditForm))
