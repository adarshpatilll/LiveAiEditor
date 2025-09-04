import { useRef } from "react";
import Editor from "./components/Editor";
import ChatSidebar from "./components/ChatSidebar";

export default function App() {
	const editorRef = useRef(null);

	return (
		<div className="flex h-screen w-full custom-scroll">
			<div className="flex-1 p-4">
				<Editor docId="demo-doc" editorRef={editorRef} />
			</div>
			<ChatSidebar editorRef={editorRef} />
		</div>
	);
}
