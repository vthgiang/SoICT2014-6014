import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { CompanyActions } from '../redux/actions';

class CompanyEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            id: this.props.companyID,
            name: this.props.companyName,
            short_name: this.props.companyShortName,
            description: this.props.companyDescription
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
        const { id, name, short_name, description } = this.state;
        const data = { id, name, short_name, description, active:null };
        this.props.edit( this.props.companyID, data );
    }

    render() { 
        const { translate, companyID, companyName, companyShortName, companyDescription } = this.props;
       
        return ( 
            <React.Fragment>
                <a className="edit" data-toggle="modal" href={ `#modal-company-${companyID}` } title={translate('manage_company.edit')}><i className="material-icons">edit</i></a>
                <div className="modal fade" id={ `modal-company-${companyID}` } style={{textAlign: 'left'}}>
                    <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
                            <h4 className="modal-title">{translate('manage_company.info')}</h4>
                        </div>
                        <div className="modal-body">
                            <form style={{ marginBottom: '20px' }} >
                                <div className="form-group">
                                    <label>{ translate('manage_company.name') }</label>
                                    <input type="text" className="form-control" name="name" onChange={ this.inputChange } defaultValue={ companyName }/>
                                </div>
                                <div className="form-group">
                                    <label>{ translate('manage_company.short_name') }</label>
                                    <input type="text" className="form-control" name="short_name" onChange={ this.inputChange } defaultValue={ companyShortName }/>
                                </div>
                                <div className="form-group">
                                    <label>{ translate('manage_company.description') }</label>
                                    <textarea  style={{ height: '250px' }}  type="text" className="form-control" name="description" onChange={ this.inputChange } defaultValue={ companyDescription }/>
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
            </React.Fragment>
         );
    }
}

const mapStateToProps = state => state;

const mapDispatchToProps =  {
    edit: CompanyActions.edit
}

export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(CompanyEditForm) );