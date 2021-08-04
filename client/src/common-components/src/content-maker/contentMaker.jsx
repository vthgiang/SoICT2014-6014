import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { QuillEditor } from '../quill-editor/quillEditor';
import axios from 'axios';
import Files from 'react-files';
import TextareaAutosize from 'react-textarea-autosize';
import { DialogModal } from "../../../common-components"
import './contentMaker.css';
import ModalDriver from "../googledriver/ggdrive";

class ContentMaker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showDropFileHere: false,
            file: [],
            filepaste: [],
            fileId: "",
            authToken: "",
            data: [],
            nextPageToken: "",
            datadriver: "",
        };
    }

    pressEnter = (event) => {
        let code = event.keyCode || event.which;
        if (code === 13 && !event.shiftKey) {
            let { onSubmit } = this.props
            onSubmit(event)
        }
        if (code == 13 && !event.shiftKey) {
            event.preventDefault();
        }
    }
    //paste ảnh
    handlePaste = e => {
        if (e.clipboardData.files.length) {
            const fileObject = e.clipboardData.files[0];
            this.setState({
                filepaste: [...this.state.filepaste, fileObject]
            })
            let files = [...this.state.file, fileObject]
            this.setState({ file: files })
            if (this.props.onFilesChange) {
                this.props.onFilesChange(files)
            }
        }
    };
    onActionFilesChange = (files) => {
        let listfiles = [...files, ...this.state.filepaste]
        this.setState({
            file: listfiles
        })
        if (this.props.onFilesChange) {
            this.props.onFilesChange(listfiles)
        }
    }
    formatDate = (date, monthYear = false) => {
        let data = new Date(date)
        if (!date) return null;
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) {
            month = '0' + month;
        }

        if (day.length < 2) {
            day = '0' + day;
        }

        if (monthYear === true) {
            return [month, year].join('-');
        } else {
            return [day, month, year].join('-') + " at " + [data.getHours(), data.getMinutes()].join(":");
        }
    }
    onFilesRemote = (index) => {
        let files = this.state.file
        let fileRemove = files.splice(index, 1)
        this.setState(state => {
            return {
                ...state,
                filepaste: state.filepaste.filter(value => value.lastModified !== fileRemove[0].lastModified),
                file: files
            }
        })
        if (this.props.onFilesChange) {
            this.props.onFilesChange(files)
        }
    }
    shouldComponentUpdate = (nextProps, nextState) => {
        if (nextState.showDropFileHere === true && this.state.showDropFileHere === false) {
            return true
        }
        if (nextState.showDropFileHere === false && this.state.showDropFileHere === false) {
            return true
        }
        return false;
    }
    handleDragEnter = () => {
        this.setState(state => {
            return {
                ...state,
                showDropFileHere: true
            }
        });
    }

    handleDragLeave = () => {
        this.setState(state => {
            return {
                ...state,
                showDropFileHere: false
            }
        });
    }
    handleDataDriver = (value) => {
        this.setState(state => {
            return {
                ...state,
                dataDriver: value
            }
        });
    }
    showFileExtension = (data) => {
        let result = null
        switch (data.extension) {
            case "doc", "docx":
                result = <img className='files-list-item-preview-extension' src="https://img.icons8.com/color/96/000000/ms-word.png" />
                break;
            case "xlsx":
                result = <img className='files-list-item-preview-extension' src="https://img.icons8.com/color/96/000000/ms-excel.png" />
                // code block
                break;
            case "pdf":
                result = <img className='files-list-item-preview-extension' src="https://img.icons8.com/color/96/000000/pdf.png" />
                // code block
                break;
            case "txt":
                result = <img className='files-list-item-preview-extension' src="https://img.icons8.com/dusk/64/000000/txt.png" />
                // code block
                break;
            default:
                result = <img className='files-list-item-preview-extension' src="https://img.icons8.com/cute-clipart/64/000000/file.png" />
        }
        return result
    }
    render() {
        const { translate } = this.props;
        const {
            idQuill, files, onFilesChange, onFilesError, multiple = true, maxFiles = 10, maxFileSize = 100000000000, minFileSize = 0, clickable = false,
            text, onTextChange, placeholder,
            onSubmit, submitButtonText, disabledSubmit,
            inputCssClass, controlCssClass, handleEdit, cancelButtonText
        } = this.props
        return (
            <React.Fragment>
                <div onPaste={this.handlePaste} onDragLeave={this.handleDragLeave} onDragEnter={this.handleDragEnter}>
                    <Files
                        ref='fileComponent'
                        className='files-dropzone-list'
                        onChange={this.onActionFilesChange}
                        onError={onFilesError}
                        multiple={multiple}
                        maxFiles={maxFiles}
                        maxFileSize={maxFileSize}
                        minFileSize={minFileSize}
                        clickable={clickable}
                    >
                        <QuillEditor
                            dataDriver={this.state.dataDriver}
                            showDropFileHere={this.state.showDropFileHere}
                            id={idQuill}
                            inputCssClass={inputCssClass}
                            toolbar={false}
                            getTextData={onTextChange}
                            quillValueDefault={text}
                            placeholder={placeholder}
                            enableDropImage={false}
                        />

                    </Files>
                </div>
                <div className={controlCssClass}>
                    <div className="" style={{ textAlign: "right" }}>

                        <ModalDriver handleDataDriver={this.handleDataDriver}></ModalDriver>
                        <a style={{ cursor: "pointer" }} className="link-black text-sm" onClick={(e) => this.refs.fileComponent.openFileChooser()}>{translate("task.task_perform.attach_file")}&nbsp;&nbsp;&nbsp;&nbsp;</a>
                        <a style={{ cursor: "pointer" }} className="link-black text-sm" disabled={disabledSubmit} onClick={(e) => {
                            onSubmit(e);
                            this.refs.fileComponent.removeFiles();
                            this.setState({ filepaste: [], dataDriver: '' })
                            // Xóa các file đã chọn sau khi submit
                        }}>
                            {submitButtonText}&nbsp;&nbsp;&nbsp;
                        </a>
                        <a style={{ cursor: "pointer" }} className="link-black text-sm" onClick={handleEdit}>{cancelButtonText}</a>
                    </div>
                    {files && files.length > 0 &&
                        <div className='files-list'>
                            <ul>{files.map((file, index) =>
                                <li className='files-list-item' key={file.id}>
                                    <div className='files-list-item-preview row'>
                                        {!file.preview ?
                                            <React.Fragment>
                                                <img className='files-list-item-preview-image' src={window.URL.createObjectURL(file)} />
                                            </React.Fragment>
                                            : file.preview.type === 'image' ?
                                                <React.Fragment>
                                                    <img className='files-list-item-preview-image' src={window.URL.createObjectURL(file)} />
                                                </React.Fragment>
                                                :
                                                <React.Fragment>
                                                    {this.showFileExtension(file)}
                                                </React.Fragment>
                                        }

                                    </div>
                                    <div className='files-list-item-content'>
                                        <div className="files-list-item-content-right">
                                            <div className='files-list-item-content-item files-list-item-content-item-1'>{file.name}</div>
                                            <div>{this.formatDate(file.lastModifiedDate)}・{file.sizeReadable || file.size}</div>
                                        </div>
                                        <div className='files-list-item-content-delete'>
                                            <div id="app-cover">
                                                <input type="checkbox" id="checkbox" onClick={(e) => { this.refs.fileComponent.removeFile(file); this.onFilesRemote(index) }} />
                                                <div id="bin-icon">
                                                    <div id="lid"></div>
                                                    <div id="box">
                                                        <div id="box-inner">
                                                            <div id="bin-lines"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div id="layer"></div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            )}
                            </ul>
                        </div>
                    }
                </div>
            </React.Fragment>
        );
    }
}

const mapState = state => state;
const ContentMakerExport = connect(mapState, null)(withTranslate(ContentMaker));

export { ContentMakerExport as ContentMaker }