import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { BiddingPackageReduxAction } from '../redux/actions';
import "./biddingPackage.css";
import BiddingPackageTable from './biddingPackageTable';

class BiddingPackage extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <div className="box" style={{ minHeight: '450px' }}>
                <div className="box-body">
                    <BiddingPackageTable />
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    getListBiddingPackage: BiddingPackageReduxAction.getListBiddingPackage,
    deleteBiddingPackage: BiddingPackageReduxAction.deleteBiddingPackage,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(BiddingPackage));