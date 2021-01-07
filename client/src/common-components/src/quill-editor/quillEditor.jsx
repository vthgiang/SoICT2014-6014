import React, { Component } from 'react';
import { connect } from 'react-redux';

import parse from 'html-react-parser';

import { configQuillEditor } from './configQuillEditor';
import { ToolbarQuillEditor } from './toolbarQuillEditor';

import './quillEditor.css';
class QuillEditor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            quill: null
        }

    }
  
    componentDidMount = () => {
        const { id, isText = false, quillValueDefault, fileUrls, toolbar = true, enableEdit = true } = this.props;
        if (!isText) {
            // Khởi tạo Quill Editor trong thẻ có id = id truyền vào
            const quill = window.initializationQuill(`#editor-container${id}`, configQuillEditor(id, toolbar, enableEdit));

            // Insert value ban đầu
            if (quillValueDefault || quillValueDefault === '') {
                if (quill && quill.container && quill.container.firstChild) {
                    quill.container.firstChild.innerHTML = quillValueDefault;
                } 
                if (fileUrls) {
                    let imgs = Array.from(
                        quill.container.querySelectorAll('img[src]')
                    );
                    if (imgs && imgs.length !== 0) {
                        imgs = imgs.map((item, index) => {
                            item.src = fileUrls[index];
                            return item;
                        })
                    }
                }
            }

            if (enableEdit && !isText) {
                // Bắt sự kiện text-change
                quill.on('text-change', () => {
                    let imgs, imageSources = [];

                    imgs = Array.from(
                        quill.container.querySelectorAll('img[src^="data:"]:not(.loading)')
                    );

                    if (imgs && imgs.length !== 0) {
                        imgs = imgs.map((item, index) => {
                            imageSources.push(item.getAttribute("src"));
                            item.src = "image" + index;
                            return item;
                        })
                    }
                    
                    this.props.getTextData(quill.root.innerHTML, imgs);
                    if (imgs && imgs.length !== 0) {
                        imgs = imgs.map((item, index) => {
                            item.src = imageSources[index];
                            return item;
                        })
                    }
                });

                // Custom insert table
                window.$(`#insert-tabletoolbar${id}`).click(() => {
                    let table = quill.getModule('table');
                    table.insertTable(3, 3);
                });
            } else {
                // Disable edit
                quill.enable(enableEdit);
            }

            this.setState(state => {
                return {
                    ...state,
                    quill: quill
                }
            })
        }
        
    }

    componentDidUpdate = () => {
        const { quillValueDefault, fileUrls } = this.props;
        const { quill } = this.state;

        // Insert value ban đầu
        // Lưu ý: quillValueDefault phải được truyền vào 1 giá trị cố định, không thayđô
        if (quillValueDefault || quillValueDefault === '') {
            if (quill && quill.container && quill.container.firstChild) {
                quill.container.firstChild.innerHTML = quillValueDefault;
            }  
            if (fileUrls) {
                let imgs = Array.from(
                    quill.container.querySelectorAll('img[src]')
                );
                if (imgs && imgs.length !== 0) {
                    imgs = imgs.map((item, index) => {
                        item.src = fileUrls[index];
                        return item;
                    })
                }
            }
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        if (nextProps.quillValueDefault === this.props.quillValueDefault) {
            return false;
        }
        return true;
    }

    /** 
     * Chuyển đổi dữ liệu ảnh base64 sang FIle để upload lên server
     * @imgs mảng hình ảnh dạng base64
     * @names mảng tên các ảnh tương ứng
     * */ 
    static convertImageBase64ToFile = (imgs, sliceSize=512) => {
        let imageFile;
        if (imgs && imgs.length !== 0) {
            imageFile = imgs.map((item) => {
                const byteCharacters = atob(item.getAttribute("src").split(";"));
                const byteArrays = [];

                for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                    const slice = byteCharacters.slice(offset, offset + sliceSize);

                    const byteNumbers = new Array(slice.length);
                    for (let i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                    }

                    const byteArray = new Uint8Array(byteNumbers);
                    byteArrays.push(byteArray);
                }

                const blob = new Blob(byteArrays, {type: ""});
                return new File([blob], "png");
            })
        }
        return imageFile;
    }

    render() {
        const { id, isText = false, quillValueDefault, height = 200, toolbar = true, inputCssClass = "",
            font = true, header = true, typography = true, fontColor = true, alignAndList = true, embeds = true, table = true
        } = this.props;

        return (
            <React.Fragment>
                {
                    !isText
                        ? <React.Fragment>
                            {
                                toolbar &&
                                <ToolbarQuillEditor
                                    id={`toolbar${id}`}
                                    font={font}
                                    header={header}
                                    typography={typography}
                                    fontColor={fontColor}
                                    alignAndList={alignAndList}
                                    embeds={embeds}
                                    table={table}
                                    inputCssClass={inputCssClass}
                                />
                            }
                            <div id={`editor-container${id}`} style={{ height: height }} className={`quill-editor ${inputCssClass}`}/>
                        </React.Fragment>
                        : parse(quillValueDefault)
                }
            </React.Fragment>
        )
    }
}

const connectedQuillEditor = connect(null, null)(QuillEditor);
export { connectedQuillEditor as QuillEditor }