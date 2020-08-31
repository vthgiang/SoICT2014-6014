import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

class SystemHome extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <React.Fragment>
                <div className="qlcv" style={{ textAlign: "right", marginBottom: 15 }}>
                </div>
            </React.Fragment>
        );
    }
}

function mapState(state) {
    const { tasks } = state;
    return { tasks };
}
const actionCreators = {
};
const connectedHome = connect(mapState, actionCreators)(withTranslate(SystemHome));
export { connectedHome as SystemHome };