import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { DialogModal, SelectBox, ButtonModal } from "../../../../../common-components";
import { formatCurrency } from "../../../../../helpers/formatCurrency";

class PurchaseOrderCreateFormDirectly extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        let { stocks, customers } = this.props;
        console.log("STOCK", stocks);
        console.log("CUSTOMER", customers);

        return (
            <React.Fragment>
                <DialogModal
                    modalID={`modal-add-purchase-order-directly`}
                    isLoading={false}
                    formID={`form-add-purchase-order-directly`}
                    title={"Tạo đơn mua nguyên vật liệu"}
                    msg_success={"Tạo thành công"}
                    msg_faile={"Tạo không thành công"}
                    // disableSubmit={!this.isFormValidated()}
                    func={this.save}
                    size="50"
                >
                    <form id={`form-add-purchase-order-directly`}></form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    const { customers } = state.crm;
    const { stocks } = state;
    return { stocks, customers };
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(PurchaseOrderCreateFormDirectly));
