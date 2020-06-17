import React, { Component } from 'react';
import { connect } from 'react-redux';

import { ModalDetailEmployeeKpiSet } from './employeeKpiDetailModal';
import { ModalCopyEmployeeKpiSet } from './employeeKpiCopyModal';
import { DistributionOfEmployeeKpiChart } from './distributionOfEmployeeKpiChart';
import { ResultsOfEmployeeKpiChart } from './resultsOfEmployeeKpiChart';

import { dashboardEmployeeKpiSetActions } from '../redux/actions';
import { managerKpiActions } from '../../management/redux/actions';

import CanvasJSReact from '../../../../../chart/canvasjs.react';


class DashBoardEmployeeKpiSet extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showModalCopy: "",
            currentMonth: new Date().getMonth() + 1,
            currentYear: new Date().getFullYear()
        };
    }
    
    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [month, year].join('-');
    }

    showModalCopy = async (id) => {
        await this.setState(state => {
            return {
                ...state,
                showModalCopy: id
            }
        })
        var element = document.getElementsByTagName("BODY")[0];
        element.classList.add("modal-open");
        var modal = document.getElementById(`copyOldKPIToNewTime${id}`);
        modal.classList.add("in");
        modal.style = "display: block; padding-right: 17px;";
    }

    render() {
        return (
            <div className="table-wrapper box">
                <section className="content">
                    <div className="row">
                        <div className="col-xs-6">
                            <div className=" box box-primary" style={ {textAlign: 'center'} }>
                                <h2 class="box-title">Phân bố KPI cá nhân năm {this.state.currentYear}</h2>
                                <div className="box-body dashboard_box_body">
                                    <ResultsOfEmployeeKpiChart/>
                                </div>
                            </div>
                        </div>
                        <div className="col-xs-6">
                            <div className=" box box-primary" style={ {textAlign: 'center'} }>
                                <h2 class="box-title">Phân bố KPI cá nhân tháng {this.state.currentMonth}</h2>
                                <div className="box-body dashboard_box_body">
                                    <DistributionOfEmployeeKpiChart/>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}

function mapState(state) {
    const { KPIPersonalManager } = state;
    return { KPIPersonalManager };
}

const actionCreators = {
    getEmployeeKpiSetByMember: managerKpiActions.getAllKPIPersonalByMember
};
const connectedDashBoardEmployeeKpiSet = connect(mapState, actionCreators)(DashBoardEmployeeKpiSet);
export { connectedDashBoardEmployeeKpiSet as DashBoardEmployeeKpiSet };
