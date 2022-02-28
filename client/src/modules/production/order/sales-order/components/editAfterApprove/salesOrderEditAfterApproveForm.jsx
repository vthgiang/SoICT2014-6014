import React, { Component, useState } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { SalesOrderActions } from "../../redux/actions";
import { LotActions } from "../../../../warehouse/inventory-management/redux/actions";
import { GoodActions } from "../../../../common-production/good-management/redux/actions";
import { DialogModal, SelectBox, ErrorLabel } from "../../../../../../common-components";
import AddManufacturingWorkForGood from "./addManufacturingWorkForGood";
import ManufacturingWorksOfGoodDetail from "./manufacturingWorksOfGoodDetail";

function SalesOrderEditAfterApproveForm(props) {

    const [state, setState] = useState({
        code: "",
        goods: [],
    })

    if (props.salesOrderEditAfterApprove.code !== state.code) {
        setState((state) => {
            return {
                ...state,
                code: props.salesOrderEditAfterApprove.code,
                goods: props.salesOrderEditAfterApprove.goods,
            };
        })
    }

    const getGoodSubmit = () => {
        let { goods } = state;
        let goodsSubmit = [];

        if (goods.length) {
            goodsSubmit = goods.map((good) => {
                good.good = good.good._id;
                if (good.manufacturingWorks) {
                    good.manufacturingWorks = good.manufacturingWorks._id;
                }
                return good;
            });
        }

        return goodsSubmit;
    };

    const save = async () => {
        let { salesOrderEditAfterApprove } = props;
        let { status } = state;
        let data = {
            status: status && status !== "title" ? status : salesOrderEditAfterApprove.status,
            goods: getGoodSubmit(),
        };
        await props.editSalesOrder(salesOrderEditAfterApprove._id, data);
        await setState({
            ...state,
            code: "",
            status: "title",
            goods: [],
        });

        //Xóa salesOrderEditAfterApprove khỏi state của sales order table
        await props.setEditSalesOrderAfterApproveState(undefined);
    };

    const handleStatusChange = (value) => {
        setState({
            ...state,
            status: value[0],
        });
    };

    const handleGetManufacturingList = async (goodItem) => {
        //Lấy danh sách các nhà máy có thể sản xuất sản phẩm
        await props.getManufacturingWorksByProductId(goodItem.good._id);

        let currentManufacturingWorks = goodItem.manufacturingWorks
            ? goodItem.manufacturingWorks
            : {
                _id: "title",
                code: "",
                name: "",
                description: "",
                address: "",
            };

        await setState({
            ...state,
            currentGood: goodItem,
            currentManufacturingWorks,
        });

        window.$(`#modal-edit-sales-order-and-add-manufacturing-for-good`).modal("show");
    };

    const setCurrentManufacturingWorksOfGoods = async (item) => {
        await setState((state) => {
            return {
                ...state,
                currentManufacturingWorksOfGood: item.manufacturingWorks,
                currentManufacturingPlanOfGood: item.manufacturingPlan,
            };
        });
        window.$("#modal-sales-order-edit-after-aprrove-manufacturing-works-of-good-detail").modal("show");
    };

    const handleChangeManufacturingWorksForGood = (value) => {
        let { goods, currentGood } = state;
        if (value[0] !== "title") {
            let { listManufacturingWorks } = props.goods;
            let manufacturingWorksInfo = listManufacturingWorks.find((element) => element._id === value[0]);

            //Thêm thông tin nhà máy vào phần tử good của mảng goods
            let goodsMap = goods.map((good) => {
                if (good.good._id === currentGood.good._id) {
                    good.manufacturingWorks = {
                        _id: manufacturingWorksInfo._id,
                        code: manufacturingWorksInfo.code,
                        name: manufacturingWorksInfo.name,
                        description: manufacturingWorksInfo.description,
                        address: manufacturingWorksInfo.address,
                    };
                }
                return good;
            });

            setState({
                ...state,
                goods: goodsMap,
                currentManufacturingWorks: {
                    _id: manufacturingWorksInfo._id,
                    code: manufacturingWorksInfo.code,
                    name: manufacturingWorksInfo.name,
                    description: manufacturingWorksInfo.description,
                    address: manufacturingWorksInfo.address,
                },
            });
        } else {
            //Loại bỏ thông tin nhà máy vào phần tử good của mảng goods
            let goodsMap = goods.map((good) => {
                if (good.good._id === currentGood.good._id) {
                    good.manufacturingWorks = undefined;
                }
                return good;
            });

            setState({
                ...state,
                goods: goodsMap,
                currentManufacturingWorks: {
                    _id: "title",
                    code: "",
                    name: "",
                    description: "",
                    address: "",
                },
            });
        }
    };

    const getStatusOptions = () => {
        let options = [];
        const { salesOrderEditAfterApprove } = props;
        if (salesOrderEditAfterApprove && (salesOrderEditAfterApprove.status === 2 || salesOrderEditAfterApprove.status == 3)) {
            options = [
                { value: "title", text: "---Bỏ chọn---" },
                { value: 2, text: "Đã phê duyệt" },
                { value: 3, text: "Yêu cầu sản xuất" },
                { value: 8, text: "Hủy đơn" },
            ];
        } else {
            options = [
                { value: "title", text: "---Bỏ chọn---" },
                { value: 8, text: "Hủy đơn" },
            ];
        }
        return options;
    };

    let { goods, status, code, currentManufacturingWorks, currentGood } = state;
    const { listInventories } = props.lots;
    if (goods && goods.length && listInventories.length) {
        //Thêm số lượng tồn kho vào
        let goodsMap = goods.map((good) => {
            for (let index = 0; index < listInventories.length; index++) {
                if (listInventories[index].good._id === good.good._id) {
                    good.inventory = listInventories[index].inventory;
                }
            }
            return good;
        });

        goods = goodsMap;
    }

    const { salesOrderEditAfterApprove } = props;
    const manufacturingStatusConvert = [
        { text: "Chưa cập nhật trạng thái", className: "text-primary" },
        { text: "Đang chờ duyệt", className: "text-primary" },
        { text: "Đã phê duyệt", className: "text-warning" },
        { text: "Đang thực hiện", className: "text-info" },
        { text: "Đã hoàn thành", className: "text-success" },
        { text: "Đã hủy", className: "text-danger" },
    ];
    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-edit-sales-order-after-aprrove`}
                isLoading={false}
                formID={`modal-edit-sales-order-after-aprrove`}
                title={"Đơn hàng mới"}
                msg_success={"Chỉnh sửa đơn bán hàng"}
                msg_failure={"Chỉnh sửa đơn bán hàng"}
                size="50"
                style={{ backgroundColor: "green" }}
                func={save}
            >
                <AddManufacturingWorkForGood
                    currentGood={currentGood}
                    currentManufacturingWorks={currentManufacturingWorks}
                    handleChangeManufacturingWorksForGood={handleChangeManufacturingWorksForGood}
                />
                <ManufacturingWorksOfGoodDetail
                    currentManufacturingWorksOfGood={state.currentManufacturingWorksOfGood}
                    currentManufacturingPlanOfGood={state.currentManufacturingPlanOfGood}
                />
                <div className="form-group">
                    <label>
                        Mã đơn
                        <span className="attention"> * </span>
                    </label>
                    <input type="text" className="form-control" value={code} disabled={true} />
                </div>
                <div className={`form-group`}>
                    <label>Chọn trạng thái: </label>
                    <SelectBox
                        id={`select-sales-order-edit-after-approve-status`}
                        className="form-control select2"
                        style={{ width: "100%" }}
                        value={status}
                        items={getStatusOptions()}
                        onChange={handleStatusChange}
                        multiple={false}
                    />
                </div>
                {salesOrderEditAfterApprove &&
                    (salesOrderEditAfterApprove.status === 2 ||
                        salesOrderEditAfterApprove.status === 3 ||
                        salesOrderEditAfterApprove.status === 4) && (
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">Yêu cầu sản xuất</legend>
                            <table id={`sales-order-table-create-from-quote`} className="table table-bordered not-sort">
                                <thead>
                                    <tr>
                                        <th title={"STT"}>STT</th>
                                        <th title={"Mã sản phẩm"}>Mã sản phẩm</th>
                                        <th title={"Tên sản phẩm"}>Tên sản phẩm</th>
                                        <th title={"Số lượng"}>Số lượng mua</th>
                                        <th title={"Số lượng tồn kho"}>Số lượng tồn kho</th>
                                        <th title={"Đơn vị tính"}>Đơn vị tính</th>
                                        <th title={"Yêu cầu sản xuất"}>Yêu cầu s/x</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {goods &&
                                        goods.length !== 0 &&
                                        goods.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.good.code}</td>
                                                    <td>{item.good.name}</td>
                                                    <td>{item.quantity}</td>
                                                    <td>{item.inventory}</td>
                                                    <td>{item.good.baseUnit}</td>
                                                    <td>
                                                        {!item.manufacturingWorks && (
                                                            <a onClick={() => handleGetManufacturingList(item)}>
                                                                <span className="text-success">Click để yêu cầu</span>
                                                            </a>
                                                        )}
                                                        {item.manufacturingWorks && !item.manufacturingPlan && (
                                                            <a onClick={() => handleGetManufacturingList(item)}>
                                                                <span className="text-success">Đã gửi yêu cầu</span>
                                                            </a>
                                                        )}
                                                        {item.manufacturingWorks && item.manufacturingPlan && (
                                                            <a onClick={() => setCurrentManufacturingWorksOfGoods(item)}>
                                                                <span className="text-success">
                                                                    {manufacturingStatusConvert[item.manufacturingPlan.status].text}
                                                                </span>
                                                            </a>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                </tbody>
                            </table>
                        </fieldset>
                    )}
            </DialogModal>
        </React.Fragment>
    );
}

function mapStateToProps(state) {
    const { lots, goods } = state;
    return { lots, goods };
}

const mapDispatchToProps = {
    editSalesOrder: SalesOrderActions.editSalesOrder,
    getInventoryByGoodIds: LotActions.getInventoryByGoodIds,
    getManufacturingWorksByProductId: GoodActions.getManufacturingWorksByProductId,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(SalesOrderEditAfterApproveForm));
