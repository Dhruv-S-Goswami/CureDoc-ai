import React from 'react';
import { MessageSquareText, Shield, Brain, Clock, ArrowRight, CheckCircle, Heart, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Heart className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-2xl font-bold text-gray-800">CureDoc<span className="text-blue-600">.ai</span></span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors">How It Works</a>
            <a href="#testimonials" className="text-gray-600 hover:text-blue-600 transition-colors">Testimonials</a>
            <a href="#faq" className="text-gray-600 hover:text-blue-600 transition-colors">FAQ</a>
          </div>
          <div>
            <Link to="/chat" className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight">
              Your Personal <span className="text-blue-600">AI Health Assistant</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 leading-relaxed">
              Describe your symptoms and health concerns to our advanced AI and receive instant guidance, information, and support. CureDoc.ai is here to help you understand your health better.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row">
              <Link to="/chat" className="bg-blue-600 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors flex items-center justify-center">
                Start Chatting Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <button className="mt-4 sm:mt-0 sm:ml-4 bg-white text-blue-600 border border-blue-600 px-8 py-3 rounded-full font-medium hover:bg-blue-50 transition-colors">
                Learn More
              </button>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-blue-600 px-6 py-4 flex items-center">
                  <Heart className="h-6 w-6 text-white" />
                  <span className="ml-2 text-xl font-semibold text-white">curedoc.ai</span>
                </div>
                <div className="p-6">
                  <div className="bg-gray-100 rounded-lg p-4 mb-4">
                    <p className="text-gray-700">I've been experiencing headaches and fatigue for the past week. What could be causing this?</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 mb-4 border-l-4 border-blue-600">
                    <p className="text-gray-700">There are several potential causes for your symptoms. Headaches and fatigue can be related to:</p>
                    <ul className="mt-2 space-y-1 list-disc list-inside text-gray-700">
                      <li>Dehydration</li>
                      <li>Stress or anxiety</li>
                      <li>Poor sleep quality</li>
                      <li>Viral infections</li>
                    </ul>
                    <p className="mt-2 text-gray-700">I recommend ensuring you're drinking enough water, getting adequate rest, and managing stress. If symptoms persist for more than two weeks, please consult a healthcare professional.</p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="text"
                      placeholder="Describe your symptoms..."
                      className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                    <button className="ml-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                      <MessageSquareText className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="absolute -z-10 -bottom-6 -right-6 h-64 w-64 bg-blue-100 rounded-full opacity-70"></div>
              <div className="absolute -z-10 -top-6 -left-6 h-40 w-40 bg-blue-200 rounded-full opacity-70"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Why Choose CureDoc.ai?</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Our AI-powered health assistant provides personalized guidance and information to help you understand your health concerns.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <div className="bg-blue-50 rounded-xl p-8 transition-transform hover:scale-105">
              <div className="bg-blue-600 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                <Brain className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Advanced AI Technology</h3>
              <p className="text-gray-600">
                Powered by state-of-the-art medical AI models trained on extensive medical literature and clinical data.
              </p>
            </div>
            
            <div className="bg-blue-50 rounded-xl p-8 transition-transform hover:scale-105">
              <div className="bg-blue-600 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                <Clock className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">24/7 Availability</h3>
              <p className="text-gray-600">
                Get health information and guidance whenever you need it, day or night, without waiting for appointments.
              </p>
            </div>
            
            <div className="bg-blue-50 rounded-xl p-8 transition-transform hover:scale-105">
              <div className="bg-blue-600 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Privacy Focused</h3>
              <p className="text-gray-600">
                Your health data is encrypted and protected. We prioritize your privacy and security above all else.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">How CureDoc.ai Works</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Getting health guidance has never been easier. Start a conversation with our AI in just a few simple steps.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Describe Your Symptoms</h3>
              <p className="text-gray-600">
                Simply type in your health concerns, symptoms, or questions in natural language.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">AI Analysis</h3>
              <p className="text-gray-600">
                Our advanced AI processes your information and analyzes it against medical knowledge.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Receive Guidance</h3>
              <p className="text-gray-600">
                Get personalized information, potential causes, and recommendations for your health concerns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="bg-blue-50 py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">What Our Users Say</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Thousands of people use CureDoc.ai to better understand their health concerns.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" 
                  alt="User" 
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-800">Sarah Johnson</h4>
                  <div className="flex text-yellow-400">
                    <Sparkles className="h-4 w-4" />
                    <Sparkles className="h-4 w-4" />
                    <Sparkles className="h-4 w-4" />
                    <Sparkles className="h-4 w-4" />
                    <Sparkles className="h-4 w-4" />
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "CureDoc.ai helped me understand my symptoms when I couldn't get a doctor's appointment. The guidance was clear and reassuring."
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" 
                  alt="User" 
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-800">Michael Chen</h4>
                  <div className="flex text-yellow-400">
                    <Sparkles className="h-4 w-4" />
                    <Sparkles className="h-4 w-4" />
                    <Sparkles className="h-4 w-4" />
                    <Sparkles className="h-4 w-4" />
                    <Sparkles className="h-4 w-4" />
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "I use CureDoc.ai whenever I have health questions. It's like having a knowledgeable health professional available 24/7."
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" 
                  alt="User" 
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-800">Emma Rodriguez</h4>
                  <div className="flex text-yellow-400">
                    <Sparkles className="h-4 w-4" />
                    <Sparkles className="h-4 w-4" />
                    <Sparkles className="h-4 w-4" />
                    <Sparkles className="h-4 w-4" />
                    <Sparkles className="h-4 w-4" />
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "The AI provided me with information about my chronic condition that I hadn't heard before. It's been incredibly helpful for managing my symptoms."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Frequently Asked Questions</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about CureDoc.ai and how it can help you.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Is CureDoc.ai a replacement for medical professionals?</h3>
              <p className="text-gray-600">
                No, CureDoc.ai is designed to provide information and guidance, but it's not a substitute for professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare providers for medical concerns.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">How accurate is the information provided?</h3>
              <p className="text-gray-600">
                CureDoc.ai is trained on extensive medical literature and data. While we strive for high accuracy, the information should be used as a starting point for understanding health concerns, not as definitive medical advice.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Is my health data kept private?</h3>
              <p className="text-gray-600">
                Yes, we take privacy very seriously. All conversations are encrypted, and we adhere to strict data protection standards. Your health information is never sold or shared with third parties.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Can I use CureDoc.ai for emergency situations?</h3>
              <p className="text-gray-600">
                No, CureDoc.ai is not designed for emergencies. If you're experiencing a medical emergency, please call emergency services (911 in the US) or go to your nearest emergency room immediately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to understand your health better?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are taking control of their health with CureDoc.ai.
          </p>
          <Link to="/chat" className="bg-white text-blue-600 px-8 py-3 rounded-full font-medium hover:bg-blue-50 transition-colors text-lg">
            Get Started for Free
          </Link>
          <div className="mt-8 flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-blue-200" />
              <span className="ml-2 text-blue-100">No credit card required</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-blue-200" />
              <span className="ml-2 text-blue-100">Cancel anytime</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-blue-200" />
              <span className="ml-2 text-blue-100">24/7 availability</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center">
                <Heart className="h-8 w-8 text-blue-400" />
                <span className="ml-2 text-2xl font-bold">curedoc<span className="text-blue-400">.ai</span></span>
              </div>
              <p className="mt-4 text-gray-400 max-w-md">
                Your AI health assistant, providing guidance and information to help you understand your health concerns better.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Company</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Health Library</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Support</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Disclaimer</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© 2025 CureDoc.ai. All rights reserved.</p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;