import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

class NotFound extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        const {translate} = this.props;
        return ( 
            <div style={{backgroundColor: 'white', width: '100%', height: '650px', marginTop: '-25px'}}>
                <h1 style={{padding: '10px 10px 10px 10px', textAlign: 'center'}}>
                    {translate('not_found')}
                </h1>
            </div>
         );
    }
}
 
const mapState = state => state;
const NotFoundExport = connect(mapState, null)(withTranslate(NotFound));
export { NotFoundExport as NotFound }