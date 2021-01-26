import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import "./index.css"
import { UserGuideSystem, UserGuideKpi, UserGuideTask } from './config.js'
import FileViewer from "react-file-viewer";
import qs from 'qs';

const DetailUserGuide = (props) => {
    const [state, setState] = useState({})
    useEffect(() => {
        const { name, id, type, fileType } = qs.parse(props.location.search, { ignoreQueryPrefix: true });
        setState({
            ...state,
            name,
            id,
            type,
            fileType,
        })
    }, [])

    let url = "";
    if (state && state.name && state.type && state.id && state.fileType) {
        switch (state.name) {
            case "KPI":
                if (state.type === "user") {
                    url = UserGuideKpi.user[state.id - 1].url;
                }

                if (state.type === "manager") {
                    url = UserGuideKpi.manager[state.id - 1].url;
                }

            case "System":
                url = UserGuideSystem[state.id - 1].url;
                break;

            case "task":
                if (state.type === "user") {
                    url = UserGuideTask.user[state.id - 1].url
                }
                if (state.type === "manager") {
                    url = UserGuideTask.manager[state.id - 1].url
                }

            default:
                break;
        }
    }
    const onError = e => {
        console.log(e, "error in file-viewer");
    };


    return (
        <div className="box">
            <div className="box-body qlcv">
                {
                    url &&
                    <FileViewer fileType={state.fileType} filePath={`${process.env.REACT_APP_SERVER + url}`} onError={onError} />
                }
            </div>
        </div>
    );
};


export default connect(null, null)(withTranslate(DetailUserGuide));