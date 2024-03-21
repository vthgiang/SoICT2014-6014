import React, { Component } from 'react'
import { commandActions } from '../redux/actions'
import { connect } from 'react-redux'
import withTranslate from 'react-redux-multilingual/lib/withTranslate'
import { DialogModal, SelectBox, UploadFile } from '../../../../../common-components'

class QualityControlForm extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  handleStatusChange = (value) => {
    const status = value[0]
    this.setState({
      status: status
    })
  }

  handleContentChange = (e) => {
    const { value } = e.target
    this.setState({
      content: value
    })
  }

  static getDerivedStateFromProps = (props, state) => {
    if (props.commandId !== state.commandId) {
      return {
        ...state,
        commandId: props.commandId,
        code: props.code,
        status: props.status,
        content: props.content
      }
    }
    return null
  }

  save = () => {
    const userId = localStorage.getItem('userId')
    const data = {
      qualityControlStaff: {
        staff: userId,
        status: this.state.status,
        content: this.state.content
      }
    }
    this.props.handleEditCommand(this.state.commandId, data)
  }

  render() {
    console.log(this.state)
    const { translate, manufacturingCommand } = this.props
    const { status, content, code } = this.state
    return (
      <React.Fragment>
        <DialogModal
          modalID='modal-quality-control'
          isLoading={manufacturingCommand.isLoading}
          formID='form-quality-control'
          title={translate('manufacturing.command.quality_control_command')}
          msg_success={translate('manufacturing.command.edit_successfully')}
          msg_failure={translate('manufacturing.command.edit_failed')}
          func={this.save}
          // disableSubmit={!this.isFormValidated()}
          size={50}
          maxWidth={500}
        >
          <form id='form-quality-control'>
            <div className='form-group'>
              <label>
                {translate('manufacturing.command.code')}
                <span className='text-red'>*</span>
              </label>
              <input type='text' value={code} className='form-control' disabled={true}></input>
            </div>
            <div className='form-group'>
              <label>
                {translate('manufacturing.command.quality_control_status')}
                <span className='text-red'>*</span>
              </label>
              <SelectBox
                id={`select-quality-control-status`}
                className='form-control select2'
                style={{ width: '100%' }}
                value={status}
                items={[
                  {
                    value: 1,
                    text: translate('manufacturing.command.qc_status.1.content')
                  },
                  {
                    value: 2,
                    text: translate('manufacturing.command.qc_status.2.content')
                  },
                  {
                    value: 3,
                    text: translate('manufacturing.command.qc_status.3.content')
                  }
                ]}
                onChange={this.handleStatusChange}
                multiple={false}
              />
            </div>
          </form>
          <form id='form-quality-control'>
            <div className='form-group'>
              <label>{translate('manufacturing.command.quality_control_content')}</label>
              <textarea type='text' value={content} onChange={this.handleContentChange} className='form-control'></textarea>
            </div>
          </form>
        </DialogModal>
      </React.Fragment>
    )
  }
}

function mapStateToProps(state) {
  const { manufacturingCommand } = state
  return { manufacturingCommand }
}

const mapDispatchToProps = {
  handleEditCommand: commandActions.handleEditCommand
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(QualityControlForm))
