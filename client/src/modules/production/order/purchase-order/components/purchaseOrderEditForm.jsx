import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { PurchaseOrderActions } from "../redux/actions";
import { DialogModal, SelectBox, ErrorLabel, DatePicker } from "../../../../../common-components";
import ValidationHelper from "../../../../../helpers/validationHelper";
import { formatCurrency } from "../../../../../helpers/formatCurrency";
import { formatDate, formatToTimeZoneDate } from "../../../../../helpers/formatDate";

class PurchaseOrderEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code: "",
            material: "",
            materials: [],
            approvers: [],
            price: "",
            quantity: "",
            purchaseOrderId: "",
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.purchaseOrderEdit._id !== prevState.purchaseOrderId) {
            return {
                purchaseOrderId: nextProps.purchaseOrderEdit._id,
                code: nextProps.purchaseOrderEdit.code,
                stock: nextProps.purchaseOrderEdit.stock._id,
                supplier: nextProps.purchaseOrderEdit.supplier ? nextProps.purchaseOrderEdit.supplier._id : undefined,
                approvers: nextProps.purchaseOrderEdit.approvers.map((element) => element.approver._id),
                intendReceiveTime: nextProps.purchaseOrderEdit.intendReceiveTime ? formatDate(nextProps.purchaseOrderEdit.intendReceiveTime) : "",
                discount: nextProps.purchaseOrderEdit.discount,
                desciption: nextProps.purchaseOrderEdit.desciption,
                materials: nextProps.purchaseOrderEdit.materials,
                status: nextProps.purchaseOrderEdit.status,
                purchasingRequest: nextProps.purchaseOrderEdit.purchasingRequest,
            };
        }
    }

    getSuplierOptions = () => {
        let options = [];

        const { list } = this.props.customers;
        if (list) {
            options = [
                {
                    value: "title", //Title không được chọn
                    text: "---Chọn nhà cung cấp---",
                },
            ];

            let mapOptions = this.props.customers.list.map((item) => {
                return {
                    value: item._id,
                    text: item.name,
                };
            });

            options = options.concat(mapOptions);
        }

        return options;
    };

    getApproverOptions = () => {
        let options = [];
        const { user } = this.props;
        if (user.list) {
            options = [
                {
                    value: "title", //Title không được chọn
                    text: "---Chọn người phê duyệt---",
                },
            ];

            let mapOptions = user.list.map((item) => {
                return {
                    value: item._id,
                    text: item.name,
                };
            });

            options = options.concat(mapOptions);
        }

        return options;
    };

    getStockOptions = () => {
        let options = [];
        const { listStocks } = this.props.stocks;

        if (listStocks.length) {
            options = [
                {
                    value: "title", //Title không được chọn
                    text: "---Chọn kho nhập---",
                },
            ];

            let mapOptions = listStocks.map((item) => {
                return {
                    value: item._id,
                    text: item.name,
                };
            });

            options = options.concat(mapOptions);
        }

        return options;
    };

    getMaterialOptions = () => {
        let options = [];
        let { listGoodsByType } = this.props.goods;
        if (listGoodsByType) {
            options = [{ value: "title", text: "---Chọn nguyên vật liệu---" }];

            let mapOptions = listGoodsByType.map((item) => {
                return {
                    value: item._id,
                    text: item.code + " - " + item.name + " (" + item.baseUnit + ")",
                };
            });

            options = options.concat(mapOptions);
        }

        return options;
    };

    validateSupplier = (value, willUpdateState = true) => {
        let msg = undefined;
        if (!value || value === "" || value === "title") {
            msg = "Giá trị không được bỏ trống!";
        }

        if (willUpdateState) {
            this.setState({
                supplierError: msg,
            });
        }

        return msg;
    };

    handleSupplierChange = async (value) => {
        this.setState({
            supplier: value[0],
        });

        this.validateSupplier(value[0], true);
    };

    validateApprovers = (value, willUpdateState = true) => {
        let msg = undefined;
        if (!value.length) {
            msg = "Người phê duyệt không được để trống";
        } else {
            for (let index = 0; index < value.length; index++) {
                if (!value[index] || value[index] === "" || value[index] === "title") {
                    msg = "Không được chọn tiêu đề!";
                }
            }
        }

        if (willUpdateState) {
            this.setState((state) => {
                return {
                    ...state,
                    approversError: msg,
                };
            });
        }
        return msg === undefined;
    };

    handleApproversChange = (value) => {
        this.setState({
            approvers: value,
        });
        this.validateApprovers(value, true);
    };

    validateStock = (value, willUpdateState = true) => {
        let msg = undefined;
        if (!value || value === "" || value === "title") {
            msg = "Giá trị không được bỏ trống!";
        }

        if (willUpdateState) {
            this.setState({
                stockError: msg,
            });
        }

        return msg;
    };

    handleStockChange = (value) => {
        this.setState({
            stock: value[0],
        });
        this.validateStock(value[0], true);
    };

    validateStatus = (value, willUpdateState = true) => {
        let msg = undefined;
        if (!value || value === "" || value === "title") {
            msg = "Giá trị không được bỏ trống!";
        }

        if (willUpdateState) {
            this.setState({
                statusError: msg,
            });
        }

        return msg;
    };

    handleStatusChange = (value) => {
        this.setState({
            status: value[0],
        });
        this.validateStatus(value[0], true);
    };

    handleIntendReceiveTimeChange = (value) => {
        if (!value) {
            value = null;
        }

        let { translate } = this.props;
        let { message } = ValidationHelper.validateEmpty(translate, value);
        this.setState({
            intendReceiveTime: value,
            intendReceiveTimeError: message,
        });
    };

    validateDiscount = (value, willUpdateState = true) => {
        let msg = undefined;
        if (value && parseInt(value) <= 0) {
            msg = "Giá trị phải lớn hơn 0, có thể bỏ trống!";
        }
        if (willUpdateState) {
            this.setState({
                discountError: msg,
            });
        }
        return msg;
    };

    handleDiscountChange = (e) => {
        let { value } = e.target;
        this.setState({
            discount: value,
        });

        this.validateDiscount(value, true);
    };

    handleDescriptionChange = (e) => {
        let { value } = e.target;
        this.setState({
            desciption: value,
        });
    };

    validateMaterial = (value, willUpdateState = true) => {
        let msg = undefined;
        if (!value) {
            msg = "Giá trị không được để trống";
        } else if (value === "title") {
            msg = "Giá trị không được để trống";
        }

        if (willUpdateState) {
            this.setState((state) => {
                return {
                    ...state,
                    materialError: msg,
                };
            });
        }
        return msg;
    };

    handleMaterialChange = (value) => {
        if (value[0] !== "title") {
            let { listGoodsByType } = this.props.goods;
            const materialInfo = listGoodsByType.filter((item) => item._id === value[0]);

            if (materialInfo.length) {
                this.setState((state) => {
                    return {
                        ...state,
                        material: {
                            _id: materialInfo[0]._id,
                            code: materialInfo[0].code,
                            name: materialInfo[0].name,
                            baseUnit: materialInfo[0].baseUnit,
                        },
                    };
                });
            }
        } else {
            this.setState((state) => {
                return {
                    ...state,
                    material: {
                        _id: "title",
                        code: "",
                        name: "",
                        baseUnit: "",
                    },
                };
            });
        }
        this.validateMaterial(value[0], true);
    };

    validateQuantity = (value, willUpdateState = true) => {
        let msg = undefined;
        if (!value || value === "") {
            msg = "Giá trị không được bỏ trống!";
        } else if (parseInt(value) <= 0) {
            msg = "giá trị phải lớn hơn 0!";
        }
        if (willUpdateState) {
            this.setState({
                quantityError: msg,
            });
        }

        return msg;
    };

    handleQuantityChange = (e) => {
        let { value } = e.target;
        this.setState({
            quantity: value,
        });

        this.validateQuantity(value, true);
    };

    validatePrice = (value, willUpdateState = true) => {
        let msg = undefined;
        if (!value || value === "") {
            msg = "Giá trị không được bỏ trống!";
        } else if (parseInt(value) < 0) {
            msg = "giá trị không được nhỏ hơn 0!";
        }
        if (willUpdateState) {
            this.setState({
                priceError: msg,
            });
        }

        return msg;
    };

    handlePriceChange = (e) => {
        let { value } = e.target;
        this.setState({
            price: value,
        });
        this.validatePrice(value, true);
    };

    handleClearMaterial = (e) => {
        e.preventDefault();
        this.setState({
            material: {
                _id: "title",
                code: "",
                name: "",
                baseUnit: "",
            },
            quantity: "",
            price: "",
            materialError: undefined,
            quantityError: undefined,
            priceError: undefined,
        });
    };

    getPaymentAmount = (isSubmit = false) => {
        let { materials, discount } = this.state;
        let paymentAmount = 0;

        paymentAmount = materials.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.price * currentValue.quantity;
        }, 0);

        if (discount) {
            paymentAmount = paymentAmount - discount >= 0 ? paymentAmount - discount : 0;
        }
        if (isSubmit) {
            return paymentAmount;
        }
        return formatCurrency(paymentAmount);
    };

    isSubmitMaterial = () => {
        //Validate để thêm material vào list materials
        let { material, quantity, price } = this.state;
        if (this.validateMaterial(material, false) || this.validateQuantity(quantity, false) || this.validatePrice(price, false)) {
            return false;
        } else {
            return true;
        }
    };

    handleAddMaterial = (e) => {
        e.preventDefault();
        if (this.isSubmitMaterial()) {
            const { material, quantity, price, materials } = this.state;
            let data = {
                material,
                quantity,
                price,
            };

            materials.push(data);

            this.setState({
                materials,
                material: {
                    _id: "title",
                    code: "",
                    name: "",
                    baseUnit: "",
                },
                quantity: "",
                price: "",
                materialError: undefined,
                quantityError: undefined,
                priceError: undefined,
            });
        }
    };

    handleDeleteMaterial = (item) => {
        let { materials } = this.state;
        let materialsFilter = materials.filter((element) => element.material !== item.material);
        this.setState({
            materials: materialsFilter,
        });
    };

    handleMaterialsEdit = (item, index) => {
        this.setState({
            editMaterials: true,
            indexEditting: index,
            material: item.material,
            quantity: item.quantity,
            price: item.price,
            materialError: undefined,
            quantityError: undefined,
            priceError: undefined,
        });
    };

    handleSaveEditMaterial = (e) => {
        e.preventDefault();
        if (this.isSubmitMaterial()) {
            const { material, quantity, price, materials, indexEditting } = this.state;
            let data = {
                material,
                quantity,
                price,
            };

            materials[indexEditting] = data;

            this.setState({
                materials,
                material: {
                    _id: "title",
                    code: "",
                    name: "",
                    baseUnit: "",
                },
                quantity: "",
                price: "",
                indexEditting: "",
                editMaterials: false,
                materialError: undefined,
                quantityError: undefined,
                priceError: undefined,
            });
        }
    };

    handleCancelEditMaterial = (e) => {
        e.preventDefault();
        this.setState({
            material: {
                _id: "title",
                code: "",
                name: "",
                baseUnit: "",
            },
            quantity: "",
            price: "",
            indexEditting: "",
            editMaterials: false,
            materialError: undefined,
            quantityError: undefined,
            priceError: undefined,
        });
    };

    isFormValidated = () => {
        const { translate } = this.props;

        let { stock, supplier, approvers, intendReceiveTime, materials, status } = this.state;
        if (
            this.validateStock(stock, false) ||
            this.validateSupplier(supplier, false) ||
            this.validateStatus(status, false) ||
            ValidationHelper.validateEmpty(translate, intendReceiveTime).message ||
            !approvers.length ||
            !materials.length
        ) {
            return false;
        }
        return true;
    };

    formatMaterialsForSubmit = () => {
        let { materials } = this.state;
        let materialsMap = materials.map((element) => {
            return {
                material: element.material,
                quantity: element.quantity,
                price: element.price,
            };
        });

        return materialsMap;
    };

    formatApproversForSubmit = () => {
        let { approvers } = this.state;
        let approversMap = approvers.map((element) => {
            return {
                approver: element,
            };
        });

        return approversMap;
    };

    save = async () => {
        let { code, stock, supplier, intendReceiveTime, discount, desciption, status, purchaseOrderId } = this.state;
        let materials = await this.formatMaterialsForSubmit();
        let approvers = await this.formatApproversForSubmit();
        let data = {
            code,
            stock,
            supplier,
            approvers,
            intendReceiveTime: formatToTimeZoneDate(intendReceiveTime),
            discount,
            desciption,
            materials,
            status,
            paymentAmount: this.getPaymentAmount(true),
        };
        await this.props.updatePurchaseOrder(purchaseOrderId, data);
    };

    render() {
        const {
            code,
            supplier,
            approvers,
            stock,
            intendReceiveTime,
            discount,
            desciption,
            material,
            quantity,
            price,
            materials,
            editMaterials,
            purchasingRequest,
            status,
            purchaseOrderId,
        } = this.state;
        const {
            supplierError,
            approversError,
            stockError,
            intendReceiveTimeError,
            discountError,
            materialError,
            quantityError,
            priceError,
            statusError,
        } = this.state;

        return (
            <React.Fragment>
                <DialogModal
                    modalID={`modal-edit-purchase-order`}
                    isLoading={false}
                    formID={`form-edit-purchase-order`}
                    title={"Chỉnh sửa đơn mua nguyên vật liệu"}
                    msg_success={"Chỉnh sửa thành công"}
                    msg_faile={"Chỉnh sửa không thành công"}
                    disableSubmit={!this.isFormValidated()}
                    func={this.save}
                    size="75"
                >
                    <form id={`form-edit-purchase-order`}>
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <div className="form-group">
                                <label>
                                    Mã đơn
                                    <span className="attention"> * </span>
                                </label>
                                <input type="text" className="form-control" value={code} disabled={true} />
                            </div>
                            <div className={`form-group`}>
                                <label>Đơn đề nghị</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={purchasingRequest ? purchasingRequest.code : "Đơn được lên trực tiếp"}
                                    disabled={true}
                                />
                                <ErrorLabel content={discountError} />
                            </div>
                            <div className={`form-group ${!stockError ? "" : "has-error"}`}>
                                <label>
                                    Kho nhập nguyên vật liệu
                                    <span className="attention"> * </span>
                                </label>
                                <SelectBox
                                    id={`select-edit-purchase-order-stock-${purchaseOrderId}`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={stock}
                                    items={this.getStockOptions()}
                                    onChange={this.handleStockChange}
                                    multiple={false}
                                />
                                <ErrorLabel content={stockError} />
                            </div>
                            <div className={`form-group ${!supplierError ? "" : "has-error"}`}>
                                <label>
                                    Nhà cung cấp
                                    <span className="attention"> * </span>
                                </label>
                                <SelectBox
                                    id={`select-edit-purchase-order-supplier-${purchaseOrderId}`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={supplier}
                                    items={this.getSuplierOptions()}
                                    onChange={this.handleSupplierChange}
                                    multiple={false}
                                />
                                <ErrorLabel content={supplierError} />
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <div className={`form-group ${!approversError ? "" : "has-error"}`}>
                                <label>
                                    Người phê duyệt
                                    <span className="attention"> * </span>
                                </label>
                                <SelectBox
                                    id={`select-edit-purchase-order-approvers-${purchaseOrderId}`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={approvers}
                                    items={this.getApproverOptions()}
                                    onChange={this.handleApproversChange}
                                    multiple={true}
                                />
                                <ErrorLabel content={approversError} />
                            </div>
                            <div className={`form-group ${!statusError ? "" : "has-error"}`}>
                                <label>
                                    Trạng thái đơn
                                    <span className="attention"> * </span>
                                </label>
                                <SelectBox
                                    id={`select-edit-purchase-order-status-${purchaseOrderId}`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={status}
                                    items={[
                                        {
                                            value: "title",
                                            text: "---Chọn trạng thái---",
                                        },
                                        {
                                            value: 1,
                                            text: "Chờ phê duyệt",
                                        },
                                        {
                                            value: 2,
                                            text: "Đã phê duyệt",
                                        },
                                        {
                                            value: 3,
                                            text: "Đã nhập kho",
                                        },
                                        {
                                            value: 4,
                                            text: "Đã hủy",
                                        },
                                    ]}
                                    onChange={this.handleStatusChange}
                                    multiple={false}
                                />
                                <ErrorLabel content={statusError} />
                            </div>
                            <div className={`form-group ${!intendReceiveTimeError ? "" : "has-error"}`}>
                                <label>
                                    Ngày dự kiến nhập hàng
                                    <span className="attention"> * </span>
                                </label>
                                <DatePicker
                                    id={`date_picker_edit_purchase-order_directly_intend_received_time_${purchaseOrderId}`}
                                    value={intendReceiveTime}
                                    onChange={this.handleIntendReceiveTimeChange}
                                    disabled={false}
                                />
                                <ErrorLabel content={intendReceiveTimeError} />
                            </div>
                            <div className={`form-group ${!discountError ? "" : "has-error"}`}>
                                <label>Tiền được khuyến mãi</label>
                                <input type="number" className="form-control" value={discount} onChange={this.handleDiscountChange} />
                                <ErrorLabel content={discountError} />
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <div className={`form-group`}>
                                <label>Ghi chú</label>
                                <textarea type="text" className="form-control" value={desciption} onChange={this.handleDescriptionChange} />
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">Thông tin nguyên vật liệu</legend>
                                <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                                    <div className={`form-group ${!materialError ? "" : "has-error"}`}>
                                        <label>
                                            Nguyên vật liệu
                                            <span className="attention"> * </span>
                                        </label>
                                        <SelectBox
                                            id={`select-edit-purchase-order-directly-material-${purchaseOrderId}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            value={material._id}
                                            items={this.getMaterialOptions()}
                                            onChange={this.handleMaterialChange}
                                            multiple={false}
                                        />
                                        <ErrorLabel content={materialError} />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                                    <div className={`form-group ${!quantityError ? "" : "has-error"}`}>
                                        <label>
                                            Số lượng mua
                                            <span className="attention"> * </span>
                                        </label>
                                        <input type="number" className="form-control" value={quantity} onChange={this.handleQuantityChange} />
                                        <ErrorLabel content={quantityError} />
                                    </div>
                                </div>
                                <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                                    <div className={`form-group ${!priceError ? "" : "has-error"}`}>
                                        <label>
                                            Giá nhập
                                            <span className="attention"> * </span>
                                        </label>
                                        <input type="number" className="form-control" value={price} onChange={this.handlePriceChange} />
                                        <ErrorLabel content={priceError} />
                                    </div>
                                </div>
                                <div className={"pull-right"} style={{ padding: 10 }}>
                                    {editMaterials ? (
                                        <React.Fragment>
                                            <button
                                                className="btn btn-success"
                                                onClick={this.handleCancelEditMaterial}
                                                style={{ marginLeft: "10px" }}
                                            >
                                                Hủy chỉnh sửa
                                            </button>
                                            <button
                                                className="btn btn-success"
                                                disabled={!this.isSubmitMaterial()}
                                                onClick={this.handleSaveEditMaterial}
                                                style={{ marginLeft: "10px" }}
                                            >
                                                Lưu
                                            </button>
                                        </React.Fragment>
                                    ) : (
                                        <button
                                            className="btn btn-success"
                                            style={{ marginLeft: "10px" }}
                                            disabled={!this.isSubmitMaterial()}
                                            onClick={this.handleAddMaterial}
                                        >
                                            {"Thêm"}
                                        </button>
                                    )}
                                    <button className="btn btn-primary" style={{ marginLeft: "10px" }} onClick={this.handleClearMaterial}>
                                        Xóa trắng
                                    </button>
                                </div>

                                <table id={`purchase-order-edit-table-${purchaseOrderId}`} className="table table-bordered not-sort">
                                    <thead>
                                        <tr>
                                            <th title={"STT"}>STT</th>
                                            <th title={"Mã đơn"}>Nguyên vật liệu</th>
                                            <th title={"Mã đơn"}>Đơn vị tính</th>
                                            <th title={"Tổng tiền"}>Số lượng</th>
                                            <th title={"Còn"}>Giá nhập</th>
                                            <th title={"Số tiền thanh toán"}>Tổng tiền</th>
                                            <th title={"Đơn vị tính"}>Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {materials.length !== 0 &&
                                            materials.map((item, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{item.material ? item.material.name : ""}</td>
                                                        <td>{item.material ? item.material.baseUnit : ""}</td>
                                                        <td>{item.quantity}</td>
                                                        <td>{item.price ? formatCurrency(item.price) : ""}</td>
                                                        <td style={{ fontWeight: 600 }}>
                                                            {item.price * item.quantity ? formatCurrency(item.price * item.quantity) : ""}
                                                        </td>
                                                        <td style={{ textAlign: "center" }}>
                                                            <a
                                                                href="#abc"
                                                                className="edit"
                                                                title="Sửa"
                                                                onClick={() => this.handleMaterialsEdit(item, index)}
                                                            >
                                                                <i className="material-icons">edit</i>
                                                            </a>
                                                            <a
                                                                onClick={() => this.handleDeleteMaterial(item)}
                                                                className="delete text-red"
                                                                style={{ width: "5px" }}
                                                                title={"Xóa"}
                                                            >
                                                                <i className="material-icons">delete</i>
                                                            </a>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        {materials.length !== 0 && (
                                            <tr>
                                                <td colSpan={5} style={{ fontWeight: 600 }}>
                                                    <center>Tổng thanh toán</center>
                                                </td>
                                                <td style={{ fontWeight: 600 }}>{this.getPaymentAmount()}</td>
                                                <td></td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </fieldset>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    const { customers } = state.crm;
    const { stocks, user, goods } = state;
    return { stocks, customers, user, goods };
}

const mapDispatchToProps = {
    updatePurchaseOrder: PurchaseOrderActions.updatePurchaseOrder,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(PurchaseOrderEditForm));
