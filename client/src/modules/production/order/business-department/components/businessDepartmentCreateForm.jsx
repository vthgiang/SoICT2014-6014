import React, { Component } from "react";
import { withTranslate } from "react-redux-multilingual";
import { connect } from "react-redux";
import { ButtonModal, DialogModal, ErrorLabel, SelectBox } from "../../../../../common-components";
import ValidationHelper from "../../../../../helpers/validationHelper";
import { generateCode } from "../../../../../helpers/generateCode";
import { BusinessDepartmentActions } from "../redux/actions";

class BusinessDepartmentCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            organizationalUnit: "",
            role: "",
        };
    }

    getListDepartmentArr = () => {
        const { department, businessDepartments } = this.props;
        const { list } = department;
        const { listBusinessDepartments } = businessDepartments;
        let listDepartmentArr = [
            {
                value: "",
                text: "---Chọn đơn vị---",
            },
        ];

        console.log("listBusinessDepartments", listBusinessDepartments);

        loop: for (let i = 0; i < list.length; i++) {
            for (let j = 0; j < listBusinessDepartments.length; j++) {
                if (listBusinessDepartments[j].organizationalUnit && listBusinessDepartments[j].organizationalUnit._id === list[i]._id) {
                    continue loop;
                }
            }
            listDepartmentArr.push({
                value: list[i]._id,
                text: list[i].name,
            });
        }

        return listDepartmentArr;
    };

    handleOrganizationalUnitChange = (value) => {
        let organizationalUnit = value[0];
        this.validateOrganizationalUnit(organizationalUnit, true);
    };

    validateOrganizationalUnit = (value, willUpdateState = true) => {
        let msg = undefined;
        if (value === "") {
            msg = "Vui lòng chọn đơn vị!";
        }

        if (willUpdateState) {
            this.setState((state) => ({
                ...state,
                organizationalUnit: value,
                organizationalUnitError: msg,
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
        let { organizationalUnit, role } = this.state;
        if (this.isFormValidated()) {
            const data = {
                role: role,
                organizationalUnit,
            };
            this.props.createBusinessDepartment(data);
        }
    };

    render() {
        const { organizationalUnitError, organizationalUnit, role, roleError } = this.state;
        return (
            <React.Fragment>
                <ButtonModal modalID="modal-create-business-department" button_name={"Thêm cấu hình đơn vị"} title={"Thêm cấu hình đơn vị"} />
                <DialogModal
                    modalID="modal-create-business-department"
                    isLoading={false}
                    formID="form-create-business-department"
                    title={"Cấu hình đơn vị kinh doanh"}
                    msg_success={"Cấu hình đơn vị kinh doanh thành công"}
                    msg_faile={"Cấu hình đơn vị kinh doanh không thành công"}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                    size={50}
                    maxWidth={500}
                >
                    <form id="form-create-business-department">
                        <div className={`form-group ${!organizationalUnitError ? "" : "has-error"}`}>
                            <label>
                                {"Đơn vị được cấu hình"}
                                <span className="text-red">*</span>
                            </label>
                            <SelectBox
                                id={`select-organizational-unit-create-for-business-department`}
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
                                id={`select-role-for-business-department`}
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
    const { businessDepartments, department } = state;
    return { businessDepartments, department };
}

const mapDispatchToProps = {
    createBusinessDepartment: BusinessDepartmentActions.createBusinessDepartment,
};
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(BusinessDepartmentCreateForm));
