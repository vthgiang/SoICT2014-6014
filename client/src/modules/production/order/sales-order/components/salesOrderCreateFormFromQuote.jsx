import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { SalesOrderActions } from "../redux/actions";
import { LotActions } from "../../../warehouse/inventory-management/redux/actions";
import { GoodActions } from "../../../common-production/good-management/redux/actions";
import { DialogModal, SelectBox, ErrorLabel } from "../../../../../common-components";
import AddManufacturingWorkForGood from "./createSalesOrderFromQuote/addManufacturingWorkForGood";

class SalesOrderCreateFormFromQuote extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code: "",
            goods: [],
            approvers: [],
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.code !== prevState.code) {
            return {
                code: nextProps.code,
            };
        }
    }

    getQuoteOptions = () => {
        let options = [];

        const { quotesToMakeOrder } = this.props.quotes;
        if (quotesToMakeOrder) {
            options = [
                {
                    value: "title", //Title không được chọn
                    text: "---Chọn báo giá---",
                },
            ];

            let mapOptions = quotesToMakeOrder.map((item) => {
                return {
                    value: item._id,
                    text: item.code,
                };
            });

            options = options.concat(mapOptions);
        }

        return options;
    };

    checkAvailableUser = (listUsers, id) => {
        var result = -1;
        listUsers.forEach((value, index) => {
            if (value.user._id === id) {
                result = index;
            }
        });
        return result;
    };

    getUsersInDepartments = () => {
        let users = [];
        const { listBusinessDepartments } = this.props;
        for (let indexDepartment = 0; indexDepartment < listBusinessDepartments.length; indexDepartment++) {
            if (listBusinessDepartments[indexDepartment].role === 2 || listBusinessDepartments[indexDepartment].role === 3) {
                //Chỉ lấy đơn vị quản lý bán hàng và đơn vị kế toán
                const { managers, deputyManagers, employees } = listBusinessDepartments[indexDepartment].organizationalUnit;
                //Thềm các trưởng đơn vị vào danh sách
                for (let indexRole = 0; indexRole < managers.length; indexRole++) {
                    //Lấy ra các role trong phòng ban
                    if (managers[indexRole].users) {
                        for (let indexUser = 0; indexUser < managers[indexRole].users.length; indexUser++) {
                            //Check nếu user chưa tồn tại trong danh sách thì cho vào danh sách
                            let availableCheckedIndex = this.checkAvailableUser(users, managers[indexRole].users[indexUser].userId._id);
                            if (availableCheckedIndex === -1) {
                                users.push({ user: managers[indexRole].users[indexUser].userId, roleName: managers[indexRole].name });
                            } else {
                                //Nếu người dùng đã có trong danh sách thì thêm role vào
                                users[availableCheckedIndex].roleName = users[availableCheckedIndex].roleName + ", " + managers[indexRole].name;
                            }
                        }
                    }
                }
                //Thềm các phó đơn vị vào danh sách
                for (let indexRole = 0; indexRole < deputyManagers.length; indexRole++) {
                    //Lấy ra các role trong phòng ban
                    if (deputyManagers[indexRole].users) {
                        for (let indexUser = 0; indexUser < deputyManagers[indexRole].users.length; indexUser++) {
                            //Check nếu user chưa tồn tại trong danh sách thì cho vào danh sách
                            let availableCheckedIndex = this.checkAvailableUser(users, deputyManagers[indexRole].users[indexUser].userId._id);
                            if (availableCheckedIndex === -1) {
                                users.push({ user: deputyManagers[indexRole].users[indexUser].userId, roleName: deputyManagers[indexRole].name });
                            } else {
                                //Nếu người dùng đã có trong danh sách thì thêm role vào
                                users[availableCheckedIndex].roleName = users[availableCheckedIndex].roleName + ", " + deputyManagers[indexRole].name;
                            }
                        }
                    }
                }
                //Thềm nhân viên vào danh sách
                for (let indexRole = 0; indexRole < employees.length; indexRole++) {
                    //Lấy ra các role trong phòng ban
                    if (employees[indexRole].users) {
                        for (let indexUser = 0; indexUser < employees[indexRole].users.length; indexUser++) {
                            //Check nếu user chưa tồn tại trong danh sách thì cho vào danh sách
                            let availableCheckedIndex = this.checkAvailableUser(users, employees[indexRole].users[indexUser].userId._id);
                            if (availableCheckedIndex === -1) {
                                users.push({ user: employees[indexRole].users[indexUser].userId, roleName: employees[indexRole].name });
                            } else {
                                //Nếu người dùng đã có trong danh sách thì thêm role vào
                                users[availableCheckedIndex].roleName = users[availableCheckedIndex].roleName + ", " + employees[indexRole].name;
                            }
                        }
                    }
                }
            }
        }
        return users;
    };

    getApproversOptions = () => {
        let options = [];

        const { listBusinessDepartments } = this.props;
        if (listBusinessDepartments.length) {
            options = [
                {
                    value: "title", //Title không được chọn
                    text: "---Chọn người phê duyệt---",
                },
            ];
            let users = this.getUsersInDepartments();
            let mapOptions = users.map((item) => {
                return {
                    value: item.user._id,
                    text: item.user.name + " - " + item.roleName,
                };
            });

            options = options.concat(mapOptions);
        }

        return options;
    };

    validateQuote = (value, willUpdateState = true) => {
        let msg = undefined;
        if (!value) {
            msg = "Giá trị không được bỏ trống!";
        } else if (value === "title") {
            msg = "Giá trị không được bỏ trống!";
        }

        if (willUpdateState) {
            this.setState((state) => {
                return {
                    ...state,
                    quoteError: msg,
                };
            });
        }
        return msg;
    };

    handleQuoteChange = async (value) => {
        let quoteInfo = {};
        if (value[0] !== "title") {
            const { quotesToMakeOrder } = this.props.quotes;
            quoteInfo = await quotesToMakeOrder.find((element) => element._id === value[0]);
        }

        await this.setState((state) => {
            return {
                ...state,
                quote: value[0],
                goods: quoteInfo.goods ? quoteInfo.goods : [],
            };
        });

        await this.validateQuote(value[0], true);

        if (value[0] !== "title") {
            let goodIds = [];
            if (quoteInfo) {
                goodIds = quoteInfo.goods.map((good) => good.good._id);
            }
            await this.props.getInventoryByGoodIds({ array: goodIds });
        }
    };

    validatePriority = (value, willUpdateState = true) => {
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
                    priorityError: msg,
                };
            });
        }
        return msg;
    };

    handlePriorityChange = (value) => {
        this.setState((state) => {
            return {
                ...state,
                priority: value[0],
            };
        });
        this.validatePriority(value[0], true);
    };

    validateApprovers = (value, willUpdateState = true) => {
        let msg = undefined;
        if (!value.length) {
            msg = "Giá trị không được để trống";
        } else {
            for (let index = 0; index < value.length; value++) {
                if (value[index] === "title") {
                    msg = "Không được chọn tiêu đề";
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
        return msg;
    };

    handleApproversChange = (value) => {
        this.setState((state) => {
            return {
                ...state,
                approvers: value,
            };
        });
        this.validateApprovers(value, true);
    };

    isFormValidated = () => {
        let { priority, quote, approvers } = this.state;

        if (this.validateQuote(quote, false) || this.validatePriority(priority, false) || this.validateApprovers(approvers, false)) {
            return false;
        } else {
            return true;
        }
    };

    getGoodSubmit = () => {
        let { goods } = this.state;
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

    save = async () => {
        if (this.isFormValidated()) {
            let { priority, code, quote, approvers } = this.state;

            const { quotesToMakeOrder } = this.props.quotes;
            let quoteInfo = quotesToMakeOrder.find((element) => element._id === quote);

            let data = {
                code,
                quote,
                priority,
                customer: quoteInfo.customer,
                customerPhone: quoteInfo.customerPhone,
                customerAddress: quoteInfo.customerAddress,
                customerRepresent: quoteInfo.customerRepresent,
                customerEmail: quoteInfo.customerEmail,
                goods: this.getGoodSubmit(),
                discounts: quoteInfo.discounts,
                shippingFee: quoteInfo.shippingFee,
                deliveryTime: quoteInfo.deliveryTime,
                coin: quoteInfo.coin,
                allCoin: quoteInfo.allCoin,
                paymentAmount: quoteInfo.paymentAmount,
                approvers: approvers.map((element) => {
                    return { approver: element };
                }),
                note: quoteInfo.note,
            };

            await this.props.createNewSalesOrder(data);

            this.setState((state) => {
                return {
                    ...state,
                    priority: "title",
                    code: "",
                    quote: "title",
                    goods: [],
                    currentGood: { good: "" },
                    currentManufacturingWorks: {
                        _id: "title",
                        code: "",
                        name: "",
                        description: "",
                        address: "",
                    },
                    approvers: [],
                };
            });
        }
    };

    handleGetManufacturingList = async (goodItem) => {
        //Lấy danh sách các nhà máy có thể sản xuất sản phẩm
        await this.props.getManufacturingWorksByProductId(goodItem.good._id);

        let currentManufacturingWorks = goodItem.manufacturingWorks
            ? goodItem.manufacturingWorks
            : {
                  _id: "title",
                  code: "",
                  name: "",
                  description: "",
                  address: "",
              };

        await this.setState({
            currentGood: goodItem,
            currentManufacturingWorks,
        });

        window.$(`#modal-create-from-quote-and-add-manufacturing-for-good`).modal("show");
    };

    handleChangeManufacturingWorksForGood = (value) => {
        let { goods, currentGood } = this.state;
        if (value[0] !== "title") {
            let { listManufacturingWorks } = this.props.goods;
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

            this.setState({
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

            this.setState({
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

    render() {
        let { quote, goods, priority, code, currentManufacturingWorks, currentGood, approvers } = this.state;
        const { quoteError, priorityError, approversError } = this.state;

        const { listInventories } = this.props.lots;
        if (goods.length && listInventories.length) {
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

        return (
            <React.Fragment>
                <DialogModal
                    modalID={`modal-add-sales-order-from-quote`}
                    isLoading={false}
                    formID={`form-add-sales-order-from-quote`}
                    title={"Đơn hàng mới"}
                    msg_success={"Thêm đơn thành công"}
                    msg_faile={"Thêm đơn không thành công"}
                    size="50"
                    style={{ backgroundColor: "green" }}
                    disableSubmit={!this.isFormValidated()}
                    func={this.save}
                >
                    <AddManufacturingWorkForGood
                        currentGood={currentGood}
                        currentManufacturingWorks={currentManufacturingWorks}
                        handleChangeManufacturingWorksForGood={this.handleChangeManufacturingWorksForGood}
                    />
                    <div className="form-group">
                        <label>
                            Mã đơn
                            <span className="attention"> * </span>
                        </label>
                        <input type="text" className="form-control" value={code} disabled={true} />
                    </div>
                    <div className={`form-group ${!quoteError ? "" : "has-error"}`}>
                        <label>
                            Mã báo giá
                            <span className="attention"> * </span>
                        </label>
                        <SelectBox
                            id={`select-create-sales-order-from-quote`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            value={quote}
                            items={this.getQuoteOptions()}
                            onChange={this.handleQuoteChange}
                            multiple={false}
                        />
                        <ErrorLabel content={quoteError} />
                    </div>

                    <div className={`form-group ${!priorityError ? "" : "has-error"}`}>
                        <label>
                            Độ ưu tiên
                            <span className="attention"> * </span>
                        </label>
                        <SelectBox
                            id={`select-create-sales-order-priority-from-quote`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            value={priority}
                            items={[
                                { value: "title", text: "---Chọn độ ưu tiên---" },
                                { value: 1, text: "Thấp" },
                                { value: 2, text: "Trung bình" },
                                { value: 3, text: "Cao" },
                                { value: 4, text: "Đặc biệt" },
                            ]}
                            onChange={this.handlePriorityChange}
                            multiple={false}
                        />
                        <ErrorLabel content={priorityError} />
                    </div>
                    <div className={`form-group ${!approversError ? "" : "has-error"}`}>
                        <label>
                            Người phê duyệt
                            <span className="attention"> * </span>
                        </label>
                        <SelectBox
                            id={`select-create-sales-order-from-quote-approvers`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            value={approvers}
                            items={this.getApproversOptions()}
                            onChange={this.handleApproversChange}
                            multiple={true}
                        />
                        <ErrorLabel content={approversError} />
                    </div>
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border">Thông tin sản phẩm</legend>
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
                                {goods.length !== 0 &&
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
                                                    <a onClick={() => this.handleGetManufacturingList(item)}>
                                                        {item.manufacturingWorks ? (
                                                            <span className="text-success">Đang thiết lập</span>
                                                        ) : (
                                                            <span>Click để yêu cầu</span>
                                                        )}
                                                    </a>
                                                </td>
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>
                    </fieldset>
                </DialogModal>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    const { listBusinessDepartments } = state.businessDepartments;
    const { quotes, lots, goods } = state;
    return { quotes, lots, goods, listBusinessDepartments };
}

const mapDispatchToProps = {
    createNewSalesOrder: SalesOrderActions.createNewSalesOrder,
    getInventoryByGoodIds: LotActions.getInventoryByGoodIds,
    getManufacturingWorksByProductId: GoodActions.getManufacturingWorksByProductId,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(SalesOrderCreateFormFromQuote));
