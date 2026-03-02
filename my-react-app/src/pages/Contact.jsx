import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
    return (
        <div className="contact-page">
            <div className="section-padding" style={{ backgroundColor: '#F3F4F6', paddingBottom: '40px' }}>
                <div className="container text-center">
                    <h1>Get in Touch</h1>
                    <p style={{ color: 'var(--color-light-text)', marginTop: '10px' }}>We'd love to hear from you. Here's how you can reach us.</p>
                </div>
            </div>

            <div className="section-padding">
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '60px' }}>

                        {/* Contact Info */}
                        <div>
                            <h2 style={{ marginBottom: '30px' }}>Contact Information</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                                <div style={{ display: 'flex', gap: '20px' }}>
                                    <div style={{ width: '50px', height: '50px', backgroundColor: 'rgba(230, 126, 34, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-secondary)' }}>
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1.2rem' }}>Phone</h3>
                                        <p style={{ color: 'var(--color-light-text)' }}>+1 (555) 000-0000</p>
                                        <p style={{ color: 'var(--color-light-text)', fontSize: '0.9rem' }}>Mon-Fri 9am-6pm</p>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '20px' }}>
                                    <div style={{ width: '50px', height: '50px', backgroundColor: 'rgba(230, 126, 34, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-secondary)' }}>
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1.2rem' }}>Email</h3>
                                        <p style={{ color: 'var(--color-light-text)' }}>support@ecomfurniture.com</p>
                                        <p style={{ color: 'var(--color-light-text)', fontSize: '0.9rem' }}>Online support 24/7</p>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '20px' }}>
                                    <div style={{ width: '50px', height: '50px', backgroundColor: 'rgba(230, 126, 34, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-secondary)' }}>
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1.2rem' }}>Office</h3>
                                        <p style={{ color: 'var(--color-light-text)' }}>123 Design Avenue</p>
                                        <p style={{ color: 'var(--color-light-text)' }}>Creative City, ST 10001</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>
                            <h2 style={{ marginBottom: '20px' }}>Send us a Message</h2>
                            <form onSubmit={(e) => e.preventDefault()}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>First Name</label>
                                        <input type="text" placeholder="John" style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Last Name</label>
                                        <input type="text" placeholder="Doe" style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none' }} />
                                    </div>
                                </div>

                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Email</label>
                                    <input type="email" placeholder="john@example.com" style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none' }} />
                                </div>

                                <div style={{ marginBottom: '30px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Message</label>
                                    <textarea rows="5" placeholder="How can we help you?" style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none', resize: 'vertical' }}></textarea>
                                </div>

                                <button type="submit" className="btn btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
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
