import cron from "node-cron";
import { runDailyEvaluation } from "../controllers/evaluation.controller.js";

export const startEvaluationJob = () => {
    cron.schedule("0 6 * * *", async () => {
        console.log("Starting daily evaluation at", new Date());
        try {
            await runDailyEvaluation();
            console.log("Daily evaluation completed successfully");
        } catch (error) {
            console.error("Error in daily evaluation:", error);
        }
    }, {
        timezone: "Asia/Kolkata"
    });
    
    console.log("Evaluation cron job scheduled for 6 AM daily");
};

export const startDailyResetJob = () => {
    cron.schedule("0 8 * * *", async () => {
        console.log("Daily reset triggered at", new Date());
    }, {
        timezone: "Asia/Kolkata"
    });
    
    console.log("Daily reset cron job scheduled for 8 AM daily");
};
