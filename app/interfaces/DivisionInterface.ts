import { Batch } from "./BatchInterface";

export type Division = {
  id: number;
  name: string;
  batchId: number;
  batch: Batch;
  status: boolean;
  created_at: Date;
  updated_at: Date;
};
