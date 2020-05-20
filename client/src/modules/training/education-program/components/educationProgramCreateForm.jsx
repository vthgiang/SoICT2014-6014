import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { EducationProgramFormValidator } from './combinedContent';

import { DialogModal, ButtonModal, ErrorLabel, SelectMulti } from '../../../../common-components';
import { EducationActions } from '../redux/actions';

class EducationProgramCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            organizationalUnit: null,
            position: null,
            name: "",
            programId: "",
        };
    }

    // Function lưu giá trị unit vào state khi thay đổi
    handleUnitChange = (value) => {
        if (value.length === 0) {
            value = null
        };
        this.validateOrganizationalUnit(value, true);
    }
    validateOrganizationalUnit = (value, willUpdateState = true) => {
        let msg = EducationProgramFormValidator.validateOrganizationalUnit(value, this.props.translate);
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnOrganizationalUnit: msg,
                    organizationalUnit: value,
                }
            });
        }
        return msg === undefined;
    }

    // Function lưu giá trị chức vụ vào state khi thay đổi
    handlePositionChange = (value) => {
        if (value.length === 0) {
            value = null
        };
        this.validatePosition(value, true);
    }
    validatePosition = (value, willUpdateState = true) => {
        let msg = EducationProgramFormValidator.validatePosition(value, this.props.translate);
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnPosition: msg,
                    position: value,
                }
            });
        }
        return msg === undefined;
    }

    // Bắt sự kiện thay đổi mã chương trình đào tạo
    handleProgramIdChange = (e) => {
        const { value } = e.target;
        this.validateProgramId(value, true);
    }
    validateProgramId = (value, willUpdateState = true) => {
        let msg = EducationProgramFormValidator.validateProgramId(value, this.props.translate);
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnProgramId: msg,
                    programId: value,
                }
            });
        }
        return msg === undefined;
    }

    // Bắt sự kiện thay đổi tên chương trình đào tạo
    handleProgramNameChange = (e) => {
        const { value } = e.target;
        this.validateProgramName(value, true);
    }
    validateProgramName = (value, willUpdateState = true) => {
        let msg = EducationProgramFormValidator.validateProgramName(value, this.props.translate);
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnProgramName: msg,
                    name: value,
                }
            });
        }
        return msg === undefined;
    }

    // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
    isFormValidated = () => {
        let result =
            this.validateOrganizationalUnit(this.state.organizationalUnit, false) && this.validatePosition(this.state.position, false) &&
            this.validateProgramId(this.state.programId, false) && this.validateProgramName(this.state.name, false);
        return result;
    }
    save = (e) => {
        if (this.isFormValidated()) {
            this.props.addNewEducation(this.state);
        }
    }
    render() {
        const { translate, education } = this.props;
        const { name, programId, organizationalUnit, position, errorOnProgramName, errorOnProgramId,
            errorOnOrganizationalUnit, errorOnPosition } = this.state;
        const { list } = this.props.department;
        var listPosition = [];
        if (this.state.organizationalUnit !== null) {
            let organizationalUnit = this.state.organizationalUnit;
            organizationalUnit.forEach(u => {
                list.forEach(x => {
                    if (x._id === u) {
                        let position = [
                            { _id: x.dean._id, name: x.dean.name },
                            { _id: x.viceDean._id, name: x.viceDean.name },
                            { _id: x.employee._id, name: x.employee.name }
                        ]
                        listPosition = listPosition.concat(position)
                    }
                })
            })
        }
        return (
            <React.Fragment>
                <ButtonModal modalID="modal-create-education" button_name="Thêm chương trình đào tạo" title="Thêm chương trình đào tạo" />
                <DialogModal
                    modalID="modal-create-education" isLoading={education.isLoading}
                    formID="form-create-education"
                    title="Thêm chương trình đào tạo"
                    func={this.save}
                    size={50}
                    maxWidth={500}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id="form-create-education" >
                        <div className={`form-group ${errorOnOrganizationalUnit === undefined ? "" : "has-error"}`}>
                            <label>Áp dụng cho đơn vị<span className="text-red">*</span></label>
                            <SelectMulti id={`create-multiSelectUnit`} multiple="multiple" display='inline-block'
                                options={{ nonSelectedText: translate('human_resource.non_unit'), allSelectedText: translate('human_resource.all_unit') }}
                                items={list.map((u, i) => { return { value: u._id, text: u.name } })} onChange={this.handleUnitChange}>
                            </SelectMulti>
                            <ErrorLabel content={errorOnOrganizationalUnit} />
                        </div>
                        <div className={`form-group ${errorOnPosition === undefined ? "" : "has-error"}`}>
                            <label>Áp dụng cho chức vụ<span className="text-red">*</span></label>
                            <SelectMulti id={`create-multiSelectPosition`} multiple="multiple" display='inline-block'
                                options={{ nonSelectedText: translate('human_resource.non_position'), allSelectedText: translate('human_resource.all_position') }}
                                items={listPosition.map((p, i) => { return { value: p._id, text: p.name } })} onChange={this.handlePositionChange}>
                            </SelectMulti>
                            <ErrorLabel content={errorOnPosition} />
                        </div>
                        <div className={`form-group ${errorOnProgramId === undefined ? "" : "has-error"}`} >
                            <label>Mã chương trình đào tạo<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name="programId" value={programId} onChange={this.handleProgramIdChange} />
                            <ErrorLabel content={errorOnProgramId} />
                        </div>
                        <div className={`form-group ${errorOnProgramName === undefined ? "" : "has-error"}`}>
                            <label>Tên chương trình đào tạo<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name="name" value={name} onChange={this.handleProgramNameChange} />
                            <ErrorLabel content={errorOnProgramName} />
                        </div>

                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
};
function mapState(state) {
    const { education, department } = state;
    return { education, department };
};

const actionCreators = {
    addNewEducation: EducationActions.createNewEducation,
};

const createForm = connect(mapState, actionCreators)(withTranslate(EducationProgramCreateForm));
export { createForm as EducationProgramCreateForm };