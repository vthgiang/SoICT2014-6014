import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { forecastActions } from '../redux/actions';

const InventoryForecastTable = () => {
    const dispatch = useDispatch();
    const forecasts = useSelector(state => state.forecasts.forecasts);
    const isLoading = useSelector(state => state.forecasts.isLoading);

    const [currentPage, setCurrentPage] = useState(1);
    const [forecastsPerPage, setForecastsPerPage] = useState(10);

    // Get current forecasts
    const indexOfLastForecast = currentPage * forecastsPerPage;
    const indexOfFirstForecast = indexOfLastForecast - forecastsPerPage;
    const currentForecasts = forecasts.slice(indexOfFirstForecast, indexOfLastForecast);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Handle change forecasts per page
    const handleChangeForecastsPerPage = (e) => {
        setForecastsPerPage(Number(e.target.value));
        setCurrentPage(1); // reset to the first page
    };

    // Handle forecast button click
    const handleForecastButtonClick = () => {
        dispatch(forecastActions.createForecast());
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="form-group">
                    <label htmlFor="forecastsPerPage">Số lượng sản phẩm: </label>
                    <select
                        id="forecastsPerPage"
                        value={forecastsPerPage}
                        onChange={handleChangeForecastsPerPage}
                        className="form-control"
                        style={{ width: 'auto', display: 'inline-block', marginLeft: '10px' }}
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
                </div>
                <button
                    className="btn btn-primary"
                    style={{ marginRight: '10px' }}
                    onClick={handleForecastButtonClick}
                >
                    Dự báo
                </button>
            </div>
            {isLoading ? (
                <p>Loading...</p>
            ) : forecasts.length > 0 ? (
                <div>
                    <table className='table table-striped table-bordered table-hover' style={{ marginTop: '15px' }}>
                        <thead>
                            <tr>
                                <th>Mã sản phẩm</th>
                                <th>Tên sản phẩm</th>
                                <th>Dự báo một tháng</th>
                                <th>Dự báo ba tháng</th>
                                <th>Dự báo sáu tháng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentForecasts.map(forecast => (
                                <tr key={forecast._id}>
                                    <td>{forecast.good ? forecast.good.code : 'N/A'}</td>
                                    <td>{forecast.good ? forecast.good.name : 'N/A'}</td>
                                    <td>{forecast.inventoryForecast}</td>
                                    <td>{forecast.forecastThreeMonth}</td>
                                    <td>{forecast.forecastSixMonth}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="pagination-wrapper" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Pagination
                            forecastsPerPage={forecastsPerPage}
                            totalForecasts={forecasts.length}
                            paginate={paginate}
                            currentPage={currentPage}
                        />
                    </div>
                </div>
            ) : (
                <p>No forecasts available.</p>
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

export default InventoryForecastTable;
