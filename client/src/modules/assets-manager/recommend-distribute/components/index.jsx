import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ListAsset } from './listAsset';
import { RecommendDistribute } from './RecommendDistribute';

class RecommendDistributeAsset extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        const { translate } = this.props;
        return (
            <div className="nav-tabs-custom">
            <ul className="nav nav-tabs">
                <li className="active"><a title="Danh sách tài sản" data-toggle="tab" href="#listasset">Danh sách các tài sản</a></li>
                <li><a title="Đăng ký sử dụng tài sản" data-toggle="tab" href="#recommenddistribute">Đăng ký sử dụng tài sản</a></li>
            </ul>
            <div className="tab-content" style={{ padding: 0 }}>
                <ListAsset />
                <RecommendDistribute />
            </div>
        </div>
        );
    }
}

export default connect(null, null)(withTranslate(RecommendDistributeAsset)); 
