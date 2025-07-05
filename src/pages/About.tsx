import {
  Calendar,
  MapPin,
  Target,
  Heart,
  Shield,
  Award,
  CheckCircle,
} from "lucide-react";

const About = () => {
  const certifications = [
    {
      name: "FSSAI",
      description: "Food Safety and Standards Authority of India certification",
      icon: <Shield className="h-8 w-8" />,
    },
    {
      name: "Organic Certification",
      description: "Certified organic by national organic certification body",
      icon: <CheckCircle className="h-8 w-8" />,
    },
    {
      name: "GMP Compliance",
      description: "Good Manufacturing Practices certification",
      icon: <Award className="h-8 w-8" />,
    },
  ];

  const values = [
    {
      title: "Purity",
      description: "We ensure every product is 100% natural and chemical-free",
      icon: <Heart className="h-8 w-8" />,
    },
    {
      title: "Sustainability",
      description: "Supporting eco-friendly farming and processing methods",
      icon: <CheckCircle className="h-8 w-8" />,
    },
    {
      title: "Local Support",
      description: "Empowering local farmers and rural communities",
      icon: <Target className="h-8 w-8" />,
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-50 to-primary-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-serif font-bold text-accent-800 mb-6">
              Our Story
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Reviving the traditional sweetness of India with modern hygiene
              standards
            </p>
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-center space-x-4 text-secondary-600">
                <Calendar className="h-6 w-6" />
                <span className="text-lg font-semibold">
                  Founded on 15th August 2023
                </span>
              </div>
              <div className="flex items-center space-x-4 text-primary-600">
                <MapPin className="h-6 w-6" />
                <span className="text-lg font-semibold">
                  Nashik, Maharashtra, India
                </span>
              </div>
              <h2 className="text-3xl font-serif font-bold text-accent-800">
                A Sweet Beginning
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Anand Agro Industry was born from a simple yet powerful vision:
                to bring back the authentic taste of traditional jaggery to
                modern kitchens. Founded on India's Independence Day, we
                celebrate the freedom to choose healthy, natural alternatives.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Located in the heart of Maharashtra's sugarcane belt, Nashik, we
                work directly with local farmers who have been cultivating
                sugarcane for generations. Our mission is to revive the healthy
                traditional sweetness that our ancestors enjoyed.
              </p>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/4021883/pexels-photo-4021883.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Sugarcane farming"
                className="rounded-2xl shadow-xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-gradient-to-r from-secondary-500 to-primary-500 text-white p-6 rounded-xl shadow-lg">
                <p className="font-bold text-2xl">2023</p>
                <p className="text-sm opacity-90">Year Founded</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Process */}
      <section className="py-20 bg-gradient-to-r from-primary-50 to-primary-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <img
                src="https://images.pexels.com/photos/7629488/pexels-photo-7629488.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Traditional jaggery making"
                className="rounded-2xl shadow-xl"
              />
            </div>
            <div className="space-y-8 order-1 lg:order-2">
              <h2 className="text-3xl font-serif font-bold text-accent-800">
                Traditional Methods, Modern Standards
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Our production process combines time-tested traditional methods
                with modern hygiene standards. We use stainless steel equipment
                throughout our processing to ensure the highest quality and
                safety standards.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary-100 p-2 rounded-full mt-1">
                    <CheckCircle className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-accent-800">
                      Chemical-Free Processing
                    </h4>
                    <p className="text-gray-600">
                      No artificial additives, colors, or preservatives
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-primary-100 p-2 rounded-full mt-1">
                    <CheckCircle className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-accent-800">
                      Traditional Boiling
                    </h4>
                    <p className="text-gray-600">
                      Slow-cooked in open pans to retain natural nutrients
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-primary-100 p-2 rounded-full mt-1">
                    <CheckCircle className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-accent-800">
                      Quality Control
                    </h4>
                    <p className="text-gray-600">
                      Every batch is tested for purity and quality
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-accent-800 mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gradient-to-br from-golden-50 to-nature-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-golden-500 to-nature-500 text-white rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-serif font-semibold text-earth-800 mb-4">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20 bg-gradient-to-r from-earth-700 to-golden-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-white mb-4">
              Our Certifications
            </h2>
            <p className="text-xl text-golden-100 max-w-3xl mx-auto">
              Recognized standards that ensure quality and safety
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {certifications.map((cert, index) => (
              <div key={index} className="text-center">
                <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 text-white rounded-full mb-6">
                    {cert.icon}
                  </div>
                  <h3 className="text-xl font-serif font-semibold text-white mb-4">
                    {cert.name}
                  </h3>
                  <p className="text-golden-100 leading-relaxed">
                    {cert.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-serif font-bold text-earth-800 mb-6">
            Join Our Sweet Journey
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Experience the difference that traditional methods and modern
            standards can make. Taste the purity, feel the tradition.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/products"
              className="inline-flex items-center justify-center px-8 py-4 bg-golden-600 text-white font-semibold rounded-lg hover:bg-golden-700 transition-all duration-200 transform hover:scale-105"
            >
              Explore Products
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-golden-600 text-golden-600 font-semibold rounded-lg hover:bg-golden-50 transition-all duration-200"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
