import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DepartmentActions } from '../redux/actions';

import { DialogModal, ButtonModal, ErrorLabel, SelectBox } from '../../../../common-components';

import { DepartmentValidator } from './organizationalUnitValidator';

class DepartmentCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            departmentName: '',
            departmentDescription: '',
            deans: [],
            viceDeans: [],
            employees: []
        }
    }

    handleAddDean = (e) => {
        this.setState({
            deans: [...this.state.deans, '']
        });
    }

    handleChangeDean = (e, index) => {
        this.state.deans[index] = e.target.value;
        this.setState({ deans: this.state.deans });
    }

    handleRemoveDean = (index) => {
        this.state.deans.splice(index, 1);
        this.setState({ deans: this.state.deans });
    }

    handleAddViceDean = (e) => {
        this.setState({
            viceDeans: [...this.state.viceDeans, '']
        });
    }

    handleChangeViceDean = (e, index) => {
        this.state.viceDeans[index] = e.target.value;
        this.setState({ viceDeans: this.state.viceDeans });
    }

    handleRemoveViceDean = (index) => {
        this.state.viceDeans.splice(index, 1);
        this.setState({ viceDeans: this.state.viceDeans });
    }

    handleAddEmployee = (e) => {
        this.setState({
            employees: [...this.state.employees, '']
        });
    }

    handleChangeEmployee = (e, index) => {
        this.state.employees[index] = e.target.value;
        this.setState({ employees: this.state.employees });
    }

    handleRemoveEmployee = (index) => {
        this.state.employees.splice(index, 1);
        this.setState({ employees: this.state.employees });
    }

    render() {
        const { translate, department } = this.props;
        const { departmentNameError, departmentDescriptionError, departmentDeanError, departmentViceDeanError, departmentEmployeeError } = this.state;
        console.log("state deans:", this.state);

        return (
            <React.Fragment>
                {/* Button thêm đơn vị mới */}
                <ButtonModal modalID="modal-create-department" button_name={translate('manage_department.add')} title={translate('manage_department.add_title')} />

                <DialogModal
                    isLoading={department.isLoading}
                    modalID="modal-create-department"
                    formID="form-create-department"
                    title={translate('manage_department.add_title')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    {/* Form thêm đơn vị mới */}
                    <form id="form-create-department">

                        {/* Thông tin về đơn vị */}
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border"><span>{translate('manage_department.info')}</span></legend>

                            {/* Tên đơn vị */}
                            <div className={`form-group ${!departmentNameError ? "" : "has-error"}`}>
                                <label>{translate('manage_department.name')}<span className="attention"> * </span></label>
                                <input type="text" className="form-control" onChange={this.handleName} /><br />
                                <ErrorLabel content={departmentNameError} />
                            </div>

                            {/* Mô tả về đơn vị */}
                            <div className={`form-group ${!departmentDescriptionError ? "" : "has-error"}`}>
                                <label>{translate('manage_department.description')}<span className="attention"> * </span></label>
                                <textarea type="text" className="form-control" onChange={this.handleDescription} /><br />
                                <ErrorLabel content={departmentDescriptionError} />
                            </div>

                            {/* Đơn vị cha */}
                            <div className="form-group">
                                <label>{translate('manage_department.parent')}</label>
                                <SelectBox
                                    id="create-organizational-unit"
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={[
                                        { text: "Không có phòng ban cha" }, ...department.list.map(department => { return { value: department._id, text: department.name } })
                                    ]}
                                    onChange={this.handleParent}
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
                                            <th><label>{translate('manage_department.dean_name')}</label></th>
                                            <th style={{ width: '40px' }} className="text-center"><a href="#add-dean" className="text-green" onClick={this.handleAddDean}><i className="material-icons">add_box</i></a></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.deans.length > 0 &&
                                            this.state.deans.map((dean, index) => {
                                                return <tr key={index}>
                                                    <td>
                                                        <input type="text"
                                                            className="form-control"
                                                            placeholder={translate('manage_department.dean_example')}
                                                            value={dean}
                                                            onChange={(e) => this.handleChangeDean(e, index)}
                                                        />
                                                    </td>
                                                    <td>
                                                        <a href="#delete-dean"
                                                            className="text-red"
                                                            style={{ border: 'none' }}
                                                            onClick={() => this.handleRemoveDean(index)}><i className="fa fa-trash"></i>
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
                                            <th><label>{translate('manage_department.vice_dean_name')}</label></th>
                                            <th style={{ width: '40px' }} className="text-center"><a href="#add-vicedean" className="text-green" onClick={this.handleAddViceDean}><i className="material-icons">add_box</i></a></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.viceDeans.length > 0 &&
                                            this.state.viceDeans.map((vicedean, index) => {
                                                return <tr key={index}>
                                                    <td>
                                                        <input type="text"
                                                            className="form-control"
                                                            placeholder={translate('manage_department.vice_dean_example')}
                                                            value={vicedean}
                                                            onChange={(e) => this.handleChangeViceDean(e, index)}
                                                        />
                                                    </td>
                                                    <td>
                                                        <a href="#delete-vice-dean"
                                                            className="text-red"
                                                            style={{ border: 'none' }}
                                                            onClick={() => this.handleRemoveViceDean(index)}><i className="fa fa-trash"></i>
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
                                            this.state.employees.length > 0 &&
                                            this.state.employees.map((employee, index) => {
                                                return <tr key={index}>
                                                    <td>
                                                        <input type="text"
                                                            className="form-control"
                                                            placeholder={translate('manage_department.employee_example')}
                                                            value={employee}
                                                            onChange={(e) => this.handleChangeEmployee(e, index)}
                                                        />
                                                    </td>
                                                    <td>
                                                        <a href="#delete-employee"
                                                            className="text-red"
                                                            style={{ border: 'none' }}
                                                            onClick={() => this.handleRemoveEmployee(index)}><i className="fa fa-trash"></i>
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

    /**
     * Validate form
     */
    isFormValidated = () => {
        let result =
            this.validateName(this.state.departmentName, false) &&
            this.validateDescription(this.state.departmentDescription, false)

        return result;
    }

    /**
     * Thực hiện thêm đơn vị mới
     */
    save = () => {
        if (this.isFormValidated()) {
            return this.props.create({
                name: this.state.departmentName,
                description: this.state.departmentDescription,
                deans: this.state.deans,
                viceDeans: this.state.viceDeans,
                employees: this.state.employees,
                parent: this.state.departmentParent
            });
        }
    }

    handleParent = (value) => {
        this.setState(state => {
            return {
                ...state,
                departmentParent: value[0]
            }
        })
    }

    handleName = (e) => {
        const { value } = e.target;
        this.validateName(value, true);
    }
    validateName = (value, willUpdateState = true) => {
        let msg = DepartmentValidator.validateName(value);
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    departmentNameError: msg,
                    departmentName: value,
                }
            });
        }
        return msg === undefined;
    }

    handleDescription = (e) => {
        const { value } = e.target;
        this.validateDescription(value, true);
    }
    validateDescription = (value, willUpdateState = true) => {
        let msg = DepartmentValidator.validateName(value);
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    departmentDescriptionError: msg,
                    departmentDescription: value,
                }
            });
        }
        return msg === undefined;
    }

}

const mapState = state => state;
const getState = {
    create: DepartmentActions.create
}

export default connect(mapState, getState)(withTranslate(DepartmentCreateForm)); 
