import React, { Component } from 'react';
import { connect } from 'react-redux';
import ManufacturingDashboardHeader from './manufacturingDashboardHeader';
import ManufacturingLotPieChart from './manufacturingLotPieChart';
import PlanPieChart from './planPieChart';
import CommandPieChart from './commandPieChart';
import TopTenProductBarChart from './topTenProductBarChart';
import FluctuatingProductChart from './fluctuatingProductChart';
import PurchasingRequestPieChart from './purchasingRequestPieChart'
class ManufacturingDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    checkHasComponent = (name) => {
        let { auth } = this.props;
        let result = false;
        auth.components.forEach(component => {
            if (component.name === name) result = true;
        });

        return result;
    }

    render() {
        return (
            <React.Fragment>
                <div className="qlcv">
                    <ManufacturingDashboardHeader />
                    <div className="row">
                        <div className=" col-lg-6 col-md-6 col-md-sm-12 col-xs-12">
                            <PlanPieChart />
                        </div>
                        <div className=" col-lg-6 col-md-6 col-md-sm-12 col-xs-12">
                            <CommandPieChart />
                        </div>
                        <div className=" col-lg-6 col-md-6 col-md-sm-12 col-xs-12">
                            <ManufacturingLotPieChart />
                        </div>
                        {
                            this.checkHasComponent('view-pie-chart-purchasing')
                            &&
                            <div className=" col-lg-6 col-md-6 col-md-sm-12 col-xs-12">
                                <PurchasingRequestPieChart />
                            </div>
                        }

                    </div>
                    <div className="row">
                        <div className="col-lg-12 col-md-12 col-md-sm-12 col-xs-12">
                            <TopTenProductBarChart />
                        </div>
                    </div>
                    <div className="row">
                        <div className=" col-lg-12 col-md-12 col-md-sm-12 col-xs-12">
                            <FluctuatingProductChart />
                        </div>
                    </div>
                </div>
            </React.Fragment >
        );
    }
}

function mapStateToProps(state) {
    const { auth } = state;
    return { auth }
}
export default connect(mapStateToProps, null)((ManufacturingDashboard));