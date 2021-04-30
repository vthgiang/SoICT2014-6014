import React from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { HumanResourceConfiguration } from './combinedContent';

function ManageConfiguration() {
    return (
        <div className="nav-tabs-custom">
            <ul className="nav nav-tabs">
                <li className="active"><a data-toggle="tab" href="#human_resource_config">{`Quản lý nhân sự`}</a></li>
            </ul>
            <div className="tab-content">
                <HumanResourceConfiguration
                    id="human_resource_config"
                />
            </div>
        </div>
    );
}

const configuration = connect(null, null)(withTranslate(ManageConfiguration));
export { configuration as ManageConfiguration };
