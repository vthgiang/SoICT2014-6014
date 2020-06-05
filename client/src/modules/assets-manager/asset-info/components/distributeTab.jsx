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
        const { id, translate, user } = this.props;
        const { distributeTransfer } = this.state;
        console.log('this.state', this.state);
        return (
            <div id={id} className="tab-pane">
                <div className="box-body qlcv">
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border"><h4 className="box-title">Lịch sử cấp phát - điều chuyển - thu hồi</h4></legend>
                        <table className="table table-striped table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th>Mã phiếu</th>
                                    <th>Ngày lập</th>
                                    <th>Phân loại</th>
                                    <th>Địa điểm bàn giao</th>
                                    <th>Người bàn giao</th>
                                    <th>Người tiếp nhận</th>
                                    <th>Thời gian sử dụng từ ngày</th>
                                    <th>Thời gian sử dụng đến ngày</th>
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
                                            <td>{x.place}</td>
                                            <td>{x.handoverMan !== null ? user.list.filter(item => item._id === x.handoverMan).pop().name : ''}</td>
                                            <td>{x.receiver !== null ? user.list.filter(item => item._id === x.receiver).pop().name : ''}</td>
                                            <td>{x.dateStartUse}</td>
                                            <td>{x.dateEndUse}</td>
                                            {/* <td>{x.nowLocation}</td> */}
                                            <td>{x.nextLocation}</td>
                                        </tr>
                                    )
                                    )
                                }
                            </tbody>
                        </table>
                        {
                            (typeof distributeTransfer === 'undefined' || distributeTransfer.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                        }
                    </fieldset>
                </div>
            </div>
        );
    }
};

const tabDistribute = connect((state) => ({ user: state.user }), null)(withTranslate(DistributeTab));
export { tabDistribute as DistributeTab };