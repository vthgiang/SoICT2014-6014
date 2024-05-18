import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import ManufacturingQualityError from './manufacturing-quality-error/components';
import ManufacturingQualityCriterial from './manufacturing-quality-criteria/components';
import ManufacturingQualityInspection from './manufacturing-quality-inspection/components';

function ManufacturingQuality(props) {
    const { translate } = props;
    const [activeTab, setActiveTab] = useState(0);

    const handleActiveTab = (activeTab) => {
        setActiveTab(activeTab)
    }
    
    return (
        <div className="nav-tabs-custom">
            <ul className="nav nav-tabs">
                <li className="active"><a href="#error-management" data-toggle="tab" onClick={() => handleActiveTab(0)}>{translate('manufacturing.quality.error_tab')}</a></li>
                <li><a href="#quality-criteria" data-toggle="tab" onClick={() => handleActiveTab(1)}>{translate('manufacturing.quality.criteria_tab')}</a></li>
                <li><a href="#quality-inspection" data-toggle="tab" onClick={() => handleActiveTab(2)}>{translate('manufacturing.quality.inspection_tab')} </a></li>
            </ul>
            <div className="tab-content">
                <div className="tab-pane active" id="error-management">
                    {activeTab === 0 && (
                        <ManufacturingQualityError />
                    )}
                </div>
                <div className="tab-pane" id="quality-criteria">
                    {activeTab === 1 && (
                        <ManufacturingQualityCriterial />
                    )}
                </div>
                <div className="tab-pane" id="quality-inspection">
                    {activeTab == 2 && (
                        <ManufacturingQualityInspection />
                    )}
                </div>
            </div>
        </div>
    );
}
export default connect(null, null)(withTranslate(ManufacturingQuality));