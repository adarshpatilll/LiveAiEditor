import { useState } from "react";
import Button from "./ui/Button";
import { getAIChat } from "../utils/ai";
import { agentHandler } from "../utils/agent";

export default function ChatSidebar({ editorRef }) {
	const [messages, setMessages] = useState([
		{ role: "assistant", content: "Hi! 👋 How can I help you?" },
	]);
	const [input, setInput] = useState("");
	const [loading, setLoading] = useState(false);
	const [useContext, setUseContext] = useState(false);
	const [useAgent, setUseAgent] = useState(false);

	const sendMessage = async () => {
		if (!input.trim()) return;

		const userMessage = { role: "user", content: input };
		setMessages((prev) => [...prev, userMessage]);
		setInput("");
		setLoading(true);

		let aiReply;

		if (useAgent) {
			const agentReply = await agentHandler(userMessage.content);
			aiReply = {
				role: "assistant",
				content: agentReply.content,
				sources: agentReply.sources || [],
			};
		} else if (useContext && editorRef.current) {
			const editorContent = editorRef.current.getText();
			const systemMessage = {
				role: "system",
				content: `Here is the current document:\n\n${editorContent}\n\nAnswer user queries using this content if relevant.`,
			};
			const reply = await getAIChat([
				systemMessage,
				...messages,
				userMessage,
			]);
			aiReply = { role: "assistant", content: reply };
		} else {
			const reply = await getAIChat([...messages, userMessage]);
			aiReply = { role: "assistant", content: reply };
		}

		setMessages((prev) => [...prev, aiReply]);
		setLoading(false);
	};

	const insertToEditor = (text) => {
		if (editorRef.current) {
			editorRef.current.commands.insertContent(text);
		}
	};

	return (
		<div className="w-80 border-l bg-white p-4 flex flex-col">
			<h2 className="font-bold mb-2">AI Assistant</h2>

			<div className="flex-1 overflow-y-auto space-y-2 mb-2 custom-scroll">
				{messages.map((m, i) => (
					<div
						key={i}
						className={`p-2 rounded text-sm ${
							m.role === "user"
								? "bg-blue-100 self-end text-right"
								: "bg-gray-100"
						}`}
					>
						{m.content}

						{m.sources && m.sources.length > 0 && (
							<div className="text-xs text-gray-500 mt-1">
								Sources:{" "}
								{m.sources.map((s, idx) => (
									<a
										key={idx}
										href={s}
										target="_blank"
										rel="noreferrer"
										className="underline mr-1"
									>
										[{idx + 1}]
									</a>
								))}
							</div>
						)}

						{m.role === "assistant" && (
							<div className="mt-2">
								<Button
									onClick={() => insertToEditor(m.content)}
									className="bg-green-600 hover:bg-green-700"
								>
									+ Insert to Editor
								</Button>
							</div>
						)}
					</div>
				))}
				{loading && (
					<div className="text-gray-400 text-sm">AI is typing...</div>
				)}
			</div>

			{/* Input */}
			<div className="flex space-x-2 items-center">
				<input
					className="flex-1 border rounded px-2 py-1 text-sm"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder="Type a message..."
				/>
				<Button onClick={sendMessage}>Send</Button>
			</div>

			{/* Toggles */}
			<div className="mt-2 flex flex-col space-y-2">
				<label className="flex items-center space-x-2 text-sm text-gray-700">
					<input
						type="checkbox"
						checked={useContext}
						onChange={() => setUseContext((prev) => !prev)}
						className="w-4 h-4"
					/>
					<span>Use document context</span>
				</label>

				<label className="flex items-center space-x-2 text-sm text-gray-700">
					<input
						type="checkbox"
						checked={useAgent}
						onChange={() => setUseAgent((prev) => !prev)}
						className="w-4 h-4"
					/>
					<span>Enable Web Agent</span>
				</label>
			</div>
		</div>
	);
}
