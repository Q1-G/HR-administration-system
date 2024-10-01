import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";



export const employeeRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.employee.findMany({
      include: { employeeManager: true, departments: true },
    });
  }),

  getById: publicProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      const employee = await ctx.db.employee.findUnique({
        where: { id: input },
        include: { employeeManager: true, departments: true },
      });
      if (!employee) {
        throw new Error("Employee not found");
      }
      return employee;
    }),

  create: publicProcedure
    .input(
      z.object({
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        telephone: z.string(),
        email: z.string().email(),
        username: z.string().min(1),
        status: z.string(),
        managerId: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.employee.create({
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          telephone: input.telephone,
          email: input.email,
          username: input.username,
          status: input.status,
          managerId: input.managerId,
        },
      });
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        telephone: z.string().optional(),
        email: z.string().optional(),
        status: z.string().optional(),
        managerId: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.employee.update({
        where: { id: input.id },
        data: {
          firstName: input.firstName ?? undefined,
          lastName: input.lastName ?? undefined,
          telephone: input.telephone ?? undefined,
          email: input.email ?? undefined,
          status: input.status ?? undefined,
          managerId: input.managerId ?? undefined,
        },
      });
    }),

  getManagers: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.employee.findMany({
      where: {
        employees: {
          some: {},
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
    });
  }),
});