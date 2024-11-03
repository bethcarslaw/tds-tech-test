import { fetchWrapper } from '@/util';
import { useMemo } from 'react';
import useSWR from 'swr';
import { Currency } from './types';

const useCurrencies = () => {
    const { data: currencies, isLoading } = useSWR<Currency[]>(
        'https://api.currencybeacon.com/v1/currencies',
        fetchWrapper
    );
    const sortedCurrencies = useMemo(
        () => currencies?.sort((a, b) => a.name.localeCompare(b.name)) || [],
        [currencies]
    );

    return { currencies: sortedCurrencies, isLoading };
};

export { useCurrencies };
