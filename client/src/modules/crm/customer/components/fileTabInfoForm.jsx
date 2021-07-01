import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { AuthActions } from '../../../auth/redux/actions';

class FileTabInfoForm extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    requestDownloadFile = (e, path, fileName) => {
        e.preventDefault();
        this.props.downloadFile(path, fileName);
    }


    render() {
        const { files } = this.props;
        console.log('File', files);
        const { translate, id } = this.props;
        return (
            <React.Fragment>
                <div id={id} className="tab-pane">
                    <div className="row">


                        <div className="col-md-12">
                            <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }} >
                                <thead>
                                    <tr>
                                        <th>{translate('crm.customer.file.name')}</th>
                                        <th>{translate('crm.customer.file.description')}</th>
                                        <th>{translate('crm.customer.file.fileName')}</th>
                                        <th>Người đăng tải</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        files && files.length > 0 ? files.map((o, index) => (
                                            <tr className={`item-${index}`} key={index}>
                                                <td>{o.name}</td>
                                                <td>{o.description}</td>
                                                <a style={{ cursor: "pointer" }} style={{ marginTop: "2px" }} onClick={(e) => this.requestDownloadFile(e, o.url, o.fileName)}> {o.fileName}</a>
                                                <td>{o.creator.name}</td>
                                            </tr>
                                        )) : null
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    const { crm, auth, user } = state;
    return { crm, auth, user };
}

const mapDispatchToProps = {
    downloadFile: AuthActions.downloadFile,

}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(FileTabInfoForm));

