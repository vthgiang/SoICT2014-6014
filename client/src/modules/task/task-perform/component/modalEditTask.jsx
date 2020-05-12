import React, { Component } from 'react';
import { DialogModal, ButtonModal, ErrorLabel } from '../../../../common-components/index';


class ModalEditTask extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    save = () => {
        console.log('hello');
    }

    render() {
        var { name, description, status, priority, progress } = this.state;
        var { id, role } = this.props;

        return (
            <div>
                <React.Fragment>
                    <DialogModal
                        size="50"
                        modalID={`modal-edit-task-${this.props.id}`}
                        formID={`form-edit-task-${this.props.id}`}
                        title="Chỉnh sửa thông tin công việc"
                        isLoading={false}
                        func={this.save}
                    // disableSubmit={!this.isFormValidated()}
                    >
                    <form id={`form-edit-task-${this.props.id}`}>
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">Thông tin cơ bản</legend>
                            <div>
                                <div className="form-group">
                                    <label>Tên công việc:</label>
                                    <input
                                        type="text" className="form-control"
                                        name="name"
                                        value={name}
                                        onChange={this.handleChangeName}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Mô tả  công việc:</label>
                                    <textarea
                                        type="text" className="form-control"
                                        name="name"
                                        value={description}
                                        onChange={this.handleChangeDescription}
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="form-group">
                                    <label>Trạng thái công việc:</label>
                                    <input
                                        type="text" className="form-control"
                                        name="name"
                                        value={status}
                                        onChange={this.handleChangeStatus}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Mức độ ưu tiên của công việc:</label>
                                    <input
                                        type="text" className="form-control"
                                        name="name"
                                        value={priority}
                                        onChange={this.handleChangePriority}
                                    />
                                </div>
                            </div>

                        </fieldset>

                        {/* <fieldset className="scheduler-border">
                            <legend className="scheduler-border">Trạng thái, ưu tiên</legend>
                        
                        
                        </fieldset> */}

                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">Task information</legend>


                        </fieldset>

                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">Vai trò</legend>
                            <div>
                                người thực hiện,
                                Người hỗ trợ
                            </div>
                            <div>
                                người thực hiện,
                                Người hỗ trợ
                            </div>

                        </fieldset>

                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">KPI</legend>


                        </fieldset>

                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">Người không làm việc</legend>


                        </fieldset>
                    </form>
                    </DialogModal>
                </React.Fragment>
            </div>
        );
    }
}

export { ModalEditTask };