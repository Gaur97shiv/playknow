import { useQuery } from "@tanstack/react-query";

const useWinners = (limit = 10) => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ["recentWinners", limit],
        queryFn: async () => {
            const res = await fetch(`/api/evaluation/winners?limit=${limit}`);
            if (!res.ok) {
                throw new Error("Failed to fetch recent winners");
            }
            return res.json();
        },
        staleTime: 60000
    });

    return { 
        winners: data || [],
        isLoading, 
        error,
        refetch
    };
};

export const useLatestEvaluation = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["latestEvaluation"],
        queryFn: async () => {
            const res = await fetch("/api/evaluation/latest");
            if (!res.ok) {
                if (res.status === 404) {
                    return null;
                }
                throw new Error("Failed to fetch latest evaluation");
            }
            return res.json();
        },
        staleTime: 60000
    });

    return { 
        evaluation: data,
        isLoading, 
        error
    };
};

export default useWinners;
