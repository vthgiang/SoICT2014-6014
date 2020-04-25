import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createUnitKpiActions } from '../../../organizational-unit/creation/redux/actions';
import { createKpiSetActions } from "../redux/actions";
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ModalButton, ErrorLabel, SelectBox } from '../../../../../common-components';
import { VALIDATOR } from '../../../../../helpers/validator';

var translate='';
class ModalEditEmployeeKpi extends Component {
    componentDidMount() {
        // get all parent target of unit
        this.props.getCurrentKPIUnit(localStorage.getItem("currentRole"));
    }

    constructor(props) {
        super(props);
        translate = this.props.translate;
        this.state = {
            _id: null,
            name: "",
            parent: undefined,
            weight: "",
            criteria: "",
            employeeKpiSet: "",

            errorOnName: undefined,
            errorOnCriteria: undefined,
            errorOnWeight: undefined,

            editing: false,
            submitted: false
        };
    }

    // // function: chỉnh sửa một mục tiêu của KPI cá nhân
    // saveEditTarget = async (event) => {
    //     event.preventDefault();
    //     await this.setState(state => {
    //         return {
    //             adding: true,
    //             newTarget: {
    //                 name: this.name.value,
    //                 parent: this.parent.value,
    //                 weight: this.weight.value,
    //                 criteria: this.criteria.value,
    //                 kpipersonal: this.props.kpipersonal
    //             }
    //         }
    //     });
    //     const { newTarget } = this.state;
    //     if (newTarget.parent && newTarget.name && newTarget.weight && newTarget.criteria) {
    //         this.props.addNewTargetPersonal(newTarget);
    //         window.$("#addNewTargetKPIPersonal").modal("hide");
    //         window.$(".modal-backdrop").remove();
    //         window.$('body').removeClass('modal-open');
    //         window.$('body').css('padding-right', "0px");
    //     }
    // }

    // editTargetKPiPersonal = async (event, id) => {
    //     event.preventDefault();
    //     await this.setState({
    //         editing: false,
    //         newTarget: {
    //             name: this.name.value,
    //             parent: this.parent.value,
    //             criteria: this.criteria.value,
    //             weight: this.weight.value
    //         }
    //     });
    //     const {newTarget} = this.state;
    //     if (newTarget.parent && newTarget.name && newTarget.weight && newTarget.criteria) {
    //         this.props.editTargetPersonal(id, newTarget);
    //         this.handleCloseModal(id);
    //         this.notifysuccess(translate('kpi_personal.edit_target_kpi.edit_success'));
    //     }
    // }

    handleEditEmployeeKpi = async () => {
        let id = this.state._id;

        var newTarget = {
            name: this.state.name,
            parent: this.state.parent,
            weight: this.state.weight,
            criteria: this.state.criteria,
        } 

        if (this.isFormValidated()) {
            return this.props.editEmployeeKpi(id, newTarget);
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
        let msg = undefined;
        if (value.trim() === ""){
            msg = translate('employee_kpi_set.create_employee_kpi_modal.validate_name.empty');
        } else if(value.trim().length < 4 ){
                msg = translate('employee_kpi_set.create_employee_kpi_modal.validate_name.less_than_4');
        } else if(value.trim().length > 50){
            msg = translate('employee_kpi_set.create_employee_kpi_modal.validate_name.more_than_50');
        } else if (!VALIDATOR.isValidName(value)){
            msg = translate('employee_kpi_set.create_employee_kpi_modal.validate_name.special_character');
        }

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
        if (value.trim() === ""){
            msg = translate('employee_kpi_set.create_employee_kpi_modal.validate_criteria');
        }

        if (willUpdateState){
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
        if (value === ""){
            msg = translate('employee_kpi_set.create_employee_kpi_modal.validate_weight.empty');
        } else if(value < 0){
            msg = translate('employee_kpi_set.create_employee_kpi_modal.validate_weight.less_than_0');
        } else if(value > 100){
            msg = translate('employee_kpi_set.create_employee_kpi_modal.validate_weight.greater_than_100');
        } 
        
        if (willUpdateState){
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
        var currentOrganizationalUnitKPI, items;
        const { target, createKpiUnit, translate } = this.props;
        const { editing, newTarget } = this.state;
        const { _id, name, weight, criteria, errorOnName, errorOnCriteria, errorOnWeight } = this.state;
        if (createKpiUnit.currentKPI) currentOrganizationalUnitKPI = createKpiUnit.currentKPI;

        if(currentOrganizationalUnitKPI === null){
            items = [];
        }
        else{    
            items = currentOrganizationalUnitKPI.kpis.filter(item => item.default === 0).map(x => {//default !==0 thì đc. cái này để loại những mục tiêu mặc định?
            return {value: x._id, text: x.name} });
        }

        return (
            <React.Fragment>
                <DialogModal
                    modalID={`editEmployeeKpi${target._id}`} isLoading={editing}
                    formID="formeditEmployeeKpi"
                    title={translate('employee_kpi_set.edit_employee_kpi_modal.edit_employee_kpi')}
                    msg_success={translate('employee_kpi_set.edit_employee_kpi_modal.success')}
                    msg_faile={translate('employee_kpi_set.edit_employee_kpi_modal.failure')}
                    func={this.handleEditEmployeeKpi}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form id="formeditEmployeeKpi" onSubmit={() => this.handleEditEmployeeKpi(translate('employee_kpi_set.edit_employee_kpi_modal.success'))}>
                        
                            <div className={`form-group ${errorOnName === undefined ? "" : "has-error"}`}>
                                <label>{translate('employee_kpi_set.edit_employee_kpi_modal.name')}<span className="text-red">*</span></label>
                                <input type="text" className="form-control" value={name} onChange = {this.handleNameChange}/>
                                <ErrorLabel content={errorOnName}/>
                            </div>

                            {(createKpiUnit.currentKPI !== null) &&
                                (items.length !== 0) && 
                                    <div className="form-group">
                                        <label>{translate('employee_kpi_set.edit_employee_kpi_modal.parents')}</label>
                                        <SelectBox
                                            id={`parent-target-edit${_id}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={items}
                                            onChange={this.handleParentChange}
                                            multiple={false}
                                        />
                                    </div>
                            }

                            <div className={`form-group ${errorOnCriteria === undefined ? "" : "has-error"}`}>
                                <label>{translate('employee_kpi_set.edit_employee_kpi_modal.evaluation_criteria')}<span className="text-red">*</span></label>
                                <input type="text" className="form-control" value={criteria} onChange = {this.handleCriteriaChange}/>
                                <ErrorLabel content={errorOnCriteria}/>
                            </div>

                            <div className={`form-group ${errorOnWeight === undefined ? "" : "has-error"}`}>
                            <label>{translate('employee_kpi_set.edit_employee_kpi_modal.weight')}<span className="text-red">*</span></label>
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
    getCurrentKPIUnit: createUnitKpiActions.getCurrentKPIUnit,
    editEmployeeKpi: createKpiSetActions.editEmployeeKpi
};

const connectedModalEditEmployeeKpi = connect( mapState, actionCreators )( withTranslate(ModalEditEmployeeKpi) );
export { connectedModalEditEmployeeKpi as ModalEditEmployeeKpi };