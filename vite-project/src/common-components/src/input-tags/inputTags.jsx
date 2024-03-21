import React, { Component } from 'react'
import { withTranslate } from 'react-redux-multilingual'

import TagsInput from 'react-tagsinput'
import 'react-tagsinput/react-tagsinput.css'
import './inputTags.css'

class InputTags extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  handleChange = (value) => {
    this.props.onChange(value)
  }

  render() {
    const { translate } = this.props
    const { id, value = [], placeholder = translate('general.add_tag') } = this.props

    return (
      <React.Fragment>
        <div className='tags-input input-group' id={`tagsinput-container-${id}`}>
          <TagsInput value={value} onChange={this.handleChange} inputProps={{ placeholder: placeholder }} />
        </div>
      </React.Fragment>
    )
  }
}

const connectedInputTags = withTranslate(InputTags)
export { connectedInputTags as InputTags }
