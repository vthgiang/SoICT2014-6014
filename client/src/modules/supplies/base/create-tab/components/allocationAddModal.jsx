import React, { Component, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ButtonModal, ErrorLabel, DatePicker, SelectBox } from '../../../../../common-components';

import ValidationHelper from '../../../../../helpers/validationHelper';
import { DepartmentActions } from '../../../../super-admin/organizational-unit/redux/actions';
import { UserActions } from '../../../../super-admin/user/redux/actions';

function AllocationAddModal(props) {
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
    const [state, setState] = useState({
        date: formatDate(Date.now()),
        quantity: 0,
        allocationToOrganizationalUnit: "",
        allocationToUser: "",
    })

    useEffect(() => {
        props.getUser();
        props.getAllDepartments();
    }, []);

    const { id } = props;
    const { _id, translate, user, auth, department } = props;
    const {
        date, quantity, allocationToOrganizationalUnit, allocationToUser,
        errorOnQuantity, errorOnDate, errorOnUnit, errorOnUser,
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
        console.log("hang e",e);
        let value = e[0] !== 'null' ? e[0] : null;
        // setState({
        //     ...state,
        //     allocationToOrganizationalUnit: value,
        // });
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

    // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
    const isFormValidated = () => {
        const { quantity, date, allocationToOrganizationalUnit, allocationToUser } = state;
        let result = validateQuantity(quantity, false) &&
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
            return props.handleChange(dataToSubmit);
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

    var userlist = user.list, departmentlist = department.list;

    return (
        <React.Fragment>
            {/* Button thêm mới thong tin cap phat */}

            <DialogModal
                size='75' modalID={`modal-create-allocation-tab-${id}`} isLoading={false}
                formID={`form-create-allocation-tab-${id}`}
                title={translate('supplies.general_information.add_allocation')}
                func={save}
                disableSubmit={!isFormValidated()}
            >
                {/* Form thêm mới thong tin cap phat */}
                <form className="form-group" id={`form-create-allocation-tab-${id}`}>
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
                                <div id={`unitEditBox-${id}`}>
                                    <SelectBox
                                        id={`unitEditSelectBox-${id}`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={[{ value: 'null', text: 'Chọn đơn vị sử dụng' }, ...departmentlist.map(x => { return { value: x._id, text: x.name } })]}
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
                                <div id={`userEditBox-${id}`}>
                                    <SelectBox
                                        id={`userEditSelectBox-${id}`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={[{ value: 'null', text: 'Chọn người được cấp phát' }, ...userlist.map(x => { return { value: x._id, text: x.name + " - " + x.email } })]}
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
    const { auth, user, department } = state;
    return { auth, user, department };
};

const actionCreators = {
    getUser: UserActions.get,
    getAllDepartments: DepartmentActions.get,
};

const addAllocationModal = connect(mapState, actionCreators)(withTranslate(AllocationAddModal));
export { addAllocationModal as AllocationAddModal };
