import { useState } from "react";

const FAQ = () => {
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqs = [
    {
      question: "What types of dairy products do you offer?",
      answer: "We offer fresh milk, paneer, curd, ghee, butter, flavored milk, and other dairy-based products.",
    },
    {
      question: "Are your dairy products organic?",
      answer: "Yes, our milk and dairy items are sourced from farms that follow natural and sustainable farming practices without harmful chemicals.",
    },
    {
      question: "How long can I store milk after delivery?",
      answer: "Fresh milk should be refrigerated immediately and consumed within 2–3 days for the best taste and nutrition.",
    },
    {
      question: "Do you add preservatives to your products?",
      answer: "No, our dairy products are 100% natural and free from preservatives to ensure purity and health benefits.",
    },
    {
      question: "Is your milk pasteurized?",
      answer: "Yes, all our milk undergoes pasteurization to remove harmful bacteria while retaining nutrients.",
    },
    {
      question: "Can I order dairy products online?",
      answer: "Yes, you can order through our website or mobile app, and we deliver fresh dairy products directly to your doorstep.",
    },
    {
      question: "Do you provide lactose-free milk?",
      answer: "Yes, we have lactose-free options for people who are sensitive to regular milk.",
    },
    {
      question: "How is paneer prepared and delivered?",
      answer: "Our paneer is freshly prepared every day using natural cow’s milk and delivered in hygienic packaging to maintain freshness.",
    },
    {
      question: "What are the benefits of ghee compared to refined oils?",
      answer: "Ghee is rich in healthy fats, vitamins, and antioxidants. Unlike refined oils, it aids digestion and boosts immunity.",
    },
    {
      question: "Do you provide bulk dairy products for hotels, restaurants, or events?",
      answer: "Yes, we cater bulk orders for businesses and events. You can contact our sales team for special pricing.",
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-16 px-5 sm:px-10 lg:px-20">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-800">Frequently Asked Questions</h1>
        <p className="mt-2 text-gray-600 max-w-xl mx-auto">
          Answers to the most common questions about our dairy products and services.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow-md overflow-hidden">
            <button
              className="w-full text-left px-6 py-4 flex justify-between items-center 
                         focus:outline-none transition-colors duration-300 hover:bg-gray-100"
              onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
            >
              <span className="font-medium text-gray-800">{faq.question}</span>
              <span className="text-gray-500">{openFAQ === idx ? "−" : "+"}</span>
            </button>
            <div
              className={`px-6 overflow-hidden transition-all duration-500 ${
                openFAQ === idx ? "max-h-40 py-4" : "max-h-0"
              }`}
            >
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
