export const capitalize = (letter) => {
    console.log("letter", letter);
    letter = letter.toLowerCase();
    letter = letter.charAt(0).toUpperCase() + letter.slice(1);
    letter = letter.replace(/,\s*$/, "")
    return letter;
}