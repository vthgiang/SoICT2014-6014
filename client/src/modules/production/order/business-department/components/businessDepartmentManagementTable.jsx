import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { BusinessDepartmentActions } from "../redux/actions";
import { DepartmentActions } from "../../../../super-admin/organizational-unit/redux/actions";
import { RoleActions } from "../../../../super-admin/role/redux/actions";
import { DataTableSetting, PaginateBar, SelectBox } from "../../../../../common-components";
import BusinessDepartmentCreateForm from "./businessDepartmentCreateForm";
import BusinessDepartmentEditForm from "./businessDepartmentEditForm";
import BusinessDepartmentDetailForm from "./businessDepartmentDetailForm";

class BusinessDepartmentManagementTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            limit: 5,
            code: "",
            status: "",
            type: "",
        };
    }

    componentDidMount = () => {
        const { page, limit } = this.state;
        this.props.getAllBusinessDepartments({ page, limit });
        this.props.getAllDepartments();
        this.props.getAllRoles();
    };

    setPage = async (page) => {
        await this.setState({
            page: page,
        });
        const data = {
            limit: this.state.limit,
            page: page,
        };
        this.props.getAllManufacturingWorks(data);
    };

    setLimit = async (limit) => {
        await this.setState({
            limit: limit,
        });
        const data = {
            limit: limit,
            page: this.state.page,
        };
        this.props.getAllManufacturingWorks(data);
    };

    handleChangeCode = (e) => {
        const { value } = e.target;
        this.setState({
            code: value,
        });
    };

    handleChangeType = (value) => {
        if (value[0] !== "title") {
            this.setState({
                type: value[0],
            });
        }
    };

    handleChangeStatus = (value) => {
        if (value[0] !== "title") {
            this.setState({
                status: value[0],
            });
        }
    };

    handleSubmitSearch = async () => {
        await this.setState({
            page: 1,
        });
        let { page, limit, code, status, type } = this.state;
        const data = {
            page,
            limit,
            code,
            status,
            type,
        };
        this.props.getAllBusinessDepartments(data);
    };

    handleShowDetailBusinessDepartment = async (businessDepartmentDetail) => {
        await this.setState((state) => {
            return {
                ...state,
                businessDepartmentDetail,
            };
        });
        console.log("businessDepartmentDetail", businessDepartmentDetail);
        window.$("#modal-detail-business-department").modal("show");
    };

    handleEditBusinessDepartment = async (businessDepartment) => {
        await this.setState((state) => {
            return {
                ...state,
                businessDepartmentEdit: businessDepartment,
            };
        });
        window.$("#modal-edit-business-department").modal("show");
    };

    getDeanName = (organizationalUnit) => {
        let deans = organizationalUnit.deans ? organizationalUnit.deans : {};
        if (deans && deans.length && deans[0].users && deans[0].users.length && deans[0].users[0].userId) {
            let { userId } = deans[0].users[0];
            if (userId.name) {
                return userId.name;
            } else {
                return "---";
            }
        }
        return "---";
    };

    render() {
        const { translate } = this.props;
        const { businessDepartments } = this.props;
        const { totalPages, page } = businessDepartments;
        let { businessDepartmentEdit, businessDepartmentDetail, code, type, status } = this.state;
        let listBusinessDepartments = [];
        if (businessDepartments.isLoading === false) {
            listBusinessDepartments = businessDepartments.listBusinessDepartments;
        }

        const departmentNames = ["title", "Bộ phận kinh doanh", "Bộ phận kế toán", "Bộ phận thu mua nguyên vật liệu"];
        return (
            <React.Fragment>
                {/* {<ManufacturingWorksDetailForm worksDetail={this.state.worksDetail} />} */}
                {businessDepartmentEdit && <BusinessDepartmentEditForm businessDepartmentEdit={businessDepartmentEdit} />}
                {businessDepartmentDetail && <BusinessDepartmentDetailForm businessDepartmentDetail={businessDepartmentDetail} />}
                <div className="box-body qlcv">
                    <BusinessDepartmentCreateForm />
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">Mã phòng ban</label>
                            <input type="text" className="form-control" onChange={this.handleChangeCode} placeholder="Nhập mã phòng..." />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">Thuộc bộ phận</label>
                            <SelectBox
                                id={`select-type-for-business-department-search`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={[
                                    { value: "title", text: "---Chọn bộ phận---" },
                                    { value: "1", text: "Bộ phận kinh doanh" },
                                    { value: "2", text: "Bộ phận kế toán" },
                                    { value: "3", text: "Bộ phận thu mua nguyên vật liệu" },
                                ]}
                                onChange={this.handleChangeType}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">Trạng thái</label>
                            <SelectBox
                                id={`select-status-for-business-department-search`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={[
                                    { value: "title", text: "---Chọn trạng thái phòng ban---" },
                                    { value: "1", text: "Đang hoạt động" },
                                    { value: "0", text: "Ngừng hoạt động" },
                                ]}
                                onChange={this.handleChangeStatus}
                            />
                        </div>

                        <div className="form-group">
                            <button type="button" className="btn btn-success" title={"Tìm phòng kinh doanh"} onClick={this.handleSubmitSearch}>
                                {"Tìm kiếm"}
                            </button>
                        </div>
                    </div>
                    <table id="business-department-table" className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>{"STT"}</th>
                                <th>{"Mã phòng"}</th>
                                <th>{"Tên phòng"}</th>
                                <th>{"Bộ phận"}</th>
                                <th>{"Trưởng đơn vị"}</th>
                                <th>{"giám đốc phụ trách"}</th>
                                <th>{"Trạng thái"}</th>
                                <th>{"Mô tả"}</th>
                                <th style={{ width: "120px", textAlign: "center" }}>
                                    {translate("table.action")}
                                    <DataTableSetting
                                        tableId="business-department-table"
                                        columnArr={["STT", "Mã phòng", "Tên phòng", "Trưởng phòng", "giám đốc phụ trách", "Mô tả", "Trạng thái"]}
                                        limit={this.state.limit}
                                        hideColumnOption={true}
                                        setLimit={this.setLimit}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {listBusinessDepartments &&
                                listBusinessDepartments.length !== 0 &&
                                listBusinessDepartments.map((businessDepartment, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{businessDepartment.code}</td>
                                        <td>{businessDepartment.organizationalUnit ? businessDepartment.organizationalUnit.name : "---"}</td>
                                        <td>{departmentNames[businessDepartment.type]}</td>
                                        <td>
                                            {businessDepartment.organizationalUnit ? this.getDeanName(businessDepartment.organizationalUnit) : "---"}
                                        </td>
                                        <td>{businessDepartment.managers ? businessDepartment.managers.map((manager) => manager.name) : "---"}</td>
                                        <td>{businessDepartment.description}</td>
                                        {businessDepartment.status ? (
                                            <td style={{ color: "green" }}>{"Đang hoạt động"}</td>
                                        ) : (
                                            <td style={{ color: "red" }}>{"Ngừng hoạt động"}</td>
                                        )}
                                        <td style={{ textAlign: "center" }}>
                                            <a
                                                style={{ width: "5px" }}
                                                title={"Xem chi tiết"}
                                                onClick={() => {
                                                    this.handleShowDetailBusinessDepartment(businessDepartment);
                                                }}
                                            >
                                                <i className="material-icons">view_list</i>
                                            </a>
                                            <a
                                                className="edit text-yellow"
                                                style={{ width: "5px" }}
                                                title={"Chỉnh sửa thông tin"}
                                                onClick={() => {
                                                    this.handleEditBusinessDepartment(businessDepartment);
                                                }}
                                            >
                                                <i className="material-icons">edit</i>
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                    {businessDepartments.isLoading ? (
                        <div className="table-info-panel">{translate("confirm.loading")}</div>
                    ) : (
                        (typeof listBusinessDepartments === "undefined" || listBusinessDepartments.length === 0) && (
                            <div className="table-info-panel">{translate("confirm.no_data")}</div>
                        )
                    )}
                    <PaginateBar pageTotal={totalPages ? totalPages : 0} currentPage={page} func={this.setPage} />
                </div>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    const { businessDepartments } = state;
    return { businessDepartments };
}

const mapDispatchToProps = {
    getAllBusinessDepartments: BusinessDepartmentActions.getAllBusinessDepartments,
    getAllDepartments: DepartmentActions.get,
    getAllRoles: RoleActions.get,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(BusinessDepartmentManagementTable));
