import React, {Component, useState} from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { createUnitKpiActions } from '../../../organizational-unit/creation/redux/actions';
import { createKpiSetActions } from "../redux/actions";

import { DialogModal, ErrorLabel, SelectBox, QuillEditor } from '../../../../../common-components';

import ValidationHelper from '../../../../../helpers/validationHelper';


function ModalCreateEmployeeKpi(props) {
    var translate = props.translate;

    const [state, setState] = useState({
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
    });

    const { adding, name, weight, criteria, errorOnName, errorOnCriteria, errorOnWeight, parent} = state;
    const { createKpiUnit } = props;
    var currentOrganizationalUnitKpiSet;

    /**
     * Khởi tạo 1 target mới trong tập kpi
     */
    const handleCreateEmployeeKpi = async () => {
        let currentOrganizationalKpiSet = null;
        let items;
        let parent = null;
        const { createKpiUnit } = props;
        if (createKpiUnit.currentKPI) currentOrganizationalKpiSet = createKpiUnit.currentKPI;
        if(state.parent === null){
            if(!currentOrganizationalKpiSet){
                parent = null;
            }
            else{
                items = currentOrganizationalKpiSet.kpis.filter(item => item.type === 0).map(x => {//type !==0 thì đc. cái này để loại những mục tiêu mặc định?
                    return {value: x._id, text: x.name} });

                parent = items && items[0] && items[0].value;
            }
        }
        else{
            parent = state.parent
        }

        if (isFormValidated()){
            let employeeKpi = {
                name: state.name,
                parent: parent,
                weight: state.weight,
                criteria: state.criteria,
                employeeKpiSet: props.employeeKpiSet,
            }
            let res = await props.createEmployeeKpi(employeeKpi);
            window.$("#createEmployeeKpi").modal("hide");
            window.$(".modal-backdrop").remove();
            window.$('body').removeClass('modal-open');
            window.$('body').css('padding-right',"0px");

            return res;
        }
    };

    const handleNameChange = (e) => {
        let value = e.target.value;
        let validation = ValidationHelper.validateName(translate, value);

        setState(state => {
            return {
                ...state,
                errorOnName: validation.message,
                name: value,
            }
        });
    };

    const handleParentChange = (value) => {
        setState( {
            ...state,
            parent: value,
        });
    };

   const handleCriteriaChange = (value, imgs) => {
        let validation = ValidationHelper.validateDescription(translate, value);

        setState( {
            ...state,
            errorOnCriteria: validation.message,
            criteria: value,
        });
    };

    const handleWeightChange = (e) => {
        let value = e.target.value;
        let validation = validateWeight(translate, value);

        setState( {
            ...state,
            errorOnWeight: validation.message,
            weight: value,
        });
    };

   const validateWeight = (translate, value) => {
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
    };

   const isFormValidated = () => {
        const { name, criteria, weight } = state;

        let validatateName, validateCriteria, result, validation;

        validatateName = ValidationHelper.validateName(translate, name);
        validateCriteria = ValidationHelper.validateDescription(translate, criteria);
        validation = validateWeight(translate, weight)

        result = validatateName.status && validateCriteria.status && validation.status;

        return result;
    };


    if (createKpiUnit.currentKPI) currentOrganizationalUnitKpiSet = createKpiUnit.currentKPI;
    var items;

    if(currentOrganizationalUnitKpiSet === undefined){
        items = [];
    } else {
        items = currentOrganizationalUnitKpiSet.kpis.filter(item => item.type === 0).map(x => {//type !==0 thì đc. cái này để loại những mục tiêu mặc định?
            return {value: x._id, text: x.name} });
    }

    return (
        <React.Fragment>
            <DialogModal
                modalID="createEmployeeKpi" isLoading={adding}
                formID="formCreateEmployeeKpi"
                title={translate('kpi.employee.employee_kpi_set.create_employee_kpi_modal.create_employee_kpi')}
                msg_success={translate('kpi.employee.employee_kpi_set.create_employee_kpi_modal.success')}
                msg_failure={translate('kpi.employee.employee_kpi_set.create_employee_kpi_modal.failure')}
                func={handleCreateEmployeeKpi}
                disableSubmit={!isFormValidated()}
            >
                {/**Form chứa thông tin của 1 mục tiêu trong 1 tập KPI */}
                <form id="formCreateEmployeeKpi" onSubmit={() => handleCreateEmployeeKpi(translate('kpi.employee.employee_kpi_set.create_employee_kpi_modal.success'))}>

                    {/**Tên của mục tiêu */}
                    <div className={`form-group ${errorOnName===undefined?"":"has-error"}`}>
                        <label>{translate('kpi.employee.employee_kpi_set.create_employee_kpi_modal.name')}<span className="text-red">*</span></label>
                        <input type="text" className="form-control" value={name} onChange = {handleNameChange}/>
                        <ErrorLabel content={errorOnName}/>
                    </div>

                    {/**Mục tiêu cha của mục tiêu này */}
                    {(createKpiUnit?.currentKPI) &&//unit.parent === null này!!! kiểm tra xem đây là đơn vị gốc hay không!
                        (items?.length > 0) &&
                        <div className="form-group">
                            <label>{ translate('kpi.employee.employee_kpi_set.create_employee_kpi_modal.parents')}<span className="text-red">*</span></label>
                            <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                                id={`parent-target-add`}
                                className="form-control select2"
                                style={{width: "100%"}}
                                items = {items}
                                onChange={handleParentChange}
                                multiple={false}
                                value={parent ? parent : ""}
                            />
                        </div>
                    }

                    {/**Mô tả của mục tiêu này */}
                    <div className={`form-group ${errorOnCriteria===undefined?"":"has-error"}`}>
                        <label>{translate('kpi.employee.employee_kpi_set.create_employee_kpi_modal.evaluation_criteria')}<span className="text-red">*</span></label>
                        <QuillEditor
                            id={'create-employee-kpi'}
                            getTextData={handleCriteriaChange}
                            toolbar={false}
                        />
                        <ErrorLabel content={errorOnCriteria} />
                    </div>

                    {/**Trọng số của mục tiêu này */}
                    <div className={`form-group ${errorOnWeight===undefined?"":"has-error"}`}>
                        <label>{translate('kpi.employee.employee_kpi_set.create_employee_kpi_modal.weight')}<span className="text-red">*</span></label>
                        <input type="number" className="form-control" value={weight} onChange = {handleWeightChange}/>
                        <ErrorLabel content={errorOnWeight}/>
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    );
}

function mapState(state) {
    const { createKpiUnit } = state;
    return { createKpiUnit };
}

const actionCreators = {
    createEmployeeKpi: createKpiSetActions.createEmployeeKpi
};

const connectedModalCreateEmployeeKpi = connect( mapState, actionCreators )( withTranslate(ModalCreateEmployeeKpi) );
export { connectedModalCreateEmployeeKpi as ModalCreateEmployeeKpi };
