import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { DialogModal } from "../../../../../../../common-components";

class CreateSlaForGood extends Component {
    constructor(props) {
        super(props);
        this.state = {
            goodId: "",
        };
    }

    handleSlaChange = (item, e) => {
        let { slasOfGoodChecked, slasOfGood } = this.props;
        const { handleSlasOfGoodChange } = this.props;
        let { id, checked } = e.target;

        let slaId = id.split("-")[0];
        let index = id.split("-")[1];

        if (checked) {
            let descriptions = slasOfGood[`${slaId}`] ? slasOfGood[`${slaId}`] : [];
            descriptions.push(item.descriptions[index]);
            slasOfGood[`${slaId}`] = descriptions;
            handleSlasOfGoodChange(slasOfGood);
        } else {
            let textUnChecked = item.descriptions[index];
            let descriptions = slasOfGood[`${slaId}`].filter((element) => element !== textUnChecked);
            slasOfGood[`${slaId}`] = descriptions;
            handleSlasOfGoodChange(slasOfGood);
        }
        slasOfGoodChecked[`${id}`] = checked;
        this.props.setSlasOfGoodChecked(slasOfGoodChecked);
    };

    getSlaOptions = (item) => {
        let { slasOfGoodChecked } = this.props;
        let { descriptions } = item;
        return (
            <div style={{ paddingLeft: "2rem" }}>
                {descriptions.map((sla, index) => {
                    return (
                        <div class="form-check" style={{ display: "flex", paddingTop: "10px" }}>
                            <input
                                type="checkbox"
                                className={`form-check-input`}
                                id={`${item._id}-${index}`}
                                checked={slasOfGoodChecked[`${item._id}-${index}`]}
                                onChange={(e) => this.handleSlaChange(item, e)}
                                style={{ minWidth: "20px" }}
                                key={index}
                            />
                            <label className={`form-check-label text-success`} for={`${item._id}-${index}`} style={{ fontWeight: `${600}` }}>
                                {sla}
                            </label>
                        </div>
                    );
                })}
            </div>
        );
    };

    render() {
        let { listSlasByGoodId } = this.props.goods.goodItems;
        return (
            <React.Fragment>
                <a
                    style={{
                        cursor: "pointer",
                    }}
                    data-toggle="modal"
                    data-backdrop="static"
                    href={"#modal-edit-sales-order-sla-for-good"}
                >
                    Chọn cam kết chất lượng
                </a>
                <DialogModal
                    modalID={`modal-edit-sales-order-sla-for-good`}
                    isLoading={false}
                    title={"Chọn cam kết chất lượng"}
                    hasSaveButton={false}
                    hasNote={false}
                    size="50"
                    style={{ backgroundColor: "green" }}
                >
                    {!listSlasByGoodId.length ? (
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <i className="fa fa-frown-o text-warning" style={{ fontSize: "20px" }}></i> &ensp;{" "}
                            <span>Không có cam kết nào cho sản phẩm này</span>
                        </div>
                    ) : (
                        listSlasByGoodId.map((item) => {
                            return (
                                <div>
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        <i className="fa fa-check-square-o text-warning"></i> &ensp; <strong>{item.title}</strong>
                                    </div>
                                    {this.getSlaOptions(item)}
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
    const { goods } = state;
    return { goods };
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CreateSlaForGood));
