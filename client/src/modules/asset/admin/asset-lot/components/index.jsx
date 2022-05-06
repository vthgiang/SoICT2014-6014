import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { AssetLotManagement } from './combinedContent';

function AssetLotManager(props) {
    const [state, setState] = useState({})
    return (
        <React.Fragment>
            <AssetLotManagement>

            </AssetLotManagement>
        </React.Fragment>
    );
}

export default connect(null, null)(withTranslate(AssetLotManager));