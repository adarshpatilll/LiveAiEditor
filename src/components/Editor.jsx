import { useEffect, useRef } from "react";
import { EditorContent, useEditor } from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";

import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";

import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import FloatingToolbar from "./FloatingToolbar";

export default function Editor({ docId, editorRef }) {
	const lastContentRef = useRef("");

	const editor = useEditor({
		extensions: [
			StarterKit,
			Table.configure({ resizable: true }),
			TableRow,
			TableCell,
			TableHeader,
		],
		content: "<p>Loading...</p>",
	});

	useEffect(() => {
		if (!editor) return;

		const ref = doc(db, "documents", docId);

		const unsub = onSnapshot(ref, (snap) => {
			const data = snap.data();
			if (data?.content && data.content !== editor.getHTML()) {
				lastContentRef.current = data.content; // update tracker
				editor.commands.setContent(data.content);
			}
		});

		const handleUpdate = async () => {
			const html = editor.getHTML();

			if (html === lastContentRef.current) return;

			lastContentRef.current = html;
			await setDoc(ref, { content: html }, { merge: true });
		};

		editor.on("update", handleUpdate);

		editorRef.current = editor;

		return () => {
			unsub();
			editor.off("update", handleUpdate);
		};
	}, [editor, docId]);

	return (
		<div className="border rounded p-4 bg-white shadow relative h-full overflow-y-auto">
			<EditorContent editor={editor} className="h-full prose" />
			<FloatingToolbar editor={editor} />
		</div>
	);
}
