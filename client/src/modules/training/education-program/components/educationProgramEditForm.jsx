import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { EducationProgramFormValidator } from './combinedContent';

import { DialogModal, ErrorLabel, SelectMulti } from '../../../../common-components';
import { EducationActions } from '../redux/actions';

class EducationProgramEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {};
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
            this.validateProgramName(this.state.name, false);
        return result;
    }
    save = (e) => {
        console.log(this.state)
        if (this.isFormValidated()) {
            this.props.updateEducation(this.state._id, this.state);
        }
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps._id !== prevState._id) {
            return {
                ...prevState,
                _id: nextProps._id,
                name: nextProps.name,
                programId: nextProps.programId,
                organizationalUnit: nextProps.organizationalUnit,
                position: nextProps.position,
                errorOnOrganizationalUnit: undefined,
                errorOnPosition: undefined,
                errorOnProgramName: undefined,


            }
        } else {
            return null;
        }
    }
    render() {
        const { translate, education } = this.props;
        const { name, programId, organizationalUnit, position, errorOnProgramName,
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
                <DialogModal
                    modalID="modal-edit-education" isLoading={education.isLoading}
                    formID="form-edit-education"
                    title="Chỉnh sửa chương trình đào tạo"
                    func={this.save}
                    size={50}
                    maxWidth={500}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id="form-edit-education" >
                        <div className={`form-group ${errorOnOrganizationalUnit === undefined ? "" : "has-error"}`}>
                            <label>Áp dụng cho đơn vị<span className="text-red">*</span></label>
                            <SelectMulti id={`edit-multiSelectUnit`} multiple="multiple" display='inline-block'
                                value={organizationalUnit}
                                options={{ nonSelectedText: translate('human_resource.non_unit'), allSelectedText: translate('human_resource.all_unit') }}
                                items={list.map((u, i) => { return { value: u._id, text: u.name } })} onChange={this.handleUnitChange}>
                            </SelectMulti>
                            <ErrorLabel content={errorOnOrganizationalUnit} />
                        </div>
                        <div className={`form-group ${errorOnPosition === undefined ? "" : "has-error"}`}>
                            <label>Áp dụng cho chức vụ<span className="text-red">*</span></label>
                            <SelectMulti id={`edit-multiSelectPosition`} multiple="multiple" display='inline-block'
                                value={position}
                                options={{ nonSelectedText: translate('human_resource.non_position'), allSelectedText: translate('human_resource.all_position') }}
                                items={listPosition.map((p, i) => { return { value: p._id, text: p.name } })} onChange={this.handlePositionChange}>
                            </SelectMulti>
                            <ErrorLabel content={errorOnPosition} />
                        </div>
                        <div className="form-group" >
                            <label>Mã chương trình đào tạo<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name="programId" value={programId} disabled />
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
    updateEducation: EducationActions.updateEducation,
};

const editForm = connect(mapState, actionCreators)(withTranslate(EducationProgramEditForm));
export { editForm as EducationProgramEditForm };