import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { forecastActions } from '../../redux/actions';

const SalesForecastTable = () => {
    const dispatch = useDispatch();
    const forecasts = useSelector(state => state.forecasts.forecasts);
    const isLoading = useSelector(state => state.forecasts.isLoading);
    const error = useSelector(state => state.forecasts.error);

    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Gọi API để lấy dữ liệu dự báo khi trang tải
        dispatch(forecastActions.getAllForecasts());
    }, [dispatch]);

    const handleForecastButtonClick = () => {
        setLoading(true);
        dispatch(forecastActions.createForecast()).finally(() => {
            setLoading(false);
        });
    };

    // Get current forecasts
    const forecastsPerPage = 10; // Mặc định 10 sản phẩm trên mỗi trang
    const indexOfLastForecast = currentPage * forecastsPerPage;
    const indexOfFirstForecast = indexOfLastForecast - forecastsPerPage;
    const currentForecasts = forecasts.slice(indexOfFirstForecast, indexOfFirstForecast + forecastsPerPage);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px', paddingRight: '20px' }}>
                <button
                    className="btn btn-primary"
                    style={{ backgroundColor: '#28a745', borderColor: '#28a745', marginLeft: '10px' }}
                    onClick={handleForecastButtonClick}
                >
                    Dự báo
                </button>
            </div>
            {error ? (
                <p>Error: {error}</p>
            ) : (
                <div>
                    <table className='table table-striped table-bordered table-hover' style={{ marginTop: '15px' }}>
                        <thead>
                            <tr>
                                <th>Mã sản phẩm</th>
                                <th>Tên sản phẩm</th>
                                <th>Dự báo một tháng</th>
                                <th>Dự báo ba tháng</th>
                                <th>Dự báo sáu tháng</th>
                                <th>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center' }}>Đang tải dữ liệu...</td>
                                </tr>
                            ) : (
                                currentForecasts.length > 0 ? (
                                    currentForecasts.map(forecast => (
                                        <tr key={forecast.goodId}>
                                            <td>{forecast.goodCode || 'N/A'}</td>
                                            <td>{forecast.goodName || 'N/A'}</td>
                                            <td>{forecast.totalForecastOrders}</td>
                                            <td>{forecast.totalForecastThreeMonth}</td>
                                            <td>{forecast.totalForecastSixMonth}</td>
                                            <td>{forecast.totalForecastOrders > 100 ? 'Ưu tiên sản xuất' : ''}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center' }}>No forecasts available.</td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                    <div className="pagination-wrapper" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                        <Pagination
                            forecastsPerPage={forecastsPerPage}
                            totalForecasts={forecasts.length}
                            paginate={paginate}
                            currentPage={currentPage}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

const Pagination = ({ forecastsPerPage, totalForecasts, paginate, currentPage }) => {
    const pageNumbers = [];
    const maxPageNumbersToShow = 5;
    const totalPages = Math.ceil(totalForecasts / forecastsPerPage);

    const startPage = Math.max(1, currentPage - Math.floor(maxPageNumbersToShow / 2));
    const endPage = Math.min(totalPages, currentPage + Math.floor(maxPageNumbersToShow / 2));

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    const shouldShowLeftEllipsis = startPage > 1;
    const shouldShowRightEllipsis = endPage < totalPages;

    return (
        <nav>
            <ul className='pagination' style={{ justifyContent: 'flex-end' }}>
                {shouldShowLeftEllipsis && (
                    <>
                        <li className={`page-item ${currentPage === 1 ? 'active' : ''}`}>
                            <a onClick={() => paginate(1)} className='page-link'>1</a>
                        </li>
                        {startPage > 2 && <li className='page-item disabled'><span className='page-link'>...</span></li>}
                    </>
                )}
                {pageNumbers.map(number => (
                    <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                        <a onClick={() => paginate(number)} className='page-link'>
                            {number}
                        </a>
                    </li>
                ))}
                {shouldShowRightEllipsis && (
                    <>
                        {endPage < totalPages - 1 && <li className='page-item disabled'><span className='page-link'>...</span></li>}
                        <li className={`page-item ${currentPage === totalPages ? 'active' : ''}`}>
                            <a onClick={() => paginate(totalPages)} className='page-link'>{totalPages}</a>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default SalesForecastTable;
