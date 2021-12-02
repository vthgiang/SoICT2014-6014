import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

function AssetLotManager(props) {
    const [state, setState] = useState({})
    return (
        <React.Fragment>
            <h2>Quản lý thông tin lô tài sản</h2>
        </React.Fragment>
    );
}

export default connect(null, null)(withTranslate(AssetLotManager));