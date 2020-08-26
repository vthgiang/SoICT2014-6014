import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from "react-redux-multilingual";

class IncomingDataTab extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            taskId: undefined,
            task: undefined,
            infoTaskProcess: undefined
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.taskId !== prevState.taskId) {
            let infoTaskProcess = {};
            for (let i in nextProps.infoTaskProcess) {
                infoTaskProcess[`${nextProps.infoTaskProcess[i]._id}`] = nextProps.infoTaskProcess[i];
            }

            return {
                ...prevState,
                taskId: nextProps.taskId,
                task: nextProps.task,
                infoTaskProcess: infoTaskProcess
            }
        }
    }

    render() {
        const { task, infoTaskProcess } = this.state;
        let listTask = [];

        if (task && task.preceedingTasks && task.preceedingTasks.length !== 0 && infoTaskProcess) {
            task.preceedingTasks.map((item, index) => {
                if (infoTaskProcess[`${item.task}`]) {
                    listTask[index] = {};
                    listTask[index].name = infoTaskProcess[`${item.task}`].name;

                    if (infoTaskProcess[`${item.task}`].taskInformations && infoTaskProcess[`${item.task}`].taskInformations.length !== 0) {
                        listTask[index].informations = infoTaskProcess[`${item.task}`].taskInformations.filter(info => info.isOutput);
                    } else {
                        listTask[index].informations = []
                    }

                    if (infoTaskProcess[`${item.task}`].documents && infoTaskProcess[`${item.task}`].documents.length !== 0) {
                        listTask[index].documents = infoTaskProcess[`${item.task}`].documents.filter(document => document.isOutput);
                    } else {
                        listTask[index].documents = []
                    }
                    
                }
            })
        }
        
        return (
            <React.Fragment>
                <div className="description-box">
                    {
                        listTask.length !== 0
                        && listTask.map(task => 
                            <div className="row">
                                <h4 className="col-md-12" style={{ fontWeight: "600" }}>Tên công việc: {task.name}</h4>
                                
                                {/** Danh sách thông tin */}
                                <div className="form-inline">
                                    {
                                        task.informations.length !== 0
                                        ? task.informations.map(info => 
                                            info.isOutput &&
                                            <div className="form-group col-md-6">
                                                <strong>{info.name}</strong>
                                                <ul>
                                                    <li>Mô tả: <span>{info.description}</span></li>
                                                    <li>Kiểu dữ liệu: <span>{info.type}</span></li>
                                                </ul>
                                            </div>
                                        )   
                                        : <div className="col-md-12">Không xuất thông tin</div>
                                    }
                                </div>

                                {/** Danh sách tài liệu */}
                                <div className="form-inline">
                                    {
                                        task.documents.length !== 0
                                        ? task.documents.map(document => 
                                            document.isOutput &&
                                            <div className="form-group col-md-6">
                                                <strong>Tài liệu</strong>
                                                <ul>
                                                    <li>Mô tả: <span>{document.description}</span></li>
                                                    {
                                                        document.files
                                                        && document.files.length !== 0
                                                        && document.files.map(file => 
                                                            <li><span>Files</span>
                                                                <ul>
                                                                    <li>Tên: {file.name}</li>
                                                                    <li>Url: {file.url}</li>
                                                                </ul>
                                                            </li>
                                                        )
                                                    }
                                                    
                                                </ul>
                                            </div>
                                        )
                                        : <div className="col-md-12">Không xuất tài liệu</div>
                                    }
                                </div>
                            </div>
                        )
                    }
                </div>
                
            </React.Fragment>
        )
    }
}


function mapState(state) {
    const { } = state;
    return {};
}
const actions = {

}

const connectIncomingDataTab = connect(mapState, actions)(withTranslate(IncomingDataTab));
export { connectIncomingDataTab as IncomingDataTab }