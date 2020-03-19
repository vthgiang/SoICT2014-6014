import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { AuthActions } from '../../auth/redux/actions';
import { getStorage } from '../../../config';

class NotFound extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        const {translate} = this.props;
        return ( 
            <div style={{backgroundColor: 'white',padding: '100px 20px 400px 20px'}}>
                <div className="error-page">
                <h2 className="headline text-yellow"> 404 </h2>
                <div className="error-content">
                    <h3><i className="fa fa-warning text-yellow" />{translate('not_found.title')}</h3>
                    <p className="text-center">
                        {`${translate('not_found.content')}. `}
                        <a href="/">{translate('not_found.back_to_home')}</a>
                    </p>
                </div>
                </div>
            </div>
         );
    }

    componentDidMount() {
        var currentRole = getStorage('currentRole');
        this.props.getLinksOfRole(currentRole)
            .then(res => {
                var {links} = this.props.auth; 
                var path = window.location.pathname;
                for (let index = 0; index < links.length; index++) {
                    const element = links[index];
                    if(element.url === path){
                        this.props.getComponentsOfUserInLink(currentRole, element._id);
                        break;
                    }
                }
            });
    }
}
 
const mapState = state => state;
const actionToStore = {
    getLinksOfRole: AuthActions.getLinksOfRole,
    getComponentsOfUserInLink: AuthActions.getComponentOfUserInLink
}
const NotFoundExport = connect(mapState, actionToStore)(withTranslate(NotFound));
export { NotFoundExport as NotFound }