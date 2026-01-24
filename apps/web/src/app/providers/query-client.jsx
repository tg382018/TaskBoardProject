import { QueryClient, QueryClientProvider as Provider } from "@tanstack/react-query";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});

export function QueryClientProvider({ children }) {
    return <Provider client={queryClient}>{children}</Provider>;
}
