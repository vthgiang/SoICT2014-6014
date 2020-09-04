import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ButtonModal, SelectBox, ErrorLabel } from '../../../../common-components';
import { CrmGroupActions } from '../redux/actions';

class CreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        const { translate } = this.props;
        const {crm} = this.props;

        return (
            <React.Fragment>
                <ButtonModal modalID="modal-crm-group-create" button_name={translate('general.add')} title={translate('crm.group.add')} />
                <DialogModal
                    modalID="modal-crm-group-create" isLoading={crm.group.isLoading}
                    formID="form-crm-group-create"
                    title={translate('crm.group.add')}
                    func={this.save}
                >
                    <form id="form-crm-group-create">
                        <div className="form-group">
                            <label>{translate('crm.group.name')}<span className="attention"> * </span></label>
                            <input type="text" className="form-control" onChange={this.handleName} />
                        </div>
                        <div className="form-group">
                            <label>{translate('crm.group.code')}<span className="attention"> * </span></label>
                            <input type="text" className="form-control" onChange={this.handleCode} />
                        </div>
                        <div className="form-group">
                            <label>{translate('crm.group.description')}</label>
                            <textarea type="text" className="form-control" onChange={this.handleDescription} />
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }

    handleName = (e) => {
        this.setState({
            name: e.target.value
        });
    }

    handleCode = (e) => {
        this.setState({
            code: e.target.value
        });
    }

    handleDescription = (e) => {
        this.setState({
            description: e.target.value
        });
    }

    save = () => {
        const data = {
            name: this.state.name,
            code: this.state.code,
            description: this.state.description
        }
        return this.props.createGroup(data);
    }
}

function mapStateToProps(state) {
    const {crm} = state;
    return {crm};
}

const mapDispatchToProps = {
    createGroup: CrmGroupActions.createGroup
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CreateForm));