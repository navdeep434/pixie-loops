"use client";

import { useState } from "react";
import { 
  TextBox, 
  Button, 
  Card, 
  Heading, 
  Text,
  useToast,
} from "@/components/elements";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Send,
  MessageCircle,
  Instagram,
  Facebook,
} from "lucide-react";

export default function ContactClient() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log({ name, email, subject, message });

    showToast("Message sent successfully! We'll get back to you soon. 💖", "success");

    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600 py-20 text-white">
        <div className="absolute top-0 left-0 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
        
        <div className="relative mx-auto max-w-5xl px-6 text-center">
          <div className="mb-6 inline-flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm p-4">
            <MessageCircle className="h-8 w-8" />
          </div>
          <Heading level={1} className="text-white mb-4">
            Get In Touch
          </Heading>
          <Text variant="lead" className="text-white/90">
            Have questions or want to place a custom order? We'd love to hear from you! 🧶
          </Text>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Contact Info Cards */}
          <div className="space-y-6 lg:col-span-1">
            <Card variant="elevated" className="p-6">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-white">
                <Mail className="h-7 w-7" />
              </div>
              <Heading level={5} className="mb-2">Email Us</Heading>
              <Text variant="small" className="text-gray-600 mb-3">
                We'll respond within 24 hours
              </Text>
              <a 
                href="mailto:support@pixieloops.com"
                className="text-purple-600 hover:text-purple-700 font-medium transition"
              >
                support@pixieloops.com
              </a>
            </Card>

            <Card variant="elevated" className="p-6">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-pink-600 to-rose-600 text-white">
                <Phone className="h-7 w-7" />
              </div>
              <Heading level={5} className="mb-2">Call Us</Heading>
              <Text variant="small" className="text-gray-600 mb-3">
                Mon-Sat, 10 AM - 6 PM IST
              </Text>
              <a 
                href="tel:+919XXXXXXXXX"
                className="text-purple-600 hover:text-purple-700 font-medium transition"
              >
                +91 9XXXXXXXXX
              </a>
            </Card>

            <Card variant="elevated" className="p-6">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white">
                <MapPin className="h-7 w-7" />
              </div>
              <Heading level={5} className="mb-2">Visit Us</Heading>
              <Text variant="small" className="text-gray-600">
                Haryana, India
              </Text>
            </Card>

            {/* Business Hours */}
            <Card variant="bordered" className="p-6 bg-gradient-to-br from-purple-50 to-pink-50">
              <div className="mb-4 flex items-center gap-3">
                <Clock className="h-6 w-6 text-purple-600" />
                <Heading level={5}>Business Hours</Heading>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <Text variant="small">Monday - Friday</Text>
                  <Text variant="small" className="font-semibold">10 AM - 6 PM</Text>
                </div>
                <div className="flex justify-between">
                  <Text variant="small">Saturday</Text>
                  <Text variant="small" className="font-semibold">10 AM - 4 PM</Text>
                </div>
                <div className="flex justify-between">
                  <Text variant="small">Sunday</Text>
                  <Text variant="small" className="font-semibold text-rose-600">Closed</Text>
                </div>
              </div>
            </Card>

            {/* Social Media */}
            <Card variant="elevated" className="p-6">
              <Heading level={5} className="mb-4">Connect With Us</Heading>
              <div className="flex gap-3">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-white transition hover:scale-110 shadow-lg"
                >
                  <Instagram className="h-6 w-6" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white transition hover:scale-110 shadow-lg"
                >
                  <Facebook className="h-6 w-6" />
                </a>
                <a
                  href="mailto:support@pixieloops.com"
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-rose-600 to-pink-600 text-white transition hover:scale-110 shadow-lg"
                >
                  <Mail className="h-6 w-6" />
                </a>
              </div>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card variant="elevated" className="p-8">
              <Heading level={3} className="mb-2">
                Send Us a Message
              </Heading>
              <Text variant="muted" className="mb-8">
                Fill out the form below and we'll get back to you as soon as possible
              </Text>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <TextBox
                    label="Your Name"
                    name="name"
                    value={name}
                    onChange={setName}
                    placeholder="Enter your full name"
                    required
                    icon={<Mail className="h-5 w-5" />}
                  />

                  <TextBox
                    label="Email Address"
                    name="email"
                    value={email}
                    onChange={setEmail}
                    type="email"
                    placeholder="your@email.com"
                    required
                    icon={<Mail className="h-5 w-5" />}
                  />
                </div>

                <TextBox
                  label="Subject"
                  name="subject"
                  value={subject}
                  onChange={setSubject}
                  placeholder="What is this regarding?"
                  required
                />

                <TextBox
                  label="Message"
                  name="message"
                  value={message}
                  onChange={setMessage}
                  type="textarea"
                  rows={6}
                  placeholder="Tell us more about your inquiry or custom order..."
                  required
                />

                <Button 
                  type="submit" 
                  className="w-full gap-2"
                  size="lg"
                  loading={loading}
                  disabled={loading}
                >
                  {loading ? "Sending..." : (
                    <>
                      <Send className="h-5 w-5" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </Card>

            {/* FAQ Quick Links */}
            <Card variant="bordered" className="mt-6 p-6 bg-gradient-to-br from-purple-50 to-pink-50">
              <Heading level={5} className="mb-4">Quick Questions?</Heading>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Text className="font-semibold text-purple-600 mb-1">
                    Custom Orders
                  </Text>
                  <Text variant="small" className="text-gray-600">
                    We love creating personalized pieces! Share your ideas with us.
                  </Text>
                </div>
                <div>
                  <Text className="font-semibold text-pink-600 mb-1">
                    Shipping Time
                  </Text>
                  <Text variant="small" className="text-gray-600">
                    Most orders ship within 3-5 business days.
                  </Text>
                </div>
                <div>
                  <Text className="font-semibold text-rose-600 mb-1">
                    Return Policy
                  </Text>
                  <Text variant="small" className="text-gray-600">
                    We offer exchanges within 7 days of delivery.
                  </Text>
                </div>
                <div>
                  <Text className="font-semibold text-purple-600 mb-1">
                    Care Instructions
                  </Text>
                  <Text variant="small" className="text-gray-600">
                    Each item comes with detailed care guidelines.
                  </Text>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}