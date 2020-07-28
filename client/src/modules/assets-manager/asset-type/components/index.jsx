import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import AdministrationAssetTypes from './types';
import AssetTypeManager from './AssetTypeManager';

class ManagerAssetType extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        const { translate } = this.props;
        return (
            // <React.Fragment>
            //     <AdministrationAssetTypes />
            // </React.Fragment>

            <div className="nav-tabs-custom">
                <ul className="nav nav-tabs">
                    <li className="active"><a href="#assettype-tree" data-toggle="tab">Danh mục loại tài sản</a></li>
                    <li><a href="#assettype-table" data-toggle="tab">Danh sách loại tài sản</a></li>
                </ul>
                <div className="tab-content">
                    <div className="tab-pane active" id="assettype-tree">
                        <AdministrationAssetTypes />
                    </div>
                    <div className="tab-pane" id="assettype-table">
                        <AssetTypeManager />
                    </div>
                </div>
            </div>

        );
    }
}

const mapStateToProps = state => state;

export default connect(mapStateToProps, null)(withTranslate(ManagerAssetType)); 
