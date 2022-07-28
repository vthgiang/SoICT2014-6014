import React from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ToolTip } from '../../../../../common-components';

const formatDate = (date) => {
    const d = new Date(date);
    let m = d.getMonth() + 1;
    let y = d.getFullYear();

    if (m < 10) {
        return `0${m}-${y}`
    } else {
        return `${m}-${y}`
    }
}

const ModalViewUsedLog = (props) => {

    const { kpiTemplate } = props;

    return (
        <React.Fragment>
            <DialogModal
                size='50' modalID="modal-view-used-log-kpi-template" isLoading={false}
                formID="form-view-used-log-kpi-template"
                title={`Lịch sử sử dụng ${kpiTemplate.name}`}
                hasSaveButton={false}
            >
                <div className="row" style={{ padding: "0 20px" }}>
                    {
                        kpiTemplate?.kpiSet.length === 0 ? <h4>Mẫu KPI này chưa được sử dụng lần nào</h4> :
                            <div>
                                {/**Table chứa các mục tiêu sẵn có*/}
                                <table className="table table-hover table-striped table-bordered">
                                    <thead>
                                        <tr>
                                            <th style={{ width: '50px' }} className="col-fixed">STT</th>
                                            <th title="Tháng">Tháng</th>
                                            <th title="Đơn vị sử dụng">Đơn vị sử dụng</th>
                                            <th title="Kết quả">Kết quả</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {kpiTemplate?.kpiSet.map((item, index) =>
                                            <tr className="" key={`_${index}`}>
                                                <td >{index + 1}</td>
                                                <td>{formatDate(item?.date)}</td>
                                                <td>{item?.organizationalUnit.name}</td>
                                                <td>
                                                    <ToolTip
                                                        type={'text_tooltip'}
                                                        dataTooltip={`Điểm tự động - Điểm tự đánh giá - Điểm người phê duyệt đánh giá`}
                                                    >
                                                        <span>
                                                            <span>{item?.automaticPoint !== null && item?.automaticPoint >= 0 ? item.automaticPoint : "Chưa đánh giá"} - </span>
                                                            <span>{item?.employeePoint !== null && item?.employeePoint >= 0 ? item.employeePoint : "Chưa đánh giá"} - </span>
                                                            <span>{item?.approvedPoint !== null && item?.approvedPoint >= 0 ? item.approvedPoint : "Chưa đánh giá"}</span>
                                                        </span>
                                                    </ToolTip>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>

                                </table>
                            </div>
                    }

                </div>
            </DialogModal>
        </React.Fragment>
    );
}

function mapState(state) {
}

const actionCreators = {
};

const connectedModalViewUsedLog = connect(mapState, actionCreators)(withTranslate(ModalViewUsedLog));
export { connectedModalViewUsedLog as ModalViewUsedLog };
