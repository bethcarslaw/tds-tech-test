import useSWR from 'swr';
import { useEffect, useMemo, useRef, useState } from 'react';

import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { fetchWrapper } from '@/util';
import { Input } from '../ui/input';
import { SelectSearch } from '../SelectSearch';
import { Button } from '../ui/button';
import { stripCurrency, formatAsCurrency } from './util';
import { LoopIcon } from '@radix-ui/react-icons';
import { ConversionSkeleton, InputSkeleton } from './LoadingSkeletons';
import axios from 'axios';

type Currency = {
    code: string;
    decimal_mark: string;
    id: number;
    name: string;
    precision: number;
    short_code: string;
    subunit: number;
    symbol: string;
    symbol_first: boolean;
    thousands_separator: string;
};

const CurrencyConvertor = () => {
    const { data: currencies, isLoading } = useSWR<Currency[]>(
        'https://api.currencybeacon.com/v1/currencies',
        fetchWrapper
    );
    const sortedCurrencies = useMemo(
        () => currencies?.sort((a, b) => a.name.localeCompare(b.name)) || [],
        [currencies]
    );
    const [fromCurrency, setFromCurrency] = useState<Currency>();
    const [toCurrency, setToCurrency] = useState<Currency>();
    const [amount, setAmount] = useState('');
    const [convertedAmount, setConvertedAmount] = useState<string>();
    const [isConverting, setIsConverting] = useState(false);
    const trackConvertedRef = useRef(0);

    const handleCurrencySelectChange = (
        currencyCode: string,
        isFrom: boolean
    ) => {
        const newCurrency = currencies?.find(
            (currency) => currency.code === currencyCode
        );

        if (convertedAmount) {
            trackConvertedRef.current += 1;
        }

        if (isFrom) {
            if (amount) {
                setAmount(
                    formatAsCurrency(
                        amount,
                        newCurrency?.thousands_separator,
                        newCurrency?.decimal_mark,
                        fromCurrency?.thousands_separator,
                        fromCurrency?.decimal_mark
                    )
                );
            }

            setFromCurrency(newCurrency);

            return;
        }

        setToCurrency(newCurrency);
    };

    const handleConvertClick = async () => {
        try {
            if (convertedAmount) {
                setConvertedAmount('');
            }
            setIsConverting(true);

            // have to use axios directly here for some reason fetch wrapper is causing
            // SWR to re-fetch every time a request is fired and no time to investigate
            const response = await axios(
                'https://api.currencybeacon.com/v1/convert',
                {
                    params: {
                        api_key: import.meta.env.VITE_CURRENCY_API_KEY,
                        amount: parseFloat(
                            stripCurrency(
                                amount,
                                fromCurrency?.thousands_separator || ',',
                                fromCurrency?.decimal_mark || '.'
                            )
                        ),
                        from: fromCurrency?.short_code,
                        to: toCurrency?.short_code,
                    },
                }
            );

            const formattedResponse = formatAsCurrency(
                response.data.response.value.toFixed(2),
                toCurrency?.thousands_separator,
                toCurrency?.decimal_mark
            );

            const currencyParts = [
                toCurrency?.symbol,
                formattedResponse,
                toCurrency?.short_code,
            ];

            if (!toCurrency?.symbol_first) {
                currencyParts.reverse();
            }
            setConvertedAmount(currencyParts.join(' '));
        } catch (error) {
            console.log(error);
        } finally {
            setIsConverting(false);
        }
    };

    const formatInputAsCurrency = () => {
        if (!amount) return;

        setAmount(
            formatAsCurrency(
                amount,
                fromCurrency?.thousands_separator,
                fromCurrency?.decimal_mark
            )
        );
    };

    const handleSwapCurrencies = () => {
        if (amount) {
            setAmount(
                formatAsCurrency(
                    amount,
                    toCurrency?.thousands_separator,
                    toCurrency?.decimal_mark,
                    fromCurrency?.thousands_separator,
                    fromCurrency?.decimal_mark
                )
            );
        }
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);

        if (convertedAmount) {
            trackConvertedRef.current += 1;
        }
    };

    useEffect(() => {
        if (currencies && !fromCurrency && !toCurrency) {
            setFromCurrency(
                currencies.find((currency) => currency.short_code === 'USD')
            );
            setToCurrency(
                currencies.find((currency) => currency.short_code === 'GBP')
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currencies]);

    useEffect(() => {
        setConvertedAmount('');
    }, [amount]);

    useEffect(() => {
        if (amount && fromCurrency && toCurrency) {
            handleConvertClick();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [trackConvertedRef.current]);

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Currency Convertor</CardTitle>
            </CardHeader>
            <CardContent className="grid">
                {currencies && currencies.length > 0 && !isLoading && (
                    <div className="grid grid-cols-3 gap-x-4">
                        <div className="flex flex-1">
                            {fromCurrency && fromCurrency.symbol_first && (
                                <div className="h-full bg-stone-800 justify-center content-center px-6 rounded-l text-xl font-bold">
                                    {fromCurrency?.symbol}
                                </div>
                            )}
                            <Input
                                type="text"
                                placeholder="0.00"
                                onChange={(e) => setAmount(e.target.value)}
                                onBlur={formatInputAsCurrency}
                                value={amount}
                                className={
                                    fromCurrency && !fromCurrency.symbol_first
                                        ? 'rounded-r-none'
                                        : 'rounded-l-none'
                                }
                            />

                            {fromCurrency && !fromCurrency.symbol_first && (
                                <div className="h-full bg-stone-800 justify-center content-center px-6 rounded-r text-xl font-bold">
                                    {fromCurrency?.symbol}
                                </div>
                            )}
                        </div>

                        <div className="col-span-2 flex">
                            <SelectSearch
                                items={sortedCurrencies.map((currency) => ({
                                    value: currency.code,
                                    label: `${currency.name} (${currency.short_code})`,
                                }))}
                                placeholder="From Currency"
                                value={fromCurrency?.code || ''}
                                onValueChange={(code) =>
                                    handleCurrencySelectChange(code, true)
                                }
                                className="rounded-r-none"
                            />
                            <Button
                                onClick={handleSwapCurrencies}
                                className="h-full rounded-none bg-stone-800 text-white hover:bg-stone-700"
                            >
                                <LoopIcon />
                            </Button>
                            <SelectSearch
                                items={sortedCurrencies.map((currency) => ({
                                    value: currency.code,
                                    label: `${currency.name} (${currency.short_code})`,
                                }))}
                                placeholder="To Currency"
                                value={toCurrency?.code || ''}
                                onValueChange={(code) =>
                                    handleCurrencySelectChange(code, false)
                                }
                                className="rounded-l-none"
                            />
                        </div>
                    </div>
                )}

                {isLoading && <InputSkeleton />}

                <div className="flex justify-between mt-4">
                    <div>
                        {convertedAmount && (
                            <>
                                <p className="font-bold text-[10px] uppercase tracking-[.25em]">
                                    Your Conversion
                                </p>
                                <h2 className="text-4xl font-bold">
                                    {convertedAmount}
                                </h2>
                            </>
                        )}

                        {isConverting && <ConversionSkeleton />}
                    </div>

                    <Button
                        onClick={handleConvertClick}
                        disabled={
                            !fromCurrency ||
                            !toCurrency ||
                            !amount ||
                            isConverting
                        }
                        className="text-lg py-7 disabled:cursor-not-allowed"
                    >
                        Show Me The Money 💰
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export { CurrencyConvertor };
