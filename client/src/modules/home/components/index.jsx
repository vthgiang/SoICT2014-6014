import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { SystemHome } from './systemHome';
import { SuperHome } from './superHome';

class Home extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { auth } = this.props;
        if (!auth.user.company)
            return <SystemHome />
        else
            return <SuperHome />

    }
}

function mapState(state) {
    const { auth } = state;
    return { auth };
}

const connectedHome = connect(mapState, null)(withTranslate(Home));
export { connectedHome as Home };