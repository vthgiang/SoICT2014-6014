import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DatePicker } from '../../../../../../common-components';

import { exampleDataSale } from '../../example-data/exampleDataSale';
import { KpiCard } from "./kpiCard";
import { ProfitAndCostChartChart } from './profitAndCostRatioChart';
import { RevenueChart } from './revenueChart';
import { RevenueSourceChart } from './revenueSourceChart';

const CEOKpiDashboard = () => {
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
                <a className="btn btn-success" href='/kpi-units/sales-dashboard'>KPI phòng kinh doanh</a>
            </div>
            <br />
            <div className="row">
                <div className="col-sm-3">
                    <KpiCard title={"Số đơn hàng"} target={200} currentValue={210} previousValue={189} />
                </div>
                <div className="col-sm-3">
                    <KpiCard title={"Doanh thu"} target={1000000} currentValue={600000} previousValue={900000} unit={"$"} />
                </div>
                <div className="col-sm-3">
                    <KpiCard title={"Lợi nhuận"} target={200000} currentValue={500000} previousValue={210000} unit={"$"} />
                </div>
                <div className="col-sm-3">
                    <KpiCard title={"Chi phí"} target={800000} currentValue={100000} previousValue={700000} unit={"$"} />
                </div>
            </div>
            <br></br>
            <div className="row">
                <div className="col-md-12">
                    <div className="box box-primary">
                        <div className="box-header with-border">
                            <div className="box-title">Doanh số bán hàng</div>
                        </div>
                        <RevenueChart data={exampleDataSale} />

                    </div>
                </div>
            </div>
            <div className='row'>
                <div className="col-md-7">
                    <div className="box box-primary">
                        <div className="box-header with-border">
                            <div className="box-title">Nguồn thu nhập</div>
                        </div>
                        {saleData ?
                            <RevenueSourceChart data={saleData} />
                            : <div>Không có dữ liệu</div>
                        }
                    </div>
                </div>
                <div className="col-md-5">
                    <div className="box box-primary">
                        <div className="box-header with-border">
                            <div className="box-title">Tỉ lệ lợi nhuận và chi phí</div>
                        </div>
                        {saleData ?
                            <ProfitAndCostChartChart data={saleData} />
                            : <div>Không có dữ liệu</div>
                        }
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

const connectedCEOKpiDashboard = connect(mapState, actions)(withTranslate(CEOKpiDashboard));
export { connectedCEOKpiDashboard as CEOKpiDashboard };
