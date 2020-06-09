import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import Files from 'react-files';
import TextareaAutosize from 'react-textarea-autosize';

import './contentMaker.css';

class ContentMaker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showDropFileHere: false
        };
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
            files, onFilesChange, onFilesError, multiple=true, maxFiles=10, maxFileSize=10000000, minFileSize=0, clickable=false,
            text, onTextChange, placeholder, minRows=3, maxRows=20,
            onSubmit, submitButtonText,
            inputCssClass, controlCssClass,
        } = this.props

        return (
            <React.Fragment>
                <Files
                    ref='fileComponent'
                    className='files-dropzone-list'
                    onChange={onFilesChange}
                    onError={onFilesError}
                    multiple={multiple}
                    maxFiles={maxFiles}
                    maxFileSize={maxFileSize}
                    minFileSize={minFileSize}
                    clickable={clickable}>
                
                    <div className={inputCssClass} style={{position: "relative"}}>
                        <TextareaAutosize
                            placeholder={placeholder}
                            useCacheForDOMMeasurements
                            minRows={minRows}
                            maxRows={maxRows}
                            onDragEnter={this.handleDragEnter}
                            onDragLeave={this.handleDragLeave}
                            onDrop={this.handleDragLeave}
                            value={text}
                            onChange={onTextChange}/>
                            
                        {this.state.showDropFileHere &&
                        <div style={{fontSize: "2em", pointerEvents: "none", width: "100%", height: "100%", border: "2px dashed black", backgroundColor: "rgba(255, 255, 255, 0.3)", top: "0", left: 0, position: "absolute", textAlign: "center"}}>
                            DROP FILES HERE
                        </div>
                        }
                    </div>
                </Files>
                <div className={controlCssClass}>
                    <div style={{textAlign: "right"}}>
                        <a href="#" className="link-black text-sm" onClick={(e) => this.refs.fileComponent.openFileChooser()}>Đính kèm files&nbsp;&nbsp;</a>
                        <a href="#" className="link-black text-sm" onClick={(e)=>{
                                onSubmit(e);
                                this.refs.fileComponent.removeFiles(); // Xóa các file đã chọn sau khi submit
                            }}>
                            {submitButtonText}
                        </a>
                    </div>           
                    {files && files.length>0 &&
                        <div className='files-list'>
                            <ul>{files.map((file) =>
                                <li className='files-list-item' key={file.id}>
                                    <div className='files-list-item-preview'>
                                    {file.preview.type === 'image' ?  
                                    <React.Fragment>
                                        <img className='files-list-item-preview-image'src={file.preview.url} />
                                    </React.Fragment>    
                                    : 
                                    <div className='files-list-item-preview-extension'>{file.extension}</div>}
                                        <a href="#" className="pull-right btn-box-tool" onClick={(e)=>{this.refs.fileComponent.removeFile(file)}}><i className="fa fa-times"></i></a>
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