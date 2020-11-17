import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { ButtonModal, DialogModal } from "../../../../../common-components";

class CreateDiscountsForGood extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    getDiscountOptions = (discounts, formality, type) => {
        let { quantity } = this.props;
        console.log("discounts", discounts);
        return (
            <div style={{ paddingLeft: "2rem" }}>
                {discounts.map((item, index) => {
                    let disabled = false;
                    if (item.minimumThresholdToBeApplied) {
                        if (quantity < item.minimumThresholdToBeApplied) {
                            disabled = true;
                        }
                    }

                    if (item.maximumThresholdToBeApplied) {
                        if (quantity < item.maximumThresholdToBeApplied) {
                            disabled = true;
                        }
                    }
                    return (
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input" id={formality + type + index} disabled={disabled} />
                            <label class="form-check-label" for={formality + type + index} style={{ fontWeight: "500" }}>
                                Check box
                            </label>
                        </div>
                    );
                })}
            </div>
        );
    };

    render() {
        let { listDiscountsByGoodId } = this.props.discounts;
        console.log("listDiscountsByGoodId", listDiscountsByGoodId);
        return (
            <React.Fragment>
                <ButtonModal
                    modalID={`modal-add-quote-discount-for-good`}
                    button_name={"Chọn khuyến mãi"}
                    title={"Chọn khuyến mãi"}
                    className="form-control text-muted"
                />
                <DialogModal
                    modalID={`modal-add-quote-discount-for-good`}
                    isLoading={false}
                    title={"Chọn khuyến mãi"}
                    // func={this.save}
                    size="50"
                    style={{ backgroundColor: "green" }}
                >
                    {!listDiscountsByGoodId.length ? (
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <i className="fa fa-frown-o text-warning"></i> &ensp; <span>Chưa có khuyến mãi nào</span>
                        </div>
                    ) : (
                        listDiscountsByGoodId.map((item) => {
                            return (
                                <div>
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        <i className="fa fa-gift text-warning"></i> &ensp; <strong>{item.name}</strong>
                                    </div>
                                    {this.getDiscountOptions(item.discounts, item.formality, item.type)}
                                </div>
                            );
                        })
                    )}
                </DialogModal>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    const { discounts } = state;
    return { discounts };
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CreateDiscountsForGood));
