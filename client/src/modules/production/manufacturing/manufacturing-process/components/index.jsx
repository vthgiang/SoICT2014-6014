import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { LazyLoadComponent, forceCheckOrVisible } from '../../../../../common-components';

class ManufacturingProcess extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <div className="nav-tabs-custom">
                <ul className="nav nav-tabs">
                    <li className="active"><a href="#manufacturing-plan-process" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>Theo dõi kế hoạch sản xuất</a></li>
                    <li><a href="#manufacturing-command-process" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>Theo dõi lệnh sản xuất</a></li>
                </ul>
                <div className="tab-content">
                    <div className="tab-pane active" id="manufacturing-plan-process">
                        <LazyLoadComponent
                        >
                        </LazyLoadComponent>
                    </div>

                    <div className="tab-pane" id="manufacturing-command-process">
                        <LazyLoadComponent
                        >
                        </LazyLoadComponent>
                    </div>
                </div>
            </div>
        );
    }
}
export default connect(null, null)(withTranslate(ManufacturingProcess));