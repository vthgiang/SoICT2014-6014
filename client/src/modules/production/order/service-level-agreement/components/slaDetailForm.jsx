import React, { Component } from "react";
import { withTranslate } from "react-redux-multilingual";
import { connect } from "react-redux";
import "./sla.css";
import { DialogModal, PaginateBar } from "../../../../../common-components";

class SlaDetailForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowGoods: false,
            page: 1,
            goodsLoader: [],
            limitLoader: 2,
            slaId: "",
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.slaDetail._id !== this.state.slaId) {
            this.setState({
                isShowGoods: false,
                page: 1,
                goodsLoader: [],
                slaId: nextProps.slaDetail._id,
            });
            this.getGoodForRows(1, []);
            return false;
        }
        return true;
    }

    showGoods = () => {
        this.setState({
            isShowGoods: !this.state.isShowGoods,
        });
    };

    getGoodForRows = (page, goodsLoader) => {
        let { goods } = this.props.slaDetail;
        let { limitLoader } = this.state;
        if (goods && goods.length) {
            let indexOfStartGoods = (page - 1) * limitLoader;
            let indexOfEndGoods = page * limitLoader < goods.length ? page * limitLoader : goods.length;
            for (let i = indexOfStartGoods; i < indexOfEndGoods; i++) {
                goodsLoader.push(goods[i]);
            }
        }
        this.setState({ goodsLoader });
    };

    ShowMore = () => {
        let { page, goodsLoader } = this.state;
        this.getGoodForRows(page + 1, goodsLoader);
        this.setState({
            page: page + 1,
        });
    };

    render() {
        const { code, title, descriptions, goods } = this.props.slaDetail;
        let { isShowGoods, page, limitLoader, goodsLoader } = this.state;

        return (
            <React.Fragment>
                <DialogModal
                    modalID="modal-detail-sla"
                    isLoading={false}
                    formID="form-detail-sla"
                    title={"Chi tiết cam kết chất lượng"}
                    size="50"
                    hasSaveButton={false}
                    hasNote={false}
                >
                    <form id={`form-detail-sla`}>
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <div className="form-group">
                                <strong>Mã:&emsp;</strong>
                                {code}
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <div className="form-group">
                                <strong>Tiêu đề:&emsp;</strong>
                                {title}
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <div className="form-group">
                                <strong>Các điều khoản:&emsp;</strong>
                                {descriptions &&
                                    descriptions.map((item) => {
                                        return (
                                            <div style={{ display: "flex" }}>
                                                <i className="fa fa-check-square-o text-success" style={{ paddingTop: "13px" }}></i>
                                                <div style={{ padding: "10px" }}>{item} </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <div className="form-group">
                                <strong>Các mặt hàng áp dụng:&emsp;</strong>
                                <a style={{ cursor: "pointer" }} onClick={this.showGoods}>
                                    {!isShowGoods ? `Có ${goods ? goods.length : "0"} mặt hàng được áp dụng` : "Ẩn chi tiết"}
                                </a>
                                {isShowGoods ? (
                                    <>
                                        <ul className="sla-goods-collapsible-ul">
                                            {goodsLoader &&
                                                goodsLoader.length &&
                                                goodsLoader.map((item, index) => {
                                                    return (
                                                        <>
                                                            <li className="sla-goods-collapsible-li">
                                                                <div className="sla-goods-collapsible-index">{index + 1}</div>
                                                                <div className="sla-goods-collapsible-code">{item.code}</div>
                                                                <div className="sla-goods-collapsible-name">{item.name}</div>
                                                            </li>
                                                        </>
                                                    );
                                                })}
                                            {goods && goods.length > page * limitLoader ? (
                                                <div style={{ marginTop: "10px" }}>
                                                    <a style={{ cursor: "pointer" }} onClick={this.ShowMore}>
                                                        Xem thêm
                                                    </a>
                                                </div>
                                            ) : (
                                                ""
                                            )}
                                        </ul>
                                    </>
                                ) : (
                                    ""
                                )}
                            </div>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

export default SlaDetailForm;
