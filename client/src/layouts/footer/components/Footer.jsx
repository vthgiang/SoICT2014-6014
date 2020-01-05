import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

class Footer extends Component {
    render() {
        const { translate } = this.props;
        return (
            <footer className="main-footer">
                <div className="pull-right hidden-xs">
                    <b>{ translate('footer.version')}</b> 2019.1
                </div>
                <strong>{ translate('footer.copyRight')}<span style={{color: 'blue'}}>Quản Lý Công Việc</span></strong>
            </footer>
        );
    }
}

const mapState = state => state ;

export default connect(mapState, null)(withTranslate(Footer));