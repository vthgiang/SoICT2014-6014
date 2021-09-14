import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, QuillEditor } from '../../../../common-components';
import { AnnualLeaveActions } from '../redux/actions';
import dayjs from 'dayjs';

function RequestToChangeAnnualLeave(props) {
    const { id, data } = props;
    const [description, setDescription] = useState("")


    const handleChange = (value) => {
        setDescription(value);
    }

    const save = () => {
        props.requestToChangeAnnuaLeave(id, { description })
    }


    const note = <p className="text-left"> <span className="text-red">Thông tin sẽ được gửi thông báo tới người quản lý</span></p>;
    return (
        <DialogModal
            modalID={`modal-request-to-change-annualLeave-${id}`} isLoading={false}
            title={`Yêu cầu sửa đổi thông tin nghỉ phép`}
            hasNote={true}
            note={note}
            func={save}
        >
            <div className="form-group" style={{ marginBottom: '10px' }}>
                <label style={{ marginRight: '5px' }}>Thông tin đơn nghỉ</label>
                <ul>
                    <li>{`Thời gian nghỉ từ : ${data.startTime} ${dayjs(data.startDate).format("DD-MM-YYYY")} đến ${data.endTime} ${dayjs(data.endDate).format("DD-MM-YYYY")}`}</li>
                    <li>{`Lý do : ${data?.reason}`}</li>
                </ul>
            </div>
            <div className="form-group">
                <label style={{ marginRight: '5px' }}>Lý do và thông tin muốn sửa đổi</label>
                <QuillEditor
                    id={`quill-request-change-annualLeave-${id}`}
                    toolbar={false}
                    getTextData={handleChange}
                    maxHeight={150}
                />
            </div>

        </DialogModal>
    )
}

const actionCreators = {
    requestToChangeAnnuaLeave: AnnualLeaveActions.requestToChangeAnnuaLeave,
};

export default connect(null, actionCreators)(withTranslate(RequestToChangeAnnualLeave))