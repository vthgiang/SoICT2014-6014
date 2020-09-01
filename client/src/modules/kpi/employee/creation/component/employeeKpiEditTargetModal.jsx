import React, { Component } from 'react';
import { connect } from 'react-redux';

import { withTranslate } from 'react-redux-multilingual';

import { createUnitKpiActions } from '../../../organizational-unit/creation/redux/actions';
import { createKpiSetActions } from "../redux/actions";

import { DialogModal, ErrorLabel, SelectBox } from '../../../../../common-components';
import ValidationHelper from '../../../../../helpers/validationHelper';


var translate='';
class ModalEditEmployeeKpi extends Component {

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

    componentDidMount() {
        this.props.getCurrentKPIUnit(localStorage.getItem("currentRole"));
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
    
    /**Gửi request chỉnh sửa mục tiêu này */
    handleEditTargetEmployeeKpi = async () => {
        let id = this.state._id;

        let newTarget = {
            name: this.state.name,
            parent: this.state.parent,
            weight: this.state.weight,
            criteria: this.state.criteria,
        } 
        
        if (this.isFormValidated()) {
            let res = await this.props.editEmployeeKpi(id, newTarget);

            window.$(`#editEmployeeKpi${this.props.target._id}`).modal("hide");
            window.$(".modal-backdrop").remove();
            window.$('body').removeClass('modal-open');
            window.$('body').css('padding-right',"0px");

            return res;
        }
    }

    handleNameChange = (e) => {
        let value = e.target.value;
        let validation = ValidationHelper.validateName(translate, value);
        
        this.setState(state => {
            return {
                ...state,
                errorOnName: validation.message,
                name: value,
            }
        });
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
        let validation = ValidationHelper.validateDescription(translate, value);

        this.setState(state => {
            return {
                ...state,
                errorOnCriteria: validation.message,
                criteria: value,
            }
        });
    }

    handleWeightChange = (e) => {
        let value = e.target.value;
        let validation = this.validateWeight(translate, value);

        this.setState(state => {
            return {
                ...state,
                errorOnWeight: validation.message,
                weight: value,
            }
        });
    }

    validateWeight = (translate, value) => {
        let validation = ValidationHelper.validateEmpty(translate, value);

        if (!validation.status) {
            return validation;
        }
        
        if (value < 0) {
            return {
                status: false,
                message: translate('kpi.employee.employee_kpi_set.create_employee_kpi_modal.validate_weight.less_than_0')
            };
        } else if(value > 100){
            return {
                status: false,
                message: translate('kpi.employee.employee_kpi_set.create_employee_kpi_modal.validate_weight.greater_than_100')
            };
        } else {
            return {
                status: true
            };
        }
    }

    isFormValidated = () => {
        const { name, criteria, weight } = this.state;
        
        let validatateName, validateCriteria, validateWeight, result;

        validatateName = ValidationHelper.validateName(translate, name);
        validateCriteria = ValidationHelper.validateDescription(translate, criteria);
        validateWeight = this.validateWeight(translate, weight)

        result = validatateName.status && validateCriteria.status && validateWeight.status;
        return result;
    }

    render() {
        var currentOrganizationalUnitKPI, items;
        const { target, createKpiUnit, translate } = this.props;
        const { _id, name, weight, criteria, errorOnName, errorOnCriteria, errorOnWeight, editing } = this.state;

        if (createKpiUnit.currentKPI) currentOrganizationalUnitKPI = createKpiUnit.currentKPI;
        
        if(currentOrganizationalUnitKPI === undefined){
            items = [];
        }
        else{    
            items = currentOrganizationalUnitKPI.kpis.filter(item => item.type === 0).map(x => {//type !==0 thì đc. cái này để loại những mục tiêu mặc định?
            return {value: x._id, text: x.name} });
        }
        
        return (
            <React.Fragment>
                <DialogModal
                    modalID={`editEmployeeKpi${target._id}`} isLoading={editing}
                    formID="formeditEmployeeKpi"
                    title={translate('kpi.employee.employee_kpi_set.edit_employee_kpi_modal.edit_employee_kpi')}
                    msg_success={translate('kpi.employee.employee_kpi_set.edit_employee_kpi_modal.success')}
                    msg_faile={translate('kpi.employee.employee_kpi_set.edit_employee_kpi_modal.failure')}
                    func={this.handleEditTargetEmployeeKpi}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form id="formEditTargetEmployeeKpi" onSubmit={() => this.handleEditTargetEmployeeKpi(translate('kpi.employee.employee_kpi_set.edit_employee_kpi_modal.success'))}>
                        
                            {/**Tên của mục tiêu */}
                            <div className={`form-group ${errorOnName === undefined ? "" : "has-error"}`}>
                                <label>{translate('kpi.employee.employee_kpi_set.edit_employee_kpi_modal.name')}<span className="text-red">*</span></label>
                                <input type="text" className="form-control" value={name} onChange = {this.handleNameChange}/>
                                <ErrorLabel content={errorOnName}/>
                            </div>
                            
                            {/**Mục tiêu cha */}
                            {(createKpiUnit.currentKPI !== null) &&
                                (items.length !== 0) && 
                                    <div className="form-group">
                                        <label>{translate('kpi.employee.employee_kpi_set.edit_employee_kpi_modal.parents')}<span className="text-red">*</span></label>
                                        <SelectBox
                                            id={`parent-target-edit${_id}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={items}
                                            onChange={this.handleParentChange}
                                            multiple={false}
                                            value={items[0]}
                                        />
                                    </div>
                            }
                            
                            {/**Tiêu chí đánh giá */}
                            <div className={`form-group ${errorOnCriteria === undefined ? "" : "has-error"}`}>
                                <label>{translate('kpi.employee.employee_kpi_set.edit_employee_kpi_modal.evaluation_criteria')}<span className="text-red">*</span></label>
                                <textarea rows={4} className="form-control" value={criteria} onChange = {this.handleCriteriaChange}/>
                                <ErrorLabel content={errorOnCriteria}/>
                            </div>
                            
                            {/**Trọng số của mục tiêu */}
                            <div className={`form-group ${errorOnWeight === undefined ? "" : "has-error"}`}>
                            <label>{translate('kpi.employee.employee_kpi_set.edit_employee_kpi_modal.weight')}<span className="text-red">*</span></label>
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