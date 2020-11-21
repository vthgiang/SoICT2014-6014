import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

class TrixEditor extends Component {
    constructor(props) {
        super(props);

        this.state = {
        }

        this.trixInput = React.createRef();
    }
    
    shouldComponentUpdate = (nextProps, nextState) => {
        if (nextProps.value !== this.props.value) {
            this.trixInput.current.innerHTML = nextProps.value;
            return true;
        }
        return true;
    }

    componentDidMount() {
        // Bắt sự kiện change text
        this.trixInput.current.addEventListener("trix-change", event => {
            console.log("trix change event fired");
            this.props.handleTrixChange(event.target.innerHTML);
        });

        // Bắt sự kiện add attachment
        this.trixInput.current.addEventListener("trix-attachment-add", event => {
            if (event.attachment && event.attachment.file) {
                event.attachment.setUploadProgress(100);
                this.props.handleAddAttachment(event.attachment.file);
            }
        })

        // Bắt sự kiện remove attachment
        this.trixInput.current.addEventListener("trix-attachment-remove", event => {
            if (event.attachment && event.attachment.file) {
                this.props.handleRemoveAttachment(event.attachment.file);
            }
        });
    }

    render() {
        const { trixId, value } = this.props;

        return (
            <div id={trixId + "form"} className="container-fluid">
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
        );
    }
}

function mapState(state) {
}
const actions = {
}
const connectedTrixEditor = connect(mapState, actions)(withTranslate(TrixEditor));
export { connectedTrixEditor as TrixEditor }