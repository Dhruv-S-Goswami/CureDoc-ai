import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
	Heart,
	Send,
	// ArrowLeft,
	Clock,
	PlusCircle,
	LogOut,
	Search,
	Settings,
	HelpCircle,
	User,
	ChevronDown,
} from "lucide-react";
import { useAuth } from "./contexts/AuthContext";
import { useTheme } from "./contexts/ThemeContext";
import { supabase } from "./lib/supabase";
import SettingsModal from "./components/SettingsModal";

import axios from "axios";

// Define types for our chat data
interface ChatMessage {
	id: string;
	content: string;
	isUser: boolean;
	timestamp: Date;
}

interface ChatSession {
	id: string;
	title: string;
	date: Date;
	messages: ChatMessage[];
}

const ChatPage: React.FC = () => {
	const { user, signOut } = useAuth();
	const { theme } = useTheme();
	const navigate = useNavigate();
	const [showProfileMenu, setShowProfileMenu] = useState(false);
	const [showSettingsModal, setShowSettingsModal] = useState(false);
	const [username, setUsername] = useState<string>("");

	const [messages, setMessages] = useState<ChatMessage[]>([
		{
			id: "1",
			content: `
	            <div class="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-600">
	            	<p class="text-gray-700 font-medium">
	            		👋 Welcome to <strong>CureDoc.ai</strong> – your intelligent health assistant.
	            	</p>
	            	<p class="mt-2 text-gray-700">
	            		Please describe your symptoms, and I’ll help you explore possible conditions.
	            	</p>
	            </div>`,
			isUser: false,
			timestamp: new Date(),
		},
	]);

	const [input, setInput] = useState("");
	const [searchQuery, setSearchQuery] = useState("");
	const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
	const [loading, setLoading] = useState(true);
	const [currentChatId, setCurrentChatId] = useState<string | null>(null);

	useEffect(() => {
		fetchUserProfile();
		fetchChatHistory();
	}, []);

	// Close profile menu when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as HTMLElement;
			if (!target.closest(".profile-menu-container")) {
				setShowProfileMenu(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const fetchUserProfile = async () => {
		try {
			if (!user) return;

			const { data, error } = await supabase
				.from("user_profiles")
				.select("username")
				.eq("id", user.id)
				.single();

			if (error) throw error;
			if (data) setUsername(data.username);
		} catch (error) {
			console.error("Error fetching user profile:", error);
		}
	};

	const fetchChatHistory = async () => {
		try {
			const { data, error } = await supabase
				.from("conversations")
				.select("*")
				.eq("user_id", user?.id)
				.order("timestamp", { ascending: true });

			if (error) throw error;

			// Group messages by conversation
			const conversations = new Map<string, ChatSession>();

			data.forEach((message) => {
				const metadata = message.metadata || {};
				const conversationId = metadata.conversationId || message.id;

				if (!conversations.has(conversationId)) {
					// Find the first user message to use as the title
					const title = message.metadata?.isUser
						? message.message
						: "New Conversation";
					conversations.set(conversationId, {
						id: conversationId,
						title: title.slice(0, 50) + (title.length > 50 ? "..." : ""),
						date: new Date(message.timestamp),
						messages: [],
					});
				}

				const conversation = conversations.get(conversationId)!;
				conversation.messages.push({
					id: message.id,
					content: message.message,
					isUser: metadata.isUser || false,
					timestamp: new Date(message.timestamp),
				});
			});

			// Sort conversations by most recent message
			const sortedConversations = Array.from(conversations.values()).sort(
				(a, b) => b.date.getTime() - a.date.getTime()
			);

			setChatHistory(sortedConversations);
		} catch (error) {
			console.error("Error fetching chat history:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleSignOut = async () => {
		try {
			await signOut();
			navigate("/login");
		} catch (error) {
			console.error("Error signing out:", error);
		}
	};

	const handleSendMessage = async () => {
		if (input.trim() === "") return;

		const conversationId = currentChatId || Date.now().toString();
		const userMessage: ChatMessage = {
			id: Date.now().toString(),
			content: input,
			isUser: true,
			timestamp: new Date(),
		};

		setMessages((prev) => [...prev, userMessage]);
		setInput("");

		try {
			// If this is the first message in a new conversation, it will be the title
			const isFirstMessage = !currentChatId;

			const { error } = await supabase.from("conversations").insert({
				user_id: user?.id,
				message: input,
				metadata: {
					isUser: true,
					conversationId,
					isFirstMessage,
				},
			});

			if (error) throw error;

			const aiResponse = await getAIResponse(input);

			await supabase.from("conversations").insert({
				user_id: user?.id,
				message: aiResponse,
				metadata: {
					isUser: false,
					conversationId,
				},
			});

			setMessages((prev) => [
				...prev,
				{
					id: (Date.now() + 1).toString(),
					content: aiResponse,
					isUser: false,
					timestamp: new Date(),
				},
			]);

			setCurrentChatId(conversationId);
			fetchChatHistory();
		} catch (error) {
			console.error("Error saving conversation:", error);
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}
	};

	const getAIResponse = async (userInput: string): Promise<string> => {
		try {
			if (!userInput.trim() || userInput.trim().length < 10) {
				return `<div class="bg-red-50 rounded-lg p-4 mb-4 border-l-4 border-red-600">
					<p class="text-gray-700">⚠️ Please enter a valid input describing your symptoms.</p>
				</div>`;
			}

			const symptomsArray = userInput.split(",").map((s) => s.trim());

			const response = await axios.post("http://127.0.0.1:5000/predict", {
				symptoms: symptomsArray,
			});

			const disease = response.data?.disease;

			if (!disease || ["AIDS", "Unknown", "Other"].includes(disease)) {
				return `<div class="bg-yellow-50 rounded-lg p-4 mb-4 border-l-4 border-yellow-600">
					<p class="text-gray-700">😕 Sorry, we couldn't confidently identify your disease.</p>
					<p class="text-gray-700">Please provide more specific symptoms or consult a doctor.</p>
				</div>`;
			}

			let doctorsHTML = "";

			try {
				const doctorRes = await axios.post(
					"http://127.0.0.1:5000/recommend-doctors",
					{
						disease: disease,
					}
				);

				const doctors = doctorRes.data?.doctors;

				if (doctors?.length > 0) {
					doctorsHTML += `<div class="mt-4">
			<p class="text-gray-800 font-semibold text-base mb-3">🔍 Based on your condition, you may consult:</p>
			<div class="grid grid-cols-1 gap-3">`;

					doctors
						.slice(0, 5)
						.forEach(
							(doc: { name: string; specialty: string; location: string }) => {
								doctorsHTML += `
				<div class="bg-white p-4 rounded-xl shadow border border-gray-200">
					<p class="text-lg font-bold text-blue-800 mb-1">👨‍⚕️ ${doc.name}</p>
					<p class="text-sm text-gray-700">💼 <span class="font-medium">${doc.specialty}</span></p>
					<p class="text-sm text-gray-600">📍 ${doc.location}</p>
				</div>`;
							}
						);

					doctorsHTML += `</div></div>`;
				} else {
					doctorsHTML = `<p class="text-gray-700 mt-4">⚠️ No specialists found in your area for this condition.</p>`;
				}
			} catch (err) {
				console.error("Error fetching doctor recommendations:", err);
				doctorsHTML = `<p class="text-gray-700 mt-4">⚠️ Couldn't fetch nearby doctors. Please try again later.</p>`;
			}

			// Final HTML response
			return `<div class="bg-blue-50 rounded-lg p-4 mb-4 border-l-4 border-blue-600">
				<p class="text-gray-700 font-semibold">Based on your symptoms, you may have:</p>
				<p class="mt-2 text-lg font-bold text-blue-700">${disease}</p>
				<p class="mt-2 text-gray-700">📌 This is an AI-generated suggestion. Please consult a medical professional for a proper diagnosis.</p>
				${doctorsHTML}
				<p class="mt-2 text-gray-700">💙 Stay safe and take care!</p>
			</div>`;
		} catch (error) {
			console.error("Error fetching prediction:", error);
			return `<div class="bg-red-50 rounded-lg p-4 mb-4 border-l-4 border-red-600">
				<p class="text-gray-700">🚨 Sorry, I couldn't determine your condition. Please try again later.</p>
			</div>`;
		}
	};

	const startNewChat = async () => {
		setCurrentChatId(null);
		setMessages([
			{
				id: Date.now().toString(),
				content: `
	            <div class="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-600">
	            	<p class="text-gray-700 font-medium">
	            		👋 Welcome to <strong>CureDoc.ai</strong> – your intelligent health assistant.
	            	</p>
	            	<p class="mt-2 text-gray-700">
	            		Please describe your symptoms, and I’ll help you explore possible conditions.
	            	</p>
	            </div>
          `,
				isUser: false,
				timestamp: new Date(),
			},
		]);
	};

	const loadConversation = (chatSession: ChatSession) => {
		setCurrentChatId(chatSession.id);
		setMessages(chatSession.messages);
	};

	const formatDate = (date: Date): string => {
		const today = new Date();
		const yesterday = new Date(today);
		yesterday.setDate(yesterday.getDate() - 1);

		if (date.toDateString() === today.toDateString()) {
			return "Today";
		} else if (date.toDateString() === yesterday.toDateString()) {
			return "Yesterday";
		} else {
			return date.toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
			});
		}
	};

	const filteredChatHistory = chatHistory.filter((chat) =>
		chat.title.toLowerCase().includes(searchQuery.toLowerCase())
	);

	// Apply theme classes to the root element
	useEffect(() => {
		const root = document.documentElement;
		root.classList.remove("light", "dark");
		if (theme !== "default") {
			root.classList.add(theme);
		}
	}, [theme]);

	return (
		<div className={`flex h-screen bg-gray-50 dark:bg-gray-900`}>
			{/* Chat History Sidebar */}
			<div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
				{/* Header */}
				<div className="p-4 border-b border-gray-200 dark:border-gray-700">
					<div className="flex items-center justify-between">
						<Link
							to="/"
							className="flex items-center"
						>
							<Heart className="h-6 w-6 text-blue-600" />
							<span className="ml-2 text-xl font-bold text-gray-800 dark:text-white">
								CureDoc<span className="text-blue-600">.ai</span>
							</span>
						</Link>
						<button
							onClick={startNewChat}
							className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-full transition-colors"
							title="New Chat"
						>
							<PlusCircle className="h-5 w-5" />
						</button>
					</div>

					{/* Search Bar */}
					<div className="mt-4 relative">
						<input
							type="text"
							placeholder="Search conversations..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
						/>
						<Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
					</div>
				</div>

				{/* Chat History */}
				<div className="flex-1 overflow-y-auto">
					<div className="p-4">
						<h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
							Chat History
						</h2>
						{loading ? (
							<div className="flex justify-center py-4">
								<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
							</div>
						) : (
							<div className="space-y-2">
								{filteredChatHistory.map((chat) => (
									<div
										key={chat.id}
										className={`p-3 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-lg cursor-pointer transition-colors ${
											currentChatId === chat.id
												? "bg-blue-50 dark:bg-blue-900/50"
												: ""
										}`}
										onClick={() => loadConversation(chat)}
									>
										<div className="flex justify-between items-start">
											<h3 className="font-medium text-gray-800 dark:text-gray-200">
												{chat.title}
											</h3>
											<span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
												<Clock className="h-3 w-3 mr-1" />
												{formatDate(chat.date)}
											</span>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</div>

				{/* User Profile Section */}
				<div className="border-t border-gray-200 dark:border-gray-700">
					<div className="p-4 relative profile-menu-container">
						<div
							className="flex items-center space-x-3 cursor-pointer"
							onClick={() => setShowProfileMenu(!showProfileMenu)}
						>
							<div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
								<User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
							</div>
							<div className="flex-1">
								<h3 className="font-medium text-gray-900 dark:text-white">
									{username}
								</h3>
								<p className="text-sm text-gray-500 dark:text-gray-400">
									Personal Plan
								</p>
							</div>
							<ChevronDown
								className={`h-5 w-5 text-gray-400 transition-transform ${
									showProfileMenu ? "transform rotate-180" : ""
								}`}
							/>
						</div>

						{/* Profile Dropdown Menu */}
						{showProfileMenu && (
							<div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
								<button
									className="w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2 text-gray-700 dark:text-gray-200"
									onClick={() => {
										setShowProfileMenu(false);
										setShowSettingsModal(true);
									}}
								>
									<Settings className="h-5 w-5" />
									<span>Settings</span>
								</button>
								<button
									className="w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2 text-gray-700 dark:text-gray-200"
									onClick={() => {
										setShowProfileMenu(false);
										// Add help center navigation logic here
									}}
								>
									<HelpCircle className="h-5 w-5" />
									<span>Help Center</span>
								</button>
								<button
									className="w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2 text-red-600 dark:text-red-400"
									onClick={() => {
										setShowProfileMenu(false);
										handleSignOut();
									}}
								>
									<LogOut className="h-5 w-5" />
									<span>Sign Out</span>
								</button>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Main Chat Area */}
			<div className="flex-1 flex flex-col">
				{/* Chat Header */}
				<div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-xl font-semibold text-gray-800 dark:text-white">
								Health Consultation
							</h1>
							<p className="text-sm text-gray-500 dark:text-gray-400">
								Ask about any health concerns
							</p>
						</div>
						<button
							onClick={startNewChat}
							className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center"
						>
							<PlusCircle className="h-4 w-4 mr-2" />
							New Consultation
						</button>
					</div>
				</div>

				{/* Messages */}
				<div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
					<div className="max-w-3xl mx-auto space-y-4">
						{messages.map((message) => (
							<div
								key={message.id}
								className={`flex ${
									message.isUser ? "justify-end" : "justify-start"
								}`}
							>
								<div
									className={`max-w-md p-4 rounded-lg ${
										message.isUser
											? "bg-blue-600 text-white"
											: "bg-white border border-gray-200 text-gray-800"
									}`}
								>
									{message.isUser ? (
										<p>{message.content}</p>
									) : (
										<div
											dangerouslySetInnerHTML={{ __html: message.content }}
										/>
									)}
									<div
										className={`text-xs mt-2 ${
											message.isUser ? "text-blue-100" : "text-gray-500"
										}`}
									>
										{message.timestamp.toLocaleTimeString([], {
											hour: "2-digit",
											minute: "2-digit",
										})}
									</div>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Input Area */}
				<div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
					<div className="max-w-3xl mx-auto flex">
						<input
							type="text"
							value={input}
							onChange={(e) => setInput(e.target.value)}
							onKeyPress={handleKeyPress}
							placeholder="Describe your symptoms or ask a health question..."
							className="flex-1 border border-gray-300 dark:border-gray-600 rounded-l-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
						/>
						<button
							onClick={handleSendMessage}
							className="bg-blue-600 text-white px-4 py-3 rounded-r-lg hover:bg-blue-700 transition-colors"
						>
							<Send className="h-5 w-5" />
						</button>
					</div>
					<p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center max-w-3xl mx-auto">
						CureDoc.ai provides general health information but is not a
						substitute for professional medical advice. Always consult with a
						healthcare provider for medical concerns.
					</p>
				</div>
			</div>

			{/* Settings Modal */}
			<SettingsModal
				isOpen={showSettingsModal}
				onClose={() => setShowSettingsModal(false)}
			/>
		</div>
	);
};

export default ChatPage;
