import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal } from '../../../../common-components';
import { InformationForm } from '../../task-template/component/informationsTemplate';

class ModalEditInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    handleTaskInformationChange = (data) => {
        console.log('data', data);
        for(let i in data) {
            let code = "p" + (Number(i) + 1);
            data[i] = {
                ...data[i],
                code: code,
            }
        }
        console.log('new data', data);
        this.setState(state => {
            return {
                ...state,
                taskInformations: data
            }
        })
        this.props.onEditListInfo(data);
    }

    render() {
        let task;
        const { tasks } = this.props;
        const { taskInformation, type = "default" } = this.props;

        if (typeof tasks.task !== 'undefined' && tasks.task !== null) task = tasks.task;

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
                            onDataChange={this.handleTaskInformationChange} 
                            type={type}
                        />
                    </div>
                </DialogModal>
            </React.Fragment>
        );
    }
}

function mapState(state) {
    const { tasks } = state;
    return { tasks };
}

const actionDispatch = {}

const modalEditInfo = connect(mapState, actionDispatch)(withTranslate(ModalEditInfo));
export { modalEditInfo as ModalEditInfo }


