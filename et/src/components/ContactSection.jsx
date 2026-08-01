import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, MessageSquare, ShieldCheck } from 'lucide-react';

export const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true);
      setTimeout(() => {
        setFormData({ name: '', email: '', subject: '', message: '' });
      }, 500);
    }
  };

  return (
    <section id="contact" className="mb-12 scroll-mt-24">
      <div className="glass-card p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
          {/* Left Column: Form Info */}
          <div className="w-full md:w-1/2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4F46E5]/10 text-[#4F46E5] border border-[#4F46E5]/20 text-xs font-bold mb-3">
              <Mail className="w-3.5 h-3.5 text-[#4F46E5]" />
              <span>Get In Touch</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#0F172A] tracking-tight mb-3">
              Have Questions or Feedback?
            </h2>
            <p className="text-[#64748B] text-sm mb-6 leading-relaxed">
              We'd love to hear from you! Whether you have feature requests, need support managing your cash flows, or just want to connect, send us a message below.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#FFFFFF]/70 border border-[#E2E8F0]/30">
                <div className="p-2.5 rounded-lg bg-[#10B981]/15 text-[#10B981]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">100% Privacy Focused</h4>
                  <p className="text-xs text-[#64748B]">All data remains locally stored in your browser.</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#FFFFFF]/70 border border-[#E2E8F0]/30">
                <div className="p-2.5 rounded-lg bg-[#4F46E5]/10 text-[#4F46E5]">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">Tailored for India</h4>
                  <p className="text-xs text-[#64748B]">Built specifically for ₹ INR, UPI, and Indian banks.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="w-full md:w-1/2 bg-[#FFFFFF] p-6 rounded-2xl border border-[#E2E8F0]/40 shadow-sm">
            {submitted ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#10B981] mx-auto animate-bounce" />
                <h3 className="text-xl font-bold text-[#0F172A]">Message Sent Successfully!</h3>
                <p className="text-xs text-[#64748B] max-w-xs mx-auto">
                  Thank you for reaching out. We will get back to you shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="btn-secondary text-xs mt-4"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="form-label">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-input text-xs"
                  />
                </div>

                <div>
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="form-input text-xs"
                  />
                </div>

                <div>
                  <label className="form-label">Subject</label>
                  <input
                    type="text"
                    placeholder="Feedback / Feature Request"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="form-input text-xs"
                  />
                </div>

                <div>
                  <label className="form-label">Message *</label>
                  <textarea
                    required
                    rows="3"
                    placeholder="How can we help you?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="form-textarea text-xs"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full btn-primary justify-center py-2.5 text-xs shadow-md"
                >
                  <Send className="w-4 h-4 text-[#FFFFFF]" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};