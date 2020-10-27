import React, { Component } from "react";
import { withTranslate } from "react-redux-multilingual";
import { connect } from "react-redux";
import { DialogModal } from "../../../../../common-components";
import { TaxActions } from "../redux/actions";

class TaxDetailForm extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
        if (nextProps.taxId !== this.props.taxId) {
            this.props.getTaxById(nextProps.taxId);
            return false;
        }
        return true;
    }

    render() {
        let currentTax = {};
        if (this.props.currentTax) {
            currentTax = this.props.currentTax;
        }

        console.log("Cur", currentTax);
        return (
            <React.Fragment>
                <DialogModal
                    modalID="modal-detail-tax"
                    isLoading={false}
                    formID="form-detail-tax"
                    title={"Chi tiết báo giá"}
                    size="50"
                    hasSaveButton={false}
                    hasNote={false}
                >
                    <form id={`form-detail-tax`}>
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <div className={`form-group`}>
                                <strong>Mã thuế :&emsp;</strong>
                                {currentTax.code}
                            </div>
                            <div className={`form-group`}>
                                <strong>Tên :&emsp;</strong>
                                {currentTax.name}
                            </div>
                            <div className={`form-group`}>
                                <strong>Người tạo :&emsp;</strong>
                                {currentTax.creator ? currentTax.creator.name : ""}
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                            <div className={`form-group`}>
                                <strong>Mô tả :&emsp;</strong>
                                {currentTax.description}
                            </div>
                            <div className={`form-group`}>
                                <strong>Phiên bản :&emsp;</strong>
                                {currentTax.version}
                            </div>
                            <div className={`form-group`}>
                                <strong>Trạng thái :&emsp;</strong>
                                {currentTax.status ? "Đang hiệu lực" : "Hết hiệu lực"}
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <table id="tax-table" className="table table-striped table-bordered table-hover">
                                <thead>
                                    <tr>
                                        <th>STT</th>
                                        <th>Mã</th>
                                        <th>Tên</th>
                                        <th>Chiếu khấu (%)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentTax.goods &&
                                        currentTax.goods.map((good, index) => (
                                            <tr>
                                                <td>{index + 1}</td>
                                                <td>{good.good.code}</td>
                                                <td>{good.good.name}</td>
                                                <td>{good.percent}</td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    const { currentTax } = state.taxs;
    return { currentTax };
}

const mapDispatchToProps = {
    getTaxById: TaxActions.getTaxById,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(TaxDetailForm));
