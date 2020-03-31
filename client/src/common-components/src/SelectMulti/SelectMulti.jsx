import React, { Component } from 'react';
import './SelectMulti.css';

class SelectMulti extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }

    componentDidMount(){
        let script = document.createElement('script');
        script.src = '../lib/main/js/SelectMulti.js'
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        const { nonSelectedText, allSelectedText } = this.props;

        window.$(document).ready(function () {
            window.$('#multiSelectUnit').multiselect({
                //   includeSelectAllOption : true,
                nonSelectedText: nonSelectedText,
                allSelectedText: allSelectedText
            });
        });
    }
    render() { 
        const { id, items } = this.props;
        return ( 
            <React.Fragment>
                <div className="selectmulti">
                    <select className="form-control" style ={{display: "none"}}id={id} multiple="multiple" defaultValue={items.map(item => item._id)}>
                        {items.map(item => {
                            return <option key={item._id} value={item._id}>{item.name}</option>
                        })}
                    </select>
                </div>
            </React.Fragment>
         );
    }
}
 
export { SelectMulti };