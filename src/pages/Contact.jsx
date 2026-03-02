import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import './Contact.css';

const Contact = () => {
    return (
        <div className="contact-page">
            <div className="section-padding contact-header">
                <div className="container text-center">
                    <h1>Get in Touch</h1>
                    <p className="contact-intro">We'd love to hear from you. Here's how you can reach us.</p>
                </div>
            </div>

            <div className="section-padding">
                <div className="container">
                    <div className="contact-layout">

                        {/* Contact Info */}
                        <div>
                            <h2 className="contact-info-title">Contact Information</h2>
                            <div className="contact-info-list">
                                <div className="contact-info-item">
                                    <div className="contact-icon-circle">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <h3 className="contact-item-title">Phone</h3>
                                        <p className="contact-item-text">+91 9048201178</p>
                                        <p className="contact-item-subtext">Mon-Fri 9am-6pm</p>
                                    </div>
                                </div>

                                <div className="contact-info-item">
                                    <div className="contact-icon-circle">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <h3 className="contact-item-title">Email</h3>
                                        <p className="contact-item-text">support@furnify.com</p>
                                        <p className="contact-item-subtext">Online support 24/7</p>
                                    </div>
                                </div>

                                <div className="contact-info-item">
                                    <div className="contact-icon-circle">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <h3 className="contact-item-title">Office</h3>
                                        <p className="contact-item-text">Nilambur</p>
                                        <p className="contact-item-text">Malappuram , India</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="contact-form-card">
                            <h2 className="form-title">Send us a Message</h2>
                            <form onSubmit={(e) => e.preventDefault()}>
                                <div className="form-row">
                                    <div>
                                        <label className="form-label">First Name</label>
                                        <input type="text" placeholder="Alex" className="form-input-contact" />
                                    </div>
                                    <div>
                                        <label className="form-label">Last Name</label>
                                        <input type="text" placeholder="John" className="form-input-contact" />
                                    </div>
                                </div>

                                <div className="form-group-contact">
                                    <label className="form-label">Email</label>
                                    <input type="email" placeholder="furnify@example.com" className="form-input-contact" />
                                </div>

                                <div className="form-group-textarea">
                                    <label className="form-label">Message</label>
                                    <textarea rows="5" placeholder="How can we help you?" className="form-textarea"></textarea>
                                </div>

                                <button type="submit" className="btn btn-primary send-btn">
                                    Send Message <Send size={18} />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
