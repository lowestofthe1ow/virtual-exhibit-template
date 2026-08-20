import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

export const s04g1Operations = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/s04g1/S04_Group1_operations' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      mnemonic: z.string(),
      opcode: z.string().regex(/^[01]{4}$/, 'opcode must be a 4-bit binary string'),
      symbol: z.string(),
      category: z.enum(['arithmetic', 'logic', 'shift']),
      summary: z.string(),
      flagsAffected: z.array(z.enum(['Z', 'C', 'N', 'V'])),
      scope: z.enum(['core', 'advanced']).default('core'),
      diagram: image().optional(),
      order: z.number().default(0),
    }),
});
