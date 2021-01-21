import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { ErrorLabel, SelectBox, TreeSelect } from '../../../../../common-components';
import { CareerReduxAction } from '../../redux/actions';
import ValidationHelper from '../../../../../helpers/validationHelper';

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

    handlePackage = (e) => {
        const { value } = e.target;
        const { translate } = this.props;
        const { message } = ValidationHelper.validateName(translate, value, 1, 255);
        this.setState({
            package: value,
            // nameError: message
        });
    }

    handleParent = (value) => {
        this.setState({ parent: value[0] });
    };

    handleActionLabel = (value) => {
        this.setState({ actionLabel: value });
    };

    isValidateForm = () => {
        let { name, showParent, parent, code } = this.state;
        let { translate } = this.props;
        if (
            !ValidationHelper.validateName(translate, name, 1, 255).status
        ) return false;
        if (showParent && !parent) return false;
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
        const { archiveId, name, description, archiveParent } = this.state;
        const { list } = documents.administration.archives;

        console.log('state data', this.state);
        this.props.editCareerAction(this.state);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.careerId !== prevState.careerId) {
            return {
                ...prevState,
                oldData: {
                    careerId: nextProps.careerId,
                    name: nextProps.careerName,
                    package: nextProps.careerPackage,
                    code: nextProps.careerCode,
                    parent: nextProps.careerParent,
                    actionLabel: nextProps.actionLabel,
                    isLabel: nextProps.isLabel,
                },
                careerId: nextProps.careerId,
                name: nextProps.careerName,
                package: nextProps.careerPackage,
                code: nextProps.careerCode,
                parent: nextProps.careerParent,
                showParent: nextProps.careerParent,
                actionLabel: nextProps.actionLabel,
                isLabel: nextProps.isLabel,

                nameError: undefined,
                codeError: undefined
            }
        } else {
            return null;
        }
    }

    render() {
        const { translate, documents } = this.props;
        const { listData, unChooseNode } = this.props;
        const { name, code, parent, showParent, codeError, nameError, actionLabel, careerId, isLabel } = this.state;
        const { list } = listData;
        let listCareer = [];
        for (let i in list) {
            if (!unChooseNode.includes(list[i].id)) {
                listCareer.push(list[i]);
            }
        }
        const disabled = !this.isValidateForm();
        const { career } = this.props;
        const listLabel = career.listAction.filter(e => e.isLabel === 1);

        console.log('statesssss', this.state);

        return (
            <div id="edit-career-action">
                {/* {!showParent &&
                    <div className={`form-group`}>
                        <label>Gói thầu</label>
                        <input type="text" className="form-control" onChange={this.handlePackage} value={this.state.package} />
                    </div>
                } */}
                <div className={`form-group ${nameError === undefined ? "" : "has-error"}`}>
                    <label>Tên<span className="text-red">*</span></label>
                    <input type="text" className="form-control" onChange={this.handleName} value={name} />
                    <ErrorLabel content={nameError} />
                </div>
                { isLabel === 1 &&
                <div className={`form-group `}> 
                    <label>Nhãn dán<span className="text-red">*</span></label>
                    <input type="text" className="form-control" onChange={this.handleCode} value={code} />
                    <ErrorLabel content={codeError} />
                </div>
                }
                { showParent && isLabel !== 1 &&
                    <div className="form-group">
                        <label>{translate('document.administration.archives.parent')}</label>
                        <TreeSelect data={listData} value={[parent]} handleChange={this.handleParent} mode="radioSelect" />
                    </div>
                }
                { isLabel !== 1 &&
                    <div className="form-group">
                        <label className="form-control-static">Nhóm hoạt động</label>
                        {/* <TreeSelect data={dataTreeAction} value={action?.id} handleChange={this.handleAction} mode="radioSelect" /> */}
                        <SelectBox
                            id={`select-career-action-select-label-${careerId}`}
                            lassName="form-control select2"
                            style={{ width: "100%" }}
                            items={listLabel.map(e => {
                                return {text: e.name, value: e._id}
                            })}
                            options={{ placeholder: "Chọn hoạt động công việc" }}
                            onChange={this.handleActionLabel}
                            value={actionLabel}
                            multiple={true}
                        />
                    </div>
                }
                <div className="form-group">
                    <button className="btn btn-success pull-right" style={{ marginLeft: '5px' }} disabled={disabled} onClick={this.save}>{translate('form.save')}</button>
                    <button className="btn btn-danger" onClick={() => {
                        window.$(`#edit-career-action`).slideUp()
                    }}>{translate('form.close')}</button>
                </div>
            </div >
        )
    }
}


const mapStateToProps = state => state;

const mapDispatchToProps = {
    editCareerAction: CareerReduxAction.editCareerAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(EditForm));