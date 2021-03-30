import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { AssetManagement } from './combinedContent';

function AssetManager(props) {
    const [state, setState] =useState({})
        return (
            <React.Fragment>
                <AssetManagement />
            </React.Fragment>
        );
}

export default connect(null, null)(withTranslate(AssetManager)); 
