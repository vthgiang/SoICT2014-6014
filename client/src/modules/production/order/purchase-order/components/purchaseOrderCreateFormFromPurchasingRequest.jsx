import React, { Component, useEffect, useState } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { PurchaseOrderActions } from "../redux/actions";
import { DialogModal, SelectBox, ErrorLabel, DatePicker } from "../../../../../common-components";
import ValidationHelper from "../../../../../helpers/validationHelper";
import { formatCurrency } from "../../../../../helpers/formatCurrency";
import { formatDate, formatToTimeZoneDate } from "../../../../../helpers/formatDate";
import { UserActions } from "../../../../super-admin/user/redux/actions";
import { UserServices } from "../../../../super-admin/user/redux/services";

function PurchaseOrderCreateFormFromPurchasingRequest(props) {

    const [state, setState] = useState({
        code: "",
        material: "",
        materials: [],
        approvers: [],
        price: "",
        quantity: "",
        purchasingRequest: "",
        listUser: { length: -1 },
    })


    if (props.code !== state.code) {
        setState((state) => {
            return {
                ...state,
                code: props.code,
            }
        })
    }

    useEffect(() => {
        UserServices.get()
            .then(res => {
                setState({
                    ...state,
                    listUser: res.data.content
                })
            })
    }, [])

    const getPurchasingRequestOptions = () => {
        let options = [];

        const { listPurchasingRequests } = props.purchasingRequest;
        if (listPurchasingRequests) {
            options = [
                {
                    value: "title", //Title không được chọn
                    text: "---Chọn đơn đề nghị---",
                },
            ];

            let mapOptions = listPurchasingRequests.map((item) => {
                return {
                    value: item._id,
                    text: item.code,
                };
            });

            options = options.concat(mapOptions);
        }

        return options;
    };

    const getSuplierOptions = () => {
        let options = [];

        const { list } = props.customers;
        if (list) {
            options = [
                {
                    value: "title", //Title không được chọn
                    text: "---Chọn nhà cung cấp---",
                },
            ];

            let mapOptions = props.customers.list.map((item) => {
                return {
                    value: item._id,
                    text: item.name,
                };
            });

            options = options.concat(mapOptions);
        }

        return options;
    };

    const getApproverOptions = () => {
        let options = [];
        const user = state.listUser;
        if (user) {
            options = [
                {
                    value: "title", //Title không được chọn
                    text: "---Chọn người phê duyệt---",
                },
            ];

            let mapOptions = user.map((item) => {
                return {
                    value: item._id,
                    text: item.name,
                };
            });

            options = options.concat(mapOptions);
        }
        return options;
    };

    const getStockOptions = () => {
        let options = [];
        const { listStocks } = props.stocks;

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

    const getMaterialOptions = () => {
        let options = [];
        let { listGoodsByType } = props.goods;
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

    const validatePurchasingRequest = (value, willUpdateState = true) => {
        let msg = undefined;
        if (!value || value === "" || value === "title") {
            msg = "Giá trị không được bỏ trống!";
        }

        if (willUpdateState) {
            setState({
                ...state,
                purchasingRequestError: msg,
            });
        }

        return msg;
    };

    const handlePurchasingRequestChange = async (value) => {
        if (value[0] === "title") {
            setState({
                ...state,
                purchasingRequest: value[0],
            });
        } else {
            //Cập nhật đơn đề nghị vào đơn mua nguyên vật liệu
            const { listPurchasingRequests } = props.purchasingRequest;
            let purchasingRequestInfo = listPurchasingRequests.find((element) => element._id === value[0]);

            if (purchasingRequestInfo) {
                let materials = purchasingRequestInfo.materials.map((element) => {
                    return {
                        material: element.good,
                        quantity: element.quantity,
                    };
                });

                await setState({
                    ...state,
                    purchasingRequest: value[0],
                    materials,
                    description: purchasingRequestInfo.description,
                    intendReceiveTime: purchasingRequestInfo.intendReceiveTime ? formatDate(purchasingRequestInfo.intendReceiveTime) : "",
                });
            }
        }

        validatePurchasingRequest(value[0], true);
    };

    const validateSupplier = (value, willUpdateState = true) => {
        let msg = undefined;
        if (!value || value === "" || value === "title") {
            msg = "Giá trị không được bỏ trống!";
        }

        if (willUpdateState) {
            setState({
                ...state,
                supplierError: msg,
            });
        }

        return msg;
    };

    const handleSupplierChange = async (value) => {
        setState({
            ...state,
            supplier: value[0],
        });

        validateSupplier(value[0], true);
    };

    const validateApprovers = (value, willUpdateState = true) => {
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
            setState((state) => {
                return {
                    ...state,
                    approversError: msg,
                };
            });
        }
        return msg === undefined;
    };

    const handleApproversChange = (value) => {
        setState({
            ...state,
            approvers: value,
        });
        validateApprovers(value, true);
    };

    const validateStock = (value, willUpdateState = true) => {
        let msg = undefined;
        if (!value || value === "" || value === "title") {
            msg = "Giá trị không được bỏ trống!";
        }

        if (willUpdateState) {
            setState({
                ...state,
                stockError: msg,
            });
        }

        return msg;
    };

    const handleStockChange = (value) => {
        setState({
            ...state,
            stock: value[0],
        });
        validateStock(value[0], true);
    };

    const handleIntendReceiveTimeChange = (value) => {
        if (!value) {
            value = null;
        }

        let { translate } = props;
        let { message } = ValidationHelper.validateEmpty(translate, value);
        setState({
            ...state,
            intendReceiveTime: value,
            intendReceiveTimeError: message,
        });
    };

    const validateDiscount = (value, willUpdateState = true) => {
        let msg = undefined;
        if (value && parseInt(value) <= 0) {
            msg = "Giá trị phải lớn hơn 0, có thể bỏ trống!";
        }
        if (willUpdateState) {
            setState({
                ...state,
                discountError: msg,
            });
        }
        return msg;
    };

    const handleDiscountChange = (e) => {
        let { value } = e.target;
        setState({
            ...state,
            discount: value,
        });

        validateDiscount(value, true);
    };

    const handleDescriptionChange = (e) => {
        let { value } = e.target;
        setState({
            ...state,
            desciption: value,
        });
    };

    const validateMaterial = (value, willUpdateState = true) => {
        let msg = undefined;
        if (!value) {
            msg = "Giá trị không được để trống";
        } else if (value === "title") {
            msg = "Giá trị không được để trống";
        }

        if (willUpdateState) {
            setState((state) => {
                return {
                    ...state,
                    materialError: msg,
                };
            });
        }
        return msg;
    };

    const handleMaterialChange = (value) => {
        if (value[0] !== "title") {
            let { listGoodsByType } = props.goods;
            const materialInfo = listGoodsByType.filter((item) => item._id === value[0]);

            if (materialInfo.length) {
                setState((state) => {
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
            setState((state) => {
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
        validateMaterial(value[0], true);
    };

    const validateQuantity = (value, willUpdateState = true) => {
        let msg = undefined;
        if (!value || value === "") {
            msg = "Giá trị không được bỏ trống!";
        } else if (parseInt(value) <= 0) {
            msg = "giá trị phải lớn hơn 0!";
        }
        if (willUpdateState) {
            setState({
                ...state,
                quantityError: msg,
            });
        }

        return msg;
    };

    const handleQuantityChange = (e) => {
        let { value } = e.target;
        setState({
            ...state,
            quantity: value,
        });

        validateQuantity(value, true);
    };

    const validatePrice = (value, willUpdateState = true) => {
        let msg = undefined;
        if (!value || value === "") {
            msg = "Giá trị không được bỏ trống!";
        } else if (parseInt(value) < 0) {
            msg = "giá trị không được nhỏ hơn 0!";
        }
        if (willUpdateState) {
            setState({
                ...state,
                priceError: msg,
            });
        }

        return msg;
    };

    const handlePriceChange = (e) => {
        let { value } = e.target;
        setState({
            ...state,
            price: value,
        });
        validatePrice(value, true);
    };

    const validatePriceChangeOnTable = (value, index, willUpdateState = true) => {
        let msg = undefined;
        if (!value || value === "") {
            msg = "Giá trị không được bỏ trống!";
        } else if (parseInt(value) < 0) {
            msg = "giá trị không được nhỏ hơn 0!";
        }
        if (willUpdateState) {
            setState({
                ...state,
                priceErrorPosition: index,
                priceErrorOnTable: msg,
            });
        }

        return msg;
    };

    const handlePriceChangeOnTable = (e, index) => {
        let { value } = e.target;

        let { materials } = state;
        materials[index].price = value;
        setState({
            ...state,
            materials,
        });

        validatePriceChangeOnTable(value, index, true);
    };

    const handleClearMaterial = (e) => {
        e.preventDefault();
        setState({
            ...state,
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

    const getPaymentAmount = (isSubmit = false) => {
        let { materials, discount } = state;
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

    const isSubmitMaterial = () => {
        //Validate để thêm material vào list materials
        let { material, quantity, price } = state;
        if (validateMaterial(material, false) || validateQuantity(quantity, false) || validatePrice(price, false)) {
            return false;
        } else {
            return true;
        }
    };

    const handleAddMaterial = (e) => {
        e.preventDefault();
        if (isSubmitMaterial()) {
            const { material, quantity, price, materials } = state;
            let data = {
                material,
                quantity,
                price,
            };

            materials.push(data);

            setState({
                ...state,
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

    const handleDeleteMaterial = (item) => {
        let { materials } = state;
        let materialsFilter = materials.filter((element) => element.material !== item.material);
        setState({
            ...state,
            materials: materialsFilter,
        });
    };

    const handleMaterialsEdit = (item, index) => {
        setState({
            ...state,
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

    const handleSaveEditMaterial = (e) => {
        e.preventDefault();
        if (isSubmitMaterial()) {
            const { material, quantity, price, materials, indexEditting } = state;
            let data = {
                material,
                quantity,
                price,
            };

            materials[indexEditting] = data;

            setState({
                ...state,
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

    const handleCancelEditMaterial = (e) => {
        e.preventDefault();
        setState({
            ...state,
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

    const validatePriceInMaterials = () => {
        //Kiểm tra giá đã được thêm vào chưa
        let { materials } = state;
        if (!materials.length) {
            return false;
        }

        for (let index = 0; index < materials.length; index++) {
            if (validatePriceChangeOnTable(materials[index].price, index, false)) {
                return false;
            }
        }

        //Tất cả giá đã được thêm vào và hợp lệ
        return true;
    };

    const isFormValidated = () => {
        const { translate } = props;
        let { stock, supplier, approvers, intendReceiveTime, materials, purchasingRequest } = state;
        if (
            validateStock(stock, false) ||
            validateSupplier(supplier, false) ||
            validatePurchasingRequest(purchasingRequest, false) ||
            ValidationHelper.validateEmpty(translate, intendReceiveTime).message ||
            !validatePriceInMaterials() ||
            !approvers.length ||
            !materials.length
        ) {
            return false;
        }
        return true;
    };

    const formatMaterialsForSubmit = () => {
        let { materials } = state;
        let materialsMap = materials.map((element) => {
            return {
                material: element.material,
                quantity: element.quantity,
                price: element.price,
            };
        });

        return materialsMap;
    };

    const formatApproversForSubmit = () => {
        let { approvers } = state;
        let approversMap = approvers.map((element) => {
            return {
                approver: element,
            };
        });

        return approversMap;
    };

    const save = async () => {
        let { code, stock, supplier, intendReceiveTime, discount, desciption, purchasingRequest } = state;
        let materials = await formatMaterialsForSubmit();
        let approvers = await formatApproversForSubmit();
        let data = {
            code,
            stock,
            supplier,
            approvers,
            intendReceiveTime: formatToTimeZoneDate(intendReceiveTime),
            discount,
            desciption,
            materials,
            purchasingRequest,
            paymentAmount: getPaymentAmount(true),
        };
        await props.createPurchaseOrder(data);

        setState({
            ...state,
            stock: "title",
            supplier: "title",
            approvers: [],
            intendReceiveTime: "",
            discount: "",
            desciption: "",
            materials: [],
            quantity: "",
            material: "title",
            price: "",
            purchasingRequest: "title",
        });
    };

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
    } = state;
    const {
        supplierError,
        approversError,
        stockError,
        intendReceiveTimeError,
        discountError,
        materialError,
        quantityError,
        priceError,
        purchasingRequestError,
        priceErrorPosition,
        priceErrorOnTable,
    } = state;
    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-add-purchase-order-from-puchasing-request`}
                isLoading={false}
                formID={`form-add-purchase-order-from-puchasing-request`}
                title={"Tạo từ đơn đề nghị"}
                msg_success={"Tạo thành công"}
                msg_failure={"Tạo không thành công"}
                disableSubmit={!isFormValidated()}
                func={save}
                size="75"
            >
                <form id={`form-add-purchase-order-from-puchasing-request`}>
                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                        <div className="form-group">
                            <label>
                                Mã đơn
                                    <span className="attention"> * </span>
                            </label>
                            <input type="text" className="form-control" value={code} disabled={true} />
                        </div>
                        <div className={`form-group ${!purchasingRequestError ? "" : "has-error"}`}>
                            <label>
                                Đơn đề nghị mua nguyên vật liệu
                                    <span className="attention"> * </span>
                            </label>
                            <SelectBox
                                id={`select-create-purchase-order-form-request`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                value={purchasingRequest}
                                items={getPurchasingRequestOptions()}
                                onChange={handlePurchasingRequestChange}
                                multiple={false}
                            />
                            <ErrorLabel content={purchasingRequestError} />
                        </div>
                        <div className={`form-group ${!stockError ? "" : "has-error"}`}>
                            <label>
                                Kho nhập nguyên vật liệu
                                    <span className="attention"> * </span>
                            </label>
                            <SelectBox
                                id={`select-create-purchase-order-from-request-stock`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                value={stock}
                                items={getStockOptions()}
                                onChange={handleStockChange}
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
                                id={`select-create-purchase-order-from-request-supplier`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                value={supplier}
                                items={getSuplierOptions()}
                                onChange={handleSupplierChange}
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
                            {state.listUser && state.listUser.length !== -1 &&
                                <SelectBox
                                    id={`select-create-purchase-order-from-request-approvers`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={approvers}
                                    items={getApproverOptions()}
                                    onChange={handleApproversChange}
                                    multiple={true}
                                />}

                            <ErrorLabel content={approversError} />
                        </div>
                        <div className={`form-group ${!intendReceiveTimeError ? "" : "has-error"}`}>
                            <label>
                                Ngày dự kiến nhập hàng
                                    <span className="attention"> * </span>
                            </label>
                            <DatePicker
                                id="date_picker_create_purchase-order_from_request_intend_received_time"
                                value={intendReceiveTime}
                                onChange={handleIntendReceiveTimeChange}
                                disabled={false}
                            />
                            <ErrorLabel content={intendReceiveTimeError} />
                        </div>
                        <div className={`form-group ${!discountError ? "" : "has-error"}`}>
                            <label>Tiền được khuyến mãi</label>
                            <input type="number" className="form-control" value={discount} onChange={handleDiscountChange} />
                            <ErrorLabel content={discountError} />
                        </div>
                        <div className={`form-group`}>
                            <label>Ghi chú</label>
                            <textarea type="text" className="form-control" value={desciption} onChange={handleDescriptionChange} />
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
                                        id={`select-create-purchase-order-from-request-material`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value={material&&material._id}
                                        items={getMaterialOptions()}
                                        onChange={handleMaterialChange}
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
                                    <input type="number" className="form-control" value={quantity} onChange={handleQuantityChange} />
                                    <ErrorLabel content={quantityError} />
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                                <div className={`form-group ${!priceError ? "" : "has-error"}`}>
                                    <label>
                                        Giá nhập
                                            <span className="attention"> * </span>
                                    </label>
                                    <input type="number" className="form-control" value={price} onChange={handlePriceChange} />
                                    <ErrorLabel content={priceError} />
                                </div>
                            </div>
                            <div className={"pull-right"} style={{ padding: 10 }}>
                                {editMaterials ? (
                                    <React.Fragment>
                                        <button
                                            className="btn btn-success"
                                            onClick={handleCancelEditMaterial}
                                            style={{ marginLeft: "10px" }}
                                        >
                                            Hủy chỉnh sửa
                                            </button>
                                        <button
                                            className="btn btn-success"
                                            disabled={!isSubmitMaterial()}
                                            onClick={handleSaveEditMaterial}
                                            style={{ marginLeft: "10px" }}
                                        >
                                            Lưu
                                            </button>
                                    </React.Fragment>
                                ) : (
                                    <button
                                        className="btn btn-success"
                                        style={{ marginLeft: "10px" }}
                                        disabled={!isSubmitMaterial()}
                                        onClick={handleAddMaterial}
                                    >
                                        {"Thêm"}
                                    </button>
                                )}
                                <button className="btn btn-primary" style={{ marginLeft: "10px" }} onClick={handleClearMaterial}>
                                    Xóa trắng
                                    </button>
                            </div>

                            <table id={`purchase-order-create-from-request-table`} className="table table-bordered not-sort">
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
                                    {materials&&materials.length !== 0 &&
                                        materials.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.material ? item.material.name : ""}</td>
                                                    <td>{item.material ? item.material.baseUnit : ""}</td>
                                                    <td>{item.quantity}</td>
                                                    {/* <td>{item.price ? formatCurrency(item.price) : ""}</td> */}
                                                    <td>
                                                        <div
                                                            className={`form-group ${parseInt(priceErrorPosition) === index && priceErrorOnTable ? "has-error" : ""
                                                                }`}
                                                        >
                                                            <input
                                                                className="form-control"
                                                                type="number"
                                                                value={item.price}
                                                                name="value"
                                                                style={{ width: "100%" }}
                                                                onChange={(e) => handlePriceChangeOnTable(e, index)}
                                                            />
                                                            {parseInt(priceErrorPosition) === index && priceErrorOnTable && (
                                                                <ErrorLabel content={priceErrorOnTable} />
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td style={{ fontWeight: 600 }}>
                                                        {item.price * item.quantity ? formatCurrency(item.price * item.quantity) : ""}
                                                    </td>
                                                    <td style={{ textAlign: "center" }}>
                                                        <a
                                                            href="#abc"
                                                            className="edit"
                                                            title="Sửa"
                                                            onClick={() => handleMaterialsEdit(item, index)}
                                                        >
                                                            <i className="material-icons">edit</i>
                                                        </a>
                                                        <a
                                                            onClick={() => handleDeleteMaterial(item)}
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
                                    {materials&&materials.length !== 0 && (
                                        <tr>
                                            <td colSpan={5} style={{ fontWeight: 600 }}>
                                                <center>Tổng thanh toán</center>
                                            </td>
                                            <td style={{ fontWeight: 600 }}>{getPaymentAmount()}</td>
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

function mapStateToProps(state) {
    const { customers } = state.crm;
    const { stocks, purchasingRequest, user, goods } = state;
    return { stocks, customers, purchasingRequest, user, goods };
}

const mapDispatchToProps = {
    createPurchaseOrder: PurchaseOrderActions.createPurchaseOrder,
    getUser: UserActions.get,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(PurchaseOrderCreateFormFromPurchasingRequest));
