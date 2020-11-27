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
        const { edit = true, value } = this.props;

        if (edit) {
            Quill.register({
                'modules/imageDropAndPaste': QuillImageDropAndPaste,
                // 'modules/tableUI': QuillTableUI.default,
            }, true)
            const quill = new Quill('#editor-container', {
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
                scrollingContainer: true,
                placeholder: 'Start typing here...',
                theme: 'snow',
                value: value  
            });

            quill.on('text-change', (delta, oldDelta, source) => {
                console.log("change", quill.root.innerHTML, delta, oldDelta, source);
                const imgs = Array.from(
                    quill.container.querySelectorAll('img[src^="data:"]:not(.loading)')
                );
                
                this.props.getTextData(quill.root.innerHTML, imgs);
            });
        }
        
    }

    // Chuyển đổi dữ liệu ảnh base64 sang FIle để upload lên server
    static convertImageBase64ToFile = (imgs) => {
        let imageFile;
        if (imgs && imgs.length !== 0) {
            imageFile = imgs.map(item => {
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
                return new File([blob], "name");
            })
        }
        return imageFile;
    }

    render() {
        const { edit = true, value, height = 200 } = this.props;

        return (
            <React.Fragment>
                {
                    edit
                        ? <div id="editor-container" style={{ height: height }}/>
                        : parse(value)
                }
            </React.Fragment>
        )
    }
}

const connectedQuillEditor = connect(null, null)(QuillEditor);
export { connectedQuillEditor as QuillEditor }