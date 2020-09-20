import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import "./uploadFile.css"
class UploadFile extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    };

    /** Bắt sự kiện thay đổi file đính kèm */
    handleUploadFile = (e) => {
        const { multiple = false } = this.props;
        let fileList = e.target.files;

        if (fileList) {
            for (let i = 0; i < fileList.length; i++) {
                let file = fileList[i];
                if (file) {
                    let url = URL.createObjectURL(file);
                    let fileLoad = new FileReader();
                    fileLoad.readAsDataURL(file);
                    fileLoad.onload = () => {
                        let item = { fileName: file.name, urlFile: url, fileUpload: file };
                        this.setState(state => {
                            if (!state.files) {
                                state.files = [];
                            }
                            return {
                                ...state,
                                files: multiple ? [...state.files, item] : [item]
                            }
                        })
                    };
                }
            }
        }
    }

    /**
     * Bắt sự kiện xóa file đính kèm
     * @param {*} name : Têm file muốn xoá
     */
    handleDeleteFile = (index) => {
        let { files } = this.state;

        files.splice(index, 1);
        this.setState({
            files: files
        })
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.files === undefined && nextProps.files && nextProps.files.length !== 0) {
            return {
                ...prevState,
                files: nextProps.files
            }
        }
        return null
    }

    componentDidUpdate() {
        const { files } = this.state;
        if (files !== undefined) {
            this.props.onChange(files);
        }
    }

    render() {
        const { translate } = this.props;

        const { multiple = false } = this.props;

        const { files } = this.state;

        return (
            <React.Fragment>
                <div className="form-group">
                    <div className="upload btn btn-primary">
                        <i className="fa fa-folder"></i>
                        {" " + translate('document.choose_file')}
                        <input className="upload" type="file" name="file" onChange={this.handleUploadFile} multiple={multiple} />
                    </div>
                </div>
                {files && files.length ?
                    <div className="list-upload-file-cmc">
                        <ul className="ul-upload-file-cmc">
                            {files.map((child, index) => {
                                return (
                                    <li key={index}>
                                        <label className="delete-label-upfile-cmc"><a style={{ cursor: "pointer" }} title='Xóa file này'><i className="fa fa-times" id="delete-icon-upload-cmc"
                                            onClick={(e) => this.handleDeleteFile(index)} /></a></label>
                                        <a className="file-name-upfile">{child.fileName}</a>
                                    </li>
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
