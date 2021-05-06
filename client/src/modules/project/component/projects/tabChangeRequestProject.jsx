import React, { useState, useEffect, useRef, useCallback } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ProjectActions } from "../../redux/actions";
import { UserActions } from '../../../super-admin/user/redux/actions';
import moment from 'moment';
import 'c3/c3.css';
import { fakeChangeRequestsList } from '../scheduling-projects/staticData';

const TabChangeRequestProject = (props) => {
    const { translate, projectDetail } = props;

    const currentCRList = fakeChangeRequestsList;

    const renderItem = (item, index) => {
        return (
            <div key={index}>
                <div>
                    <h5><strong>Tên yêu cầu</strong></h5>
                    <h5>{item.name}</h5>
                </div>
                <div>
                    <h5><strong>Người tạo yêu cầu</strong></h5>
                    <h5>{item.creator.name}</h5>
                </div>
            </div>
        )
    }

    const renderStatus = (statusValue) => {
        switch (statusValue) {
            case 0: return 'Chưa yêu cầu';
            case 1: return 'Đang yêu cầu';
            case 2: return 'Từ chối';
            case 3: return 'Đồng ý';
            default: return 'Chưa yêu cầu';
        }
    }

    return (
        <React.Fragment>
            <div className="box">
                <div className="box-body qlcv">
                    <table id="project-table" className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>Tên yêu cầu</th>
                                <th>Người tạo yêu cầu</th>
                                <th>Thời gian tạo yêu cầu</th>
                                <th>Mô tả yêu cầu</th>
                                <th>Trạng thái yêu cầu</th>
                                <th style={{ width: "120px", textAlign: "center" }}>
                                    {translate('table.action')}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {(currentCRList && currentCRList.length !== 0) &&
                                currentCRList.map((CRItem, index) => (
                                    <tr key={index}>
                                        <td>{CRItem?.name}</td>
                                        <td>{CRItem?.creator?.name}</td>
                                        <td>{moment(CRItem?.createdAt).format('HH:mm DD/MM/YYYY')}</td>
                                        <td>{CRItem?.description}</td>
                                        <td>{renderStatus(CRItem?.requestStatus)}</td>
                                        <td></td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
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
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(TabChangeRequestProject));