import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { LazyLoadComponent, forceCheckOrVisible } from '../../../../common-components/index';

class BillManagement extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {

        const { translate } = this.props;

        return (
            <div className="nav-tabs-custom">
                <ul className="nav nav-tabs">
                    <li className="active"><a href="#bill-stock-book" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>{translate('manage_warehouse.bill_management.stock_book')}</a></li>
                    <li><a href="#bill-good-receipts" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>{translate('manage_warehouse.bill_management.good_receipt')}</a></li>
                    <li><a href="#bill-good-issues" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>{translate('manage_warehouse.bill_management.good_issue')}</a></li>
                    <li><a href="#bill-good-returns" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>{translate('manage_warehouse.bill_management.good_return')}</a></li>
                    <li><a href="#bill-stock-takes" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>{translate('manage_warehouse.bill_management.stock_take')}</a></li>
                    <li><a href="#bill-stock-rotates" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>{translate('manage_warehouse.bill_management.stock_rotate')}</a></li>
                </ul>
                <div className="tab-content">

                    <div className="tab-pane active" id="bill-stock-book">
                        <LazyLoadComponent
                        >
                        </LazyLoadComponent>
                    </div>

                    <div className="tab-pane" id="bill-good-receipts">
                        <LazyLoadComponent
                        >
                        </LazyLoadComponent>
                    </div>

                    <div className="tab-pane" id="bill-good-issues">
                        <LazyLoadComponent
                        >
                        </LazyLoadComponent>
                    </div>

                    <div className="tab-pane" id="bill-good-returns">
                        <LazyLoadComponent
                        >
                        </LazyLoadComponent>
                    </div>

                    <div className="tab-pane" id="bill-stock-takes">
                        <LazyLoadComponent
                        >
                        </LazyLoadComponent>
                    </div>
                    <div className="tab-pane" id="bill-stock-rotates">
                        <LazyLoadComponent
                        >
                        </LazyLoadComponent>
                    </div>
                </div>
            </div>
        );
    }
    
}

const mapStateToProps = state => state;
export default connect(mapStateToProps, null)(withTranslate(BillManagement));
