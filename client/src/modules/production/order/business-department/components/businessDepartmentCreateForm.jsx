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
            code: generateCode("PKD_"),
            organizationalUnitValue: "",
            status: "",
            description: "",
            managers: [],
        };
    }

    getListDepartmentArr = () => {
        const { translate, department, businessDepartments } = this.props;
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

        return listDepartmentArr;
    };

    handleOrganizationalUnitValueChange = (value) => {
        let organizationalUnitValue = value[0];
        this.validateOrganizationalUnitValue(organizationalUnitValue, true);
    };

    validateOrganizationalUnitValue = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate, department } = this.props;
        if (value === "") {
            msg = "Vui lòng chọn đơn vị!";
        }

        if (willUpdateState) {
            const { list } = department;
            let currentDepartment;
            const listDepartment = list.filter((x) => x._id === value);
            if (listDepartment.length > 0) {
                currentDepartment = listDepartment[0];
            } else {
                currentDepartment = {
                    name: "",
                    description: "",
                };
            }
            this.setState((state) => ({
                ...state,
                organizationalUnitError: msg,
                organizationalUnitValue: value,
                currentDepartment: currentDepartment,
            }));
        }
        return msg;
    };

    getListRolesArr = () => {
        const { role } = this.props;
        let { list } = role;
        let listRolesArr = [];
        const { currentDepartment } = this.state;
        // Lấy ra các role trưởng đơn vị của đơn vị hiện tại
        let currentRolesManagerIds = currentDepartment.managers.map((role) => role._id);
        if (list) {
            // Lọc các role hiện tại ra khỏi list
            list = list.filter((role) => !currentRolesManagerIds.includes(role._id));
            list.map((role) => {
                listRolesArr.push({
                    value: role._id,
                    text: role.name,
                });
            });
        }
        return listRolesArr;
    };

    handleChangeManagers = (value) => {
        this.setState((state) => ({
            ...state,
            managers: value,
        }));
    };

    validateType = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if (value === "" || value === "title") {
            msg = "Bộ phận không được để trống";
        }
        if (willUpdateState) {
            this.setState((state) => {
                return {
                    ...state,
                    type: value,
                    typeError: msg,
                };
            });
        }
        return msg;
    };

    handleChangeType = (value) => {
        this.validateType(value[0], true);
    };

    handleStatusChange = (value) => {
        let status = value[0];
        this.validateStatus(status, true);
    };

    validateStatus = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if (value === "" || value === "title") {
            msg = "Trạng thái không được để trống";
        }
        if (willUpdateState) {
            this.setState((state) => {
                return {
                    ...state,
                    status: value,
                    statusError: msg,
                };
            });
        }
        return msg;
    };

    handleDescriptionChange = (e) => {
        const { value } = e.target;
        this.setState({
            description: value,
        });
    };

    isFormValidated = () => {
        const { organizationalUnitValue, status, type } = this.state;
        let { translate } = this.props;
        if (
            this.validateOrganizationalUnitValue(organizationalUnitValue, false) ||
            this.validateStatus(status, false) ||
            this.validateType(type, false)
        ) {
            return false;
        }
        return true;
    };

    save = () => {
        let { code, organizationalUnitValue, status, managers, description, type } = this.state;
        if (this.isFormValidated()) {
            const data = {
                code: code,
                organizationalUnit: organizationalUnitValue,
                status: status,
                description: description,
                managers: managers,
                type: type,
            };
            this.props.createBusinessDepartment(data);
        }
    };

    handleClickCreate = () => {
        const code = generateCode("PKD_");
        this.setState((state) => ({
            ...state,
            code: code,
        }));
    };

    render() {
        const { translate, businessDepartments } = this.props;
        const {
            status,
            statusError,
            description,
            code,
            organizationalUnitError,
            organizationalUnitValue,
            currentDepartment,
            managers,
            type,
            typeError,
        } = this.state;
        console.log("state", this.state);
        return (
            <React.Fragment>
                <ButtonModal
                    onButtonCallBack={this.handleClickCreate}
                    modalID="modal-create-business-department"
                    button_name={"Tạo phòng ban"}
                    title={"Tạo phòng ban"}
                />
                <DialogModal
                    modalID="modal-create-business-department"
                    isLoading={false}
                    formID="form-create-business-department"
                    title={"Tạo phòng ban"}
                    msg_success={"Tạo thành công"}
                    msg_faile={"Tạo không thành công"}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                    size={50}
                    maxWidth={500}
                >
                    <form id="form-create-business-department">
                        <div className="form-group">
                            <label>
                                {"Mã phòng"}
                                <span className="text-red">*</span>
                            </label>
                            <input type="text" className="form-control" value={code} disabled={true}></input>
                        </div>
                        <div className={`form-group ${!organizationalUnitError ? "" : "has-error"}`}>
                            <label>
                                {"Đơn vị"}
                                <span className="text-red">*</span>
                            </label>
                            <SelectBox
                                id={`select-organizational-unit-create-for-business-department`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                value={organizationalUnitValue}
                                items={this.getListDepartmentArr()}
                                onChange={this.handleOrganizationalUnitValueChange}
                                multiple={false}
                            />
                            <ErrorLabel content={organizationalUnitError} />
                        </div>
                        {currentDepartment && currentDepartment.managers && (
                            <React.Fragment>
                                <fieldset className="scheduler-border">
                                    <legend className="scheduler-border">{"Trưởng đơn vị"}</legend>
                                    {currentDepartment.managers.map((role, index) => {
                                        return (
                                            <div className={`form-group`} key={index}>
                                                <strong>{role.name}: &emsp;</strong>
                                                {role.users.map((user, index) => {
                                                    if (index === role.users.length - 1) {
                                                        return user.userId.name;
                                                    }
                                                    return user.userId.name + ", ";
                                                })}
                                            </div>
                                        );
                                    })}
                                </fieldset>
                                <div className="form-group">
                                    <label>{"Người quản lý"}</label>
                                    <div>
                                        <SelectBox
                                            id={`select-manage-roles-for-business-department`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={this.getListRolesArr()}
                                            value={managers}
                                            onChange={this.handleChangeManagers}
                                            multiple={true}
                                        />
                                    </div>
                                </div>
                                <div className={`form-group ${!typeError ? "" : "has-error"}`}>
                                    <label>
                                        {"Thuộc bộ phận"}
                                        <span className="text-red">*</span>
                                    </label>
                                    <div>
                                        <SelectBox
                                            id={`select-type-for-business-department`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={[
                                                { value: "title", text: "---Chọn bộ phận---" },
                                                { value: "1", text: "Bộ phận kinh doanh" },
                                                { value: "2", text: "Bộ phận kế toán" },
                                                { value: "3", text: "Bộ phận thu mua nguyên vật liệu" },
                                            ]}
                                            value={type}
                                            onChange={this.handleChangeType}
                                            multiple={false}
                                        />
                                    </div>
                                    <ErrorLabel content={typeError} />
                                </div>
                            </React.Fragment>
                        )}

                        <div className={`form-group ${!statusError ? "" : "has-error"}`}>
                            <label>
                                {"Trạng thái hoạt động"}
                                <span className="text-red">*</span>
                            </label>
                            <SelectBox
                                id={`select-status-for-business-department`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                value={status}
                                items={[
                                    { value: "title", text: "---Chọn trạng thái phòng ban---" },
                                    { value: "1", text: "Đang hoạt động" },
                                    { value: "0", text: "Ngừng hoạt động" },
                                ]}
                                onChange={this.handleStatusChange}
                                multiple={false}
                            />
                            <ErrorLabel content={statusError} />
                        </div>
                        <div className="form-group">
                            <label>{"Mô tả"}</label>
                            <textarea type="text" value={description} onChange={this.handleDescriptionChange} className="form-control"></textarea>
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
    createBusinessDepartment: BusinessDepartmentActions.createBusinessDepartment,
};
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(BusinessDepartmentCreateForm));