import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { SuppliesDashboard } from './suppliesDashboard';

function ManageSuppliesDashboard(props) {
    return (
        <React.Fragment>
          <h1>Dashboard vật tư</h1>
          <SuppliesDashboard>

          </SuppliesDashboard>
        </React.Fragment>
    );
}

export default connect(null, null)(withTranslate(ManageSuppliesDashboard)); 