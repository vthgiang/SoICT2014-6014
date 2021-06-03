import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal } from '../../../../common-components';
import { InformationForm } from '../../task-template/component/informationsTemplate';

function ModalEditInfo(props) {
    const { tasks } = props;
    const { taskInformation, type = "default" } = props;
    const [state, setState] = useState({})

    const handleTaskInformationChange = (data) => {
        console.log('data', data);
        for (let i in data) {
            let code = "p" + (Number(i) + 1);
            data[i] = {
                ...data[i],
                code: code,
            }
        }
        console.log('new data', data);
        setState({
            ...state,
            taskInformations: data
        })
        props.onEditListInfo(data);
    }
    let task;
    if (typeof tasks.task !== 'undefined' && tasks.task !== null) {
        task = tasks.task;
    }

    return (
        <React.Fragment>
            <DialogModal
                size="75"
                modalID={`modelEditInfo`}
                formID="form-edit-info"
                title={"Chỉnh sửa thông tin"}
                hasSaveButton={false}
            >
                <div>
                    <InformationForm
                        isEdit={true}
                        initialData={taskInformation}
                        onDataChange={handleTaskInformationChange}
                        type={type}
                    />
                </div>
            </DialogModal>
        </React.Fragment>
    );
}


function mapState(state) {
    const { tasks } = state;
    return { tasks };
}

const actionDispatch = {}

const modalEditInfo = connect(mapState, actionDispatch)(withTranslate(ModalEditInfo));
export { modalEditInfo as ModalEditInfo }


