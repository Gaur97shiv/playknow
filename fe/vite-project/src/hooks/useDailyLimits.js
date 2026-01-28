import { useQuery } from "@tanstack/react-query";

const useDailyLimits = () => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ["dailyLimits"],
        queryFn: async () => {
            const res = await fetch("/api/cycle/limits");
            if (!res.ok) {
                throw new Error("Failed to fetch daily limits");
            }
            return res.json();
        },
        staleTime: 30000
    });

    return { 
        limits: data || null,
        isLoading, 
        error,
        refetch
    };
};

export default useDailyLimits;
