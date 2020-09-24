import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { LazyLoadComponent, forceCheckOrVisible } from '../../../../common-components/index';

class BinLocationManagement extends Component {

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
                    <li className="active"><a href="#bin-locations" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>{translate('manage_warehouse.bin_location_management.bin_location')}</a></li>
                    <li><a href="#bin-location-archives" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>{translate('manage_warehouse.bin_location_management.archive')}</a></li>
                </ul>
                <div className="tab-content">

                    <div className="tab-pane active" id="bin-locations">
                        <LazyLoadComponent
                        >
                        </LazyLoadComponent>
                    </div>

                    <div className="tab-pane" id="bin-location-archives">
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
export default connect(mapStateToProps, null)(withTranslate(BinLocationManagement));
