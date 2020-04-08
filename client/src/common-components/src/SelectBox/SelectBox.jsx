import React, { Component } from 'react';
import { select2 } from './select2.full.min.js';
import './select2.css';
import './SelectBox.css';

class SelectBox extends Component {
    constructor(props) {
        super(props);
        this.state = { }

        if (document.getElementById("script-select-box") === null){
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.id = "script-select-box";
            script.innerHTML = select2
            document.body.appendChild(script);
        }
    }

    componentDidMount(){
        const { id, onChange } = this.props;
        window.$("#" + id).select2();
        window.$("#" + id).on("change", () => {
            let value = [].filter.call(this.refs.select.options, o => o.selected).map(o => o.value);
            this.state.value = value;
            onChange(value); // Thông báo lại cho parent component về giá trị mới (để parent component lưu vào state của nó)
        });
    }

    componentDidUpdate() {
        const { id } = this.props;
        window.$("#" + id).select2();
    }

    static getDerivedStateFromProps(nextProps, prevState){
        if (nextProps.id !== prevState.id){
            return {
                value: nextProps.value, // Lưu value ban đầu vào state
                id: nextProps.id
            }
        } else {
            return null;
        }
    }

    shouldComponentUpdate(nextProps, nextState){
        if (nextProps.id !== this.state.id) // Chỉ render 1 lần, trừ khi id thay đổi
            return true;
        return false;  // Tự chủ động update (do đã lưu value vào state)
    }

    render() { 
        const { id, items, className, style, multiple=false} = this.props;
        return ( 
            <React.Fragment>
                <div>
                    <select className={className} style={style} ref="select" value={this.state.value} id={id} multiple={multiple} onChange={() => {}}>
                        {items.map(item => {
                            return <option key={item.value} value={item.value}>{item.text}</option>
                        })}
                    </select>
                </div>
            </React.Fragment>
         );
    }
}
 
export { SelectBox };