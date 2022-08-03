import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { LazyLoadComponent, forceCheckOrVisible, DialogModal, SelectBox } from '../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import moment from 'moment';
import getEmployeeSelectBoxItems from '../../../task/organizationalUnitHelper';
import { convertUserIdToUserName, getCurrentProjectDetails } from '../../projects/components/functionHelper';
import { getStorage } from '../../../../config';
import { ChangeRequestActions } from '../redux/actions';

const ModalCreateChangeRequest = (props) => {
    const { project, user, currentProjectTasks } = props;
    const userId = getStorage('userId');
    const listUsers = user && user.usersInUnitsOfCompany ? getEmployeeSelectBoxItems(user.usersInUnitsOfCompany) : [];
    const projectDetail = getCurrentProjectDetails(project);
    const [form, setForm] = useState({
        name: '',
        description: '',
        affectedTasks: [],
    })
    const { name, description, affectedTasks } = form;
    const selectBoxTasksData = currentProjectTasks?.map((taskItem) => {
        return {
            text: taskItem.name,
            value: taskItem._id,
        }
    })

    const handleChangeForm = (e, type) => {
        const changeFormMutipleArr = ['affectedTasks'];
        if (changeFormMutipleArr.includes(type)) {
            setForm({
                ...form,
                [type]: e,
            })
            return;
        }
        setForm({
            ...form,
            [type]: e.target.value,
        })
    }

    const save = () => {
        if (isAbleToSave()) {
            props.createProjectChangeRequestDispatch({
                creator: userId,
                name,
                description,
                requestStatus: 1,
                type: 'normal',
                taskProject: projectDetail?._id,
                affectedTasksList: affectedTasks.map((affectedItem) => {
                    return {
                        task: affectedItem,
                        old: undefined,
                        new: undefined,
                    }
                }),
            })
        } 
    }

    const isAbleToSave = () => {
        return name.trim().length > 0 && description.trim().length > 0 && affectedTasks.length > 0;
    }

    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-create-change-request`} isLoading={false}
                formID={`form-create-change-request`}
                title={`Tạo yêu cầu thay đổi thông thường`}
                size={50}
                func={save}
                disableSubmit={!isAbleToSave()}
            >
                <div>
                    <div className={`form-group`}>
                        <label>Tên yêu cầu<span className="text-red">*</span></label>
                        <input type="text" className="form-control" value={name} onChange={(e) => handleChangeForm(e, 'name')}></input>
                    </div>
                    <div className={`form-group`}>
                        <label>Mô tả yêu cầu<span className="text-red">*</span></label>
                        <textarea type="text" className="form-control" value={description} onChange={(e) => handleChangeForm(e, 'description')} />
                    </div>
                    <div className={`form-group`}>
                        <label>Người tạo yêu cầu<span className="text-red">*</span></label>
                        <input type="text" className="form-control" value={convertUserIdToUserName(listUsers, userId)} disabled={true}></input>
                    </div>
                    <div className={`form-group`}>
                        <label>Danh sách công việc có thể bị ảnh hưởng<span className="text-red">*</span></label>
                        {
                            selectBoxTasksData &&
                            <SelectBox
                                id={`select-project-type`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={selectBoxTasksData}
                                onChange={(e) => handleChangeForm(e, 'affectedTasks')}
                                value={affectedTasks}
                                multiple={true}
                            />
                        }
                    </div>
                </div>
            </DialogModal>
        </React.Fragment>
    );
}

function mapStateToProps(state) {
    const { project, user } = state;
    return { project, user }
}

const mapDispatchToProps = {
    createProjectChangeRequestDispatch: ChangeRequestActions.createProjectChangeRequestDispatch,
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ModalCreateChangeRequest));
