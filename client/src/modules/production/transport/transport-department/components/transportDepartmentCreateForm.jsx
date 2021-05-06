import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ButtonModal, DialogModal, ErrorLabel, DatePicker, SelectBox } from '../../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import { generateCode } from "../../../../../helpers/generateCode";
import { formatToTimeZoneDate } from "../../../../../helpers/formatDate"
import ValidationHelper from '../../../../../helpers/validationHelper';

import { transportDepartmentActions } from "../redux/actions"
import { DepartmentActions } from "../../../../super-admin/organizational-unit/redux/actions";


function TransportDepartmentCreateForm(props) {

    let { allDepartments } = props;
    
    // Chứa 2 giá trị 2 trường nhập vào và lỗi
    const [formState, setFormState] = useState({
        _id: "",
        value: "title",
    })

    const save = () => {
        let data = {
            organizationalUnit: formState._id,
            role: formState.value,
        }
        props.createTransportDepartment(data);
    }
    /**
     * Xác thực form
     */
    const isFormValidated = () => {
        if (formState._id!=="" && formState.value!=="title") return true;
        else return false
    }
    const getListDepartmentArr = () => {
        let listDepartmentArr = [
            {
                value: "",
                text: "---Chọn đơn vị---",
            },
        ];
        (allDepartments && allDepartments.length !==0)
            && allDepartments.map((item, index) => {
                listDepartmentArr.push({
                    value: item._id,
                    text: item.name,
                });
            })
        return listDepartmentArr;
    };

    const handleOrganizationalUnitChange = (value) => {
        setFormState({
            ...formState,
            _id: value[0],
        });
    };

    const handleRoleChange = (value) => {
        setFormState({
            ...formState,
            value: value[0],
        });
    }

    useEffect(() => {
        props.getAllDepartments();
    }, [])

    return (
        <React.Fragment>
            <ButtonModal
                    // onButtonCallBack={handleClickCreateCode}
                    modalID={"modal-create-transport-plan"}
                    button_name={"Thêm cấu hình đơn vị"}
                    title={"Thêm cấu hình đơn vị"}
            />
            <DialogModal
                modalID="modal-create-transport-plan" 
                isLoading={false}
                formID="form-create-transport-requirements"
                title={"Phân vai trò đơn vị vận chuyển"}
                msg_success={"success"}
                msg_faile={"fail"}
                func={save}
                // disableSubmit={!isFormValidated()}
                size={50}
                maxWidth={500}
            >
                <form id="form-create-business-department">
                    <div className={`form-group`}>
                        <label>
                            {"Đơn vị"}
                            <span className="text-red">*</span>
                        </label>
                        <SelectBox
                            id={`select-organizational-unit-create-for-transport-department`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            value={formState._id}
                            items={getListDepartmentArr()}
                            onChange={handleOrganizationalUnitChange}
                            multiple={false}
                        />
                        {/* <ErrorLabel content={organizationalUnitError} /> */}
                    </div>
                    <div className={`form-group`}>
                        <label>
                            {"Vai trò của đơn vị"}
                            <span className="text-red">*</span>
                        </label>
                        <SelectBox
                            id={`select-role-for-transport-department`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            value={formState.value}
                            items={[
                                { value: "title", text: "---Chọn vai trò cho đơn vị---" },
                                { value: 1, text: "Quản lý vận chuyển" },
                                { value: 2, text: "Nhân viên vận chuyển" },
                            ]}
                            onChange={handleRoleChange}
                            multiple={false}
                        />
                        {/* <ErrorLabel content={roleError} /> */}
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    );
}

function mapState(state) {
    const allDepartments = state.department?.list
    return { allDepartments }
}

const actions = {
    getAllDepartments: DepartmentActions.get,
    createTransportDepartment: transportDepartmentActions.createTransportDepartment,
}

const connectedTransportDepartmentCreateForm = connect(mapState, actions)(withTranslate(TransportDepartmentCreateForm));
export { connectedTransportDepartmentCreateForm as TransportDepartmentCreateForm };