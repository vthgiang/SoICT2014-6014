import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { CompanyActions } from '../redux/actions';
import { ModalButton, ModalDialog } from '../../../../common-components';

class CompanyCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            name: null,
            short_name: null,
            description: null,
            email: null
        }
        this.inputChange = this.inputChange.bind(this);
        this.save = this.save.bind(this);
    }

    inputChange = (e) => {
        const target = e.target;
        const name = target.name;
        const value = target.value;
        this.setState({
            [name]: value
        });
    }

    save = () => {
        const { name, short_name, description, email } = this.state;
        const company = { name, short_name, description, email };
        return this.props.create( company );
    }

    render() { 
        const { translate } = this.props;

        return ( 
            <React.Fragment>
                <ModalButton modalID="modal-create-company" button_name={translate('manage_company.add')} title={translate('manage_company.add_title')}/>
                <ModalDialog
                    modalID="modal-create-company"
                    formID="form-create-company"
                    title={translate('manage_company.add_title')}
                    msg_success={translate('manage_company.add_success')}
                    msg_faile={translate('manage_company.add_faile')}
                    func={this.save}
                >
                    <form id="form-create-company">
                        <div className="form-group">
                            <label>{ translate('manage_company.name') }<span className="text-red"> * </span></label>
                            <input type="text" className="form-control" name="name" onChange={ this.inputChange }/>
                        </div>
                        <div className="form-group">
                            <label>{ translate('manage_company.short_name') }<span className="text-red"> * </span></label>
                            <input type="text" className="form-control" name="short_name" onChange={ this.inputChange }/>
                        </div>
                        <div className="form-group">
                            <label>{ translate('manage_company.description') }<span className="text-red"> * </span></label>
                            <textarea style={{ height: '150px' }}  type="text" className="form-control" name="description" onChange={ this.inputChange }/>
                        </div>
                        <div className="form-group">
                            <label>{ translate('manage_company.super_admin') }<span className="text-red"> * </span></label>
                            <input type="email" className="form-control" name="email" onChange={ this.inputChange }/>
                        </div>
                    </form>
                </ModalDialog>
            </React.Fragment>
         );
    }
}
 
const mapStateToProps = state => {
    return state;
}

const mapDispatchToProps = {
    create: CompanyActions.create
}

export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(CompanyCreateForm) );