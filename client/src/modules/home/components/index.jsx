import React, { Component } from 'react';
import { connect } from 'react-redux';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
        
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

export default connect( mapStateToProps )( Home );