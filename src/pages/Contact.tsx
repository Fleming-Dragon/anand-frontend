import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react";
import { contactService, ContactFormData } from "../services/contactService";
import toast from "react-hot-toast";

const Contact = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
    phone: "",
    type: "inquiry",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      await contactService.submitContact(formData);
      setIsSubmitted(true);
      toast.success("Message sent successfully! We'll get back to you soon.");

      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
          phone: "",
          type: "inquiry",
        });
      }, 3000);
    } catch (err) {
      console.error("Contact form submission error:", err);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Our Location",
      details: ["Nashik, Maharashtra", "India - 422001"],
      color: "from-secondary-500 to-primary-500",
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Phone Number",
      details: ["+91 98765 43210", "+91 87654 32109"],
      color: "from-primary-500 to-secondary-500",
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email Address",
      details: ["info@anandagro.com", "orders@anandagro.com"],
      color: "from-primary-500 to-accent-500",
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Business Hours",
      details: ["Mon - Sat: 9:00 AM - 7:00 PM", "Sunday: 10:00 AM - 5:00 PM"],
      color: "from-secondary-500 to-primary-500",
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-50 to-primary-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-serif font-bold text-accent-800 mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We'd love to hear from you. Send us a message and we'll respond as
            soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${info.color} text-white rounded-full mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    {info.icon}
                  </div>
                  <h3 className="text-lg font-serif font-semibold text-accent-800 mb-4">
                    {info.title}
                  </h3>
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-gray-600 leading-relaxed">
                      {detail}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-16 bg-gradient-to-r from-primary-50 to-primary-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white p-8 rounded-2xl shadow-xl">
              <h2 className="text-3xl font-serif font-bold text-accent-800 mb-8">
                Send Us a Message
              </h2>

              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
                    <CheckCircle className="h-8 w-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-accent-800 mb-2">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-gray-600">
                    Thank you for reaching out. We'll get back to you within 24
                    hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your email address"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="type"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Inquiry Type
                      </label>
                      <select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="inquiry">General Inquiry</option>
                        <option value="support">Support</option>
                        <option value="feedback">Feedback</option>
                        <option value="partnership">Partnership</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Subject *
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
                        placeholder="What's this about?"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200"
                      placeholder="Tell us about your inquiry, bulk orders, or any questions you have..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center space-x-2 bg-secondary-500 text-white font-semibold py-4 px-6 rounded-lg hover:bg-secondary-600 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <Send className="h-5 w-5" />
                    <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
                  </button>
                </form>
              )}
            </div>

            {/* Map & Additional Info */}
            <div className="space-y-8">
              {/* Map */}
              <div className="bg-white p-8 rounded-2xl shadow-xl">
                <h3 className="text-2xl font-serif font-bold text-earth-800 mb-6">
                  Find Us Here
                </h3>
                <div className="aspect-w-16 aspect-h-12 rounded-lg overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3748.5419873883845!2d73.7850086!3d20.0091!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bddeb9d3f3b3ab7%3A0x4b9b5c5d4a9c9b5!2sNashik%2C%20Maharashtra%2C%20India!5e0!3m2!1sen!2sus!4v1634567890123!5m2!1sen!2sus"
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-lg"
                  ></iframe>
                </div>
                <div className="mt-6 p-4 bg-gradient-to-r from-golden-50 to-nature-50 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-golden-600 mt-1" />
                    <div>
                      <p className="font-semibold text-earth-800">
                        Anand Agro Industry
                      </p>
                      <p className="text-gray-600">
                        Nashik, Maharashtra, India
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Located in the heart of Maharashtra's sugarcane belt
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Contact */}
              <div className="bg-white p-8 rounded-2xl shadow-xl">
                <h3 className="text-2xl font-serif font-bold text-earth-800 mb-6">
                  Quick Contact
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="bg-golden-100 p-2 rounded-full">
                      <Phone className="h-5 w-5 text-golden-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-earth-800">Call Us</p>
                      <p className="text-gray-600">+91 98765 43210</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="bg-nature-100 p-2 rounded-full">
                      <Mail className="h-5 w-5 text-nature-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-earth-800">Email Us</p>
                      <p className="text-gray-600">info@anandagro.com</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-gradient-to-r from-earth-50 to-golden-50 rounded-lg">
                  <h4 className="font-semibold text-earth-800 mb-2">
                    Bulk Orders
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Special pricing available for bulk orders. Contact us for
                    wholesale rates and custom packaging options.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-earth-700 to-golden-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-serif font-bold text-white mb-6">
            Ready to Experience Pure Sweetness?
          </h2>
          <p className="text-xl text-golden-100 mb-8 leading-relaxed">
            Browse our premium jaggery collection or visit our facility in
            Nashik
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/products"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-earth-700 font-semibold rounded-lg hover:bg-golden-50 transition-all duration-200 transform hover:scale-105"
            >
              View Products
            </a>
            <a
              href="/about"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-earth-700 transition-all duration-200"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
