import React from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ProjectActions } from "../../redux/actions";
import { UserActions } from '../../../super-admin/user/redux/actions';
import moment from 'moment';

const TabEvalProjectMember = (props) => {
    const { currentTasks, translate } = props;
    // console.log('currentTasks', currentTasks)
    return (
        <React.Fragment>
            <div>
                <div className="box">
                    <div className="box-body qlcv">
                        <h3><strong>Các nhân viên xuất sắc nhất tháng </strong></h3>
                        <table id="project-table" className="table table-striped table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Họ và tên</th>
                                    <th>Tháng đánh giá</th>
                                    <th>Điểm số</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(currentTasks && currentTasks.length !== 0) &&
                                    currentTasks.map((taskItem, index) => {
                                        return taskItem?.evaluations?.map(evalItem => {
                                            return (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{taskItem?.code}</td>
                                                    <td>{taskItem?.name}</td>
                                                    <td>{taskItem?.name}</td>
                                                </tr>
                                            )
                                        })
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

function mapStateToProps(state) {
    const project = state.project;
    return { project }
}

const mapDispatchToProps = {
    getProjectsDispatch: ProjectActions.getProjectsDispatch,
    deleteProjectDispatch: ProjectActions.deleteProjectDispatch,
    getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany,
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(TabEvalProjectMember));