import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createUnitKpiActions } from '../../../organizational-unit/creation/redux/actions';
import { createKpiSetActions } from "../redux/actions";

import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ButtonModal, ErrorLabel, SelectBox } from '../../../../../common-components';
import { UserFormValidator} from '../../../../super-admin/user/components/userFormValidator';

var translate = '';
class ModalCreateEmployeeKpi extends Component {
    componentDidMount() {
        // get all parent target of unit
        this.props.getCurrentKPIUnit(localStorage.getItem("currentRole"));
    }

    constructor(props) {
        super(props);
        translate = this.props.translate;
        this.state = {
            name: "",
            parent: null,
            weight: "",
            criteria: "",
            employeeKpiSet: "",

            errorOnName: undefined,
            errorOnCriteria: undefined,
            errorOnWeight: undefined,

            adding: false,
            submitted: false
        };
    }

    // function: create new target of personal kpi
    handleCreateEmployeeKpi = async () => {
        let currentOrganizationalKpiSet = null;
        let items;
        let parent = null;
        const { createKpiUnit } = this.props;
        if (createKpiUnit.currentKPI) currentOrganizationalKpiSet = createKpiUnit.currentKPI;
        if(this.state.parent === null){
            if(currentOrganizationalKpiSet === null){
                parent = null;
            }
            else{    
                items = currentOrganizationalKpiSet.kpis.filter(item => item.default === 0).map(x => {//default !==0 thì đc. cái này để loại những mục tiêu mặc định?
                    return {value: x._id, text: x.name} });

                parent = items[0].value;
            }    
        }
        else{
            parent = this.state.parent
        }

        if (this.isFormValidated()){
            let employeeKpi = {
                name: this.state.name,
                parent: parent,
                weight: this.state.weight,
                criteria: this.state.criteria,
                employeeKpiSet: this.props.employeeKpiSet, 
            }
            let res = await this.props.createEmployeeKpi(employeeKpi);            
            window.$("#createEmployeeKpi").modal("hide");
            window.$(".modal-backdrop").remove();
            window.$('body').removeClass('modal-open');
            window.$('body').css('padding-right',"0px");

            return res;
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
                parent: value,
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
        if (value.trim() === ""){
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
        var currentOrganizationalUnitKpiSet;
        const { newTarget, adding } = this.state;
        const { createKpiUnit, translate } = this.props;
        if (createKpiUnit.currentKPI) currentOrganizationalUnitKpiSet = createKpiUnit.currentKPI;        
        var items;
        
        if(currentOrganizationalUnitKpiSet === undefined){
            items = [];
        } else {    
            items = currentOrganizationalUnitKpiSet.kpis.filter(item => item.default === 0).map(x => {//default !==0 thì đc. cái này để loại những mục tiêu mặc định?
            return {value: x._id, text: x.name} });
        }

        const{ name, parent, weight, criteria, errorOnName, errorOnCriteria, errorOnWeight} = this.state;

        return (
            <React.Fragment>
                <DialogModal
                    modalID="createEmployeeKpi" isLoading={adding}
                    formID="formCreateEmployeeKpi"
                    title={translate('employee_kpi_set.create_employee_kpi_modal.create_employee_kpi')}
                    msg_success={translate('employee_kpi_set.create_employee_kpi_modal.success')}
                    msg_faile={translate('employee_kpi_set.create_employee_kpi_modal.failure')}
                    func={this.handleCreateEmployeeKpi}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form id="formCreateEmployeeKpi" onSubmit={() => this.handleCreateEmployeeKpi(translate('employee_kpi_set.create_employee_kpi_modal.success'))}>
                        <div className={`form-group ${errorOnName===undefined?"":"has-error"}`}>
                            <label>{translate('employee_kpi_set.create_employee_kpi_modal.name')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" value={name} onChange = {this.handleNameChange}/>
                            <ErrorLabel content={errorOnName}/>
                        </div>
                        
                        {(createKpiUnit.currentKPI !== null) &&//unit.parent === null này!!! kiểm tra xem đây là đơn vị gốc hay không!
                                (items.length !== 0) &&
                                    <div className="form-group">
                                    <label>{ translate('employee_kpi_set.create_employee_kpi_modal.parents')}<span className="text-red">*</span></label>
                                    <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                                        id={`parent-target-add`}
                                        className="form-control select2"
                                        style={{width: "100%"}}
                                        items = {items}
                                        onChange={this.handleParentChange}
                                        multiple={false}
                                        value={items[0]}
                                    />
                                
                            </div>}

                        <div className={`form-group ${errorOnCriteria===undefined?"":"has-error"}`}>
                            <label>{translate('employee_kpi_set.create_employee_kpi_modal.evaluation_criteria')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" value={criteria} onChange = {this.handleCriteriaChange}/>
                            <ErrorLabel content={errorOnCriteria}/>
                        </div>

                        <div className={`form-group ${errorOnWeight===undefined?"":"has-error"}`}>
                            <label>{translate('employee_kpi_set.create_employee_kpi_modal.weight')}<span className="text-red">*</span></label>
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
    createEmployeeKpi: createKpiSetActions.createEmployeeKpi
};

const connectedModalCreateEmployeeKpi = connect( mapState, actionCreators )( withTranslate(ModalCreateEmployeeKpi) );
export { connectedModalCreateEmployeeKpi as ModalCreateEmployeeKpi };
