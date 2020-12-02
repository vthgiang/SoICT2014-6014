import React, { Component } from 'react';
import { connect } from 'react-redux';

import parse from 'html-react-parser';
import Quill from 'quill';
import QuillImageDropAndPaste from 'quill-image-drop-and-paste';
import * as QuillTableUI from 'quill-table-ui';
import QuillTable from 'quill-table';

class QuillEditor extends Component {
    constructor(props) {
        super(props);

        this.state = {
        }

    }

    componentDidMount() {
        const { id, edit = true, value } = this.props;

        if (edit) {
            // Thêm các module tiện ích
            Quill.register({
                'modules/imageDropAndPaste': QuillImageDropAndPaste,
                // 'modules/tableUI': QuillTableUI.default,
            }, true)

            // Khởi tạo Quill Editor trong thẻ có id='editor-container'
            const quill = new Quill(`#editor-container${id}`, {
                modules: {
                    toolbar: [
                        [{ 'font': [] }],
                        [{ header: [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        [{ 'align': [] }],
                        ['image', 'code-block', 'list']
                    ],
                    imageDropAndPaste: true,
                    // table: true,
                    // tableUI: true,
                },
                placeholder: 'Start typing here...',
                theme: 'snow'
            });

            // Insert value ban đầu
            if (value) {
                if (quill && quill.container && quill.container.firstChild) {
                    quill.container.firstChild.innerHTML = value;
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
        const { id, edit = true, value, height = 200 } = this.props;

        return (
            <React.Fragment>
                {
                    edit
                        ? <div id={`editor-container${id}`} style={{ height: height }}/>
                        : parse(value)
                }
            </React.Fragment>
        )
    }
}

const connectedQuillEditor = connect(null, null)(QuillEditor);
export { connectedQuillEditor as QuillEditor }