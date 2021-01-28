import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import "./index.css"
import { UserGuideSystem, UserGuideKpi, UserGuideTask, UserGuideAsset, UserGuideDocument, UserGuideHr } from './config.js'
import FileViewer from "react-file-viewer";
import qs from 'qs';
import { AuthActions } from '../../auth/redux/actions';

const DetailUserGuide = (props) => {
    const [state, setState] = useState({})
    useEffect(() => {
        const { name, id, type, fileName } = qs.parse(props.location.search, { ignoreQueryPrefix: true });
        setState({
            ...state,
            name,
            id,
            type,
            fileName,
        })
    }, [])

    let url = "", pageName = "";
    if (state && state.name && state.type && state.id && state.fileName) {
        let _id = parseInt(state.id) - 1;
        switch (state.name) {
            case "KPI":
                if (state.type === "user") {
                    url = UserGuideKpi.user[_id].url;
                    pageName = UserGuideKpi.user[_id].pageName;
                }

                if (state.type === "manager") {
                    url = UserGuideKpi.manager[_id].url;
                    pageName = UserGuideKpi.manager[_id].pageName;
                }
                break;

            case "System":
                url = UserGuideSystem[_id].url;
                pageName = UserGuideSystem[_id].pageName;
                break;

            case "task":
                if (state.type === "user") {
                    url = UserGuideTask.user[_id].url;
                    pageName = UserGuideTask.user[_id].pageName;
                }
                if (state.type === "manager") {
                    url = UserGuideTask.manager[_id].url;
                    pageName = UserGuideTask.manager[_id].pageName;
                }
                break;

            case "hr":
                if (state.type === "manager") {
                    url = UserGuideHr.manager[_id].url;
                    pageName = UserGuideHr.manager[_id].pageName;
                }
                break;

            case "asset":
                if (state.type === "manager") {
                    url = UserGuideAsset.manager[_id].url;
                    pageName = UserGuideAsset.manager[_id].pageName;
                }
                if (state.type === "user") {
                    url = UserGuideAsset.user[_id].url;
                    pageName = UserGuideAsset.user[_id].pageName;
                }
                break;

            case "document":
                if (state.type === "manager") {
                    url = UserGuideDocument.manager[_id].url;
                    pageName = UserGuideDocument.manager[_id].pageName;
                }
                if (state.type === "user") {
                    url = UserGuideDocument.user[_id].url;
                    pageName = UserGuideDocument.user[_id].pageName;
                }
                break;
            default:
                break;
        }
    }

    const downloadUserGuide = (url, fileName) => {
        props.downloadFile(url, fileName);
    }

    const onError = e => {
        console.log(e, "error in file-viewer");
    };

    return (
        <div className="box">
            <div className="box-header with-border">
                <div class="box-title" style={{ marginTop: '7px', fontWeight: 600 }}>{pageName}</div>
                <button className="btn btn-success pull-right" onClick={() => downloadUserGuide(`.${url}`, state.fileName)}>
                    Tải xuống
                </button>
            </div>
            <div className="box-body qlcv">
                {
                    url &&
                    <FileViewer fileType={'pdf'} filePath={`${process.env.REACT_APP_SERVER + url}`} onError={onError} />
                }
            </div>
        </div>
    );
};

const mapDispatchToProps = {
    downloadFile: AuthActions.downloadFile,
}
export default connect(null, mapDispatchToProps)(withTranslate(DetailUserGuide));