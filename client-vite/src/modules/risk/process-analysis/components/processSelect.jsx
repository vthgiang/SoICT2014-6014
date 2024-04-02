import React,{useEffect, useState} from "react"
import styled from "styled-components"
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { connect } from 'react-redux';

import { DialogModal } from '../../../../common-components';
import { TaskProcessManagement } from "./processList";
 

const SelectProcess = (props) =>{
   
    const {translate,handleSelect} = props
    return (
        <React.Fragment>
             <DialogModal
                modalID={`modal-detail-info-example-hooks`} isLoading={false}
                title="Chọn quy trình"
                formID={`form-detail-example-hooks`}
                size={100}
                maxWidth={700}
                hasSaveButton={false}
                hasNote={false}
            >
                <TaskProcessManagement handleSelect={handleSelect} ></TaskProcessManagement>
            </DialogModal>

        </React.Fragment>
    )
}
function mapState(state) {
	const { taskPert} = state;
	return { taskPert};
}
const connectSelectProcess = connect(mapState, null)(withTranslate(SelectProcess));
export { connectSelectProcess as SelectProcess };