import React, { Component } from "react";
import { withTranslate } from "react-redux-multilingual";
import { connect } from "react-redux";
import { DialogModal, formatDate } from "../../../../../common-components";

class BusinessDepartmentDetailForm extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    shouldComponentUpdate(nextProps) {
        if (nextProps.worksDetail !== this.props.worksDetail) {
            this.props.getDetailManufacturingWorks(nextProps.worksDetail._id);
            return false;
        }
        return true;
    }

    render() {
        const { businessDepartmentDetail } = this.props;
        const departmentNames = ["title", "Bộ phận kinh doanh", "Bộ phận kế toán", "Bộ phận thu mua nguyên vật liệu"];
        return (
            <React.Fragment>
                <DialogModal
                    modalID={`modal-detail-business-department`}
                    title={"Chi tiết phòng kinh doanh"}
                    formID={`form-detail-business-department`}
                    size={50}
                    maxWidth={500}
                    hasSaveButton={false}
                    hasNote={false}
                >
                    <form id={`form-detail-business-department`}>
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <div className={`form-group`}>
                                <strong>{"Mã phòng kinh doanh"}:&emsp;</strong>
                                {businessDepartmentDetail.code}
                            </div>
                            <div className={`form-group`}>
                                <strong>{"Đơn vị"}:&emsp;</strong>
                                {businessDepartmentDetail.organizationalUnit ? businessDepartmentDetail.organizationalUnit.name : ""}
                            </div>
                            <div className={`form-group`}>
                                <strong>{"Bộ phận"}:&emsp;</strong>
                                {departmentNames[businessDepartmentDetail.type]}
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <div className={`form-group`}>
                                <strong>{"Trạng thái"}:&emsp;</strong>
                                {businessDepartmentDetail.status ? (
                                    <span style={{ color: "green" }}>{"Đang hoạt động"}</span>
                                ) : (
                                    <span style={{ color: "red" }}>{"Ngừng hoạt động"}</span>
                                )}
                            </div>
                            <div className={`form-group`}>
                                <strong>{"Ngày thành lập"}:&emsp;</strong>
                                {formatDate(businessDepartmentDetail.createdAt)}
                            </div>
                            <div className={`form-group`}>
                                <strong>{"Mô tả"}:&emsp;</strong>
                                {businessDepartmentDetail.description}
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">{"Trưởng đơn vị"}</legend>
                                {businessDepartmentDetail.organizationalUnit &&
                                    businessDepartmentDetail.organizationalUnit.deans.map((role, index) => {
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
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">{"Người phụ trách"}</legend>
                                {businessDepartmentDetail.managers && businessDepartmentDetail.managers.length ? (
                                    <div>
                                        {businessDepartmentDetail.managers.map((role, index) => (
                                            <p key={index}>{role.name}</p>
                                        ))}
                                    </div>
                                ) : (
                                    "Chưa có vai trò"
                                )}
                            </fieldset>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

export default connect(null, null)(withTranslate(BusinessDepartmentDetailForm));
