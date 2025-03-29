import cron from "node-cron";

export const scheduleJob = (cronExpression: string, job: any): void => {
  if (
    Object.prototype.toString.call(job) !== "[object Function]" &&
    Object.prototype.toString.call(job) !== "[object Promise]"
  ) {
    throw new Error("Job must be a function or a promise");
  }
  cron.schedule(cronExpression, job, {
    scheduled: true,
    timezone: "Asia/Kolkata",
  });
};
