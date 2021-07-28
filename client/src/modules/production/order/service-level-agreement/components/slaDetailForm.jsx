import React, { Component, useEffect, useState } from "react";
import { withTranslate } from "react-redux-multilingual";
import { connect } from "react-redux";
import "./sla.css";
import { DialogModal, PaginateBar } from "../../../../../common-components";

function SlaDetailForm(props) {

    const [state, setState] = useState({
        isShowGoods: false,
        page: 1,
        goodsLoader: [],
        limitLoader: 2,
        slaId: "",
    })

    useEffect(() => {
        setState((state) => {
            return {
                ...state,
                isShowGoods: false,
                page: 1,
                goodsLoader: [],
                slaId: props.slaDetail._id,
            }
        })
        getGoodForRows(1, []);
    }, [props.slaDetail._id])

    const showGoods = () => {
        setState({
            ...state,
            isShowGoods: !state.isShowGoods,
        });
    };

    const getGoodForRows = (page, goodsLoader) => {
        let { goods } = props.slaDetail;
        let { limitLoader } = state;
        if (goods) {
            let indexOfStartGoods = (page - 1) * limitLoader;
            let indexOfEndGoods = page * limitLoader < goods.length ? page * limitLoader : goods.length;
            for (let i = indexOfStartGoods; i < indexOfEndGoods; i++) {
                goodsLoader.push(goods[i]);
            }
        }
        setState({
            ...state,
            goodsLoader,
        });
    };

    const ShowMore = () => {
        let { page, goodsLoader } = state;
        getGoodForRows(page + 1, goodsLoader);
        setState({
            ...state,
            page: page + 1,
        });
    };

    const { code, title, descriptions, goods } = props.slaDetail;
    let { isShowGoods, page, limitLoader, goodsLoader } = state;

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
                            <a style={{ cursor: "pointer" }} onClick={showGoods}>
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
                                                <a style={{ cursor: "pointer" }} onClick={ShowMore}>
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

export default SlaDetailForm;
