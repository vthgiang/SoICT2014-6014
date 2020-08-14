import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { FileAddModal, FileEditModal } from './combinedContent';

import { AuthActions } from '../../../../auth/redux/actions';
class FileTab extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    // Bắt sự kiện click edit khen thưởng
    handleEdit = async (value, index) => {
        await this.setState(state => {
            return {
                ...state,
                currentRow: { ...value, index: index }
            }
        });
        window.$(`#modal-edit-file-editFile${index}`).modal('show');
    }
    // Function lưu các trường thông tin vào state
    handleChange = (e) => {
        const { name, value } = e.target;
        this.props.handleChange(name, value);
    }
    // Function thêm tài liệu đính kèm mặc định
    defaulteClick = async (e) => {
        var { translate } = this.props;
        e.preventDefault();
        const defaulteFile = [
            { name: translate('manage_employee.diploma'), description: translate('manage_employee.disc_diploma'), number: "1", status: "submitted", file: "", urlFile: "", fileUpload: "" },
            { name: translate('manage_employee.curriculum_vitae'), description: translate('manage_employee.disc_curriculum_vitae'), number: "1", status: "submitted", file: "", urlFile: "", fileUpload: "" },
            { name: translate('manage_employee.img'), description: translate('manage_employee.disc_img'), number: "3", status: "submitted", file: "", urlFile: "", fileUpload: "" },
            { name: translate('manage_employee.copy_id_card'), description: translate('manage_employee.disc_copy_id_card'), number: "1", status: "submitted", file: "", urlFile: "", fileUpload: "" },
            { name: translate('manage_employee.health_certificate'), description: translate('manage_employee.disc_health_certificate'), number: "1", status: "submitted", file: "", urlFile: "", fileUpload: "" },
            { name: translate('manage_employee.birth_certificate'), description: translate('manage_employee.disc_birth_certificate'), number: "1", status: "submitted", file: "", urlFile: "", fileUpload: "" },
            { name: translate('manage_employee.job_application'), description: translate('manage_employee.disc_job_application'), number: "1", status: "submitted", file: "", urlFile: "", fileUpload: "" },
            { name: translate('manage_employee.commitment'), description: translate('manage_employee.disc_commitment'), number: "1", status: "submitted", file: "", urlFile: "", fileUpload: "" },
            { name: translate('manage_employee.temporary_residence_card'), description: translate('manage_employee.disc_temporary_residence_card'), number: "1", status: "submitted", file: "", urlFile: "", fileUpload: "" }
        ]
        await this.setState({
            files: [...this.state.files, ...defaulteFile]
        })
        this.props.handleAddFile(this.state.files)
    }

    // Function thêm thông tin tài liệu đính kèm
    handleAddFile = async (data) => {
        const { files } = this.state;
        await this.setState({
            files: [...files, {
                ...data
            }]
        })
        this.props.handleAddFile(this.state.files, data)

    }
    // Function chỉnh sửa thông tin tài liệu đính kèm
    handleEditFile = async (data) => {
        const { files } = this.state;
        files[data.index] = data;
        await this.setState({
            files: files
        })
        this.props.handleEditFile(this.state.files, data)
    }
    // Function xoá kinh nghiệm làm việc
    handleDeleteFile = async (index) => {
        var { files } = this.state;
        var data = files[index];
        files.splice(index, 1);
        await this.setState({
            ...this.state,
            files: [...files]
        })
        this.props.handleDeleteFile(this.state.files, data)
    }

    // So sánh 2 đồi tượng
    static isEqual(objA, objB) {
        // Tạo các mảng chứa tên các property
        let aProps = Object.getOwnPropertyNames(objA);
        let bProps = Object.getOwnPropertyNames(objB);

        if (aProps.length != bProps.length) {
            return false;
        }
        for (let i = 0; i < aProps.length; i++) {
            let propName = aProps[i];
            if (objA[propName] !== objB[propName]) {
                return false;
            }
        }

        return true;
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id || !FileTab.isEqual(nextProps.employee, prevState.employee)) {
            return {
                ...prevState,
                id: nextProps.id,
                files: nextProps.files,
                archivedRecordNumber: nextProps.employee.archivedRecordNumber,
                employee: nextProps.employee,
            }
        } else {
            return null;
        }
    }

    // Function kiểm tra các trường bắt buộc phải nhập
    validatorInput = (value) => {
        if (value !== undefined && value.toString().trim() !== '') {
            return true;
        }
        return false;
    }

    isFormValidated = () => {
        const { employee } = this.state;
        let result = this.validatorInput(employee.employeeNumber) && this.validatorInput(employee.employeeTimesheetId) &&
            this.validatorInput(employee.fullName) && this.validatorInput(employee.birthdate) &&
            this.validatorInput(employee.emailInCompany) && this.validatorInput(employee.identityCardNumber) &&
            this.validatorInput(employee.identityCardDate) && this.validatorInput(employee.identityCardAddress) &&
            this.validatorInput(employee.phoneNumber) && this.validatorInput(employee.temporaryResidence) &&
            this.validatorInput(employee.taxRepresentative) && this.validatorInput(employee.taxNumber) &&
            this.validatorInput(employee.taxDateOfIssue) && this.validatorInput(employee.taxAuthority);
        if (employee.healthInsuranceStartDate && employee.healthInsuranceEndDate) {
            if (new Date(employee.healthInsuranceEndDate).getTime() < new Date(employee.healthInsuranceStartDate).getTime()) {
                return false;
            }
        } else if ((employee.healthInsuranceStartDate && !employee.healthInsuranceEndDate) ||
            (!employee.healthInsuranceStartDate && employee.healthInsuranceEndDate)) {
            return false;
        }
        if (employee.leavingDate && employee.startingDate) {
            if (new Date(employee.leavingDate).getTime() < new Date(employee.startingDate).getTime()) {
                return false;
            }
        } else if (employee.leavingDate && !employee.startingDate) {
            return false;
        }
        return result;
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
                <div className=" row box-body">
                    <div className="col-md-4">
                        <div className="form-group">
                            <label>{translate('manage_employee.attachments_code')}</label>
                            <input type="text" className="form-control" name="archivedRecordNumber" value={archivedRecordNumber} onChange={this.handleChange} placeholder={translate('manage_employee.attachments_code')} autoComplete="off" />
                        </div>
                    </div>
                    <div className="col-md-12">
                        <h4 className="row col-md-6 col-xs-8">{translate('manage_employee.list_attachments')}:</h4>
                        <FileAddModal handleChange={this.handleAddFile} id={`addFile${id}`} />
                        <button style={{ marginTop: 2, marginBottom: 10, marginRight: 15 }} type="submit" className="btn btn-primary pull-right" onClick={this.defaulteClick} title={translate('manage_employee.add_default_title')}>{translate('manage_employee.add_default')}</button>
                        <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }} >
                            <thead>
                                <tr>
                                    <th>{translate('manage_employee.file_name')}</th>
                                    <th>{translate('table.description')}</th>
                                    <th>{translate('manage_employee.number')}</th>
                                    <th>{translate('table.status')}</th>
                                    <th>{translate('manage_employee.attached_files')}</th>
                                    <th style={{ width: '120px' }}>{translate('general.action')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(typeof files !== 'undefined' && files.length !== 0) &&
                                    files.map((x, index) => {
                                        return <tr key={index}>
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
                                            <td >
                                                <a onClick={() => this.handleEdit(x, index)} className="edit text-yellow" style={{ width: '5px' }} title={translate('manage_employee.edit_file')}><i className="material-icons">edit</i></a>
                                                <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.handleDeleteFile(index)}><i className="material-icons"></i></a>
                                            </td>
                                        </tr>
                                    }

                                    )}
                            </tbody>
                        </table>
                        {
                            (typeof files === 'undefined' || files.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                        }
                    </div>
                </div>
                {
                    id === "pageAttachments" &&
                    <div className=" box-footer">
                        <button type="reset" disabled={!this.isFormValidated()} title="Thêm nhân viên mới" className="btn btn-success col-md-2 pull-right btnuser" onClick={() => this.props.handleSubmit()}>{translate('manage_employee.add_staff')}</button>
                    </div>
                }

                {
                    this.state.currentRow !== undefined &&
                    <FileEditModal
                        id={`editFile${this.state.currentRow.index}`}
                        _id={this.state.currentRow._id}
                        index={this.state.currentRow.index}
                        name={this.state.currentRow.name}
                        description={this.state.currentRow.description}
                        number={this.state.currentRow.number}
                        status={this.state.currentRow.status}
                        file={this.state.currentRow.file}
                        urlFile={this.state.currentRow.urlFile}
                        fileUpload={this.state.currentRow.fileUpload}
                        handleChange={this.handleEditFile}
                    />
                }
            </div>
        );
    }
};

const actionCreators = {
    downloadFile: AuthActions.downloadFile,
};

const fileTab = connect(null, actionCreators)(withTranslate(FileTab));
export { fileTab as FileTab };