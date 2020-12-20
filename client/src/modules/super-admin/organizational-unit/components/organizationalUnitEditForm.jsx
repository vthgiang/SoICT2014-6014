import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ErrorLabel, SelectBox } from '../../../../common-components';
import { DepartmentActions } from '../redux/actions';
import ValidationHelper from '../../../../helpers/validationHelper';

class DepartmentEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            managers: [],
            deputyManagers: [],
            employees: []
        }
    }

    handleAddManager = () => {
        this.setState({
            managers: [...this.state.managers, { name: "" }]
        });
    }

    handleChangeManager = (e, index) => {
        let { managers } = this.state;
        managers[index].name = e.target.value;
        this.setState({ managers });
    }

    handleRemoveManager = (index) => {
        let { managers } = this.state;
        managers.splice(index, 1);
        this.setState({ managers });
    }

    handleAddDeputyManager = () => {
        this.setState({
            deputyManagers: [...this.state.deputyManagers, { name: "" }]
        });
    }

    handleChangeDeputyManager = (e, index) => {
        let { deputyManagers } = this.state;
        deputyManagers[index].name = e.target.value;
        this.setState({ deputyManagers });
    }

    handleRemoveDeputyManager = (index) => {
        let { deputyManagers } = this.state;
        deputyManagers.splice(index, 1);
        this.setState({ deputyManagers });
    }

    handleAddEmployee = () => {
        this.setState({
            employees: [...this.state.employees, { name: "" }]
        });
    }

    handleChangeEmployee = (e, index) => {
        let { employees } = this.state;
        employees[index].name = e.target.value;
        this.setState({ employees });
    }

    handleRemoveEmployee = (index) => {
        let { employees } = this.state;
        employees.splice(index, 1);
        this.setState({ employees });
    }

    // Thiet lap cac gia tri tu props vao state
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.departmentId !== prevState.departmentId) {
            return {
                ...prevState,
                departmentId: nextProps.departmentId,
                departmentName: nextProps.departmentName,
                departmentDescription: nextProps.departmentDescription,
                departmentParent: nextProps.departmentParent,
                managers: nextProps.managers,
                deputyManagers: nextProps.deputyManagers,
                employees: nextProps.employees,
                departmentNameError: undefined,
                departmentDescriptionError: undefined,
                departmentManagerError: undefined,
                departmentDeputyManagerError: undefined,
                departmentEmployeeError: undefined,
            }
        } else {
            return null;
        }
    }

    isFormValidated = () => {
        let { departmentName, departmentDescription } = this.state;
        let { translate } = this.props;
        if (!ValidationHelper.validateName(translate, departmentName).status || !ValidationHelper.validateDescription(translate, departmentDescription).status) return false;
        return true;
    }

    save = () => {
        const data = {
            _id: this.state.departmentId,
            name: this.state.departmentName,
            description: this.state.departmentDescription,
            parent: this.state.departmentParent,
            managers: this.state.managers,
            deputyManagers: this.state.deputyManagers,
            employees: this.state.employees
        };

        if (this.isFormValidated()) {
            return this.props.edit(data);
        }
    }

    handleParent = (value) => {
        this.setState({
            departmentParent: value[0]
        })
    }

    handleName = (e) => {
        let { value } = e.target;
        let { translate } = this.props;
        let { message } = ValidationHelper.validateName(translate, value, 4, 255);
        this.setState({
            departmentName: value,
            departmentNameError: message
        });
    }

    handleDescription = (e) => {
        let { value } = e.target;
        let { translate } = this.props;
        let { message } = ValidationHelper.validateDescription(translate, value);
        this.setState({
            departmentDescription: value,
            departmentDescriptionError: message
        });
    }

    render() {
        const { translate, department } = this.props;
        const {
            departmentId,
            departmentName,
            departmentDescription,
            departmentParent,
            managers,
            deputyManagers,
            employees,
            departmentNameError,
            departmentDescriptionError
        } = this.state;

        return (
            <React.Fragment>
                <DialogModal
                    isLoading={department.isLoading}
                    modalID="modal-edit-department"
                    formID="form-edit-department"
                    title={translate('manage_department.info')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    {/* Form chỉnh sửa thông tin về đơn vị */}
                    <form id="form-edit-department">

                        {/* Thông tin về đơn vị */}
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border"><span>{translate('manage_department.info')}</span></legend>

                            {/* Tên đơn vị */}
                            <div className={`form-group ${!departmentNameError ? "" : "has-error"}`}>
                                <label>{translate('manage_department.name')}<span className="attention"> * </span></label>
                                <input type="text" className="form-control" onChange={this.handleName} value={departmentName} />
                                <ErrorLabel content={departmentNameError} />
                            </div>

                            {/* Mô tả về đơn vị */}
                            <div className={`form-group ${!departmentDescriptionError ? "" : "has-error"}`}>
                                <label>{translate('manage_department.description')}<span className="attention"> * </span></label>
                                <textarea type="text" className="form-control" onChange={this.handleDescription} value={departmentDescription} />
                                <ErrorLabel content={departmentDescriptionError} />
                            </div>

                            {/* Đơn vị cha */}
                            <div className="form-group">
                                <label>{translate('manage_department.parent')}</label>
                                <SelectBox
                                    id={`edit-owp-${departmentId}`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={[
                                        { text: "Không có phòng ban cha" }, ...department.list.filter(department => department && department._id !== departmentId).map(department => { return { value: department ? department._id : null, text: department ? department.name : "" } })
                                    ]}
                                    onChange={this.handleParent}
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
                                            <th style={{ width: '40px' }} className="text-center"><a href="#add-manager" className="text-green" onClick={this.handleAddManager}><i className="material-icons">add_box</i></a></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            managers && managers.length > 0 &&
                                            managers.map((manager, index) => {
                                                return <tr key={`manager-add-${index}`}>
                                                    <td>
                                                        <input type="text"
                                                            className="form-control"
                                                            name={`manager${index}`}
                                                            placeholder={translate('manage_department.manager_example')}
                                                            value={manager ? manager.name : ""}
                                                            onChange={(e) => this.handleChangeManager(e, index)}
                                                        />
                                                    </td>
                                                    <td>
                                                        <a href="#delete-manager"
                                                            className="text-red"
                                                            style={{ border: 'none' }}
                                                            onClick={() => this.handleRemoveManager(index)}><i className="fa fa-trash"></i>
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
                                            <th style={{ width: '40px' }} className="text-center"><a href="#add-vicemanager" className="text-green" onClick={this.handleAddDeputyManager}><i className="material-icons">add_box</i></a></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            deputyManagers && deputyManagers.length > 0 &&
                                            deputyManagers.map((vicemanager, index) => {
                                                return <tr key={`vicemanager-add-${index}`}>
                                                    <td>
                                                        <input type="text"
                                                            className="form-control"
                                                            name={`vicemanager${index}`}
                                                            placeholder={translate('manage_department.deputy_manager_example')}
                                                            value={vicemanager ? vicemanager.name : ""}
                                                            onChange={(e) => this.handleChangeDeputyManager(e, index)}
                                                        />
                                                    </td>
                                                    <td>
                                                        <a href="#delete-vice-manager"
                                                            className="text-red"
                                                            style={{ border: 'none' }}
                                                            onClick={() => this.handleRemoveDeputyManager(index)}><i className="fa fa-trash"></i>
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
                                            <th style={{ width: '40px' }} className="text-center"><a href="#add-employee" className="text-green" onClick={this.handleAddEmployee}><i className="material-icons">add_box</i></a></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            employees && employees.length > 0 &&
                                            employees.map((employee, index) => {
                                                return <tr key={`employee-add${index}`}>
                                                    <td><input type="text"
                                                        className="form-control"
                                                        name={`employee${index}`}
                                                        placeholder={translate('manage_department.employee_example')}
                                                        value={employee ? employee.name : ""}
                                                        onChange={(e) => this.handleChangeEmployee(e, index)}
                                                    /></td>
                                                    <td><a href="#delete-employee"
                                                        className="text-red"
                                                        style={{ border: 'none' }}
                                                        onClick={() => this.handleRemoveEmployee(index)}><i className="fa fa-trash"></i>
                                                    </a></td>
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
}

function mapState(state) {
    const { department } = state;
    return { department };
}

const getState = {
    edit: DepartmentActions.edit
}
export default connect(mapState, getState)(withTranslate(DepartmentEditForm)); 
