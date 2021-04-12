import { withTranslate } from "react-redux-multilingual";

export const customAxisC3js = (chartId, data, index) => {
    if (data?.length > 0) {
        let numberOfCharacters = 50, width, elementWidth;

        width = window.$(`#${chartId}`)?.width();
        width = width && parseInt(width);
        elementWidth = width / data?.length;

        // console.log(width, elementWidth)

        if (elementWidth < 45) {
            numberOfCharacters = 5;
        } else if (elementWidth < 70) {
            numberOfCharacters = 18;
        } else if (elementWidth < 100) {
            numberOfCharacters = 35;
        }

        if (data?.[index]?.length > numberOfCharacters) {
            return data?.[index]?.slice(0, numberOfCharacters) + "...";
        } else {
            return data?.[index]
        }
    } else {
        return "";
    }
}
