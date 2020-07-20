import {DialogModal} from '../../../../../common-components/src/modal/dialogModal';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import React, { Component } from 'react';
import { connect } from 'react-redux';
class TaskImpartanceDialog extends Component{
    constructor(props){
        super(props);
        this.state ={}
    }
    render(){
        const {data} = this.props;
        return(
            <React.Fragment>
                <DialogModal
                    size={50}
                    modalID={`modal-taskimportance-auto`}
                    title={`Giải thích GT tự động ${this.props.task.name}`}
                    hasSaveButton = {false}
                >
                    <div>
                        <div>Số ngày thực hiện: {this.props.task? this.props.task.daykpi: "Deleted"}</div>
                        <div>Đóng góp: {this.props.task? this.props.task.results.contribution: "Deleted"}</div>
                        <div>Độ ưu tiên: {this.props.task? this.props.task.priority: "Deleted"}</div>
                        <div>Công thức :</div>
                        <div> 3 * ({this.props.task.priority} / 3) + 3 * ({this.props.task.results.contribution} / 100) + 4 * ({this.props.task.daykpi} / 30)</div>
                        <div> = {this.props.task.taskImportanceLevelCal}</div>
                    </div>
                </DialogModal>
            </React.Fragment>
        )
    };
}
const  taskImportance = connect(null,null)(withTranslate(TaskImpartanceDialog))
export {taskImportance as TaskDialog}