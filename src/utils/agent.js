import { tavilySearch } from "./tavily";
import { getAIChat } from "./ai";

function isSearchIntent(text) {
	return /\b(search|find|latest|news|what's happening)\b/i.test(text);
}

export async function agentHandler(message) {
	if (isSearchIntent(message)) {
		const searchRes = await tavilySearch(message);
		const snippets = searchRes.results
			.map(
				(r, i) =>
					`${i + 1}. ${r.title}\n${r.content || r.raw_content}\n${r.url}`
			)
			.join("\n\n");

		const summaryPrompt = `Summarize these search results concisely:\n\n${snippets}`;
		const summary = await getAIChat([
			{ role: "user", content: summaryPrompt },
		]);

		return {
			type: "agent",
			content: summary,
			sources: searchRes.results.map((r) => r.url),
		};
	}

	return {
		type: "chat",
		content: await getAIChat([{ role: "user", content: message }]),
	};
}
