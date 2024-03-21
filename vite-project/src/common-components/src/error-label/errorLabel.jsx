import React, { Component } from 'react'

class ErrorLabel extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { content, style } = this.props
    return (
      <React.Fragment>
        {content && (
          <div className='help-block' style={style}>
            {content}
          </div>
        )}
      </React.Fragment>
    )
  }
}

export { ErrorLabel }
