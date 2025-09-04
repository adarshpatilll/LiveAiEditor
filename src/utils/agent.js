import { tavilySearch } from "./tavily";
import { getAIChat } from "./ai";
import { marked } from "marked";

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
		const summaryMarkdown = await getAIChat([
			{ role: "user", content: summaryPrompt },
		]);

		const summaryHTML = marked.parse(summaryMarkdown);

		return {
			type: "agent",
			content: summaryHTML,
			sources: searchRes.results.map((r) => r.url),
		};
	}

	const chatMarkdown = await getAIChat([{ role: "user", content: message }]);
	return {
		type: "chat",
		content: marked.parse(chatMarkdown),
	};
}
