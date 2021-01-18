
import React, { Component } from 'react';

import c3 from 'c3';
import 'c3/c3.css';

import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { SelectMulti, DatePicker, SelectBox } from '../../../../../common-components';
import { compareLteDate } from '../../../../../helpers/formatDate';
import { worksActions } from '../../manufacturing-works/redux/actions';
import { connect } from 'react-redux';
import { commandActions } from '../../manufacturing-command/redux/actions';

class TopTenProductBarChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentRole: localStorage.getItem('currentRole'),
            fromDate: '',
            toDate: '',
            manufacturingWorks: [],
        }
    }

    componentDidMount() {
        this.props.getTopTenProduct({ currentRole: this.state.currentRole });
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

    handleFromDateChange = (value) => {
        this.validateFromDateChange(value, true);
    };

    validateFromDateChange = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if (value && this.state.toDate) {
            let obj = compareLteDate(value, this.state.toDate);
            console.log(obj.status);
            if (!obj.status) {
                msg = translate("manufacturing.plan.choose_date_error");
            }
        }
        if (willUpdateState) {
            this.setState((state) => ({
                ...state,
                fromDate: value,
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
        if (value && this.state.fromDate) {
            console.log("to Date")
            let obj = compareLteDate(this.state.fromDate, value);
            if (!obj.status) {
                msg = translate("manufacturing.plan.choose_date_error");
            }
        }
        if (willUpdateState) {
            this.setState((state) => ({
                ...state,
                toDate: value,
                errorTime: msg
            }));
        }
        return msg;
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
            fromDate: this.state.fromDate,
            toDate: this.state.toDate
        }
        this.props.getTopTenProduct(data);
    }

    barAndChart = (translate, topTenProduct) => {
        let arrayContent = ['x'];
        let arrayQuantity = [translate('manufacturing.dashboard.quantity_pill')];
        topTenProduct.map(x => {
            arrayContent.push(x.name);
            arrayQuantity.push(x.quantity);
        })
        let chart = c3.generate({
            bindto: this.refs.topTenProduct,
            data: {
                x: 'x',
                columns: [
                    arrayContent,
                    arrayQuantity
                ],
                type: 'bar',
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

    render() {
        const { translate, manufacturingCommand } = this.props;
        const { fromDate, toDate, errorTime } = this.state;
        let topTenProduct = [];
        if (manufacturingCommand.topTenProduct && manufacturingCommand.isLoading === false) {
            topTenProduct = manufacturingCommand.topTenProduct;
        }
        this.barAndChart(translate, topTenProduct);
        return (
            <React.Fragment>
                <div className="box">
                    <div className="box-header with-border">
                        <i className="fa fa-bar-chart-o" />
                        <h3 className="box-title">
                            Top {topTenProduct.length} {translate('manufacturing.dashboard.top_ten_product')}
                        </h3>
                        <div className="form-group">
                            <label style={{ width: "auto" }}>{translate('manufacturing.dashboard.choose_works')}</label>
                            <SelectMulti
                                id={`select-multi-works-top-ten`}
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
                                <label className="form-control-static">{translate('manufacturing.dashboard.from')}</label>
                                <DatePicker
                                    id="top-ten-from-date"
                                    value={fromDate}
                                    onChange={this.handleFromDateChange}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-control-static">{translate('manufacturing.dashboard.to')}</label>
                                <DatePicker
                                    id="top-ten-to-date"
                                    value={toDate}
                                    onChange={this.handleToDateChange}
                                />
                            </div>
                            <div className="form-group">
                                <button className="btn btn-success" disabled={errorTime} onClick={this.handleSubmitSearch}>{translate('manufacturing.dashboard.filter')}</button>
                            </div>
                        </div>
                        <div ref="topTenProduct"></div>
                    </div>
                </div>
            </React.Fragment >
        )
    }
}

function mapStateToProps(state) {
    const { manufacturingWorks, manufacturingCommand } = state;
    return { manufacturingWorks, manufacturingCommand }
}

const mapDispatchToProps = {
    getAllManufacturingWorks: worksActions.getAllManufacturingWorks,
    getTopTenProduct: commandActions.getTopTenProduct
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(TopTenProductBarChart));