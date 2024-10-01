import { createTRPCRouter } from "../trpc";
import { employeeRouter } from "./employee";
import { departmentRouter } from "./department";

export const appRouter = createTRPCRouter({
  employee: employeeRouter,
  department: departmentRouter,
});


export type AppRouter = typeof appRouter;