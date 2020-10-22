import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ConfirmNotification } from '../../../../common-components';
import FileAddModal from './fileAddModal';

class FileTabCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listFiles: [],
        }
    }

    handleAddFile = (value) => {
        const { auth } = this.props;
        let { listFiles } = this.state;
        listFiles = [
            ...listFiles,
            {
                creator: auth.user._id,
                name: value.name,
                description: value.description,
                fileName: value.fileName,
                url: value.urlFile,
                fileUpload: value.fileUpload,
            }
        ]
        this.setState({
            listFiles,
        })
        this.props.callBackFromParentCreateForm('files', listFiles);
    }


    render() {
        const { translate } = this.props;
        const { id } = this.props;
        const { listFiles } = this.state;
        return (
            <React.Fragment>
                <div id={id} className="tab-pane">
                    <div className="row">
                        <div className="col-md-12">
                            <h4 className="row col-md-6 col-xs-8">{translate('crm.customer.list_attachments')}:</h4>
                            <FileAddModal callBackFromParentCreateForm={this.handleAddFile} />
                            <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }} >
                                <thead>
                                    <tr>
                                        <th>{translate('crm.customer.file.name')}</th>
                                        <th>{translate('crm.customer.file.description')}</th>
                                        <th>{translate('crm.customer.file.attachment')}</th>
                                        <th style={{ width: '120px' }}>{translate('general.action')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        listFiles && listFiles.length > 0 ? listFiles.map((o, index) => (
                                            <tr className={`item-${index}`} key={index}>
                                                <td>{o.name}</td>
                                                <td>{o.description}</td>
                                                <td><a href={`${o.url}`} target="_blank">{o.fileName}</a></td>
                                                <td style={{ textAlign: 'center' }}>
                                                    <a className="text-yellow" onClick={() => this.handleEdit(o, index)}><i className="material-icons">edit</i></a>
                                                    <ConfirmNotification
                                                        icon="question"
                                                        title="Xóa tài liệu đính kèm"
                                                        content="<h3>Xóa tài liệu đính kèm</h3>"
                                                        name="delete"
                                                        className="text-red"
                                                        func={() => this.props.deleteFile(index)}
                                                    />
                                                </td>
                                            </tr>
                                        )) : null
                                    }
                                </tbody>
                            </table>
                            {listFiles && listFiles.length === 0 && <div className="table-info-panel">{translate('confirm.no_data')}</div>}
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    const { crm, auth } = state;
    return { crm, auth };
}

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(FileTabCreateForm));