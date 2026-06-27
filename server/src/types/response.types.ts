import type { Response } from "express";

export type SendSuccessParams<T> = {
  data: T | null;
  status?: number;
};
