import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../css/MainHeaderMenu.css';
import { withTranslate } from 'react-redux-multilingual';
import { refresh } from '../../../modules/auth/redux/actions';
import Notifications from './Notifications';
import Profile from './Profile';
import Roles from './Roles';
import Language from './Language';

class MainHeaderMenu extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        this.props.refresh();
    }

    render() {
        const { auth, translate } = this.props;
        return (
            <React.Fragment>
                <div className="navbar-custom-menu">
                    <ul className="nav navbar-nav">
                        <Roles />
                        <Notifications />
                        <Profile />
                        <Language />
                    </ul>
                </div>
            </React.Fragment>
        );
    }
}
const mapStateToProps = state => {
    return state;
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        refresh: () => {
            dispatch(refresh());
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(MainHeaderMenu));
