import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { TaxActions } from "../redux/actions";
import { PaginateBar, DataTableSetting, SelectBox, DeleteNotification, ConfirmNotification } from "../../../../../common-components";
import TaxCreateForm from "./taxCreateForm";
import TaxDetailForm from "./taxDetailForm";
import TaxEditForm from "./taxEditForm";
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration';
class TaxManagementTable extends Component {
    constructor(props) {
        super(props);
        const tableId = "tax-manager-table";
        const defaultConfig = { limit: 5 }
        const limit = getTableConfiguration(tableId, defaultConfig).limit;

        this.state = {
            page: 1,
            limit: limit,
            code: "",
            name: "",
            status: true,
            tableId,
        };
    }

    componentDidMount() {
        const { page, limit, status } = this.state;
        this.props.getAllTaxs({ page, limit, status });
    }

    setPage = async (page) => {
        await this.setState({
            page: page,
        });
        const data = {
            limit: this.state.limit,
            page: page,
        };
        this.props.getAllTaxs(data);
    };

    setLimit = async (limit) => {
        await this.setState({
            limit: limit,
        });
        const data = {
            limit: limit,
            page: this.state.page,
        };
        this.props.getAllTaxs(data);
    };

    handleShowDetailTax = async (taxId) => {
        this.setState((state) => {
            return {
                ...state,
                taxId: taxId,
            };
        });
        window.$("#modal-detail-tax").modal("show");
    };

    handleEditTax = async (tax) => {
        await this.setState((state) => {
            return {
                ...state,
                currentRow: tax,
            };
        });
        window.$("#modal-edit-tax").modal("show");
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
    handleStatusChange = (value) => {
        if (value[0] === "all") {
            this.setState({
                status: undefined,
            });
        } else {
            this.setState({
                status: value[0],
            });
        }
    };

    handleSubmitSearch = () => {
        const { page, limit, code, name, status } = this.state;
        const data = {
            limit: limit,
            page: page,
            code: code,
            name: name,
            status: status,
        };
        this.props.getAllTaxs(data);
    };

    disableTax = (id) => {
        this.props.disableTax(id);
    };

    deleteTax = (code) => {
        this.props.deleteTax({ code });
    };

    render() {
        const { translate } = this.props;
        const { taxs } = this.props;
        const { totalPages, page, listTaxs } = taxs;
        const { code, name, tableId } = this.state;
        return (
            <React.Fragment>
                <TaxDetailForm taxId={this.state.taxId} />
                {this.state.currentRow && <TaxEditForm taxEdit={this.state.currentRow} />}
                <div className="box-body qlcv">
                    <TaxCreateForm reloadState={() => this.props.getAllTaxs({ limit: this.state.limit, page: this.state.page })} />
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate("manage_order.tax.tax_code")} </label>
                            <input type="text" className="form-control" value={code} onChange={this.handleCodeChange} />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{translate("manage_order.tax.tax_name")} </label>
                            <input type="text" className="form-control" value={name} onChange={this.handleNameChange} />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">Trạng thái thuế</label>
                            <SelectBox
                                id={`select-filter-status-taxs`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={[
                                    { value: true, text: "Đang hiệu lực" },
                                    { value: false, text: "Hết hiệu lực" },
                                    { value: "all", text: "Tất cả" },
                                ]}
                                onChange={this.handleStatusChange}
                            />
                        </div>
                        <div className="form-group">
                            <button
                                type="button"
                                className="btn btn-success"
                                title={translate("manage_order.tax.search")}
                                onClick={this.handleSubmitSearch}
                            >
                                {translate("manage_order.tax.search")}
                            </button>
                        </div>
                    </div>
                    <table id={tableId} className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>{translate("manage_order.tax.index")}</th>
                                <th>{translate("manage_order.tax.code")}</th>
                                <th>{translate("manage_order.tax.name")}</th>
                                <th>{translate("manage_order.tax.creator")}</th>
                                <th>{translate("manage_order.tax.status")}</th>
                                <th
                                    style={{
                                        width: "120px",
                                        textAlign: "center",
                                    }}
                                >
                                    {translate("table.action")}
                                    <DataTableSetting
                                        tableId={tableId}
                                        columnArr={[
                                            translate("manage_order.tax.index"),
                                            translate("manage_order.tax.code"),
                                            translate("manage_order.tax.name"),
                                            translate("manage_order.tax.creator"),
                                            translate("manage_order.tax.status"),
                                        ]}
                                        setLimit={this.setLimit}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {listTaxs &&
                                listTaxs.length !== 0 &&
                                listTaxs.map((tax, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{tax.code}</td>
                                        <td>{tax.name}</td>
                                        <td>{tax.creator.name}</td>
                                        <td>
                                            <center>
                                                {/* <i className={tax.status ? "fa  fa-check text-success" : "fa fa-close text-danger"}></i> */}

                                                {tax.status ? (
                                                    <ConfirmNotification
                                                        icon="domain_verification"
                                                        name="domain_verification"
                                                        className="text-success"
                                                        title={"Click để thay đổi trạng thái"}
                                                        content={`<h4>${"Vô hiệu hóa thuế " + tax.name}</h4>
                                                        <br/> <h5>Điều này đồng nghĩa với việc không thể sử dụng loại thuế này về sau</h5>
                                                        <h5>Tuy nhiên, đừng lo lắng vì dữ liệu liên quan về loại thuế này trước đó sẽ không bị ảnh hưởng</h5?`}
                                                        func={() => this.disableTax(tax._id)}
                                                    />
                                                ) : (
                                                        <ConfirmNotification
                                                            icon="disabled_by_default"
                                                            name="disabled_by_default"
                                                            className="text-red"
                                                            title={"Click để thay đổi trạng thái"}
                                                            content={`<h4>${"Kích hoạt thuế " + tax.name}</h4>
                                                    <br/> <h5>Điều này đồng nghĩa loại thuế này được mở khóa và có thể sử dụng</h5>`}
                                                            func={() => this.disableTax(tax._id)}
                                                        />
                                                    )}
                                            </center>
                                        </td>
                                        <td style={{ textAlign: "center" }}>
                                            <a
                                                style={{ width: "5px" }}
                                                title={"Xem chi tiết thuế"}
                                                onClick={() => {
                                                    this.handleShowDetailTax(tax._id);
                                                }}
                                            >
                                                <i className="material-icons">view_list</i>
                                            </a>
                                            {tax.status ? (
                                                <a
                                                    className="edit text-yellow"
                                                    style={{ width: "5px" }}
                                                    title={"Sửa thông tin thuế"}
                                                    onClick={() => {
                                                        this.handleEditTax(tax);
                                                    }}
                                                >
                                                    <i className="material-icons">edit</i>
                                                </a>
                                            ) : (
                                                    ""
                                                )}
                                            <DeleteNotification
                                                content={"Bạn có chắc chắn muốn xóa thuế này"}
                                                data={{
                                                    id: tax._id,
                                                    info: tax.name,
                                                }}
                                                func={() => this.deleteTax(tax.code)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                    {taxs.isLoading ? (
                        <div className="table-info-panel">{translate("confirm.loading")}</div>
                    ) : (
                            (typeof listTaxs === "undefined" || listTaxs.length === 0) && (
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
    const { taxs } = state;
    return { taxs };
}

const mapDispatchToProps = {
    getAllTaxs: TaxActions.getAllTaxs,
    disableTax: TaxActions.disableTax,
    deleteTax: TaxActions.deleteTax,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(TaxManagementTable));
