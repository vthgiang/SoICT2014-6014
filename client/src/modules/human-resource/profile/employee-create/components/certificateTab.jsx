import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import {
    DegreeAddModal, CertificateAddModal,
    DegreeEditModal, CertificateEditModal,
} from './combinedContent';

class CertificateTab extends Component {
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
                currentRowcertificates: { ...value, index: index }
            }
        });
        window.$(`#modal-edit-certificateShort-editCertificateShort${index}`).modal('show');
    }

    // Function thêm thông tin bằng cấp
    handleAddDegree = async (data) => {
        let { degrees } = this.state;
        await this.setState({
            degrees: [...degrees, {
                ...data
            }]
        })
        this.props.handleAddDegree(this.state.degrees, data)

    }
    // Function chỉnh sửa thông tin bằng cấp
    handleEditDegree = async (data) => {
        const { degrees } = this.state;
        degrees[data.index] = data;
        await this.setState({
            degrees: degrees
        })
        this.props.handleEditDegree(this.state.degrees, data)
    }

    // Function thêm thông tin chứng chỉ
    handleAddCertificate = async (data) => {
        let { certificates } = this.state;
        await this.setState({
            certificates: [...certificates, {
                ...data
            }]
        })
        this.props.handleAddCertificate(this.state.certificates, data)
    }
    // Function chỉnh sửa thông tin chứng chỉ
    handleEditCertificate = async (data) => {
        const { certificates } = this.state;
        certificates[data.index] = data;
        await this.setState({
            certificates: certificates
        })
        this.props.handleEditCertificate(this.state.certificates, data)
    }
    // Function xoá bằng cấp
    handleDeleteDegree = async (index) => {
        var { degrees } = this.state;
        var data = degrees[index];
        degrees.splice(index, 1);
        await this.setState({
            ...this.state,
            degrees: [...degrees]
        })
        this.props.handleDeleteDegree(this.state.degrees, data)
    }
    // Function xoá chứng chỉ
    handleDeleteCertificate = async (index) => {
        var { certificates } = this.state;
        var data = certificates[index];
        certificates.splice(index, 1);
        await this.setState({
            ...this.state,
            certificates: [...certificates]
        })
        this.props.handleDeleteCertificate(this.state.certificates, data)
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                degrees: nextProps.degrees,
                certificates: nextProps.certificates,
            }
        } else {
            return null;
        }
    }
    render() {
        const { id, translate } = this.props;
        const { degrees, certificates } = this.state;
        return (
            <div id={id} className="tab-pane">
                <div className="box-body">
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border"><h4 className="box-title">{translate('manage_employee.diploma')}</h4></legend>
                        <DegreeAddModal handleChange={this.handleAddDegree} id={`addCertificate${id}`} />
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
                                {(typeof degrees !== 'undefined' && degrees.length !== 0) &&
                                    degrees.map((x, index) => (
                                        <tr key={index}>
                                            <td>{x.name}</td>
                                            <td>{x.issuedBy}</td>
                                            <td>{x.year}</td>
                                            <td>{translate(`manage_employee.${x.degreeType}`)}</td>
                                            <td>{(typeof x.file === 'undefined' || x.file.length === 0) ? translate('manage_employee.no_files') :
                                                <a href={x.urlFile} target="_blank"><u>{x.file}</u></a>}
                                            </td>
                                            <td>
                                                <a onClick={() => this.handleEdit(x, index)} className="edit text-yellow" style={{ width: '5px' }} title={translate('manage_employee.edit_diploma')}><i className="material-icons">edit</i></a>
                                                <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.handleDeleteDegree(index)}><i className="material-icons"></i></a>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                        {
                            (typeof degrees === 'undefined' || degrees.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                        }
                    </fieldset>
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border"><h4 className="box-title">{translate('manage_employee.certificate')}</h4></legend>
                        <CertificateAddModal handleChange={this.handleAddCertificate} id={`addCertificateShort${id}`} />
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
                                {(typeof certificates !== 'undefined' && certificates.length !== 0) &&
                                    certificates.map((x, index) => (
                                        <tr key={index}>
                                            <td>{x.name}</td>
                                            <td>{x.issuedBy}</td>
                                            <td>{x.startDate}</td>
                                            <td>{x.endDate}</td>
                                            <td>{(typeof x.file === 'undefined' || x.file.length === 0) ? translate('manage_employee.no_files') :
                                                <a href={x.urlFile} target="_blank"><u>{x.file}</u></a>}</td>
                                            <td>
                                                <a onClick={() => this.handleEditShort(x, index)} className="edit text-yellow" style={{ width: '5px' }} title={translate('manage_employee.edit_certificate')}><i className="material-icons">edit</i></a>
                                                <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.handleDeleteCertificate(index)}><i className="material-icons"></i></a>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                        {
                            (typeof certificates === 'undefined' || certificates.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                        }
                    </fieldset>
                </div>
                {
                    this.state.currentRow !== undefined &&
                    <DegreeEditModal
                        id={`editCertificate${this.state.currentRow.index}`}
                        index={this.state.currentRow.index}
                        name={this.state.currentRow.name}
                        issuedBy={this.state.currentRow.issuedBy}
                        year={this.state.currentRow.year}
                        degreeType={this.state.currentRow.degreeType}
                        file={this.state.currentRow.file}
                        urlFile={this.state.currentRow.urlFile}
                        fileUpload={this.state.currentRow.fileUpload}
                        handleChange={this.handleEditDegree}
                    />
                }
                {
                    this.state.currentRowcertificates !== undefined &&
                    <CertificateEditModal
                        id={`editCertificateShort${this.state.currentRowcertificates.index}`}
                        index={this.state.currentRowcertificates.index}
                        name={this.state.currentRowcertificates.name}
                        issuedBy={this.state.currentRowcertificates.issuedBy}
                        startDate={this.state.currentRowcertificates.startDate}
                        endDate={this.state.currentRowcertificates.endDate}
                        file={this.state.currentRowcertificates.file}
                        urlFile={this.state.currentRowcertificates.urlFile}
                        fileUpload={this.state.currentRowcertificates.fileUpload}
                        handleChange={this.handleEditCertificate}
                    />
                }
            </div>
        );
    }
};
const certificateTab = connect(null, null)(withTranslate(CertificateTab));
export { certificateTab as CertificateTab };