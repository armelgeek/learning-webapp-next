import { z } from 'zod';
import {
  createUserSchema,
  updateUserSchema,
  deleteUserSchema,
  banUserSchema,
  tableStateSchema,
} from '@/features/auth/config/user.schema';

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type DeleteUserInput = z.infer<typeof deleteUserSchema>;
export type BanUserInput = z.infer<typeof banUserSchema>;
export type TableState = z.infer<typeof tableStateSchema>;