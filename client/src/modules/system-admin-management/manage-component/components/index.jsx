import React, { Component } from 'react';
import ComponentCreateForm from './ComponentCreateForm';
import TableComponent from './TableComponent';

class ManageComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }

    componentDidMount(){
        let script = document.createElement('script');
        script.src = '/main/js/CoCauToChuc.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
    }

    render() { 
        return ( 
            <React.Fragment>
                <ComponentCreateForm />
                <TableComponent />
            </React.Fragment>
         );
    }
}
 
export default ManageComponent;