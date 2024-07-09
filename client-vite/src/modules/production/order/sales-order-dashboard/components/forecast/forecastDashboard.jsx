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
    alignItems: 'center',
    width: '100%' 
};

const labelStyle = {
    marginRight: '30px', // Giảm khoảng cách giữa nhãn và phần tử select
    whiteSpace: 'nowrap' // Đảm bảo nhãn không bị xuống dòng
};

const selectStyle = {
    minWidth: '100px', // Đặt chiều rộng tối thiểu cho phần tử select
    marginLeft: '5px' // Dịch sang phải 5px
};

const buttonStyle = {
    backgroundColor: 'green',
    color: 'white',
    padding: '10px 20px', // Điều chỉnh padding
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    textDecoration: 'none', // Đảm bảo không có gạch chân dưới văn bản
    marginLeft: '10px',
    marginRight: '5px', // Điều chỉnh khoảng cách giữa nút và phần tử khác
    marginTop: '5px',
    marginBottom: '5px',
    whiteSpace: 'nowrap' // Đảm bảo văn bản không bị xuống dòng
};

function ForecastDashboard(props) {
    const [timeFrame, setTimeFrame] = useState('1 Month');
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
                <div className='form-inline' style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div className='form-group' style={formGroupStyle}>
                        <label style={labelStyle}>Chọn khung thời gian: </label>
                        <select
                            onChange={(e) => setTimeFrame(e.target.value)}
                            value={timeFrame}
                            style={selectStyle}
                        >
                            <option value="1 Month">1 Tháng</option>
                            <option value="3 Months">3 Tháng</option>
                            <option value="6 Months">6 Tháng</option>
                        </select>
                    </div>
                    <a href='/forecast-sales-order' style={buttonStyle}>Điều chỉnh dự báo</a>
                </div>

                <div className='row'>
                    <InfoBoxForecast saleForecast={props.forecasts.countForecasts} timeFrame={timeFrame} />
                    
                    <div className='col-xs-12'>
                        <ForecastChart forecasts={props.forecasts.forecasts} timeFrame={timeFrame} />
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
