import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import OutputDetail from './modalDetailOutput';
import parse from 'html-react-parser';
import { getStorage } from '../../../../config';
import { ContentMaker, SelectBox } from '../../../../common-components';
import './taskOutputs.css';
import { performTaskAction } from '../redux/actions';

const formatTypeInfo = (value) => {
    switch (value) {
        case 0:
            return "Văn bản";
            break;
        case 1:
            return "Tập tin";
            break;
        default:
            return "";
            break;
    }

}

function TaskOutputsTab(props) {
    const { tasks, auth } = props;
    const idUser = getStorage("userId");
    console.log(tasks.task)
    const [state, setState] = useState(() => {
        return {
            newAction: {
                creator: idUser,
                description: "",
                files: [],
                descriptionsDefault: "22"
            }
        }
    })
    const { newAction } = state;

    const onActionFilesChange = (files) => {
        setState({
            ...state,
            newAction: {
                ...state.newAction,
                files: files,
            }
        })
    }

    const onFilesError = (error, file) => {
    }

    const submitAction = (taskOutputId, taskId, index, type) => {
        let { newAction } = state;

        const data = new FormData();
        console.log(59, type)

        data.append("creator", newAction.creator);
        data.append("description", newAction.description);
        data.append("expectedResult", taskOutputId);
        data.append("index", index)
        newAction.files && newAction.files.forEach(x => {
            data.append("files", x);
        })
        if (newAction.creator) {
            console.log(69)
            if (type === 0) {
                props.createTaskOutputs(taskId, data);
                console.log(71)
            }
            if (type === 1 && newAction.files.length > 0) {
                props.createTaskOutputs(taskId, data);
                console.log(75)
            }
            // props.createTaskAction(taskId, data);
        }
        console.log(77)
        // Reset state cho việc thêm mới action
        setState({
            ...state,
            filePaste: [],
            newAction: {
                ...state.newAction,
                description: "",
                files: [],
                descriptionDefault: ''
            },
        })
    }

    const handleShowDetailLot = async () => {
        // await setState({
        //     ...state,
        //     lotDetail: lot
        // });

        window.$('#modal-detail-output').modal('show');
    }
    if (!tasks?.task?.taskOutputs) {
        return <div>Chưa có thông tin</div>
    }
    return (
        <div>
            <OutputDetail />
            <div>
                {/* Kết quả */}
                {tasks.task.taskOutputs.map((item, index) => {
                    return (
                        <div className="faqs-page block ">
                            <div className="panel-group" id="accordion-notevaluation" role="tablist" aria-multiselectable="true" style={{ marginBottom: 0 }}>
                                <div className="panel panel-default" style={{ padding: "8px" }} key={index}>
                                    <span role="button" className="item-question collapsed" data-toggle="collapse" data-parent="#accordion-notevaluation" href={`#collapse-notevaluation${index}`} aria-expanded="true" aria-controls="collapse1a">
                                        <>
                                            <i className="fa fa-angle-right angle-right-custom" aria-hidden="true" style={{ marginLeft: "5px", marginRight: "5px" }}></i>
                                            <a className="task-project-name" title="dự án">{item.title}</a>
                                        </>
                                    </span>
                                    <div id={`collapse-notevaluation${index}`} className="panel-collapse collapse" role="tabpanel">
                                        <div className="panel-body">
                                            {/* phê duyệt */}
                                            <div className='form-group' style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <div>
                                                    <div className='' style={{ color: "rgba(146, 64, 14)", backgroundColor: "rgba(253, 230, 138)", padding: "5px" }}>
                                                        Đang chờ phê duyệt
                                                    </div>
                                                </div>


                                                <div className="form-group">
                                                    <SelectBox
                                                        id={`status`}
                                                        className="form-control select2"
                                                        style={{ width: "100%", padding: '2px', marginRight: '5px' }}
                                                        value={'approved'}
                                                        items={[
                                                            { value: 'approved', text: 'Phê duyệt' },
                                                            { value: 'waiting_for_approval', text: "Chờ phê duyệt" },
                                                            { value: 'disapproved', text: "Từ chối" },
                                                        ]}
                                                    // onChange={handleStatusChange}
                                                    />
                                                </div>
                                            </div>

                                            <div className="time-todo-range" style={{ marginBottom: "5px" }}>
                                                <span style={{ marginRight: '10px' }}><strong>Mô tả:</strong> {parse(item.description)}</span>
                                            </div>
                                            <div style={{ marginBottom: "5px" }}>
                                                <span style={{ marginRight: '10px' }}><strong>Kiểu dữ liệu:</strong> {formatTypeInfo(item.type)}</span>
                                            </div>
                                            <div style={{ marginBottom: "5px" }}>
                                                <span style={{ marginRight: '10px' }}><strong>Người đã phê duyệt:</strong> Chưa có người phê duyệt</span>
                                            </div>
                                            <div style={{ marginBottom: "5px" }}>
                                                <div>
                                                    <strong>Đã giao nộp:</strong>
                                                </div>
                                                <React.Fragment>

                                                    <div style={{ marginTop: '15px' }}>
                                                        <img className="user-img-level1" src={(process.env.REACT_APP_SERVER + auth.user.avatar)} alt="user avatar" />
                                                        <ContentMaker
                                                            idQuill={`add-comment-action`}
                                                            // imageDropAndPasteQuill={false}
                                                            inputCssClass="text-input-outputs" controlCssClass="tool-level1 row"
                                                            onFilesChange={onActionFilesChange}
                                                            onFilesError={onFilesError}
                                                            files={newAction.files}
                                                            placeholder={"Bình luận"}
                                                            text={newAction.descriptionDefault}
                                                            submitButtonText={'Thêm'}
                                                            onTextChange={(value, imgs) => {
                                                                setState({
                                                                    ...state,
                                                                    newAction: {
                                                                        ...state.newAction,
                                                                        description: value,
                                                                        descriptionDefault: null
                                                                    }
                                                                })
                                                            }}
                                                            onSubmit={(e) => { submitAction(item._id, tasks.task._id, tasks.task.taskActions.length, item.type) }}
                                                        />
                                                    </div>

                                                </React.Fragment>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

function mapState(state) {
    const { tasks, auth } = state;
    return { tasks, auth };
}

const actionCreators = {
    createTaskOutputs: performTaskAction.createTaskOutputs,
};

const connectedTaskOutputs = connect(mapState, actionCreators)(withTranslate(TaskOutputsTab));

export { connectedTaskOutputs as TaskOutputsTab };

