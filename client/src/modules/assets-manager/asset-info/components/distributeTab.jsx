import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

class DistributeTab extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                distributeTransfer: nextProps.distributeTransfer,
            }
        } else {
            return null;
        }
    }


    render() {
        const { id, translate } = this.props;
        const {  distributeTransfer } = this.state;

        return (
            <div id={id} className="tab-pane">
                <div className="box-body qlcv">

                    <div className="form-group">
                        <h5 className="box-title">Lịch sử cấp phát - điều chuyển - thu hồi:</h5>
                    </div>
                    <table className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>Mã phiếu</th>
                                <th>Ngày lập</th>
                                <th>Phân loại</th>
                                <th>Người bàn giao</th>
                                <th>Người tiếp nhận</th>
                                <th>Vị trí tài sản</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(typeof distributeTransfer !== 'undefined' && distributeTransfer.length !== 0) &&
                                distributeTransfer.map((x, index) => (
                                    <tr key={index}>
                                        <td>{x.distributeNumber}</td>
                                        <td>{x.dateCreate}</td>
                                        <td>{x.type}</td>
                                        <td>{x.handoverMan}</td>
                                        <td>{x.receiver}</td>
                                        <td>{x.nextlocation}</td>
                                    </tr>))
                            }
                        </tbody>
                    </table>
                    {
                        (typeof distributeTransfer === 'undefined' || distributeTransfer.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }
                </div>
            </div>
        );
    }
};

const tabDistribute = connect(null, null)(withTranslate(DistributeTab));
export { tabDistribute as DistributeTab };