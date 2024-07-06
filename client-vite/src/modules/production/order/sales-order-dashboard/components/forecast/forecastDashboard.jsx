import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { forecastActions } from '../../../forecast/redux/actions';
import Top5ProductsChart from './topForecast';
import Bottom5ProductsChart from './bottomForecast';
import InfoBoxForecast from './infoBoxForecast';
import ForecastChart from './salesForecastChart';

const formGroupStyle = {
    display: 'flex',
    alignItems: 'center'
};

const labelStyle = {
    marginRight: '30px', // Giảm khoảng cách giữa nhãn và phần tử select
    whiteSpace: 'nowrap' // Đảm bảo nhãn không bị xuống dòng
};

const selectStyle = {
    minWidth: '100px' // Đặt chiều rộng tối thiểu cho phần tử select
};

function ForecastDashboard(props) {
    const [timeFrame, setTimeFrame] = useState('1 Month');
    const [productLimit, setProductLimit] = useState(10);
    const currentRole = localStorage.getItem('currentRole'); // Lấy currentRole từ localStorage

    useEffect(() => {
        props.getAllForecasts(); // Gọi hàm getAllForecasts để lấy dữ liệu dự báo
        props.getTop5Products({ currentRole });
        props.getBottom5Products({ currentRole });
        props.countSalesForecast({ currentRole });
    }, [timeFrame, currentRole]); // Chạy lại khi timeFrame hoặc currentRole thay đổi

    return (
        <React.Fragment>
            <div className='qlcv'>
                <div className='form-inline' style={{ marginBottom: '10px' }}>
                    <div className='form-group' style={formGroupStyle}>
                        <label style={labelStyle}>Chọn khung thời gian: </label>
                        <select
                            onChange={(e) => setTimeFrame(e.target.value)}
                            value={timeFrame}
                            style={selectStyle}
                        >
                            <option value="1 Month">1 Month</option>
                            <option value="3 Months">3 Months</option>
                            <option value="6 Months">6 Months</option>
                        </select>
                    </div>
                    <div className='form-group' style={{ ...formGroupStyle, marginLeft: '20px' }}>
                        <label style={labelStyle}>Hiển thị số sản phẩm: </label>
                        <select
                            onChange={(e) => setProductLimit(Number(e.target.value))}
                            value={productLimit}
                            style={selectStyle}
                        >
                            <option value={10}>10</option>
                            <option value={100}>100</option>
                            <option value={props.forecasts.forecasts.length}>Tất cả</option>
                        </select>
                    </div>
                </div>

                <div className='row'>
                    <div className='col-xs-12'>
                        <InfoBoxForecast saleForecast={props.forecasts.countForecasts} timeFrame={timeFrame} />
                    </div>
                    <div className='col-xs-12'>
                        <ForecastChart forecasts={props.forecasts.forecasts} timeFrame={timeFrame} productLimit={productLimit} />
                    </div>
                    
                    <div className='col-xs-12'>
                        <div className='col-xs-6'>
                            <Top5ProductsChart timeFrame={timeFrame} />
                        </div>
                        <div className='col-xs-6'>
                            <Bottom5ProductsChart timeFrame={timeFrame} />
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

function mapStateToProps(state) {
    const { forecasts } = state;
    return { forecasts };
}

const mapDispatchToProps = {
    getAllForecasts: forecastActions.getAllForecasts, // Thêm hàm getAllForecasts vào mapDispatchToProps
    getTop5Products: forecastActions.getTop5Products,
    getBottom5Products: forecastActions.getBottom5Products,
    countSalesForecast: forecastActions.countSalesForecast
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ForecastDashboard));
