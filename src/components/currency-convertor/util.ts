const stripCurrency = (
    amount: string,
    thousandsSeparator: string,
    decimalMark: string
) => {
    // strip everything but numbers, decimal point, and thousands separator
    const amountClean = amount.replace(/[^A-Z.,\d]/g, '');

    // strip thousands separator
    const amountWithoutThousands = amountClean.replace(thousandsSeparator, '');

    // strip all but the last decimal mark
    const stripped = amountWithoutThousands.replace(
        new RegExp(`[${decimalMark}](?=${decimalMark}*[${decimalMark}])`, 'g'),
        ''
    );

    // replace the remaining decimal mark with a period
    return stripped.replace(decimalMark, '.');
};

const formatAsCurrency = (
    amount: string,
    thousandsSeparator: string = ',',
    decimalMark: string = '.',
    incomingCurrencySeparator?: string,
    incomingCurrencyMark?: string
) => {
    const strippedAmount = stripCurrency(
        amount,
        incomingCurrencySeparator || thousandsSeparator,
        incomingCurrencyMark || decimalMark
    );
    const parsedAmount = parseFloat(strippedAmount);

    const localeNumber = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(parsedAmount);

    const [integer, decimal] = localeNumber.split('.');
    return `${integer.replace(
        /[,]/g,
        thousandsSeparator
    )}${decimalMark}${decimal}`;
};

export { stripCurrency, formatAsCurrency };
