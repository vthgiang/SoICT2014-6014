export const formatCurrency = (money) => {
    money = parseFloat(money)
    money = Math.round(money * 100) / 100;
    money = money.toString();
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(money)) money = money.replace(pattern, "$1,$2");
    return money;
}