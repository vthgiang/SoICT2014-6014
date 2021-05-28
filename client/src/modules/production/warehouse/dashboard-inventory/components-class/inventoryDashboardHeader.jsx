import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { SelectMulti, DatePicker } from '../../../../../common-components';
import { GoodActions } from '../../../common-production/good-management/redux/actions';
class InventoryDashboardHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {
        this.props.getNumberGoods();
    }

    /**
     * Function format dữ liệu Date thành string
     * @param {*} date : Ngày muốn format
     * @param {*} monthYear : true trả về tháng năm, false trả về ngày tháng năm
     */
    formatDate(date, monthYear = false) {
        if (date) {
            let d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            if (monthYear === true) {
                return [month, year].join('-');
            } else return [day, month, year].join('-');
        }
        return date;
    }

    // Function bắt sự kiện thay đổi unit
    handleSelectOrganizationalUnit = async (value) => {
        if (value.length === 0) {
            value = null
        };
        await this.setState({
            organizationalUnits: value
        })
    };

    // Function lưu giá trị tháng vào state khi thay đổi
    handleMonthChange = (value) => {
        if (value) {
            let partMonth = value.split('-');
            value = [partMonth[1], partMonth[0]].join('-');
        }
        this.setState({
            ...this.state,
            month: value
        });
    }
    render() {
        const { translate, goods } = this.props;
        const { numberGoods} = goods;

        return (
            <React.Fragment>
                <div className="row" style={{ marginTop: 10 }}>
                    <div className="col-md-4 col-sm-6 col-xs-6">
                        <div className="info-box with-border">
                            <span className="info-box-icon bg-aqua"><i className="fa fa-database"></i></span>
                            <div className="info-box-content">
                                <span className="info-box-text">Số mặt hàng tồn</span>
                                <span className="info-box-number">
                                    {numberGoods !== null ? numberGoods.totalGoods : 0 }
                                </span>
                                <a href={`/inventory-management`} target="_blank" >Xem thêm <i className="fa fa-arrow-circle-right"></i></a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 col-sm-6 col-xs-6">
                        <div className="info-box">
                            <span className="info-box-icon bg-green"><i className="fa fa-cart-plus"></i></span>
                            <div className="info-box-content" title="Số khen thưởng tháng/số khen thưởng năm" >
                                <span className="info-box-text">Sản phẩm</span>
                                <span className="info-box-number">{numberGoods !== null ? numberGoods.totalProducts : 0 }/{numberGoods !== null ? numberGoods.totalGoods : 0 }</span>
                                <a href={`/inventory-management`} target="_blank" >Xem thêm <i className="fa fa-arrow-circle-right"></i></a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 col-sm-6 col-xs-6">
                        <div className="info-box">
                            <span className="info-box-icon bg-red"><i className="fa  fa-cart-arrow-down"></i></span>
                            <div className="info-box-content" title="Số kỷ luật tháng/số kỷ luật năm">
                                <span className="info-box-text">Nguyên vật liệu</span>
                                <span className="info-box-number">{numberGoods !== null ? numberGoods.totalMaterials : 0 }/{numberGoods !== null ? numberGoods.totalGoods : 0 }</span>
                                <a href={`/inventory-management`} target="_blank" >Xem thêm <i className="fa fa-arrow-circle-right"></i></a>
                            </div>
                        </div>
                    </div>
                    {/* <div className="col-md-3 col-sm-6 col-xs-6">
                        <div className="info-box">
                            <span className="info-box-icon bg-yellow"><i className="fa  fa-bicycle"></i></span>
                            <div className="info-box-content" title="Số nghỉ phép tháng/số nghỉ phép năm">
                                <span className="info-box-text">Công cụ dụng cụ</span>
                                <span className="info-box-number">5/50</span>
                                <a href={`/inventory-management`} target="_blank" >Xem thêm <i className="fa  fa-arrow-circle-o-right"></i></a>
                            </div>
                        </div>
                    </div> */}
                </div>
            </React.Fragment>
        );
    }
};

const mapStateToProps = state => state;

const mapDispatchToProps = {
    getNumberGoods: GoodActions.getNumberGoods
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(InventoryDashboardHeader));