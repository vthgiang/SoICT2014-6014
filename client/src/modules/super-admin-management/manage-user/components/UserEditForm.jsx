import React, { Component } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import { UserActions } from '../redux/actions';

class UserEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            id: this.props.userEditID,
            email: this.props.email,
            name: this.props.username,
            active: this.props.active,
            status: [
                { id: 1, name: "Disable", value: false },
                { id: 2, name: "Enable", value: true }
            ]
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
        const { id, name, active } = this.state;
        const user = {
            id,
            name,
            active
        };
        this.props.edit(user);
    }

    render() { 
        const { userEditID, translate } = this.props;
        const { email, name, active, status } = this.state;
        return ( 
            <React.Fragment>
                <a className="edit" data-toggle="modal" href={`#edit-user-modal-${userEditID}`}><i className="material-icons">edit</i></a>
                <div className="modal fade" id={ `edit-user-modal-${userEditID}` } style={{textAlign: 'left'}}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
                            <h4 className="modal-title">{ translate('manageUser.info') }</h4>
                        </div>
                        <div className="modal-body">
                            <form style={{ marginBottom: '20px' }} >
                                <div className="row">
                                    <div className="form-group col-sm-8">
                                        <label>{ translate('table.email') }</label>
                                        <input type="text" className="form-control" name="email" onChange={ this.inputChange } defaultValue={ email } disabled/>
                                    </div>
                                    <div className="form-group col-sm-4">
                                        <label>{ translate('table.status') }</label>
                                        <select 
                                            className="form-control" 
                                            style={{width: '100%'}} 
                                            name="active" 
                                            defaultValue={ active }
                                            onChange={this.inputChange}>
                                            {   
                                                status.map(result => <option key={result.id} value={result.value}>{result.name}</option>)    
                                            }
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>{ translate('table.name') }</label>
                                    <input type="text" className="form-control" name="name" onChange={ this.inputChange } defaultValue={ name }/>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" data-dismiss="modal">{ translate('table.close') }</button>
                            <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={this.save}>{ translate('table.save') }</button>
                        </div>
                        </div>
                    </div>
                </div>

                
            </React.Fragment>
         );
    }
}
 
const mapStateToProps = state => state;
const action = {
    edit: UserActions.edit
}


export default connect( mapStateToProps, action )( withTranslate(UserEditForm) );