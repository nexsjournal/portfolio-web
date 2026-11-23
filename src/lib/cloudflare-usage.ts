const GRAPHQL_ENDPOINT = "https://api.cloudflare.com/client/v4/graphql";
const FREE_NEURONS = 10_000;
const WINDOW_MS = 24 * 60 * 60 * 1000;

type UsageGroup = {
  dimensions?: { datetimeFifteenMinutes?: string };
  sum?: { totalNeurons?: number };
};

const USAGE_QUERY = `query WorkersAiQuota($accountTag: String!, $datetimeStart: Time, $datetimeEnd: Time) {
  viewer {
    accounts(filter: {accountTag: $accountTag}) {
      aiInferenceAdaptiveGroups(
        filter: {datetime_geq: $datetimeStart, datetime_leq: $datetimeEnd, neurons_geq: 0}
        orderBy: [datetimeFifteenMinutes_ASC]
        limit: 10000
      ) {
        sum { totalNeurons }
        dimensions { datetimeFifteenMinutes }
      }
    }
  }
}`;

export async function getWorkersAiQuotaResetAt(now = Date.now()) {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID?.trim();
  const token = process.env.CLOUDFLARE_API_TOKEN?.trim();
  if (!accountId || !token) return null;

  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      query: USAGE_QUERY,
      variables: {
        accountTag: accountId,
        datetimeStart: new Date(now - WINDOW_MS).toISOString(),
        datetimeEnd: new Date(now).toISOString(),
      },
    }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) return null;

  const payload = await response.json().catch(() => null) as {
    data?: {
      viewer?: {
        accounts?: Array<{ aiInferenceAdaptiveGroups?: UsageGroup[] }>;
      };
    };
  } | null;

  const groups = payload?.data?.viewer?.accounts?.[0]?.aiInferenceAdaptiveGroups;
  if (!Array.isArray(groups)) return null;

  const buckets = groups
    .map((group) => ({
      at: Date.parse(group.dimensions?.datetimeFifteenMinutes ?? ""),
      neurons: group.sum?.totalNeurons ?? 0,
    }))
    .filter((bucket) => Number.isFinite(bucket.at) && bucket.neurons > 0)
    .sort((a, b) => a.at - b.at);

  const total = buckets.reduce((sum, bucket) => sum + bucket.neurons, 0);
  if (total <= FREE_NEURONS) return null;

  let removed = 0;
  for (const bucket of buckets) {
    removed += bucket.neurons;
    if (total - removed < FREE_NEURONS) return bucket.at + WINDOW_MS;
  }

  return now + WINDOW_MS;
}
