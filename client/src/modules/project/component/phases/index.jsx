import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import ListPhase from './listPhase';

const Phase = (props) => {
    return (
        <ListPhase />
    )
}
function mapState(state) {
    const { project, user } = state;
    return { project, user }
}

export default connect(mapState, null)(withTranslate(Phase));