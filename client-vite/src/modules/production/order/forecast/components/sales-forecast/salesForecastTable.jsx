import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { forecastActions } from '../../redux/actions';

const SalesForecastTable = () => {
    const dispatch = useDispatch();
    const forecasts = useSelector(state => state.forecasts.forecasts);
    const isLoading = useSelector(state => state.forecasts.isLoading);
    const error = useSelector(state => state.forecasts.error);

    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        dispatch(forecastActions.getAllForecasts());
    }, [dispatch]);

    const handleForecastButtonClick = () => {
        dispatch(forecastActions.createForecast());
    };

    const handleStatusFilterChange = (e) => {
        setStatusFilter(e.target.value);
        setCurrentPage(1);
    };

    const forecastsPerPage = 10;
    const filteredForecasts = statusFilter
        ? forecasts.filter(forecast => {
            const status = forecast.totalForecastOrders < 20 ? 'Cần tiếp thị' : (forecast.totalForecastOrders > 160 ? 'Ưu tiên sản xuất' : 'Bình thường');
            return status === statusFilter;
        })
        : forecasts;
    const indexOfLastForecast = currentPage * forecastsPerPage;
    const indexOfFirstForecast = indexOfLastForecast - forecastsPerPage;
    const currentForecasts = filteredForecasts.slice(indexOfFirstForecast, indexOfFirstForecast + forecastsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '20px 20px 10px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <label style={{ marginRight: '10px' }}>Trạng thái:</label>
                    <select
                        value={statusFilter}
                        onChange={handleStatusFilterChange}
                        style={{
                            padding: '5px',
                            borderColor: '#ced4da',
                            borderRadius: '4px',
                            borderWidth: '1px',
                            borderStyle: 'solid',
                        }}
                    >
                        <option value=''>Tất cả</option>
                        <option value='Bình thường'>Bình thường</option>
                        <option value='Ưu tiên sản xuất'>Ưu tiên sản xuất</option>
                        <option value='Cần tiếp thị'>Cần tiếp thị</option>
                    </select>
                </div>
                <button
                    className="btn btn-primary"
                    style={{
                        backgroundColor: '#28a745',
                        borderColor: '#28a745',
                        padding: '10px 20px',
                        whiteSpace: 'nowrap'
                    }}
                    onClick={handleForecastButtonClick}
                >
                    Dự báo
                </button>
            </div>
            {error ? (
                <p>Error: {error}</p>
            ) : (
                <div>
                    <table id='forecast-table' className='table table-striped table-bordered table-hover' style={{ marginTop: '15px' }}>
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
                            {isLoading ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center' }}>Đang tải dữ liệu...</td>
                                </tr>
                            ) : (
                                currentForecasts.length > 0 ? (
                                    currentForecasts.map(forecast => {
                                        const status = forecast.totalForecastOrders < 20 ? 'Cần tiếp thị' : (forecast.totalForecastOrders > 160 ? 'Ưu tiên sản xuất' : 'Bình thường');
                                        return (
                                            <tr key={forecast.goodId}>
                                                <td>{forecast.goodCode || 'N/A'}</td>
                                                <td>{forecast.goodName || 'N/A'}</td>
                                                <td>{forecast.totalForecastOrders}</td>
                                                <td>{forecast.totalForecastThreeMonth}</td>
                                                <td>{forecast.totalForecastSixMonth}</td>
                                                <td>{status}</td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center' }}>Không có dữ liệu.</td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                    <div className="pagination-wrapper" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                        <Pagination
                            forecastsPerPage={forecastsPerPage}
                            totalForecasts={filteredForecasts.length}
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
