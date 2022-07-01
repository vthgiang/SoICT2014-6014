import React, { useEffect, useState } from 'react';
import { ErrorLabel, QuillEditor } from '../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import parse from 'html-react-parser';

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

function ExpectedResults(props) {
    const { onChange } = props;
    const { tasks } = props;

    const initValue = tasks?.task ? tasks.task.taskOutputs : [];
    const [itemStatus, setItemStatus] = useState({
        index: '',
        status: '',
    });
    const [newExpectedResult, setNewExpectedResult] = useState({
        title: '',
        description: '',
        descriptionDefault: '',
        type: 0,
    })
    const [expectedResults, setExpectedResults] = useState(initValue)

    const handleChangeDescription = async (value, imgs) => {
        setNewExpectedResult({
            ...newExpectedResult,
            description: value,
            imgs: imgs
        });
    }

    useEffect(() => {
        onChange(expectedResults)
    }, [expectedResults])

    return (
        <fieldset className="scheduler-border">
            <legend className="scheduler-border">Kết quả dự kiến cần giao nộp</legend>
            <div className={`form-group`} >
                <label className="control-label">Tiêu đề</label>
                <div>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Tiêu đề"
                        value={newExpectedResult.title}
                        onChange={
                            (event) => {
                                setNewExpectedResult({
                                    ...newExpectedResult,
                                    title: event.target.value,
                                })
                            }}
                    />
                    <ErrorLabel />
                </div>
            </div>
            <div className={`form-group`} >
                <label className="control-label" htmlFor="inputDescriptionInfo">Mô tả</label>
                <QuillEditor
                    id={`expectedResult-${props?.id}-${props.quillId}`}
                    table={false}
                    embeds={false}
                    quillValueDefault={newExpectedResult.descriptionDefault}
                    maxHeight={180}
                    getTextData={(value, imgs) => {
                        handleChangeDescription(value, imgs)
                    }}
                />
            </div>
            <div className="form-group" >

                {/**Kiểu dữ liệu trường thông tin */}
                <label className=" control-label">Loại kết quả giao nộp</label>
                <div style={{ width: '100%' }}>
                    <select
                        onChange={(event) => {
                            setNewExpectedResult({
                                ...newExpectedResult,
                                type: Number(event.target.value)
                            })
                        }}
                        className="form-control"
                        id="seltype"
                        value={newExpectedResult.type}
                        name="type"
                    >
                        <option value={1}>Tập tin văn bản</option>
                        {/* <option value="DOCUMENT">Ảnh minh chứng</option> */}
                        <option value={0}>Văn bản</option>
                    </select>
                </div>
            </div>
            {/**Các button lưu chỉnh sửa khi chỉnh sửa 1 trường thông tin, thêm một trường thông tin, xóa trắng các ô input  */}
            <div className="pull-right" style={{ marginBottom: "10px" }}>
                {
                    itemStatus.status === "edit" ? <React.Fragment>
                        <button className="btn btn-success" style={{ marginLeft: "10px" }} onClick={() => {
                            setNewExpectedResult({
                                title: '',
                                description: '',
                                type: 0,
                            });
                            setItemStatus({
                                index: '',
                                status: ''
                            })
                        }}>Hủy</button>
                        <button className="btn btn-success" style={{ marginLeft: "10px" }}
                            onClick={() => {
                                let newList = expectedResults;
                                newList[itemStatus.index] = newExpectedResult;
                                setExpectedResults(newList);
                                setNewExpectedResult({
                                    title: '',
                                    description: '',
                                    type: 0,
                                });
                                setItemStatus({
                                    index: '',
                                    status: ''
                                })
                            }}
                        > Lưu</button>
                    </React.Fragment> : (
                        <button
                            className="btn btn-success"
                            style={{ marginLeft: "10px" }}
                            onClick={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                const newList = [...expectedResults, newExpectedResult]
                                setExpectedResults(newList);
                                setNewExpectedResult({
                                    title: '',
                                    description: '',
                                    type: 0,
                                });
                            }}>
                            Thêm mới
                        </button>
                    )
                }
                <button
                    className="btn btn-primary"
                    style={{ marginLeft: "10px" }}
                    onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        setNewExpectedResult({
                            title: '',
                            description: '',
                            type: 0,
                        });
                    }}
                >
                    Xóa trắng
                </button>
            </div>

            {/**table chứa danh sách các thông tin của mẫu công việc */}
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th style={{ width: '50px' }} className="col-fixed">STT</th>
                        <th title="Tên trường thông tin">Tiêu đề</th>
                        <th title="Mô tả">Mô tả</th>
                        <th title="Kiểu dữ liệu">Loại kết quả giao nộp</th>
                        {/* <th title="Số lượng tệp tin tối thiểu">Số lượng tệp tin tối thiểu</th> */}
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody className="task-table">
                    {expectedResults?.length > 0 ?
                        expectedResults.map((item, index) => {
                            return (<tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.title}</td>
                                <td>{parse(item?.description ? item.description : "")}</td>
                                <td>{formatTypeInfo(item.type)}</td>
                                <td>
                                    <a href="#abc" className="edit" title={"Edit"} onClick={() => {
                                        const expectedResult = { ...item, descriptionDefault: item.description }
                                        setNewExpectedResult(expectedResult);
                                        setItemStatus({ index: index, status: "edit" })
                                    }}><i className="material-icons"></i></a>
                                    <a href="#abc" className="delete" title={"Delete"} onClick={() => {
                                        const newList = expectedResults.filter((item, x) => x !== index);
                                        setExpectedResults(newList)
                                    }}><i className="material-icons"></i></a>
                                </td>
                            </tr>)
                        }) :
                        <tr><td colSpan={5}><center>No data</center></td></tr>
                    }
                </tbody>
            </table>
        </fieldset >
    )
}

function mapState(state) {
    const { tasktemplates, tasks } = state;
    return { tasktemplates, tasks };
}

const actionCreators = {
};

const connectedExpectedResults = connect(mapState, actionCreators)(withTranslate(ExpectedResults));
export { connectedExpectedResults as ExpectedResults };
