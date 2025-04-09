import React, { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const OpeningAnimation: React.FC = () => {
	const [show, setShow] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		const timer = setTimeout(() => {
			setShow(false);
		}, 4000); // Reduced to 4s for better UX

		return () => clearTimeout(timer);
	}, []);

	const handleChatClick = () => {
		setShow(false);
		navigate("/chat");
	};

	if (!show) return null;

	return (
		<div className="opening-animation">
			<div className="relative w-[600px] h-96">
				{/* EKG Line */}
				<svg
					className="absolute inset-0"
					viewBox="0 0 100 50"
					preserveAspectRatio="none"
				>
					<path
						d="M -10,25 L 0,25 L 10,25 L 15,5 L 20,45 L 25,25 L 30,25 L 110,25"
						fill="none"
						stroke="#3B82F6"
						strokeWidth="2"
						className="ekg-line"
					/>
				</svg>

				{/* Avatar */}
				<div className="absolute inset-0 flex items-center justify-center opacity-0 avatar">
					<div className="relative">
						<div className="w-40 h-40 bg-blue-500 rounded-full flex items-center justify-center transform-gpu">
							<Heart className="w-20 h-20 text-white" />
						</div>
						<div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-44 h-4 bg-blue-500 opacity-20 rounded-full blur-md" />
					</div>
				</div>

				{/* Text Bubble */}
				<div className="absolute top-1/2 left-1/2 transform translate-x-4 -translate-y-1/2 opacity-0 text-bubble">
					<div className="bg-white p-6 rounded-xl shadow-lg">
						<p className="text-2xl font-medium text-gray-800">
							How can I help with your health concerns today?
						</p>
					</div>
				</div>

				{/* Chat Button */}
				<div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-center opacity-0 fade-in">
					<button
						onClick={handleChatClick}
						className="px-8 py-3 bg-blue-600 text-white text-xl rounded-full font-medium hover:bg-blue-700 transition-all duration-300 hover:scale-105 transform-gpu shadow-lg hover:shadow-xl"
					>
						Start Chatting Now
					</button>
				</div>
			</div>
		</div>
	);
};

export default OpeningAnimation;
