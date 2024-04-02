import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { DialogModal, TreeSelect } from '../../../../../common-components';
import { ShipperActions } from '../../redux/actions';
import GanttCalender from "../../../../production/warehouse/bill-management/components/genaral/GanttCalendar";

const ShipperCalendar = (props) => {
    const { translate } = props;

    const [state, setState] = useState({

    })

    const save = () => {

    }

    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-calendar-shipper-info`}
                formID={`form-calendar-shipper-info`}
                title={"Lịch làm việc"}
                // disableSubmit={!isFormValidated()}
                func={save}
                size={50}
                maxWidth={500}
                hasSaveButton={false}
                hasNote={false}
            >
                {props.dataChart &&
                    <GanttCalender
                        dataChart={props.dataChart ? props.dataChart : []}
                        // counter={1}
                    />
                }
            </DialogModal>
        </React.Fragment>
    );
}

function mapStateToProps(state) {
    const shipper = state.shipper;
    return {shipper}
}

const mapDispatchToProps = {
    editDriverInfo: ShipperActions.editDriverInfo,
}

export default React.memo(connect(mapStateToProps, mapDispatchToProps)(withTranslate(ShipperCalendar)));