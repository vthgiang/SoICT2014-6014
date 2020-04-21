import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import {
    ModalAddCertificate, ModalAddCertificateShort,
    ModalEditCertificate, ModalEditCertificateShort,
} from './combinedContent';

class TabCertificateContent extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    // Bắt sự kiện click edit bằng cấp
    handleEdit = async (value, index) => {
        await this.setState(state => {
            return {
                ...state,
                currentRow: { ...value, index: index }
            }
        });
        window.$(`#modal-edit-certificate-editCertificate${index}`).modal('show');
    }
    // Bắt sự kiện click edit chứng chỉ
    handleEditShort = async (value, index) => {
        await this.setState(state => {
            return {
                ...state,
                currentRowShort: { ...value, index: index }
            }
        });
        window.$(`#modal-edit-certificateShort-editCertificateShort${index}`).modal('show');
    }

    // Function thêm thông tin bằng cấp
    handleAddCertificate = async (data) => {
        let { certificate } = this.state;
        await this.setState({
            certificate: [...certificate, {
                ...data
            }]
        })
        this.props.handleAddCertificate(this.state.certificate)

    }
    // Function chỉnh sửa thông tin bằng cấp
    handleEditCertificate = async (data) => {
        const { certificate } = this.state;
        certificate[data.index] = data;
        await this.setState({
            certificate: certificate
        })
        this.props.handleEditCertificate(this.state.certificate)
    }

    // Function thêm thông tin chứng chỉ
    handleAddCertificateShort = async (data) => {
        let { certificateShort } = this.state;
        await this.setState({
            certificateShort: [...certificateShort, {
                ...data
            }]
        })
        this.props.handleAddCertificateShort(this.state.certificateShort)
    }
    // Function chỉnh sửa thông tin chứng chỉ
    handleEditCertificateShort = async (data) => {
        const { certificateShort } = this.state;
        certificateShort[data.index] = data;
        await this.setState({
            certificateShort: certificateShort
        })
        this.props.handleEditCertificateShort(this.state.certificateShort)
    }
    // Function xoá bằng cấp
    delete = async (index) => {
        var { certificate } = this.state;
        certificate.splice(index, 1);
        await this.setState({
            ...this.state,
            certificate: [...certificate]
        })
        this.props.handleDeleteCertificate(this.state.certificate)
    }
    // Function xoá chứng chỉ
    deleteShort = async (index) => {
        var { certificateShort } = this.state;
        certificateShort.splice(index, 1);
        await this.setState({
            ...this.state,
            certificateShort: [...certificateShort]
        })
        this.props.handleDeleteCertificateShort(this.state.certificateShort)
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                certificate: nextProps.certificate,
                certificateShort: nextProps.certificateShort,
            }
        } else {
            return null;
        }
    }
    render() {
        const { id, translate } = this.props;
        const { certificate, certificateShort } = this.state;
        return (
            <div id={id} className="tab-pane">
                <div className="box-body">
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border"><h4 className="box-title">{translate('manage_employee.diploma')}</h4></legend>
                        <ModalAddCertificate handleChange={this.handleAddCertificate} id={`addCertificate${id}`} />
                        <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }}>
                            <thead>
                                <tr>
                                    <th>{translate('manage_employee.name_diploma')}</th>
                                    <th>{translate('manage_employee.diploma_issued_by')}</th>
                                    <th>{translate('manage_employee.graduation_year')}</th>
                                    <th>{translate('manage_employee.ranking_learning')}</th>
                                    <th>{translate('manage_employee.attached_files')}</th>
                                    <th style={{ width: '120px' }}>{translate('table.action')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(typeof certificate !== 'undefined' && certificate.length !== 0) &&
                                    certificate.map((x, index) => (
                                        <tr key={index}>
                                            <td>{x.nameCertificate}</td>
                                            <td>{x.addressCertificate}</td>
                                            <td>{x.yearCertificate}</td>
                                            <td>{translate(`manage_employee.${x.typeCertificate}`)}</td>
                                            <td>{(typeof x.file === 'undefined' || x.file.length === 0) ? translate('manage_employee.no_files') :
                                                <a href={x.urlFile} target="_blank"><u>{x.file}</u></a>}
                                            </td>
                                            <td>
                                                <a onClick={() => this.handleEdit(x, index)} className="edit text-yellow" style={{ width: '5px' }} title={translate('manage_employee.edit_diploma')}><i className="material-icons">edit</i></a>
                                                <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.delete(index)}><i className="material-icons"></i></a>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                        {
                            (typeof certificate === 'undefined' || certificate.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                        }
                    </fieldset>
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border"><h4 className="box-title">{translate('manage_employee.certificate')}</h4></legend>
                        <ModalAddCertificateShort handleChange={this.handleAddCertificateShort} id={`addCertificateShort${id}`} />
                        <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }} >
                            <thead>
                                <tr>
                                    <th>{translate('manage_employee.name_certificate')}</th>
                                    <th>{translate('manage_employee.issued_by')}</th>
                                    <th>{translate('manage_employee.date_issued')}</th>
                                    <th>{translate('manage_employee.end_date_certificate')}</th>
                                    <th>{translate('manage_employee.attached_files')}</th>
                                    <th style={{ width: '120px' }}>{translate('table.action')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(typeof certificateShort !== 'undefined' && certificateShort.length !== 0) &&
                                    certificateShort.map((x, index) => (
                                        <tr key={index}>
                                            <td>{x.nameCertificateShort}</td>
                                            <td>{x.unit}</td>
                                            <td>{x.startDate}</td>
                                            <td>{x.endDate}</td>
                                            <td>{(typeof x.file === 'undefined' || x.file.length === 0) ? translate('manage_employee.no_files') :
                                                <a href={x.urlFile} target="_blank"><u>{x.file}</u></a>}</td>
                                            <td>
                                                <a onClick={() => this.handleEditShort(x, index)} className="edit text-yellow" style={{ width: '5px' }} title={translate('manage_employee.edit_certificate')}><i className="material-icons">edit</i></a>
                                                <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.deleteShort(index)}><i className="material-icons"></i></a>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                        {
                            (typeof certificateShort === 'undefined' || this.state.certificateShort.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                        }
                    </fieldset>
                </div>
                {
                    this.state.currentRow !== undefined &&
                    <ModalEditCertificate
                        id={`editCertificate${this.state.currentRow.index}`}
                        index={this.state.currentRow.index}
                        nameCertificate={this.state.currentRow.nameCertificate}
                        addressCertificate={this.state.currentRow.addressCertificate}
                        yearCertificate={this.state.currentRow.yearCertificate}
                        typeCertificate={this.state.currentRow.typeCertificate}
                        file={this.state.currentRow.file}
                        urlFile={this.state.currentRow.urlFile}
                        fileUpload={this.state.currentRow.fileUpload}
                        handleChange={this.handleEditCertificate}
                    />
                }
                {
                    this.state.currentRowShort !== undefined &&
                    <ModalEditCertificateShort
                        id={`editCertificateShort${this.state.currentRowShort.index}`}
                        index={this.state.currentRowShort.index}
                        nameCertificateShort={this.state.currentRowShort.nameCertificateShort}
                        unit={this.state.currentRowShort.unit}
                        startDate={this.state.currentRowShort.startDate}
                        endDate={this.state.currentRowShort.endDate}
                        file={this.state.currentRowShort.file}
                        urlFile={this.state.currentRowShort.urlFile}
                        fileUpload={this.state.currentRowShort.fileUpload}
                        handleChange={this.handleEditCertificateShort}
                    />
                }
            </div>
        );
    }
};
const tabCertificate = connect(null, null)(withTranslate(TabCertificateContent));
export { tabCertificate as TabCertificateContent };