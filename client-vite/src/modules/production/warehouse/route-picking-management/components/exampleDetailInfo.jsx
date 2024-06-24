import React, { Component } from 'react'
import { connect } from 'react-redux'
import withTranslate from 'react-redux-multilingual/lib/withTranslate'

import { DialogModal } from '../../../../../common-components'

class ExampleDetailInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  static getDerivedStateFromProps(props, state) {
    if (props.exampleID !== state.exampleID) {
      return {
        exampleID: props.exampleID,
        exampleName: props.exampleName,
        description: props.description
      }
    } else {
      return null
    }
  }

  render() {
    const { translate, example } = this.props
    const { exampleName, description } = this.state

    return (
      <React.Fragment>
        <DialogModal
          modalID={`modal-detail-info-example`}
          isLoading={example.isLoading}
          title={translate('manage_example.detail_info_example')}
          formID={`form-detail-example`}
          size={50}
          maxWidth={500}
          hasSaveButton={false}
          hasNote={false}
        >
          <form id={`form-detail-example`}>
            {/* Tên ví dụ */}
            <div className={`form-group`}>
              <label>{translate('manage_example.exampleName')}:</label>
              <span> {exampleName ? exampleName : null}</span>
            </div>

            {/* Mô tả ví dụ */}
            <div className={`form-group`}>
              <label>{translate('manage_example.description')}:</label>
              <span> {description ? description : null}</span>
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

export default connect(mapStateToProps, null)(withTranslate(ExampleDetailInfo))
