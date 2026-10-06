import { useState } from "react";
import {
  FiPhone,
  FiMapPin,
  FiInstagram,
  FiMail,
  FiStar,
  FiMessageSquare,
  FiCheckCircle,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { sendContactMessage } from "../../firebase/contactService";
import { addReview } from "../../firebase/reviewService";
import { useAuth } from "../../context/AuthContext";

export default function Contact() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("message"); // "message" | "feedback"
  const [messageSent, setMessageSent] = useState(false);
  const [reviewSent, setReviewSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Message Form State
  const [messageForm, setMessageForm] = useState({
    name: user?.displayName || "",
    email: user?.email || "",
    phone: "",
    message: "",
  });

  // Feedback / Review Form State
  const [feedbackForm, setFeedbackForm] = useState({
    name: user?.displayName || "",
    email: user?.email || "",
    category: "Shopping Experience",
    rating: 5,
    review: "",
  });

  const handleMessageChange = (e) => {
    setMessageForm({
      ...messageForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleFeedbackChange = (e) => {
    setFeedbackForm({
      ...feedbackForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await sendContactMessage(messageForm);
      setMessageSent(true);
      setMessageForm({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
      setTimeout(() => setMessageSent(false), 5000);
    } catch (err) {
      console.error(err);
      alert("Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackForm.review.trim()) {
      alert("Please enter your feedback or review.");
      return;
    }
    setSubmitting(true);
    try {
      await addReview({
        userId: user?.uid || "guest",
        userName: feedbackForm.name || "Valued Customer",
        userEmail: feedbackForm.email,
        feedbackCategory: feedbackForm.category,
        rating: feedbackForm.rating,
        review: feedbackForm.review,
        source: "contact_page",
      });
      setReviewSent(true);
      setFeedbackForm({
        name: "",
        email: "",
        category: "Shopping Experience",
        rating: 5,
        review: "",
      });
      setTimeout(() => setReviewSent(false), 5000);
    } catch (err) {
      console.error(err);
      alert("Failed to submit feedback.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="bg-[#FAF8F5] min-h-screen pt-24 pb-20">
      {/* Header */}
      <section className="text-center pt-8 pb-12 px-6">
        <p className="uppercase tracking-[0.25em] text-xs text-[#7E222A] font-semibold">
          Customer Care & Community
        </p>

        <h1 className="mt-3 text-4xl sm:text-6xl font-editorial font-bold text-[#2E2A27]">
          Contact & Review Us
        </h1>

        <p className="max-w-2xl mx-auto mt-4 text-[#6A625B] text-base sm:text-lg leading-relaxed font-light">
          We are here to help. Reach our customer care team or share your thoughts to help us continually elevate your experience.
        </p>

        {/* Tab Switcher */}
        <div className="inline-flex p-1.5 mt-8 bg-white rounded-full border border-neutral-200 shadow-sm">
          <button
            onClick={() => setActiveTab("message")}
            className={`px-6 sm:px-8 py-2.5 rounded-full text-xs sm:text-sm uppercase tracking-wider font-medium transition ${
              activeTab === "message"
                ? "bg-black text-white shadow-md"
                : "text-neutral-600 hover:text-black"
            }`}
          >
            ✉ Send a Message
          </button>
          <button
            onClick={() => setActiveTab("feedback")}
            className={`px-6 sm:px-8 py-2.5 rounded-full text-xs sm:text-sm uppercase tracking-wider font-medium transition ${
              activeTab === "feedback"
                ? "bg-[#7E222A] text-white shadow-md"
                : "text-neutral-600 hover:text-[#7E222A]"
            }`}
          >
            ★ Review Us / Feedback
          </button>
        </div>
      </section>

      {/* Main Grid */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid lg:grid-cols-12 gap-10 sm:gap-12 items-start">
          {/* Left Form: Message or Review based on active tab */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-12 border border-[#ECE8E3] shadow-sm">
            {activeTab === "message" ? (
              <>
                <div className="mb-8">
                  <h2 className="text-2xl sm:text-3xl font-editorial font-bold text-[#2E2A27]">
                    Send us a Message
                  </h2>
                  <p className="text-neutral-500 text-xs sm:text-sm mt-1">
                    Have an inquiry about sizing, orders, or custom requests? Let us know below.
                  </p>
                </div>

                <form onSubmit={handleMessageSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1.5 font-medium">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={messageForm.name}
                      onChange={handleMessageChange}
                      placeholder="e.g. Ayesha Khan"
                      required
                      className="w-full rounded-xl border border-[#E5DED7] px-4 py-3 text-sm outline-none focus:border-[#7E222A]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1.5 font-medium">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={messageForm.email}
                        onChange={handleMessageChange}
                        placeholder="your@email.com"
                        required
                        className="w-full rounded-xl border border-[#E5DED7] px-4 py-3 text-sm outline-none focus:border-[#7E222A]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1.5 font-medium">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={messageForm.phone}
                        onChange={handleMessageChange}
                        placeholder="+91 98765 43210"
                        className="w-full rounded-xl border border-[#E5DED7] px-4 py-3 text-sm outline-none focus:border-[#7E222A]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1.5 font-medium">
                      Your Message *
                    </label>
                    <textarea
                      rows="5"
                      name="message"
                      value={messageForm.message}
                      onChange={handleMessageChange}
                      placeholder="How can we assist you today?"
                      required
                      className="w-full rounded-xl border border-[#E5DED7] px-4 py-3 text-sm outline-none resize-none focus:border-[#7E222A]"
                    />
                  </div>

                  {messageSent && (
                    <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 text-xs sm:text-sm font-medium">
                      <FiCheckCircle className="text-lg flex-shrink-0" />
                      <span>Thank you! Your message has been received. Our team will get back to you shortly.</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-black text-white py-3.5 rounded-full text-xs uppercase tracking-[0.2em] font-medium hover:bg-neutral-800 transition disabled:opacity-50"
                  >
                    {submitting ? "Sending..." : "Send Message"}
                  </button>
                </form>
              </>
            ) : (
              <>
                <div className="mb-8">
                  <h2 className="text-2xl sm:text-3xl font-editorial font-bold text-[#7E222A]">
                    Review & Feedback
                  </h2>
                  <p className="text-neutral-500 text-xs sm:text-sm mt-1">
                    Your voice shapes our collections. Rate your experience and share your honest feedback.
                  </p>
                </div>

                <form onSubmit={handleFeedbackSubmit} className="space-y-5">
                  {/* Rating Selector */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-2 font-medium">
                      Overall Rating *
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() =>
                            setFeedbackForm({ ...feedbackForm, rating: star })
                          }
                          className="p-1 hover:scale-110 transition"
                        >
                          <FiStar
                            className={`text-2xl sm:text-3xl ${
                              star <= feedbackForm.rating
                                ? "fill-[#C8A26A] text-[#C8A26A]"
                                : "text-neutral-300"
                            }`}
                          />
                        </button>
                      ))}
                      <span className="ml-3 text-xs font-semibold text-neutral-700">
                        {feedbackForm.rating} / 5 Stars
                      </span>
                    </div>
                  </div>

                  {/* Feedback Category */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1.5 font-medium">
                      Feedback Type
                    </label>
                    <select
                      name="category"
                      value={feedbackForm.category}
                      onChange={handleFeedbackChange}
                      className="w-full rounded-xl border border-[#E5DED7] px-4 py-3 text-sm outline-none bg-white focus:border-[#7E222A]"
                    >
                      <option value="Shopping Experience">Shopping Experience</option>
                      <option value="Product Quality & Fabric">Product Quality & Fabric</option>
                      <option value="Sizing & Fit">Sizing & Fit</option>
                      <option value="Delivery & Packaging">Delivery & Packaging</option>
                      <option value="Customer Care">Customer Care</option>
                      <option value="General Suggestion">General Suggestion</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1.5 font-medium">
                        Your Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={feedbackForm.name}
                        onChange={handleFeedbackChange}
                        placeholder="Your name"
                        className="w-full rounded-xl border border-[#E5DED7] px-4 py-3 text-sm outline-none focus:border-[#7E222A]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1.5 font-medium">
                        Your Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={feedbackForm.email}
                        onChange={handleFeedbackChange}
                        placeholder="your@email.com"
                        className="w-full rounded-xl border border-[#E5DED7] px-4 py-3 text-sm outline-none focus:border-[#7E222A]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1.5 font-medium">
                      Your Review / Thoughts *
                    </label>
                    <textarea
                      rows="5"
                      name="review"
                      value={feedbackForm.review}
                      onChange={handleFeedbackChange}
                      placeholder="Tell us what you loved or how we can improve..."
                      required
                      className="w-full rounded-xl border border-[#E5DED7] px-4 py-3 text-sm outline-none resize-none focus:border-[#7E222A]"
                    />
                  </div>

                  {reviewSent && (
                    <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 text-xs sm:text-sm font-medium">
                      <FiCheckCircle className="text-lg flex-shrink-0" />
                      <span>Thank you! Your feedback has been submitted to the YUMI curation team.</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#7E222A] text-white py-3.5 rounded-full text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#681921] transition disabled:opacity-50"
                  >
                    {submitting ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              </>
            )}
          </div>

          {/* Right Information Card: Updated with Customer Care Phone 7349558926 */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-8 sm:p-12 border border-[#ECE8E3] shadow-sm space-y-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-editorial font-bold text-[#2E2A27]">
                Customer Care
              </h2>
              <p className="mt-2 text-[#6A625B] text-sm leading-relaxed font-light">
                Direct lines for order tracking, size advice, or assistance:
              </p>
            </div>

            <div className="space-y-6">
              {/* Primary Customer Care Phone */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#FAF8F5] border border-neutral-200/80">
                <div className="w-10 h-10 rounded-full bg-[#7E222A] text-white flex items-center justify-center flex-shrink-0">
                  <FiPhone size={18} />
                </div>
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-neutral-500 font-semibold">
                    Customer Care Hotline
                  </h3>
                  <a
                    href="tel:+917349558926"
                    className="text-base sm:text-lg font-bold text-neutral-900 hover:text-[#7E222A] transition block mt-0.5"
                  >
                    +91 73495 58926
                  </a>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Available Mon–Sat: 9:00 AM – 8:00 PM IST
                  </p>
                </div>
              </div>

              {/* WhatsApp Support */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/60">
                <div className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center flex-shrink-0">
                  <FaWhatsapp size={20} />
                </div>
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-emerald-800 font-semibold">
                    WhatsApp Chat
                  </h3>
                  <a
                    href="https://wa.me/917349558926?text=Hi%20YUMI%20team,%20I%20have%20an%20inquiry%20regarding..."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-bold text-emerald-950 hover:underline block mt-0.5"
                  >
                    +91 73495 58926 ↗
                  </a>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    Instant chat for quick questions & orders
                  </p>
                </div>
              </div>

              {/* Head Office & Additional Numbers */}
              <div className="space-y-4 pt-2 border-t border-neutral-100 text-sm text-[#6A625B]">
                <div className="flex items-center gap-3">
                  <FiPhone className="text-neutral-400" />
                  <span>Head Office: +91 95913 08536</span>
                </div>

                <div className="flex items-center gap-3">
                  <FiMail className="text-neutral-400" />
                  <a
                    href="mailto:care.yumidxb@gmail.com"
                    className="hover:text-black transition"
                  >
                    care.yumidxb@gmail.com
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <FiInstagram className="text-neutral-400" />
                  <a
                    href="https://www.instagram.com/yumi_dxb"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[#7E222A] transition"
                  >
                    @yumi_dxb on Instagram
                  </a>
                </div>

                <div className="flex items-start gap-3">
                  <FiMapPin className="text-neutral-400 mt-1" />
                  <span>Mangaluru, Karnataka, India</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-900 text-white">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#C8A26A] font-medium">
                <FiMessageSquare /> Fast Support
              </div>
              <p className="text-xs text-neutral-300 mt-2 leading-relaxed">
                You can also use our <strong>Yumi AI Chatbot</strong> (bottom-right icon) for instant answers on tracking, returns, and catalog sizing 24/7.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}