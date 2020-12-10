import React, { Component } from 'react';
import { connect } from 'react-redux';

import parse from 'html-react-parser';

import { configQuillEditor } from './configQuillEditor';
import { ToolbarQuillEditor } from './toolbarQuillEditor';
class QuillEditor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            quill: null
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

    componentDidMount = () => {
        const { id, edit = true, quillValueDefault, fileUrls } = this.props;
        if (edit) {
            // Khởi tạo Quill Editor trong thẻ có id = id truyền vào
            const quill = window.initializationQuill(`#editor-container${id}`, configQuillEditor(id));
            
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

            // Custom icon insert table
            let insertTable = document.querySelector('#insert-table');
            insertTable.addEventListener('click', () => {
                let table = quill.getModule('table');
                table.insertTable(3, 3);
            });
            
            this.setState(state => {
                return {
                    ...state,
                    quill: quill
                }
            })
        }
        
    }

    /** 
     * Chuyển đổi dữ liệu ảnh base64 sang FIle để upload lên server
     * @imgs mảng hình ảnh dạng base64
     * @names mảng tên các ảnh tương ứng
     * */ 
    static convertImageBase64ToFile = (imgs) => {
        let imageFile;
        if (imgs && imgs.length !== 0) {
            imageFile = imgs.map((item) => {
                // Split the base64 string in data and contentType
                let block = item.getAttribute("src").split(";");
                let contentType = block[0].split(":")[1];
                let realData = block[1].split(",")[1];
                contentType = contentType || '';
                let sliceSize = 512;
            
                let byteCharacters = atob(realData);
                let byteArrays = [];
            
                for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                    let slice = byteCharacters.slice(offset, offset + sliceSize);
            
                    let byteNumbers = new Array(slice.length);
                    for (let i = 0; i < slice.length; i++) {
                        byteNumbers[i] = slice.charCodeAt(i);
                    }
            
                    let byteArray = new Uint8Array(byteNumbers);
            
                    byteArrays.push(byteArray);
                }
            
                let blob = new Blob(byteArrays, { type: contentType });
                return new File([blob], "png");
            })
        }
        return imageFile;
    }

    render() {
        const { id, edit = true, quillValueDefault, height = 200 } = this.props;

        return (
            <React.Fragment>
                {
                    edit
                        ? <React.Fragment>
                            <ToolbarQuillEditor
                                id={`toolbar${id}`}
                            />
                            <div id={`editor-container${id}`} style={{ height: height }} />
                        </React.Fragment>
                        : parse(quillValueDefault)
                }
            </React.Fragment>
        )
    }
}

const connectedQuillEditor = connect(null, null)(QuillEditor);
export { connectedQuillEditor as QuillEditor }