import { useState } from "react";
import { BubbleMenu } from "@tiptap/react/menus";
import Button from "./ui/Button";
import { getAIEdit } from "../utils/ai";
import { marked } from "marked";

export default function FloatingToolbar({ editor }) {
	const [modalOpen, setModalOpen] = useState(false);
	const [original, setOriginal] = useState("");
	const [suggestion, setSuggestion] = useState("");

	if (!editor) return null;

	const handleAI = async (action) => {
		const text = editor.state.doc.textBetween(
			editor.state.selection.from,
			editor.state.selection.to
		);

		if (!text) return;

		setOriginal(text);

		const aiMarkdown = await getAIEdit(text, action);

		const cleanHtml = marked(aiMarkdown, { breaks: true });

		setSuggestion(cleanHtml);
		setModalOpen(true);
	};

	const confirmChange = () => {
		if (!editor) return;

		editor.commands.insertContent(suggestion);
		setModalOpen(false);
	};

	return (
		<>
			<BubbleMenu editor={editor} tippyoptions={{ duration: 100 }}>
				<div className="bg-white shadow rounded flex space-x-2 p-1">
					<Button onClick={() => handleAI("shorten")}>Shorten</Button>
					<Button onClick={() => handleAI("expand")}>Expand</Button>
					<Button onClick={() => handleAI("grammar")}>Fix Grammar</Button>
					<Button onClick={() => handleAI("table")}>To Table</Button>
				</div>
			</BubbleMenu>

			{modalOpen && (
				<div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-5 z-50">
					<div className="bg-white p-4 shadow w-96 h-full max-h-full overflow-y-auto rounded">
						<h3 className="font-bold mb-2">AI Suggestion</h3>

						<p className="text-sm text-gray-500 mb-1">Original</p>
						<div className="border p-2 mb-2 whitespace-pre-wrap">
							{original}
						</div>

						<p className="text-sm text-gray-500 mb-1">
							Suggestion (Preview)
						</p>
						<div
							className="border p-2 mb-4 prose"
							dangerouslySetInnerHTML={{ __html: suggestion }}
						/>

						<div className="flex justify-end space-x-2">
							<Button onClick={() => setModalOpen(false)}>
								❌ Cancel
							</Button>
							<Button onClick={confirmChange}>✅ Confirm</Button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
