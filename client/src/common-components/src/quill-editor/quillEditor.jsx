import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import parse from 'html-react-parser';
import Swal from 'sweetalert2';

import { configQuillEditor, convertImageBase64ToFile } from './configQuillEditor';
import { ToolbarQuillEditor } from './toolbarQuillEditor';
import { SlimScroll } from '../slim-scroll/slimScroll'

import { AuthActions } from '../../../modules/auth/redux/actions'

import './quillEditor.css';

class QuillEditor extends Component {
    constructor(props) {
        super(props)

        this.state = {
            quill: null
        }
    }
    

    componentDidMount() {
        const { translate } = this.props
        const { id, isText = false, quillValueDefault, 
            toolbar = true, maxHeight = 200,
            enableEdit = true, placeholder = null,
            enableDropImage = true, showDetail = false
        } = this.props;

        // Khởi tạo Quill Editor trong thẻ có id = id truyền vào
        const quill = window.initializationQuill(`#editor-container${id}`, configQuillEditor(id, toolbar, enableEdit, placeholder, enableDropImage));
        
        // Insert value ban đầu
        if (quillValueDefault || quillValueDefault === '') {
            if (quill && quill.container && quill.container.firstChild) {
                quill.container.firstChild.innerHTML = quillValueDefault;
            } 
            if (quill?.container) {
                let imgs = Array.from(quill?.container?.querySelectorAll('img[src^="upload/private"]'))
                if (imgs?.length > 0) {
                    imgs.map((item) => {
                        this.props.downloadFile(item.getAttribute("src"), item.getAttribute("src"), false)
                    })
                }
            }

            this.setHeightContainer(id, maxHeight)
        }

        if (!isText) {
            // Bắt sự kiện text-change
            quill.on('text-change', (e) => {
                this.setHeightContainer(id, maxHeight)

                let imgs, imageSources = [];
                let selection = quill.getSelection()?.index;

                if (quill?.container) {
                    imgs = Array.from(
                        quill?.container?.querySelectorAll('img[src^="data:"]:not(.loading)')
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
                if (quill && quill.root && this.props.getTextData) {
                    this.props.getTextData(quill.root.innerHTML, imageSources);
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

            // Disable edit
            if (quill && !isText) {
                quill.enable(enableEdit);
            }
        }

        // Bắt sự kiện phóng to nội dung
        if (showDetail?.enable) {
            window.$(`#editor-container${id}`).on("dblclick", () => {
                Swal.fire({
                    title: showDetail?.titleShowDetail ?? translate('general.detail'),
                    html: quill?.container?.firstChild?.innerHTML,
                    width: showDetail?.width ?? "75%",
                    customClass: {
                        content: "quill-editor"
                    }
                })
            })
        }
        

        this.setState({
            quill: quill
        })
        this.setHeightContainer(id, maxHeight)
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        const { auth } = this.props
        const { enableEdit, quillValueDefault } = this.props;
        const { quill } = this.state

        // render lại khi download ảnh
        if (JSON.stringify(nextProps.auth) !== JSON.stringify(auth)) {
            return true
        }

        // download ảnh 
        if (nextProps.quillValueDefault !== quillValueDefault) {
            // Insert value ban đầu
            // Lưu ý: quillValueDefault phải được truyền vào 1 giá trị cố định, không thay đổi 
            if (nextProps.quillValueDefault || nextProps.quillValueDefault === '') {
                if (quill && quill.container && quill.container.firstChild) {
                    quill.container.firstChild.innerHTML = nextProps.quillValueDefault;
                }  
            }

            if (quill?.container) {
                let imgs = Array.from(quill?.container?.querySelectorAll('img[src^="upload/private"]'))
                if (imgs?.length > 0) {
                    imgs.map((item) => {
                        this.props.downloadFile(item.getAttribute("src"), item.getAttribute("src"), false)
                    })
                }
            }
        }

        if (nextProps.quillValueDefault === quillValueDefault) {
            return false;
        } 

        if (nextProps.enableEdit !== enableEdit) {
            return true;
        }

        return true;
    }

    componentDidUpdate() {
        const { auth } = this.props
        const { id, maxHeight = 200, enableEdit = true, isText = false, quillValueDefault } = this.props
        const { quill } = this.state

        if (quill && !isText) {
            quill.enable(enableEdit);
        }
        
        if (quill?.container) {
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

        this.setHeightContainer(id, maxHeight)
    }

    setHeightContainer = (id, maxHeight) => {
        SlimScroll.removeVerticalScrollStyleCSS(`editor-container${id}`)
        SlimScroll.addVerticalScrollStyleCSS(`editor-container${id}`, maxHeight, true)
    }

    render() {
        const { isText = false, inputCssClass = "", id, quillValueDefault, toolbar = true,
            font = true, header = true, typography = true, fontColor = true, 
            alignAndList = true, embeds = true, table = true
        } = this.props

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
}

function mapState (state) {
    const { auth } = state
    return { auth }
}
const actions = {
    downloadFile: AuthActions.downloadFile
}

const connectedQuillEditor = connect(mapState, actions)(withTranslate(QuillEditor));
export { connectedQuillEditor as QuillEditor, convertImageBase64ToFile }