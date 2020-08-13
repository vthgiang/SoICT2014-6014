import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DistributionOfEmployeeKpiChart } from './distributionOfEmployeeKpiChart';
import { ResultsOfEmployeeKpiChart } from './resultsOfEmployeeKpiChart';

var translate = '';
class DashBoardEmployeeKpiSet extends Component {

    constructor(props) {
        super(props);

        translate = this.props.translate;
        
        this.state = {
            
        };
    }

    render() {
        return (
            <React.Fragment>
                <section className="row">
                    <div className="col-xs-12">
                        <div className=" box box-primary">
                            <div className="box-header with-border">
                                <div className="box-title">{translate('kpi.evaluation.dashboard.result_kpi_personal')}</div>
                            </div>
                            <div className="box-body qlcv">
                                {/**Biểu đồ kết quả */}
                                <ResultsOfEmployeeKpiChart
                                    startDate={this.state.startDate}
                                    endDate={this.state.endDate}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="col-xs-12">
                        <div className=" box box-primary">
                            {/**Biểu đồ đóng góp */}
                            <div className="box-header with-border">
                                <div className="box-title">{translate('kpi.evaluation.dashboard.distribution_kpi_personal')}</div>
                            </div>
                            <div className="box-body qlcv">
                                <DistributionOfEmployeeKpiChart/>
                            </div>
                        </div>
                    </div>
                </section>
            </React.Fragment>
        );
    }
}

function mapState(state) {
    const { KPIPersonalManager } = state;
    return { KPIPersonalManager };
}

const actionCreators = {
   
};
const connectedDashBoardEmployeeKpiSet = connect(mapState, actionCreators)(withTranslate(DashBoardEmployeeKpiSet));
export { connectedDashBoardEmployeeKpiSet as DashBoardEmployeeKpiSet };
