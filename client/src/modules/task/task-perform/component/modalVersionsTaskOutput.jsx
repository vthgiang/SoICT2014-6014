import React, { Component, useState, useEffect } from 'react';
import { ApiImage, ContentMaker, DateTimeConverter, DialogModal } from '../../../../common-components';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import parse from 'html-react-parser';
import { checkIfHasCommonItems } from '../../task-management/component/functionHelpers';

const formatStatusInfo = (value) => {
    switch (value) {
        case "rejected":
            return (
                <div style={{ color: "rgba(239, 68, 68)", backgroundColor: "rgba(254, 202, 202)", padding: "1px 5px", borderRadius: "4px" }}>
                    Bị từ chối
                </div>
            );
        case "approved":
            return (
                <div style={{ color: "rgba(16, 185, 129)", backgroundColor: "rgba(167, 243, 208)", padding: "1px 5px", borderRadius: "4px" }}>
                    Đã phê duyệt
                </div>
            );
        default:
            return "";
            break;
    }
}

const isImage = (src) => {
    let string = src.toLowerCase().split(".");
    let image = ['jpg', 'jpeg', 'png', 'tiff', 'gif']
    if (image.indexOf(string[string.length - 1]) !== -1) {
        return true;
    } else {
        return false;
    }
}


const formatActionAccountable = (value) => {
    switch (value) {
        case "approve":
            return "Đồng ý"
        case "reject":
            return "Từ chối"
        default:
            return "Chưa phê duyệt"
            break;
    }
}


const getAcoutableEmployees = (data) => {
    const accountableEmployees = data && data.filter(item => item.action === "approve");
    if (accountableEmployees) {
        let users = "";
        accountableEmployees.map((item, index) => {
            if (index !== accountableEmployees.length - 1) {
                users = users + `${item.accountableEmployee.name}, `
            } else {
                users = users + `${item.accountableEmployee.name}`
            }
            return item;
        })
        return users;
    }
    return "Chưa có ai phê duyệt";
}

const checkTypeFile = (data) => {
    if (typeof data === 'string' || data instanceof String) {
        let index = data.lastIndexOf(".");
        let typeFile = data.substring(index + 1, data.length);
        if (typeFile === "pdf") {
            return true;
        }
        else return false;
    }
    else return false;
}

function ModalVersionsTaskOutput(props) {
    const { taskOutput } = props;
    const [state, setState] = useState({ currentFilepri: null, version: null })

    const showFilePreview = (data) => {
        setState({
            ...state,
            currentFilepri: data,
        });
        window.$('#modal-file-preview').modal('show');
    }

    const handleChangeContent = async (item) => {
        await setState({
            ...state,
            version: item,
            content: item._id
        })
    };

    const requestDownloadFile = (e, path, fileName) => {
        e.preventDefault();
        props.downloadFile(path, fileName);
    }

    const { version } = state;

    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-versions-task-output-${taskOutput?._id}`}
                title={`Các phiên bản thay đổi của ${taskOutput?.title}`}
                formID={`detail-output`}
                size={75}
                maxWidth={600}
                hasSaveButton={false}
                hasNote={false}
            >
                <div className="col-xs-12 col-sm-4">
                    <div className="box box-solid" style={{ border: "1px solid #ecf0f6", borderBottom: "none" }}>
                        <div className="box-header with-border">
                            <h3 className="box-title" style={{ fontWeight: 800 }}>Các phiên bản chỉnh sửa</h3>
                        </div>
                        <div id={taskOutput?._id} className="box-body no-padding">
                            <ul className="nav nav-pills nav-stacked">
                                {
                                    taskOutput?.versions?.map((item, index) =>
                                        <li key={index} className={state.content === item._id ? "active" : undefined}>
                                            <a href="#abc" onClick={() => handleChangeContent(item)}>
                                                Lần {index + 1} (<DateTimeConverter dateTime={item.createdAt} />)
                                            </a>
                                        </li>
                                    )
                                }
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="col-xs-12 col-sm-8">
                    <h4>Kết quả giao nộp lần 1</h4>
                    <div>
                        <strong>Mô tả:</strong>
                        <div>
                            {version?.description?.split('\n')?.map((elem, idx) => (
                                <div key={idx}>
                                    {parse(elem)}
                                </div>
                            ))
                            }
                        </div>
                    </div>
                    <div style={{ cursor: "pointer" }}>
                        <div>Tập tin đính kèm:</div>
                        <ul>
                            {version?.files.map((elem, index) => {
                                let listImage = version.files?.map((elem) => isImage(elem.name) ? elem.url : -1).filter(url => url !== -1);
                                return <li key={index}>
                                    {isImage(elem.name) ?
                                        <ApiImage
                                            listImage={listImage}
                                            className="attachment-img files-attach"
                                            style={{ marginTop: "5px" }}
                                            src={elem.url}
                                            file={elem}
                                            requestDownloadFile={requestDownloadFile}
                                        />
                                        :
                                        <div>
                                            <a style={{ marginTop: "2px" }} onClick={(e) => requestDownloadFile(e, elem.url, elem.name)}> {elem.name}</a>
                                            &nbsp;&nbsp;&nbsp;
                                            <a href="#" onClick={() => showFilePreview(elem && elem.url)}>
                                                <u>{elem && checkTypeFile(elem.url) ?
                                                    <i className="fa fa-eye fa-1"></i> : ""}</u>
                                            </a>
                                        </div>
                                    }
                                </li>
                            })}
                        </ul>
                    </div>
                    {version?.accountableEmployees.map((item, idx) => {
                        return (
                            <div key={idx}>
                                <b> {item.accountableEmployee?.name} </b>
                                <span style={{ fontSize: 10, marginRight: 10 }} className="text-green">[ Người phê duyệt ]</span>
                                {formatActionAccountable(item.action)}
                                &ensp;
                            </div >
                        )
                    })}
                </div>
            </DialogModal >
        </React.Fragment >
    );
}

function mapState(state) {
    const { performtasks, tasks, auth } = state;
    return { performtasks, tasks, auth };
}

const actionCreators = {
};

const connectedTaskOutputs = connect(mapState, actionCreators)(withTranslate(ModalVersionsTaskOutput));

export { connectedTaskOutputs as ModalVersionsTaskOutput };
