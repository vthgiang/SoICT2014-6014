import React, {Component, useState} from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DatePicker, DialogModal, ErrorLabel } from '../../../../../common-components';

import { managerKpiActions } from '../redux/actions';

import ValidationHelper from '../../../../../helpers/validationHelper';

var translate ='';
function ModalCopyKPIPersonal(props) {

    const translate = props.translate;

    const [state, setState] = useState({
        kpipersonal: {
            organizationalUnit: ""
        },
    })

    const { errorOnNewDate } = state;
    const { kpipersonal } = props;

    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [month, year].join('-');
    }

    const handleNewDateChange = (value) => {
        const { translate } = props;

        let month;
        if (value === "") {
            month = null;
        } else {
            month = value.slice(3, 7) + '-' + value.slice(0, 2);
        }

        let validation = ValidationHelper.validateEmpty(translate, month);

        setState( {
            ...state,
            errorOnNewDate: validation.message,
            newDate: month
        });

    };

    /**Gửi req khởi tạo KPI tháng mới từ KPi tháng này */
    const handleSubmit = async (id, oldkpipersonal, idunit) => {
        const { newDate } = state;

        await setState( {
            ...state,
            kpipersonal: {
                ...state.kpipersonal,
                organizationalUnit: oldkpipersonal && oldkpipersonal.organizationalUnit._id,
                kpis: oldkpipersonal && oldkpipersonal.kpis
            }
        })

        if (newDate) {
            props.copyEmployeeKPI(id, idunit, newDate);
        }
    }

    const save = () => {
        const { kpipersonal } = props;
        handleSubmit(kpipersonal._id, kpipersonal, kpipersonal.organizationalUnit._id);
    }

    return (
        <DialogModal
            modalID={`copy-old-kpi-to-new-time-${kpipersonal._id}`}
            title={`${translate('kpi.organizational_unit.management.copy_modal.create')} ${formatDate(kpipersonal.date)}`}
            size={10}
            func={save}
            disableSubmit={errorOnNewDate}
        >
            <div className="form-group text-red">
                <label style={{ margin: "0px 10px" }}>Lưu ý</label><span>{translate('kpi.organizational_unit.management.copy_modal.alert.change_link')}</span>
            </div>

            {/**Đơn vị của KPI tháng mới */}
            <div className="form-group">
                <label style={{ margin: "0px 10px"}}>{translate('kpi.organizational_unit.management.copy_modal.organizational_unit')}</label>
                <span>{kpipersonal && kpipersonal.organizationalUnit.name}</span>
            </div>

            <div className={`form-group ${errorOnNewDate === undefined ? "" : "has-error"}`} style={{ marginLeft: "10px" }}>
                {/**Tháng mới cần khởi tạo KPI */}
                <label>{translate('kpi.organizational_unit.management.copy_modal.month')}<span className="text-red">*</span></label>
                <DatePicker
                    id="new_date"
                    value={""}
                    onChange={handleNewDateChange}
                    dateFormat="month-year"
                />
                <ErrorLabel content={errorOnNewDate} />
            </div>

            {/**Danh sách các mục tiêu */}
            <div className="form-group" >
                <label style={{ margin: "0px 10px"}}>{translate('kpi.organizational_unit.management.copy_modal.list_target')}</label>
                <ul>
                    {typeof kpipersonal !== "undefined" && kpipersonal.kpis.length !== 0 &&
                    kpipersonal.kpis.map(item => {
                        return <li key={item._id}>{item.name + " (" + item.weight + ")"}</li>
                    })
                    }
                </ul>
            </div>
        </DialogModal >
    );
}

function mapState(state) {
    const { overviewKpiPersonal } = state;
    return { overviewKpiPersonal };
}

const actionCreators = {
    copyEmployeeKPI: managerKpiActions.copyEmployeeKPI,
};

const connectedModalCopyKPIPersonal = connect(mapState, actionCreators)(withTranslate(ModalCopyKPIPersonal));
export { connectedModalCopyKPIPersonal as ModalCopyKPIPersonal };
