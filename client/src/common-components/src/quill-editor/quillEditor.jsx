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
        const { id, isText = false, quillValueDefault, fileDefault, toolbar = true, enableEdit = true, placeholder = null } = this.props;
        if (!isText) {
            // Khởi tạo Quill Editor trong thẻ có id = id truyền vào
            const quill = window.initializationQuill(`#editor-container${id}`, configQuillEditor(id, toolbar, enableEdit, placeholder));

            // Insert value ban đầu
            if (quillValueDefault || quillValueDefault === '') {
                if (quill && quill.container && quill.container.firstChild) {
                    quill.container.firstChild.innerHTML = quillValueDefault;
                } 
                if (fileDefault) {
                    let imgs = Array.from(
                        quill.container.querySelectorAll('img[src]')
                    );
                    if (imgs && imgs.length !== 0) {
                        imgs = imgs.map((item, index) => {
                            item.src = fileDefault[index];
                            return item;
                        })
                    }
                }
            }

            if (enableEdit && !isText) {
                // Bắt sự kiện text-change
                quill.on('text-change', (e) => {
                    let imgs, imageSources = [];
                    let selection = quill.getSelection()?.index;

                    imgs = Array.from(
                        quill.container.querySelectorAll('img[src^="data:"]:not(.loading)')
                    );

                    // Lọc base64 ảnh
                    if (imgs && imgs.length !== 0) {
                        imgs = imgs.map((item, index) => {
                            imageSources.push(item.getAttribute("src"));
                            item.src = "image" + index;
                            return item;
                        })
                    }

                    // Auto Insert URL and email
                    let insert = null;
                    if (e && e.ops && e.ops.length !== 0) {
                        e.ops.map(item => {
                            if (item?.insert && !item?.attributes) {
                                insert = item?.insert
                            }
                        })
                    }
                    
                    if (insert === " " || insert === "\n") {   // Handle event type space and enter
                        let text, temp;
                        if (insert === "\n") {
                            selection = selection + 1;
                        }
                        temp = selection - 2;

                        while (temp >= 0) {
                            text = quill.getText(temp, 1);
                            if (text?.toString() === " ") {
                                break;
                            } else {
                                temp--;
                            }
                        }

                        text = quill.getText(temp + 1, selection - temp - 2)?.toString();
                        if ((text?.startsWith("http://") || text?.startsWith("https://")) && (text !== "https://") && (text !== "http://")) {
                            quill.deleteText(temp + 1, selection - temp - 2);
                            quill.insertText(temp + 1, text, 'link', text);
                        } else if (text?.endsWith("@gmail.com") || (text?.endsWith("@sis.hust.edu.vn"))) {
                            quill.deleteText(temp + 1, selection - temp - 2);
                            quill.insertText(temp + 1, text, 'link', "mailto:" + text);
                        }
                    } else if (insert && insert.length > 1) {   // Handle event paste
                        if ((insert?.startsWith("http://") || insert?.startsWith("https://")) && (insert !== "https://") && (insert !== "http://")) {
                            quill.deleteText(selection, insert.length);
                            quill.insertText(selection, insert, 'link', insert);
                        } else if (insert?.endsWith("@gmail.com") || (insert?.endsWith("@sis.hust.edu.vn"))) {
                            quill.deleteText(selection, insert.length);
                            quill.insertText(selection, insert, 'link', "mailto:" + insert);
                        }
                    }
                    
                    // Trả về html quill
                    if (quill && quill.root) {
                        this.props.getTextData(quill.root.innerHTML, imageSources);
                    }

                    // Add lại base64 ảnh
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
        const { quillValueDefault, fileDefault, enableEdit = true } = this.props;
        const { quill } = this.state;

        // Insert value ban đầu
        // Lưu ý: quillValueDefault phải được truyền vào 1 giá trị cố định, không thayđô
        if (quillValueDefault || quillValueDefault === '') {
            if (quill && quill.container && quill.container.firstChild) {
                quill.container.firstChild.innerHTML = quillValueDefault;
            }  
            if (fileDefault) {
                let imgs = Array.from(
                    quill.container.querySelectorAll('img[src]')
                );
                if (imgs && imgs.length !== 0) {
                    imgs = imgs.map((item, index) => {
                        item.src = fileDefault[index];
                        return item;
                    })
                }
            }
        }

        quill.enable(enableEdit);
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        const { enableEdit, quillValueDefault } = this.props;

        if (nextProps.enableEdit !== enableEdit) {
            return true;
        }
        if (nextProps.quillValueDefault === quillValueDefault) {
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
                let block, contentType, realData;
                // Split the base64 string in data and contentType
                block = item.split(";");
                if (block && block.length !== 0) {
                    contentType = block[0].split(":")[1];
                    realData = block[1].split(",")[1];
                }
                contentType = contentType || '';
            
                let byteCharacters = atob(realData);
                let byteArrays = [];

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