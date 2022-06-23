import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DatePicker } from '../../../../../../common-components';

import { exampleDataSale } from '../../example-data/exampleDataSale';
import { KpiCard } from '../monitoring-dashboard/kpiCard';
import { CompleteTargetKpiRatioChart } from './completeTargetKpiRatioChart';
import { EmployeeResultChart } from './employeeResultChart';
import { ForecastKpiChart } from './forecastKpiChart';

const SaleKpiDashboard = () => {
    const [month, setMonth] = useState(() => {
        const d = new Date();
        const month = d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1}` : d.getMonth() + 1
        return `${month}-${d.getFullYear()}`
    });

    const [saleData, setSaleData] = useState();

    const handleSelectMonth = (value) => {
        setMonth(value)
    }

    const handleSearchData = () => {
        const dataOfMonth = exampleDataSale.filter(x => x.date === month);
        setSaleData(dataOfMonth[0]);
    }

    useEffect(() => {
        const dataOfMonth = exampleDataSale.filter(x => x.date === month);
        console.log(35, dataOfMonth)
        setSaleData(dataOfMonth[0]);
    }, [])


    return <React.Fragment>
        <div className='qlcv'>
            <div className='form-inline'>
                <div className="form-group">
                    <label style={{ width: "auto" }}>Tháng</label>
                    <DatePicker
                        id="monthInOrganizationalUnitKpiDashboard"
                        dateFormat="month-year"
                        value={month}
                        onChange={handleSelectMonth}
                        disabled={false}
                    />
                </div>

                <button type="button" className="btn btn-success" onClick={() => handleSearchData()}>Phân tích</button>
                <button type="button" className="btn btn-primary" onClick={() => handleSearchData()}>Thiết lập KPI nhân viên tự động</button>
            </div>
            <br />
            <div className='row'>
                <div className="col-sm-2">
                    <div className="card"
                        style={{ 'backgroundColor': '#FFFFFF', 'borderRadius': 2, "boxShadow": "0 4px 8px 0 rgba(0, 0, 0, 0.2)", 'padding': 10 }}
                    >
                        <div className="card-body">
                            <div className="card-title" style={{ "fontWeight": 600, 'fontSize': 18, textAlign: 'center' }}>Số mục tiêu</div>
                            <p className="card-text text-info" style={{ "fontWeight": 600, 'fontSize': 24, textAlign: 'center' }}>
                                4
                            </p>
                        </div>
                    </div>
                </div>
                <div className="col-sm-10">
                    <div className="row">
                        <div className='col-sm-3'>
                            <KpiCard title={"Số đơn hàng"} target={200} currentValue={210} previousValue={189} />
                            <br />
                        </div>
                        <div className='col-sm-3'>
                            <KpiCard title={"Doanh thu"} target={1000000} currentValue={600000} previousValue={900000} unit={"$"} />
                            <br /></div>
                        <div className='col-sm-3'>
                            <KpiCard title={"Lợi nhuận"} target={200000} currentValue={500000} previousValue={210000} unit={"$"} />
                            <br /></div>
                        <div className='col-sm-3'>
                            <KpiCard title={"Chi phí"} target={800000} currentValue={100000} previousValue={700000} unit={"$"} />
                            <br />
                        </div>
                    </div>
                </div>
            </div>
            <br />
            <div className="row">
                <div className="col-md-12">
                    <div className="box box-primary">
                        <div className="box-header with-border">
                            <div className="box-title">Điểm KPI theo tháng</div>
                        </div>
                        <ForecastKpiChart />

                    </div>
                </div>
            </div>
            <div className='row'>
                <div className="col-md-7">
                    <div className="box box-primary">
                        <div className="box-header with-border">
                            <div className="box-title">Đóng góp nhân viên</div>
                        </div>
                        {/* {saleData ? */}
                        <EmployeeResultChart />
                        {/* : <div>Không có dữ liệu</div> */}

                    </div>
                </div>
                <div className="col-md-5">
                    <div className="box box-primary">
                        <div className="box-header with-border">
                            <div className="box-title">Tỉ lệ hoàn thành tiêu chí KPI</div>
                        </div>
                        <CompleteTargetKpiRatioChart />
                    </div>
                </div>
            </div>
        </div>

    </React.Fragment>
}

function mapState(state) {
    const { dashboardEvaluationEmployeeKpiSet, createKpiUnit } = state;
    return { dashboardEvaluationEmployeeKpiSet, createKpiUnit };
}

const actions = {
}

const connectedSaleKpiDashboard = connect(mapState, actions)(withTranslate(SaleKpiDashboard));
export default connectedSaleKpiDashboard;
