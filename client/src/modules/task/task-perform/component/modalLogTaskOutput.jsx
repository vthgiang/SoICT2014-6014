import React, { Component, useState, useEffect } from 'react';
import { ContentMaker, DateTimeConverter, DialogModal } from '../../../../common-components';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import parse from 'html-react-parser';

function ModalLogTaskOutput(props) {
    const { taskOutput } = props;
    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-log-task-output-${taskOutput?._id}`}
                title={`Lịch sử thay đổi ${taskOutput?.title}`}
                formID={`detail-output`}
                size={50}
                maxWidth={600}
                hasSaveButton={false}
                hasNote={false}
            >
                <div>
                    {taskOutput?.submissionResults.logs.map((x, index) => {
                        return (
                            <div key={x._id} className={index > 3 ? "hide-component" : ""}>
                                <div className='item-box'>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <div><i><a style={{ fontWeight: 'bold' }}>{x.creator?.name}</a> {x.action}</i></div>
                                        <span className="text-sm">{<DateTimeConverter dateTime={x.createdAt} />}</span>
                                    </div>
                                    <div>{parse(x.description ? x.description : "")}</div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </DialogModal >
        </React.Fragment >
    );
}

function mapState(state) {
    const { performtasks, tasks, auth } = state;
    return { performtasks, tasks, auth };
}

const actionCreators = {
};

const connectedTaskOutputs = connect(mapState, actionCreators)(withTranslate(ModalLogTaskOutput));

export { connectedTaskOutputs as ModalLogTaskOutput };
