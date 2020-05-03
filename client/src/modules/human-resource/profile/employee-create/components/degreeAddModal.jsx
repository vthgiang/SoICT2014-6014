import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ButtonModal, ErrorLabel } from '../../../../../common-components';
import { EmployeeCreateValidator } from './combinedContent';
class DegreeAddModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            issuedBy: "",
            year: "",
            degreeType: "excellent",
            file: "",
            urlFile: "",
            fileUpload: "",
        }
    }
    // Bắt sự kiện thay đổi file đính kèm
    handleChangeFile = (e) => {
        const { name } = e.target;
        var file = e.target.files[0];
        if (file !== undefined) {
            var url = URL.createObjectURL(file);
            var fileLoad = new FileReader();
            fileLoad.readAsDataURL(file);
            fileLoad.onload = () => {
                this.setState({
                    [name]: file.name,
                    urlFile: url,
                    fileUpload: file,
                })
            };
        }
    }
    // Bắt sự kiên thay đổi tên bằng cấp
    handleNameChange = (e) => {
        let { value } = e.target;
        this.validateName(value, true);
    }
    validateName = (value, willUpdateState = true) => {
        let msg = EmployeeCreateValidator.validateNameDegree(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnName: msg,
                    name: value,
                }
            });
        }
        return msg === undefined;
    }
    // Bắt sự kiện thay đổi nơi đào tạo
    handleIssuedByChange = (e) => {
        let { value } = e.target;
        this.validateIssuedBy(value, true);
    }
    validateIssuedBy = (value, willUpdateState = true) => {
        let msg = EmployeeCreateValidator.validateIssuedByDegree(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnIssuedBy: msg,
                    issuedBy: value,
                }
            });
        }
        return msg === undefined;
    }
    // Bắt sự kiện thay đổi năm tốt nghiệp
    handleYearChange = (e) => {
        let { value } = e.target;
        this.validateYear(value, true);
    }
    validateYear = (value, willUpdateState = true) => {
        let msg = EmployeeCreateValidator.validateYearDegree(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnYear: msg,
                    year: value,
                }
            });
        }
        return msg === undefined;
    }
    // Bắt sự kiện thay đổi xếp loại
    handleDegreeTypeChange = (e) => {
        let { name, value } = e.target;
        this.setState({
            [name]: value
        });
    }

    // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
    isFormValidated = () => {
        let result =
            this.validateName(this.state.name, false) && this.validateIssuedBy(this.state.issuedBy, false) &&
            this.validateYear(this.state.year, false);
        return result;
    }
    // Bắt sự kiện submit form
    save = () => {
        if (this.isFormValidated()) {
            return this.props.handleChange(this.state);
        }
    }
    render() {
        const { id, translate } = this.props;
        const { name, issuedBy, year, degreeType, errorOnName, errorOnIssuedBy, errorOnYear } = this.state;
        return (
            <React.Fragment>
                <ButtonModal modalID={`modal-create-certificate-${id}`} button_name={translate('modal.create')} title={translate('manage_employee.add_diploma')} />
                <DialogModal
                    size='50' modalID={`modal-create-certificate-${id}`} isLoading={false}
                    formID={`form-create-certificate-${id}`}
                    title={translate('manage_employee.add_diploma')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id={`form-create-certificate-${id}`}>
                        <div className={`form-group ${errorOnName === undefined ? "" : "has-error"}`}>
                            <label>{translate('manage_employee.name_diploma')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name="name" value={name} onChange={this.handleNameChange} autoComplete="off" />
                            <ErrorLabel content={errorOnName} />
                        </div>
                        <div className={`form-group ${errorOnIssuedBy === undefined ? "" : "has-error"}`}>
                            <label>{translate('manage_employee.diploma_issued_by')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name="issuedBy" value={issuedBy} onChange={this.handleIssuedByChange} autoComplete="off" />
                            <ErrorLabel content={errorOnIssuedBy} />
                        </div>
                        <div className="row">
                            <div className={`form-group col-sm-6 col-xs-12 ${errorOnYear === undefined ? "" : "has-error"}`}>
                                <label>{translate('manage_employee.graduation_year')}<span className="text-red">*</span></label>
                                <input type="text" className="form-control" name="year" value={year} onChange={this.handleYearChange} autoComplete="off" />
                                <ErrorLabel content={errorOnYear} />
                            </div>
                            <div className="form-group col-sm-6 col-xs-12">
                                <label>{translate('manage_employee.ranking_learning')}<span className="text-red">*</span></label>
                                <select className="form-control" value={degreeType} name="degreeType" onChange={this.handleDegreeTypeChange}>
                                    <option value="excellent">{translate('manage_employee.excellent')}</option>
                                    <option value="very_good">{translate('manage_employee.very_good')}</option>
                                    <option value="good">{translate('manage_employee.good')}</option>
                                    <option value="average_good">{translate('manage_employee.average_good')}</option>
                                    <option value="ordinary">{translate('manage_employee.ordinary')}</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="file">{translate('manage_employee.attached_files')}</label>
                            <input type="file" style={{ height: 34, paddingTop: 2 }} className="form-control" name="file" onChange={this.handleChangeFile} />
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
};
const addModal = connect(null, null)(withTranslate(DegreeAddModal));
export { addModal as DegreeAddModal };
