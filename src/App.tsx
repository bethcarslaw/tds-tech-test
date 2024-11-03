import { CurrencyConvertor } from './components/currency-convertor/CurrencyConvertor';
import { Alert, AlertDescription, AlertTitle } from './components/ui/alert';
import { ThemeProvider } from './providers/ThemeProvider';

const App = () => {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <div className="container max-w-5xl mx-auto h-screen flex flex-wrap content-center">
                {!import.meta.env.VITE_CURRENCY_API_KEY && (
                    <Alert variant="warning">
                        <AlertTitle>Heads up!</AlertTitle>
                        <AlertDescription>
                            This app requires a currency API key to work. Please
                            create a free account at{' '}
                            <a
                                href="https://currencybeacon.com"
                                target="_blank"
                                rel="noreferrer"
                                className="font-bold color-primary-500"
                            >
                                Currency Beacon
                            </a>{' '}
                            and set the VITE_CURRENCY_API_KEY environment
                            variable in your .env file.
                        </AlertDescription>
                    </Alert>
                )}

                {import.meta.env.VITE_CURRENCY_API_KEY && <CurrencyConvertor />}
            </div>
        </ThemeProvider>
    );
};

export default App;
