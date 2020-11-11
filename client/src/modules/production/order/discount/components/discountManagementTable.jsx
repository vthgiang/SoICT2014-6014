import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { DiscountActions } from "../redux/actions";
import { GoodActions } from "../../../common-production/good-management/redux/actions";
import DiscountCreateForm from "./discountCreateForm";
import { PaginateBar, DataTableSetting, SelectBox, DeleteNotification, ConfirmNotification } from "../../../../../common-components";
import DiscountEditForm from "./discountEditForm";

class DiscountManagementTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            limit: 5,
        };
    }

    componentDidMount() {
        const { page, limit } = this.state;
        this.props.getAllDiscounts({ page, limit });
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
        await this.setState((state) => {
            return {
                ...state,
                currentRow: discount,
            };
        });
        window.$("#modal-edit-discount").modal("show");
    };

    render() {
        const { translate } = this.props;
        const { discounts } = this.props;
        const { totalPages, page, listDiscounts } = discounts;
        const { currentRow } = this.state;
        console.log("DISCOUNT", discounts);
        return (
            <React.Fragment>
                <div className="box-body qlcv">
                    <DiscountCreateForm />
                    {currentRow && <DiscountEditForm discountEdit={currentRow} />}
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">Mã giảm giá </label>
                            <input type="text" className="form-control" onChange={this.handleCodeChange} />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">Tên giảm giá </label>
                            <input type="text" className="form-control" onChange={this.handleNameChange} />
                        </div>
                        <div className="form-group">
                            <button type="button" className="btn btn-success" title={"Tìm kiếm"} onClick={this.handleSubmitSearch}>
                                {"Tìm kiếm"}
                            </button>
                        </div>
                    </div>
                    <table id="discount-table" className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Mã</th>
                                <th>Tên</th>
                                <th>Loại giảm giá</th>
                                <th>Trạng thái</th>
                                <th
                                    style={{
                                        width: "120px",
                                        textAlign: "center",
                                    }}
                                >
                                    Hành động
                                    <DataTableSetting
                                        tableId="discount-table"
                                        columnArr={["STT", "Mã", "Tên", "Loại giảm giá", "Trạng thái"]}
                                        limit={this.state.limit}
                                        hideColumnOption={true}
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
                                        <td>{discount.type}</td>
                                        <td>
                                            <center>
                                                <i className={discount.status ? "fa  fa-check text-success" : "fa fa-close text-danger"}></i>
                                            </center>
                                        </td>
                                        <td style={{ textAlign: "center" }}>
                                            <a
                                                style={{ width: "5px" }}
                                                title={"Xem chi tiết thuế"}
                                                onClick={() => {
                                                    this.handleShowDetailDiscount(discount._id);
                                                }}
                                            >
                                                <i className="material-icons">view_list</i>
                                            </a>
                                            <a
                                                className="edit text-yellow"
                                                style={{ width: "5px" }}
                                                title={"Sửa thông tin thuế"}
                                                onClick={() => {
                                                    this.handleEditDiscount(discount);
                                                }}
                                            >
                                                <i className="material-icons">edit</i>
                                            </a>
                                            <ConfirmNotification
                                                icon="disabled_by_default"
                                                title={"Vô hiệu hóa thuế"}
                                                content={`<h4>${"Vô hiệu hóa thuế " + discount.name}</h4>
                                                    <br/> <h5>Điều này đồng nghĩa với việc không thể sử dụng loại thuế này về sau</h5>
                                                    <h5>Tuy nhiên, đừng lo lắng vì dữ liệu liên quan về loại thuế này trước đó sẽ không bị ảnh hưởng</h5?`}
                                                name="disabled_by_default"
                                                className="text-red"
                                                func={() => this.disableTax(discount._id)}
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
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(DiscountManagementTable));
