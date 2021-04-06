import React, { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import Sortable from 'sortablejs';
import { QuillEditor } from '../../../../common-components';
import parse from 'html-react-parser';
const ActionForm = (props) => {

    let EMPTY_ACTION = {
        name: '',
        description: '',
        mandatory: true,
    };
    
    const [state, setState] = useState({
        EMPTY_ACTION: Object.assign({}, EMPTY_ACTION),
        editAction: false,
        action: Object.assign({}, EMPTY_ACTION),
        quillValueDefault: null
    })

    useEffect(() => {
        if (props.type !== state.type) {
            setState( state => {
                return {
                    ...state,
                    taskActions: props.initialData,
                    type: props.type
                }
            })
        }
        if (props.savedTaskAsTemplate && props.initialData && props.initialData.length > 0 && !state.taskActions) {
            
            setState(state =>{
                return {
                    ...state,
                    taskActions: props.initialData,
                }
            })
        } 
    },[props.type])

    /**Gửi truy vấn tạo 1 template mới */
    const handleSubmit = async (event) => {
        const { newTemplate } = state;
        props.addNewTemplate(newTemplate);
    }

    useEffect(() => {
        // Load library for sort action table
        handleSortable();
    },[])

    // Drag and drop item in action table
    const handleSortable = () => {
        var el1 = document.getElementById('actions');
        Sortable.create(el1, {
            chosenClass: 'chosen',
            animation: 500,
            onChange: function (evt) {
                window.$('#actions tr').each(function (index) {
                    window.$(this).find('td:nth-child(1)').html(index + 1);
                });
            },
            onEnd: async (evt) => {
                let taskActions = state.taskActions;
                const item = taskActions[evt.oldIndex];
                taskActions.splice(evt.oldIndex, 1);
                taskActions.splice(evt.newIndex, 0, item);
            }, store: {
                /**
                 * Khắc phục lỗi với thư viện Sortable. Chi tiết lỗi như sau:
                 * Khi lưu thứ tự sắp xếp mới vào state, do state thay đổi, react render lại.
                 * Sortable phát hiện cấu trúc DOM thay đổi nên tự động thay đổi trở lại thứ tự các phần tử
                 * Kết quả: thứ tự trong State lưu một đằng, giao diện hiển thị thể hiện một nẻo
                 **/
                set: (sortable) => {
                    let state = state;
                    state.keyPrefix = Math.random(); // force react to destroy children
                    state.order = sortable.toArray();
                    setState({
                        ...state
                    })
                }
            }
        });
    }

    const handleChangeActionName = (event) => {
        let value = event.target.value;
        let { action } = state;
        action.name = value;
        setState(
            ...state,
            { action }
        );
    }

    const handleChangeActionDesc = (value, imgs) => {
        const { action } = state;
        setState({
            ...state,
            action: {
                ...action,
                description: value
            },
            quillValueDefault: null
        })
    }

    const handleChangeActionMandatory = (event) => {
        let value = event.target.checked;
        let { action } = state;
        action.mandatory = value;
        setState(
            ...state,
            { action }
        );
    }

    /** cancel editing an action*/
    const handleCancelEditAction = (event) => {
        event.preventDefault(); // Ngăn không submit     
        setState(state => {
            return {
                ...state,
                editAction: false,
                action: Object.assign({}, state.EMPTY_ACTION),
                quillValueDefault: state.EMPTY_ACTION.description
            }
        });
    }

    /**reset all data fields of action table */
    const handleClearAction = (event) => {
        event.preventDefault(); // Ngăn không submit
        setState(state => {
            return {
                ...state,
                action: Object.assign({}, state.EMPTY_ACTION),
                quillValueDefault: state.EMPTY_ACTION.description
            }
        });
    }

    /**Thêm 1 hoạt động */
    const handleAddAction = (event) => {
        event.preventDefault(); // Ngăn không submit
        let { taskActions, action } = state;

        if (!taskActions)
            taskActions = [];
        const newTaskActions = [
            ...taskActions,
            action,
        ]

        setState(
            ...state,
            {
            taskActions: newTaskActions,
            action: {
                name: '',
                description: '',
                mandatory: true,
            },
            quillValueDefault: ''
        }, () => props.onDataChange(newTaskActions));
    }

    /** Sửa các thông tin của hành động */
    const handleEditAction = (action, index) => {
        setState(state => {
            return {
                ...state,
                editAction: true,
                indexAction: index,
                action: { ...action },
                quillValueDefault: action.description
            }
        });
    }

    /**Lưu sau khi chỉnh sửa thông tin hoạt động */
    const handleSaveEditedAction = (event) => {
        event.preventDefault(); // Ngăn không submit

        let { indexAction, taskActions, action } = state;
        taskActions[indexAction] = action;

        setState(
            ...state,
            {
            taskActions,
            editAction: false,
            action: { ...state.EMPTY_ACTION },
            quillValueDefault: state.EMPTY_ACTION.description
        }, () => props.onDataChange(taskActions))
    }

    /**Xóa 1 hành động */
    const handleDeleteAction = (index) => {
        let { taskActions } = state;
        taskActions.splice(index, 1);

        setState(state => {
            return {
                ...state,
                taskActions
            }
        }, () => props.onDataChange(taskActions))
    }

    const { translate } = props;
    let { action, taskActions, quillValueDefault } = state;
    const { type } = props;

    return (
        /**Form chứa các thông tin của phần hoạt động của 1 task-template*/
        <fieldset className="scheduler-border">
            <legend className="scheduler-border">{translate('task_template.activity_list')}</legend>

            {/**Tên hoạt động  */}
            <div className={`form-group ${state.action.errorOnName === undefined ? "" : "has-error"}`} >
                <label className="control-label">{translate('task_template.action_name')}</label>
                <input type="text" className="form-control" placeholder={translate('task_template.action_name')} value={action.name} onChange={handleChangeActionName} />
            </div>

            {/**Mô tả hoạt động*/}
            <div className={`form-group ${state.action.errorOnDescription === undefined ? "" : "has-error"}`} >
                <label className="control-label">{translate('task_template.description')}</label>
                <QuillEditor
                    id={`actionsTemplate${type}`}
                    getTextData={handleChangeActionDesc}
                    quillValueDefault={quillValueDefault}
                    embeds={false}
                />
            </div>

            {/**Hoạt động này có bắt buộc không?*/}
            <div className="form-group" >
                <label className="control-label">
                    {translate('task_template.mandatory')} &nbsp;
                    <input type="checkbox" className="" checked={action.mandatory} onChange={handleChangeActionMandatory} />
                </label>
            </div>

            {/**Các button thêm 1 hoạt động, xóa trắng các trường thông tin đã nhập*/}
            <div className="pull-right" style={{ marginBottom: '10px' }}>
                {state.editAction ?
                    <React.Fragment>
                        <button className="btn btn-success" style={{ marginLeft: "10px" }} onClick={handleCancelEditAction}>{translate('task_template.cancel_editing')}</button>
                        <button className="btn btn-success" style={{ marginLeft: "10px" }} onClick={handleSaveEditedAction}>{translate('task_template.save')}</button>
                    </React.Fragment> :
                    <button className="btn btn-success" style={{ marginLeft: "10px" }} onClick={handleAddAction}>{translate('task_template.add')}</button>
                }
                <button className="btn btn-primary" style={{ marginLeft: "10px" }} onClick={handleClearAction}>{translate('task_template.delete')}</button>
            </div>

            {/**Table chứa các hoạt động sẵn có*/}
            <table className="table table-hover table-striped table-bordered">
                <thead>
                    <tr>
                        <th style={{ width: '50px' }} className="col-fixed">STT</th>
                        <th title="Tên hoạt động">{translate('task_template.action_name')}</th>
                        <th title="Mô tả">{translate('task_template.description')}</th>
                        <th style={{ width: '60px' }} title="Bắt buộc">{translate('task_template.mandatory')}</th>
                        <th style={{ width: '60px' }} title="Hành động">{translate('task_template.action')}</th>
                    </tr>
                </thead>
                <tbody id="actions">
                    {
                        (typeof taskActions === 'undefined' || taskActions.length === 0) ? <tr><td colSpan={5}><center>{translate('task_template.no_data')}</center></td></tr> :
                            taskActions.map((item, index) =>
                                <tr key={`${state.keyPrefix}_${index}`}>
                                    <td>{index + 1}</td>
                                    <td>{parse(item.name)}</td>
                                    <td><div>{parse(item.description)}</div></td>
                                    <td>{item.mandatory ? "Có" : "Không"}</td>
                                    {/**các button sửa, xóa 1 hoạt động */}
                                    <td>
                                        <a href="#abc" className="edit" title="Edit" data-toggle="tooltip" onClick={() => handleEditAction(item, index)}><i className="material-icons"></i></a>
                                        <a href="#abc" className="delete" title="Delete" data-toggle="tooltip" onClick={() => handleDeleteAction(index)}><i className="material-icons"></i></a>
                                    </td>
                                </tr>
                            )
                    }
                </tbody>
            </table>
        </fieldset>
    )
}

const actionForm = connect()(withTranslate(ActionForm));
export { actionForm as ActionForm }