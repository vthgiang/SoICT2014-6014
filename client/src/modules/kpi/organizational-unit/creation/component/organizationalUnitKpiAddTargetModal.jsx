import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { kpiUnitActions as createUnitKpiActions } from '../../../redux-actions/CombineActions';
import { createUnitKpiActions } from '../redux/actions';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ButtonModal, ErrorLabel, SelectBox } from '../../../../../common-components';
import { UserFormValidator} from '../../../../super-admin/user/components/userFormValidator';

class OrganizationalUnitKpiAddTargetModal extends Component {
    componentDidMount() {
        // get all parent target of unit
        this.props.getParentTarget(localStorage.getItem("currentRole"));
    }
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            parent: null,
            weight: "",
            criteria: "",
            organizationalUnitKpiSetId: "",

            errorOnName: undefined,
            errorOnCriteria: undefined,
            errorOnWeight: undefined,
            adding: false,
            submitted: false
        };

        this.onAddItem = this.onAddItem.bind(this);

    }

    onAddItem = async () => {
        let parentKPI = null;
        let items;
        let parent = null;
        const { createKpiUnit } = this.props;
        if (createKpiUnit.parent) parentKPI = createKpiUnit.parent;
        if(this.state.parent === null){
            if(parentKPI === null){
                parent = null;
            }
            else{    
                items = parentKPI.kpis.filter(item => item.default === 0).map(x => {//default !==0 thì đc. cái này để loại những mục tiêu mặc định?
                return {value: x._id, text: x.name} });

                parent = items[0].value;
            }    
        }
        else{
            parent = this.state.parent
        }
        
        if (this.isFormValidated()){
            return await this.props.addTargetKPIUnit({
                name: this.state.name,
                parent: parent,
                weight: this.state.weight,
                criteria: this.state.criteria,
                organizationalUnitKpiSetId: this.props.organizationalUnitKpiSetId, 
            });

            //window.$("#modal-add-target").modal("hide");
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
        if (value.trim() === ""){
            msg = "Tiêu chí không được để trống";
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
            msg = "Trọng số không được để trống";
        } else if(value < 0){
            msg = "Trọng số không được nhỏ hơn 0";
        } else if(value > 100){
            msg = "Trọng số không được lớn hơn 100";
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
        var parentKPI;
        const { adding } = this.state;
        const { createKpiUnit, organizationalUnit } = this.props;
        if (createKpiUnit.parent) parentKPI = createKpiUnit.parent;

        const{ name, parent, weight, criteria, errorOnName, errorOnCriteria, errorOnWeight} = this.state;

        var items;
        if(parentKPI === undefined){
            items = [];
        }
        else{    
            items = parentKPI.kpis.filter(item => item.default === 0).map(x => {//default !==0 thì đc. cái này để loại những mục tiêu mặc định?
            return {value: x._id, text: x.name} });
        }

        // hàm để chuyển sang song ngữ
        const { translate } = this.props;

        
        return (
            <React.Fragment>
                {/* <ModalButton modalID="modal-add-target" button_name={translate('organizational_unit_kpi_set.create_organizational_unit_kpi_modal.add_target')} title={translate('organizational_unit_kpi_set.create_organizational_unit_kpi_modal.add_title')}/> */}
                <DialogModal
                    modalID="modal-add-target" isLoading={adding}
                    formID="form-add-target"
                    title={translate('organizational_unit_kpi_set.create_organizational_unit_kpi_modal.create_organizational_unit_kpi')}
                    msg_success={translate('organizational_unit_kpi_set.create_organizational_unit_kpi_modal.success')}
                    msg_faile={translate('organizational_unit_kpi_set.create_organizational_unit_kpi_modal.failure')}
                    func={this.onAddItem}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form id="form-add-target" onSubmit={() => this.onAddItem(translate('organizational_unit_kpi_set.create_organizational_unit_kpi_modal.success'))}>
                        <div className={`form-group ${errorOnName===undefined?"":"has-error"}`}>
                            <label>{translate('organizational_unit_kpi_set.create_organizational_unit_kpi_modal.name')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" value={name} onChange = {this.handleNameChange}/>
                            <ErrorLabel content={errorOnName}/>
                        </div>
                        
                        {(typeof organizationalUnit !== "undefined" && organizationalUnit.parent !== null) &&//unit.parent === null này!!! kiểm tra xem đây là đơn vị gốc hay không!
                                (items.length !== 0) &&
                                    <div className="form-group">
                                    <label>{ translate('organizational_unit_kpi_set.create_organizational_unit_kpi_modal.parents') }</label>
                                    <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                                        id={`parent-target-add`}
                                        className="form-control select2"
                                        style={{width: "100%"}}
                                        items = {items}
                                        onChange={this.handleParentChange}
                                        multiple={false}
                                    />
                                
                            </div>}

                        <div className={`form-group ${errorOnCriteria===undefined?"":"has-error"}`}>
                            <label>{translate('organizational_unit_kpi_set.create_organizational_unit_kpi_modal.evaluation_criteria')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" value={criteria} onChange = {this.handleCriteriaChange}/>
                            <ErrorLabel content={errorOnCriteria}/>
                        </div>

                        <div className={`form-group ${errorOnWeight===undefined?"":"has-error"}`}>
                            <label>{translate('organizational_unit_kpi_set.create_organizational_unit_kpi_modal.weight')}<span className="text-red">*</span></label>
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
    addTargetKPIUnit: createUnitKpiActions.addTargetKPIUnit
};
const connectedOrganizationalUnitKpiAddTargetModal = connect(mapState, actionCreators)(withTranslate(OrganizationalUnitKpiAddTargetModal));
export { connectedOrganizationalUnitKpiAddTargetModal as OrganizationalUnitKpiAddTargetModal };