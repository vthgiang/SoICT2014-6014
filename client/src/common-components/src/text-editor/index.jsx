import React from 'react';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import parse from 'html-react-parser';

const TextEditor = (props) => {
    const {edit} = props;
    
    if(edit)
        return (
            <CKEditor
                editor={ClassicEditor}
                onChange={props.onChange}
                data={props.data}
            />
        );
    else 
        return (
            <React.Fragment>
                {parse(props.data)}
            </React.Fragment>
        );
}

export default TextEditor;