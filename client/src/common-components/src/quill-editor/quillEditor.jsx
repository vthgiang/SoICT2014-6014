import React, { Component } from 'react';
import { connect } from 'react-redux';

import parse from 'html-react-parser';

import { configQuillEditor } from './configQuillEditor';

class QuillEditor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            quill: null
        }

    }
    
    componentDidUpdate = () => {
        const { quillValueDefault } = this.props;
        const { quill } = this.state;

        // Insert value ban đầu
        // Lưu ý: quillValueDefault phải được truyền vào 1 giá trị cố định, không thayđô
        if (quillValueDefault || quillValueDefault === '') {
            if (quill && quill.container && quill.container.firstChild) {
                quill.container.firstChild.innerHTML = quillValueDefault;
            }  
        }
    }

    componentDidMount = () => {
        const { id, edit = true, quillValueDefault } = this.props;
        if (edit) {
            // Khởi tạo Quill Editor trong thẻ có id = id truyền vào
            const quill = window.initializationQuill(`#editor-container${id}`, configQuillEditor);
            
            // Insert value ban đầu
            if (quillValueDefault || quillValueDefault === '') {
                if (quill && quill.container && quill.container.firstChild) {
                    quill.container.firstChild.innerHTML = quillValueDefault;
                } 
            }

            // Bắt sự kiện text-change
            quill.on('text-change', (delta, oldDelta, source) => {
                console.log("change", quill.root.innerHTML, delta, oldDelta, source);
                const imgs = Array.from(
                    quill.container.querySelectorAll('img[src^="data:"]:not(.loading)')
                );

                this.props.getTextData(quill.root.innerHTML, imgs);
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
    static convertImageBase64ToFile = (imgs, names) => {
        let imageFile;
        if (imgs && imgs.length !== 0) {
            imageFile = imgs.map((item, index) => {
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
                return new File([blob], names[index]);
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
                        ? <div id={`editor-container${id}`} style={{ height: height }}/>
                        : parse(quillValueDefault)
                }
            </React.Fragment>
        )
    }
}

const connectedQuillEditor = connect(null, null)(QuillEditor);
export { connectedQuillEditor as QuillEditor }