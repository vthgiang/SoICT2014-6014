import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

import { DataTableSetting,  PaginateBar, DialogModal, forceCheckOrVisible, LazyLoadComponent } from "../../../../../../common-components";


function TransportDialogMissionReport(props) {
    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-report-process`}
                title={"hanhf trinh xe"}
                formID={`modal-report-process`}
                size={50}
                maxWidth={500}
                
                hasSaveButton={true}
                // hasNote={false}
            >
                <form id={`modal-report-process`}>
                
                </form>
            </DialogModal>
        </React.Fragment>
    )
}

function mapState(state) {
}

const actions = {   
}

const connectedTransportDialogMissionReport = connect(mapState, actions)(withTranslate(TransportDialogMissionReport));
export { connectedTransportDialogMissionReport as TransportDialogMissionReport };