import React, { Component } from 'react';
import { connect } from 'react-redux';

import { ModalDetailEmployeeKpiSet } from './employeeKpiDetailModal';
import { ModalCopyEmployeeKpiSet } from './employeeKpiCopyModal';
import { DistributionOfEmployeeKpiChart } from './distributionOfEmployeeKpiChart';
import { ResultsOfEmployeeKpiChart } from './resultsOfEmployeeKpiChart';

import { dashboardEmployeeKpiSetActions } from '../redux/actions';
import { managerKpiActions } from '../../management/redux/actions';

import { DatePicker } from '../../../../../common-components';
import Swal from 'sweetalert2';


class DashBoardEmployeeKpiSet extends Component {

    constructor(props) {
        super(props);

        var currentDate = new Date();
        var currentYear = currentDate.getFullYear();
        var currentMonth = currentDate.getMonth();

        this.INFO_SEARCH = {
            startDate: currentYear + '-' + 1,
            endDate: currentYear + '-' + (currentMonth + 2)
        }

        this.state = {
            showModalCopy: "",
            currentMonth: new Date().getMonth() + 1,
            startDate: this.INFO_SEARCH.startDate,
            endDate: this.INFO_SEARCH.endDate
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

    handleSelectMonthStart = (value) => {
        var month = value.slice(3,7) + '-' + value.slice(0,2);
        this.INFO_SEARCH.startDate = month;
    }

    handleSelectMonthEnd = async (value) => {
        var month = value.slice(3,7) + '-' + (new Number(value.slice(0,2)) + 1);
        this.INFO_SEARCH.endDate = month;
    }

    handleSearchData = async () => {
        var startDate = this.INFO_SEARCH.startDate.split("-");
        var startdate = new Date(startDate[1], startDate[0], 0);
        var endDate = this.INFO_SEARCH.endDate.split("-");
        var enddate = new Date(endDate[1], endDate[0], 28);
        
        if (Date.parse(startdate) > Date.parse(enddate)) {
            Swal.fire({
                title: "Thời gian bắt đầu phải trước hoặc bằng thời gian kết thúc!",
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Xác nhận'
            })
        } else {
            await this.setState(state => {
                return {
                    ...state,
                    startDate: this.INFO_SEARCH.startDate,
                    endDate: this.INFO_SEARCH.endDate
                }
            })
        }
    }

    render() {
        var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
        var defaultEndDate = [month, year].join('-');
        var defaultStartDate = ['01', year].join('-');

        return (
            <React.Fragment>
                <section className="row">
                    <div className="col-xs-12">
                        <div className=" box box-primary">
                            <div className="box-header with-border">
                                <div class="box-title">Kết quả KPI cá nhân</div>
                            </div>
                            <div className="box-body qlcv">
                                <div className="form-inline">
                                    <div className="form-group">
                                        <label>Từ tháng</label>
                                        <DatePicker 
                                            id="monthStart"      
                                            dateFormat="month-year"             // sử dụng khi muốn hiện thị tháng - năm, mặc định là ngày-tháng-năm 
                                            value={defaultStartDate}                 // giá trị mặc định cho datePicker    
                                            onChange={this.handleSelectMonthStart}
                                            disabled={false}                    // sử dụng khi muốn disabled, mặc định là false
                                        />
                                    </div>
                                </div>
                                <div className="form-inline">
                                    <div className="form-group">
                                        <label>Đến tháng</label>
                                        <DatePicker 
                                            id="monthEnd"      
                                            dateFormat="month-year"             // sử dụng khi muốn hiện thị tháng - năm, mặc định là ngày-tháng-năm 
                                            value={defaultEndDate}                 // giá trị mặc định cho datePicker    
                                            onChange={this.handleSelectMonthEnd}
                                            disabled={false}                    // sử dụng khi muốn disabled, mặc định là false
                                        />
                                    </div>
                                    <div className="form-group">
                                        <button type="button" className="btn btn-success" onClick={this.handleSearchData}>Tìm kiếm</button>
                                    </div>
                                </div>
                                
                                <ResultsOfEmployeeKpiChart
                                    startDate={this.state.startDate}
                                    endDate={this.state.endDate}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-12">
                        <div className=" box box-primary">
                            <div className="box-header with-border">
                                <div class="box-title">Phân bố KPI cá nhân tháng {this.state.currentMonth}</div>
                            </div>
                            <div className="box-body">
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
    getEmployeeKpiSetByMember: managerKpiActions.getAllKPIPersonalByMember
};
const connectedDashBoardEmployeeKpiSet = connect(mapState, actionCreators)(DashBoardEmployeeKpiSet);
export { connectedDashBoardEmployeeKpiSet as DashBoardEmployeeKpiSet };
