import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ErrorLabel, SelectBox } from '../../../../../common-components';

import { createUnitKpiActions } from '../redux/actions';

import { UserFormValidator} from '../../../../super-admin/user/components/userFormValidator';


class OrganizationalUnitKpiEditTargetModal extends Component {
    componentDidMount() {
        // Get all parent target of unit
        this.props.getParentTarget(localStorage.getItem("currentRole"));
    }

    constructor(props) {
        super(props);
        this.state = {
            _id: null,
            name: "",
            parent: undefined,
            weight: "",
            criteria: "",

            editing: false,

            errorOnName: undefined,
            errorOnCriteria: undefined,
            errorOnWeight: undefined,
        };
    }

    handleEditTarget = async () => { 
        let id = this.state._id;
        var newTarget = {
            name: this.state.name,
            parent: this.state.parent ? this.state.parent : null,
            weight: this.state.weight,
            criteria: this.state.criteria,
        }
        
        if (this.isFormValidated()){
            return this.props.editTargetKPIUnit(id, newTarget);
        }
    }


    static getDerivedStateFromProps(nextProps, prevState){
        if (nextProps.target._id !== prevState._id) {
            return {
                ...prevState,
                _id: nextProps.target._id,
                name: nextProps.target.name,
                parent: nextProps.target.parent ? nextProps.target.parent._id : null,
                weight: nextProps.target.weight,
                criteria: nextProps.target.criteria,

                errorOnName: undefined, // Khi nhận thuộc tính mới, cần lưu ý reset lại các gợi ý nhắc lỗi, nếu không các lỗi cũ sẽ hiển thị lại
                errorOnCriteria: undefined,
                errorOnWeight: undefined,
            } 
        } else {
            return null;
        }
    }


    handleNameChange = (e) => {
        let value = e.target.value;
        this.validateName(value, true);
    }
    validateName = (value, willUpdateState=true) => {
        let msg = UserFormValidator.validateName(value);
        if (willUpdateState){
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

    handleParentChange = (value) => {
        this.setState(state => {
            return {
                ...state,
                parent: value[0]
            }
        });
    }

    handleCriteriaChange = (e) => {
        let value = e.target.value;
        this.validateCriteria(value, true);
    }
    validateCriteria = (value, willUpdateState=true) => {
        let msg = undefined;
        if (value.trim() === "") {
            msg = "Tiêu chí không được để trống";
        }

        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnCriteria: msg,
                    criteria: value,
                }
            });
        }
        return msg === undefined;
    }

    handleWeightChange = (e) => {
        let value = e.target.value;
        this.validateWeight(value, true);
    }
    validateWeight = (value, willUpdateState=true) => {
        let msg = undefined;
        
        if (value < 0) {
            msg = "Trọng số không được nhỏ hơn 0";
        } else if (value > 100) {
            msg = "Trọng số không được lớn hơn 100";
        } 
        
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnWeight: msg,
                    weight: value,
                }
            });
        }
        return msg === undefined;
    }

    isFormValidated = () => {
        let result = 
            this.validateName(this.state.name, false) &&
            this.validateCriteria(this.state.criteria, false) &&
            this.validateWeight(this.state.weight, false);
        return result;
    }


    render() {
        const { createKpiUnit } = this.props; // Redux
        const { target, organizationalUnit } = this.props; // Truyền từ component cha
        const { translate } = this.props; // Hàm để chuyển sang song ngữ
        const { editing, newTarget, _id, name, parent, weight, criteria, errorOnName, errorOnCriteria, errorOnWeight } = this.state;
        
        var parentKPI;
        if (createKpiUnit.parent) {
            parentKPI = createKpiUnit.parent;
        }

        var items;
        if (parentKPI === undefined) {
            items = [];
        } else {    
            items = parentKPI.kpis.map(x => {//default !==0 thì đc. cái này để loại những mục tiêu mặc định?
                return {value: x._id, text: x.name} });
        }

        return (
            <React.Fragment>
                <DialogModal
                    modalID={`editTargetKPIUnit${this.props.target._id}`} isLoading={editing}
                    formID="form-edit-target"
                    title={translate('kpi.organizational_unit.edit_target_kpi_modal.edit_organizational_unit_kpi')}
                    msg_success={translate('kpi.organizational_unit.edit_target_kpi_modal.success')}
                    msg_faile={translate('kpi.organizational_unit.edit_target_kpi_modal.failure')}
                    func={this.handleEditTarget}
                    disableSubmit={!this.isFormValidated()}
                >
                    {/* Form chỉnh sửa tiêu */}
                    <form id="form-edit-target" onSubmit={() => this.handleEditTarget(translate('kpi.organizational_unit.edit_target_kpi_modal.success'))}>
                        <div className={`form-group ${errorOnName===undefined?"":"has-error"}`}>
                            <label>{translate('kpi.organizational_unit.edit_target_kpi_modal.name')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" value={name} onChange = {this.handleNameChange}/>
                            <ErrorLabel content={errorOnName}/>
                        </div>
                        
                        {/* Mục tiêu cha */}
                        {(organizationalUnit && organizationalUnit.parent) &&//unit.parent === null này!!! kiểm tra xem đây là đơn vị gốc hay không!
                            <div className="form-group">
                                <label>{translate('kpi.organizational_unit.edit_target_kpi_modal.parents')}</label>
                                {items.length !== 0 &&
                                    <SelectBox 
                                        id={`parent-target-add${_id}`}
                                        className="form-control select2"
                                        style={{width: "100%"}}
                                        items = {items}
                                        value={parent}
                                        onChange={this.handleParentChange}
                                        multiple={false}
                                    />
                                }
                            </div>}
                            
                        {/* Tiêu chí đánh giá */}
                        <div className={`form-group ${!errorOnCriteria? "": "has-error"}`}>
                            <label>{translate('kpi.organizational_unit.edit_target_kpi_modal.evaluation_criteria')}<span className="text-red">*</span></label>
                            <textarea rows={4} type="text" className="form-control" value={criteria} onChange = {this.handleCriteriaChange}/>
                            <ErrorLabel content={errorOnCriteria}/>
                        </div>

                        {/* Trọng số */}
                        <div className={`form-group ${!errorOnWeight? "": "has-error"}`}>
                            <label>{translate('kpi.organizational_unit.edit_target_kpi_modal.weight')}<span className="text-red">*</span></label>
                            <input type="number" className="form-control" value={weight} onChange = {this.handleWeightChange}/>
                            <ErrorLabel content={errorOnWeight}/>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

function mapState(state) {
    const { createKpiUnit } = state;
    return { createKpiUnit };
}

const actionCreators = {
    getParentTarget: createUnitKpiActions.getKPIParent,
    editTargetKPIUnit: createUnitKpiActions.editTargetKPIUnit
};
const connectedOrganizationalUnitKpiEditTargetModal = connect(mapState, actionCreators)(withTranslate(OrganizationalUnitKpiEditTargetModal));
export { connectedOrganizationalUnitKpiEditTargetModal as OrganizationalUnitKpiEditTargetModal };