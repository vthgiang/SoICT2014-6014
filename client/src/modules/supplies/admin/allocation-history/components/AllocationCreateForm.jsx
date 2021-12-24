import React, { Component, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ButtonModal, DatePicker, DialogModal, ErrorLabel, SelectBox, UploadFile } from '../../../../../common-components';
import { generateCode } from "../../../../../helpers/generateCode";
import { convertJsonObjectToFormData } from '../../../../../helpers/jsonObjectToFormDataObjectConverter';

import { UserActions } from '../../../../super-admin/user/redux/actions';

import ValidationHelper from '../../../../../helpers/validationHelper';
import { AllocationHistoryActions } from '../redux/actions';
import { SuppliesActions } from '../../supplies/redux/actions';
import { DepartmentActions } from '../../../../super-admin/organizational-unit/redux/actions';

function AllocationCreateForm(props) {
    // Function format ngày hiện tại thành dạnh dd-mm-yyyy
    const formatDate = (date) => {
        if (!date) return null;
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) {
            month = '0' + month;
        }

        if (day.length < 2) {
            day = '0' + day;
        }

        return [day, month, year].join('-');
    }
    const getAll = true;
    const [state, setState] = useState({
        date: formatDate(Date.now()),
        supplies: "",
        quantity: 0,
        allocationToOrganizationalUnit: "",
        allocationToUser: "",
    })

    useEffect(() => {
        props.searchSupplies(getAll);
        props.getUser();
        props.getAllDepartments();
    }, []);

    const { _id, translate, allocationHistoryReducer, user, auth, suppliesReducer, department } = props;
    const {
        date, supplies, supplier, quantity, allocationToOrganizationalUnit, allocationToUser,
        errorOnSupplies, errorOnQuantity, errorOnDate, errorOnUnit, errorOnUser,
    } = state;

    // Bắt sự kiện thay đổi "Ngày cấp"
    const handleDateChange = (value) => {
        validateDate(value, true);
    }
    const validateDate = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(props.translate, value);

        if (willUpdateState) {
            setState({
                ...state,
                errorOnDate: message,
                date: value
            });
        }
        return message === undefined;
    }

    // Bắt sự kiện thay đổi "vật tư cấp"
    const handleSuppliesChange = (e) => {
        let value = e[0] !== 'null' ? e[0] : null;
        validateSupplies(value, true);
    }
    const validateSupplies = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(props.translate, value);

        if (willUpdateState) {
            setState({
                ...state,
                errorOnSupplies: message,
                supplies: value,
            });
        }
        return message === undefined;
    }

    // Bắt sự kiện thay đổi "Số lượng"
    const handleQuantityChange = (e) => {
        let value = e.target.value;
        validateQuantity(value, true);
    }
    const validateQuantity = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(props.translate, value);

        if (willUpdateState) {
            setState({
                ...state,
                errorOnQuantity: message,
                quantity: value,
            });
        }
        return message === undefined;
    }

    // Bắt sự kiện thay đổi "đơn vị đc cấp"
    const handleUnitChange = (e) => {
        let value = e[0] !== 'null' ? e[0] : null;
        setState({
            ...state,
            allocationToOrganizationalUnit: value,
        });
    }
    const validateUnit = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(props.translate, value);
        return message === undefined;
    }

    // Bắt sự kiện thay đổi "ng dùng đc cấp"
    const handleUserChange = (e) => {
        let value = e[0] !== 'null' ? e[0] : null;
        setState({
            ...state,
            allocationToUser: value,
        });
    }
    const validateUser = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(props.translate, value);
        return message === undefined;
    }

    // function kiểm tra các trường bắt buộc phải nhập
    const validatorInput = (value) => {
        if (value && value.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
    const isFormValidated = () => {
        const { supplies, quantity, date, allocationToOrganizationalUnit, allocationToUser } = state;
        let result = validateSupplies(supplies, false) &&
            validateQuantity(quantity, false) &&
            validateDate(date, false) &&
            (validateUnit(allocationToOrganizationalUnit, false) ||
                validateUser(allocationToUser, false));
        return result;
    }

    // Bắt sự kiện submit form
    const save = () => {
        let { date } = state;
        let dateData = date.split("-");
        let dataToSubmit = {
            ...state,
            date: new Date(`${dateData[2]}-${dateData[1]}-${dateData[0]}`)
        }
        if (isFormValidated()) {
            return props.createAllocations(dataToSubmit);
        }
    }

    const getDepartment = () => {
        let { department } = props;
        let listUnit = department && department.list
        let unitArr = [];

        listUnit.map(item => {
            unitArr.push({
                value: item._id,
                text: item.name
            })
        })

        return unitArr;
    }

    const getSupplies = () => {
        let { suppliesReducer } = props;
        let listSupplies = suppliesReducer && suppliesReducer.listSupplies;
        let suppliesArr = [];

        listSupplies.map(item => {
            suppliesArr.push({
                value: item._id,
                text: item.suppliesName
            })
        })

        return suppliesArr;
    }

    let suppliesList = getSupplies();
    var userList = user.list && user.list.map(x => {
        return { value: x._id, text: x.name + " - " + x.email }
    })
    let departmentList = getDepartment();

    return (
        <React.Fragment>
            <DialogModal
                size='25' modalID="modal-create-allocation" isLoading={allocationHistoryReducer.isLoading}
                formID="form-create-allocation"
                title={translate('supplies.general_information.add_allocation')}
                func={save}
                disableSubmit={!isFormValidated()}
            >
                {/* Form thêm mới lịch sử cấp vật tư */}
                <form className="form-group" id="form-create-allocation">
                    <div className="col-md-12">
                        {/* Ngày cấp */}
                        <div className="form-group">
                            <label>{translate('supplies.allocation_management.date')}<span className="text-red">*</span></label>
                            <DatePicker
                                id="create_date"
                                value={date}
                                onChange={handleDateChange}
                            />
                            <ErrorLabel content={errorOnDate} />
                        </div>

                        {/* vật tư */}
                        <div className={`form-group ${errorOnSupplies === undefined ? "" : "has-error"}`}>
                            <label>{translate('supplies.allocation_management.supplies')}<span className="text-red">*</span></label>
                            <div>
                                <div id="suppliesBox">
                                    <SelectBox
                                        id={`suppliesSelectBox`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={[{ value: "", text: "Chọn vật tư" }, ...suppliesList]}
                                        onChange={handleSuppliesChange}
                                        value={supplies}
                                        multiple={false}
                                    />
                                </div>
                            </div>
                            <ErrorLabel content={errorOnSupplies} />
                        </div>

                        {/* Số lượng */}
                        <div className={`form-group ${errorOnQuantity === undefined ? "" : "has-error"}`}>
                            <label>{translate('supplies.allocation_management.quantity')} <span className="text-red">*</span></label>
                            <input type="number" className="form-control" name="quantity" min="1" value={quantity}
                                onChange={handleQuantityChange} autoComplete="off" placeholder="Số lượng" />
                            <ErrorLabel content={errorOnQuantity} />
                        </div>

                        {/* đơn vị */}
                        <div className="form-group">
                            <label>{translate('supplies.allocation_management.allocationToOrganizationalUnit')}</label>
                            <div>
                                <div id="unitBox">
                                    <SelectBox
                                        id={`unitSelectBox`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={[{ value: "", text: "Chọn đơn vị" }, ...departmentList]}
                                        onChange={handleUnitChange}
                                        value={allocationToOrganizationalUnit}
                                        multiple={false}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ng dùng*/}
                        <div className="form-group">
                            <label>{translate('supplies.allocation_management.allocationToUser')}</label>
                            <div>
                                <div id="userBox">
                                    <SelectBox
                                        id={`userSelectBox`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={[{ value: "", text: "Chọn người dùng" }, ...userList]}
                                        onChange={handleUserChange}
                                        value={allocationToUser}
                                        multiple={false}
                                    />
                                </div>
                            </div>
                        </div>

                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    );
};

function mapState(state) {
    const { allocationHistoryReducer, auth, user, suppliesReducer, department } = state;
    return { allocationHistoryReducer, auth, user, suppliesReducer, department };
};

const actionCreators = {
    getUser: UserActions.get,
    createAllocations: AllocationHistoryActions.createAllocations,
    searchSupplies: SuppliesActions.searchSupplies,
    getAllDepartments: DepartmentActions.get,
};

const createAllocationForm = connect(mapState, actionCreators)(withTranslate(AllocationCreateForm));
export { createAllocationForm as AllocationCreateForm };

