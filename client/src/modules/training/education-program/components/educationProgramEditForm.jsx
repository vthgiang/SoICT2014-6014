import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

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
        this.setState({
            ...this.state,
            organizationalUnit: value
        })
    }

    // Function lưu giá trị chức vụ vào state khi thay đổi
    handlePositionChange = (value) => {
        if (value.length === 0) {
            value = null
        };
        this.setState({
            ...this.state,
            position: value
        })
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        });
    }
    save = (e) => {
        this.props.updateEducation(this.state);
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
            }
        } else {
            return null;
        }
    }
    render() {
        const { translate, education } = this.props;
        const { name, programId, organizationalUnit, position } = this.state;
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
                    disableSubmit={false}
                    size={50}
                    maxWidth={500}
                // disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id="form-edit-education" >
                        <div className="form-group">
                            <label>Áp dụng cho đơn vị</label>
                            <SelectMulti id={`edit-multiSelectUnit`} multiple="multiple" display='inline-block'
                                value={organizationalUnit}
                                options={{ nonSelectedText: translate('human_resource.non_unit'), allSelectedText: translate('human_resource.all_unit') }}
                                items={list.map((u, i) => { return { value: u._id, text: u.name } })} onChange={this.handleUnitChange}>
                            </SelectMulti>
                        </div>
                        <div className="form-group">
                            <label>Áp dụng cho chức vụ</label>
                            <SelectMulti id={`edit-multiSelectPosition`} multiple="multiple" display='inline-block'
                                value={position}
                                options={{ nonSelectedText: translate('human_resource.non_position'), allSelectedText: translate('human_resource.all_position') }}
                                items={listPosition.map((p, i) => { return { value: p._id, text: p.name } })} onChange={this.handlePositionChange}>
                            </SelectMulti>
                        </div>
                        <div className="form-group" >
                            <label>Mã chương trình đào tạo<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name="programId" value={programId} disabled />
                        </div>
                        <div className="form-group">
                            <label>Tên chương trình đào tạo<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name="name" value={name} onChange={this.handleChange} />
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