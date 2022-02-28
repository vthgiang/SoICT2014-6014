import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ErrorLabel, SelectBox, TreeSelect } from '../../../../common-components';
import { MajorActions } from '../redux/actions';
import ValidationHelper from '../../../../helpers/validationHelper';

class EditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    handleName = (e) => {
        const { value } = e.target;
        const { translate } = this.props;
        const { message } = ValidationHelper.validateName(translate, value, 1, 255);
        this.setState({
            name: value,
            nameError: message
        });
    }

    handleCode = (e) => {
        const { value } = e.target;
        let msg;
        this.setState({
            code: value,
            codeError: msg,
        });
    }

    handleParent = (value) => {
        this.setState({ parents: value });
    };

    isValidateForm = () => {
        let { name } = this.state;
        let { translate } = this.props;
        if (
            !ValidationHelper.validateName(translate, name, 1, 255).status
        ) return false;
        return true;
    }

    findNode = (element, id) => {
        if (element.id === id) {
            return element
        }
        else if (element.children) {
            let i;
            let result = "";
            for (i = 0; i < element.children.length; i++) {
                result = this.findNode(element.children[i], id);
            }
            return result;
        }
        return null;
    }
    // tìm các node con cháu
    findChildrenNode = (list, node) => {
        let array = [];
        let queue_children = [node];
        console.log(list, node, 'findChildrenNode')
        while (queue_children.length > 0) {
            let tmp = queue_children.shift();
            array = [...array, tmp._id];
            let children = list.filter(child => child.parent === tmp._id);
            queue_children = queue_children.concat(children);
        }
        return array;
    }

    save = () => {
        const { documents } = this.props;
        const { majorId, name, code, majorParent } = this.state;
        const { list } = documents.administration.archives;

        console.log('state data', this.state);
        console.log('props data', this.props);

        this.props.editMajor(this.state);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.majorId !== prevState.majorId) {
            return {
                ...prevState,
                oldData: {
                    majorId: nextProps.majorId,
                    name: nextProps.majorName,
                    code: nextProps.majorCode,
                    parents: nextProps.majorParent,
                },
                majorId: nextProps.majorId,
                name: nextProps.majorName,
                code: nextProps.majorCode,
                parents: nextProps.majorParent,

                nameError: undefined,
                codeError: undefined
            }
        } else {
            return null;
        }
    }

    render() {
        const { translate } = this.props;
        const { listData } = this.props;
        let { name, code, parents, codeError, nameError } = this.state;
        console.log('listData', listData)
        console.log('parents', parents)

        const disabled = !this.isValidateForm();
        return (
            <React.Fragment>
                <DialogModal
                    modalID="edit-major"
                    formID="edit-major"
                    title="Chỉnh sửa chuyên ngành"
                    disableSubmit={!this.isValidateForm()}
                    func={this.save}
                >
                <form id="edit-major">
                    <div className={`form-group ${nameError === undefined ? "" : "has-error"}`}>
                        <label>Tên<span className="text-red">*</span></label>
                        <input type="text" className="form-control" onChange={this.handleName} value={name} />
                        <ErrorLabel content={nameError} />
                    </div>
                    <div className={`form-group ${nameError === undefined ? "" : "has-error"}`}>
                        <label>Nhãn dán<span className="text-red">*</span></label>
                        <input type="text" className="form-control" onChange={this.handleCode} value={code} />
                        <ErrorLabel content={codeError} />
                    </div>
                    <div className="form-group">
                        <label>{translate('document.administration.archives.parent')}</label>
                        <SelectBox
                            id={`field-major-edit`}
                            lassName="form-control select2"
                            style={{ width: "100%" }}
                            items={listData.filter(item => item.parents.length == 0).map(x => {
                                return { text: x.name, value: x._id }
                            })}
                            options={{ placeholder: "Chọn thông tin cha" }}
                            onChange={this.handleParent}
                            value={parents}
                            multiple={true}
                        />
                    </div>
                    {/* <div className="form-group">
                        <button className="btn btn-success pull-right" style={{ marginLeft: '5px' }} disabled={disabled} onClick={this.save}>{translate('form.save')}</button>
                        <button className="btn btn-danger" onClick={() => {
                            window.$(`#edit-major`).slideUp()
                        }}>{translate('form.close')}</button>
                    </div> */} 
                </form>
                </DialogModal>
            </React.Fragment>
        )
    }
}


const mapStateToProps = state => state;

const mapDispatchToProps = {
    editMajor: MajorActions.editMajor,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(EditForm));