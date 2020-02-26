import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { CompanyActions } from '../redux/actions';

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

    save = (e) => {
        e.preventDefault();
        const { name, short_name, description, email } = this.state;
        const company = { name, short_name, description, email };
        this.props.create( company );
    }

    render() { 
        const { translate } = this.props;

        return ( 
            <React.Fragment>
                <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                    <a 
                        className="btn btn-success pull-right" 
                        data-backdrop="static" 
                        data-keyboard="false" 
                        data-toggle="modal" 
                        href="#modal-create-company" 
                        title={ translate('manage_company.add_title') }
                    >
                        { translate('manage_company.add') }
                    </a>
                    <div className="modal fade" id="modal-create-company" style={{textAlign: 'left'}}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
                                    <h4 className="modal-title"> { translate('manage_company.add_title')} </h4>
                                </div>
                                <div className="modal-body">
                                    <form style={{ marginBottom: '20px' }} >
                                        <div className="form-group">
                                            <label>{ translate('manage_company.name') }</label>
                                            <input type="text" className="form-control" name="name" onChange={ this.inputChange }/>
                                        </div>
                                        <div className="form-group">
                                            <label>{ translate('manage_company.short_name') }</label>
                                            <input type="text" className="form-control" name="short_name" onChange={ this.inputChange }/>
                                        </div>
                                        <div className="form-group">
                                            <label>{ translate('manage_company.description') }</label>
                                            <textarea style={{ height: '150px' }}  type="text" className="form-control" name="description" onChange={ this.inputChange }/>
                                        </div>
                                        <div className="form-group">
                                            <label>{ translate('manage_company.super_admin') }</label>
                                            <input type="email" className="form-control" name="email" onChange={ this.inputChange }/>
                                        </div>
                                    </form>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-primary" data-dismiss="modal">{ translate('form.close') }</button>
                                    <button type="button" className="btn btn-success" data-dismiss="modal" onClick={ this.save }>{ translate('form.save') }</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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