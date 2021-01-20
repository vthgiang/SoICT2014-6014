
import React, { Component } from 'react';

import c3 from 'c3';
import 'c3/c3.css';

import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { DatePicker, SelectBox, SelectMulti } from '../../../../../common-components';
import { commandActions } from '../../manufacturing-command/redux/actions';
import { GoodActions } from '../../../common-production/good-management/redux/actions';
import { connect } from 'react-redux';
import { compareLteMonth } from '../../../../../helpers/formatDate';
import { worksActions } from '../../manufacturing-works/redux/actions';

class FluctuatingProductLineChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            barChart: true,
            currentRole: localStorage.getItem('currentRole'),
            fromMonth: '02-2020',
            toMonth: '01-2021',
            good: '',
            manufacturingWorks: []

        }
    }

    componentDidMount() {
        this.props.getAllManufacturingWorks({ currentRole: this.state.currentRole })
        this.props.getGoodByManageWorkRole(this.state.currentRole);
        const data = {
            currentRole: this.state.currentRole,
            fromMonth: this.state.fromMonth,
            toMonth: this.state.toMonth,
            good: this.state.good
        }
        this.props.getFuctuatingProduct(data);
    }

    handleChangeViewChart = (value) => {
        this.setState({
            ...this.state,
            barChart: value
        })
    }

    getAllGoods = () => {
        const { translate, goods } = this.props;
        let listGoods = [
            {
                value: "",
                text: translate("manufacturing.dashboard.choose_all_good"),
            },
        ];
        const { listGoodsByRole } = goods;

        if (listGoodsByRole) {
            listGoodsByRole.map((item) => {
                listGoods.push({
                    value: item._id,
                    text: item.name + " (" + item.baseUnit + ") ",
                });
            });
        }
        return listGoods;
    };

    handleGoodChange = (value) => {
        const goodId = value[0];
        this.setState((state) => ({
            ...state,
            good: goodId
        }))
    };

    formatMonth = (month) => {
        month = month.split("-");
        return `${month[1]}-${month[0]}`
    }

    // Khởi tạo BarChart bằng C3
    barAndChart = (translate, fluactuatingProduct) => {
        const { barChart } = this.state;
        let arrayMonth = ['x'];
        let arrayTotal = [translate('manufacturing.dashboard.total_product')];
        let arrayFinished = [translate('manufacturing.dashboard.finished_product')];
        let arraySub = [translate('manufacturing.dashboard.sub_product')]
        fluactuatingProduct.map(x => {
            arrayMonth.push(this.formatMonth(x.month));
            arrayTotal.push(x.finishedProductQuantity + x.substandardProductQuantity);
            arrayFinished.push(x.finishedProductQuantity);
            arraySub.push(x.substandardProductQuantity);
        })
        let chart = c3.generate({
            bindto: this.refs.fluctuatingProduct,
            data: {
                x: 'x',
                columns: [
                    arrayMonth,
                    arrayTotal,
                    arrayFinished,
                    arraySub
                ],
                type: barChart ? 'line' : 'bar',
            },
            axis: {
                x: {
                    type: 'category',
                    tick: {
                        rotate: 75,
                        multiline: false
                    },
                    height: 100
                },
                y: {
                    label: {
                        text: translate('manufacturing.command.quantity'),
                        position: "outer-middle"
                    }
                }
            }
        });
    }

    handleFromDateChange = (value) => {
        this.validateFromDateChange(value, true);
    };

    validateFromDateChange = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if (!value) {
            msg = translate("manufacturing.plan.choose_date_error");
        }
        if (value && this.state.toMonth) {
            let obj = compareLteMonth(value, this.state.toMonth);
            console.log(obj.status);
            if (!obj.status) {
                msg = translate("manufacturing.plan.choose_date_error");
            }
        }
        if (willUpdateState) {
            this.setState((state) => ({
                ...state,
                fromMonth: value,
                errorTime: msg
            }));
        }
        return msg;
    }


    handleToDateChange = (value) => {
        this.validateToDateChange(value, true);
    };

    validateToDateChange = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if (!value) {
            msg = translate("manufacturing.plan.choose_date_error");
        }
        if (value && this.state.fromMonth) {
            let obj = compareLteMonth(this.state.fromMonth, value);
            if (!obj.status) {
                msg = translate("manufacturing.plan.choose_date_error");
            }
        }
        if (willUpdateState) {
            this.setState((state) => ({
                ...state,
                toMonth: value,
                errorTime: msg
            }));
        }
        return msg;
    }

    getListManufacturingWorksArr = () => {
        const { manufacturingWorks } = this.props;
        const { listWorks } = manufacturingWorks;
        let listManufacturingWorksArr = [];
        if (listWorks) {
            listWorks.map((works) => {
                listManufacturingWorksArr.push({
                    value: works._id,
                    text: works.name
                });
            });
        }
        return listManufacturingWorksArr;
    }

    handleManufacturingWorksChange = (value) => {
        this.setState((state) => ({
            ...state,
            manufacturingWorks: value
        }))
    }

    handleSubmitSearch = () => {
        const data = {
            currentRole: this.state.currentRole,
            manufacturingWorks: this.state.manufacturingWorks,
            fromMonth: this.state.fromMonth,
            toMonth: this.state.toMonth,
            good: this.state.good
        }
        this.props.getFuctuatingProduct(data);
    }



    render() {
        const { translate, manufacturingCommand } = this.props;
        const { fromMonth, toMonth, good, errorTime } = this.state;
        let fluctuatingProduct = [];
        if (manufacturingCommand.fluctuatingProduct && manufacturingCommand.isLoading === false) {
            fluctuatingProduct = manufacturingCommand.fluctuatingProduct
        }
        this.barAndChart(translate, fluctuatingProduct);
        return (
            <React.Fragment>
                <div className="box">
                    <div className="box-header with-border">
                        <i className="fa fa-bar-chart-o" />
                        <h3 className="box-title">
                            {translate('manufacturing.dashboard.product_quantity_change')}
                        </h3>
                        <div className="form-group">
                            <label style={{ width: "auto" }}>{translate('manufacturing.dashboard.choose_works')}</label>
                            <SelectMulti
                                id={`select-multi-works-fluactuating-product`}
                                multiple="multiple"
                                options={{ nonSelectedText: translate('manufacturing.plan.choose_works'), allSelectedText: translate('manufacturing.plan.choose_all') }}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={this.getListManufacturingWorksArr()}
                                onChange={this.handleManufacturingWorksChange}
                            />
                        </div>
                        <div className="form-inline">
                            <div className="form-group">
                                <SelectBox
                                    style={{ width: "180px" }}
                                    id="multi-select-product-fluctuating"
                                    value={good}
                                    items={this.getAllGoods()}
                                    onChange={this.handleGoodChange}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-control-static">{translate('manufacturing.dashboard.from')}</label>
                                <DatePicker
                                    id="from-month-fluctuating"
                                    dateFormat="month-year"
                                    value={fromMonth}
                                    onChange={this.handleFromDateChange}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-control-static">{translate('manufacturing.dashboard.to')}</label>
                                <DatePicker
                                    id="to-month-fluctuating"
                                    dateFormat="month-year"
                                    value={toMonth}
                                    onChange={this.handleToDateChange}
                                />
                            </div>
                            <div className="box-tools pull-right" >
                                <div className="btn-group pull-rigth">
                                    <button type="button" className={`btn btn-xs ${this.state.barChart ? "btn-danger" : "active"}`} onClick={() => this.handleChangeViewChart(true)}>{translate('manufacturing.dashboard.line')}</button>
                                    <button type="button" className={`btn btn-xs ${this.state.barChart ? 'active' : "btn-danger"}`} onClick={() => this.handleChangeViewChart(false)}>{translate('manufacturing.dashboard.bar')}</button>
                                </div>
                            </div>

                            <div className="form-group">
                                <button disabled={errorTime} onClick={this.handleSubmitSearch} className="btn btn-success">{translate('manufacturing.dashboard.filter')}</button>
                            </div>
                        </div>
                        <div ref="fluctuatingProduct"></div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

function mapStateToProps(state) {
    const { goods, lots, manufacturingWorks, manufacturingCommand } = state;
    return { goods, lots, manufacturingWorks, manufacturingCommand }
}

const mapDispatchToProps = {
    getFuctuatingProduct: commandActions.getFuctuatingProduct,
    getGoodByManageWorkRole: GoodActions.getGoodByManageWorkRole,
    getAllManufacturingWorks: worksActions.getAllManufacturingWorks,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(FluctuatingProductLineChart));