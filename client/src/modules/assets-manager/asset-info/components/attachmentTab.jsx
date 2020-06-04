import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

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
                file: nextProps.file,
                numberFile: nextProps.asset.numberFile,
            }
        } else {
            return null;
        }
    }

    render() {
        const { id, translate } = this.props;
        const { file, numberFile } = this.state;
        console.log('this.state', this.state);
        return (
            <div id={id} className="tab-pane">
                <div className=" row box-body">
                    <div className="col-md-4">
                        <div className="form-group">
                        <strong>Nơi lưu trữ bản cứng:&emsp;</strong>
                            {numberFile}
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
                                {(typeof file !== 'undefined' && file.length !== 0) &&
                                    file.map((x, index) => (
                                        <tr key={index}>
                                            <td>{x.nameFile}</td>
                                            <td>{x.discFile}</td>
                                            <td>{x.number}</td>
                                            <td>{(typeof x.urlFile === 'undefined' || x.urlFile.length === 0) ? translate('manage_employee.no_files') :
                                                <a href={x.urlFile} target="_blank"><u>{x.urlFile}</u></a>}</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                        {
                            (typeof file === 'undefined' || file.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                        }
                    </div>
                </div>
            </div>
        );
    }
};

const tabAttachments = connect(null, null)(withTranslate(AttachmentTab));
export { tabAttachments as AttachmentTab };
