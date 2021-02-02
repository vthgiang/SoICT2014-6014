import { Component } from 'react';
import "./slimScroll.css";

class SlimScroll extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidUpdate() {
        const { verticalScroll=false, outerComponentId, maxHeight=200, activate } = this.props

        if (verticalScroll) {
            SlimScroll.addVerticalScrollStyleCSS(outerComponentId, maxHeight, activate);
        } else {
            this.addStyleCSS();
        }
    }

    componentDidMount() {
        const { verticalScroll=false, outerComponentId, maxHeight=200, activate } = this.props

        if (verticalScroll) {
            SlimScroll.addVerticalScrollStyleCSS(outerComponentId, maxHeight, activate);
        } else {
            this.addStyleCSS();
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        const { maxHeight=200, verticalScroll=false } = this.props;

        if (verticalScroll) {
            // Nếu height mới lớn hơn maxHeight mới re-render
            let checkHeight = window.$(`#${nextProps.outerComponentId}`).height() > maxHeight;

            if (!checkHeight) {
                return false
            }
        }

        return true;
    }

    addStyleCSS = () => {
        const { outerComponentId, innerComponentId, innerComponentWidth, activate } = this.props;

        let outer = window.$(`#${outerComponentId}`);
        let inner = window.$(`#${innerComponentId}`);

        if (outer !== undefined && inner !== undefined) {
            if (activate) {
                outer.addClass("StyleScrollDiv");
                inner.width(innerComponentWidth);
                inner.css("maxWidth", innerComponentWidth); // Safari
            } else {
                outer.removeClass("StyleScrollDiv");
                inner.width("");
                inner.css("maxWidth", ""); // Safari
            }
        }
    }

    static addVerticalScrollStyleCSS = (outerComponentId, maxHeight=200, activate) => {
        let outer = window.$(`#${outerComponentId}`);

        if (outer) {
            if (activate && outer.height() > maxHeight) {
                outer.addClass("StyleScrollDiv StyleScrollDiv-y");
                outer.css("maxHeight", maxHeight); 
            } else {
                outer.removeClass("StyleScrollDiv StyleScrollDiv-y");
                outer.css("maxHeight", "");
            }
        }
    }

    render() {
        return null;
    }
}

export { SlimScroll }
