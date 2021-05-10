import React, { useState, useEffect, useRef, useCallback } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ProjectActions } from "../../redux/actions";
import { UserActions } from '../../../super-admin/user/redux/actions';
import moment from 'moment';
import 'c3/c3.css';

const TabProjectInfo = (props) => {
    const { translate, projectDetail } = props;

    const renderItemLabelContent = (label, content) => {
        return (
            <div className="col-md-6">
                <div className="form-horizontal">
                    <div className="form-group">
                        <strong className="col-sm-4">{label}</strong>
                        <div className="col-sm-8">
                            <span>{content}</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <React.Fragment>
            <div className="box">
                <div className="box-body qlcv">
                    <div className="row">
                        {renderItemLabelContent(translate('project.name'), projectDetail ? projectDetail?.name : null)}
                        {renderItemLabelContent(translate('project.code'), projectDetail ? projectDetail?.code : null)}
                    </div>

                    <div className="row">
                        {renderItemLabelContent(translate('project.startDate'), projectDetail ? moment(projectDetail?.startDate).format('HH:mm DD/MM/YYYY') : null)}
                        {renderItemLabelContent(translate('project.endDate'), projectDetail ? moment(projectDetail?.endDate).format('HH:mm DD/MM/YYYY') : null)}
                    </div>

                    <div className="row">
                        {renderItemLabelContent(translate('project.manager'), projectDetail && projectDetail?.projectManager ? projectDetail?.projectManager.map(o => o.name).join(", ") : null)}
                        {renderItemLabelContent(translate('project.unitCost'), projectDetail?.unitCost ? projectDetail?.unitCost : null)}
                    </div>

                    <div className="row">
                        {renderItemLabelContent(translate('project.member'), projectDetail && projectDetail?.responsibleEmployees ? projectDetail?.responsibleEmployees.map(o => o.name).join(", ") : null)}
                        {renderItemLabelContent(translate('project.unitTime'), projectDetail && projectDetail?.unitTime ? translate(`project.unit.${projectDetail?.unitTime}`) : null)}
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
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(TabProjectInfo));