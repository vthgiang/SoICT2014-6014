import React, { Component } from 'react';
import { ValuePieChart } from './valuePieChart';
import { ValueTree } from './valueTree';
import { ValueBarChart } from './valueBarChart';

class ValueOfAssetCharts extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        const { displayBy, assetType, listAssets, typeOfChart } = this.props;
        return (
            <React.Fragment>
                {/* Xu ly hien thi loai bieu do */}
                {
                    displayBy[0] === "Group" ?
                        <ValuePieChart
                            listAssets={listAssets}
                        /> : <ValueBarChart
                            assetType={assetType}
                            listAssets={listAssets}
                        />
                }

            </React.Fragment>
        )
    }
}

export default ValueOfAssetCharts;
