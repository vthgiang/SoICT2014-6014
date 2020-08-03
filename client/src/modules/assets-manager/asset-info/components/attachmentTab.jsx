import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { LOCAL_SERVER_API } from '../../../../env';

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
                archivedRecordNumber: nextProps.archivedRecordNumber,
            }
        } else {
            return null;
        }
    }

    render() {
        const { id, translate } = this.props;
        const { files, archivedRecordNumber } = this.state;
        return (
            <div id={id} className="tab-pane">
                <div className="row box-body">
                    <div className="col-md-4">
                        <div className="form-group">
                            <strong>Nơi lưu trữ bản cứng:&emsp;</strong>
                            {archivedRecordNumber}
                        </div>
                    </div>
                    <div className="col-md-12">
                        <h4 className="row col-md-6">Danh sách tài liệu đính kèm:</h4>
                        <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }} >
                            <thead>
                                <tr>
                                    <th>Tên tài liệu</th>
                                    <th>Mô tả</th>
                                    <th>Số lượng</th>
                                    <th>File đính kèm</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(typeof files !== 'undefined' && files.length !== 0) &&
                                    files.map((x, index) => (
                                        <tr key={index}>
                                            <td>{x.name}</td>
                                            <td>{x.description}</td>
                                            <td>{x.number}</td>
                                            <td>{!x.urlFile ? translate('manage_employee.no_files') :
                                                <a className='intable'
                                                    href={LOCAL_SERVER_API + x.urlFile} target="_blank"
                                                    download={x.name}>
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

const tabAttachments = connect(null, null)(withTranslate(AttachmentTab));
export { tabAttachments as AttachmentTab };