import React, { useEffect, useState } from 'react';
import { riskResponsePlanActions } from '../redux/actions'
import { withTranslate } from "react-redux-multilingual";
import { connect } from 'react-redux';
import { getRelevantEvents } from '@fullcalendar/common';
import dayjs from 'dayjs'
import { DataTableSetting, DeleteNotification, PaginateBar } from "../../../../common-components";
import { CreateRiskResponsePlan } from './createRiskResponsePlan';
import parse from 'html-react-parser';
import { getRankingStr } from './helper'
import { RiskDistributionActions } from '../../risk-dash-board/redux/actions';
import { EditRiskResponsePlan } from './editRiskResponsePlan';
import { ViewRiskResponsePlan } from './viewRiskResponsePlan';
import { RequestCreateRiskResponsePlan } from './requestCreateRiskResponse';

const RiskResponsePlanManagement = (props) => {
    const initState = {
        name: '',
        page: 1,
        riskEdit: null,
        riskId: null,
        perPage: 10,
        tableId: 'risk-response-table',
        currentRow: null,
        currentRowDetail: null,
        currentRowApprove: null,
        lists: [],
    }

    const { translate,
        getRiskResponsePlans,
        riskResponsePlan,
        getRiskDistributions,
        riskDistribution
    } = props
    const [state, setState] = useState(initState)
    const [show, setShow] = useState({
        showEdit: false,
        showDetail: false
    })
    const { tableId, lists, page, perPage, currentRow, currentRowDetail } = state
    
    useEffect(() => {
        getRiskDistributions()
        getRiskResponsePlans({ page: page, perPage: perPage })
    }, [])
    useEffect(() => {
        if (props.riskResponsePlan.lists.length != 0) {
            let lists = props.riskResponsePlan.lists
            setState({
                ...state,
                lists: lists
            })
            console.log('lists', lists)
        }

    }, [props.riskResponsePlan.lists])
    useEffect(() => {
        window.$('#modal-detail-risk-response-plan').modal('show')
    }, [show.showDetail])
    useEffect(() => {
        window.$('#modal-edit-risk-response-plan').modal('show')
    }, [show.showEdit])
    const setLimit = (number) => {
        setState({
            ...state,
            perPage: parseInt(number),
            page: 1
        });
        getRiskResponsePlans({ page: 5, perPage: 20 })
    }
    const handleDelete = (id) => {
        props.deleteRiskResponsePlan(id);
        props.getRiskResponsePlans({
            perPage,
            page: props.riskResponsePlan?.lists?.length === 1 ? page - 1 : page
        });
    }

    const handleEdit = (riskPlan) => {
        console.log('edit risk', riskPlan)
        setState({
            ...state,
            currentRow: riskPlan
        });
        setShow({
            ...show,
            showEdit: !show.showEdit
        })
    }
    const handleShowDetail = (riskPlan) => {
        setState({
            ...state,
            currentRowDetail: riskPlan
        })
        setShow({
            ...show,
            showDetail: !show.showDetail
        })
    }
    /**
     * Hàm xử lý khi click chuyển trang
     * @param {*} pageNumber Số trang định chuyển
     */
    const setPage = (pageNumber) => {
        setState({
            ...state,
            page: parseInt(pageNumber)
        });

        props.getRiskResponsePlans({
            perPage,
            page: parseInt(pageNumber)
        });
    }
    const getRiskNameFormId = (id) => {
        let risk = riskDistribution.lists.find(r => r.riskID == id)
        return risk.name
    }
    const totalPage = riskResponsePlan && Math.ceil(riskResponsePlan.totalList / perPage);
    // console.log(totalPage)
    const [search,setSearch] = useState({
        name:'',
        level:undefined
    })
    useEffect(()=>{
        let {name,level} = search
        let data = props.riskResponsePlan.lists.filter(rp =>level? 
            getRiskNameFormId(rp.riskApply).toUpperCase().includes(name.toUpperCase())&&
            rp.riskLevel==level: getRiskNameFormId(rp.riskApply).toUpperCase().includes(name.toUpperCase())
            )
        setState({
            ...state,
            lists:data
        })
    },[search])
    const handleChange = (event) =>{
        let name = event.target.name
        let val = event.target.value
        if(name == "name"){
            setSearch({
                ...search,
                name:val
            })
        }else{
            setSearch({
                ...search,
                level:parseInt(val)
            })
        }
    }
    return (
        <React.Fragment>
            <CreateRiskResponsePlan />
            <RequestCreateRiskResponsePlan />
            {currentRowDetail != null && <ViewRiskResponsePlan riskPlanDetail={currentRowDetail}></ViewRiskResponsePlan>}
            {currentRow != null && <EditRiskResponsePlan data={currentRow} />}
            <div className="box" style={{ minHeight: "450px" }}>
                {/* {props.inForm&&(
                    <div className="box-header">
                         <div className="box-title">Biện pháp ứng phó rủi ro<span className="text-red">*</span></div>
                    </div>
                   
                )} */}
                <div className="box-body ">
                    <div className="box-body qlcv">
                    <div className="form-inline">
                            {/* Button thêm mới */}

                            <div className="dropdown pull-right" style={{ marginBottom: 15 }}>
                                <button
                                    type="button"
                                    className="btn btn-success"
                                    onClick={() => {
                                        window.$('#modal-create-risk-response-plan').modal('show')
                                    }}
                                >{translate('manage_risk_plan.add')}</button>

                            </div>
                        </div>
                    <div className="form-inline search">
                            <div className="form-group col-sm-6">
                
                                <input className="form-control" name = "name" type="text" placeholder={translate('manage_risk_plan.riskApplyName')} onChange={handleChange} />
            
                            </div>
                            <div className="form-group col-sm-6">
                                {/* <label className="form-control-static col-sm-12">{translate('manage_risk.risk_management_table.status')}</label> */}
                                <select name = "level" className="form-control" onChange={handleChange}>
                                    <option value = "">{translate('manage_risk_plan.risk_level')}</option>
                                    {[1,2,3,4,6,8,9, 12,16].map((val, index) => (
                                        <option key={index} value={val}>
                                            {getRankingStr(translate,val)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    
                        <table id={tableId} className="table table-striped table-bordered table-hover">
                            <thead>
                                <tr>
                                    {props.inForm ?
                                        (
                                            <th className="col-fixed" style={{ width: 70 }}>{translate('process_analysis.process_list.select')}</th>
                                        )
                                        : (
                                            <th className="col-fixed" style={{ width: 70 }}>{translate('manage_risk_plan.index')}</th>
                                        )
                                    }

                                    <th>{translate('manage_risk_plan.riskApplyName')}</th>
                                    <th>{translate('manage_risk_plan.risk_level')}</th>
                                    <th>{translate('manage_risk_plan.apply_case')}</th>
                                    <th>{translate('manage_risk_plan.last_update')}</th>

                                    <th style={{ width: "120px", textAlign: "center" }}>{translate('table.action')}
                                        <DataTableSetting
                                            tableId={tableId}
                                            columnArr={[

                                                translate('manage_risk_plan.riskApplyName'),
                                            ]}
                                            setLimit={setLimit}
                                        />
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {riskDistribution.lists.length != 0 && lists.length != 0 && lists.map((riskPlan, index) => (
                                    <tr key={index}>
                                        {props.inForm ?
                                            (
                                                <td style={{ textAlign: "center" }}>
                                                    <input class="form-check-input" type="checkbox" onChange={(e) => props.handleSelect(e, riskPlan)}></input>
                                                </td>
                                            ) :
                                            (
                                                <td>{index + 1 + (page - 1) * perPage}</td>
                                            )
                                        }

                                        <td>{getRiskNameFormId(riskPlan.riskApply)}</td>

                                        <td>{getRankingStr(translate,riskPlan.riskLevel)}</td>
                                        <td>{parse(riskPlan.applyCase)}</td>
                                        <td>{dayjs(riskPlan.updatedAt).format('DD/MM/YYYY HH:mm:ss')}</td>

                                        <td style={{ textAlign: "center" }}>
                                            <a className="edit text-green" style={{ width: '5px' }} title={translate('manage_risk_plan.detail')} onClick={() => handleShowDetail(riskPlan)}><i className="material-icons">visibility</i></a>
                                            <a className="edit text-yellow" style={{ width: '5px' }} title={translate('manage_risk_plan.edit')} onClick={() => handleEdit(riskPlan)}><i className="material-icons">edit</i></a>
                                            <DeleteNotification
                                                content={translate('manage_risk_plan.delete')}
                                                data={{
                                                    id: riskPlan._id,
                                                    info: riskDistribution.lists.find(r => r.riskID == riskPlan.riskApply).name
                                                }}
                                                func={handleDelete}
                                            />
                                        </td>


                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {/* PaginateBar */}
                        {riskResponsePlan && riskResponsePlan.isLoading ?
                            <div className="table-info-panel">{translate('confirm.loading')}</div> :
                            (typeof lists === 'undefined' || lists.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                        }
                        <PaginateBar
                            pageTotal={totalPage ? totalPage : 0}
                            currentPage={page}
                            display={lists && lists.length !== 0 && lists.length}
                            total={props.riskResponsePlan && props.riskResponsePlan.totalList}
                            func={setPage}
                        />
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}
function mapState(state) {
    const { riskDistribution, riskResponsePlan } = state
    // console.log(risk)
    return { riskDistribution, riskResponsePlan }
}

const actions = {
    getRiskResponsePlans: riskResponsePlanActions.getRiskResponsePlans,
    createRiskResponsePlan: riskResponsePlanActions.createRiskResponsePlan,
    deleteRiskResponsePlan: riskResponsePlanActions.deleteRiskResponsePlan,
    getRiskDistributions: RiskDistributionActions.getRiskDistributions,

}
const connectedRiskResponsePlanManagement = connect(mapState, actions)(withTranslate(RiskResponsePlanManagement));
export { connectedRiskResponsePlanManagement as RiskResponsePlanManagement };