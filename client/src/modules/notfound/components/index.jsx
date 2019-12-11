import React, { Component } from 'react';

class NotFoundPage extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( 
            <React.Fragment>
                <h1 style={{ textAlign: 'center', color: 'red'}}> NOT FOUND THIS PAGE</h1>
            </React.Fragment>
         );
    }
}
 
export default NotFoundPage;