import { handleVercelApi } from '../server/vercel-handler.mjs';

// Keep the primary passport collection endpoint explicit so static Vite
// deployments route POST /api/passports to the Vercel Function reliably.
export default handleVercelApi;
