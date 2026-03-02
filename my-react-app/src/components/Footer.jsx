import React from 'react';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer style={{ backgroundColor: '#2C3E50', color: '#ecf0f1', paddingTop: '60px', paddingBottom: '30px' }}>
            <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', marginBottom: '40px' }}>

                {/* Brand Info */}
                <div>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', marginBottom: '20px', color: 'var(--color-white)' }}>
                        EcomFurniture
                    </h3>
                    <p style={{ color: '#BDC3C7', lineHeight: '1.8' }}>
                        Crafting premium furniture that transforms houses into homes. Experience designs that blend aesthetics with superior comfort.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 style={{ color: 'var(--color-white)', marginBottom: '20px', fontSize: '1.1rem' }}>Quick Links</h4>
                    <ul style={{ listStyle: 'none' }}>
                        {['Home', 'Products', 'Contact'].map((item) => (
                            <li key={item} style={{ marginBottom: '10px' }}>
                                <a href="#" style={{ color: '#BDC3C7', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-secondary)'} onMouseOut={(e) => e.currentTarget.style.color = '#BDC3C7'}>{item}</a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact Info */}
                <div>
                    <h4 style={{ color: 'var(--color-white)', marginBottom: '20px', fontSize: '1.1rem' }}>Contact Us</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#BDC3C7' }}>
                            <MapPin size={18} />
                            <span>123 Design Avenue, Creative City, ST 10001</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#BDC3C7' }}>
                            <Phone size={18} />
                            <span>+1 (555) 123-4567</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#BDC3C7' }}>
                            <Mail size={18} />
                            <span>hello@ecomfurniture.com</span>
                        </div>
                    </div>
                </div>

            </div>

            <div style={{ borderTop: '1px solid #34495E', paddingTop: '30px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <a href="#" style={{ color: 'white' }}><Facebook size={20} /></a>
                    <a href="#" style={{ color: 'white' }}><Twitter size={20} /></a>
                    <a href="#" style={{ color: 'white' }}><Instagram size={20} /></a>
                </div>
                <p style={{ color: '#7F8C8D', fontSize: '0.9rem' }}>
                    © {new Date().getFullYear()} EcomFurniture. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
