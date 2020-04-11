import React, { Component } from 'react';
import './SelectMulti.css';
import './bootstrap-multiselect.css';
import { selelectMultiScript } from './bootstrap-multiselect.js'

class SelectMulti extends Component {
    constructor(props) {
        super(props);
        this.state = {}

        if (document.getElementById("script-select-multi") === null) {
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.id = "script-select-multi";
            script.innerHTML = selelectMultiScript
            document.body.appendChild(script);
        }
    }

    static isEqual = (items1, items2) => {
        if(!items1 || !items2){
            return false;
        }
        if (items1.length !== items2.length){
            return false;
        }
        for (let i=0; i<items1.length; ++i){
            if (items1[i].value !== items2[i].value){
                return false;
            }
        }
        return true;
    }

    componentDidMount() {
        const { id, options, onChange } = this.props;
        window.$("#" + id).multiselect(options);

        window.$("#" + id).on("change", () => {
            let value = [].filter.call(this.refs.selectmulti.options, o => o.selected).map(o => o.value);
            this.state.value = value;
            if (onChange !== undefined) {
                onChange(value);
            }
        })
        
    }

    componentDidUpdate() {
        // Cập nhật lại danh sách lựa chọn (theo select với id là this.props.id)
        const { id } = this.props;
        window.$("#" + id).multiselect('rebuild');
        window.$("#" + id).multiselect('select', this.state.value);
    }

    static getDerivedStateFromProps(nextProps, prevState){
        if (nextProps.id !== prevState.id || !SelectMulti.isEqual(nextProps.items, prevState.items)){
            return {
                value: nextProps.value, // Lưu value ban đầu vào state
                id: nextProps.id,
                items: nextProps.items,
            }
        } else {
            return null;
        }
    }

    shouldComponentUpdate(nextProps, nextState){
        // Chỉ render lại khi id thay đổi, hoặc khi tập items thay đổi
        if (nextProps.id !== this.state.id || !SelectMulti.isEqual(nextProps.items, this.state.items))
            return true;
        return false;
    }

    render() {
        const { id, items } = this.props;
        return (
            <React.Fragment>
                <div className="selectmulti">
                <select className="form-control" style ={{display: "none"}} ref="selectmulti" id={id} multiple="multiple" value={this.state.value} onChange={()=>{}}>
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