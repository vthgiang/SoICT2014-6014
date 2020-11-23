import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import parse from 'html-react-parser';
class TrixEditor extends Component {
    constructor(props) {
        super(props);

        this.state = {
        }

        this.trixInput = React.createRef();
    }

    componentDidMount() {
        // Disable button import file
        if (!this.props.handleAddAttachment) {
            document.getElementsByClassName("trix-button trix-button--icon trix-button--icon-attach")[0].disabled = true;
        }

        // Bắt sự kiện change text
        this.trixInput.current && this.trixInput.current.addEventListener("trix-change", event => {
            if (this.props.handleChange) {
                this.props.handleChange(event.target.innerHTML);
            }
        });

        // Bắt sự kiện add attachment
        this.trixInput.current && this.trixInput.current.addEventListener("trix-attachment-add", event => {
            if (event.attachment && event.attachment.file) {
                if (this.props.handleAddAttachment) {
                    event.attachment.setUploadProgress(100);
                    this.props.handleAddAttachment(event.attachment.file);
                } else {
                    event.attachment.setUploadProgress(100);
                }
            }
        })

        // Bắt sự kiện remove attachment
        this.trixInput.current && this.trixInput.current.addEventListener("trix-attachment-remove", event => {
            if (event.attachment && event.attachment.file) {
                if (this.props.handleRemoveAttachment) {
                    this.props.handleRemoveAttachment(event.attachment.file);
                }
            }
        });
    }

    render() {
        const { trixId = "trix-editor", value, edit = true } = this.props;

        return (
            <React.Fragment>
                {
                    edit ?
                        <div id = {trixId + "form"} className = "container-fluid" >
                            <form>
                                <input
                                    id={trixId}
                                    name="description"
                                    className="form-control"
                                    type="hidden"
                                    value={value}
                                />
                                <trix-editor
                                    classname="trix-content"
                                    input={trixId} 
                                    placeholder="Start typing here...."
                                    ref={this.trixInput}
                                />
                            </form>
                        </div>
                    : parse(value)
                }
            </React.Fragment>
        );
    }
}

function mapState(state) {
}
const actions = {
}
const connectedTrixEditor = connect(mapState, actions)(withTranslate(TrixEditor));
export { connectedTrixEditor as TrixEditor }