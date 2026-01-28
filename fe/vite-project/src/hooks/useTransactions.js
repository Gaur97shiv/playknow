import { useQuery } from "@tanstack/react-query";

const useTransactions = (options = {}) => {
    const { limit = 50, offset = 0, type = null } = options;

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ["transactions", limit, offset, type],
        queryFn: async () => {
            const params = new URLSearchParams();
            params.append("limit", limit);
            params.append("offset", offset);
            if (type) params.append("type", type);
            
            const res = await fetch(`/api/transactions/history?${params}`);
            if (!res.ok) {
                throw new Error("Failed to fetch transactions");
            }
            return res.json();
        }
    });

    return { 
        transactions: data?.transactions || [],
        total: data?.total || 0,
        hasMore: data?.hasMore || false,
        isLoading, 
        error,
        refetch
    };
};

export const useTransactionSummary = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["transactionSummary"],
        queryFn: async () => {
            const res = await fetch("/api/transactions/summary");
            if (!res.ok) {
                throw new Error("Failed to fetch transaction summary");
            }
            return res.json();
        }
    });

    return { 
        summary: data || null,
        isLoading, 
        error
    };
};

export default useTransactions;
