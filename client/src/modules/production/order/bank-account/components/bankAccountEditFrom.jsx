import React, { Component, useEffect, useState } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { BankAccountActions } from "../redux/actions";
import ValidationHelper from "../../../../../helpers/validationHelper";
import { DialogModal, ButtonModal, ErrorLabel, SelectBox } from "../../../../../common-components";

function BankAccountEditForm(props) {

    const [state, setState] = useState({
        account: "",
        owner: "",
        bankName: "",
        bankAcronym: "",
        status: false,
        bankAccountId: "",
    })

    const [check, setCheck] = useState({})

    useEffect(()=>{
        if (props.bankAccountEdit._id !== state.bankAccountId) {
            setState( (state) => {
                return {
                    ...state,
                    bankAccountId: props.bankAccountEdit._id,
                    account: props.bankAccountEdit.account,
                    owner: props.bankAccountEdit.owner,
                    bankName: props.bankAccountEdit.bankName,
                    bankAcronym: props.bankAccountEdit.bankAcronym,
                    status: props.bankAccountEdit.status,
                }
            })
        }
    },[props.bankAccountEdit._id])

    const handleAccountChange = (e) => {
        let { value } = e.target;
        setState({
            ...state,
            account: value,
        });

        let { translate } = props;
        let { message } = ValidationHelper.validateName(translate, value, 4, 255);
        
        setCheck({accountError: message})
    };

    const handleBankNameChange = (e) => {
        let { value } = e.target;
        setState({
            ...state,
            bankName: value,
        });

        let { translate } = props;
        let { message } = ValidationHelper.validateName(translate, value, 4, 255);
        
        setCheck({bankNameError: message})
    };

    const handleBankAcronymChange = (e) => {
        let { value } = e.target;
        setState({
            ...state,
            bankAcronym: value,
        });

        let { translate } = props;
        let { message } = ValidationHelper.validateName(translate, value, 1, 255);
        
        setCheck({bankAcronymError: message});

    };

    const handleOwnerChange = (e) => {
        let { value } = e.target;
        setState({
            ...state,
            owner: value,
        });

        let { translate } = props;
        let { message } = ValidationHelper.validateName(translate, value, 2, 255);
        
        setCheck({ownerError: message})
      
    };

    const handleStatusChange = (value) => {
        setState({
            ...state,
            status: value[0],
        });
    };

    const isFormValidated = () => {
        let { translate } = props;
        let { account, owner, bankName, bankAcronym } = state;
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

    const save = async () => {
        if (isFormValidated()) {
            let { bankAccountId, account, owner, bankName, bankAcronym, status } = state;
            let data = {
                account,
                owner,
                bankName,
                bankAcronym,
                status,
            };
            await props.updateBankAccount(bankAccountId, data);
        }
    };

    let { account, owner, bankName, bankAcronym, status} = state;
    let { accountError, ownerError, bankNameError, bankAcronymError } = check

    return (

        <React.Fragment>
            <DialogModal
                modalID={`modal-edit-bank-account`}
                isLoading={false}
                formID={`form-add-bank-account`}
                title={"Chỉnh sửa tài khoản ngân hàng"}
                msg_success={"Thêm thành công"}
                msg_faile={"Thêm không thành công"}
                disableSubmit={!isFormValidated()}
                func={save}
                size="50"
                style={{ backgroundColor: "green" }}
            >
                <form id={`form-add-bank-account`}>
                    <div className={`form-group ${!accountError ? "" : "has-error"}`}>
                        <label>
                            {"Số tài khoản"}
                            <span className="attention"> * </span>
                        </label>
                        <input type="number" className="form-control" value={account} onChange={handleAccountChange} />
                        <ErrorLabel content={accountError} />
                    </div>
                    <div className={`form-group ${!bankNameError ? "" : "has-error"}`}>
                        <label>
                            {"Tên ngân hàng"}
                            <span className="attention"> * </span>
                        </label>
                        <input type="text" className="form-control" value={bankName} onChange={handleBankNameChange} />
                        <ErrorLabel content={bankNameError} />
                    </div>
                    <div className={`form-group ${!bankAcronymError ? "" : "has-error"}`}>
                        <label>
                            {"Ký hiệu ngân hàng"}
                            <span className="attention"> * </span>
                        </label>
                        <input type="text" className="form-control" value={bankAcronym} onChange={handleBankAcronymChange} />
                        <ErrorLabel content={bankAcronymError} />
                    </div>
                    <div className={`form-group ${!ownerError ? "" : "has-error"}`}>
                        <label>
                            {"Chủ tài khoản"}
                            <span className="attention"> * </span>
                        </label>
                        <input type="text" className="form-control" value={owner} onChange={handleOwnerChange} />
                        <ErrorLabel content={ownerError} />
                    </div>
                    <div className={`form-group`}>
                        <label>
                            Trạng thái
                                <span className="attention"> * </span>
                            <br></br>
                        </label>
                        <SelectBox
                            id={`select-edit-bank-account-status`}
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
                            onChange={handleStatusChange}
                            multiple={false}
                            value={status}
                        />
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    );
}

function mapStateToProps(state) { }

const mapDispatchToProps = {
    updateBankAccount: BankAccountActions.updateBankAccount,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(BankAccountEditForm));
