import React, { useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import "./index.css"
import FileViewer from "react-file-viewer";
const UserGuide = () => {

    const onError = e => {
        console.log(e, "error in file-viewer");
    };
    return (
        <React.Fragment>
            <div className="wrapper">
                {/* <FileViewer fileType={"pdf"} filePath={`https://arxiv.org/pdf/quant-ph/0410100.pdf`} onError={onError} /> */}
                <FileViewer fileType={"pdf"} filePath={`${process.env.REACT_APP_SERVER}/upload/user-guide/asset-guide.pdf`} onError={onError} />
            </div>
        </React.Fragment>
    );
};

export default connect(null, null)(withTranslate(UserGuide));
