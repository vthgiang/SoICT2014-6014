import React, { Component, useState } from "react";
import { withTranslate } from "react-redux-multilingual";
import { connect } from "react-redux";
import { ButtonModal, DialogModal, ErrorLabel, SelectBox } from "../../../../../common-components";
import ValidationHelper from "../../../../../helpers/validationHelper";
import { BusinessDepartmentActions } from "../redux/actions";

function BusinessDepartmentEditForm(props) {

    const [state, setState] = useState({
        // businessDepartmentId:"",
        // organizationalUnit:"",
        // currentDepartment:"",
        // role:"",
    })

    if (props?.businessDepartmentEdit?._id !== state?.businessDepartmentId) {
        setState((state) => {
            return {
                ...state,
                businessDepartmentId: props.businessDepartmentEdit._id,
                organizationalUnit: props.businessDepartmentEdit.organizationalUnit
                    ? props.businessDepartmentEdit.organizationalUnit._id
                    : undefined,
                currentDepartment: props.businessDepartmentEdit.organizationalUnit,
                role: props.businessDepartmentEdit.role,
                organizationalUnitError: undefined,
                roleError: undefined,
            }
        })
    }

    const getListDepartmentArr = () => {
        const { department, businessDepartments, listBusinessDepartments } = props;
        const { currentDepartment } = state;
        const { list } = department;
        //const { listBusinessDepartments } = businessDepartments;
        let listDepartmentArr = [
            {
                value: "",
                text: "---Chọn đơn vị---",
            },
        ];

        loop: for (let i = 0; i < list.length; i++) {
            if (listBusinessDepartments) {
                for (let j = 0; j < listBusinessDepartments.length; j++) {
                    if (listBusinessDepartments[j].organizationalUnit._id === list[i]._id) {
                        continue loop;
                    }
                }
            }
            listDepartmentArr.push({
                value: list[i]?._id,
                text: list[i]?.name,
            });
        }

        listDepartmentArr.push({
            value: currentDepartment?._id,
            text: currentDepartment?.name,
        });

        return listDepartmentArr;
    };

    const handleOrganizationalUnitChange = (value) => {
        validateOrganizationalUnit(value[0], true);
    };

    const validateOrganizationalUnit = (value, willUpdateState = true) => {
        let msg = undefined;
        if (value === "") {
            msg = "Vui lòng chọn đơn vị!";
        }

        if (willUpdateState) {
            setState((state) => {
                return {
                ...state,
                organizationalUnitError: msg,
                organizationalUnit: value,
                }
            });
        }

        return msg;
    };

    const validateRole = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = props;
        if (value === "" || value === "title") {
            msg = "Vai trò không được để trống";
        }
        if (willUpdateState) {
            setState((state) => {
                return {
                    ...state,
                    role: value,
                    roleError: msg,
                };
            });
        }
        return msg;
    };

    const handleRoleChange = (value) => {
        validateRole(value[0], true);
    };

    const isFormValidated = () => {
        const { organizationalUnit, role } = state;
        if (validateOrganizationalUnit(organizationalUnit, false) || validateRole(role, false)) {
            return false;
        }
        return true;
    };

    const save = () => {
        let { organizationalUnit, role, businessDepartmentId } = state;
        if (isFormValidated()) {
            const data = {
                role: role,
                organizationalUnit,
            };
            props.editBusinessDepartment(businessDepartmentId, data);
        }
    };

    const { organizationalUnit, organizationalUnitError, role, roleError, businessDepartmentId } = state;

    return (
        <React.Fragment>
            <DialogModal
                modalID="modal-edit-business-department"
                isLoading={false}
                formID="form-edit-business-department"
                title={"Chỉnh sửa thông tin phòng ban"}
                msg_success={"Chỉnh sửa thành công"}
                msg_failure={"Chỉnh sửa không thành công"}
                func={save}
                disableSubmit={!isFormValidated()}
                size={50}
                maxWidth={500}
            >
                <form id="form-edit-business-department">
                    <div className={`form-group ${!organizationalUnitError ? "" : "has-error"}`}>
                        <label>
                            {"Đơn vị"}
                            <span className="text-red">*</span>
                        </label>
                        <SelectBox
                            id={`select-organizational-unit-edit-for-business-department-${businessDepartmentId}`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            value={organizationalUnit}
                            items={getListDepartmentArr()}
                            onChange={handleOrganizationalUnitChange}
                            multiple={false}
                        />
                        <ErrorLabel content={organizationalUnitError} />
                    </div>
                    <div className={`form-group ${!roleError ? "" : "has-error"}`}>
                        <label>
                            {"Vai trò của đơn vị"}
                            <span className="text-red">*</span>
                        </label>
                        <SelectBox
                            id={`select-role-for-business-department-edit-${businessDepartmentId}`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            value={role}
                            items={[
                                { value: "title", text: "---Chọn vai trò cho đơn vị---" },
                                { value: 1, text: "Kinh doanh" },
                                { value: 2, text: "Quản lý bán hàng" },
                                { value: 3, text: "Kế toán" },
                            ]}
                            onChange={handleRoleChange}
                            multiple={false}
                        />
                        <ErrorLabel content={roleError} />
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    );
}

function mapStateToProps(state) {
    const { businessDepartments, department, role } = state;
    return { businessDepartments, department, role };
}

const mapDispatchToProps = {
    editBusinessDepartment: BusinessDepartmentActions.editBusinessDepartment,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(BusinessDepartmentEditForm));
