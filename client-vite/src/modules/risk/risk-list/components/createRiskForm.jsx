import React, { useState, useEffect, useRef } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';

import { ButtonModal, DialogModal, ErrorLabel, DatePicker, TimePicker, SelectBox, ToolTip, TreeSelect, QuillEditor } from '../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import ValidationHelper from '../../../../helpers/validationHelper';
import getEmployeeSelectBoxItems from '../../organizationalUnitHelper';
import { getRiskSelectBoxItems, getTaskSelectBox, getImpactStr, getRankingStr, getRankingColor, getRankingColors } from '../../riskHelper';
import { riskActions } from '../redux/actions';
import { UserActions } from '../../../super-admin/user/redux/actions';
import { RoleActions } from '../../../super-admin/role/redux/actions';
import { RiskDistributionActions } from '../../risk-dash-board/redux/actions'
import { taskManagementActions } from '../../../task/task-management/redux/actions';
import dayjs from "dayjs";
import { getStorage } from '../../../../config';
import './createRisk.css'
import { SelectTaskFromList } from './selectTaskFromList'
import { RiskMatrix } from '../../risk-dash-board/components/riskMatrix'
import { ViewRiskResponsePlan } from '../../risk-response-plan/components/viewRiskResponsePlan';

// import { getRankingColor,getRankingStr ,getImpactStr} from './../../riskHelper';
function RiskCreateForm(props) {
    const [resetFlag, setResetFlag] = useState(false)
    // Khởi tạo state
    const initState = {
        selectPlan: null,
        riskNameList: [],
        allUnitsMember: [],
        riskName: [],
        description: "",
        raisedDate: "",
        occurrenceDate: "",
        responsibleEmployees: [getStorage("userId")],
        riskParents: [],
        responsibleTasks: [],
        accountableEmployees: [],
        taskRelate: [],
        parents: [],
        riskNameError: {
            message: undefined,
            status: true
        },
        riskStatus: "wait_for_approve",
        parentChecked: [],
        ranking: 0,
        impactLevel: 0,
        probLevel: 0,
        riskDis: null,
        taskRelateList: [],
        plans: []
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
        health: false,
        security: false,
        enviroment: false
    }
    const [impact, setImpact] = useState(initImpact)

    const [checkBox, setCheckBox] = useState(initCheckBoxImpact)


    const { translate, risk, page, perPage, user, tasks } = props;

    const {
        selectPlan,
        riskName,
        riskNameError,
        description,
        raisedDate,
        occurrenceDate,
        responsibleEmployees,
        riskNameList,
        accountableEmployees,
        allUnitsMember,
        responsibleTasks,
        taskRelate,
        riskParents,
        parents,
        riskStatus,
        parentChecked,
        ranking,
        impactLevel,
        probLevel,
        riskDis,
        taskRelateList,
        plans
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
            parentChecked: props.riskDistribution.parentChecked
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
        props.getRisks({
            type: 'getByUser',
            riskName: "",
            page: page,
            perPage: perPage
        });
    }, [resetFlag])
    useEffect(() => {
        if (ranking != 0) {
            console.log(ranking)
            let risk = riskNameList.find(risk => risk.name == riskName)
            // alert(risk.riskID)
            // alert(ranking)
            let data = {
                id: risk.riskID,
                level: ranking
            }
            console.log(data)
            props.getPlans(data)
        }
    }, [ranking, impactLevel, riskName])
    useEffect(() => {
        if (props.risk.plans) {
            console.log(props.risk.plans)
            setState({
                ...state,
                plans: props.risk.plans
            })
        }
    }, [props.risk.plans])
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
            await props.createRisk({
                riskName,
                description,
                plans,
                occurrenceDate,
                responsibleEmployees,
                accountableEmployees,
                taskRelateList,
                riskParents,
                riskStatus,
                parentChecked,
                impact,
                ranking
            });
            setState(initState)
            setImpact(initImpact)
            setCheckBox(initCheckBoxImpact)
            props.getRisks({
                type: 'getByUser',
                riskName: "",
                page: page,
                perPage: perPage
            });
        }

    }
    /**
     * Hàm xử ký khi tên rủi ro thay đổi
     * @param {*} value giá trị nhận về khi thay đổi
     */
    const handleChangeRiskName = (value) => {
        console.log('gsse', impact)
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
     * Xử lý khi thay đổi nhiệm vụ bị ảnh hưởng bởi rủi ro
     * @param {*} value
     */
    const handleChangeTask = (value) => {
        ////console.log('task', value)
        setState({
            ...state,
            taskRelate: value[0]
        })
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
    const handleChangeParentRisk = (value) => {
        console.log(props.riskMap)
        setState({
            ...state,
            riskParents: value
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
            [translate('manage_risk.low'), 'green']
        ],
        [2,
            [translate('manage_risk.medium'), 'yellow']
        ],
        [3,
            [translate('manage_risk.high'), 'orange']
        ],
        [4,
            [translate('manage_risk.very_high'), 'red']
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

    const [show, setShow] = useState(false)
    useEffect(() => {
        window.$('#modal-detail-risk-response-plan').modal('show')
    }, [show.showPlan])
    const handleShowDetail = (riskPlan) => {
        setState({
            ...state,
            selectPlan: riskPlan
        })
        setShow({
            ...show,
            showPlan: !show.showPlan
        })
    }
    return (
        <React.Fragment>
            <DialogModal
                modalID="modal-create-example-hooks" isLoading={risk.isLoading}
                formID="form-create-example-hooks"
                title={translate('manage_risk.add_title')}
                msg_success={translate('manage_risk.add_success')}
                msg_faile={translate('manage_risk.add_fail')}
                func={save}
                disableSubmit={!isFormValidated()}
                size={75}
                maxWidth={500}
            >
                <div className="box widget-box row" style={{marginLeft:'0%'}}>
                    <div className="col-sm-4">
                        <div className="info-box" style={{ backgroundColor: getRankingColor(ranking), color: 'white' }}>
                            <span className="info-box-icon"><i className="material-icons" style={{ fontSize: '100%' }}>poll</i></span>

                            <div className="info-box-content">
                                <span className="info-box-text">Ranking</span>
                                <span className="info-box-number">{ranking}</span>

                                <div className="progress">
                                    <div className="progress-bar" style={{ width: '100%' }}></div>
                                </div>
                                <span className="progress-description">
                                    {getRankingStr(translate, ranking)}
                                </span>
                            </div>

                        </div>

                    </div>
                    <div className="col-sm-4">
                        <div className="info-box" style={{ backgroundColor:getRiskProbabilityComponent().color, color: 'white' }}>
                            <span className="info-box-icon"><i className="fa fa-percent"></i></span>

                            <div className="info-box-content">
                                <span className="info-box-text">{translate('manage_risk.create_risk_form.probability')}</span>
                                <span className="info-box-number">{getRiskProbabilityComponent().rankProb}</span>

                                <div className="progress">
                                    <div className="progress-bar" style={{ width: '100%' }}></div>
                                </div>
                                <span className="progress-description">
                                {getRiskProbabilityComponent().prob}
                                </span>
                            </div>

                        </div>

                    </div>

                    <div className="col-sm-4">
                        <div className="info-box" style={{ backgroundColor: getHsseImpactComponent().color, color: 'white' }}>
                            <span className="info-box-icon"><i className="fa fa-street-view"></i></span>

                            <div className="info-box-content">
                                <span className="info-box-text">{translate('manage_risk.create_risk_form.impact')}</span>
                                <span className="info-box-number">{getHsseImpactComponent().impactLevel}</span>

                                <div className="progress">
                                    <div className="progress-bar" style={{ width: '100%' }}></div>
                                </div>
                                <span className="progress-description">
                                {getHsseImpactComponent().impactStr}
                                </span>
                            </div>

                        </div>

                    </div>
                </div>
                {/* <div className="box widget-box">

                    <div className="ranking-info row">
                        <div className='col-sm-4'>
                            <table id="ranking-table">
                                <tr>
                                    <td>Ranking</td>

                                </tr>
                                <tr>
                                    <td>{getRankingComponent()}</td>
                                </tr>
                            </table>
                        </div>
                        <div className='col-sm-4'>
                            <table id="prob-table">
                                <tr>
                                    <td>{translate('manage_risk.create_risk_form.probability')}</td>
                                </tr>
                                <tr>
                                    <td>{getRiskProbabilityComponent()}</td>
                                </tr>
                            </table>
                        </div>
                        <div className='col-sm-4'>
                            <table id="impact-table">
                                <tr>
                                    <td>{translate('manage_risk.create_risk_form.impact')}</td>

                                </tr>
                                <tr>
                                    <td>{getHsseImpactComponent()}</td>
                                </tr>
                            </table>
                        </div>
                    </div>

                </div> */}


                <div className="box">
                    <div className="box-body">
                        <div className="nav-tabs-custom" style={{ marginTop: '-15px' }}>
                            {/* Nav-tabs */}
                            <ul className="nav nav-tabs">
                                <li className="active"><a title={translate('manage_risk.add_tab.basic')} data-toggle="tab" href={`#create_risk`}>{translate('manage_risk.add_tab.basic')}</a></li>
                                <li><a title={translate('manage_risk.add_tab.impact')} data-toggle="tab" href={`#risk_impact`}>{translate('manage_risk.add_tab.impact')}</a></li>
                                <li><a title="Ma trận rủi ro" data-toggle="tab" href={`#risk-matrix`}>{translate('manage_risk.create_risk_form.risk_matrix')}</a></li>

                            </ul>
                        </div>

                        <div className="tab-content">
                            <div id="create_risk" className="tab-pane active" >


                                {/* <form id="form-create-risk-hooks" onSubmit={() => save(translate('manage_risk.add_success'))}> */}
                                <div id="basic-info" className="col-md-6">
                                    <fieldset className="scheduler-border">
                                        <legend className="scheduler-border">{translate('manage_risk.create_risk_form.basic_info')}</legend>
                                        <div className={`form-group`}>
                                            {/* Tên rủi ro */}
                                            <label className="control-label">{translate('manage_risk.riskName')}<span className="text-red">*</span></label>
                                            {riskNameList &&
                                                <SelectBox
                                                    id={`risk-select-box`}
                                                    className="form-control"
                                                    style={{ width: "100%" }}
                                                    items={getRiskSelectBoxItems('', riskNameList)}
                                                    onChange={handleChangeRiskName}
                                                    value={riskName}

                                                    multiple={true}
                                                    options={{ placeholder: translate('manage_risk.select_risk_title') }}
                                                />
                                            }

                                        </div>
                                        {riskName.length != 0 && <div className="form-group">
                                            <label>{translate('manage_risk.create_risk_form.apply_plan')} :</label>
                                            {plans.length != 0 && <p className="text-red">{translate('manage_risk.create_risk_form.view_detail')}</p>}

                                            {selectPlan != null && <ViewRiskResponsePlan riskPlanDetail={selectPlan}></ViewRiskResponsePlan>}
                                            {plans.length != 0 && plans.map(plan => <button className="btn btn-success" onClick={() => handleShowDetail(plan)}>
                                                ID:{plan._id}

                                            </button>)}

                                            {plans.length == 0 && <p className={`text-red`}>{translate('manage_risk.create_risk_form.note')}</p>}
                                        </div>}
                                        <div className={`form-group ${riskNameError.status ? "" : "has-error"}`}>
                                            <label>{translate('manage_risk.description')}<span className="text-red">*</span></label>
                                            <QuillEditor
                                                id="risk-description"
                                                getTextData={(val) => handleDescription(val)}
                                                quillValueDefault={''}
                                                embeds={false}
                                                placeholder={translate('manage_risk.description')}
                                            />

                                            {/* <input type="text-area" className="form-control" value={description} onChange={handleDescription}></input> */}
                                            <ErrorLabel content={riskNameError.message} />
                                        </div>
                                        {/* raised data */}
                                        <div className="row form-group">

                                            <div className={`col-lg-6 col-md-6 col-ms-12 col-xs-12 `}>
                                                <label className="control-label">{translate('manage_risk.create_risk_form.occurrence_date')}<span className="text-red">*</span></label>
                                                <DatePicker
                                                    id={`datepicker1`}
                                                    dateFormat="day-month-year"
                                                    value={occurrenceDate}
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
                                                    id={`accountable-select-box`}
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
                                        <legend>{translate('manage_risk.create_risk_form.affectable_tasks')}</legend>
                                        {props.risk.tasksByRisk.length == 0 && riskName.length != 0 && <div>{translate('manage_risk.create_risk_form.noti_affect_tasks  ')}</div>}
                                        {riskName != 0 && props.risk.tasksByRisk.length != 0 && <SelectTaskFromList
                                            lists={props.risk.tasksByRisk && props.risk.tasksByRisk}
                                            stateParent={state}
                                            setStateParent={setState}></SelectTaskFromList>}
                                    </fieldset>
                                </div>
                                {/* </form> */}

                            </div>
                            <div id="risk_impact" className="tab-pane">
                                <form>
                                    <div className={`form-group ${riskNameError.status ? "" : "has-error"}`}>
                                        <div className="row">
                                            <div className="col-sm-8">
                                                <label>{translate('manage_risk.description')}<span className="text-red">*</span></label>
                                                <QuillEditor
                                                    id="risk-impact-description"
                                                    getTextData={(val) => handleImpactDescription(val)}
                                                    quillValueDefault={''}
                                                    embeds={false}
                                                    placeholder={translate('manage_risk.description')}
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
                                            <label htmlFor="health">
                                                {translate('manage_risk.create_risk_form.plan')}
                                            </label>
                                            <div className="col-sm-9" style={{ backgroundColor: levelMap.get(impact.health)[1], textAlign: 'center', paddingRight: '1em' }}>{impact && levelMap.get(impact.health)[0]}</div>
                                            {checkBox.health && (
                                                <div className="row">
                                                    <div className="form-group col-sm-9" onChange={handleChangeHsse}>
                                                        <div className="radio">
                                                            <label>
                                                                <input type="radio" name="health" value="4" />
                                                                <p>{translate('manage_risk.create_risk_form.plan_1')}</p>
                                                            </label>
                                                        </div>
                                                        <div className="radio">
                                                            <label>
                                                                <input type="radio" name="health" value="3" />
                                                                <p>{translate('manage_risk.create_risk_form.plan_2')}</p>
                                                            </label>
                                                        </div>
                                                        <div className="radio">
                                                            <label>
                                                                <input type="radio" name="health" value="2" />
                                                                <p>{translate('manage_risk.create_risk_form.plan_3')}</p>
                                                            </label>
                                                        </div>
                                                        <div className="radio">
                                                            <label>
                                                                <input type="radio" name="health" value="1" defaultChecked={true} />
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
                                            <label htmlFor="security">
                                                {translate('manage_risk.create_risk_form.security')}
                                            </label>
                                            <div className="col-sm-9" style={{ backgroundColor: levelMap.get(impact.security)[1], textAlign: 'center', paddingRight: '1em' }}>{impact && levelMap.get(impact.security)[0]}</div>
                                            {checkBox.security && (
                                                <div className="row">
                                                    <div className="form-group col-sm-9" onChange={handleChangeHsse}>
                                                        <div className="radio">
                                                            <label>
                                                                <input type="radio" name="security" value="4" />
                                                                <p> {translate('manage_risk.create_risk_form.security_1')}</p>
                                                            </label>
                                                        </div>
                                                        <div className="radio">
                                                            <label>
                                                                <input type="radio" name="security" value="3" />
                                                                <p>{translate('manage_risk.create_risk_form.security_2')}</p>
                                                            </label>
                                                        </div>
                                                        <div className="radio">
                                                            <label>
                                                                <input type="radio" name="security" value="2" />
                                                                <p>{translate('manage_risk.create_risk_form.security_3')}</p>
                                                            </label>
                                                        </div>
                                                        <div className="radio">
                                                            <label>
                                                                <input type="radio" name="security" value="1" defaultChecked={true} />
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
                                            <label htmlFor="enviroment">
                                                {translate('manage_risk.create_risk_form.cost')}
                                            </label>
                                            <div className="col-sm-9" style={{ backgroundColor: levelMap.get(impact.enviroment)[1], textAlign: 'center', paddingRight: '1em' }}>{impact && levelMap.get(impact.enviroment)[0]}</div>
                                            {checkBox.enviroment && (
                                                <div className="row">
                                                    <div className="form-group col-sm-9" onChange={handleChangeHsse}>
                                                        <div className="radio">
                                                            <label>
                                                                <input type="radio" name="enviroment" value="4" />
                                                                <p>{translate('manage_risk.create_risk_form.cost_1')}</p>
                                                            </label>
                                                        </div>
                                                        <div className="radio">
                                                            <label>
                                                                <input type="radio" name="enviroment" value="3" />
                                                                <p>{translate('manage_risk.create_risk_form.cost_2')} </p>
                                                            </label>
                                                        </div>
                                                        <div className="radio">
                                                            <label>
                                                                <input type="radio" name="enviroment" value="2" />
                                                                <p>{translate('manage_risk.create_risk_form.cost_3')}</p>
                                                            </label>
                                                        </div>
                                                        <div className="radio">
                                                            <label>
                                                                <input type="radio" name="enviroment" value="1" defaultChecked={true} />
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
                            <div id="risk-matrix" className="tab-pane">
                                <div className="col-xs-12">

                                    <RiskMatrix></RiskMatrix>

                                </div>

                            </div>
                            <div>

                            </div>
                        </div>
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
    createRisk: riskActions.createRisk,
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
    updateProb: RiskDistributionActions.updateProb,
    getPlans: riskActions.getPlans

}

const connectedRiskCreateForm = connect(mapState, actions)(withTranslate(RiskCreateForm));
export { connectedRiskCreateForm as RiskCreateForm };