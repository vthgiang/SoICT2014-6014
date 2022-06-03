import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import OutputDetail from './modalDetailOutput';
import parse from 'html-react-parser';
import { getStorage } from '../../../../config';
import { ContentMaker, SelectBox, ShowMoreShowLess } from '../../../../common-components';
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

const formatStatusInfo = (value) => {
    switch (value) {
        case "unfinished":
            return (
                <div style={{ color: "rgba(146, 64, 14)", backgroundColor: "rgba(253, 230, 138)", padding: "5px" }}>
                    Chưa hoàn thành
                </div>
            );
        case "waiting_approval":
            return (
                <div style={{ color: "rgba(146, 64, 14)", backgroundColor: "rgba(253, 230, 138)", padding: "5px" }}>
                    Đang chờ phê duyệt
                </div>
            );
        case "rejected":
            return (
                <div style={{ color: "rgba(239, 68, 68)", backgroundColor: "rgba(254, 202, 202)", padding: "5px" }}>
                    Bị từ chối
                </div>
            );
        case "approved":
            return (
                <div style={{ color: "rgba(16, 185, 129)", backgroundColor: "rgba(167, 243, 208)", padding: "5px" }}>
                    Đã phê duyệt
                </div>
            );
        default:
            return "";
            break;
    }
}

const isImage = (src) => {
    let string = src.toLowerCase().split(".");
    let image = ['jpg', 'jpeg', 'png', 'tiff', 'gif']
    if (image.indexOf(string[string.length - 1]) !== -1) {
        return true;
    } else {
        return false;
    }
}

function TaskOutputsTab(props) {
    const { performtasks, auth } = props;
    const idUser = getStorage("userId");
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

    useEffect(() => {
        props.getTaskOutputs(performtasks.task._id)
        console.log(73)
    }, [performtasks.task._id])
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

        data.append("creator", newAction.creator);
        data.append("description", newAction.description);
        data.append("index", index)
        newAction.files && newAction.files.forEach(x => {
            data.append("files", x);
        })
        if (newAction.creator) {
            if (type === 0) {
                props.createTaskOutputs(taskId, taskOutputId, data);
            }
            if (type === 1 && newAction.files.length > 0) {
                props.createTaskOutputs(taskId, taskOutputId, data);
            }
            // props.createTaskAction(taskId, data);
        }
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

    if (!performtasks?.task?.taskOutputs) {
        return <div>Chưa có thông tin</div>
    }

    return (
        <div>
            <OutputDetail />
            <div>
                {/* Kết quả */}
                {performtasks.task.taskOutputs.map((item, index) => {
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
                                                    {formatStatusInfo(item.status)}
                                                </div>

                                                <div className="form-group">
                                                    <SelectBox
                                                        id={`status`}
                                                        className="form-control select2"
                                                        style={{ width: "100%", padding: '5px', marginRight: '5px' }}
                                                        value={'approved'}
                                                        items={[
                                                            { value: 'approved', text: 'Phê duyệt ' },
                                                            { value: 'waiting_for_approval', text: "Chờ phê duyệt " },
                                                            { value: 'disapproved', text: "Từ chối " },
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
                                                            idQuill={`add-action-${item._id}`}
                                                            imageDropAndPasteQuill={false}
                                                            inputCssClass="text-input-level1" controlCssClass="tool-level1 row"
                                                            onFilesChange={onActionFilesChange}
                                                            onFilesError={onFilesError}
                                                            files={newAction.files}
                                                            placeholder={"Báo cáo kết quả"}
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
                                                            onSubmit={(e) => { submitAction(item._id, performtasks.task._id, performtasks.task.taskActions.length, item.type) }}
                                                        />
                                                    </div>
                                                </React.Fragment>
                                                <ShowMoreShowLess
                                                    id={`description${item._id}`}
                                                    classShowMoreLess='tool-level1'
                                                    styleShowMoreLess={{ display: "inline-block", marginBotton: 15 }}
                                                >
                                                    {
                                                        item?.submissionResults?.taskActions?.map((x) => {
                                                            let listImage = x.files?.map((elem) => isImage(elem.name) ? elem.url : -1).filter(url => url !== -1);
                                                            return (
                                                                <div key={x._id} className={index > 3 ? "hide-component" : ""}>
                                                                    {x.creator ?
                                                                        <img className="user-img-level1" src={(process.env.REACT_APP_SERVER + x.creator.avatar)} alt="User Image" /> :
                                                                        <div className="user-img-level1" />
                                                                    }
                                                                    { // khi chỉnh sửa thì ẩn action hiện tại đi
                                                                        <React.Fragment>
                                                                            <div className="content-level1" data-width="100%" style={{ marginBottom: "35px" }}>
                                                                                {/* Tên người tạo hoạt động */}
                                                                                <div style={{ display: 'flex', fontWeight: 'bold', justifyContent: 'space-between' }}>
                                                                                    {
                                                                                        x.creator && <a style={{ cursor: "pointer" }}>{x.creator?.name} </a>
                                                                                    }
                                                                                </div>
                                                                                <div>
                                                                                    {
                                                                                        x.name && <b style={{ display: 'flex', marginTop: '4px' }}>{x.name} </b>
                                                                                    }
                                                                                    {x?.description?.split('\n')?.map((elem, idx) => (
                                                                                        <div key={idx}>
                                                                                            {parse(elem)}
                                                                                        </div>
                                                                                    ))
                                                                                    }
                                                                                </div>
                                                                            </div>
                                                                        </React.Fragment>
                                                                    }
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </ShowMoreShowLess>
                                                <button class="btn btn-block btn-default btn-sm">Xem lịch sử thay đổi</button>
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
    const { performtasks, tasks, auth } = state;
    return { performtasks, tasks, auth };
}

const actionCreators = {
    createTaskOutputs: performTaskAction.createTaskOutputs,
    getTaskOutputs: performTaskAction.getTaskOutputs
};

const connectedTaskOutputs = connect(mapState, actionCreators)(withTranslate(TaskOutputsTab));

export { connectedTaskOutputs as TaskOutputsTab };

