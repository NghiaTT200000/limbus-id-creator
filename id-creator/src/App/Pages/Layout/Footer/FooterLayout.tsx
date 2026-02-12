import React from "react";
import { ReactElement } from "react";
import { Link } from "react-router-dom";
import "./FooterLayout.css";

export default function FooterLayout(): ReactElement {
    return (
        <footer className="site-footer">
            <div className="site-footer-content">
                <nav className="footer-links">
                    <Link to="/" className="footer-link">Home</Link>
                    <Link to="/about" className="footer-link">About</Link>
                    <Link to="/blog" className="footer-link">Blog</Link>
                    <Link to="/contact" className="footer-link">Contact</Link>
                    <Link to="/privacy-policy" className="footer-link">Privacy Policy</Link>
                    <Link to="/terms-of-service" className="footer-link">Terms of Service</Link>
                </nav>
                <div className="footer-disclaimer">
                    This is an unofficial fan work and is not endorsed by Project Moon.
                    <br />
                    For more information:{" "}
                    <a
                        href="https://x.com/ProjMoonStudio/status/1629085462236397573?lang=en"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Project Moon's Fan Content Policy
                    </a>
                </div>
            </div>
        </footer>
    );
}
