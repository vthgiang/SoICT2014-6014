import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DepartmentActions } from '../redux/actions';
import { DialogModal, ErrorLabel, SelectBox } from '../../../../common-components';
import ValidationHelper from '../../../../helpers/validationHelper';

function DepartmentCreateWithParent(props) {
    const [state, setState] = useState({
        managers: [],
        deputyManagers: [],
        employees: []
    })

    const handleAddManager = (e) => {
        setState({
            ...state,
            managers: [...state.managers, '']
        });
    }

    const handleChangeManager = (e, index) => {
        let { managers } = state;
        managers[index] = e.target.value;
        setState({
            ...state,
            managers
        });
    }

    const handleRemoveManager = (index) => {
        let { managers } = state;
        managers.splice(index, 1);
        setState({
            ...state,
            managers
        });
    }

    const handleAddDeputyManager = (e) => {
        setState({
            ...state,
            deputyManagers: [...state.deputyManagers, '']
        });
    }

    const handleChangeDeputyManager = (e, index) => {
        let { deputyManagers } = state;
        deputyManagers[index] = e.target.value;
        setState({
            ...state,
            deputyManagers
        });
    }

    const handleRemoveDeputyManager = (index) => {
        let { deputyManagers } = state;
        deputyManagers.splice(index, 1);
        setState({
            ...state,
            deputyManagers
        });
    }

    const handleAddEmployee = (e) => {
        setState({
            ...state,
            employees: [...state.employees, '']
        });
    }

    const handleChangeEmployee = (e, index) => {
        let { employees } = state;
        employees[index] = e.target.value;
        setState({
            ...state,
            employees
        });
    }

    const handleRemoveEmployee = (index) => {
        let { employees } = state;
        employees.splice(index, 1);
        setState({
            ...state,
            employees
        });
    }

    // Thiet lap cac gia tri tu props vao state
    useEffect(() => {
        if (props.departmentId !== state.departmentId) {
            setState({
                ...state,
                departmentId: props.departmentId,
                departmentParent: props.departmentParent,
                departmentNameError: undefined,
                departmentDescriptionError: undefined,
                departmentManagerError: undefined,
                departmentDeputyManagerError: undefined,
                departmentEmployeeError: undefined,
            })
        }
    }, [props.departmentId])

    /**
     * Validate form
    */
    const isFormValidated = () => {
        let { departmentName, departmentDescription } = state;
        let { translate } = props;
        if (!ValidationHelper.validateName(translate, departmentName).status || !ValidationHelper.validateDescription(translate, departmentDescription).status) return false;
        return true;
    }

    /**
     * Thực hiện thêm đơn vị mới
    */
    const save = () => {
        if (isFormValidated()) {
            return props.create({
                name: state.departmentName,
                description: state.departmentDescription,
                managers: state.managers,
                deputyManagers: state.deputyManagers,
                employees: state.employees,
                parent: state.departmentParent
            });
        }
    }

    const handleParent = (value) => {
        console.log(value);
        setState({
            ...state,
            departmentParent: value[0]
        })
    }

    const handleName = (e) => {
        let { value } = e.target;
        let { translate } = props;
        let { message } = ValidationHelper.validateName(translate, value, 4, 255);
        setState({
            ...state,
            departmentName: value,
            departmentNameError: message
        });
    }

    const handleDescription = (e) => {
        let { value } = e.target;
        let { translate } = props;
        let { message } = ValidationHelper.validateDescription(translate, value);
        setState({
            ...state,
            departmentDescription: value,
            departmentDescriptionError: message
        });
    }

    const { translate, department } = props;

    const { departmentId } = props;
    const { departmentParent, departmentNameError, departmentDescriptionError } = state;
    console.log("state create organ:", state)

    return (
        <React.Fragment>
            <DialogModal
                isLoading={department.isLoading}
                modalID="modal-create-department-with-parent"
                formID="form-create-department-with-parent"
                title={translate('manage_department.add_title')}
                func={save}
                disableSubmit={!isFormValidated()}
            >
                {/* Form thêm đơn vị mới */}
                <form id="form-create-department-with-parent">

                    {/* Thông tin về đơn vị */}
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border"><span>{translate('manage_department.info')}</span></legend>

                        {/* Tên đơn vị */}
                        <div className={`form-group ${!departmentNameError ? "" : "has-error"}`}>
                            <label>{translate('manage_department.name')}<span className="attention"> * </span></label>
                            <input type="text" className="form-control" onChange={handleName} />
                            <ErrorLabel content={departmentNameError} />
                        </div>

                        {/* Mô tả về đơn vị */}
                        <div className={`form-group ${!departmentDescriptionError ? "" : "has-error"}`}>
                            <label>{translate('manage_department.description')}<span className="attention"> * </span></label>
                            <textarea type="text" className="form-control" onChange={handleDescription} />
                            <ErrorLabel content={departmentDescriptionError} />
                        </div>

                        {/* Đơn vị cha */}
                        <div className="form-group">
                            <label>{translate('manage_department.parent')}</label>
                            <SelectBox
                                id={`cowp-${departmentId}`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={[
                                    { text: "Không có phòng ban cha" }, ...department.list.map(department => { return { value: department ? department._id : null, text: department ? department.name : "" } })
                                ]}
                                onChange={handleParent}
                                value={departmentParent}
                                multiple={false}
                            />
                        </div>
                    </fieldset>

                    {/* Các chức danh của đơn vị */}
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border"><span>{translate('manage_department.roles_of_department')}</span></legend>

                        {/* Tên chức danh cho trưởng đơn vị */}
                        <div className="form-group">
                            <table className="table table-hover table-striped table-bordered">
                                <thead>
                                    <tr>
                                        <th><label>{translate('manage_department.manager_name')}</label></th>
                                        <th style={{ width: '40px' }} className="text-center"><a href="#add-manager" className="text-green" onClick={handleAddManager}><i className="material-icons">add_box</i></a></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        state.managers.length > 0 &&
                                        state.managers.map((manager, index) => {
                                            return <tr key={index}>
                                                <td>
                                                    <input type="text"
                                                        className="form-control"
                                                        placeholder={translate('manage_department.manager_example')}
                                                        value={manager}
                                                        onChange={(e) => handleChangeManager(e, index)}
                                                    />
                                                </td>
                                                <td>
                                                    <a href="#delete-manager"
                                                        className="text-red"
                                                        style={{ border: 'none' }}
                                                        onClick={() => handleRemoveManager(index)}><i className="fa fa-trash"></i>
                                                    </a>
                                                </td>
                                            </tr>
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>

                        {/* Tên chức danh cho phó đơn vị */}
                        <div className="form-group">
                            <table className="table table-hover table-striped table-bordered">
                                <thead>
                                    <tr>
                                        <th><label>{translate('manage_department.deputy_manager_name')}</label></th>
                                        <th style={{ width: '40px' }} className="text-center"><a href="#add-vicemanager" className="text-green" onClick={handleAddDeputyManager}><i className="material-icons">add_box</i></a></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        state.deputyManagers.length > 0 &&
                                        state.deputyManagers.map((vicemanager, index) => {
                                            return <tr key={index}>
                                                <td>
                                                    <input type="text"
                                                        className="form-control"
                                                        placeholder={translate('manage_department.deputy_manager_example')}
                                                        value={vicemanager}
                                                        onChange={(e) => handleChangeDeputyManager(e, index)}
                                                    />
                                                </td>
                                                <td>
                                                    <a href="#delete-vice-manager"
                                                        className="text-red"
                                                        style={{ border: 'none' }}
                                                        onClick={() => handleRemoveDeputyManager(index)}><i className="fa fa-trash"></i>
                                                    </a>
                                                </td>
                                            </tr>
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>

                        {/* Tên chức danh cho nhân viên đơn vị */}
                        <div className="form-group">
                            <table className="table table-hover table-striped table-bordered">
                                <thead>
                                    <tr>
                                        <th><label>{translate('manage_department.employee_name')}</label></th>
                                        <th style={{ width: '40px' }} className="text-center"><a href="#add-employee" className="text-green" onClick={handleAddEmployee}><i className="material-icons">add_box</i></a></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        state.employees.length > 0 &&
                                        state.employees.map((employee, index) => {
                                            return <tr key={index}>
                                                <td>
                                                    <input type="text"
                                                        className="form-control"
                                                        placeholder={translate('manage_department.employee_example')}
                                                        value={employee}
                                                        onChange={(e) => handleChangeEmployee(e, index)}
                                                    />
                                                </td>
                                                <td>
                                                    <a href="#delete-employee"
                                                        className="text-red"
                                                        style={{ border: 'none' }}
                                                        onClick={() => handleRemoveEmployee(index)}><i className="fa fa-trash"></i>
                                                    </a>
                                                </td>
                                            </tr>
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </fieldset>
                </form>
            </DialogModal>
        </React.Fragment>
    );
}

function mapState(state) {
    const { department } = state;
    return { department };
}

const getState = {
    create: DepartmentActions.create
}

export default connect(mapState, getState)(withTranslate(DepartmentCreateWithParent)); 
