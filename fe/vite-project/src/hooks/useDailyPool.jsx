import { useQuery } from "@tanstack/react-query";

const useDailyPool = () => {
	const { data: dailyPool, isLoading, error, refetch } = useQuery({
		queryKey: ["dailyPool"],
		queryFn: async () => {
			try {
				const res = await fetch("/api/pool/daily");
				if (!res.ok) throw new Error("Failed to fetch daily pool");
				const data = await res.json();
				return data;
			} catch (error) {
				console.error("Error fetching daily pool:", error);
				throw error;
			}
		},
		refetchInterval: 30000, // Refetch every 30 seconds
	});

	return { dailyPool, isLoading, error, refetch };
};

export default useDailyPool;
