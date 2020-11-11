import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { generateCode } from "../../../../../helpers/generateCode";
import { GoodActions } from "../../../common-production/good-management/redux/actions";
import { SLAActions } from "../redux/actions";
import { DialogModal, SelectMulti, ButtonModal, ErrorLabel, SelectBox } from "../../../../../common-components";
import ValidationHelper from "../../../../../helpers/validationHelper";

class SLACreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code: "",
        };
    }

    handleClickCreateCode = () => {
        this.setState((state) => {
            return { ...state, code: generateCode("SLA_") };
        });
    };

    render() {
        let { code, titleError, title } = this.state;
        return (
            <React.Fragment>
                <ButtonModal
                    onButtonCallBack={this.handleClickCreateCode}
                    modalID={`modal-add-sla`}
                    button_name={"Thêm mới"}
                    title={"Thêm cam kết chất lượng"}
                />
                <DialogModal
                    modalID={`modal-add-sla`}
                    isLoading={false}
                    formID={`form-add-sla`}
                    title={"Thêm cam kết chất lượng"}
                    msg_success={"Thêm thành công"}
                    msg_faile={"Thêm không thành công"}
                    // disableSubmit={!this.isFormValidated()}
                    // func={this.save}
                    size="50"
                    style={{ backgroundColor: "green" }}
                >
                    <form id={`form-add-sla`}>
                        <div className="form-group">
                            <label>
                                {"Max"}
                                <span className="attention"> </span>
                            </label>
                            <input type="text" className="form-control" value={code} disabled="true" />
                        </div>
                        <div className={`form-group ${!titleError ? "" : "has-error"}`}>
                            <label>
                                {"Tiêu đề"}
                                <span className="attention"> * </span>
                            </label>
                            <input type="text" className="form-control" value={title} onChange={this.handleTitleChange} />
                            <ErrorLabel content={titleError} />
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

export default SLACreateForm;
