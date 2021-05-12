import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import parse from 'html-react-parser';

import { configQuillEditor } from './configQuillEditor';
import { ToolbarQuillEditor } from './toolbarQuillEditor';

import { AuthActions } from '../../../modules/auth/redux/actions'

import './quillEditor.css';

function QuillEditor (props) {
    const { auth } = props
    const { id, isText = false, quillValueDefault, 
        toolbar = true, maxHeight = 200,
        enableEdit = true, placeholder = null,
        enableDropImage = true, inputCssClass = "",
        font = true, header = true, typography = true, fontColor = true, 
        alignAndList = true, embeds = true, table = true
    } = props;

    const [quill, setQuill] = useState(null)

    useEffect(() => {
        // Khởi tạo Quill Editor trong thẻ có id = id truyền vào
        const quill = window.initializationQuill(`#editor-container${id}`, configQuillEditor(id, toolbar, enableEdit, placeholder, enableDropImage));

        // Insert value ban đầu
        if (quillValueDefault || quillValueDefault === '') {
            if (quill && quill.container && quill.container.firstChild) {
                quill.container.firstChild.innerHTML = quillValueDefault;
            } 
            let imgs = Array.from(quill.container.querySelectorAll('img[src^="upload/private"]'))
            if (imgs?.length > 0) {
                imgs.map((item) => {
                    props.downloadFile(item.getAttribute("src"), item.getAttribute("src"), false)
                })
            }

            setHeightContainer(id, maxHeight)
        }

        if (!isText) {
            if (enableEdit && !isText) {
                // Bắt sự kiện text-change
                quill.on('text-change', (e) => {
                    setHeightContainer(id, maxHeight)

                    let imgs, imageSources = [];
                    let selection = quill.getSelection()?.index;

                    imgs = Array.from(
                        quill.container.querySelectorAll('img[src^="data:"]:not(.loading)')
                    );

                    // Lọc base64 ảnh
                    if (imgs && imgs.length !== 0) {
                        imgs = imgs.map((item, index) => {
                            imageSources.push({
                                originalName: "image" + index,
                                url: item.getAttribute("src")
                            });
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
                            if (text?.toString() === " " || text?.toString() === "\n") {
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

                            // Remove attr target for link email
                            window.$('.ql-editor a').map(function() {
                                if (this.href?.startsWith("mailto:")) {
                                    window.$(this).removeAttr("target")
                                }
                            })
                        }
                    } else if (insert && insert.length > 1) {   // Handle event paste
                        if ((insert?.startsWith("http://") || insert?.startsWith("https://")) && (insert !== "https://") && (insert !== "http://")) {
                            quill.deleteText(selection, insert.length);
                            quill.insertText(selection, insert, 'link', insert);
                        } else if (insert?.endsWith("@gmail.com") || (insert?.endsWith("@sis.hust.edu.vn"))) {
                            quill.deleteText(selection, insert.length);
                            quill.insertText(selection, insert, 'link', "mailto:" + insert);
                            
                            // Remove attr target for link email
                            window.$('.ql-editor a').map(function() {
                                if (this.href?.startsWith("mailto:")) {
                                    window.$(this).removeAttr("target")
                                }
                            })
                        }
                    }
                    
                    // Trả về html quill
                    if (quill && quill.root) {
                        props.getTextData(quill.root.innerHTML, imageSources);
                    }

                    // Add lại base64 ảnh
                    if (imgs && imgs.length !== 0) {
                        imgs = imgs.map((item, index) => {
                            item.src = imageSources?.[index]?.url;
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

            setQuill(quill)
        }
    }, [])

    useEffect(() => {
        quill && quill.enable(enableEdit);

        setHeightContainer(id, maxHeight)
    }, [enableEdit])

    useEffect(() => {
        // Insert value ban đầu
        // Lưu ý: quillValueDefault phải được truyền vào 1 giá trị cố định, không thayđô
        if (quillValueDefault || quillValueDefault === '') {
            if (quill && quill.container && quill.container.firstChild) {
                quill.container.firstChild.innerHTML = quillValueDefault;
            }  
        }

        setHeightContainer(id, maxHeight)
    }, [quillValueDefault])

    useEffect(() => {
        if (quill) {
            // Add lại base64 ảnh download từ server
            let imgs = Array.from(quill.container.querySelectorAll('img[src^="upload/private"]'))

            if (imgs?.length > 0) {
                imgs = imgs.map((img) => {
                    if (auth?.showFiles?.length > 0) {
                        let image = auth.showFiles.filter(item => item.fileName === img.getAttribute("src"))
                        if (image?.[0]?.file) {
                            img.src = image[0].file;
                        }
                    }
                    return img;
                })
            }
        }

        setHeightContainer(id, maxHeight)
    }, [JSON.stringify(auth.showFiles)])

    function setHeightContainer (id, maxHeight) {
        window.$(`#editor-container${id}`).height("")
        let heightCurrent = window.$(`#editor-container${id}`).height()
        if (heightCurrent > maxHeight) {
            window.$(`#editor-container${id}`).height(maxHeight)
        } else {
            window.$(`#editor-container${id}`).height("")
        }
    }

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
                        <div id={`editor-container${id}`} className={`quill-editor ${inputCssClass}`}/>
                    </React.Fragment>
                    : parse(quillValueDefault)
            }
        </React.Fragment>
    )
}

    /** 
     * Chuyển đổi dữ liệu ảnh base64 sang FIle để upload lên server
     * @imgs mảng hình ảnh dạng base64
     * @names mảng tên các ảnh tương ứng
     * */ 
    QuillEditor.convertImageBase64ToFile = (imgs, sliceSize=512) => {
        let imageFile;
        if (imgs && imgs.length !== 0) {
            imageFile = imgs.map((item) => {
                let block, contentType, realData;
                // Split the base64 string in data and contentType
                block = item?.url?.split(";");
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
                return new File([blob], item?.originalName + ".png");
            })
        }
        return imageFile;
    }

function mapState (state) {
    const { auth } = state
    return { auth }
}
const actions = {
    downloadFile: AuthActions.downloadFile
}

const connectedQuillEditor = connect(mapState, actions)(QuillEditor);
export { connectedQuillEditor as QuillEditor }