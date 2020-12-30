import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { generateCode } from "../../../../../helpers/generateCode";
import { SlaActions } from "../redux/actions";
import { DialogModal, ButtonModal, ErrorLabel, SelectBox } from "../../../../../common-components";
import ValidationHelper from "../../../../../helpers/validationHelper";

class SlaCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code: "",
            goods: [],
            descriptions: [],
            isAllGoodsSelected: false,
        };
    }

    getAllGoods = () => {
        const { translate, goods } = this.props;
        let listGoods = [
            {
                value: "all",
                text: "CHỌN TẤT CẢ",
            },
        ];

        const { listGoodsByType } = goods;

        if (listGoodsByType) {
            listGoodsByType.map((item) => {
                listGoods.push({
                    value: item._id,
                    text: item.code + " - " + item.name,
                });
            });
        }

        return listGoods;
    };

    handleTitleChange = (e) => {
        let { value } = e.target;
        this.setState({
            title: value,
        });

        let { translate } = this.props;
        let { message } = ValidationHelper.validateName(translate, value, 4, 255);
        this.setState({ titleError: message });
    };

    validateGoods = (goods) => {
        let msg = undefined;
        if (!goods || goods.length === 0) {
            const { translate } = this.props;
            msg = "Chọn mặt hàng áp dụng";
        }
        return msg;
    };

    handleGoodsChange = (value) => {
        let { goods } = this.state;
        let checkSelectAll = false;
        value.forEach((item) => {
            if (item === "all") {
                checkSelectAll = true;
            }
        });
        if (!checkSelectAll) {
            this.setState((state) => {
                return {
                    ...state,
                    goods: value,
                    goodsError: this.validateGoods(value),
                    isAllGoodsSelected: false,
                };
            });
        } else {
            this.setState({
                isAllGoodsSelected: true,
                goods: ["disSelectAll"],
                goodsError: this.validateGoods(value, true),
            });
        }
    };

    handleClickCreateCode = () => {
        this.setState((state) => {
            return { ...state, code: generateCode("SLA_") };
        });
    };

    validateDescriptions = (value, index, willUpdateState = true) => {
        let msg = undefined;
        if (value.trim() === "") {
            msg = "Tên trường dữ liệu không được để trống";
        }
        if (willUpdateState) {
            let { descriptions } = this.state;
            descriptions[index] = value;
            this.setState((state) => {
                return {
                    ...state,
                    errorOnDescription: msg,
                    errorOnDescriptionPosition: msg ? index : null,
                    descriptions: descriptions,
                };
            });
        }
        return msg;
    };

    handleAddDescription = () => {
        let { descriptions } = this.state;
        console.log("descriptions", descriptions);

        if (descriptions.length !== 0) {
            let result;

            for (let index = 0; index < descriptions.length; index++) {
                let temp = this.validateDescriptions(descriptions[index], index, false);
                console.log("temp", temp);
                if (temp) result = temp;
            }
            if (!result) {
                this.setState({
                    descriptions: [...descriptions, ""],
                });
            }
        } else {
            this.setState({
                descriptions: [""],
            });
        }
    };

    handleDescriptionChange = (e, index) => {
        var { value } = e.target;
        this.validateDescriptions(value, index);
    };

    deleteDescription = (index) => {
        var { descriptions } = this.state;
        descriptions.splice(index, 1);
        this.setState({
            descriptions: descriptions,
        });
        if (descriptions.length !== 0) {
            for (let i = 0; i < descriptions.length; i++) {
                this.validateDescriptions(descriptions[i], i);
            }
        } else {
            this.setState({
                errorOnDescription: undefined,
            });
        }
    };

    validateDescriptionsForSubmit = () => {
        let { descriptions } = this.state;
        if (descriptions.length === 0) {
            return false;
        }

        let descriptionsValidation = true;
        descriptions.forEach((item, key) => {
            if (this.validateDescriptions(item, key, false)) {
                descriptionsValidation = false;
            }
        });
        return descriptionsValidation;
    };

    isFormValidated = () => {
        let { translate } = this.props;
        let { title, goods } = this.state;
        if (!this.validateDescriptionsForSubmit() || ValidationHelper.validateName(translate, title, 4, 255).message || this.validateGoods(goods)) {
            return false;
        }
        return true;
    };

    getIdOfAllGoods = () => {
        const { translate, goods } = this.props;
        const { listGoodsByType } = goods;
        let goodsForSubmit = this.state.goods;
        let checkSelectAll = false;
        goodsForSubmit.forEach((item) => {
            if (item === "disSelectAll") {
                checkSelectAll = true;
            }
        });
        if (checkSelectAll) {
            if (listGoodsByType) {
                goodsForSubmit = listGoodsByType.map((item) => item._id);
            }
        }

        return goodsForSubmit;
    };

    save = async () => {
        if (this.isFormValidated()) {
            const { code, descriptions, goods, title } = this.state;
            let goodsSubmit = await this.getIdOfAllGoods();
            let data = {
                code,
                descriptions,
                goods: goodsSubmit,
                title,
            };
            await this.props.createNewSLA(data);
            await this.setState({
                code: "",
                descriptions: [],
                goods: [],
                title: "",
            });
        }
    };

    render() {
        const { translate } = this.props;
        let {
            code,
            titleError,
            title,
            goods,
            goodsError,
            isAllGoodsSelected,
            descriptions,
            errorOnDescription,
            errorOnDescriptionPosition,
        } = this.state;
        console.log("DATA", descriptions);
        return (
            <React.Fragment>
                <ButtonModal
                    onButtonCallBack={this.handleClickCreateCode}
                    modalID={`modal-add-sla`}
                    button_name={"Thêm mới"}
                    title={"Thêm cam kết chất lượng"}
                />
                <DialogModal
                    modalID={`modal-add-sla`}
                    isLoading={false}
                    formID={`form-add-sla`}
                    title={"Thêm cam kết chất lượng"}
                    msg_success={"Thêm thành công"}
                    msg_faile={"Thêm không thành công"}
                    disableSubmit={!this.isFormValidated()}
                    func={this.save}
                    size="50"
                    style={{ backgroundColor: "green" }}
                >
                    <form id={`form-add-sla`}>
                        <div className="form-group">
                            <label>
                                {"Mã"}
                                <span className="attention"> </span>
                            </label>
                            <input type="text" className="form-control" value={code} disabled="true" />
                        </div>
                        <div className={`form-group ${!titleError ? "" : "has-error"}`}>
                            <label>
                                {"Tiêu đề"}
                                <span className="attention"> * </span>
                            </label>
                            <input type="text" className="form-control" value={title} onChange={this.handleTitleChange} />
                            <ErrorLabel content={titleError} />
                        </div>
                        <div className={`form-group ${!goodsError ? "" : "has-error"}`}>
                            <label>
                                Chọn các mặt hàng
                                <span className="attention"> * </span>
                                <br></br>
                            </label>
                            <SelectBox
                                id={`select-create-multi-good-sla`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={
                                    isAllGoodsSelected
                                        ? [
                                            {
                                                value: "disSelectAll",
                                                text: `Đã chọn tất cả (${this.getAllGoods().length - 1} mặt hàng)`,
                                            },
                                        ]
                                        : this.getAllGoods()
                                }
                                onChange={this.handleGoodsChange}
                                multiple={true}
                                value={goods}
                            />
                            <ErrorLabel content={goodsError} />
                        </div>
                        <div className="form-group">
                            <label>
                                Các điều khoản
                                <span className="attention"> * </span>:
                                <a style={{ cursor: "pointer" }} title={"Các điều khoản"}>
                                    <i
                                        className="fa fa-plus-square"
                                        style={{ color: "#28A745", marginLeft: 5 }}
                                        onClick={this.handleAddDescription}
                                    />
                                </a>
                            </label>
                            {/* <div className="col-md-12"> */}
                            {/* Bảng thông tin chi tiết */}
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th style={{ paddingLeft: "0px" }}>{"Điều khoản"}</th>
                                        <th style={{ width: "100px", textAlign: "center" }}>{"Hành động"}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {!descriptions || descriptions.length === 0 ? (
                                        <tr>
                                            <td colSpan={2}>
                                                <center> {"Chưa có dữ liệu"}</center>
                                            </td>
                                        </tr>
                                    ) : (
                                            descriptions.map((item, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td style={{ paddingLeft: "0px" }}>
                                                            <div
                                                                className={`form-group ${parseInt(errorOnDescriptionPosition) === index && errorOnDescription
                                                                        ? "has-error"
                                                                        : ""
                                                                    }`}
                                                            >
                                                                <textarea
                                                                    className="form-control"
                                                                    type="text"
                                                                    value={item}
                                                                    name="value"
                                                                    style={{ width: "100%" }}
                                                                    onChange={(e) => this.handleDescriptionChange(e, index)}
                                                                />
                                                                {parseInt(errorOnDescriptionPosition) === index && errorOnDescription && (
                                                                    <ErrorLabel content={errorOnDescription} />
                                                                )}
                                                            </div>
                                                        </td>

                                                        <td style={{ width: "100px", textAlign: "center" }}>
                                                            <a
                                                                className="delete"
                                                                title="Delete"
                                                                data-toggle="tooltip"
                                                                onClick={() => this.deleteDescription(index)}
                                                            >
                                                                <i className="material-icons"></i>
                                                            </a>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                </tbody>
                            </table>
                            {/* </div> */}
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    const { goods } = state;
    return { goods };
}

const mapDispatchToProps = {
    createNewSLA: SlaActions.createNewSLA,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(SlaCreateForm));
