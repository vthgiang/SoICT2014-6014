import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { TaxActions } from "../redux/actions";
import { PaginateBar, DataTableSetting, SelectBox, DeleteNotification, ConfirmNotification } from "../../../../../common-components";
import TaxCreateForm from "./taxCreateForm";
import TaxDetailForm from "./taxDetailForm";
import TaxEditForm from "./taxEditForm";

class TaxManagementTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            limit: 5,
            code: "",
            name: "",
        };
    }

    componentDidMount() {
        const { page, limit } = this.state;
        this.props.getAllTaxs({ page, limit });
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

    handleSubmitSearch = () => {
        const { page, limit, code, name } = this.state;
        const data = {
            limit: limit,
            page: page,
            code: code,
            name: name,
        };
        this.props.getAllTaxs(data);
    };

    disableTax = (id) => {
        this.props.disableTax(id);
        this.props.getAllTaxs({ limit: this.state.limit, page: this.state.page });
    };

    render() {
        const { translate } = this.props;
        const { taxs } = this.props;
        const { totalPages, page, listTaxs } = taxs;
        const { code, name } = this.state;
        return (
            <React.Fragment>
                {<TaxDetailForm taxId={this.state.taxId} />}
                {this.state.currentRow && (
                    <TaxEditForm
                        taxEdit={this.state.currentRow}
                        reloadState={() => this.props.getAllTaxs({ limit: this.state.limit, page: this.state.page })}
                    />
                )}
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
                    <table id="tax-table" className="table table-striped table-bordered table-hover">
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
                                        tableId="tax-table"
                                        columnArr={[
                                            translate("manage_order.tax.index"),
                                            translate("manage_order.tax.code"),
                                            translate("manage_order.tax.name"),
                                            translate("manage_order.tax.creator"),
                                            translate("manage_order.tax.status"),
                                        ]}
                                        limit={this.state.limit}
                                        hideColumnOption={true}
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
                                                <i className={tax.status ? "fa  fa-check text-success" : "fa fa-close text-danger"}></i>
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
                                            <ConfirmNotification
                                                icon="disabled_by_default"
                                                title={"Vô hiệu hóa thuế"}
                                                content={`<h4>${"Vô hiệu hóa thuế " + tax.name}</h4>
                                                            <br/> <h5>Điều này đồng nghĩa với việc không thể sử dụng loại thuế này về sau</h5>
                                                            <h5>Tuy nhiên, đừng lo lắng vì dữ liệu liên quan về loại thuế này trước đó sẽ không bị ảnh hưởng</h5?`}
                                                name="disabled_by_default"
                                                className="text-red"
                                                func={() => this.disableTax(tax._id)}
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
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(TaxManagementTable));
