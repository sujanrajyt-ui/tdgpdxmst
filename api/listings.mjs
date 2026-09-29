import { handleVercelApi } from '../server/vercel-handler.mjs';

// Keep the primary listing endpoint explicit so the seller submit flow cannot
// fall through to the SPA's not-found response.
export default handleVercelApi;
