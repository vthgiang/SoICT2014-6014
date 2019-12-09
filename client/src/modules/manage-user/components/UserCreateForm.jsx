import React, { Component } from 'react';
import { connect } from 'react-redux';
import { get } from '../redux/actions';
import { withTranslate } from 'react-redux-multilingual';
import Swal from 'sweetalert2';
import ReactLoading from 'react-loading';

class UserCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        const{ translate } = this.props;
        return ( 
            <React.Fragment>
                <a className="btn btn-success pull-right" data-toggle="modal" href='#modal-id'>{ translate('manageUser.create') }</a>
                <div className="modal fade" id="modal-id">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                                <h4 className="modal-title">{ translate('manageUser.name') }</h4>
                            </div>
                            <div className="modal-body">
                                <form style={{ marginBottom: '20px' }} >
                                    <div className="form-group">
                                        <label>{ translate('table.name') }</label>
                                        <input type="text" className="form-control" name="name" onChange={ this.inputChange }/>
                                    </div>
                                    <div className="form-group">
                                        <label>{ translate('table.email') }</label>
                                        <input type="email" className="form-control" name="email" onChange={ this.inputChange }/>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-danger" data-dismiss="modal"><i className="fa fa-close"></i> { translate('table.close') }</button>
                                <button className="btn btn-primary" onClick={ this.save } data-dismiss="modal"><i className="fa fa-save"></i> { translate('table.save') }</button>
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
        getUser: () => {
            dispatch(get()); 
        },
        // create: (user) => {
        //     dispatch(create(user));
        // },
        // destroy: (id) => {
        //     dispatch(destroy(id));
        // }
    }
}

export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(UserCreateForm) );