import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { generateCode } from "../../../../../helpers/generateCode";
import { GoodActions } from "../../../../warehouse/good-management/redux/actions";
import {
    DatePicker,
    DialogModal,
    SelectBox,
    ButtonModal,
} from "../../../../../common-components";

class TaxCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            code: "",
            description: "",
            creator: {
                name: "",
                id: "",
            },
            goods: [],
            allGoods: [],
            type: "product",
            limit: 5,
            page: 1,
        };
    }

    componentDidMount() {
        let creator = {};
        creator.id = this.props.auth.user._id;
        creator.name = this.props.auth.user.name;
        const { type, page, limit } = this.state;
        this.props.getGoodsByType({ page, limit, type });
        this.setState({
            code: generateCode("TAX_"),
            creator,
        });
    }

    render() {
        const { goods } = this.props;
        let { name, code, description, creator, allGoods } = this.state;
        console.log("c", goods);
        return (
            <React.Fragment>
                <ButtonModal
                    modalID={`modal-add-tax`}
                    button_name={"Thêm loại thuế"}
                    title={"Thêm loại thuế"}
                />
                <DialogModal
                    modalID={`modal-add-tax`}
                    isLoading={false}
                    formID={`form-add-tax`}
                    title={"Thêm loại thuế mới"}
                    msg_success={"Thêm thuế thành công"}
                    msg_faile={"Thêm thuế không thành công"}
                    // disableSubmit={!this.isFormValidated()}
                    func={this.save}
                    size="50"
                    style={{ backgroundColor: "green" }}
                >
                    <form id={`form-add-tax`}>
                        <div
                            className="row row-equal-height"
                            style={{ marginTop: -25 }}
                        >
                            <div
                                className="col-xs-12 col-sm-12 col-md-12 col-lg-12"
                                style={{ padding: 10 }}
                            >
                                <div className="form-group">
                                    <label>
                                        Mã thuế
                                        <span className="attention"> </span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={code}
                                        disabled="true"
                                    />
                                </div>
                            </div>
                            <div
                                className="col-xs-12 col-sm-12 col-md-12 col-lg-12"
                                style={{ padding: 10 }}
                            >
                                <div className="form-group">
                                    <label>
                                        Tên thuế
                                        <span className="attention"> * </span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={name}
                                    />
                                </div>
                            </div>
                            <div
                                className="col-xs-12 col-sm-12 col-md-12 col-lg-12"
                                style={{ padding: 10 }}
                            >
                                <div className="form-group">
                                    <label>
                                        Người tạo
                                        <span className="attention"> </span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={creator.name}
                                        disabled="true"
                                    />
                                </div>
                            </div>
                            <div
                                className="col-xs-12 col-sm-12 col-md-12 col-lg-12"
                                style={{ padding: 10 }}
                            >
                                <div className="form-group">
                                    <label>
                                        Mô tả
                                        <span className="attention"> </span>
                                    </label>
                                    <textarea
                                        type="text"
                                        className="form-control"
                                        value={description}
                                    />
                                </div>
                            </div>
                            <div
                                className="col-xs-12 col-sm-12 col-md-12 col-lg-12"
                                style={{ padding: 10 }}
                            >
                                <fieldset className="scheduler-border">
                                    <legend className="scheduler-border">
                                        Các mặt hàng
                                    </legend>
                                </fieldset>
                            </div>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    const { auth, goods } = state;
    return { auth, goods };
}

const mapDispatchToProps = {
    getGoodsByType: GoodActions.getGoodsByType,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withTranslate(TaxCreateForm));
