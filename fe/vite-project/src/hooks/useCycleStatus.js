import { useQuery } from "@tanstack/react-query";

const useCycleStatus = () => {
    const { data: cycleStatus, isLoading, error, refetch } = useQuery({
        queryKey: ["cycleStatus"],
        queryFn: async () => {
            const res = await fetch("/api/cycle/status");
            if (!res.ok) {
                throw new Error("Failed to fetch cycle status");
            }
            return res.json();
        },
        refetchInterval: 60000,
        staleTime: 30000
    });

    return { 
        cycleStatus, 
        isLoading, 
        error,
        refetch,
        isFreezePeriod: cycleStatus?.cycle?.isFreezePeriod || false,
        timeUntilNextPhase: cycleStatus?.cycle?.timeUntilNextPhaseFormatted || null,
        currentPool: cycleStatus?.pool?.total_pool_coins || 0,
        config: cycleStatus?.config || null
    };
};

export default useCycleStatus;
