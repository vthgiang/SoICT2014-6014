export const customAxisC3js = (chartId, data, index) => {
    if (data?.length > 0) {
        let numberOfCharacters = 50, width, elementWidth;

        width = window.$(`#${chartId}`)?.width();
        width = width && parseInt(width);
        elementWidth = width / data?.length;

        if (elementWidth < 40) {
            numberOfCharacters = 5;
        } else if (elementWidth < 55) {
            numberOfCharacters = 15;
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