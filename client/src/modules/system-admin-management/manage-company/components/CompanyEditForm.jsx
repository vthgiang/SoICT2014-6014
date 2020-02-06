import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

class CompanyEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            id: this.props.companyID,
            name: this.props.companyName,
            shortName: this.props.companyShortName,
            description: this.props.companyDescription,
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
        const { id, name, shortName, description } = this.state;
        const company = { id, name, shortName, description };
        this.props.edit( this.props.companyID, company );
    }

    render() { 
        const { translate, companyID, companyName, companyShortName, companyDescription } = this.props;
        return ( 
            <React.Fragment>
                <a className="edit" data-toggle="modal" href={ `#modal-company-${companyID}` } ><i className="material-icons">edit</i></a>
                <div className="modal fade" id={ `modal-company-${companyID}` }>
                    <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
                        <h4 className="modal-title">Company - { companyID }</h4>
                        </div>
                        <div className="modal-body">
                            <form style={{ marginBottom: '20px' }} >
                                <div className="form-group">
                                    <label>{ translate('table.name') }</label>
                                    <input type="text" className="form-control" name="name" onChange={ this.inputChange } defaultValue={ companyName }/>
                                </div>
                                <div className="form-group">
                                    <label>{ translate('table.shortName') }</label>
                                    <input type="text" className="form-control" name="shortName" onChange={ this.inputChange } defaultValue={ companyShortName }/>
                                </div>
                                <div className="form-group">
                                    <label>{ translate('table.description') }</label>
                                    <textarea  style={{ height: '250px' }}  type="text" className="form-control" name="description" onChange={ this.inputChange } defaultValue={ companyDescription }/>
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
            </React.Fragment>
         );
    }
}

const mapStateToProps = state => {
    return state;
}

const mapDispatchToProps = (dispatch, props) => {
    return{
        // edit: (id, company) => {
        //     dispatch(edit(id, company)); 
        // },
    }
}

export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(CompanyEditForm) );