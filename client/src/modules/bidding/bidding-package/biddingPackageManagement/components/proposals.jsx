import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ErrorLabel, SelectBox } from '../../../../../common-components';
import { UserActions } from '../../../../super-admin/user/redux/actions';
import getEmployeeSelectBoxItems from '../../../../task/organizationalUnitHelper';
import { EmployeeManagerActions } from '../../../../human-resource/profile/employee-management/redux/actions';
import getAllEmployeeSelectBoxItems from './employeeHelper';

function Proposals(props) {
    const arrUnitTimeList = [
        { text: 'Ngày', value: 'days' },
        { text: 'Giờ', value: 'hours' },
        { text: 'Tháng', value: 'months' },
    ]
    const initData = {
        taskName: "",
        taskDescription: "",
        directEmployees: [],
        backupEmployees: [],
        estimateTime: "",
        unitOfTime: "days",
    }
    const initProposal = {
        executionTime: 0,
        unitOfTime: "days",
        tasks: [],
    }
    const [state, setState] = useState({
    });

    const [proposals, setProposals] = useState(props.biddingPackage.proposals ? props.biddingPackage.proposals : initProposal)
    const { translate, employeesManager } = props;
    const { id, bidPackageid, type } = state;

    const handleChangeForm = (key, e, listIndex) => {
        let unitTime = proposals.unitOfTime;
        let { value } = e.target;

        let newList = proposals.tasks.map((item, index) => {
            if (index === listIndex) {
                return {
                    ...item,
                    [key]: value,
                    unitOfTime: unitTime,
                }
            }
            return item;
        })

        let newProposal = {
            ...proposals,
            tasks: newList,
        }

        setProposals(newProposal);
        props.handleChange("proposals", newProposal);
    }

    const handleChangeData = (key, e) => {
        let { value } = e.target;

        let newProposal = {
            ...proposals,
            [key]: value
        }

        setProposals(newProposal);
        props.handleChange("proposals", newProposal);
    }

    const handleChangeUnitTime = (key, value) => {
        let newProposal = {
            ...proposals,
            [key]: value[0]
        }

        setProposals(newProposal);
        props.handleChange("proposals", newProposal);
    }

    const handleChangeSelectValue = (key, value, listIndex) => {
        let unitTime = proposals.unitOfTime;
        let newList = proposals.tasks.map((item, index) => {
            if (index === listIndex) {
                return {
                    ...item,
                    [key]: value,
                    unitOfTime: unitTime,
                }
            }
            return item;
        })

        let newProposal = {
            ...proposals,
            tasks: newList,
        }

        setProposals(newProposal);
        props.handleChange("proposals", newProposal);
    }

    const handleChangeSingleSelectForm = (key, value, listIndex) => {
        let unitTime = proposals.unitOfTime;
        let newList = proposals.tasks.map((item, index) => {
            if (index === listIndex) {
                return {
                    ...item,
                    [key]: value[0],
                    unitOfTime: unitTime,
                }
            }
            return item;
        })

        let newProposal = {
            ...proposals,
            tasks: newList,
        }

        setProposals(newProposal);
        props.handleChange("proposals", newProposal);
    }

    const handleDeleteProposal = (listIndex) => {
        let newList = proposals.tasks
        newList.splice(listIndex, 1)

        let newProposal = {
            ...proposals,
            tasks: newList,
        }

        setProposals(newProposal);
        props.handleChange("proposals", newProposal);
    }

    const handleAddProposal = () => {
        let newList = proposals.tasks


        newList.push(initData);
        let newProposal = {
            ...proposals,
            tasks: newList,
        }

        setProposals(newProposal);
        props.handleChange("proposals", newProposal);
    }

    useEffect(() => {
        props.getAllEmployee();
        setState({ ...state, id: props.id })
    }, [props.id])

    let allEmployee;
    if (employeesManager && employeesManager.listAllEmployees) {
        allEmployee = employeesManager.listAllEmployees
    }

    let allEmployeeCompany = getAllEmployeeSelectBoxItems(allEmployee)

    console.log(proposals);
    return (
        <div id={id} className="tab-pane">

            <fieldset className="scheduler-border">
                <legend className="scheduler-border">Đề xuất thời gian</legend>
                <div className="form-group">
                    <label>Thời gian thực hiện<span className="text-red">*</span></label>
                    <input type="number" className="form-control" name={`executeTime`} onChange={(value) => handleChangeData("executionTime", value)} value={proposals.executionTime} placeholder="Thời gian thực hiện" autoComplete="off" />
                </div>
                <div className="form-group">
                    <label>Đơn vị thời gian<span className="text-red">*</span></label>
                    <SelectBox
                        id={`select-proposal-bidding-unitOfTime`}
                        className="form-control select2"
                        style={{ width: "100%" }}
                        items={arrUnitTimeList}
                        onChange={(value) => handleChangeUnitTime("unitOfTime", value)}
                        value={proposals.unitOfTime}
                        multiple={false}
                    />
                </div>
            </fieldset>
            <fieldset className="scheduler-border">
                <legend className="scheduler-border">Đề xuất công việc</legend>
                { // (bidPackageid && type === "edit" || type === "create") &&
                    proposals?.tasks?.length > 0 ? proposals?.tasks?.map((item, listIndex) => {
                        return (
                            <div key={listIndex} className="box-body" style={{ border: '1px solid #ccc', marginBottom: '10px' }}>
                                <div className="row" style={{ marginRight: '5px' }}>
                                    <button className='pull-right btn btn-danger' style={{ fontWeight: 700 }} onClick={() => handleDeleteProposal(listIndex)}>–</button>
                                </div>
                                <div className="row" style={{ paddingTop: '10px' }}>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Tên công việc<span className="text-red">*</span></label>
                                            <input type="text" className="form-control" name={`taskName-${listIndex}`} onChange={(value) => handleChangeForm("taskName", value, listIndex)} value={item.taskName} placeholder="Tên công việc" autoComplete="off" />
                                            <ErrorLabel content={item.taskNameError} />
                                        </div>

                                        <div className="form-group">
                                            <label>Mô tả công việc</label>
                                            <textarea type="text" rows={4} style={{ minHeight: '103.5px' }}
                                                name={`count-${listIndex}`}
                                                onChange={(value) => handleChangeForm("taskDescription", value, listIndex)}
                                                value={item.taskDescription}
                                                className="form-control"
                                                placeholder="Mô tả công việc"
                                                autoComplete="off"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Thời gian thực hiện<span className="text-red">*</span></label>
                                            <input type="number" className="form-control" name={`estimateTime-${listIndex}`} onChange={(value) => handleChangeForm("estimateTime", value, listIndex)} value={item.estimateTime} placeholder="Thời gian thực hiện" autoComplete="off" />
                                        </div>
                                        {/* <div className="form-group">
                                            <label>Đơn vị thời gian<span className="text-red">*</span></label>
                                            <SelectBox
                                                id={`select-proposal-bidding-unitTime`}
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                items={arrUnitTimeList}
                                                onChange={(value) => handleChangeSingleSelectForm("unitOfTime", value, listIndex)}
                                                value={item.unitOfTime}
                                                multiple={false}
                                            />
                                        </div> */}
                                        <div className={`form-group`}>
                                            <label className="control-label">Nhân sự trực tiếp<span className="text-red">*</span></label>
                                            {allEmployeeCompany && <SelectBox
                                                id={`direct-employee-${listIndex}-${id}`}
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                items={allEmployeeCompany ? allEmployeeCompany : []}
                                                onChange={(value) => handleChangeSelectValue("directEmployees", value, listIndex)}
                                                options={{ placeholder: "Chọn nhân sự trực tiếp" }}
                                                value={item.directEmployees}
                                                multiple={true}
                                            />}
                                        </div>
                                        <div className={`form-group`}>
                                            <label className="control-label">Nhân sự dự phòng<span className="text-red">*</span></label>
                                            {allEmployeeCompany && <SelectBox
                                                id={`backup-employee-${listIndex}-${id}`}
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                items={allEmployeeCompany ? allEmployeeCompany : []}
                                                onChange={(value) => handleChangeSelectValue("backupEmployees", value, listIndex)}
                                                options={{ placeholder: "Chọn nhân sự dự phòng" }}
                                                value={item.backupEmployees}
                                                multiple={true}
                                            />}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }) : <span>Chưa có thông tin công việc đề xuất <br /></span>
                }
                <button className='btn btn-success' onClick={() => { handleAddProposal() }}>Thêm</button>
            </fieldset>
        </div>
    );
};


function mapState(state) {
    const { employeesManager } = state;
    return { employeesManager };
}

const actionCreators = {
    getAllEmployee: EmployeeManagerActions.getAllEmployee,
};

const connectComponent = connect(mapState, actionCreators)(withTranslate(Proposals));
export { connectComponent as Proposals };