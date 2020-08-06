import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { AuthActions } from '../../../../auth/redux/actions';
class AttachmentTab extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                files: nextProps.files,
                archivedRecordNumber: nextProps.employee.archivedRecordNumber,
            }
        } else {
            return null;
        }
    }

    requestDownloadFile = (e, path, fileName) => {
        e.preventDefault()
        this.props.downloadFile(path, fileName)
    }

    render() {
        const { id, translate } = this.props;
        const { files, archivedRecordNumber } = this.state;
        return (
            <div id={id} className="tab-pane">
                <div className="row box-body">
                    <div className="col-md-4">
                        <div className="form-group">
                            <strong>{translate('manage_employee.attachments_code')}&emsp;</strong>
                            {archivedRecordNumber}
                        </div>
                    </div>
                    <div className="col-md-12">
                        <h4 className="row col-md-6">{translate('manage_employee.list_attachments')}:</h4>
                        <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }} >
                            <thead>
                                <tr>
                                    <th>{translate('manage_employee.file_name')}</th>
                                    <th>{translate('table.description')}</th>
                                    <th>{translate('manage_employee.number')}</th>
                                    <th>{translate('table.status')}</th>
                                    <th>{translate('manage_employee.attached_files')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(typeof files !== 'undefined' && files.length !== 0) &&
                                    files.map((x, index) => (
                                        <tr key={index}>
                                            <td>{x.name}</td>
                                            <td>{x.description}</td>
                                            <td>{x.number}</td>
                                            <td>{translate(`manage_employee.${x.status}`)}</td>
                                            <td>{!x.urlFile ? translate('manage_employee.no_files') :
                                                <a className='intable'
                                                    style={{ cursor: "pointer" }}
                                                    onClick={(e) => this.requestDownloadFile(e, `.${x.urlFile}`, x.name)}>
                                                    <i className="fa fa-download"> &nbsp;Download!</i>
                                                </a>
                                            }</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                        {
                            (typeof files === 'undefined' || files.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                        }
                    </div>
                </div>
            </div>

        );
    }
};

const actionCreators = {
    downloadFile: AuthActions.downloadFile,
};

const tabAttachments = connect(null, actionCreators)(withTranslate(AttachmentTab));
export { tabAttachments as AttachmentTab };