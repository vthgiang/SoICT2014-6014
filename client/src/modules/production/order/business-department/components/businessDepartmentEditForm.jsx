import React, { Component } from "react";
import { withTranslate } from "react-redux-multilingual";
import { connect } from "react-redux";
import { ButtonModal, DialogModal, ErrorLabel, SelectBox } from "../../../../../common-components";
import ValidationHelper from "../../../../../helpers/validationHelper";
import { BusinessDepartmentActions } from "../redux/actions";

class BusinessDepartmentEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.businessDepartmentEdit._id !== prevState.businessDepartmentId) {
            return {
                ...prevState,
                businessDepartmentId: nextProps.businessDepartmentEdit._id,
                organizationalUnit: nextProps.businessDepartmentEdit.organizationalUnit
                    ? nextProps.businessDepartmentEdit.organizationalUnit._id
                    : undefined,
                currentDepartment: nextProps.businessDepartmentEdit.organizationalUnit,
                role: nextProps.businessDepartmentEdit.role,
                organizationalUnitError: undefined,
                roleError: undefined,
            };
        }
        return null;
    }

    getListDepartmentArr = () => {
        const { department, businessDepartments } = this.props;
        const { currentDepartment } = this.state;
        const { list } = department;
        const { listBusinessDepartments } = businessDepartments;
        let listDepartmentArr = [
            {
                value: "",
                text: "---Chọn đơn vị---",
            },
        ];

        loop: for (let i = 0; i < list.length; i++) {
            for (let j = 0; j < listBusinessDepartments.length; j++) {
                if (listBusinessDepartments[j].organizationalUnit._id === list[i]._id) {
                    continue loop;
                }
            }
            listDepartmentArr.push({
                value: list[i]._id,
                text: list[i].name,
            });
        }

        listDepartmentArr.push({
            value: currentDepartment._id,
            text: currentDepartment.name,
        });

        return listDepartmentArr;
    };

    handleOrganizationalUnitChange = (value) => {
        this.validateOrganizationalUnit(value[0], true);
    };

    validateOrganizationalUnit = (value, willUpdateState = true) => {
        let msg = undefined;
        if (value === "") {
            msg = "Vui lòng chọn đơn vị!";
        }

        if (willUpdateState) {
            this.setState((state) => ({
                ...state,
                organizationalUnitError: msg,
                organizationalUnit: value,
            }));
        }
        return msg;
    };

    validateRole = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if (value === "" || value === "title") {
            msg = "Vai trò không được để trống";
        }
        if (willUpdateState) {
            this.setState((state) => {
                return {
                    ...state,
                    role: value,
                    roleError: msg,
                };
            });
        }
        return msg;
    };

    handleRoleChange = (value) => {
        this.validateRole(value[0], true);
    };

    isFormValidated = () => {
        const { organizationalUnit, role } = this.state;
        if (this.validateOrganizationalUnit(organizationalUnit, false) || this.validateRole(role, false)) {
            return false;
        }
        return true;
    };

    save = () => {
        let { organizationalUnit, role, businessDepartmentId } = this.state;
        if (this.isFormValidated()) {
            const data = {
                role: role,
                organizationalUnit,
            };
            this.props.editBusinessDepartment(businessDepartmentId, data);
        }
    };

    render() {
        const { organizationalUnit, organizationalUnitError, role, roleError, businessDepartmentId } = this.state;
        return (
            <React.Fragment>
                <DialogModal
                    modalID="modal-edit-business-department"
                    isLoading={false}
                    formID="form-edit-business-department"
                    title={"Chỉnh sửa thông tin phòng ban"}
                    msg_success={"Chỉnh sửa thành công"}
                    msg_faile={"Chỉnh sửa không thành công"}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                    size={50}
                    maxWidth={500}
                >
                    <form id="form-edit-business-department">
                        <div className={`form-group ${!organizationalUnitError ? "" : "has-error"}`}>
                            <label>
                                {"Đơn vị được cấu hình"}
                                <span className="text-red">*</span>
                            </label>
                            <SelectBox
                                id={`select-organizational-unit-edit-for-business-department-${businessDepartmentId}`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                value={organizationalUnit}
                                items={this.getListDepartmentArr()}
                                onChange={this.handleOrganizationalUnitChange}
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
                                onChange={this.handleRoleChange}
                                multiple={false}
                            />
                            <ErrorLabel content={roleError} />
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    const { businessDepartments, department, role } = state;
    return { businessDepartments, department, role };
}

const mapDispatchToProps = {
    editBusinessDepartment: BusinessDepartmentActions.editBusinessDepartment,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(BusinessDepartmentEditForm));
