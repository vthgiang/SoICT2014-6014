import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { QuillEditor } from '../quill-editor/quillEditor';

import Files from 'react-files';
import TextareaAutosize from 'react-textarea-autosize';

import './contentMaker.css';

class ContentMaker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showDropFileHere: false,
            file:[],
            filepaste:[]
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
                filepaste : [...this.state.filepaste,fileObject]
            }) 
            let files= [...this.state.file,fileObject]
            this.setState({file:files})
            if (this.props.onFilesChange){
                this.props.onFilesChange(files)
            }
        }
    };
    onActionFilesChange = (files) => {
        let listfiles = [...files, ...this.state.filepaste]
        this.setState({
            file:listfiles
        })
        if (this.props.onFilesChange){
            this.props.onFilesChange(listfiles)
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
        if (this.props.onFilesChange){
            this.props.onFilesChange(files)
        }
    }
    shouldComponentUpdate = (nextProps, nextState) => {
        if (nextState.showDropFileHere===true && this.state.showDropFileHere===false){
            return true
        }
        if (nextState.showDropFileHere===false && this.state.showDropFileHere===false){
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
    render() {
        const { translate } = this.props;
        const {
            idQuill, files, onFilesChange, onFilesError, multiple = true, maxFiles = 10, maxFileSize = 10000000, minFileSize = 0, clickable = false,
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
                        <a style={{ cursor: "pointer" }} className="link-black text-sm" onClick={(e) => this.refs.fileComponent.openFileChooser()}>{translate("task.task_perform.attach_file")}&nbsp;&nbsp;&nbsp;&nbsp;</a>
                        <a style={{ cursor: "pointer" }} className="link-black text-sm" disabled={disabledSubmit} onClick={(e) => {
                            onSubmit(e);
                            this.refs.fileComponent.removeFiles(); 
                            this.setState({filepaste:[]})
                            // Xóa các file đã chọn sau khi submit
                        }}>
                            {submitButtonText}&nbsp;&nbsp;&nbsp;
                        </a>
                        <a style={{ cursor: "pointer" }} className="link-black text-sm" onClick={handleEdit}>{cancelButtonText}</a>
                    </div>
                    {files && files.length > 0 &&
                        <div className='files-list'>
                            <ul>{files.map((file,index) =>
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
                                            <div className='files-list-item-preview-extension'>{file.extension}</div>}
                                        <a style={{ cursor: "pointer" }} className="pull-right btn-box-tool" onClick={(e) => { this.refs.fileComponent.removeFile(file); this.onFilesRemote(index) }}><i className="fa fa-times"></i></a>
                                    </div>
                                    <div className='files-list-item-content'>
                                        <div className='files-list-item-content-item files-list-item-content-item-1'>{file.name}</div>
                                        <div className='files-list-item-content-item files-list-item-content-item-2'>{file.sizeReadable}</div>
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