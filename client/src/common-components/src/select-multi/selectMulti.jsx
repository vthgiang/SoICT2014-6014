import React, { Component } from 'react';
import './selectMulti.css';

class SelectMulti extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    static isEqual = (items1, items2) => {
        if (!items1 || !items2) {
            return false;
        }
        if (items1.length !== items2.length) {
            return false;
        }
        for (let i = 0; i < items1.length; ++i) {
            if (items1[i].value !== items2[i].value) {
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

    getValue = () => { // Nếu không dùng onChange, có thể gọi phương thức này qua đối tượng ref để lấy các giá trị đã chọn
        return this.state.value;
    }

    componentDidUpdate() {
        // Cập nhật lại danh sách lựa chọn (theo select với id là this.props.id)
        const { id } = this.props;
        window.$("#" + id).multiselect('rebuild');
        window.$("#" + id).multiselect('select', this.state.value);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id || !SelectMulti.isEqual(nextProps.items, prevState.items)) {
            return {
                value: nextProps.value, // Lưu value ban đầu vào state
                id: nextProps.id,
                items: nextProps.items,
            }
        } else {
            return null;
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        // Chỉ render lại khi id thay đổi, hoặc khi tập items thay đổi
        if (nextProps.id !== this.state.id || !SelectMulti.isEqual(nextProps.items, this.state.items))
            return true;
        return false;
    }

    render() {
        const { id, items, display = "", disabled = false } = this.props;
        return (
            <React.Fragment>
                <div className={`selectmulti ${display}`}>
                    <select className="form-control" style={{ display: "none" }} ref="selectmulti" id={id} multiple="multiple" value={this.state.value} onChange={() => { }} disabled={disabled}>
                        {items.map(item => {
                            return <option key={item.value} value={item.value} disabled={item.disabled ? true : false}>{item.text}</option>
                        })}
                    </select>
                </div>
            </React.Fragment>
        );
    }
}

export { SelectMulti };