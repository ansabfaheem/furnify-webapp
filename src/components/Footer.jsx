import React from 'react';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container footer-container">

                {/* Brand Info */}
                <div className="footer-brand">
                    <h3>
                        EcomFurniture
                    </h3>
                    <p>
                        Crafting premium furniture that transforms houses into homes. Experience designs that blend aesthetics with superior comfort.
                    </p>
                </div>

                {/* Quick Links */}
                <div className="footer-section">
                    <h4>Quick Links</h4>
                    <ul className="footer-links">
                        {['Home', 'Products', 'Contact'].map((item) => (
                            <li key={item}>
                                <a href="#" className="footer-link">{item}</a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact Info */}
                <div className="footer-section">
                    <h4>Contact Us</h4>
                    <div className="footer-contact">
                        <div className="contact-item">
                            <MapPin size={18} />
                            <span>Nilambur , Kerala</span>
                        </div>
                        <div className="contact-item">
                            <Phone size={18} />
                            <span>+91 9048201178</span>
                        </div>
                        <div className="contact-item">
                            <Mail size={18} />
                            <span>contact@furnify.com</span>
                        </div>
                    </div>
                </div>

            </div>

            <div className="footer-bottom">
                <div className="social-links">
                    <a href="#" className="social-icon"><Facebook size={20} /></a>
                    <a href="#" className="social-icon"><Twitter size={20} /></a>
                    <a href="#" className="social-icon"><Instagram size={20} /></a>
                </div>
                <p className="copyright">
                    © {new Date().getFullYear()} EcomFurniture. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
