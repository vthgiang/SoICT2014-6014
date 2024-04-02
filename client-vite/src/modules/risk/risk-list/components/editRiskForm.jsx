import React, { useState, useEffect, useRef } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';

import { ButtonModal, DialogModal, ErrorLabel, DatePicker, TimePicker, SelectBox, ToolTip, TreeSelect, QuillEditor } from '../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import ValidationHelper from '../../../../helpers/validationHelper';
import getEmployeeSelectBoxItems from '../../organizationalUnitHelper';
import { getRiskSelectBoxItems, getTaskSelectBox, getRiskParentBox,getImpactStr, getRankingStr, getRankingColor, convertDate } from '../../riskHelper';
import { riskActions } from '../redux/actions';
import { UserActions } from '../../../super-admin/user/redux/actions';
import { RoleActions } from '../../../super-admin/role/redux/actions';
import { RiskDistributionActions } from '../../risk-dash-board/redux/actions'
import { taskManagementActions } from '../../../task/task-management/redux/actions';
import dayjs from "dayjs";
import { getStorage } from '../../../../config';
import './createRisk.css'
import { SelectTaskFromList } from './selectTaskFromList'
import {RiskMatrix} from '../../risk-dash-board/components/riskMatrix'

function EditRiskForm(props) {
    const [resetFlag, setResetFlag] = useState(false)
    const { translate, risk, page, perPage, riskID, riskData } = props;
    useEffect(()=>{
        console.log('riskData',riskData)
    },[])
    // Khởi tạo state
    const initState = {
        riskNameList: [],
        allUnitsMember: [],
        riskName: riskData.riskName,
        description: riskData.description,
        occurrenceDate: riskData.occurrenceDate,
        responsibleEmployees: [getStorage("userId")],
        riskParents: [],
        responsibleTasks: [],
        accountableEmployees: [riskData.accountableEmployees.map(u=>u._id)],
        riskNameError: {
            message: undefined,
            status: true
        },
        riskStatus: riskData.riskStatus,
        ranking: riskData.ranking,
        impactLevel: 0,
        probLevel: 0,
        riskDis: null,
        taskRelateList: riskData.taskRelate
    }
    const [time, setTime] = useState({
        raisedTime: "08:00 AM",
        occurrenceTime: "05:00 PM",
    })
    const [state, setState] = useState(initState)
    const initImpact = {
        type: 1,
        levelTitle: '',
        description: '',
        health: 0,
        security: 0,
        enviroment: 0,

    }
    const initCheckBoxImpact = {
        health: riskData.impact.health!=0?true:false,
        security: riskData.impact.security!=0?true:false,
        enviroment: riskData.impact.enviroment!=0?true:false
    }
    const [impact, setImpact] = useState(riskData.impact)

    const [checkBox, setCheckBox] = useState(initCheckBoxImpact)
    useEffect(() => {
        console.log('riskData Change', riskData)
        setState({
            ...state,
            riskNameList: [],
            allUnitsMember: [],
            riskName: riskData.riskName,
            description: riskData.description,
            occurrenceDate: riskData.occurrenceDate,
            responsibleEmployees: [getStorage("userId")],
            riskParents: [],
            responsibleTasks: [],
            accountableEmployees: [riskData.accountableEmployees.map(u=>u._id)],
            riskNameError: {
                message: undefined,
                status: true
            },
            riskStatus:riskData.riskStatus,
            ranking: riskData.ranking,
            impactLevel: 0,
            probLevel: 0,
            riskDis: null,
            taskRelateList: riskData.taskRelate
        })
        setImpact(riskData.impact)
        setCheckBox({
            health: riskData.impact.health!=0?true:false,
            security: riskData.impact.security!=0?true:false,
            enviroment: riskData.impact.enviroment!=0?true:false
        })
    }, [riskID])
    
    
    const {
        riskName,
        riskNameError,
        description,
        occurrenceDate,
        responsibleEmployees,
        riskNameList,
        accountableEmployees,
        allUnitsMember,
        responsibleTasks,
        riskParents,
        riskStatus,
        ranking,
        probLevel,
        taskRelateList
    } = state;
    const {
        raisedTime,
        occurrenceTime
    } = time;
    if (props.user.usersInUnitsOfCompany != undefined && props.user.usersInUnitsOfCompany.length != 0 && allUnitsMember.length == 0) {
        setState({
            ...state,
            allUnitsMember: getEmployeeSelectBoxItems(props.user.usersInUnitsOfCompany)
        })

    }
    if (props.riskDistribution.lists != undefined && props.riskDistribution.lists.length != 0 && riskNameList.length == 0) {
        setState({
            ...state,
            riskNameList: props.riskDistribution.lists
        })
    }
    if (props.tasks.responsibleTasks != undefined && props.tasks.responsibleTasks.length != 0 && responsibleTasks.length == 0) {
        setState({
            ...state,
            responsibleTasks: props.tasks.responsibleTasks
        })
    }

   
    /**
     * Cập nhật các rủi ro cha khi tên rủi ro thay đổi
     */
    useEffect(() => {
        props.getAllUserInAllUnitsOfCompany();
        props.getRiskDistributions()
        props.getResponsibleTaskByUser([], 1, 1000, [], [], [], null, null, null, null, null, true)
        props.updateProb()
    }, [])

    useEffect(() => {
        if (riskName.length != 0) {
            // props.getParentsOfRisk({ name: riskName })
            // console.log('risk name Change', riskName)
            props.getRiskDistributionByName({ name: riskName })
            props.getTasksByRisk({ name: riskName })
        }

    }, [riskName])
    useEffect(() => {
        if (taskRelateList && taskRelateList != null) {
            setState({
                ...state,
                taskRelateList: taskRelateList
            })
        }
    }, [taskRelateList])
    useEffect(() => {
        setState({
            ...state,
            parents: props.riskDistribution.parents,
            // parentChecked: props.riskDistribution.parentChecked
        })

    }, [props.riskDistribution.parents])

    useEffect(() => {
        setState({
            ...state,
            riskDis: props.riskDistribution.listRiskById,
        })
        if (props.riskDistribution.listRiskById != null) {
            setState({
                ...state,
                probLevel: props.riskDistribution.listRiskById.prob
            })
        }

    }, [props.riskDistribution.listRiskById])

    useEffect(() => {
        let impactLevel = Math.max(impact.health, impact.security, impact.enviroment)
        // console.log('impact', impactLevel)
        if (probLevel == 0 || impactLevel == 0) {
            setState({
                ...state,
                ranking: 0
            })
        } else {
            let rankProb = 0;
            let probLevelTemp = probLevel * 100
            if (probLevelTemp > 0 && probLevelTemp < 5) rankProb = 1
            if (probLevelTemp >= 5 && probLevelTemp < 24) rankProb = 2
            if (probLevelTemp >= 25 && probLevelTemp < 75) rankProb = 3
            if (probLevelTemp >= 75) rankProb = 4
            // console.log('prob', probLevelTemp)
            setState({
                ...state,
                ranking: impactLevel * rankProb
            })
        }

    }, [probLevel, impact])
    useEffect(() => {
        // console.log('reset flag')
        props.getRisks({
            type:"getByUser",
            page: page,
            perPage: perPage
        });
    }, [resetFlag])
    /**
     * Hàm dùng để kiểm tra xem form đã được validate hay chưa
     */
    const isFormValidated = () => {
        return (taskRelateList.length != 0 && (impact.health + impact.security + impact.enviroment) > 0)
    }
    /**
     * Hàm dùng để lưu thông tin của form và gọi service tạo mới rui ro
     */
    const save = async () => {
        if (isFormValidated() && riskName) {
            console.log({
                riskName,
                description,
                // raisedDate,
                occurrenceDate,
                responsibleEmployees,
                accountableEmployees,
                taskRelateList,
                riskParents,
                riskStatus,
                // parentChecked,
                impact,
                ranking
            })
            await props.editRisk(riskID,{
                riskName,
                description,
                occurrenceDate,
                responsibleEmployees,
                accountableEmployees,
                taskRelateList,
                riskParents,
                riskStatus,
                impact,
                ranking
            });
            props.getRisks({
                type:"getByUser",
                page: page,
                perPage: perPage
            });
            // setState(initState)
            // setImpact(initImpact)
            // setCheckBox(initCheckBoxImpact)
        }

    }
    /**
     * Hàm xử ký khi tên rủi ro thay đổi
     * @param {*} value giá trị nhận về khi thay đổi
     */
    const handleChangeRiskName = (value) => {
        // console.log('gsse', impact)
        setState({
            ...state,
            riskName: value[0]
        })
    }
    /**
     * Hàm xử lý khi mô tả rủi ro thay đổi
     * @param {*} e 
     */
    const handleDescription = (value) => {
        // const { value } = e.target;
        // let result = ValidationHelper.validateName(translate, value, 6, 255);

        setState({
            ...state,
            description: value,
            // riskNameError: result
        })
    }
    /**
     * Hàm xử lý khi sửa mô tả của impact
     */
    const handleImpactDescription = (value) => {
        setImpact({
            ...impact,
            description: value
        })
    }
    /**
     * Hàm xử lý khi trường thời gian (ngày) thay đổi
     * @param {*} value 
     */
    const handleChangeRaisedDate = async (value) => {
        let newDate = convertDateTime(value, raisedTime)
        await setState({
            ...state,
            raisedDate: newDate
        })

    }
    /**
     * Hàm xử lý khi trường thời gian (ngày) thay đổi
     * @param {*} value 
     */
    const handleChangeOccurrenceDate = async (value) => {
        let newDate = convertDateTime(value, occurrenceTime)
        await setState({
            ...state,
            occurrenceDate: newDate
        })
    }
    /**
     * Hàm xử lý khi giờ thay đổi
     * @param {*} value 
     */
    const handleChangeOccurrenceTime = async (value) => {
        await setTime({
            ...time,
            occurrenceTime: value
        })
    }
    /**
     * Chuyển đổi thời gian sang format khác
     * @param {*} date 
     * @param {*} time 
     * @returns 
     */
    const convertDateTime = (date, time) => {
        let splitter = date.split("-");
        let strDateTime = `${splitter[2]}/${splitter[1]}/${splitter[0]} ${time}`;
        //////console.log(strDateTime)
        return dayjs(strDateTime).format('YYYY/MM/DD HH:mm:ss');
    }

    /**
     * Xử lý khi thay đổi người phê duyệt
     * @param {*} value 
     */
    const handleChangeTaskAccountableEmployees = (value) => {
        setState({
            ...state,
            accountableEmployees: value
        })
    }
    const handleChangeHsse = (event) => {
    
        console.log(event.target.name)
        console.log(event.target.value)
        setState({
            ...state,
            impactLevel: Math.max(impact.security, impact.health, impact.enviroment)
        })
        setImpact({
            ...impact,
            [event.target.name]: parseInt(event.target.value)
        })
    }
    const levelMap = new Map([
        [0,
            ['-----------', 'gray']
        ],
        [1,
            ['Thấp', 'green']
        ],
        [2,
            ['Trung Bình', 'yellow']
        ],
        [3,
            ['Cao', 'orange']
        ],
        [4,
            ['Rất cao', 'red']
        ]
    ])
    const getRiskProbabilityComponent = () => {

        if (props.riskDistribution.listRiskById == null)
            return (<div style={{ backgroundColor: 'gray', textAlign: 'center', display: 'block', float: 'left', fontWeight: 'bold', width: '200px' }}>
                <p>-----------</p>
                <p></p>
            </div>)
        let prob = props.riskDistribution.listRiskById.prob
        let rp = Math.round(prob * 10000) / 100
        let color = 'gray'
        let rankProb = 0
        if (prob > 0 && prob < 0.05) {
            color = 'green'
            rankProb = 1
        }
        if (prob >= 0.05 && prob < 0.24) {
            color = 'yellow'
            rankProb = 2
        }
        if (prob >= 0.25 && prob < 0.75) {
            color = 'orange'
            rankProb = 3
        }
        if (prob >= 0.75) {
            color = 'red'
            rankProb = 4

        }
        return {
            color:color,
            rankProb:rankProb,
            prob:rp+' %'
        }
        // return (<div style={{ width: '200px', backgroundColor: color, textAlign: 'center', display: 'block', float: 'left', fontWeight: 'bold' }}>
            // <p>{"(" + rankProb + ")"}</p>
            // <p>{rp + ' %'}</p>
        // </div>);
    }
    const getHsseImpactComponent = () => {
        if (impact.health == 0 && impact.security == 0 && impact.enviroment == 0) {
            return (<div style={{ backgroundColor: 'gray', textAlign: 'center', display: 'block', float: 'left', fontWeight: 'bold', width: '200px' }}>
                <p>-----------</p>
                <p></p>
            </div>)
        } else {
            let impactLevel = Math.max(impact.health, impact.security, impact.enviroment)
            let color = 'green'
            if (impactLevel == 1) color = 'green'
            if (impactLevel == 2) color = '#D7DF01'
            if (impactLevel == 3) color = 'orange'
            if (impactLevel == 4) color = 'red'
            return {
                impactLevel:impactLevel,
                impactStr:getImpactStr(translate,impactLevel),
                color:color
            }
            // return (<div style={{ width: '200px', backgroundColor: color, textAlign: 'center', display: 'block', float: 'left', fontWeight: 'bold' }}>
            //     <p>{impactLevel}</p>
            //     <p>{getImpactStr(translate, impactLevel)}</p>
            // </div>);
        }


    }
    return (
        <React.Fragment>
            <DialogModal
                modalID="modal-edit-risk" isLoading={risk.isLoading}
                formID="form-edit-risk"
                title={translate('manage_risk.add_title')}
                msg_success={translate('manage_risk.add_success')}
                msg_faile={translate('manage_risk.add_fail')}
                func={save}
                disableSubmit={!isFormValidated()}
                size={75}
                maxWidth={500}
            >
                <div className="box widget-box row" style={{marginLeft:'0%'}}>
                    <div class="col-sm-4">
                        <div class="info-box" style={{ backgroundColor: getRankingColor(ranking), color: 'white' }}>
                            <span class="info-box-icon"><i class="material-icons" style={{ fontSize: '100%' }}>poll</i></span>

                            <div class="info-box-content">
                                <span class="info-box-text">Ranking</span>
                                <span class="info-box-number">{ranking}</span>

                                <div class="progress">
                                    <div class="progress-bar" style={{ width: '100%' }}></div>
                                </div>
                                <span class="progress-description">
                                    {getRankingStr(translate, ranking)}
                                </span>
                            </div>

                        </div>

                    </div>
                    <div class="col-sm-4">
                        <div class="info-box" style={{ backgroundColor:getRiskProbabilityComponent().color, color: 'white' }}>
                            <span class="info-box-icon"><i class="fa fa-percent"></i></span>

                            <div class="info-box-content">
                                <span class="info-box-text">{translate('manage_risk.create_risk_form.probability')}</span>
                                <span class="info-box-number">{getRiskProbabilityComponent().rankProb}</span>

                                <div class="progress">
                                    <div class="progress-bar" style={{ width: '100%' }}></div>
                                </div>
                                <span class="progress-description">
                                {getRiskProbabilityComponent().prob}
                                </span>
                            </div>

                        </div>

                    </div>

                    <div class="col-sm-4">
                        <div class="info-box" style={{ backgroundColor: getHsseImpactComponent().color, color: 'white' }}>
                            <span class="info-box-icon"><i class="fa fa-street-view"></i></span>

                            <div class="info-box-content">
                                <span class="info-box-text">{translate('manage_risk.create_risk_form.impact')}</span>
                                <span class="info-box-number">{getHsseImpactComponent().impactLevel}</span>

                                <div class="progress">
                                    <div class="progress-bar" style={{ width: '100%' }}></div>
                                </div>
                                <span class="progress-description">
                                {getHsseImpactComponent().impactStr}
                                </span>
                            </div>

                        </div>

                    </div>
                </div>

                <div className="nav-tabs-custom" style={{ marginTop: '-15px' }}>
                    {/* Nav-tabs */}
                    <ul className="nav nav-tabs">
                        <li className="active"><a title={translate('manage_risk.add_tab.basic')} data-toggle="tab" href={`#edit_risk`}>{translate('manage_risk.add_tab.basic')}</a></li>
                        <li><a title={translate('manage_risk.add_tab.impact')} data-toggle="tab" href={`#edit_risk_impact`}>{translate('manage_risk.add_tab.impact')}</a></li>
                        <li><a title="Ma trận rủi ro" data-toggle="tab" href={`#edit-risk-matrix`}>{translate('manage_risk.create_risk_form.risk_matrix')}</a></li>

                    </ul>
                </div>

                <div className="tab-content">
                    <div id="edit_risk" className="tab-pane active" >


                        <form id="form-create-risk-hooks" onSubmit={() => save(translate('manage_risk.add_success'))}>
                            <div id="basic-info" className="col-md-6">
                                <fieldset className="scheduler-border">
                                    <legend className="scheduler-border">{translate('manage_risk.create_risk_form.basic_info')}</legend>
                                    <div className={`form-group`}>
                                        {/* Tên rủi ro */}
                                        <label className="control-label">{translate('manage_risk.riskName')}<span className="text-red">*</span></label>
                                        {riskNameList &&
                                            <SelectBox
                                                id={`edit-risk-select-box`}
                                                className="form-control"
                                                style={{ width: "100%" }}
                                                items={getRiskSelectBoxItems('Danh sach rui ro', riskNameList)}
                                                onChange={handleChangeRiskName}
                                                value={riskName}

                                                multiple={false}
                                                options={{ placeholder: translate('manage_risk.select_risk_title') }}
                                            />
                                        }

                                    </div>
                                    <div className={`form-group ${riskNameError.status ? "" : "has-error"}`}>
                                        <label>{translate('manage_risk.description')}<span className="text-red">*</span></label>
                                        <QuillEditor
                                            id="risk-edit-description"
                                            getTextData={(val) => handleDescription(val)}
                                            quillValueDefault={riskData.description}
                                            embeds={false}
                                            placeholder="Mô tả rủi ro"
                                        />

                                        {/* <input type="text-area" className="form-control" value={description} onChange={handleDescription}></input> */}
                                        <ErrorLabel content={riskNameError.message} />
                                    </div>
                                    {/* raised data */}
                                    <div className="row form-group">

                                        <div className={`col-lg-6 col-md-6 col-ms-12 col-xs-12 `}>
                                            <label className="control-label">{'Thời gian xảy ra rủi ro'}<span className="text-red">*</span></label>
                                            <DatePicker
                                                id={`edit-datepicker1`}
                                                dateFormat="day-month-year"
                                                value={convertDate(occurrenceDate)}
                                                onChange={handleChangeOccurrenceDate}
                                            />
                                            < TimePicker
                                                id={`time-picker-1`}

                                                value={occurrenceTime}
                                                onChange={handleChangeOccurrenceTime}
                                            />
                                            {/* <ErrorLabel content="error"/>  */}
                                        </div>

                                    </div>
                                    <div className={`form-group`}>
                                        <label className="control-label">{translate('manage_risk.accountable')}<span className="text-red">*</span></label>
                                        {allUnitsMember &&
                                            <SelectBox
                                                id={`edit-accountable-select-box`}
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                items={allUnitsMember}
                                                onChange={handleChangeTaskAccountableEmployees}
                                                value={accountableEmployees}
                                                multiple={true}
                                                options={{ placeholder: translate('task.task_management.add_resp') }}
                                            />
                                        }
                                        {/* <ErrorLabel content={newTask.errorOnResponsibleEmployees} /> */}
                                    </div>
                                </fieldset>
                            </div>
                            <div id="select-task-from-list" className="col-sm-6">
                                <fieldset className="scheduler-border">
                                    <legend>Công việc chịu ảnh hưởng</legend>

                                    <div className={`form-group`}>
                                        <ul>
                                            {riskName.length != 0 && taskRelateList && taskRelateList != null && taskRelateList.map((task, index) => {
                                                return (<li>{task._id}</li>)
                                            })}
                                        </ul>
                                    </div>
                                    {props.risk.tasksByRisk.length == 0 && riskName.length != 0 && <div>Không có công việc nào đang thực hiện chịu ảnh hưởng của rủi ro này</div>}
                                    {riskName != 0 && props.risk.tasksByRisk.length != 0 && <SelectTaskFromList
                                        lists={props.risk.tasksByRisk && props.risk.tasksByRisk}
                                        stateParent={state}
                                        setStateParent={setState}
                                        checkedItems = {riskData.taskRelate}></SelectTaskFromList>}
                                </fieldset>
                            </div>
                        </form>

                    </div>
                    <div id="edit_risk_impact" className="tab-pane">
                        <form>
                            <div className={`form-group ${riskNameError.status ? "" : "has-error"}`}>
                                <div className="row">
                                    <div className="col-sm-8">
                                        <label>{translate('manage_risk.description')}<span className="text-red">*</span></label>
                                        <QuillEditor
                                            id="risk-edit-impact-description"
                                            getTextData={(val) => handleImpactDescription(val)}
                                            quillValueDefault={''}
                                            embeds={false}
                                            placeholder="Mô tả rủi ro"
                                            height="100px"
                                        />
                                        {/* <input type="text-area" className="form-control" value={description} onChange={handleDescription}></input> */}
                                        <ErrorLabel content={riskNameError.message} />
                                    </div>
                                </div>
                            </div>
                            <div className="form-group clearfix row">
                                <div className="icheck-primary d-inline col-sm-3">
                                    <input
                                        type="checkbox"
                                        id="health"
                                        checked={checkBox.health}
                                        onClick={(e) => {
                                            setCheckBox({ ...checkBox, health: !checkBox.health })
                                            if (impact.health == 0) {
                                                setImpact({ ...impact, health: 1 })
                                            } else {
                                                setImpact({ ...impact, health: 0 })
                                            }
                                        }}
                                    />
                                    <label for="health">
                                        {translate('manage_risk.create_risk_form.plan')}
                                    </label>
                                    {levelMap.get(impact.health)&& <div className="col-sm-9" style={{ backgroundColor: levelMap.get(impact.health)&&levelMap.get(impact.health)[1], textAlign: 'center', paddingRight: '1em' }}>{impact && levelMap.get(impact.health)[0]}</div>}
                                    {checkBox.health && (
                                        <div className="row">
                                            <div class="form-group col-sm-9" onChange={handleChangeHsse}>
                                                <div class="radio">
                                                    <label>
                                                        <input type="radio" name="health" value="4" checked={impact.health==4}/>
                                                        <p>{translate('manage_risk.create_risk_form.plan_1')}</p>
                                                    </label>
                                                </div>
                                                <div class="radio">
                                                    <label>
                                                        <input type="radio" name="health" value="3" checked={impact.health==3}/>
                                                        <p>{translate('manage_risk.create_risk_form.plan_2')}</p>
                                                    </label>
                                                </div>
                                                <div class="radio">
                                                    <label>
                                                        <input type="radio" name="health" value="2" checked={impact.health==2}/>
                                                        <p>{translate('manage_risk.create_risk_form.plan_3')}</p>
                                                    </label>
                                                </div>
                                                <div class="radio">
                                                    <label>
                                                        <input type="radio" name="health" value="1" defaultChecked={true} checked={impact.health==1}/>
                                                        <p>{translate('manage_risk.create_risk_form.plan_4')}</p>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                    )}
                                </div>
                                <div className="icheck-primary d-inline col-sm-3">
                                    <input
                                        type="checkbox"
                                        id="security"
                                        checked={checkBox.security}
                                        onClick={(e) => {
                                            setCheckBox({ ...checkBox, security: !checkBox.security })
                                            if (impact.security == 0) {
                                                setImpact({ ...impact, security: 1 })
                                            } else {
                                                setImpact({ ...impact, security: 0 })
                                            }
                                        }}
                                    />
                                    <label for="security">
                                        {translate('manage_risk.create_risk_form.security')}
                                    </label>
                                    { levelMap.get(impact.security)&&<div className="col-sm-9" style={{ backgroundColor: levelMap.get(impact.security)[1], textAlign: 'center', paddingRight: '1em' }}>{impact && levelMap.get(impact.security)[0]}</div>}
                                    {checkBox.security && (
                                        <div className="row">
                                            <div className="form-group col-sm-9" onChange={handleChangeHsse}>
                                                <div class="radio">
                                                    <label>
                                                        <input type="radio" name="security" value="4" checked={impact.security==4}/>
                                                        <p> {translate('manage_risk.create_risk_form.security_1')}</p>
                                                    </label>
                                                </div>
                                                <div class="radio">
                                                    <label>
                                                        <input type="radio" name="security" value="3" checked={impact.security==3}/>
                                                        <p>{translate('manage_risk.create_risk_form.security_2')}</p>
                                                    </label>
                                                </div>
                                                <div class="radio">
                                                    <label>
                                                        <input type="radio" name="security" value="2" checked={impact.security==2}/>
                                                        <p>{translate('manage_risk.create_risk_form.security_3')}</p>
                                                    </label>
                                                </div>
                                                <div class="radio">
                                                    <label>
                                                        <input type="radio" name="security" value="1" defaultChecked={true}checked={impact.security==1} />
                                                        <p>{translate('manage_risk.create_risk_form.security_4')}</p>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                    )}
                                </div>
                                <div className="icheck-primary d-inline col-sm-3">
                                    <input
                                        type="checkbox"
                                        id="enviroment"
                                        checked={checkBox.enviroment}
                                        onClick={(e) => {
                                            setCheckBox({ ...checkBox, enviroment: !checkBox.enviroment })
                                            if (impact.enviroment == 0) {
                                                setImpact({ ...impact, enviroment: 1 })
                                            } else {
                                                setImpact({ ...impact, enviroment: 0 })
                                            }

                                        }}
                                    />
                                    <label for="enviroment">
                                        {translate('manage_risk.create_risk_form.cost')}
                                    </label>
                                    {levelMap.get(impact.enviroment)&&<div className="col-sm-9" style={{ backgroundColor: levelMap.get(impact.enviroment)[1], textAlign: 'center', paddingRight: '1em' }}>{impact && levelMap.get(impact.enviroment)[0]}</div>}
                                    {checkBox.enviroment && (
                                        <div className="row">
                                            <div class="form-group col-sm-9" onChange={handleChangeHsse}>
                                                <div class="radio">
                                                    <label>
                                                        <input type="radio" name="enviroment" value="4" checked={impact.enviroment==4}/>
                                                        <p>{translate('manage_risk.create_risk_form.cost_1')}</p>
                                                    </label>
                                                </div>
                                                <div class="radio">
                                                    <label>
                                                        <input type="radio" name="enviroment" value="3" checked={impact.enviroment==3}/>
                                                        <p>{translate('manage_risk.create_risk_form.cost_2')}</p>
                                                    </label>
                                                </div>
                                                <div class="radio">
                                                    <label>
                                                        <input type="radio" name="enviroment" value="2" checked={impact.enviroment==2}/>
                                                        <p>{translate('manage_risk.create_risk_form.cost_3')}</p>
                                                    </label>
                                                </div>
                                                <div class="radio">
                                                    <label>
                                                        <input type="radio" name="enviroment" value="1" defaultChecked={true} checked={impact.enviroment==1}/>
                                                        <p>{translate('manage_risk.create_risk_form.cost_4')}</p>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                    )}
                                </div>

                            </div>
                        </form>
                    </div>
                    <div id="edit-risk-matrix" className="tab-pane">
                        <div className="col-xs-12">

                            <RiskMatrix></RiskMatrix>

                        </div>

                    </div>
                    <div>

                    </div>
                </div>


            </DialogModal>
        </React.Fragment>
    );
}

function mapState(state) {
    const { risk, user, riskDistribution, tasks } = state;
    return { risk, user, riskDistribution, tasks }
}

const actions = {
    editRisk: riskActions.editRisk,
    getRisks: riskActions.getRisks,
    getAllUserOfCompany: UserActions.getAllUserOfCompany,
    getChildrenOfOrganizationalUnits: UserActions.getChildrenOfOrganizationalUnitsAsTree,
    getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany,
    showInfoRole: RoleActions.show,
    getRiskDistributions: RiskDistributionActions.getRiskDistributions,
    getRiskDistributionByName: RiskDistributionActions.getRiskDistributionByName,
    getResponsibleTaskByUser: taskManagementActions.getResponsibleTaskByUser,
    getParentsOfRisk: RiskDistributionActions.getParentsOfRisk,
    getTasksByRisk: riskActions.getTasksByRisk,
    updateProb: RiskDistributionActions.updateProb

}

const connectedEditRiskForm = connect(mapState, actions)(withTranslate(EditRiskForm));
export { connectedEditRiskForm as EditRiskForm };