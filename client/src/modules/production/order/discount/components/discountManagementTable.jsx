import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { DiscountActions } from "../redux/actions";
import { GoodActions } from "../../../common-production/good-management/redux/actions";
import DiscountCreateForm from "./discountCreateForm";
import { PaginateBar, DataTableSetting, SelectBox, DeleteNotification, ConfirmNotification } from "../../../../../common-components";
import { formatDate } from "../../../../../helpers/formatDate";
import DiscountEditForm from "./discountEditForm";
import DiscountDetailForm from "./discountDetailForm";
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration';
class DiscountManagementTable extends Component {
    constructor(props) {
        super(props);
        const tableId = "discount-manager-table";
        const defaultConfig = { limit: 5 }
        const limit = getTableConfiguration(tableId, defaultConfig).limit;

        this.state = {
            page: 1,
            limit: limit,
            code: "",
            name: "",
            queryDate: "all",
            discountDetail: {},
            tableId
        };
    }

    componentDidMount() {
        const { page, limit, queryDate } = this.state;
        this.props.getAllDiscounts({ page, limit, queryDate });
        this.props.getAllGoodsByType({ type: "product" });
    }

    setPage = async (page) => {
        await this.setState({
            page: page,
        });
        const data = {
            limit: this.state.limit,
            page: page,
        };
        this.props.getAllDiscounts(data);
    };

    setLimit = async (limit) => {
        await this.setState({
            limit: limit,
        });
        const data = {
            limit: limit,
            page: this.state.page,
        };
        this.props.getAllDiscounts(data);
    };

    handleEditDiscount = async (discount) => {
        console.log("discount", discount);
        await this.setState((state) => {
            return {
                ...state,
                currentRow: discount,
            };
        });
        window.$("#modal-edit-discount").modal("show");
    };

    changeDiscountStatus = (id) => {
        let { limit, page, queryDate } = this.state;
        this.props.changeDiscountStatus(id);
        this.props.getAllDiscounts({ limit, page, queryDate });
    };

    deleteDiscountByCode = (code) => {
        this.props.deleteDiscountByCode({ code });
    };

    handleQueryDateChange = (value) => {
        // if (value[0] === "all") {
        //     this.setState({
        //         queryDate: undefined,
        //     });
        // } else {
        this.setState({
            queryDate: value[0],
        });
        // }
    };

    handleCodeChange = (e) => {
        this.setState({
            code: e.target.value,
        });
    };

    handleNameChange = (e) => {
        this.setState({
            name: e.target.value,
        });
    };

    handleSubmitSearch = () => {
        const { page, limit, code, name, queryDate } = this.state;
        const data = {
            limit: limit,
            page: page,
            code: code,
            name: name,
            queryDate: queryDate,
        };
        this.props.getAllDiscounts(data);
    };

    handleShowDetailDiscount = (discountDetail) => {
        this.setState((state) => {
            return {
                ...state,
                discountDetail: discountDetail,
            };
        });
        window.$("#modal-detail-discount").modal("show");
    };

    render() {
        const { translate } = this.props;
        const { discounts } = this.props;
        const { totalPages, page, listDiscounts } = discounts;
        const { currentRow, discountDetail, tableId } = this.state;
        const typeConvert = ["Giảm trên toàn đơn", "Giảm giá từng mặt hàng"];
        return (
            <React.Fragment>
                <div className="box-body qlcv">
                    <DiscountCreateForm />
                    <DiscountDetailForm discountDetail={discountDetail} />
                    {currentRow && <DiscountEditForm discountEdit={currentRow} />}
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">Mã giảm giá</label>
                            <input type="text" className="form-control" onChange={this.handleCodeChange} />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">Tên giảm giá</label>
                            <input type="text" className="form-control" onChange={this.handleNameChange} />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">Trạng thái giảm giá</label>
                            <SelectBox
                                id={`select-filter-status-discounts`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={[
                                    { value: "effective", text: "Đang hiệu lực" },
                                    { value: "expire", text: "Hết hiệu lực" },
                                    { value: "upcoming", text: "Khả dụng" },
                                    { value: "all", text: "Tất cả" },
                                ]}
                                onChange={this.handleQueryDateChange}
                            />
                        </div>
                        <div className="form-group">
                            <button type="button" className="btn btn-success" title={"Tìm kiếm"} onClick={this.handleSubmitSearch}>
                                {"Tìm kiếm"}
                            </button>
                        </div>
                    </div>
                    <table id={tableId} className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Mã</th>
                                <th>Tên</th>
                                <th>Loại giảm giá</th>
                                <th>Ngày bắt đầu</th>
                                <th>Ngày kết thúc</th>
                                <th
                                    style={{
                                        width: "120px",
                                        textAlign: "center",
                                    }}
                                >
                                    Hành động
                                    <DataTableSetting
                                        tableId={tableId}
                                        columnArr={["STT", "Mã", "Tên", "Loại giảm giá", "Trạng thái"]}
                                        setLimit={this.setLimit}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {listDiscounts &&
                                listDiscounts.length !== 0 &&
                                listDiscounts.map((discount, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{discount.code}</td>
                                        <td>{discount.name}</td>
                                        <td>{discount.type !== undefined ? typeConvert[discount.type] : ""}</td>
                                        <td>{discount.effectiveDate ? formatDate(discount.effectiveDate) : "---"}</td>
                                        <td>{discount.expirationDate ? formatDate(discount.expirationDate) : "---"}</td>
                                        {/* <td>
                                            <center>
                                                {discount.status ? (
                                                    <ConfirmNotification
                                                        icon="domain_verification"
                                                        name="domain_verification"
                                                        className="text-success"
                                                        title={"Click để thay đổi trạng thái"}
                                                        content={`<h4>Bỏ kích hoạt khuyến mãi</h4>
                                                        <br/> <h5>Điều đó đồng ghĩa với việc khuyến mãi này sẽ không còn được áp dụng vào các đơn hàng</h5>
                                                        <h5>Tuy nhiên các dữ liệu đơn hàng liên quan đến khuyến mãi này trước đó không bị ảnh hưởng và bạn có thể kích hoạt lại nó</h5?`}
                                                        func={() => this.changeDiscountStatus(discount._id)}
                                                    />
                                                ) : (
                                                    <ConfirmNotification
                                                        icon="disabled_by_default"
                                                        name="disabled_by_default"
                                                        className="text-red"
                                                        title={"Click để thay đổi trạng thái"}
                                                        content={`<h4>Kích hoạt khuyến mãi này</h4>
                                                    <br/> <h5>Khuyến mãi này có thể áp dụng vào các đơn hàng nếu được kích hoạt trở lại</h5>`}
                                                        func={() => this.changeDiscountStatus(discount._id)}
                                                    />
                                                )}
                                            </center>
                                        </td> */}
                                        <td style={{ textAlign: "center" }}>
                                            <a
                                                style={{ width: "5px" }}
                                                title={"Xem chi tiết khuyến mãi"}
                                                onClick={() => {
                                                    this.handleShowDetailDiscount(discount);
                                                }}
                                            >
                                                <i className="material-icons">view_list</i>
                                            </a>
                                            <a
                                                className="edit text-yellow"
                                                style={{ width: "5px" }}
                                                title={"Sửa thông tin khuyến mãi"}
                                                onClick={() => {
                                                    this.handleEditDiscount(discount);
                                                }}
                                            >
                                                <i className="material-icons">edit</i>
                                            </a>
                                            <DeleteNotification
                                                content={"Bạn có chắc chắn muốn xóa khuyến mãi này"}
                                                data={{
                                                    id: discount._id,
                                                    info: discount.name,
                                                }}
                                                func={() => this.deleteDiscountByCode(discount.code)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                    {discounts.isLoading ? (
                        <div className="table-info-panel">{translate("confirm.loading")}</div>
                    ) : (
                            (typeof listDiscounts === "undefined" || listDiscounts.length === 0) && (
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
    const { discounts } = state;
    return { discounts };
}

const mapDispatchToProps = {
    getAllDiscounts: DiscountActions.getAllDiscounts,
    getAllGoodsByType: GoodActions.getAllGoodsByType,
    changeDiscountStatus: DiscountActions.changeDiscountStatus,
    deleteDiscountByCode: DiscountActions.deleteDiscountByCode,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(DiscountManagementTable));
