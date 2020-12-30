import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import './showMoreShowLess.css';

class ShowMoreShowLess extends Component {
    constructor(props) {
        super(props);

        var translate = this.props.translate;

        this.state = {
            showMore: translate("common_component.showmore_showless.showmore"),
            showLess: translate("common_component.showmore_showless.showless"),
            titleShowMore: translate("common_component.showmore_showless.title_showmore"),
            titleShowLess: translate("common_component.showmore_showless.title_showless")
        }

    }

    componentDidMount = () => {
        const { isText = true } = this.props;
        if (isText) {
            this.addReadMoreText();
        } else {
            this.addReadMoreComponent();
        }
    }

    addReadMoreText = () => {
        const { id, characterLimit = 200 } = this.props;
        const { showMore, showLess, titleShowMore, titleShowLess } = this.state;

        //Traverse all selectors with this class and manupulate HTML part to show Read More
        window.$(`#showmore-showless${id}`).each(function() {
            if (window.$(this).find(".firstSec").length)
                return;

            let allstr = window.$(this).text();
            if (allstr.length > characterLimit) {
                let firstSet = allstr.substring(0, characterLimit);
                let secdHalf = allstr.substring(characterLimit, allstr.length);
                let strtoadd = firstSet + "<span class='hide-component'>" + secdHalf + `</span><a id='readMore${id}' class='read-more' title=${titleShowMore}>` + " ... " + showMore + `</a><a id='readLess${id}' class='read-less' title=${titleShowLess}>` + " " + showLess + "</a>";
                window.$(this).html(strtoadd);
            }

        });

        this.clickEventShow();
    }

    addReadMoreComponent = () => {
        this.clickEventShow();
    }

    clickEventShow = () => {
        const { id } = this.props;

        //Show More and Show Less Click Event binding
        window.$(document).on("click", `#readMore${id}, #readLess${id}`, () => {
            window.$(`#showmore-showless${id}`).toggleClass("showless-content showmore-content");
        });
    }

    render() {
        const { id, value, isText = true } = this.props;
        const { showMore, showLess, titleShowMore, titleShowLess } = this.state;

        return (
            <React.Fragment>
                {
                    isText
                        ? <p id={`showmore-showless${id}`} className="add-read-more showless-content">{value}</p>
                        : <section id={`showmore-showless${id}`}  className="add-read-more showless-content">
                            {this.props.children}
                            <span><a id={`readMore${id}`} className='read-more' title={titleShowMore}>{showMore}</a><a id={`readLess${id}`} className='read-less' title={titleShowLess}>{showLess}</a></span>
                        </section>
                }
            </React.Fragment>
        )
    }
}

const connectedShowMoreShowLess = connect(null, null)(withTranslate(ShowMoreShowLess));
export { connectedShowMoreShowLess as ShowMoreShowLess }