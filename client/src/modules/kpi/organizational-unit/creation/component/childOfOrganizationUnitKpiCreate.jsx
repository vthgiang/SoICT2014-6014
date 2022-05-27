import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DatePicker, DialogModal, ErrorLabel, SelectBox } from '../../../../../common-components';
import { DashboardEvaluationEmployeeKpiSetAction } from '../../../evaluation/dashboard/redux/actions';
import { managerActions } from '../../management/redux/actions';
import { createUnitKpiActions } from '../redux/actions.js';

const formatDate = (date) => {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) {
        month = '0' + month;
    }

    if (day.length < 2) {
        day = '0' + day;
    }

    return [month, year].join('-');
}

const formatDate2 = (date) => {
    let month = date.split('-')[0];
    let year = date.split('-')[1];
    if (month.length < 2) {
        month = '0' + month;
    }

    return [month, year].join('-');
}

/** Thay đổi ngày tháng */
const convertMMYYtoYYMM = (value) => {
    return value.slice(3, 7) + '-' + value.slice(0, 2);
};

/** so sanh 2 ngày 
 * @date1 ngay dinh dang MM-YYYY
 * @date2 ngay dinh dang YYYY-MM
 * date1 <= date2 return true
*/
const compareDate = (date1, date2) => {
    if (!date1 || !date2) {
        return true;
    }

    const test = date1 && date1.slice(3, 7) + ',' + date1.slice(0, 2);
    const test2 = date2 && date2.slice(0, 4) + ',' + date2.slice(5, 7);

    if (new Date(test).getTime() <= new Date(test2).getTime()) {
        return true;
    }

    return false;
}


function ChildOfOrganizationalUnitCreate(props) {
    const { translate, createKpiUnit, dashboardEvaluationEmployeeKpiSet } = props;
    const { childrenOrganizationalUnit } = dashboardEvaluationEmployeeKpiSet;
    const { currentKPI } = createKpiUnit;
    const { organizationalUnitKpiSetsOfChildUnit: kpiChildUnit } = createKpiUnit;

    const [idsUnitCopy, setIdsUnitCopy] = useState();
    const [idsUnitApply, setIdsUnitApply] = useState();
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [copyDate, setCopyDate] = useState();
    const [unitOrganizationalCopyError, setUnitOrganizationalCopyError] = useState();
    const [unitOrganizationalApplyError, setUnitOrganizationalApplyError] = useState();
    const [dateRangeError, setDateRangeError] = useState();
    const [kpi, setKpi] = useState();
    const [applyMonth, setApplyMonth] = useState([]);
    const [duplicate, setDuplicate] = useState(false);
    const [dateCopyError, setDateCopyError] = useState();
    const [dateNew, setDateNew] = useState([]);

    const arrayKpiUnit = currentKPI?.kpis?.map(x => x._id);

    const childrenUnit = childrenOrganizationalUnit?.children || [];

    const options = childrenUnit.map(x => {
        return {
            value: x.id,
            text: x.name
        }
    })

    const handleChangeUnitCopy = (value) => {
        if (value.length === 0) {
            value = [];
            setUnitOrganizationalCopyError('Đơn vị nguồn không được để trống');
        } else {
            setUnitOrganizationalCopyError(undefined);
            setIdsUnitCopy(value[0])
        }
    }

    const handleChangeUnitApply = (value) => {
        if (value.length === 0) {
            value = [];
            setUnitOrganizationalApplyError('Đơn vị áp dụng không được để trống');
        } else {
            setUnitOrganizationalApplyError(undefined);
            setIdsUnitApply(value[0])
        }
    }

    const handleChangeDate = (type, value) => {
        if (!value) {
            setDateRangeError('Hãy chọn thời gian')
        }

        if (type === 'startDate') {
            if (compareDate(value, endDate)) {
                setStartDate(convertMMYYtoYYMM(value))
                setDateRangeError(undefined);
            } else setDateRangeError('Ngày bắt đầu phải nhỏ hơn ngày kết thúc');

        } else {
            if (compareDate(value, startDate)) {
                setDateRangeError('Ngày bắt đầu phải nhỏ hơn ngày kết thúc')
            } else {
                setEndDate(convertMMYYtoYYMM(value));
                setDateRangeError(undefined);
            }
        }
    }

    const handleChangeDateCopy = (value) => {
        if (!value) {
            setDateCopyError('Hãy chọn thời gian')
        }
        setCopyDate(convertMMYYtoYYMM(value))
    }

    const handleSubmit = () => {
        const dataKPI = {
            type: 'copy-parent-kpi-to-unit',
            idunit: idsUnitApply,
            datenew: dateNew,
            listKpiUnit: arrayKpiUnit,
            organizationalUnitIdCopy: idsUnitCopy,
            matchParent: false
        }
        props.copyKPIUnit(currentKPI?._id, dataKPI);
    }

    const isFormValidated = () => {
        return (idsUnitApply && idsUnitCopy && dateCopyError && dateRangeError)
    }

    useEffect(() => {
        const dateArr = [];
        let applyMonth = [];
        let unitName = null;

        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            while (start.getTime() <= end.getTime()) {
                dateArr.push(`${start.getMonth() + 1}-${start.getFullYear()}`);
                start.setMonth(start.getMonth() + 1);
            }
        }

        if (idsUnitApply) {
            childrenUnit.map((unit) => {
                if (unit.id === idsUnitApply) {
                    unitName = unit.name
                }
            })
            if (kpi[unitName]) {
                for (let i = 0; i < dateArr.length; i++) {
                    if (!kpi[unitName].includes(formatDate2(dateArr[i]))) {
                        applyMonth.push(dateArr[i]);
                    }
                }
            } else {
                applyMonth = dateArr
            }

            if (applyMonth.length > 0 && applyMonth.length < dateArr.length) {
                setDuplicate(true);
            } else {
                setDuplicate(false)
            }

            setApplyMonth(applyMonth);
            setDateNew(
                applyMonth.length && applyMonth.map((x) => {
                    return convertMMYYtoYYMM(formatDate2(x))
                })
            )
        }
    }, [startDate, endDate, idsUnitApply]);

    useEffect(() => {
        const kpiUnit = {};

        if (kpiChildUnit?.length > 0) {
            kpiChildUnit.map((item) => {

                if (item?.length > 1) {
                    for (let i = 1; i < item.length; i++) {
                        if (!kpiUnit[item[i].unitName]) {
                            kpiUnit[item[i].unitName] = [];
                        }
                        kpiUnit[item[i].unitName].push(formatDate(item[i].date))
                    }
                }
            })
        }
        setKpi(kpiUnit);
    }, [createKpiUnit, startDate, endDate])

    useEffect(() => {
        if (idsUnitCopy && copyDate) {
            props.getCurrentKPIUnit(localStorage.getItem("currentRole"), idsUnitCopy, copyDate);
        }
    }, [idsUnitCopy, copyDate])

    return (
        <React.Fragment>
            <DialogModal
                modalID="sub-organizational-create" isLoading={false}
                formID="form-sub-organizational-create"
                title={`Áp dụng KPI cho đơn vị con`}
                msg_success={translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.success')}
                msg_failure={translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.failure')}
                func={handleSubmit}
                hasNote={false}
                disableSubmit={isFormValidated()}
            >
                <div className="row qlcv" style={{ marginBottom: 10 }}>
                    <div className="col-sm-6">
                        {/* Đơn vị nguồn */}
                        <div className={`form-group ${unitOrganizationalCopyError === undefined ? "" : "has-error"}`} >
                            <label style={{ width: "auto" }}>Đơn vị nguồn</label>
                            <SelectBox
                                id={`selectBoxInOrganizationalUnitKpiCopy`}
                                className="form-control select2"
                                style={{ width: 230 }}
                                items={options}
                                multiple={false}
                                onChange={handleChangeUnitCopy}
                                value={idsUnitCopy}
                            />
                            <ErrorLabel content={unitOrganizationalCopyError} />
                        </div>
                    </div>

                    <div className="col-sm-6">
                        <div className={`qlcv form-group ${dateCopyError === undefined ? "" : "has-error"}`} >
                            <label style={{ width: "auto", display: 'block' }}>Tháng</label>
                            <DatePicker
                                id="monthInOrganizationalKpiCopy"
                                dateFormat="month-year"
                                value={copyDate}
                                onChange={(e) => {
                                    handleChangeDateCopy(e)
                                }}
                                disabled={false}
                            />
                        </div>
                    </div>
                </div>

                <div className='row qlcv' style={{ marginBottom: 10 }} >
                    {/* Đơn vị áp dụng */}
                    <div className="col-sm-6">
                        <div className={`form-group ${unitOrganizationalApplyError === undefined ? "" : "has-error"}`} >
                            <label style={{ width: "auto" }}>Đơn vị áp dụng</label>
                            <SelectBox
                                id={`selectBoxInOrganizationalUnitKpiApply`}
                                className="form-control select2"
                                style={{ width: 230 }}
                                items={options}
                                multiple={false}
                                onChange={handleChangeUnitApply}
                                value={idsUnitApply}
                            />
                            <ErrorLabel content={unitOrganizationalApplyError} />
                        </div>
                    </div>
                </div>

                {/* Thoi gian ap dung */}
                <div className={`form-group ${dateRangeError === undefined ? "" : "has-error"}`}>
                    <div className='row'>
                        <div className="col-sm-6">
                            <label style={{ width: "auto" }}>Áp dụng từ</label>
                            <DatePicker
                                id="monthStartInOrganizationalKPI"
                                dateFormat="month-year"
                                value={startDate}
                                onChange={(e) => {
                                    handleChangeDate('startDate', e)
                                }}
                                disabled={false}
                            />
                        </div>
                        <div className="col-sm-6">
                            <label style={{ width: "auto" }}>Áp dụng đến</label>
                            <DatePicker
                                id="monthEndInOrganizationalKPI"
                                dateFormat="month-year"
                                value={endDate}
                                onChange={(e) => {
                                    handleChangeDate('endDate', e)
                                }}
                                disabled={false}
                            />
                        </div>
                    </div>
                    <ErrorLabel content={dateRangeError} />
                </div>

                {
                    duplicate && (
                        <div style={{ 'marginTop': 10 }} className='text-danger'>
                            <i style={{ 'marginRight': 10 }} className="fa fa-exclamation-circle" />
                            <span style={{ 'fontWeight': 600 }}>
                                Chỉ có thể áp dụng KPI cho các tháng:
                            </span>
                            {
                                applyMonth.map((x, index) => {
                                    if (index < applyMonth.length - 1) {
                                        return <span key={index} style={{ 'fontWeight': 600, 'marginLeft': 5 }}>{x},</span>
                                    } else {
                                        return <span key={index} style={{ 'fontWeight': 600, 'marginLeft': 5 }}>{x}</span>
                                    }

                                })
                            }
                        </div>)
                }
            </DialogModal>
        </React.Fragment>
    );
}


function mapState(state) {
    const { user, createKpiUnit, dashboardEvaluationEmployeeKpiSet, managerKpiUnit } = state;
    return { user, createKpiUnit, dashboardEvaluationEmployeeKpiSet, managerKpiUnit }
}
const actions = {
    getChildrenOfOrganizationalUnitsAsTree: DashboardEvaluationEmployeeKpiSetAction.getChildrenOfOrganizationalUnitsAsTree,
    editKPIUnit: createUnitKpiActions.editKPIUnit,
    copyKPIUnit: managerActions.copyKPIUnit,
    checkExistKPI: managerActions.checkExistKPI,
    getCurrentKPIUnit: createUnitKpiActions.getCurrentKPIUnit
}

const connectedChildOfOrganizationalUnitCreate = connect(mapState, actions)(withTranslate(ChildOfOrganizationalUnitCreate));
export { connectedChildOfOrganizationalUnitCreate as ChildOfOrganizationalUnitCreate };

