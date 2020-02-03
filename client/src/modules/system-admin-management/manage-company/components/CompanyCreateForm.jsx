import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { create } from '../redux/actions';

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
        this.props.addCompany( company );
    }

    render() { 
        const { translate } = this.props;

        return ( 
            <React.Fragment>
                <div>
                    <a className="btn btn-success pull-right" data-toggle="modal" href="#modal-create-company" title={ translate('manageCompany.create') }>
                        { translate('add') }
                    </a>
                    <div className="modal fade" id="modal-create-company">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
                                    <h4 className="modal-title"> { translate('manageCompany.create')} </h4>
                                </div>
                                <div className="modal-body">
                                    <form style={{ marginBottom: '20px' }} >
                                        <div className="form-group">
                                            <label>{ translate('table.name') }</label>
                                            <input type="text" className="form-control" name="name" onChange={ this.inputChange }/>
                                        </div>
                                        <div className="form-group">
                                            <label>{ translate('table.shortName') }</label>
                                            <input type="text" className="form-control" name="short_name" onChange={ this.inputChange }/>
                                        </div>
                                        <div className="form-group">
                                            <label>{ translate('table.description') }</label>
                                            <textarea style={{ height: '150px' }}  type="text" className="form-control" name="description" onChange={ this.inputChange }/>
                                        </div>
                                        <div className="form-group">
                                            <label>{ translate('table.email') }</label>
                                            <input type="email" className="form-control" name="email" onChange={ this.inputChange }/>
                                        </div>
                                    </form>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-default" data-dismiss="modal">{ translate('table.close') }</button>
                                    <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={ this.save }>{ translate('table.save') }</button>
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

const mapDispatchToProps = (dispatch, props) => {
    return{
        addCompany: (company) => {
            dispatch(create(company)); 
        },
    }
}

export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(CompanyCreateForm) );