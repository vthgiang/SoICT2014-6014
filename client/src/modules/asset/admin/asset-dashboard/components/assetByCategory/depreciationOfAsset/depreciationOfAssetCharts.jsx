import React, { Component } from 'react';
import { DepreciationPieChart } from './depreciationPieChart';
import { DepreciationTree } from './depreciationTree';
import { DepreciationBarChart } from './depreciationBarChart';

class DepreciationOfAssetCharts extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        const { displayBy, assetType, listAssets, typeOfChart } = this.props;
        return (
            <div>
                {/* Xu ly hien thi loai bieu do */}
                {
                    displayBy[0] === "Group" ?
                        <DepreciationPieChart
                            listAssets={listAssets}
                        /> : <DepreciationBarChart
                            assetType={assetType}
                            listAssets={listAssets}
                        />
                }
            </div>

        )
    }
}

export default DepreciationOfAssetCharts;
