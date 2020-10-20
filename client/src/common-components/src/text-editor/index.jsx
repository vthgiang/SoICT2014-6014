import React from 'react';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const TextEditor = (props) => {

    return (
        <CKEditor
            editor={ClassicEditor}
            onChange={props.onChange}
            data={props.data}
        />
    );
}

export default TextEditor;