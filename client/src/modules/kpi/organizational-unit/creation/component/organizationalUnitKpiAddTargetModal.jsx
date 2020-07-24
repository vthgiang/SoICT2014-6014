import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ErrorLabel, SelectBox } from '../../../../../common-components';

import { createUnitKpiActions } from '../redux/actions';

import { UserFormValidator } from '../../../../super-admin/user/components/userFormValidator';

class OrganizationalUnitKpiAddTargetModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            parent: null,
            weight: "",
            criteria: "",
            organizationalUnitKpiSetId: "",
            
            adding: false,
            submitted: false,

            errorOnName: undefined,
            errorOnCriteria: undefined,
            errorOnWeight: undefined,
        };
    }

    componentDidMount() {
        // Get all parent target of unit
        this.props.getParentTarget(localStorage.getItem("currentRole"));
    }

    onAddItem = async () => {
        let parentKPI = null;
        let items;
        let parent = null;
        const { createKpiUnit } = this.props;

        if (createKpiUnit.parent) {
            parentKPI = createKpiUnit.parent;
        }

        if (!this.state.parent) {
            if (!parentKPI){
                parent = null;
            } else {    
                items = parentKPI.kpis.filter(item => item.type === 0).map(x => {
                    return {value: x._id, text: x.name}
                });

                parent = items[0].value;
            }    
        } else {
            parent = this.state.parent;
        }
        
        if (this.isFormValidated()){
            return await this.props.addTargetKPIUnit({
                name: this.state.name,
                parent: parent,
                weight: this.state.weight,
                criteria: this.state.criteria,
                organizationalUnitKpiSetId: this.props.organizationalUnitKpiSetId, 
            });
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
        if (value.trim() === "") {
            msg = "Trọng số không được để trống";
        } else if (value < 0){
            msg = "Trọng số không được nhỏ hơn 0";
        } else if (value > 100){
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
        const { name, adding, weight, criteria, errorOnName, errorOnCriteria, errorOnWeight } = this.state;
        const { createKpiUnit } = this.props; // Redux
        const { organizationalUnit } = this.props; // Truyền từ component cha
        const { translate } = this.props; // Hàm để chuyển sang song ngữ

        let parentKPI;
        if (createKpiUnit.parent) {
            parentKPI = createKpiUnit.parent;
        }

        let items;
        if(parentKPI === undefined){
            items = [];
        } else {    
            items = parentKPI.kpis.filter(item => item.type === 0).map(x => {//type !==0 thì đc. cái này để loại những mục tiêu mặc định?
                return {value: x._id, text: x.name};
            });
        }
        
        return (
            <React.Fragment>
                <DialogModal
                    modalID="modal-add-target" isLoading={adding}
                    formID="form-add-target"
                    title={translate('kpi.organizational_unit.create_organizational_unit_kpi_modal.create_organizational_unit_kpi')}
                    msg_success={translate('kpi.organizational_unit.create_organizational_unit_kpi_modal.success')}
                    msg_faile={translate('kpi.organizational_unit.create_organizational_unit_kpi_modal.failure')}
                    func={this.onAddItem}
                    disableSubmit={!this.isFormValidated()}>
                    
                    {/* Form thêm mục tiêu */}
                    <form id="form-add-target" onSubmit={() => this.onAddItem(translate('kpi.organizational_unit.create_organizational_unit_kpi_modal.success'))}>
                        {/* Tên mục tiêu */}
                        <div className={`form-group ${errorOnName===undefined? "": "has-error"}`}>
                            <label>{translate('kpi.organizational_unit.create_organizational_unit_kpi_modal.name')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" value={name} onChange = {this.handleNameChange}/>
                            <ErrorLabel content={errorOnName}/>
                        </div>
                        
                        {/* Mục tiêu cha */}
                        {(organizationalUnit && organizationalUnit.parent) && (items.length !== 0) && // unit.parent === null này!!! kiểm tra xem đây là đơn vị gốc hay không!
                            <div className="form-group">
                                <label>{translate('kpi.organizational_unit.create_organizational_unit_kpi_modal.parents')}</label>
                                <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                                    id={`parent-target-add`}
                                    className="form-control select2"
                                    style={{width: "100%"}}
                                    items = {items}
                                    onChange={this.handleParentChange}
                                    multiple={false}
                                />
                            </div>
                        }

                        {/* Tiêu chí đánh giá */}
                        <div className={`form-group ${!errorOnCriteria? "": "has-error"}`}>
                            <label>{translate('kpi.organizational_unit.create_organizational_unit_kpi_modal.evaluation_criteria')}<span className="text-red">*</span></label>
                            <textarea rows={4} className="form-control" value={criteria} onChange = {this.handleCriteriaChange}/>
                            <ErrorLabel content={errorOnCriteria}/>
                        </div>

                        {/* Trọng số */}
                        <div className={`form-group ${!errorOnWeight? "": "has-error"}`}>
                            <label>{translate('kpi.organizational_unit.create_organizational_unit_kpi_modal.weight')}<span className="text-red">*</span></label>
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
    addTargetKPIUnit: createUnitKpiActions.addTargetKPIUnit,
};

const connectedOrganizationalUnitKpiAddTargetModal = connect(mapState, actionCreators)(withTranslate(OrganizationalUnitKpiAddTargetModal));
export { connectedOrganizationalUnitKpiAddTargetModal as OrganizationalUnitKpiAddTargetModal };