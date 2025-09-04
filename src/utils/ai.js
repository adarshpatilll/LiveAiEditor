const API_KEY = import.meta.env.VITE_GEMINI_KEY;

async function callGemini(messages) {
	try {
		const res = await fetch(
			`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					contents: messages.map((m) => ({
						role: m.role === "assistant" ? "model" : "user",
						parts: [{ text: m.content }],
					})),
				}),
			}
		);

		if (!res.ok) {
			const err = await res.json();
			throw new Error(err.error?.message || "Gemini API error");
		}

		const data = await res.json();

		return (
			data.candidates?.[0]?.content?.parts?.[0]?.text ||
			data.candidates?.[0]?.content?.parts?.map((p) => p.text).join("\n") ||
			"⚠️ No response"
		);
	} catch (error) {
		return `💀 Error: ${error.message}`;
	}
}

export async function getAIChat(messages) {
	return await callGemini(messages);
}

export async function getAIEdit(text, action) {
	let prompt = "";

	switch (action) {
		case "shorten":
			prompt = `Shorten the following text while keeping meaning intact. Return only the edited text, no explanations:\n\n${text}`;
			break;

		case "expand":
			prompt = `Expand the following text into a clearer, more detailed version. Use bullet points or markdown lists if appropriate, but keep it concise and structured. Do not add assumptions beyond what's given. Return only the expanded text:\n\n${text}`;
			break;

		case "grammar":
			prompt = `Correct grammar and spelling in the following text. Return only the corrected version:\n\n${text}`;
			break;

		case "table":
			prompt = `Convert the following plain text into a clean markdown table. Return only the table, nothing else:\n\n${text}`;
			break;

		default:
			prompt = text;
	}

	// Gemini fetch
	const res = await fetch(
		"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
			import.meta.env.VITE_GEMINI_KEY,
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				contents: [{ parts: [{ text: prompt }] }],
			}),
		}
	);

	const data = await res.json();
	console.log(data);
	return data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
}
