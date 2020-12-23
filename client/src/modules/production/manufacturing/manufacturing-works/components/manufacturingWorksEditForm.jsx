import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import { ButtonModal, DialogModal, ErrorLabel, SelectBox } from '../../../../../common-components';
import ValidationHelper from '../../../../../helpers/validationHelper';
import { generateCode } from '../../../../../helpers/generateCode';
import { worksActions } from '../redux/actions';

class ManufacturingWorksEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    handleChangeWorksName = (e) => {
        const { value } = e.target;
        this.setState({
            name: value
        });
        let { translate } = this.props;
        let { message } = ValidationHelper.validateName(translate, value, 6, 255);
        this.setState({ nameError: message })
    }

    getListDepartmentArr = () => {
        const { translate, department, manufacturingWorks } = this.props;
        const { currentDepartment } = this.state;
        const { list } = department;
        const { listWorks } = manufacturingWorks;
        let listDepartmentArr = [{
            value: "", text: translate('manufacturing.manufacturing_works.choose_organizational_unit')
        }];

        loop:
        for (let i = 0; i < list.length; i++) {
            for (let j = 0; j < listWorks.length; j++) {
                if (listWorks[j].organizationalUnit._id === list[i]._id) {
                    continue loop;
                }
            }
            listDepartmentArr.push({
                value: list[i]._id,
                text: list[i].name
            });
        }
        listDepartmentArr.push({
            value: currentDepartment._id,
            text: currentDepartment.name
        });

        return listDepartmentArr;
    }

    handleOrganizationalUnitValueChange = (value) => {
        let organizationalUnitValue = value[0];
        this.validateOrganizationalUnitValue(organizationalUnitValue, true);
    }

    validateOrganizationalUnitValue = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate, department } = this.props;
        if (value === "") {
            msg = translate('manufacturing.manufacturing_works.error_organizational_unit')
        }

        if (willUpdateState) {
            const { list } = department;
            let currentDepartment;
            const listDepartment = list.filter(x => x._id === value);
            if (listDepartment.length > 0) {
                currentDepartment = listDepartment[0];
            } else {
                currentDepartment = {
                    name: "",
                    description: ""
                }
            }
            this.setState((state) => ({
                ...state,
                organizationalUnitError: msg,
                organizationalUnitValue: value,
                currentDepartment: currentDepartment,
                name: currentDepartment.name,
                description: currentDepartment.description
            }));
        }
        return msg;
    }

    getListRolesArr = () => {
        const { role } = this.props;
        let { list } = role;
        let listRolesArr = [];
        const { currentDepartment } = this.state;
        // Lấy ra các role trưởng đơn vị của đơn vị hiện tại
        let currentRolesManagerIds = currentDepartment.managers.map(role => role._id);
        if (list) {
            // Lọc các role hiện tại ra khỏi list
            list = list.filter(role => !currentRolesManagerIds.includes(role._id));
            list.map(role => {
                listRolesArr.push({
                    value: role._id,
                    text: role.name
                });
            });
        }
        return listRolesArr;
    }

    handleChangeRoles = (value) => {
        console.log(value);
        this.setState((state) => ({
            ...state,
            manageRoles: value
        }));
        console.log(this.state.manageRoles)
    }


    handlePhoneNumberChange = (e) => {
        const { value } = e.target;
        this.setState({
            phoneNumber: value
        });
        let { translate } = this.props;
        let { message } = ValidationHelper.validateEmpty(translate, value);
        this.setState({ phoneNumberError: message })
    }

    handleAddressChange = (e) => {
        const { value } = e.target;
        this.setState({
            address: value
        });
        let { translate } = this.props;
        let { message } = ValidationHelper.validateEmpty(translate, value);
        this.setState({ addressError: message })
    }

    handleStatusChange = (value) => {
        let status = value[0];
        this.validateStatus(status, true);
    }

    validateStatus = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if (value === "") {
            msg = translate('manufacturing.manufacturing_works.status_error')
        }
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    status: value,
                    statusError: msg
                }
            })
        }
        return msg;
    }

    handleDescriptionChange = (e) => {
        const { value } = e.target;
        this.setState({
            description: value
        })
    }

    isFormValidated = () => {

        const { name, organizationalUnitValue, status, address, phoneNumber } = this.state;
        console.log(this.validateStatus(status, false));
        let { translate } = this.props;
        if (!ValidationHelper.validateName(translate, name, 6, 255).status
            || !ValidationHelper.validateEmpty(translate, address).status
            || !ValidationHelper.validateEmpty(translate, phoneNumber).status
            || this.validateOrganizationalUnitValue(organizationalUnitValue, false)
            || this.validateStatus(status, false)
        ) {
            return false;
        }
        return true;
    }

    save = () => {
        if (this.isFormValidated()) {
            const data = {
                code: this.state.code,
                name: this.state.name,
                organizationalUnit: this.state.organizationalUnitValue,
                address: this.state.address,
                phoneNumber: this.state.phoneNumber,
                status: this.state.status,
                description: this.state.description,
                manageRoles: this.state.manageRoles
            }
            this.props.editManufacturingWorks(this.state.worksId, data);
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.worksId !== prevState.worksId) {
            return {
                ...prevState,
                worksId: nextProps.worksId,
                code: nextProps.code,
                name: nextProps.name,
                organizationalUnitValue: nextProps.organizationalUnitValue,
                address: nextProps.address,
                phoneNumber: nextProps.phoneNumber,
                status: nextProps.status,
                currentDepartment: nextProps.organizationalUnit,
                manageRoles: nextProps.manageRoles,
                description: nextProps.description,
                nameError: undefined,
                organizationalUnitError: undefined,
                addressError: undefined,
                phoneNumberError: undefined,
                statusError: undefined
            }
        }
        return null;
    }


    render() {
        const { translate, manufacturingWorks, worksId } = this.props;
        const { name, nameError, organizationalUnitValue, organizationalUnitError, currentDepartment,
            phoneNumber, phoneNumberError, address, addressError, status, statusError, description, code
            , manageRoles } = this.state;
        return (
            <React.Fragment>
                <DialogModal
                    modalID="modal-edit-works" isLoading={manufacturingWorks.isLoading}
                    formID="form-edit-works"
                    title={translate('manufacturing.manufacturing_works.create_works')}
                    msg_success={translate('manufacturing.manufacturing_works.create_successfully')}
                    msg_faile={translate('manufacturing.manufacturing_works.create_failed')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                    size={50}
                    maxWidth={500}
                >
                    <form id="form-edit-works">
                        <div className="form-group">
                            <label>{translate('manufacturing.manufacturing_works.code')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" value={code} disabled={true}></input>
                        </div>
                        <div className={`form-group ${!organizationalUnitError ? "" : "has-error"}`}>
                            <label>{translate('manufacturing.manufacturing_works.organizational_unit')}<span className="text-red">*</span></label>
                            <SelectBox
                                id={`select-organizational-unit-edit`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                value={organizationalUnitValue}
                                items={this.getListDepartmentArr()}
                                onChange={this.handleOrganizationalUnitValueChange}
                                multiple={false}
                            />
                            <ErrorLabel content={organizationalUnitError} />
                        </div>
                        <div className={`form-group ${!nameError ? "" : "has-error"}`}>
                            <label>{translate('manufacturing.manufacturing_works.name')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" value={name} onChange={this.handleChangeWorksName}></input>
                            <ErrorLabel content={nameError} />
                        </div>
                        {
                            currentDepartment && currentDepartment.managers &&
                            <React.Fragment>
                                <fieldset className="scheduler-border">
                                    <legend className="scheduler-border">{translate('manufacturing.manufacturing_works.list_roles')}</legend>
                                    {
                                        currentDepartment.managers.map((role, index) => {
                                            return (
                                                <div className={`form-group`} key={index}>
                                                    <strong>{role.name}: &emsp;</strong>
                                                    {
                                                        role.users.map((user, index) => {
                                                            if (index === role.users.length - 1) {
                                                                return user.userId.name
                                                            }
                                                            return user.userId.name + ", "
                                                        })
                                                    }
                                                </div>
                                            )
                                        })
                                    }
                                </fieldset>
                                <div className="form-group">
                                    <label>{translate('manufacturing.manufacturing_works.manage_roles')}</label>
                                    <div>
                                        <SelectBox
                                            id={`select-manage-roles-works-${worksId}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={this.getListRolesArr()}
                                            value={manageRoles}
                                            onChange={this.handleChangeRoles}
                                            multiple={true}
                                        />
                                    </div>
                                </div>
                            </React.Fragment>
                        }
                        <div className={`form-group ${!phoneNumberError ? "" : "has-error"}`}>
                            <label>{translate('manufacturing.manufacturing_works.phone')}<span className="text-red">*</span></label>
                            <input type="text" value={phoneNumber} className="form-control" onChange={this.handlePhoneNumberChange}></input>
                            <ErrorLabel content={phoneNumberError} />
                        </div>
                        <div className={`form-group ${!addressError ? "" : "has-error"}`}>
                            <label>{translate('manufacturing.manufacturing_works.address')}<span className="text-red">*</span></label>
                            <input type="text" value={address} className="form-control" onChange={this.handleAddressChange}></input>
                            <ErrorLabel content={addressError} />
                        </div>
                        <div className={`form-group ${!statusError ? "" : "has-error"}`}>
                            <label>{translate('manufacturing.manufacturing_works.status')}<span className="text-red">*</span></label>
                            <SelectBox
                                id={`select-status-edit`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                value={status}
                                items={[
                                    { value: "", text: translate('manufacturing.manufacturing_works.choose_status') },
                                    { value: "1", text: translate('manufacturing.manufacturing_works.1') },
                                    { value: "0", text: translate('manufacturing.manufacturing_works.0') }
                                ]}
                                onChange={this.handleStatusChange}
                                multiple={false}
                            />
                            <ErrorLabel content={statusError} />
                        </div>
                        <div className="form-group">
                            <label>{translate('manufacturing.manufacturing_works.description')}</label>
                            <textarea type="text" value={description} onChange={this.handleDescriptionChange} className="form-control"></textarea>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment >
        );
    }
}

function mapStateToProps(state) {
    const { manufacturingWorks, department, role } = state;
    return { manufacturingWorks, department, role }
}

const mapDispatchToProps = {
    editManufacturingWorks: worksActions.editManufacturingWorks
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ManufacturingWorksEditForm));

