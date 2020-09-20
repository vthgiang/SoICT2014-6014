import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import "./uploadFile.css"
class UploadFile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            files: [],
        }
    }

    render() {
        const { translate } = this.props;
        const { files } = this.props;
        return (
            <React.Fragment>
                <div className="form-group">
                    <div className="upload btn btn-primary">
                        <i className="fa fa-folder"></i>
                        {" " + translate('document.choose_file')}
                        <input className="upload" type="file" name="file" onChange={this.props.handleChangeFile} multiple />
                    </div>
                </div>
                {files.length ?
                    <div className="list-upload-file-cmc">
                        <ul className="ul-upload-file-cmc">
                            {files.map((child, index) => {
                                return (
                                    <React.Fragment>
                                        <li key={index}>
                                            <label className="delete-label-upfile-cmc"><a style={{ cursor: "pointer" }} title='Xóa file này'><i className="fa fa-times" id="delete-icon-upload-cmc"
                                                onClick={(e) => this.props.handleDeleteFile(child.fileName)} /></a></label>
                                            <a className="file-name-upfile">{child.fileName}</a>
                                        </li>
                                    </React.Fragment>
                                )
                            })}
                        </ul>
                    </div>
                    : null
                }

            </React.Fragment >
        );
    }
}

const mapState = state => state;
const UploadFileExport = connect(mapState, null)(withTranslate(UploadFile));

export { UploadFileExport as UploadFile }
