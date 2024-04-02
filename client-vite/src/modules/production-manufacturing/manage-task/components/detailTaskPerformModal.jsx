import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal } from '../../../../common-components';

import { DetailTaskManufacturing } from './detailTaskManufacturing';

const DetailTaskPerformModal = (props) => {

    let task;
    const { tasks, units } = props; 
    
    if (typeof tasks.task !== 'undefined' && tasks.task !== null) task = tasks.task;
    return (
        <React.Fragment>
            <DialogModal
                size="100"
                modalID={`detail-task-perform-manufacturing`}
                formID="detail-task-perform-manufacturing"
                title={"Thông tin tiến độ công việc"}
                bodyStyle={{ padding: "0px" }}
                hasSaveButton={false}
            >
                <DetailTaskManufacturing/>
            </DialogModal>
        </React.Fragment>
    )
}

const mapStateToProps = (state) => {
    const { tasks } = state;
    return { tasks };
}

const mapDispatchToProps = {

}

const connectDetailTaskPerformModal = connect(mapStateToProps, mapDispatchToProps)(withTranslate(DetailTaskPerformModal))
export { connectDetailTaskPerformModal as DetailTaskPerformModal }