import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

class TabAttachmentsViewContent extends Component {
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
                numberFile: nextProps.employee.numberFile,
            }
        } else {
            return null;
        }
    }

    render() {
        const { id, translate } = this.props;
        const { file, numberFile } = this.state;
        return (
            <div id={id} className="tab-pane">
                <div className="row box-body">
                    <div className="col-md-4">
                        <div className="form-group">
                            <strong>{translate('manage_employee.attachments_code')}&emsp;</strong>
                            {numberFile}
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
                                {(typeof file !== 'undefined' && file.length !== 0) &&
                                    file.map((x, index) => (
                                        <tr key={index}>
                                            <td>{x.nameFile}</td>
                                            <td>{x.discFile}</td>
                                            <td>{x.number}</td>
                                            <td>{translate(`manage_employee.${x.status}`)}</td>
                                            <td>{(typeof x.file === 'undefined' || x.file.length === 0) ? translate('manage_employee.no_files') :
                                                <a href={x.urlFile} target="_blank"><u>{x.file}</u></a>}</td>
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

const tabAttachments = connect(null, null)(withTranslate(TabAttachmentsViewContent));
export { tabAttachments as TabAttachmentsViewContent };