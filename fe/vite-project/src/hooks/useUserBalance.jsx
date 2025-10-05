import { useQuery } from "@tanstack/react-query";

const useUserBalance = () => {
	const { data: userBalance, isLoading, error, refetch } = useQuery({
		queryKey: ["userBalance"],
		queryFn: async () => {
			try {
				const res = await fetch("/api/user/balance");
				if (!res.ok) throw new Error("Failed to fetch user balance");
				const data = await res.json();
				return data;
			} catch (error) {
				console.error("Error fetching user balance:", error);
				throw error;
			}
		},
	});

	return { userBalance, isLoading, error, refetch };
};

export default useUserBalance;
