import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { DialogModal, SelectBox, ButtonModal } from "../../../../../common-components";

class PurchaseOrderCreateFormFromPurchasingRequest extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        console.log("purchasingRequest", this.props.purchasingRequest);
        return (
            <React.Fragment>
                <DialogModal
                    modalID={`modal-add-purchase-order-from-puchasing-request`}
                    isLoading={false}
                    formID={`form-add-purchase-order-from-puchasing-request`}
                    title={"Tạo đơn mua NVL từ đề nghị mua hàng"}
                    msg_success={"Tạo thành công"}
                    msg_faile={"Tạo không thành công"}
                    // disableSubmit={!this.isFormValidated()}
                    func={this.save}
                    size="50"
                >
                    <form id={`form-add-purchase-order-from-puchasing-request`}></form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    const { customers } = state.crm;
    const { stocks, purchasingRequest } = state;
    return { stocks, customers, purchasingRequest };
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(PurchaseOrderCreateFormFromPurchasingRequest));
