import { tavilySearch } from "./tavily";
import { getAIChat } from "./ai";
import { marked } from "marked";

function isSearchIntent(text) {
	return /\b(search|find|latest|news|what's happening)\b/i.test(text);
}

function stripHTML(html) {
	const tmp = document.createElement("div");
	tmp.innerHTML = html;
	return tmp.textContent || tmp.innerText || "";
}

export async function agentHandler(message, previousMessages = []) {
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
			...previousMessages,
			{ role: "user", content: summaryPrompt },
		]);

		const summaryHTML = marked.parse(summaryMarkdown);
		const summaryText = stripHTML(summaryHTML);

		return {
			type: "agent",
			content: summaryText,
			sources: searchRes.results.map((r) => r.url),
		};
	}

	const chatMarkdown = await getAIChat([
		...previousMessages,
		{ role: "user", content: message },
	]);
	const chatText = stripHTML(marked.parse(chatMarkdown));

	return {
		type: "chat",
		content: chatText,
	};
}
