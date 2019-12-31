import React, { Component } from 'react';
import { connect } from 'react-redux';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
        
    }

    render() { 

        return ( 
            <React.Fragment>
                Home
            </React.Fragment>
         );
    }
}
 
const mapStateToProps = state => {
    return state;
}

const mapDispatchToProps = (dispatch, props) => {
    return{
    }
}

export default connect( mapStateToProps, mapDispatchToProps )( Home );