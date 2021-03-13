import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import moment from 'moment';

import { DialogModal } from '../../../../common-components';
import { convertTime } from '../../../../helpers/stringMethod';

class InforTimeSheetLog extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    convertType = (value) => {
        // 1: Tắt bấm giờ bằng tay, 2: Tắt bấm giờ tự động với thời gian hẹn trc, 3: add log timer
        if (value == 1) {
            return "Bấm giờ tự chọn"
        } else if (value == 2) {
            return "Bấm giờ tự động"
        } else {
            return "Bấm giờ tự tắt"
        }
    }
    render() {
        const { translate } = this.props;
        const { timesheetlogs } = this.props
        return (
            <React.Fragment>
                <DialogModal
                    size='50' modalID="modal-infor-time-sheet-log"
                    formID="modal-infor-time-sheet-log"
                    title={`Thống kê bấm giờ ${this.props.data.name}`}
                    hasSaveButton={false}
                >
                    <div className="description-box">
                        <div><strong>Tổng thời gian:</strong>{convertTime(this.props.data.totalhours)}</div>
                        <div><strong>Bấm bù giờ:</strong> {convertTime(this.props.data.manualtimer)}</div>
                        <div><strong>Bấm hẹn giờ:</strong> {convertTime(this.props.data.autotimer)}</div>
                        <div><strong>Bấm giờ:</strong> {convertTime(this.props.data.logtimer)}</div>
                    </div>
                    <table className="table table-hover table-striped table-bordered" id="table-user-timesheetlogs">
                        <thead>
                            <tr>
                                <th style={{ width: 80 }}>STT</th>
                                <th>Tên công việc</th>
                                <th>Thời gian bắt đầu</th>
                                <th>Thời gian kết thúc</th>
                                <th>Loại bấm giờ</th>
                                <th className="col-sort">Bấm giờ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                timesheetlogs && timesheetlogs.length ? timesheetlogs.map((tsl, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td><a href={`/task?taskId=${tsl.taskId}`} target="_blank">{tsl.taskName}</a></td>
                                            <td>{moment(tsl.startedAt).format("HH:mm:ss DD/MM/YYYY")}</td>
                                            <td>{moment(tsl.stoppedAt).format("HH:mm:ss DD/MM/YYYY")}</td>
                                            <td>{this.convertType(tsl.autoStopped)}</td>
                                            <td>{convertTime(tsl.duration)}</td>
                                        </tr>
                                    )
                                }) : ""
                            }
                        </tbody>
                    </table>

                </DialogModal>
            </React.Fragment>
        )
    }
};


const inforTimeSheetLog = connect(null, null)(withTranslate(InforTimeSheetLog));
export { inforTimeSheetLog as InforTimeSheetLog };
