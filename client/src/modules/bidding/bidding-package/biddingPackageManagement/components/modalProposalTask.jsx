import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DataTableSetting, DialogModal } from '../../../../../common-components';
import { nonAccentVietnamese, stringToSlug } from '../../../../../helpers/stringMethod';

import { EmployeeManagerActions } from '../../../../human-resource/profile/employee-management/redux/actions';
import { taskManagementActions } from '../../../../task/task-management/redux/actions';
import { BiddingPackageManagerActions } from '../redux/actions';
import getAllEmployeeSelectBoxItems, { getEmployeeInfoWithTask } from './employeeHelper';

const ModalProposeEmpForTask = (props) => {
    const [state, setState] = useState({
        id: "",
        page: 1,
        limit: 10,
        nameSearch: "",
    });
    const [proposedData, setProposedData] = useState({
        proposal: null,
        isComplete: 0,
    });

    // proposals: proposals,
    // biddingPackage: biddingPackage,
    // unitOfTime: proposals?.unitOfTime,
    // executionTime: proposals?.executionTime,
    const [dataProp, setDataProp] = useState(props.data);
    const save = async () => {
        console.log(18, proposedData);
        if (proposedData.isComplete) {
            props.handleAcceptProposal(proposedData.proposal)
        }
    }

    const { biddingPackagesManager, translate } = props;
    const { id } = state;

    useEffect(() => {
        setState({ ...state, id: props.id })
        setDataProp(props.data);
    }, [props.id,
        // JSON.stringify(props.data)
    ]);

    const handlePropose = () => {
        props.proposeEmployeeForTask(null, {
            tags: dataProp.proposals?.tags,
            tasks: dataProp.proposals?.tasks,
            biddingPackage: dataProp.biddingPackage,
            unitOfTime: dataProp.unitOfTime,
            executionTime: dataProp.executionTime
        })
    }

    useEffect(() => {
        if (biddingPackagesManager.propsalData) {
            setProposedData(biddingPackagesManager.propsalData)
        }
    }, [JSON.stringify(biddingPackagesManager.propsalData)])

    return (
        <React.Fragment>
            <DialogModal
                size='50' modalID={`modal-view-propose-emp-for-task-${id}`}
                formID={`form-view-propose-emp-for-task-${id}`}
                title="Đề xuất nhân sự tự động"
                func={save}
                resetOnSave={true}
                resetOnClose={true}
                disableSubmit={!proposedData.isComplete}
            >
                <div className='box-body' style={{ lineHeight: 2 }}>

                    <button type='button' className='btn btn-success' onClick={() => handlePropose()}>Đề xuất</button>
                    <br />
                    <br />
                    <span><strong>Trạng thái đề xuất: &nbsp;</strong>
                        {
                            proposedData.isComplete ? <p style={{ color: "green" }}>Đã tính toán đề xuất xong!</p> : <p style={{ color: "red" }}>Không tính toán được!</p>
                            // JSON.stringify(biddingPackagesManager.propsalData)
                        }
                    </span>
                </div>

            </DialogModal>
        </React.Fragment>
    );
};


function mapState(state) {
    const { biddingPackagesManager, user, tasks } = state;
    return { biddingPackagesManager, user, tasks };
}

const actionCreators = {
    proposeEmployeeForTask: BiddingPackageManagerActions.proposeEmployeeForTask,
};

const connectComponent = connect(mapState, actionCreators)(withTranslate(ModalProposeEmpForTask));
export { connectComponent as ModalProposeEmpForTask };
