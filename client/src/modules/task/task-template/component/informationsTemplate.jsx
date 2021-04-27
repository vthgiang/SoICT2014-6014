import React, { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { ErrorLabel, QuillEditor } from '../../../../common-components';
import Sortable from 'sortablejs';
import parse from 'html-react-parser';
import { ReactSortable } from "react-sortablejs"
import ValidationHelper from '../../../../helpers/validationHelper';

function InformationForm(props) {

    let INFO_TYPE = {
        TEXT: "text",
        NUMBER: "number",
        DATE: "date",
        BOOLEAN: "boolean",
        SET: "set_of_values",
    };

    let EMPTY_INFORMATION = {
        name: '',
        description: '',
        type: INFO_TYPE.TEXT,
        extra: '',
        filledByAccountableEmployeesOnly: false
    };

    const [state, setState] = useState({
        EMPTY_INFORMATION: Object.assign({}, EMPTY_INFORMATION),
        information: Object.assign({}, EMPTY_INFORMATION),
        editInfo: false,
        quillValueDefault: null,
        taskInformations: []
    })

    // useEffect(() => {
    //     // Load library for sort action table
    //     handleSortable();
    // }, [])

    useEffect(() => {
        //Trường hợp tạo ở form mẫu công việc
        if (props.type !== state.type) {
            setState({
                ...state,
                taskInformations: props.initialData,
                type: props.type
            })
        }
        //trường hợp lưu thành mẫu chạy vào đây
        if (props.savedTaskAsTemplate && props.initialData && props.initialData.length > 0 && !state.taskInformations) {
            setState({
                ...state,
                taskInformations: props.initialData,
            })
        }
    }, [props.type, props.initialData])


    /**Sắp xếp các item trong bảng */
    // const handleSortable = () => {
    //     var el2 = document.getElementById('informations');
    //     Sortable.create(el2, {
    //         chosenClass: 'chosen',
    //         animation: 500,
    //         onChange: async (evt) => {
    //             window.$('#informations tr').each(function (index) {
    //                 window.$(this).find('td:nth-child(1)').html("p" + (index + 1));
    //             });
    //         },
    //         onEnd: async (evt) => {
    //             let taskInformations = state.taskInformations;
    //             const item = taskInformations[evt.oldIndex];
    //             taskInformations.splice(evt.oldIndex, 1);
    //             taskInformations.splice(evt.newIndex, 0, item);
    //         }, store: {
    //             /**
    //              * Khắc phục lỗi với thư viện Sortable. Chi tiết lỗi như sau:
    //              * Khi lưu thứ tự sắp xếp mới vào state, do state thay đổi, react render lại.
    //              * Sortable phát hiện cấu trúc DOM thay đổi nên tự động thay đổi trở lại thứ tự các phần tử
    //              * Kết quả: thứ tự trong State lưu một đằng, giao diện hiển thị thể hiện một nẻo
    //              **/
    //             set: (sortable) => {
    //                 setState({
    //                     ...state,
    //                     keyPrefix: Math.random(), // force react to destroy children
    //                     order: sortable.toArray()
    //                 })
    //             }
    //         }
    //     });
    // }

    /**Sửa thông tin trong bảng danh sách các thông tin */
    const handleEditInformation = (information, indexInfo) => {
        setState({
            ...state,
            editInfo: true,
            warning: false,
            indexInfo,
            information: { ...information },
            quillValueDefault: information && information.description,
            oldType: information.type
        });
    }

    /**Lưu chỉnh sửa */
    const handleSaveEditedInformation = (event) => {
        event.preventDefault(); // Ngăn không submit
        let { indexInfo, taskInformations, information } = state;

        taskInformations[indexInfo] = information;

        setState({
            ...state,
            taskInformations,
            editInfo: false,
            information: { ...state.EMPTY_INFORMATION },
            quillValueDefault: state.EMPTY_INFORMATION.description
        }, () => props.onDataChange(taskInformations))
    }

    const handleCancelEditInformation = (event) => {
        event.preventDefault(); // Ngăn không submit
        setState({
            ...state,
            editInfo: false,
            warning: false,
            information: { ...state.EMPTY_INFORMATION },
            quillValueDefault: state.EMPTY_INFORMATION.description
        });
    }

    /**Xóa trắng các ô input */
    const handleClearInformation = (event) => {
        event.preventDefault(); // Ngăn không submit

        let warning = false;
        if (state.oldType && state.editInfo === true) {
            if (INFO_TYPE.TEXT !== state.oldType) {
                warning = true;
            }
        }
        setState({
            ...state,
            warning: warning,
            information: { ...state.EMPTY_INFORMATION },
            quillValueDefault: state.EMPTY_INFORMATION.description
        })
    }

    /**Xóa 1 trường thông tin trong danh sách */
    const handleDeleteInformation = async (index) => {
        let taskInformations = state.taskInformations;
        var newTaskInformations;
        if (taskInformations) {
            newTaskInformations = taskInformations.filter((item, x) => index !== x);
        }
        await setState({
            ...state,
            taskInformations: newTaskInformations
        })
        props.onDataChange(state.taskInformations);
    }

    /**Thêm 1 trường thông tin */
    const handleAddInformation = (event) => {
        event.preventDefault(); // Ngăn không submit
        let { taskInformations, information } = state;

        if (!taskInformations)
            taskInformations = [];

        const newTaskInformations = [
            ...taskInformations,
            information,
        ]

        setState({
            ...state,
            taskInformations: newTaskInformations,
            information: { ...state.EMPTY_INFORMATION },
            quillValueDefault: state.EMPTY_INFORMATION.description
        })
        props.onDataChange(newTaskInformations)
    }

    /**
     * Bộ xử lý cho Information Form 
    **/
    const isInfoFormValidated = () => {
        let result =
            validateInfoName(state.information.name, false) &&
            (state.information.type !== INFO_TYPE.SET ||
                (state.information.type === INFO_TYPE.SET &&
                    validateInfoSetOfValues(state.information.extra, false))
            );
        return result;
    }

    const handleChangeInfoName = (event) => {
        let value = event.target.value;
        validateInfoName(value, true);
    }

    const validateInfoName = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(props.translate, value);

        if (willUpdateState) {
            state.information.name = value;
            state.information.errorOnName = message;
            setState(state => {
                return {
                    ...state,
                };
            });
        }
        return message == undefined;
    }

    const handleChangeInfoDesc = (value, imgs) => {
        const { information } = state;
        setState({
            ...state,
            information: {
                ...information,
                description: value
            },
            quillValueDefault: null
        })
    }

    //function: show selection input
    const handleChangeInfoType = (event) => {
        let value = event.target.value;
        state.information.type = value;
        let warning = false;
        if (state.oldType && state.editInfo === true) {
            if (value !== state.oldType) {
                warning = true;
            }
        }

        setState(state => {
            return {
                ...state,
                warning: warning,
            };
        });
    }

    const handleChangeInfoSetOfValues = (event) => {
        let value = event.target.value;
        validateInfoSetOfValues(value);
    }

    const validateInfoSetOfValues = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(props.translate, value);

        if (willUpdateState) {
            state.information.extra = value;
            state.information.errorOnSetOfValues = message;
            setState(state => {
                return {
                    ...state,
                };
            });
        }
        return message == undefined;
    }

    const handleChangeInfoFilledByAccountableEmployeesOnly = (event) => {
        let value = event.target.checked;
        state.information.filledByAccountableEmployeesOnly = value;
        setState(state => {
            return {
                ...state
            };
        });
    }

    const formatTypeInfo = (type) => {
        let { translate } = props;

        if (type === "text") return translate('task_template.text');
        else if (type === "number") return translate('task_template.number');
        else if (type === "date") return translate('task_template.date');
        else if (type === "boolean") return "Boolean";
        else if (type === "set_of_values") return translate('task_template.value_set');
    }


    const { translate } = props;
    let { taskInformations, information, quillValueDefault } = state;
    const { type } = props;

    return (

        /**Form chứa các danh sách thông tin của mẫu công việc */
        <fieldset className="scheduler-border">
            <legend className="scheduler-border">{translate('task_template.information_list')}</legend>

            {/**Tên trường thông tin*/}
            <div className={`form-group ${state.information.errorOnName === undefined ? "" : "has-error"}`} >
                <label className="control-label">{translate('task_template.infor_name')}</label>
                <div>
                    <input type="text" className="form-control" placeholder={translate('task_template.infor_name')} value={information.name} onChange={handleChangeInfoName} />
                    <ErrorLabel content={state.information.errorOnName} />
                </div>
            </div>

            {/**Mô tả của trường thông tin */}
            <div className={`form-group ${state.information.errorOnDescription === undefined ? "" : "has-error"}`} >
                <label className="control-label" htmlFor="inputDescriptionInfo">{translate('task_template.description')}</label>
                <QuillEditor
                    id={`informationsTemplate${type}`}
                    getTextData={handleChangeInfoDesc}
                    quillValueDefault={quillValueDefault}
                    embeds={false}
                />
            </div>
            <div className="form-group" >

                {/**Kiểu dữ liệu trường thông tin */}
                <label className=" control-label">{translate('task_template.datatypes')}</label>
                {
                    props.isEdit === true && state.warning && <p style={{ color: "#FF6A00" }}>Đổi kiểu dữ liệu sẽ xóa dữ liệu ở tháng hiện tại và đánh giá tháng hiện tại</p>
                }
                <div style={{ width: '100%' }}>
                    <select onChange={handleChangeInfoType} className="form-control" id="seltype" value={information.type} name="type" >
                        <option value={INFO_TYPE.TEXT}>{translate('task_template.text')}</option>
                        <option value={INFO_TYPE.NUMBER}>{translate('task_template.number')}</option>
                        <option value={INFO_TYPE.DATE}>{translate('task_template.date')}</option>
                        <option value={INFO_TYPE.BOOLEAN}>Boolean</option>
                        <option value={INFO_TYPE.SET}>{translate('task_template.value_set')}</option>
                    </select>
                </div>
            </div>

            { state.information.type === INFO_TYPE.SET ?
                <div className={`form-group ${state.information.errorOnSetOfValues === undefined ? "" : "has-error"}`} >
                    <label className="control-label">{translate('task_template.value_set')}</label>

                    <textarea rows={5} type="text" className="form-control" value={information.extra} onChange={handleChangeInfoSetOfValues} placeholder={`Nhập tập giá trị, mỗi giá trị một dòng`} />
                    <ErrorLabel content={state.information.errorOnSetOfValues} />
                </div>
                : null
            }

            <div className="form-group" >

                {/**Chỉ quản lí được điền? */}
                <label className="control-label">
                    {translate('task_template.manager_fill')} &nbsp;
                        <input type="checkbox" className="" checked={information.filledByAccountableEmployeesOnly} onChange={handleChangeInfoFilledByAccountableEmployeesOnly} />
                </label>
            </div>

            {/**Các button lưu chỉnh sửa khi chỉnh sửa 1 trường thông tin, thêm một trường thông tin, xóa trắng các ô input  */}
            <div className="pull-right" style={{ marginBottom: "10px" }}>
                {state.editInfo ?
                    <React.Fragment>
                        <button className="btn btn-success" onClick={handleCancelEditInformation} style={{ marginLeft: "10px" }}>{translate('task_template.cancel_editing')}</button>
                        <button className="btn btn-success" disabled={!isInfoFormValidated()} onClick={handleSaveEditedInformation} style={{ marginLeft: "10px" }}>{translate('task_template.save')}</button>
                    </React.Fragment> :
                    <button className="btn btn-success" style={{ marginLeft: "10px" }} disabled={!isInfoFormValidated()} onClick={handleAddInformation}>{translate('task_template.add')}</button>
                }
                <button className="btn btn-primary" style={{ marginLeft: "10px" }} onClick={handleClearInformation}>{translate('task_template.delete')}</button>
            </div>

            {/**table chứa danh sách các thông tin của mẫu công việc */}
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th style={{ width: '50px' }} className="col-fixed">{translate('task_template.code')}</th>
                        <th title="Tên trường thông tin">{translate('task_template.infor_name')}</th>
                        <th title="Mô tả">{translate('task_template.description')}</th>
                        <th title="Kiểu dữ liệu">{translate('task_template.datatypes')}</th>
                        <th title="Chỉ quản lý được điền?">{translate('task_template.manager_fill')}?</th>
                        <th>{translate('task_template.action')}</th>
                    </tr>
                </thead>

                {
                    (typeof taskInformations === 'undefined' || taskInformations.length === 0) ? <tr><td colSpan={5}><center>{translate('task_template.no_data')}</center></td></tr> :
                        <ReactSortable animation={500} tag="tbody" id="actions" list={taskInformations} setList={(newState) => setState({ ...state, taskInformations: newState })}>
                            {taskInformations.map((item, index) =>
                                <tr key={`${state.keyPrefix}_${index}`}>
                                    <td>p{index + 1}</td>
                                    <td>{item.name}</td>
                                    <td><div>{parse(item.description)}</div></td>
                                    <td>{formatTypeInfo(item.type)}</td>
                                    <td>{item.filledByAccountableEmployeesOnly ? translate('general.yes') : translate('general.no')}</td>
                                    <td>
                                        <a href="#abc" className="edit" title={translate('general.edit')} onClick={() => handleEditInformation(item, index)}><i className="material-icons"></i></a>
                                        <a href="#abc" className="delete" title={translate('general.delete')} onClick={() => handleDeleteInformation(index)}><i className="material-icons"></i></a>
                                    </td>
                                </tr>
                            )}
                        </ReactSortable>

                }

            </table>
        </fieldset>
    )
}


const informationForm = connect()(withTranslate(InformationForm));
export { informationForm as InformationForm }
