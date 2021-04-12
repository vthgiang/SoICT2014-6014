import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { AuthActions } from '../../../../auth/redux/actions';
import _isEqual from 'lodash/isEqual';
function AttachmentTab(props) {
    const [state, setState] = useState({})
    const [prevProps, setPrevProps] = useState({
        id: null,
        files: []
    })
    const requestDownloadFile = (e, path, fileName) => {
        e.preventDefault();
        props.downloadFile(path, fileName);
    }

    if( !_isEqual(prevProps.files, props.files)) {
        console.log("prevProps", props)
        setPrevProps(state =>{
            return{
                ...state,
                id: props.id,
                files: props.files,
                archivedRecordNumber: props.archivedRecordNumber,
            }
        })
        // setPrevProps(props)
    }
    

    
        const { id } = props;
        const { translate } = props;
        const { files, archivedRecordNumber } = prevProps;
        console.log('here')
        return (
            <div id={id} className="tab-pane">
                <div className="row box-body">
                    {/* Danh sách tài liệu đính kèm */}
                    <div className="col-md-12">
                        {/* Bảng tài liệu đính kèm */}
                        <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }} >
                            <thead>
                                <tr>
                                    <th>{translate('asset.general_information.file_name')}</th>
                                    <th>{translate('asset.general_information.description')}</th>
                                    <th>{translate('asset.general_information.attached_file')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(files && files.length !== 0) &&
                                    files.map((x, index) => {
                                        return <tr key={index}>
                                            <td>{x.name}</td>
                                            <td>{x.description}</td>
                                            <td>{!(x.files && x.files.length) ? translate('human_resource.profile.no_files') :
                                                <ul style={{ listStyle: 'none' }}>
                                                    {x.files.map((child, index) => {
                                                        return (
                                                            <React.Fragment key={index}>
                                                                <li>
                                                                    <a style={{ cursor: "pointer" }} onClick={(e) => requestDownloadFile(e, child.url, child.fileName)} >{child.fileName}</a>
                                                                </li>
                                                            </React.Fragment>
                                                        )
                                                    })}
                                                </ul>
                                            }</td>
                                        </tr>
                                    })
                                }
                            </tbody>
                        </table>
                        {
                            (!files || files.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                        }
                    </div>
                </div>
            </div>

        );
};

const actionCreators = {
    downloadFile: AuthActions.downloadFile,
};

const tabAttachments = connect(null, actionCreators)(withTranslate(AttachmentTab));

export { tabAttachments as AttachmentTab };