import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { BankAccountActions } from "../redux/actions";
import { PaginateBar, DataTableSetting, SelectBox, DeleteNotification, ConfirmNotification } from "../../../../../common-components";
import BankAccountCreateForm from "./bankAccountCreateForm";
import BankAccountEditFrom from "./bankAccountEditFrom";

class BankAccountManagementTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            limit: 5,
            account: "", //Số tài khoản ngân hàng
            bankName: "",
            bankAcronym: "", //Tên viết tắt của ngân hàng
        };
    }

    componentDidMount() {
        const { page, limit } = this.state;
        this.props.getAllBankAccounts({ page, limit });
    }

    setPage = async (page) => {
        const { limit, account, bankName, bankAcronym } = this.state;
        await this.setState({
            page: page,
        });
        const data = {
            limit,
            page: page,
            account,
            bankName,
            bankAcronym,
        };
        this.props.getAllBankAccounts(data);
    };

    setLimit = async (limit) => {
        const { page, account, bankName, bankAcronym } = this.state;
        await this.setState({
            limit: limit,
        });
        const data = {
            limit: limit,
            page,
            account,
            bankName,
            bankAcronym,
        };
        this.props.getAllBankAccounts(data);
    };

    handleAccountChange = (e) => {
        this.setState({
            account: e.target.value,
        });
    };

    handleBankNameChange = (e) => {
        this.setState({
            bankName: e.target.value,
        });
    };

    handleBankAcronymChange = (e) => {
        this.setState({
            bankAcronym: e.target.value,
        });
    };

    handleSubmitSearch = () => {
        const { page, limit, account, bankName, bankAcronym } = this.state;
        const data = {
            limit: limit,
            page: page,
            account: account,
            bankName: bankName,
            bankAcronym: bankAcronym,
        };
        this.props.getAllBankAccounts(data);
    };

    handleEditBankAccount = async (item) => {
        await this.setState((state) => {
            return {
                ...state,
                bankAccountEdit: item,
            };
        });
        window.$("#modal-edit-bank-account").modal("show");
    };

    render() {
        const { translate } = this.props;
        console.log("BANK ACC", this.props.bankAccounts);
        const { bankAccounts } = this.props;
        const { totalPages, page, listBankAccounts } = bankAccounts;

        const { account, bankName, bankAcronym, bankAccountEdit } = this.state;
        return (
            <React.Fragment>
                <div className="box-body qlcv">
                    <BankAccountCreateForm />
                    {bankAccountEdit && <BankAccountEditFrom bankAccountEdit={bankAccountEdit} />}
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{"Số tài khoản"} </label>
                            <input type="text" className="form-control" value={account} onChange={this.handleAccountChange} />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{"Tên ngân hàng"} </label>
                            <input type="text" className="form-control" value={bankName} onChange={this.handleBankNameChange} />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{"Ký hiệu ngân hàng"} </label>
                            <input type="text" className="form-control" value={bankAcronym} onChange={this.handleBankAcronymChange} />
                        </div>
                        <div className="form-group">
                            <button type="button" className="btn btn-success" title={"Tìm kiếm"} onClick={this.handleSubmitSearch}>
                                {"Tìm kiếm"}
                            </button>
                        </div>
                    </div>
                    <table id="bank-account-table" className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Số tài khoản</th>
                                <th>Tên ngân hàng</th>
                                <th>Ký hiệu ngân hàng</th>
                                <th>Chủ tài khoản</th>
                                <th>Trạng thái</th>
                                <th>Người tạo</th>
                                <th
                                    style={{
                                        width: "120px",
                                        textAlign: "center",
                                    }}
                                >
                                    Hành động
                                    <DataTableSetting
                                        tableId="bank-account-table"
                                        columnArr={[
                                            "STT",
                                            "Số tài khoản",
                                            "Ký hiệu ngân hàng",
                                            "Tên ngân hàng",
                                            "Chủ tài khoản",
                                            "Trạng thái",
                                            "Người tạo",
                                        ]}
                                        limit={this.state.limit}
                                        hideColumnOption={true}
                                        setLimit={this.setLimit}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {listBankAccounts &&
                                listBankAccounts.length !== 0 &&
                                listBankAccounts.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.account}</td>
                                        <td>{item.bankAcronym}</td>
                                        <td>{item.bankName}</td>
                                        <td>{item.owner}</td>
                                        <td>
                                            {item.status ? (
                                                <span className="text-success">Đang sử dụng</span>
                                            ) : (
                                                <span className="text-red">Đang vô hiệu hóa</span>
                                            )}
                                        </td>
                                        <td>{item.creator.name}</td>
                                        <td style={{ textAlign: "center" }}>
                                            <a
                                                className="edit text-yellow"
                                                style={{ width: "5px" }}
                                                title={"Sửa thông tin tài khoản"}
                                                onClick={() => {
                                                    this.handleEditBankAccount(item);
                                                }}
                                            >
                                                <i className="material-icons">edit</i>
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                    {bankAccounts.isLoading ? (
                        <div className="table-info-panel">{translate("confirm.loading")}</div>
                    ) : (
                        (typeof listBankAccounts === "undefined" || listBankAccounts.length === 0) && (
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
    const { bankAccounts } = state;
    return { bankAccounts };
}

const mapDispatchToProps = {
    getAllBankAccounts: BankAccountActions.getAllBankAccounts,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(BankAccountManagementTable));
