import React, { useState, useEffect } from "react";
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import FilePreviewer from 'react-file-previewer';

import { DialogModal } from "../../../../common-components";
// import { AuthActions } from '../../../../auth/redux/actions';
import FileViewer from 'react-file-viewer';
import { AuthService } from "../../../auth/redux/services";
//import docx2html from 'docx2html';
function FilePreview(props) {
    const [blob,setBlock] = useState("")
    useEffect(() => {
        let { file } = props;
        AuthService.downloadFile(file)
        .then(res=>{
            // console.log(res.data);
            setBlock(res.data)
        })
        // props.FileData(file, 'filename', false);
    }, [props.file]);

    let encode = "";
    // let blob = props.auth.showFiles.length ? props.auth.showFiles[props.auth.showFiles.length-1].blob : "";
    if (blob) encode = URL.createObjectURL(blob);
    console.log(encode);
    console.log(blob);
    return (
        <React.Fragment>
            <DialogModal
                size={100}
                modalID={`modal-file-preview`}
                title='Preview'
                hasSaveButton={false}
                hasNote={false}
                hasCloseButton={false}

            >

                <div>
                    <div style={{ margin: "0px", padding: "0px", overflow: "hidden" }}>
                        <iframe src={encode} frameborder="0" style={{ overflow: "hidden", height: "85vh", width: "100%" }} height="100%" width="100%"></iframe>
                    </div>

                </div>
            </DialogModal>
        </React.Fragment >
    )

}


const mapStateToProps = state => state;

const mapDispatchToProps = {
    // FileData: AuthActions.downloadFile,
}



export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(FilePreview));