import React, { Component } from 'react';
import './selectBox.css';

class SelectBox extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    setOptionsSelect2 = (id, changeSearch, searchItems, multiple = false) => {
        function delay(callback, ms) {
            var timer = 0;
            return function () {
                var context = this, args = arguments;
                clearTimeout(timer);
                timer = setTimeout(function () {
                    callback.apply(context, args);
                }, ms || 0);
            };
        }
        return {
            ajax: {
                url: function (params) {
                    if (params.term !== undefined && params.term !== "") {
                        let inputSearch;
                        if (multiple === true) {
                            let parentSelect = window.$("#" + id).parent();
                            inputSearch = parentSelect.find('input.select2-search__field');
                        } else {
                            let children = window.$(".select2-dropdown--below");
                            inputSearch = children.find('input.select2-search__field');
                        }
                        inputSearch.keyup(delay(function (e) {
                            if (this.value === params.term)
                                changeSearch(this.value);
                        }, 500));
                    }
                },
                processResults: function (data) {
                    return {
                        results: searchItems.map(x => { return { id: x.value, text: x.text } })
                    };
                },
            }
        }
    }

    componentDidMount() {
        let { id, onChange, options = { minimumResultsForSearch: 15 }, changeSearch, searchItems, multiple } = this.props;
        if (changeSearch !== undefined && changeSearch !== false) {
            options = this.setOptionsSelect2(id, changeSearch, searchItems, multiple)
        }
        window.$("#" + id).select2(options);

        window.$("#" + id).on("change", () => {
            let value = [].filter.call(this.refs.select.options, o => o.selected).map(o => o.value);
            this.setState(state => {
                return {
                    ...state,
                    value
                }
            });
            if (onChange !== undefined && onChange !== null) {
                onChange(value); // Thông báo lại cho parent component về giá trị mới (để parent component lưu vào state của nó)
            }
        });
    }
    componentDidUpdate() {
        let { id, options = {}, changeSearch, multiple, textSearch } = this.props;
        if (changeSearch === undefined || changeSearch === false) {
            window.$("#" + id).select2(options);
        }
    }

    getValue = () => { // Nếu không dùng onChange, có thể gọi phương thức này qua đối tượng ref để lấy các giá trị đã chọn
        return this.state.value;
    }

    static isEqual = (items1, items2) => {
        if (!items1 || !items2) {
            return false;
        }
        if (items1.length !== items2.length) {
            return false;
        }
        for (let i = 0; i < items1.length; ++i) {
            if (!(items1[i].value instanceof Array) && items1[i].value !== items2[i].value) { // Kiểu bình thường
                return false;
            } else if (items1[i].value instanceof Array && JSON.stringify(items1[i].value) !== JSON.stringify(items2[i].value)) { // Kiểu group
                return false;
            }
        }
        return true;
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id || !SelectBox.isEqual(nextProps.items, prevState.items) ||
            nextProps.disabled !== prevState.disabled || !SelectBox.isEqual(nextProps.searchItems, prevState.searchItems)) {
            return {
                value: nextProps.value, // Lưu value ban đầu vào state
                id: nextProps.id,
                items: nextProps.items,
                searchItems: nextProps.searchItems !== undefined ? nextProps.searchItems : [],
                disabled: nextProps.disabled !== undefined ? nextProps.disabled : false
            }
        } else {
            return null;
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        // Chỉ render lại khi id thay đổi, hoặc khi tập items thay đổi, hoặc disabled thay đổi
        if (nextProps.id !== this.state.id || !SelectBox.isEqual(nextProps.items, this.state.items) ||
            (nextProps.disabled !== undefined ? nextProps.disabled : false) !== this.state.disabled ||
            !SelectBox.isEqual(nextProps.searchItems !== undefined ? nextProps.searchItems : [], this.state.searchItems)) {

            if (nextProps.searchItems !== undefined && !SelectBox.isEqual(nextProps.searchItems !== undefined ? nextProps.searchItems : [], this.state.searchItems)) {
                let { id, changeSearch, searchItems, multiple } = nextProps;
                if (changeSearch !== undefined && changeSearch !== false) {
                    let options = this.setOptionsSelect2(id, changeSearch, searchItems, multiple)
                    window.$("#" + nextProps.id).select2('open');
                    window.$("#" + id).select2(options);
                    window.$("#" + nextProps.id).select2('open');
                }
                let inputSearch;
                if (multiple === true) {
                    let parentSelect = window.$("#" + id).parent();
                    let children = parentSelect.children(1);
                    inputSearch = children.find('input.select2-search__field')
                    console.log(inputSearch.val());
                } else {
                    let children = window.$(".select2-dropdown--below");
                    inputSearch = children.find('input.select2-search__field');
                }
                inputSearch.val(nextProps.textSearch);
            }
            return true;
        }
        return false;
    }

    render() {
        const { id, items = [], className, style, multiple = false, options = {}, disabled = false } = this.props;
        return (
            <React.Fragment>
                <div className="select2">
                    <select className={className} style={style} ref="select" value={this.state.value} id={id} multiple={multiple} onChange={() => { }} disabled={disabled}>
                        {options.placeholder !== undefined && multiple === false && <option></option>} {/*Ở chế độ single selection, nếu muốn mặc định không chọn gì*/}
                        {items.map(item => {
                            if (!(item.value instanceof Array)) { // Dạng bình thường
                                return <option key={item.value} value={item.value}>{item.text}</option>
                            } else {
                                return ( // Dạng group
                                    <optgroup key={item.text} label={item.text}>
                                        {item.value.map(subItem => {
                                            return <option key={subItem.value} value={subItem.value}>{subItem.text}</option>
                                        })}
                                    </optgroup>
                                )
                            }
                        })}
                    </select>
                </div>
            </React.Fragment>
        );
    }
}

export { SelectBox };