import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const departmentRouter = createTRPCRouter({
  
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.department.findMany({
      include: {
        employees: true, 
        manager: true, 
      },
    });
  }),

  
  getById: publicProcedure
    .input(z.number()) // ID input
    .query(async ({ ctx, input }) => {
      return ctx.db.department.findUnique({
        where: { id: input },
        include: {
          manager: true, 
        },
      });
    }),

  
  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        status: z.string().optional(),
        managerId: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.department.update({
        where: { id: input.id },
        data: {
          name: input.name ?? undefined,
          status: input.status ?? undefined,
          managerId: input.managerId ?? undefined,
        },
      });
    }),

  
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        status: z.string().optional(),
        managerId: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.department.create({
        data: {
          name: input.name,
          status: input.status || 'Active',
          managerId: input.managerId ?? undefined, 
        },
      });
    }),
});