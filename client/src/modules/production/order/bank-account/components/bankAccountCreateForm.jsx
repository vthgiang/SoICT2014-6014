import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { BankAccountActions } from "../redux/actions";
import ValidationHelper from "../../../../../helpers/validationHelper";
import { DialogModal, ButtonModal, ErrorLabel, SelectBox } from "../../../../../common-components";

class BankAccountCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            account: "",
            owner: "",
            bankName: "",
            bankAcronym: "",
            status: false,
        };
    }

    handleAccountChange = (e) => {
        let { value } = e.target;
        this.setState({
            account: value,
        });

        let { translate } = this.props;
        let { message } = ValidationHelper.validateName(translate, value, 4, 255);
        this.setState({ accountError: message });
    };

    handleBankNameChange = (e) => {
        let { value } = e.target;
        this.setState({
            bankName: value,
        });

        let { translate } = this.props;
        let { message } = ValidationHelper.validateName(translate, value, 4, 255);
        this.setState({ bankNameError: message });
    };

    handleBankAcronymChange = (e) => {
        let { value } = e.target;
        this.setState({
            bankAcronym: value,
        });

        let { translate } = this.props;
        let { message } = ValidationHelper.validateName(translate, value, 1, 255);
        this.setState({ bankAcronymError: message });
    };

    handleOwnerChange = (e) => {
        let { value } = e.target;
        this.setState({
            owner: value,
        });

        let { translate } = this.props;
        let { message } = ValidationHelper.validateName(translate, value, 2, 255);
        this.setState({ ownerError: message });
    };

    handleStatusChange = (value) => {
        this.setState({
            status: value[0],
        });
    };

    isFormValidated = () => {
        let { translate } = this.props;
        let { account, owner, bankName, bankAcronym } = this.state;
        if (
            ValidationHelper.validateName(translate, account, 4, 255).message ||
            ValidationHelper.validateName(translate, bankName, 4, 255).message ||
            ValidationHelper.validateName(translate, bankAcronym, 1, 255).message ||
            ValidationHelper.validateName(translate, owner, 2, 255).message
        ) {
            return false;
        }
        return true;
    };

    save = async () => {
        if (this.isFormValidated()) {
            let { account, owner, bankName, bankAcronym, status } = this.state;
            let data = {
                account,
                owner,
                bankName,
                bankAcronym,
                status,
            };
            await this.props.createBankAccount(data);
            await this.setState({
                account: "",
                owner: "",
                bankName: "",
                bankAcronym: "",
                status: false,
            });
        }
    };

    render() {
        let { account, owner, bankName, bankAcronym, status, accountError, ownerError, bankNameError, bankAcronymError } = this.state;

        return (
            <React.Fragment>
                <ButtonModal modalID={`modal-add-bank-account`} button_name={"Thêm tài khoản"} title={"Thêm tài khoản"} />
                <DialogModal
                    modalID={`modal-add-bank-account`}
                    isLoading={false}
                    formID={`form-add-bank-account`}
                    title={"Thêm tài khoản ngân hàng"}
                    msg_success={"Thêm thành công"}
                    msg_faile={"Thêm không thành công"}
                    disableSubmit={!this.isFormValidated()}
                    func={this.save}
                    size="50"
                    style={{ backgroundColor: "green" }}
                >
                    <form id={`form-add-bank-account`}>
                        <div className={`form-group ${!accountError ? "" : "has-error"}`}>
                            <label>
                                {"Số tài khoản"}
                                <span className="attention"> * </span>
                            </label>
                            <input type="number" className="form-control" value={account} onChange={this.handleAccountChange} />
                            <ErrorLabel content={accountError} />
                        </div>
                        <div className={`form-group ${!bankNameError ? "" : "has-error"}`}>
                            <label>
                                {"Tên ngân hàng"}
                                <span className="attention"> * </span>
                            </label>
                            <input type="text" className="form-control" value={bankName} onChange={this.handleBankNameChange} />
                            <ErrorLabel content={bankNameError} />
                        </div>
                        <div className={`form-group ${!bankAcronymError ? "" : "has-error"}`}>
                            <label>
                                {"Ký hiệu ngân hàng"}
                                <span className="attention"> * </span>
                            </label>
                            <input type="text" className="form-control" value={bankAcronym} onChange={this.handleBankAcronymChange} />
                            <ErrorLabel content={bankAcronymError} />
                        </div>
                        <div className={`form-group ${!ownerError ? "" : "has-error"}`}>
                            <label>
                                {"Chủ tài khoản"}
                                <span className="attention"> * </span>
                            </label>
                            <input type="text" className="form-control" value={owner} onChange={this.handleOwnerChange} />
                            <ErrorLabel content={ownerError} />
                        </div>
                        <div className={`form-group`}>
                            <label>
                                Trạng thái
                                <span className="attention"> * </span>
                                <br></br>
                            </label>
                            <SelectBox
                                id={`select-create-bank-account-status`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={[
                                    {
                                        value: false,
                                        text: "Vô hiệu hóa",
                                    },
                                    {
                                        value: true,
                                        text: "Đang sử dụng",
                                    },
                                ]}
                                onChange={this.handleStatusChange}
                                multiple={false}
                                value={status}
                            />
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {}

const mapDispatchToProps = {
    createBankAccount: BankAccountActions.createBankAccount,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(BankAccountCreateForm));
