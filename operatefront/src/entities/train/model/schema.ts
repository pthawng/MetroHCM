import { z } from 'zod';

export const TrainLocationSchema = z.object({
  lng: z.number(),
  lat: z.number(),
});

export const TrainStatusSchema = z.union([
  z.literal('active'),
  z.literal('delayed'),
  z.literal('stopped'),
  z.literal('maintenance'),
]);

export const TrainPayloadSchema = z.object({
  version: z.literal('v1'),
  id: z.string(),
  trainId: z.string(),
  lineId: z.string(),
  status: TrainStatusSchema,
  location: TrainLocationSchema,
  speed: z.number().nonnegative(),
  heading: z.number(),
  timestamp: z.number(), // backend server time in ms
  delaySeconds: z.number().nonnegative().optional(),
  direction: z.string().optional(),
});

export type TrainPayload = z.infer<typeof TrainPayloadSchema>;
export type TrainStatus = z.infer<typeof TrainStatusSchema>;

// Internal Train model for the normalized store
export interface TrainEntity extends TrainPayload {
  lastUpdatedClient: number; // For keeping track of stale data locally
}

export type Train = TrainEntity;
