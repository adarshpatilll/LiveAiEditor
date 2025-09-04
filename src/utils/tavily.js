import { TavilyClient } from "tavily";

const client = new TavilyClient({
	apiKey: import.meta.env.VITE_TAVILY_API_KEY,
});

export async function tavilySearch(query, options = {}) {
	const opts = {
		query,
		topic: options.topic || "general",
		max_results: options.max_results || 5,
		include_answer:
			options.include_answer !== undefined ? options.include_answer : true,
	};
	const res = await client.search(opts);
	return res;
}
