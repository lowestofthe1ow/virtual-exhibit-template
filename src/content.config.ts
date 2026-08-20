// Umbrella content-collections config. Astro looks for exactly this one file
// at the project root; there is nowhere else to declare a collection. Each
// exhibit that ships its own `astro:content` collections gets its entry here,
// namespaced with its slug (both the export key AND the collection name
// passed to getCollection()) so two exhibits can never collide. If a future
// exhibit needs collections too, ADD to this file — don't replace it.
//
// s01g5 "Silicon Minds": originally declared at src/content/config.ts in the
// source repo (Astro 4's legacy per-directory config path). The import
// orchestrator namespaces everything under src/content/ EXCEPT this kind of
// root-level config file, which it deliberately leaves for hand reconciliation
// (see import-exhibit.mjs's "loose file(s) at the root of src/" warning) —
// nothing repo-wide should be silently overwritten by one exhibit's copy.
// Ported from `type: 'data'` (Astro 4 legacy collections) to the `loader:
// glob()` form Astro 5 content layer expects; each collection's shape is
// otherwise unchanged from the original schema.
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const s01g5Eras = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/s01g5/eras' }),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    period: z.string(),
    order: z.number().min(1).max(5),
    notableFeature: z.string(),
    description: z.string(),
    accentColor: z.string(),
  }),
});

const s01g5Processors = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/s01g5/processors' }),
  // Each file holds an array of processors for one era, matching the source
  // repo's original per-file shape (one entry per era1.json..era5.json).
  schema: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      eraId: z.string(),
      cores: z.number(),
      coreConfig: z.string(),
      clockSpeedGHz: z.number(),
      dieSizeMm2: z.number(),
      transistorCount: z.string(),
      processNodeNm: z.number(),
      notableFeature: z.string(),
      reference: z
        .object({
          source: z.string(),
          url: z.string().url(),
        })
        .optional(),
    }),
  ),
});

const s01g5Quiz = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/s01g5/quiz' }),
  schema: z.object({
    questions: z.array(
      z.object({
        id: z.string(),
        eraId: z.string(),
        question: z.string(),
        options: z.tuple([z.string(), z.string(), z.string(), z.string()]),
        correctIndex: z.number().min(0).max(3),
        explanation: z.string(),
      }),
    ),
  }),
});

export const collections = { s01g5Eras, s01g5Processors, s01g5Quiz };
