import React, { Component } from 'react';
import { AmountPieChart } from './amountPieChart';
import { AmountTree } from './amountTree';
import { AmountBarChart } from './amountBarChart';

class AmountOfAssetCharts extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        const { displayBy, assetType, listAssets, typeOfChart } = this.props;
        console.log('diss', displayBy);
        return (
            <div>
                {/* Xu ly hien thi loai bieu do */}
                {
                    displayBy[0] === "Group" ?
                        <AmountPieChart
                            listAssets={listAssets}
                        /> : <AmountBarChart
                            assetType={assetType}
                            listAssets={listAssets}
                        />
                }
            </div>
        )
    }
}

export default AmountOfAssetCharts;
