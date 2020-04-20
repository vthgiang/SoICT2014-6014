import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RoleActions } from '../../super-admin-management/role/redux/actions';
import { LinkActions } from '../../super-admin-management/link/redux/actions';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
        
    }

    componentDidMount(){
        this.props.getRoles();
        this.props.getLinks();
    }

    render() { 

        return ( 
            <div className="box" style={{ minHeight: '450px' }}>
                <div className="box-body">
                    
                </div>
            </div>
         );
    }
}
 
const mapStateToProps = state => {
    return state;
}

const mapDispatchToProps = (dispatch, props) => {
    return{
        getRoles: RoleActions.get,
        getLinks: LinkActions.get
    }
}

export default connect( mapStateToProps, mapDispatchToProps )( Home );