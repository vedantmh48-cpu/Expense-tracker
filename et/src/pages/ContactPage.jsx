import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle } from 'lucide-react';

export const ContactPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setName('');
      setEmail('');
      setMessage('');
    }, 3000);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Contact Us</h1>
          <p className="page-subtitle">We'd love to hear from you</p>
        </div>
      </div>

      <div className="contact-page-grid">
        <div className="contact-info-card">
          <div className="contact-info-icon">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3>Get in Touch</h3>
          <p>
            Have questions, feedback, or need help? Our team is here to assist you.
            We typically respond within 24 hours.
          </p>
          <div className="contact-details">
            <div className="contact-detail-item">
              <Mail className="w-4 h-4" />
              <span>support@rupeeflow.app</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="contact-form-card">
          <h3>Send us a Message</h3>
          {sent && (
            <div className="alert-message success">
              <CheckCircle className="w-4 h-4" /> Message sent successfully! We'll get back to you soon.
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Your Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
              placeholder="Enter your name"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Message</label>
            <textarea
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="form-textarea"
              placeholder="How can we help you?"
              rows="5"
            />
          </div>
          <button type="submit" className="btn-primary w-full justify-center">
            <Send className="w-4 h-4" /> Send Message
          </button>
        </form>
      </div>
    </div>
  );
};