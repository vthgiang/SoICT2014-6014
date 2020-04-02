import React, { Component } from 'react';
import './SelectMulti.css';
import { selelectMultiScript } from './SelectMulti.js'

class SelectMulti extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }

    componentDidMount(){
        if (document.getElementById("script-select-multi") === null){
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.id = "script-select-multi";
            script.innerHTML = selelectMultiScript
            document.body.appendChild(script);
        }

        const { nonSelectedText, allSelectedText, id } = this.props;

        window.$("#" + id).multiselect({
            nonSelectedText: nonSelectedText,
            allSelectedText: allSelectedText
        });
    }
    render() { 
        const { id, items, selectAllByDefault } = this.props;
        return ( 
            <React.Fragment>
                <div className="selectmulti">
                    <select className="form-control" style ={{display: "none"}} id={id} multiple="multiple" defaultValue={selectAllByDefault?items.map(item => item.value):[]}>
                        {items.map(item => {
                            return <option key={item.value} value={item.value}>{item.text}</option>
                        })}
                    </select>
                </div>
            </React.Fragment>
         );
    }
}
 
export { SelectMulti };