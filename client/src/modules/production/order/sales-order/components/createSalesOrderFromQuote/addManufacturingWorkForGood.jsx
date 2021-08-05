import React, { Component, useState } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { DialogModal, SelectBox } from "../../../../../../common-components";

function AddManufacturingWorkForGood(props) {

    const getManufacturingWorksOptions = () => {
        let options = [];
        let { listManufacturingWorks } = props.goods;
        if (listManufacturingWorks) {
            options = [{ value: "title", text: "---Chọn nhà máy để yêu cầu---" }];

            let mapOptions = listManufacturingWorks.map((item) => {
                return {
                    value: item._id,
                    text: item.code + " - " + item.name,
                };
            });

            options = options.concat(mapOptions);
        }
        return options;
    };

    const { currentGood, currentManufacturingWorks, handleChangeManufacturingWorksForGood } = props;
    return (
        <DialogModal
            modalID="modal-create-from-quote-and-add-manufacturing-for-good"
            isLoading={false}
            formID="form-create-from-quote-and-add-manufacturing-for-good"
            title={"Yêu cầu sản xuất"}
            size="75"
            hasSaveButton={false}
            hasNote={false}
        >
            <form id="form-create-from-quote-and-add-manufacturing-for-good">
                {currentGood && currentGood.good.code && (
                    <div className={`form-group`}>
                        <strong>Mặt hàng yêu cầu sản xuất:&emsp;</strong>
                        <span>{currentGood.good.code + " - " + currentGood.good.name}</span>
                    </div>
                )}
                {currentManufacturingWorks && currentManufacturingWorks.code !== "" ? (
                    <div className={`form-group`}>
                        <strong>Trạng thái sản xuất :&emsp;</strong>
                        <span className="text-success">Đã thiết lập yêu cầu</span>
                    </div>
                ) : (
                    <div className={`form-group`}>
                        <strong>Trạng thái sản xuất :&emsp;</strong>
                        <span className="text-warning">Chưa yêu cầu sản xuất</span>
                    </div>
                )}
                <div className={`form-group`}>
                    <label>Yêu cầu tới nhà máy: </label>
                    <SelectBox
                        id={`select-manufacturing-works-sales-order-create-from-quote`}
                        className="form-control select2"
                        style={{ width: "100%" }}
                        value={currentManufacturingWorks ? currentManufacturingWorks._id : "title"}
                        items={getManufacturingWorksOptions()}
                        onChange={handleChangeManufacturingWorksForGood}
                        multiple={false}
                    />
                </div>
                {currentManufacturingWorks && currentManufacturingWorks.code !== "" && (
                    <React.Fragment>
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">Thông tin nhà máy</legend>
                            <div className={`form-group`}>
                                <strong>Tên nhà máy :&emsp;</strong>
                                {currentManufacturingWorks.name}
                            </div>
                            <div className={`form-group`}>
                                <strong>Mã nhà máy :&emsp;</strong>
                                {currentManufacturingWorks.code}
                            </div>
                            <div className={`form-group`}>
                                <strong>Địa chỉ nhà máy :&emsp;</strong>
                                {currentManufacturingWorks.address}
                            </div>
                            <div className={`form-group`}>
                                <strong>Mô tả nhà máy :&emsp;</strong>
                                {currentManufacturingWorks.description}
                            </div>
                        </fieldset>
                    </React.Fragment>
                )}
            </form>
        </DialogModal>
    );
}

function mapStateToProps(state) {
    const { goods } = state;
    return { goods };
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(AddManufacturingWorkForGood));
