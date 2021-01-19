
import React, { Component } from 'react';

import c3 from 'c3';
import 'c3/c3.css';

import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { SelectMulti, DatePicker, SelectBox } from '../../../../../common-components';
import { translate } from 'react-redux-multilingual/lib/utils';
import { LotActions } from '../../../warehouse/inventory-management/redux/actions';
import { connect } from 'react-redux';

class ManufacturingOrderPieChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentRole: localStorage.getItem('currentRole')
        }
    }

    componentDidMount() {
        this.props.getNumberLotsStatus({ currentRole: this.state.currentRole })
    }

    pieChart = (translate, manufacturingLotNumberStatus) => {
        let chart = c3.generate({
            bindto: this.refs.quantityLotStatus,

            data: {
                columns: [
                    [translate('manufacturing.lot.1.content'), manufacturingLotNumberStatus.lot1 ? manufacturingLotNumberStatus.lot1 : 0],
                    [translate('manufacturing.lot.2.content'), manufacturingLotNumberStatus.lot2 ? manufacturingLotNumberStatus.lot2 : 0],
                    [translate('manufacturing.lot.3.content'), manufacturingLotNumberStatus.lot3 ? manufacturingLotNumberStatus.lot3 : 0],
                ],
                type: 'pie',
            },

            color: {
                pattern: [
                    translate('manufacturing.command.1.color'),
                    translate('manufacturing.command.2.color'),
                    translate('manufacturing.command.3.color')
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
        const { translate, lots } = this.props;
        let manufacturingLotNumberStatus = {}
        if (lots.manufacturingLotNumberStatus && lots.isLoading === false) {
            manufacturingLotNumberStatus = lots.manufacturingLotNumberStatus
        }
        this.pieChart(translate, manufacturingLotNumberStatus);
        return (
            <React.Fragment>
                <div className="box">
                    <div className="box-header with-border">
                        <i className="fa fa-bar-chart-o" />
                        <h3 className="box-title">
                            {translate('manufacturing.lot.lot_quantity_status')}
                        </h3>
                        <div ref="quantityLotStatus"></div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

function mapStateToProps(state) {
    const { lots } = state;
    return { lots }
}

const mapDispatchToProps = {
    getNumberLotsStatus: LotActions.getNumberLotsStatus
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ManufacturingOrderPieChart));