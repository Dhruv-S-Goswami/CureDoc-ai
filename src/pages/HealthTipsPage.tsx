import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
	Heart,
	Droplet,
	Apple,
	Scale,
	Brain,
	Moon,
	Activity,
	Smile,
	Shield,
	Search,
	Bookmark,
	ArrowLeft,
} from "lucide-react";

interface Tip {
	title: string;
	description: string;
	tips: string[];
	icon: React.ReactNode;
}

const healthTips: Tip[] = [
	{
		title: "Hydration Habits",
		description:
			"Essential tips for staying properly hydrated throughout the day",
		icon: <Droplet className="w-6 h-6" />,
		tips: [
			"Follow the 8×8 rule (eight 8-ounce glasses daily)",
			"Drink water before meals to aid digestion",
			"Set hydration reminders",
			"Infuse water with fruits for natural flavor",
			"Increase intake during exercise or hot weather",
		],
	},
	{
		title: "Balanced Nutrition",
		description: "Guidelines for maintaining a healthy and balanced diet",
		icon: <Apple className="w-6 h-6" />,
		tips: [
			"Fill half your plate with vegetables and fruits",
			"Choose whole grains over refined carbs",
			"Include lean protein at every meal",
			"Limit processed foods with added sugars",
			"Practice mindful eating by slowing down",
		],
	},
	{
		title: "Weight Management",
		description: "Sustainable approaches to maintaining a healthy weight",
		icon: <Scale className="w-6 h-6" />,
		tips: [
			"Focus on sustainable habits, not rapid weight loss",
			"Combine strength training with cardio",
			"Create a moderate calorie deficit",
			"Track food intake and exercise",
			"Aim for 7–9 hours of quality sleep",
		],
	},
	{
		title: "Stress Reduction",
		description: "Effective techniques for managing daily stress",
		icon: <Brain className="w-6 h-6" />,
		tips: [
			"Practice deep breathing for 5 minutes when stressed",
			"Try progressive muscle relaxation",
			"Limit screen time and social media",
			"Spend time in nature daily",
			"Set boundaries between work and personal life",
		],
	},
	{
		title: "Sleep Optimization",
		description: "Tips for improving sleep quality and duration",
		icon: <Moon className="w-6 h-6" />,
		tips: [
			"Maintain a consistent sleep schedule",
			"Create a dark, cool sleeping environment",
			"Avoid screens before bedtime",
			"Limit caffeine after 2 PM",
			"Establish a relaxing bedtime routine",
		],
	},
	{
		title: "Exercise Essentials",
		description: "Key principles for maintaining an active lifestyle",
		icon: <Activity className="w-6 h-6" />,
		tips: [
			"Aim for 150 minutes of moderate activity weekly",
			"Incorporate strength training 2–3 times weekly",
			"Take movement breaks during sedentary activities",
			"Find enjoyable activities for consistency",
			"Start with short sessions if new to exercise",
		],
	},
	{
		title: "Mental Wellness",
		description: "Strategies for maintaining good mental health",
		icon: <Smile className="w-6 h-6" />,
		tips: [
			"Practice mindfulness meditation daily",
			"Keep a gratitude journal",
			"Connect socially with others regularly",
			"Seek professional support when needed",
			"Limit news consumption if it increases anxiety",
		],
	},
	{
		title: "Preventive Care",
		description: "Essential practices for preventing health issues",
		icon: <Shield className="w-6 h-6" />,
		tips: [
			"Schedule regular check-ups and screenings",
			"Stay current on vaccinations",
			"Perform monthly self-examinations",
			"Know your family health history",
			"Practice sun safety with sunscreen",
		],
	},
];

const HealthTipsPage: React.FC = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [expandedCard, setExpandedCard] = useState<number | null>(null);
	const [bookmarkedTips, setBookmarkedTips] = useState<number[]>([]);

	const filteredTips = healthTips.filter(
		(tip) =>
			tip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			tip.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
			tip.tips.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()))
	);

	const toggleBookmark = (index: number) => {
		setBookmarkedTips((prev) =>
			prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
		);
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
			<div className="container mx-auto px-4 py-8">
				{/* Header */}
				<div className="flex items-center justify-between mb-8">
					<Link
						to="/"
						className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
					>
						<ArrowLeft className="h-5 w-5 mr-2" />
						Back to Home
					</Link>
					<div className="flex items-center">
						<Heart className="h-8 w-8 text-blue-600" />
						<span className="ml-2 text-2xl font-bold text-gray-800">
							Cure<span className="text-blue-600">Tips</span>
						</span>
					</div>
				</div>

				{/* Search Bar */}
				<div className="relative max-w-md mx-auto mb-8">
					<input
						type="text"
						placeholder="Search health tips..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="w-full px-4 py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					/>
					<Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
				</div>

				{/* Tips Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{filteredTips.map((tip, index) => (
						<div
							key={index}
							className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden ${
								expandedCard === index ? "md:col-span-2 md:row-span-2" : ""
							}`}
						>
							<div className="p-6">
								<div className="flex items-center justify-between mb-4">
									<div className="flex items-center">
										<div className="p-2 bg-blue-100 rounded-lg">{tip.icon}</div>
										<h3 className="ml-3 text-lg font-semibold text-gray-800">
											{tip.title}
										</h3>
									</div>
									<button
										onClick={() => toggleBookmark(index)}
										className={`p-1 rounded-full transition-colors ${
											bookmarkedTips.includes(index)
												? "text-blue-600 bg-blue-50"
												: "text-gray-400 hover:text-blue-600"
										}`}
									>
										<Bookmark className="h-5 w-5" />
									</button>
								</div>

								<p className="text-gray-600 mb-4">{tip.description}</p>

								{expandedCard === index ? (
									<div className="space-y-3">
										{tip.tips.map((tip, tipIndex) => (
											<div
												key={tipIndex}
												className="flex items-start"
											>
												<div className="flex-shrink-0 h-2 w-2 mt-2 rounded-full bg-blue-500" />
												<p className="ml-3 text-gray-700">{tip}</p>
											</div>
										))}
										<button
											onClick={() => setExpandedCard(null)}
											className="mt-4 w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
										>
											Show Less
										</button>
									</div>
								) : (
									<button
										onClick={() => setExpandedCard(index)}
										className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
									>
										Explore Tips
									</button>
								)}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default HealthTipsPage;
