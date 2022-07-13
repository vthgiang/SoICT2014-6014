import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { SelectBox } from '../../../../common-components'
import { convertUserIdToUserName, getListDepartments } from '../../../project/projects/components/functionHelper'
import getEmployeeSelectBoxItems from '../../../task/organizationalUnitHelper'

const BidAndProjectStatistic = (props) => {
    const { biddingPackagesManager, biddingContract, project, user } = props;
    const listUsers = user && user.usersInUnitsOfCompany ? getEmployeeSelectBoxItems(user.usersInUnitsOfCompany) : []
    const listDepartments = user && user.usersInUnitsOfCompany ? getListDepartments(user.usersInUnitsOfCompany) : []
    const listActiveBiddingPackage = biddingPackagesManager?.listActiveBiddingPackage;
    const contractInit = biddingContract.listBiddingContractStatistic.find(x => x.biddingPackage?._id === listActiveBiddingPackage[0]?._id);
    const [state, setState] = useState({
        bid: listActiveBiddingPackage[0],
        contract: contractInit,
        projectBP: contractInit?.project,
    })

    useEffect(() => {
        let bp = biddingPackagesManager?.listActiveBiddingPackage[0];
        if (bp) {
            const contract = biddingContract.listBiddingContractStatistic.find(x => x.biddingPackage?._id === bp._id);
            const project = contract?.project;

            setState({
                ...state,
                bid: bp,
                contract: contract,
                projectBP: project,
            })
        }
    }, [JSON.stringify(listActiveBiddingPackage), JSON.stringify(biddingContract.listBiddingContractStatistic)]);

    const formatTimeOfEffection = (unitOfTime, effectiveDate, endDate) => {
        let result = 100
        let fmEndDate = moment(endDate)
        let fmEffDate = moment(effectiveDate)
        result = fmEndDate.diff(fmEffDate, unitOfTime, true)

        return result.toFixed(2)
    }

    const formatDate = (date, monthYear = false) => {
        if (date) {
            let d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            if (monthYear === true) {
                return [month, year].join('-');
            } else return [day, month, year].join('-');
        } else {
            return date
        }
    }

    const handleChangeBiddingPackage = (value) => {
        if (value.length === 0) {
            value = null
        };
        let bp = biddingPackagesManager?.listActiveBiddingPackage?.find(x => x._id == value[0])
        if (bp) {
            const contract = biddingContract.listBiddingContractStatistic.find(x => x.biddingPackage?._id === value[0]);
            const project = contract?.project;

            setState({
                ...state,
                bid: bp,
                contract: contract,
                projectBP: project,
            })
        }
        else {
            setState({
                ...state,
                bid: null,
                contract: null,
                projectBP: null,
            })
        }
    }

    const checkInArr = (item, arr) => {
        let check = arr.find(x => String(x) === String(item));
        if (check) return true;
        return false;
    }

    const checkInMembers = (item, arrMember) => {
        let check = arrMember.find(x => String(x._id) === String(item));
        if (check) return true;
        return false;
    }

    const { bid, contract, projectBP } = state;

    return (
        <div className="box box-primary">
            <div className="box-header with-border">
                <div className="box-title">Tương quan thông tin gói thầu và dự án</div>
            </div>
            <div className="box-body qlcv">
                <div className="form-inline" style={{ marginBottom: 15 }}>
                    {/* Tên gói thầu */}
                    <div className="form-group">
                        <label className="form-control-static">Chọn gói thầu</label>
                        <SelectBox
                            id={`statistic-select-package-statistic`}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={listActiveBiddingPackage?.map(x => {
                                return { text: x.name, value: x._id }
                            })}
                            options={{ placeholder: "Chọn gói thầu" }}
                            onChange={handleChangeBiddingPackage}
                            value={bid?._id}
                            multiple={false}
                        />
                    </div>
                </div>
                <br />
                <div className="box-body" style={{ padding: "0 30px" }}>
                    <div className="row">
                        <div className="col-md-6">
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">Thông tin của gói thầu</legend>
                                {
                                    bid ? <div style={{ lineHeight: 2 }}>
                                        <div><strong>Thời gian thực hiện dự kiến: &nbsp;</strong>{bid?.proposals?.executionTime} ({bid?.proposals?.unitOfTime})</div>
                                        <div><strong>Dự toán gói thầu: &nbsp;</strong>{bid?.price} (VND)</div>
                                        {
                                            contract && <div>
                                                <div>
                                                    <strong>Người quản lý: &nbsp;</strong>
                                                    <ul>
                                                        {
                                                            contract?.decideToImplement?.projectManager?.map((x, idx) => {
                                                                return <li key={`bp-pm-${idx}`}>
                                                                    <span>{convertUserIdToUserName(listUsers, x)}</span>
                                                                </li>
                                                            })
                                                        }
                                                    </ul>
                                                </div>
                                                <div>
                                                    <strong>Thành viên dự án: &nbsp;</strong>
                                                    <ul>
                                                        {
                                                            contract?.decideToImplement?.responsibleEmployees?.map((x, idx) => {
                                                                return <li key={`bp-res-${idx}`}>
                                                                    <span>{convertUserIdToUserName(listUsers, x)}</span>
                                                                </li>
                                                            })
                                                        }
                                                    </ul>
                                                </div>
                                            </div>
                                        }
                                    </div> : <span>Không có thông tin đề xuất liên quan đến gói thầu này</span>
                                }
                            </fieldset>
                        </div>
                        <div className="col-md-6">
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">Thông tin dự án theo gói thầu</legend>
                                {
                                    projectBP ? <div style={{ lineHeight: 2 }}>
                                        <div>
                                            <strong>Thời gian thực hiện: &nbsp;</strong>
                                            <span style={formatTimeOfEffection(projectBP?.unitTime, projectBP?.startDate, projectBP?.endDate) < Number(bid?.proposals?.executionTime) ? { color: "green", fontWeight: 600 } : { color: "red", fontWeight: 600 }}>{formatTimeOfEffection(projectBP?.unitTime, projectBP?.startDate, projectBP?.endDate)} </span>({projectBP?.unitTime})
                                        </div>
                                        <div>
                                            <strong>Ngân sách dự án: &nbsp;</strong>
                                            <span style={Number(projectBP?.budget) < Number(bid?.price) ? { color: "green", fontWeight: 600 } : { color: "red", fontWeight: 600 }}>{projectBP?.budget} </span>(VND)
                                        </div>
                                        <div>
                                            <strong>Người quản lý: &nbsp;</strong>
                                            <ul>
                                                {
                                                    projectBP?.projectManager?.map((x, idx) => {
                                                        return <li key={`prj-pm-${idx}`} style={checkInArr(x._id, contract?.decideToImplement?.projectManager) ? {} : { color: "red", fontWeight: 600 }}>
                                                            <span>{x.name}</span>
                                                        </li>
                                                    })
                                                }
                                            </ul>
                                        </div>
                                        <div>
                                            <strong>Thành viên dự án: &nbsp;</strong>
                                            <ul>
                                                {
                                                    projectBP?.responsibleEmployees?.map((x, idx) => {
                                                        return <li key={`prj-res-${idx}`} style={checkInArr(x._id, contract?.decideToImplement?.responsibleEmployees) ? {} : { color: "red", fontWeight: 600 }}>
                                                            <span>{x.name}</span>
                                                        </li>
                                                    })
                                                }
                                            </ul>
                                        </div>

                                        {
                                            (projectBP?.budgetChangeRequest || projectBP?.endDateRequest) && (
                                                <div>
                                                    <strong>Thay đổi phát sinh trong dự án: &nbsp;</strong>
                                                    <ul>
                                                        {projectBP?.budgetChangeRequest && projectBP?.budgetChangeRequest !== projectBP?.budget &&
                                                            <li key={`budgetChangeRequest}`}>
                                                                Ngân sách ước lượng hiện tại: <span style={Number(projectBP?.budgetChangeRequest) < Number(bid?.price) ? { color: "green", fontWeight: 600 } : { color: "red", fontWeight: 600 }}>
                                                                    {projectBP?.budgetChangeRequest} &nbsp;(VND)
                                                                </span>
                                                            </li>
                                                        }
                                                        {projectBP?.endDateRequest &&
                                                            // formatTimeOfEffection(projectBP?.unitTime, projectBP?.startDate, projectBP?.endDateRequest) < Number(bid?.proposals?.executionTime) &&
                                                            formatTimeOfEffection(projectBP?.unitTime, projectBP?.startDate, projectBP?.endDateRequest) !== formatTimeOfEffection(projectBP?.unitTime, projectBP?.startDate, projectBP?.endDate) &&
                                                            <li key={`endDateRequest}`} >
                                                                Ngày kết thúc thay đổi từ <span style={{ fontWeight: 600 }}>{formatDate(projectBP?.endDate)}</span> thành <span style={formatTimeOfEffection(projectBP?.unitTime, projectBP?.startDate, projectBP?.endDateRequest) < Number(bid?.proposals?.executionTime) ? { color: "green", fontWeight: 600 } : { color: "red", fontWeight: 600 }}>{formatDate(projectBP?.endDateRequest)}</span>
                                                                <br />
                                                                Thời gian thực hiện hiện tại: <span style={formatTimeOfEffection(projectBP?.unitTime, projectBP?.startDate, projectBP?.endDateRequest) < Number(bid?.proposals?.executionTime) ? { color: "green", fontWeight: 600 } : { color: "red", fontWeight: 600 }}>{formatTimeOfEffection(projectBP?.unitTime, projectBP?.startDate, projectBP?.endDateRequest)} </span>&nbsp;({projectBP?.unitTime})
                                                            </li>
                                                        }
                                                    </ul>
                                                </div>
                                            )
                                        }
                                    </div> : <span>Không có thông tin dự án liên quan đến gói thầu này</span>
                                }
                            </fieldset>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => (state)

const mapDispatchToProps = {
    // getAllBiddingPackage: BiddingPackageManagerActions.getAllBiddingPackage,
}

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(withTranslate(BidAndProjectStatistic));
export { connectedComponent as BidAndProjectStatistic }
