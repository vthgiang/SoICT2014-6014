import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { DialogModal, SelectBox, ErrorLabel } from "../../../../../../common-components";
import { RequestActions } from '../../../../common-production/request-management/redux/actions';
import { BinLocationActions } from '../../../bin-location-management/redux/actions';

function ApproveForm(props) {

    const [state, setState] = useState({
        status: "",
        currentRole: localStorage.getItem("currentRole"),
        page: 1,
        limit: 5,
        path: '',
        stock: '',
        requestId: '',
    })

    useEffect(() => {
        let data = {
            page: state.page,
            limit: state.limit,
            managementLocation: state.currentRole,
            stock: state.stock,
        }
        props.getChildBinLocations(data);
    }, [state.stock])

    useEffect(() => {
        if (props.requestId !== state.requestId) {
            setState({
                ...state,
                requestApprove: props.requestApprove,
                stock: props.requestApprove.stock._id,
                stockInfo: props.requestApprove.stock,
                requestId: props.requestId,
            });
        }
    }, [props.requestId]);

    const handleStatusChange = (value) => {
        validateStatus(value[0], true);
    };

    const validateStatus = (value, willUpdateState = true) => {
        let msg = undefined;
        if (value === "") {
            msg = "Giá trị không được để trống";
        }
        if (willUpdateState) {
            setState({
                ...state,
                status: value,
                statusError: msg,
            });
        }
        return msg === undefined;
    };

    const handleNoteChange = (e) => {
        let { value } = e.target;
        setState({
            ...state,
            note: value,
        });
    };

    const handleEnableGood = (enableGoods) => {
        enableGoods.sort((a, b) => b.contained - a.contained);
        if (enableGoods[0].contained === 0) {
            return null;
        } else
            return enableGoods;
    }

    const isFormValidated = () => {
        const { status } = state;
        return validateStatus(status, false);
    };

    const save = async () => {
        const { status, note } = state;
        let data = {};
        const userId = localStorage.getItem("userId");
        if (status === "2") {
            data = {
                approvedUser: userId,
                approveType: props.fromStock == true ? 4 : 5,
                note: note,
            }
        } else if (status === "3") {
            let refuser = {};
            refuser.refuser = userId;
            refuser.refuserTime = new Date(Date.now());
            refuser.note = note;
            data = {
                refuser: refuser,
                status: 5,
            }
        }
        props.editRequest(requestApprove._id, data);
    };


    const { status, note, statusError, requestApprove } = state;
    const { translate, binLocations } = props;
    const { stockInfo } = state;
    const { listPaginate, } = binLocations;
    return (
        <DialogModal
            modalID="modal-approve-form"
            isLoading={false}
            formID="form--approve-purchase-order"
            title={`Phê duyệt yêu cầu`}
            size="50"
            hasSaveButton={true}
            hasNote={false}
            disableSubmit={!isFormValidated()}
            func={save}
        >
            <form id="form--approve-purchase-order">
                <div className={`form-group ${!statusError ? "" : "has-error"}`}>
                    <label>
                        {"Trạng thái phê duyệt"}
                        <span className="text-red"> * </span>
                    </label>
                    <SelectBox
                        id={`select-purchase-order-approve-status`}
                        className="form-control select2"
                        style={{ width: "100%" }}
                        value={status}
                        items={[
                            { value: "", text: "---Chọn thái phê duyệt---" },
                            { value: "2", text: "Phê duyệt yêu cầu" },
                            { value: "3", text: "Từ chối yêu cầu" },
                        ]}
                        onChange={handleStatusChange}
                        multiple={false}
                    />
                    <ErrorLabel content={statusError} />
                </div>
                <div className="form-group">
                    <div className="form-group">
                        <label>
                            {"Ghi chú"}
                            <span className="attention"> </span>
                        </label>
                        <textarea type="text" className="form-control" value={note} onChange={handleNoteChange} />
                    </div>
                </div>
                <fieldset className="scheduler-border">
                    <legend className="scheduler-border">{"Thông tin chi tiết kho"}</legend>
                    {stockInfo && (
                        <div className="row">
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className="form-group">
                                    <strong>{translate('manage_warehouse.stock_management.code')}:&emsp;</strong>
                                    {stockInfo.code}
                                </div>
                                <div className="form-group">
                                    <strong>{translate('manage_warehouse.stock_management.address')}:&emsp;</strong>
                                    {stockInfo.address}
                                </div>
                                <div className="form-group">
                                    <strong>{translate('manage_warehouse.stock_management.description')}:&emsp;</strong>
                                    {stockInfo.description}
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className="form-group">
                                    <strong>{translate('manage_warehouse.stock_management.name')}:&emsp;</strong>
                                    {stockInfo.name}
                                </div>
                                <div className="form-group">
                                    <strong>{translate('manage_warehouse.stock_management.status')}:&emsp;</strong>
                                    {stockInfo.status && <span style={{ color: translate(`manage_warehouse.bin_location_management.${stockInfo.status}.color`) }}>{translate(`manage_warehouse.bin_location_management.${stockInfo.status}.status`)}</span>}
                                </div>
                                <div className="form-group">
                                    <strong>{"Thời gian mở cửa"}:&emsp;</strong>
                                    {stockInfo.startTime}&emsp;
                                    <strong>{"Thời gian đóng cửa"}:&emsp;</strong>
                                    {stockInfo.endTime}
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="row">
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <fieldset>
                                <legend>{"Chi tiết vị trí lưu trữ"}</legend>
                                <table id={"form-stock-information-table"} className="table table-striped table-bordered table-hover" style={{ marginTop: '15px' }}>
                                    <thead>
                                        <tr>
                                            <th style={{ width: "5%" }}>{translate('manage_warehouse.bin_location_management.index')}</th>
                                            <th>{translate('manage_warehouse.bin_location_management.code')}</th>
                                            <th>{translate('manage_warehouse.bin_location_management.status')}</th>
                                            <th>{translate('manage_warehouse.bin_location_management.capacity')}</th>
                                            <th>{translate('manage_warehouse.bin_location_management.contained')}</th>
                                            <th>{translate('manage_warehouse.bin_location_management.goods')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(typeof listPaginate !== undefined && listPaginate.length !== 0) &&
                                            listPaginate.map((x, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{x.path}</td>
                                                    <td style={{ color: translate(`manage_warehouse.bin_location_management.${x.status}.color`) }}>{translate(`manage_warehouse.bin_location_management.${x.status}.status`)}</td>
                                                    <td>{x.capacity ? x.capacity : 0} {x.unit}</td>
                                                    <td>
                                                        {x.contained > 0 && (x.contained + ' ' + x.unit)}
                                                        {x.contained <= 0 && translate('manage_warehouse.bin_location_management.empty_stock')}
                                                    </td>
                                                    <td>
                                                        {(x.enableGoods && x.enableGoods.length > 0) && (handleEnableGood(x.enableGoods) !== null ? handleEnableGood(x.enableGoods).map((x, i) => { return <p key={i}>{x.good.name} ({x.contained} {x.good.baseUnit})</p> }) : translate('manage_warehouse.bin_location_management.empty_stock'))}
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                                {binLocations.isLoading ?
                                    <div className="table-info-panel">{translate('confirm.loading')}</div> :
                                    (typeof listPaginate === 'undefined' || listPaginate.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                                }
                            </fieldset>
                        </div>
                    </div>
                </fieldset>

            </form>
        </DialogModal>
    );
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    editRequest: RequestActions.editRequest,
    getChildBinLocations: BinLocationActions.getChildBinLocations,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ApproveForm));
