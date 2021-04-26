import React from 'react'
import { connect } from 'react-redux'
import { UserActions } from '../../../super-admin/user/redux/actions'
import { taskManagementActions } from '../../../task/task-management/redux/actions'
import { ProjectActions } from '../../redux/actions'

const ModalCalculateRecommend = (props) => {
    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-calculate-recommend`} isLoading={false}
                formID={`form-modal-calculate-recommend`}
                title={translate('project.schedule.calculateRecommend')}
                func={save}
                size={100}
            >
                <div>
                    Hellooooooooo
                </div>
            </DialogModal>
        </React.Fragment>
    )
}

const mapStateToProps = (state) => {
    const { project, user } = state;
    return { project, user }
}

const mapDispatchToProps = {
    getProjectsDispatch: ProjectActions.getProjectsDispatch,
    deleteProjectDispatch: ProjectActions.deleteProjectDispatch,
    getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany,
    getTasksByProject: taskManagementActions.getTasksByProject,
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalCalculateRecommend)
