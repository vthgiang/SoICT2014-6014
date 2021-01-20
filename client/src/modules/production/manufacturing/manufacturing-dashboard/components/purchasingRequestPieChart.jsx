
import React, { Component } from 'react';

import c3 from 'c3';
import 'c3/c3.css';

import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { SelectMulti, DatePicker, SelectBox } from '../../../../../common-components';
import { translate } from 'react-redux-multilingual/lib/utils';
import { purchasingRequestActions } from '../../purchasing-request/redux/actions';
import { connect } from 'react-redux';

class PurchasingRequestPieChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {
        this.props.getNumberPurchasingStatus()
    }

    pieChart = (translate, purchasingNumber) => {
        let chart = c3.generate({
            bindto: this.refs.quantityNumberPurchasing,

            data: {
                columns: [
                    [translate('manufacturing.purchasing_request.1.content'), purchasingNumber.purchasing1 ? purchasingNumber.purchasing1 : 0],
                    [translate('manufacturing.purchasing_request.2.content'), purchasingNumber.purchasing2 ? purchasingNumber.purchasing2 : 0],
                    [translate('manufacturing.purchasing_request.3.content'), purchasingNumber.purchasing3 ? purchasingNumber.purchasing3 : 0],
                ],
                type: 'pie',
            },

            color: {
                pattern: [
                    translate('manufacturing.purchasing_request.1.color'),
                    translate('manufacturing.purchasing_request.2.color'),
                    translate('manufacturing.purchasing_request.3.color')
                ]
            },

            pie: {
                label: {
                    format: function (value, ratio, id) {
                        return value;
                    }
                }
            },

            padding: {
                top: 20,
                bottom: 20,
                right: 20,
                left: 20
            },

            tooltip: {
                format: {
                    title: function (d) { return d; },
                    value: function (value) {
                        return value;
                    }
                }
            },

            legend: {
                show: true
            }
        });
    }

    render() {
        const { translate, purchasingRequest } = this.props;
        let purchasingNumber = {};
        if (purchasingRequest.purchasingNumber && purchasingRequest.isLoading === false) {
            purchasingNumber = purchasingRequest.purchasingNumber
        }
        this.pieChart(translate, purchasingNumber);
        return (
            <React.Fragment>
                <div className="box">
                    <div className="box-header with-border">
                        <i className="fa fa-bar-chart-o" />
                        <h3 className="box-title">
                            {translate('manufacturing.purchasing_request.number_purchasing_status')}
                        </h3>
                        <div ref="quantityNumberPurchasing"></div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

function mapStateToProps(state) {
    const { purchasingRequest } = state;
    return { purchasingRequest }
}

const mapDispatchToProps = {
    getNumberPurchasingStatus: purchasingRequestActions.getNumberPurchasingStatus,
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(PurchasingRequestPieChart));