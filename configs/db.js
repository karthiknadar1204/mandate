import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from "./schema"

// Configure Neon
neonConfig.fetchConnectionCache = true;
neonConfig.wsProxy = (host) => `${host}:5432/v1`;
neonConfig.useSecureWebSocket = true;
neonConfig.pipelineTLS = true;
neonConfig.pipelineConnect = true;

// Create connection with timeout
const sql = neon(process.env.NEXT_PUBLIC_DRIZZLE_DATABASE_URL, {
  fetchOptions: {
    cache: 'no-store',
    next: { revalidate: 0 },
  },
});

export const db = drizzle(sql, { schema });

// const result = await db.select().from(...);