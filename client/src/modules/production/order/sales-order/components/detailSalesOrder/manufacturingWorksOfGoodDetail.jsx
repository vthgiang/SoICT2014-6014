import React, { Component } from "react";
import { DialogModal } from "../../../../../../common-components";
import { formatDate } from "../../../../../../helpers/formatDate";

function ManufacturingWorksOfGoodDetail(props) {

    const { currentManufacturingWorksOfGood, currentManufacturingPlanOfGood } = props;
    const statusConvert = [
        { text: "Chưa cập nhật trạng thái", className: "text-primary" },
        { text: "Đang chờ duyệt", className: "text-primary" },
        { text: "Đã phê duyệt", className: "text-warning" },
        { text: "Đang thực hiện", className: "text-info" },
        { text: "Đã hoàn thành", className: "text-success" },
        { text: "Đã hủy", className: "text-danger" },
    ];
    return (
        <DialogModal
            modalID="modal-sales-order-detail-manufacturing-works-of-good-detail"
            isLoading={false}
            formID="form-sales-order-detail-manufacturing-works-of-good-detail"
            title={"Yêu cầu sản xuất"}
            size="50"
            hasSaveButton={false}
            hasNote={false}
        >
            <form id="form-sales-order-detail-manufacturing-works-of-good-detail">
                {currentManufacturingWorksOfGood && !currentManufacturingPlanOfGood && (
                    <React.Fragment>
                        <div className={`form-group`}>
                            <strong>Trạng thái :&emsp;</strong>
                            <span className="text-success">Đã gửi yêu cầu tới nhà máy</span>
                        </div>
                        <div className={`form-group`}>
                            <strong>Nhà máy được yêu cầu :&emsp;</strong>
                            {currentManufacturingWorksOfGood.name}
                        </div>
                        <div className={`form-group`}>
                            <strong>Mã nhà máy :&emsp;</strong>
                            {currentManufacturingWorksOfGood.code}
                        </div>
                        <div className={`form-group`}>
                            <strong>Địa chỉ nhà máy :&emsp;</strong>
                            {currentManufacturingWorksOfGood.address}
                        </div>
                        <div className={`form-group`}>
                            <strong>Mô tả nhà máy :&emsp;</strong>
                            {currentManufacturingWorksOfGood.description}
                        </div>
                    </React.Fragment>
                )}
                {currentManufacturingWorksOfGood && currentManufacturingPlanOfGood && (
                    <React.Fragment>
                        <div className={`form-group`}>
                            <strong>Trạng thái sản xuất :&emsp;</strong>
                            <span
                                className={
                                    currentManufacturingPlanOfGood.status ? statusConvert[currentManufacturingPlanOfGood.status].className : ""
                                }
                            >
                                {currentManufacturingPlanOfGood.status ? statusConvert[currentManufacturingPlanOfGood.status].text : ""}
                            </span>
                        </div>
                        <div className={`form-group`}>
                            <strong>Mã kế hoạch sản xuất :&emsp;</strong>
                            <span className="text-success">{currentManufacturingPlanOfGood.code}</span>
                        </div>
                        <div className={`form-group`}>
                            <strong>Thời gian bắt đầu sản xuất :&emsp;</strong>
                            <span>{currentManufacturingPlanOfGood.startDate ? formatDate(currentManufacturingPlanOfGood.startDate) : ""}</span>
                        </div>
                        <div className={`form-group`}>
                            <strong>Thời gian dự kiến hoàn thành :&emsp;</strong>
                            <span>{currentManufacturingPlanOfGood.endDate ? formatDate(currentManufacturingPlanOfGood.endDate) : ""}</span>
                        </div>
                        <div className={`form-group`}>
                            <strong>Nhà máy chịu trách nhiệm sản xuất :&emsp;</strong>
                            {currentManufacturingWorksOfGood.name}
                        </div>
                        <div className={`form-group`}>
                            <strong>Mã nhà máy :&emsp;</strong>
                            {currentManufacturingWorksOfGood.code}
                        </div>
                        <div className={`form-group`}>
                            <strong>Địa chỉ nhà máy :&emsp;</strong>
                            {currentManufacturingWorksOfGood.address}
                        </div>
                        <div className={`form-group`}>
                            <strong>Mô tả nhà máy :&emsp;</strong>
                            {currentManufacturingWorksOfGood.description}
                        </div>
                    </React.Fragment>
                )}
            </form>
        </DialogModal>
    );
}

export default ManufacturingWorksOfGoodDetail;
