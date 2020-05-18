import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

class RepairTab extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                repairUpgrade: nextProps.repairUpgrade
            }
        } else {
            return null;
        }
    }


    render() {
        const { id, translate } = this.props;
        const {  repairUpgrade } = this.state;

        return (
            <div id={id} className="tab-pane">
                <div className="box-body qlcv">
                    
                    <div className="form-group">
                        <h5 className="box-title">Lịch sử sửa chữa - thay thế - nâng cấp: </h5>
                    </div>
                    <table className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>Mã phiếu</th>
                                <th>Ngày lập</th>
                                <th>Phân loại</th>
                                <th>Ngày thực hiện</th>
                                {/* <th>Ngày hoàn thành</th> */}
                                <th>Nội dung</th>
                                <th>Chi phí</th>
                                <th>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(typeof repairUpgrade !== 'undefined' && repairUpgrade.length !== 0) &&
                                repairUpgrade.map((x, index) => (
                                    <tr key={index}>
                                        <td>{x.repairNumber}</td>
                                        <td>{x.dateCreate}</td>
                                        <td>{x.type}</td>
                                        <td>{x.repairDate}</td>
                                        {/* <td>{x.completeDate}</td> */}
                                        <td>{x.reason}</td>
                                        <td>{x.cost}</td>
                                        <td>{x.status}</td>
                                    </tr>))
                            }
                        </tbody>
                    </table>
                    {
                        (typeof repairUpgrade === 'undefined' || repairUpgrade.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }
                </div>
            </div>
        );
    }
};

const tabRepair = connect(null, null)(withTranslate(RepairTab));
export { tabRepair as RepairTab };