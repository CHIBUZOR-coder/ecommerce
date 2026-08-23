import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-black text-gray-400 mt-auto">
      <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">

        {/* Brand */}
        <div className="flex flex-col gap-3">
          <span className="text-white font-bold text-lg">Zappos</span>
          <p className="text-sm leading-relaxed">
            Quality footwear and apparel for men, women, and kids.
          </p>
        </div>

        {/* Quick links */}
        <div className="flex flex-col gap-3">
          <span className="text-white font-semibold text-sm uppercase tracking-wider">Shop</span>
          <ul className="flex flex-col gap-2 text-sm">
            {[
              { label: "Men", path: "/men" },
              { label: "Women", path: "/women" },
              { label: "Kids", path: "/kids" },
              { label: "My Orders", path: "/orders" },
              { label: "Cart", path: "/cart" },
            ].map((link) => (
              <li key={link.path}>
                <Link to={link.path} className="hover:text-white transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-3">
          <span className="text-white font-semibold text-sm uppercase tracking-wider">Contact</span>
          <ul className="flex flex-col gap-2 text-sm">
            <li>
              <a href="mailto:support@zappos.com" className="hover:text-white transition-colors">
                support@zappos.com
              </a>
            </li>
            <li>
              <a href="tel:+2348000000000" className="hover:text-white transition-colors">
                +234 800 000 0000
              </a>
            </li>
          </ul>
          {/* Social icons */}
          <div className="flex gap-4 mt-2">
            <a href="/" aria-label="Instagram" className="hover:text-white transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a href="/" aria-label="Twitter / X" className="hover:text-white transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href="/" aria-label="Facebook" className="hover:text-white transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800 py-4 text-center text-xs text-gray-600">
        © {new Date().getFullYear()} Zappos. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
