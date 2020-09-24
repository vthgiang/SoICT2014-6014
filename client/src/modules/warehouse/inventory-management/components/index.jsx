import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { LazyLoadComponent, forceCheckOrVisible } from '../../../../common-components/index';

class InventoryManagement extends Component {

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
                    <li className="active"><a href="#inventory-products" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>{translate('manage_warehouse.inventory_management.product')}</a></li>
                    <li><a href="#inventory-materials" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>{translate('manage_warehouse.inventory_management.material')}</a></li>
                    <li><a href="#inventory-equipments" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>{translate('manage_warehouse.inventory_management.equipment')}</a></li>
                    <li><a href="#inventory-assets" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>{translate('manage_warehouse.inventory_management.asset')}</a></li>
                </ul>
                <div className="tab-content">

                    <div className="tab-pane active" id="inventory-products">
                        <LazyLoadComponent
                        >
                        </LazyLoadComponent>
                    </div>

                    <div className="tab-pane" id="inventory-materials">
                        <LazyLoadComponent
                        >
                        </LazyLoadComponent>
                    </div>

                    <div className="tab-pane" id="inventory-equipments">
                        <LazyLoadComponent
                        >
                        </LazyLoadComponent>
                    </div>

                    <div className="tab-pane" id="inventory-assets">
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
export default connect(mapStateToProps, null)(withTranslate(InventoryManagement));
