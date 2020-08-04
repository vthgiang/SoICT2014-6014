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
        let position = this.state.position;
        this.state.organizationalUnit.forEach(u => {
            let check = value.lastIndexOf(u);
            if (check === -1) {
                this.props.department.list.forEach(x => {
                    if (x._id === u) {
                        let roleDeans = x.deans.map(y => y._id);
                        let roleViceDeans = x.viceDeans.map(y => y._id);
                        let roleEmployees = x.employees.map(y => y._id);
                        let roleDepartment = roleDeans.concat(roleViceDeans).concat(roleEmployees);
                        position = this.state.position.filter(p => roleDepartment.includes(p));
                    }
                })
            }
        })
        this.validatePosition(position, true);
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
                totalList: nextProps.totalList,

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
        const { _id, name, programId, organizationalUnit, position, errorOnProgramName,
            errorOnOrganizationalUnit, errorOnPosition, totalList } = this.state;
        const { list } = this.props.department;
        let listPosition = [];
        if (organizationalUnit !== null) {
            organizationalUnit.forEach(u => {
                list.forEach(x => {
                    if (x._id === u) {
                        let roleDeans = x.deans.map(y => { return { _id: y._id, name: y.name } });
                        let roleViceDeans = x.viceDeans.map(y => { return { _id: y._id, name: y.name } });
                        let roleEmployees = x.employees.map(y => { return { _id: y._id, name: y.name } });
                        listPosition = listPosition.concat(roleDeans).concat(roleViceDeans).concat(roleEmployees);
                    }
                })
            })
        }
        return (
            <React.Fragment>
                <DialogModal
                    modalID={`modal-edit-education${_id}`} isLoading={education.isLoading}
                    formID={`form-edit-education${_id}`}
                    title="Chỉnh sửa chương trình đào tạo"
                    func={this.save}
                    size={50}
                    maxWidth={500}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id={`form-edit-education${_id}`} >
                        <div className={`form-group ${errorOnOrganizationalUnit === undefined ? "" : "has-error"}`}>
                            <label>Áp dụng cho đơn vị<span className="text-red">*</span></label>
                            <SelectMulti id={`edit-multiSelectUnit${_id}`} multiple="multiple" display='inline-block'
                                value={organizationalUnit} disabled={Number(totalList) > 0 ? true : false}
                                options={{ nonSelectedText: translate('human_resource.non_unit'), allSelectedText: translate('human_resource.all_unit') }}
                                items={list.map((u, i) => { return { value: u._id, text: u.name } })} onChange={this.handleUnitChange}>
                            </SelectMulti>
                            <ErrorLabel content={errorOnOrganizationalUnit} />
                        </div>
                        <div className={`form-group ${errorOnPosition === undefined ? "" : "has-error"}`}>
                            <label>Áp dụng cho chức vụ<span className="text-red">*</span></label>
                            <SelectMulti id={`edit-multiSelectPosition${_id}`} multiple="multiple" display='inline-block'
                                value={position} disabled={Number(totalList) > 0 ? true : false}
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