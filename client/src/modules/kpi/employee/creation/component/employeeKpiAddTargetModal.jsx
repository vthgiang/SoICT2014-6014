import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createUnitKpiActions } from '../../../organizational-unit/creation/redux/actions';
import { createKpiActions } from "../redux/actions";
import { withTranslate } from 'react-redux-multilingual';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DialogModal, ButtonModal, ErrorLabel, SelectBox } from '../../../../../common-components';
import { UserFormValidator} from '../../../../super-admin/user/components/userFormValidator';

var translate = '';
class ModalAddTargetKPIPersonal extends Component {
    componentDidMount() {
        // get all parent target of unit
        this.props.getParentTarget(localStorage.getItem("currentRole"));
    }

    constructor(props) {
        super(props);
        translate = this.props.translate;
        this.state = {
            name: "",
            parent: null,
            weight: "",
            criteria: "",
            kpipersonal: "",

            errorOnName: undefined,
            errorOnCriteria: undefined,
            errorOnWeight: undefined,

            adding: false,
            submitted: false
        };

        this.onAddItem = this.onAddItem.bind(this);

    }

    // function: notification the result of an action
    notifysuccess = (message) => toast.success(message, {containerId: 'toast-notification'});

    // function: create new target of personal kpi
    onAddItem = async () => {
        let currentKPI = null;
        let items;
        let parent = null;
        const { createKpiUnit } = this.props;
        if (createKpiUnit.currentKPI) currentKPI = createKpiUnit.currentKPI;
        if(this.state.parent === null){
            if(currentKPI === null){
                parent = null;
            }
            else{    
                items = currentKPI.listtarget.filter(item => item.default === 0).map(x => {//default !==0 thì đc. cái này để loại những mục tiêu mặc định?
                    return {value: x._id, text: x.name} });

                parent = items[0].value;
            }    
        }
        else{
            parent = this.state.parent
        }

        if (this.isFormValidated()){
            let res = await this.props.addNewTargetPersonal({
                name: this.state.name,
                parent: parent,
                weight: this.state.weight,
                criteria: this.state.criteria,
                kpipersonal: this.props.kpipersonal, 
            });

            window.$("#addNewTargetKPIPersonal").modal("hide");
            window.$(".modal-backdrop").remove();
            window.$('body').removeClass('modal-open');
            window.$('body').css('padding-right',"0px");

            return res;
        }

        
        
        // if (newTarget.parent && newTarget.name && newTarget.weight && newTarget.criteria) {
        //     this.props.addNewTargetPersonal(newTarget);
        //     window.$("#addNewTargetKPIPersonal").modal("hide");
        //     window.$(".modal-backdrop").remove();
        //     window.$('body').removeClass('modal-open');
        //     window.$('body').css('padding-right',"0px");
        //     this.notifysuccess(translate('kpi_personal.add_target_kpi.add_success'));
        // }
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
        var parentTargets;
        const { newTarget, adding } = this.state;
        const { createKpiUnit, translate } = this.props;
        if (createKpiUnit.currentKPI) parentTargets = createKpiUnit.currentKPI.listtarget;

        var items;
        if(createKpiUnit.currentKPI === null){
            items = [];
        }
        else{    
            items = parentTargets.filter(item => item.default === 0).map(x => {//default !==0 thì đc. cái này để loại những mục tiêu mặc định?
            return {value: x._id, text: x.name} });
        }

        const{ name, parent, weight, criteria, errorOnName, errorOnCriteria, errorOnWeight} = this.state;

        return (
            <React.Fragment>
                <DialogModal
                    modalID="addNewTargetKPIPersonal" isLoading={adding}
                    formID="formAddNewTargetKPIPersonal"
                    title={translate('kpi_personal.add_target_kpi.add_target_personal')}
                    msg_success={translate('kpi_personal.add_target_kpi.add_success')}
                    msg_faile={translate('kpi_unit_create.error')}
                    func={this.onAddItem}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form id="formAddNewTargetKPIPersonal" onSubmit={() => this.onAddItem(translate('kpi_unit_create.add_target_success'))}>
                        <div className={`form-group ${errorOnName===undefined?"":"has-error"}`}>
                            <label>{translate('kpi_unit_create.target_name')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" value={name} onChange = {this.handleNameChange}/>
                            <ErrorLabel content={errorOnName}/>
                        </div>
                        
                        {(createKpiUnit.currentKPI !== null) &&//unit.parent === null này!!! kiểm tra xem đây là đơn vị gốc hay không!
                                (items.length !== 0) &&
                                    <div className="form-group">
                                    <label>{ translate('kpi_unit_create.on_target') }</label>
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
                            <label>{translate('kpi_unit_create.criteria')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" value={criteria} onChange = {this.handleCriteriaChange}/>
                            <ErrorLabel content={errorOnCriteria}/>
                        </div>

                        <div className={`form-group ${errorOnWeight===undefined?"":"has-error"}`}>
                            <label>{translate('kpi_unit_create.weight')}<span className="text-red">*</span></label>
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
    getParentTarget: createUnitKpiActions.getCurrentKPIUnit,
    addNewTargetPersonal: createKpiActions.addNewTargetPersonal
};

const connectedModalAddTargetKPIPersonal = connect( mapState, actionCreators )( withTranslate(ModalAddTargetKPIPersonal) );
export { connectedModalAddTargetKPIPersonal as ModalAddTargetKPIPersonal };
