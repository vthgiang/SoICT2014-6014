import React, { Component } from 'react';
import { connect } from 'react-redux';

import { DetailOfTaskDialogModal } from './detailOfTaskDialogModal';
import { DetailOfChildKpiDialogModal } from './detailOfChildKpiDialogModal';

import { withTranslate } from 'react-redux-multilingual';

class DetailsOfOrganizationalUnitKpiForm extends Component {

    constructor(props) {
        super(props);
        
        this.state = {

        }
    }

    static getDerivedStateFromProps(nextProps, prevState){
        if (nextProps.details !== prevState.details) {
            return {
                ...prevState,
                details: nextProps.details
            } 
        } else {
            return null;
        }
    }

    render() {
        const { translate } = this.props;
        const { details } = this.props;

        return (
            <div id="details-of-organizational-unit-kpi-form">
                <fieldset className="scheduler-border qlcv">
                    <legend class="scheduler-border">
                        <h4 class="box-title">Thông tin chi tiết</h4>
                    </legend>

                    <div className="row">
                        <div className="col-xs-6">
                            <div className="form-group">
                                <strong>{translate('document.administration.domains.name')}:  </strong>
                                {details.name}
                            </div>

                            <div className="form-group">
                                <strong>Đơn vị:  </strong>
                                {details.organizationalUnit}
                            </div>

                            <div className="form-group">
                                <strong>Trọng số:  </strong>
                                {details.weight}
                            </div>
                        </div>

                        <div className="col-xs-6">
                            <div className="form-group">
                                <a title="Chi tiết KPI con" data-toggle="modal" data-target="#modal-childKpi-detail" data-backdrop="static" data-keyboard="false" style={{ cursor: "pointer" }}>
                                    <strong>Số lượng Kpi con:  </strong>
                                    {details.listChildKpi.length}
                                </a>
                                <DetailOfChildKpiDialogModal listChildKpi={details.listChildKpi}/>
                            </div>

                            <div className="form-group">
                                <a title="Chi tiết công việc" data-toggle="modal" data-target="#modal-task-detail" data-backdrop="static" data-keyboard="false" style={{ cursor: "pointer" }}>
                                    <strong>Số lượng công việc:  </strong>
                                    {details.listTask.length}
                                </a>
                                <DetailOfTaskDialogModal listTask={details.listTask}/>
                            </div>

                            <div className="form-group">
                                <a title="Chi tiết người tham gia" data-toggle="modal" data-target="#modal-participant-detail" data-backdrop="static" data-keyboard="false" style={{ cursor: "pointer" }}>
                                    <strong>Số người tham gia:  </strong>
                                    {details.listParticipant.length}
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <button className="btn btn-danger" onClick={() => {
                            window.$(`#details-of-organizational-unit-kpi-form`).slideUp()
                        }}>{ translate('form.close') }</button>
                    </div>
                </fieldset>
            </div>
        )
    }

}

function mapState(state) {
    const { } = state;
    return { };
}

const actions = {

}

const connectDetailsOfOrganizationalUnitKpiForm = connect(mapState, actions)(withTranslate(DetailsOfOrganizationalUnitKpiForm));
export { connectDetailsOfOrganizationalUnitKpiForm as DetailsOfOrganizationalUnitKpiForm }