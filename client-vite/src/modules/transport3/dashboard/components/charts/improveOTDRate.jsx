import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { RequestActions } from '../../../../production/common-production/request-management/redux/actions';
import { ButtonModal, DatePicker, DialogModal, ErrorLabel, SelectBox } from '../../../../../common-components';
import { withRouter } from 'react-router-dom';
// import { DataTableSetting, DatePicker, PaginateBar, SelectBox, TreeSelect } from "../../../../../common-components";
// import { JourneyActions } from '../../tracking-route/redux/actions'

function ImproveOTDRate(props) {
    const [state, setState] = useState({
    });

    useEffect(() => {
        if (props.showModal) {
        }
    }, [props.showModal]);

    const handleShowModal = () => {
        props.setShowModal(true);
    }

    const { translate, bigModal } = props;

    const invetoryForecast = () => {
        props.history.push('/forecast-sales-order');
    };

    const routeOptimization = () => {
        props.history.push('/storage-management');
    };

    const followDeliverySchedule = () => {
        props.history.push('/manage-transport3-schedule');
    };

    const estimateOTD = () => {
        props.history.push('/manage-transport3-schedule');
    };

    return (
        <React.Fragment>
            <DialogModal
                modalID="modal-improve-OTD-rate"
                title="Gợi ý cách tăng tỉ lệ giao hàng đúng hạn"
                size={bigModal ? 75 : 50}
                maxWidth={900}
                handleShowModal
            >
                <div className="row">
                    <div className="col-md-12">
                        <div className="form-group">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>STT</th>
                                        <th>Nguyên nhân trễ hạn</th>
                                        <th>Cách khắc phục</th>
                                        <th>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>1</td>
                                        <td>Chưa dự báo được rủi ro giao hàng trễ hạn</td>
                                        <td>Dự báo trước các đơn hàng có khả năng trễ hạn để đưa ra quyết định kịp thời</td>
                                        <td>
                                            <button
                                                style={{backgroundColor: '#f0f0f0'}}
                                                onClick={()=>estimateOTD()}
                                            >
                                                Dự báo giao hàng trễ hạn
                                            </button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>2</td>
                                        <td>Không đủ lượng hàng tồn kho</td>
                                        <td>Xem dự báo và quản lý lượng hàng tồn kho</td>
                                        <td>
                                            <button
                                                style={{backgroundColor: '#f0f0f0'}}
                                                onClick={() => invetoryForecast()}
                                            >
                                                Dự báo lượng hàng tồn kho
                                            </button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>3</td>
                                        <td>Hàng tồn kho đặt sai vị trí/ chưa được tối ưu hóa</td>
                                        <td>Tối ưu hoá lộ trình trong kho</td>
                                        <td>
                                            <button
                                                style={{backgroundColor: '#f0f0f0'}}
                                                onClick={()=>routeOptimization()}
                                            >
                                                Tối ưu hoá lộ trình trong kho
                                            </button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>4</td>
                                        <td>Chưa có quy trình giám sát đơn hàng</td>
                                        <td>Theo dõi đơn hàng đang chờ xử lý theo ngày giao hàng để ưu tiên xử lý</td>
                                        <td>
                                            <button
                                                style={{backgroundColor: '#f0f0f0'}}
                                                onClick={()=>followDeliverySchedule()}
                                            >
                                                Theo dõi kế hoạch giao hàng
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </DialogModal>
        </React.Fragment >
    );
}

const mapStateToProps = (state) => {
};

export default connect(mapStateToProps)(withTranslate(withRouter(ImproveOTDRate)));
