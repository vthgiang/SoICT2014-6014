import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

class AlertDisplayResponseFromServer extends Component {
    
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() { 
        const { translate } = this.props;
        const { type=null, title=null, content=[] } = this.props;

        return ( 
            <React.Fragment>
                <h3 className="text-center">
                    ---{translate(title)}---
                </h3>
                <ul>
                    {
                        content.map(message => {
                            if(type === 'success')
                                return <li key={message}>{translate(`success.${message}`)}</li>
                            else if(type === 'error')
                                return <li key={message}>{translate(`error.${message}`)}</li>
                        })
                    }
                </ul>
            </React.Fragment>
        );
    }
}
 
const mapStateToProps = state => state;

export default connect( mapStateToProps )( withTranslate(AlertDisplayResponseFromServer) );