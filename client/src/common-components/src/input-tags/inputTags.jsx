import React, { Component } from 'react'

import TagsInput from 'react-tagsinput'
import 'react-tagsinput/react-tagsinput.css'
import './inputTags.css'

class InputTags extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleChange = (value) => {
        this.props.onChange(value)

    }

    render() {
        const { id, value = [] } = this.props

        return (
            <React.Fragment>
                <div className="tags-input input-group" id={`tagsinput-container-${id}`}>
                    <TagsInput value={value} onChange={this.handleChange}/>   
                </div>
            </React.Fragment>
        )
    }
}

export { InputTags }