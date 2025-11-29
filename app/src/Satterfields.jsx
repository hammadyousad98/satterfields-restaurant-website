import React, { useState, useEffect, useCallback } from 'react';
import { Menu, X, ChevronRight, MapPin, Phone, Clock, Mail, Calendar, Utensils, ShoppingBag, Send, Wine, Coffee, Package, Plus } from 'lucide-react';

// --- Global Configuration & API Setup ---

// Updated color scheme based on uploaded images (Deep Red, Gold, Cream)
const COLORS = {
  // New primary background color, reflective of the dining room walls
  primaryDark: '#551A1A',
  // Secondary background for contrast, matching dark logo/accents
  secondaryDark: '#1A1A1A',
  // Main background/text color for light elements
  cream: '#FAFAFA',
  // Accent color (Warm Gold)
  gold: '#D4AF37',
};

// **FIXED IMAGE URLS:** Removed the 'uploaded:' prefix for direct access in the component's environment.
const LOGO_URL = '/images/LOGO(bg).png';
const HERO_IMAGE_URL = '/images/image(0).jpg';
const DINING_ROOM_IMAGE_URL = '/images/image(1).jpg';


const NAV_LINKS = [
  { name: 'Home', path: 'home' },
  { name: 'Dinner Menu', path: 'menu-dinner' },
  { name: 'Beverages', path: 'menu-drinks' },
  { name: 'Reservations', path: 'reservations' },
  { name: 'About', path: 'about' },
  { name: 'Contact', path: 'contact' },
];

const RESTAURANT_INFO = {
  address: '420 King St, Charleston, SC 29403',
  // Using phone number from Lunch Catering PDF (assumed most current/correct)
  phone: '(205) 969-9690',
  email: 'hello@satterfields.com',
  hours: [
    { day: 'Mon - Fri', time: '5:00 PM - 10:00 PM' },
    { day: 'Sat', time: '4:30 PM - 11:00 PM' },
    { day: 'Sun', time: 'Closed (Private Events Only)' },
  ],
};

// --- Parsed Menu Data from PDFs ---

const DINNER_MENU_DATA = [
  { category: 'House Smoked Salmon Dip', items: [{ name: 'HOUSE SMOKED SALMON DIP', desc: 'CRISPY CHIPS, VEGETABLE CRUDITES', price: '13' }] },
  {
    category: 'Seafood Bar',
    items: [
      { name: 'YELLOWFIN TUNA TARTARE', desc: 'AVOCADO, SHALLOT, TEARDROP PEPPERS, SCALLION, SESAME-SOY VINAIGRETTE, SESAME SEEDS, WASABI AIOLI, CRACKERS', price: '15', notes: '*/**/***' },
      { name: 'BAKED OYSTERS ROCKEFELLER', desc: 'SMOKED BACON, COLLARD GREENS, GARLIC, SHALLOTS, LEMON, PARSLEY, PARMESAN, BREAD CRUMBS', price: '16', notes: '***' },
      { name: 'RAW OYSTERS PLATTER', desc: 'ON THE HALFSHELL SERVED WITH COCKTAIL SAUCE, RED WINE MIGNONETTE, FRESH GRATED HORSERADISH, LEMON, CRACKERS', price: 'HALF DOZEN 18 / DOZEN 36', notes: '****' },
      { name: 'FRITTO MISTO', desc: 'SHRIMP, CRAB, RED FISH, OYSTERS, DILL PICKLES, ONION RINGS, LEMON, SPICY AIOLI', price: '18' },
    ],
  },
  {
    category: 'Appetizers & Salads',
    items: [
      { name: 'SOUP OF THE DAY', desc: 'SQUASH BISQUE WITH VIDALIA ONIONS, BUTTERNUT, WHITE WINE, CREAM, CHIVES', price: '10 BOWL / 8 CUP' },
      { name: 'FALL FLATBREAD', desc: 'TAHINA, BUTTERNUT SQUASH, SWEET PEPPERS, BRIE CHEESE, DUCK CRACKLINS, POMEGRANATE, PUMPKIN SEEDS', price: '14', notes: '** ***' },
      { name: 'BURRATA', desc: 'ROASTED TOMATOES, CHARRED ARTICHOKE HEARTS, BASIL, FOCACCIA CROSTINI, BALSAMIC GLAZE, LEMON INFUSED EXTRA VIRGIN OIL', price: '17' },
      { name: 'CHEESE BOARD', desc: 'THREE GOURMET CHEESES, STONE GROUND MUSTARD, LOCAL HONEY, NUTS, BERRIES, LAVOSH CRACKER BREAD', price: '20', notes: '** ***' },
      { name: 'WEDGE SALAD', desc: 'ICEBURG, CRISPY BACON, ROAST BEETS, GRILLED RED ONIONS, HOUSE BLUE CHEESE DRESSING, CHIVES', price: '12' },
      { name: 'MIXED BABY LETTUCE SALAD', desc: "D'ANJOU PEAR, RADISH, GOAT CHEVRE CHEESE, TOASTED WALNUTS, CHAMPAGNE VINAIGRETTE", price: '12', notes: '**' },
    ],
  },
  {
    category: 'Main Courses',
    items: [
      { name: 'SEARED DESTIN GREY TILE FISH', desc: 'BABY LIMA BEANS, CORN, BACON, HARICOTS VERT, SMOKED TOMATO VINAIGRETTE', price: '42' },
      { name: 'NIMAN RANCH PORK OSSO BUCO', desc: 'BUTTERNUT SQUASH, PEARL ONIONS, COLLARD GREENS, GREMOLATA & RICH JUS', price: '48', notes: '***', signature: true },
      { name: 'CHICKEN SCALLOPINI', desc: 'SMOKED CHEDAR POLENTA, GARLIC SAUTEED BROCCOLINI, LEMON CAPER MEUNIERE SAUCE', price: '32', notes: '***' },
      { name: 'BEEF BOURGUIGNON', desc: 'SLOW BRAISED CREEK STONE FARMS BEEF SHOULDER, BABY HEIRLOOM CARROTS, MAGIC CITY MUSHROOMS, MARBLE POTATOES, PEARL ONIONS, PINOT NOIR, THYME, NATURAL JUS', price: '37', notes: '***' },
      { name: 'DUCK TWO WAYS', desc: 'SEARED BREAST, ROAST SAUSAGE, LOCAL MUSHROOMS, CARAMELIZED CIPPOLINI ONIONS, HERB ROASTED FINGERLING POTATOES, BLUEBERRY GASTRIQUE', price: '57' },
      { name: 'GRILLED BEEF FILET', desc: '5OZ OR 10OZ FILET MIGNON, HORSERADISH MASHED POTATOES, WILTED SPINACH, GRILLED YOUNG ONIONS, CHARRED GARLIC BUTTER', price: '30 / 60', notes: '*/**/***', signature: true },
    ],
  },
];

const DESSERT_MENU_DATA = [
  {
    category: 'Desserts', items: [
      { name: 'Becky\'s Beignets', desc: 'Warm cinnamon apples, vanilla ice cream', price: '12' },
      { name: 'Tiramisu', desc: 'Marscapone, espresso dipped sponge, cocoa powder, whipped cream', price: '12' },
      { name: 'Chocolate Mousse Torte', desc: 'Strawberry coulis, walnut crumble', price: '12' },
      { name: 'Dulce de Leche Cheesecake', desc: 'Caramel sauce, glazed walnuts', price: '12' },
    ]
  },
  {
    category: 'Dessert Cocktails', items: [
      { name: 'Irish Coffee', desc: 'Jameson, Coffee, Whipped Cream', price: '10' },
      { name: 'Chocolate Martini', desc: 'Tito\'s Vodka, House made white creme de cacao, Chocolate bitters', price: '14' },
      { name: 'Carajillo', desc: 'El Tesoro Anejo tequila, Licor 43, demerara syrup, espesso shot', price: '17' },
    ]
  },
  {
    category: 'Dessert Wine & Cordials', items: [
      { name: 'Grahams 20yr Porto Tawny', price: '17' },
      { name: 'Dow\'s 10yr Porto Tawny', price: '10' },
      { name: 'Carmes de Rieussec Sauternes', price: '10' },
      { name: 'Caravella Limoncello', price: '8' },
      { name: 'Frangelico', price: '9' },
      { name: 'Bailey\'s', price: '9' },
      { name: 'Buffalo trace BourbonCream', price: '8' },
      { name: 'Fernet-Branca', price: '8' },
    ]
  },
  {
    category: 'Coffee & Hot Tea', items: [
      { name: 'Brewed Coffee (Regular or Decaffeinated)', price: '3' },
      { name: 'French Press', price: '6/9' },
      { name: 'Espresso', price: '4' },
      { name: 'Cappuccino', price: '6' },
      { name: 'Hot Tea Selection (Selection of 7 teas)', price: '3' },
    ]
  },
];

const COCKTAIL_WINE_DATA = {
  cocktails: [
    { name: 'PEACH MARTINI', desc: 'Titos, Peach Puree, Fresh Lemon, Prosecco', price: '15' },
    { name: 'PASSION', desc: 'Tequila, Passion fruit, fresh lime, orange liqueur', price: '15' },
    { name: 'ELDERFLOWER MARTINI', desc: 'Vodka, Elderflower, lemon', price: '15' },
    { name: 'LEMON BASIL COOLER', desc: 'Gin, Lemon, Fresh Basil, Prosecco', price: '15' },
    { name: 'MR. DYNAMITE', desc: 'Diplomatico Dark Rum, Jagermeister, Strawberry puree, Lemon', price: '15' },
  ],
  wineSections: [
    {
      category: 'Sparkling', items: [
        { name: 'Maschio Prosecco Brut', region: 'Italy', glass: '10', bottle: '40' },
        { name: 'Piper-Heidsieck', region: 'France, MV', glass: '20', bottle: '80' },
        { name: 'Laurent-Perrier Champagne', bottle: '45', size: '375ml' },
        { name: 'Roederer Estate', region: 'Mendocino', bottle: '60' },
      ]
    },
    {
      category: 'Chardonnay', items: [
        { name: 'Mer Soleil Reserve by Caymus', region: 'California, 2022', glass: '15', bottle: '60' },
        { name: 'Neyers Chardonnay', region: 'Sonoma County, 2021', glass: '16', bottle: '64' },
        { name: 'Flowers', region: 'Sonoma Coast, California, 2023', bottle: '96' },
      ]
    },
    {
      category: 'Cabernet Sauvignon', items: [
        { name: 'Smith & Hook', region: 'Central Coast, California', glass: '15', bottle: '60' },
        { name: 'Bonanza by Caymus', region: 'Napa Valley, California', glass: '16', bottle: '62' },
        { name: 'Raymond', region: 'Napa Valley California 2021', glass: '18', bottle: '82' },
        { name: "Stag's Leap 'Artemis'", region: 'Napa Valley, 2021', bottle: '155' },
      ]
    },
    {
      category: 'Pinot Noir', items: [
        { name: 'Four Graces', region: 'Willamette Valley, Oregon 2023', glass: '16', bottle: '59' },
        { name: 'Domaine de L\'Aigle, Gerard Bertrand', region: 'France', glass: '18', bottle: '72' },
        { name: 'Belle Glos Clark & Telephone 2023', bottle: '80' },
        { name: 'Domain Anderson', region: 'Anderson Valley 2020', glass: '19', bottle: '82' },
      ]
    },
  ],
  beerAndMore: [
    {
      type: 'Draught', items: [
        { name: 'Good People Snake Handler IPA', price: '10' },
        { name: 'Truck Stop Honey Brown Ale', price: '7' },
        { name: 'Alabama Brewing Light Lager', price: '6' },
      ]
    },
    {
      type: 'Bottled/Canned Beer', items: [
        { name: 'Coors Light', price: '5' },
        { name: 'Modelo Especial', price: '5' },
        { name: 'Blue Moon', price: '6' },
        { name: 'Yazoo Hefeweizen', price: '7' },
      ]
    },
  ]
};

const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=';
const API_KEY = ""; // Provided by the environment

// Utility for fetching Gemini content with exponential backoff
const fetchGeminiContent = async (prompt, systemInstruction) => {
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    systemInstruction: { parts: [{ text: systemInstruction }] },
    tools: [{ "google_search": {} }],
  };

  for (let i = 0; i < 4; i++) {
    try {
      const response = await fetch(`${API_URL}${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response. Please try again.';
      return text;

    } catch (error) {
      if (i < 3) {
        const delay = Math.pow(2, i) * 1000 + Math.random() * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        console.error("Gemini API call failed after multiple retries:", error);
        return 'The culinary assistant is currently unavailable. Please try again later.';
      }
    }
  }
};


// --- Utility Components ---

const Button = ({ children, primary, onClick, icon: Icon, className = '', disabled = false, type = 'button' }) => {
  const baseStyle = `px-6 py-3 rounded-xl transition-all duration-300 font-semibold uppercase tracking-wider text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold`;
  const primaryStyle = `bg-gold text-secondaryDark hover:bg-opacity-90 disabled:opacity-50`;
  const secondaryStyle = `bg-transparent border-2 border-cream text-cream hover:bg-cream hover:text-secondaryDark disabled:opacity-50`;

  return (
    <button
      onClick={onClick}
      className={`${baseStyle} ${primary ? primaryStyle : secondaryStyle} ${className}`}
      disabled={disabled}
      type={type}
    >
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
};

const Card = ({ children, className = '' }) => (
  <div className={`bg-white/10 backdrop-blur-sm p-8 rounded-xl shadow-2xl transition-all duration-500 ${className}`}>
    {children}
  </div>
);

// --- Header/Navigation Components ---

const DesktopNav = ({ setCurrentView }) => (
  <nav className="hidden lg:flex flex-1 justify-center space-x-10 text-lg font-sans">
    {NAV_LINKS.map(link => (
      <a
        key={link.path}
        href="#"
        onClick={() => setCurrentView(link.path)}
        className={`text-cream relative group transition-colors duration-200 hover:text-gold uppercase tracking-wider`}
      >
        {link.name}
        <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></span>
      </a>
    ))}
  </nav>
);

const MobileNav = ({ isMenuOpen, setIsMenuOpen, setCurrentView }) => (
  <div
    className={`fixed inset-0 z-40 transform transition-transform duration-500 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'
      } bg-secondaryDark text-cream p-8 lg:hidden`}
  >
    <button onClick={() => setIsMenuOpen(false)} className="absolute top-8 right-8 text-cream hover:text-gold">
      <X size={32} />
    </button>
    <nav className="flex flex-col space-y-6 mt-20 text-3xl font-serif">
      {NAV_LINKS.map(link => (
        <a
          key={link.path}
          href="#"
          onClick={() => {
            setCurrentView(link.path);
            setIsMenuOpen(false);
          }}
          className={`hover:text-gold transition-colors duration-200`}
        >
          {link.name}
        </a>
      ))}
    </nav>
  </div>
);

const Header = ({ setCurrentView }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-30 w-full transition-all duration-300 ${isSticky ? `bg-secondaryDark shadow-2xl py-4` : 'py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 className={`text-2xl font-serif font-bold cursor-pointer text-gold`} onClick={() => setCurrentView('home')}>
          <img src={LOGO_URL} alt="Satterfield's Logo" className="h-24 w-auto" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
          <span className="hidden">Satterfield's</span>
        </h1>

        <DesktopNav setCurrentView={setCurrentView} />

        {/* Desktop CTA */}
        <div className="hidden lg:block">
          <Button primary onClick={() => setCurrentView('reservations')} className={`!px-8 !py-2.5 !bg-gold !text-secondaryDark hover:bg-white`}>
            Book a Table
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button className="lg:hidden text-cream" onClick={() => setIsMenuOpen(true)}>
          <Menu size={30} />
        </button>
      </div>
      <MobileNav isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} setCurrentView={setCurrentView} />
    </header>
  );
};

// --- Footer Component ---

const Footer = ({ setCurrentView }) => (
  <footer className={`bg-secondaryDark text-cream mt-20`}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-gray-700 pb-12">
        {/* About */}
        <div>
          <h3 className="text-xl font-serif text-gold mb-4">Satterfield's</h3>
          <p className="text-sm font-sans mb-4 text-gray-400">
            A refined contemporary American restaurant focusing on seasonal, chef-driven cuisine in the heart of Charleston.
          </p>
          <div className="flex space-x-4">
            {['facebook', 'instagram', 'twitter'].map(social => (
              <a key={social} href="#" className="text-gray-500 hover:text-gold transition duration-200">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  {/* Placeholder for social icons */}
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.353c-.572 0-.647.228-.647.925v1.075h2l-.337 2h-1.663v6h-3v-6h-2v-2h2v-1.357c0-2.077 1.258-3.21 3.149-3.21h1.851v3z" />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-serif text-gold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            {NAV_LINKS.filter(l => l.path !== 'home' && l.path !== 'contact').map(link => (
              <li key={link.path}>
                <a onClick={() => setCurrentView(link.path)} className="hover:text-gold transition duration-200 cursor-pointer">{link.name}</a>
              </li>
            ))}
            <li><a href="#" className="hover:text-gold transition duration-200">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-gold transition duration-200">ADA Compliance</a></li>
          </ul>
        </div>

        {/* Contact & Location */}
        <div>
          <h3 className="text-xl font-serif text-gold mb-4">Visit Us</h3>
          <p className="text-sm mb-2 flex items-center gap-2 text-gray-400"><MapPin size={16} />{RESTAURANT_INFO.address}</p>
          <p className="text-sm mb-2 flex items-center gap-2 text-gray-400"><Phone size={16} /><a href={`tel:${RESTAURANT_INFO.phone}`} className="hover:text-gold">{RESTAURANT_INFO.phone}</a></p>
          <p className="text-sm mb-4 flex items-center gap-2 text-gray-400"><Mail size={16} /><a href={`mailto:${RESTAURANT_INFO.email}`} className="hover:text-gold">{RESTAURANT_INFO.email}</a></p>
        </div>

        {/* Newsletter Signup */}
        <div>
          <h3 className="text-xl font-serif text-gold mb-4">Newsletter</h3>
          <p className="text-sm mb-4 text-gray-400">Receive seasonal menu updates and special event invitations.</p>
          <form onSubmit={(e) => { e.preventDefault(); console.log('Newsletter subscribed (placeholder)'); }}>
            <input
              type="email"
              placeholder="Your email address"
              required
              className="w-full p-3 bg-gray-700 text-white rounded-md mb-3 border-none focus:ring-1 focus:ring-gold"
            />
            <Button primary className="w-full !text-xs !py-3 !bg-gold !text-[${COLORS.secondaryDark}]">Subscribe</Button>
          </form>
        </div>
      </div>
      <div className="text-center text-xs text-gray-500 pt-8">
        &copy; {new Date().getFullYear()} Satterfield's Restaurant. All Rights Reserved.
      </div>
    </div>
  </footer>
);

// --- Page Components ---

const Home = ({ setCurrentView }) => (
  <section className={`text-cream bg-primaryDark`}>
    {/* Hero Section */}
    <div className="relative h-[90vh] flex items-center justify-center overflow-hidden">
      <img
        src={HERO_IMAGE_URL}
        alt="Satterfield's Restaurant Exterior"
        className="absolute inset-0 w-full h-full object-cover opacity-60 transition-opacity duration-1000"
        loading="eager"
      />
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="relative z-10 text-center p-6 backdrop-blur-sm max-w-5xl mx-auto animate-slide-up">
        <p className="text-xl md:text-2xl font-sans text-gray-200 mb-2 uppercase tracking-widest">
          A Charleston Classic, Reimagined
        </p>
        <h2 className="text-5xl md:text-8xl font-serif font-light text-cream tracking-wider leading-tight">
          Savor the Season. Elevated.
        </h2>
        <p className="text-lg md:text-xl font-sans text-gray-300 mt-6 max-w-3xl mx-auto animate-fade-in delay-200">
          Experience chef-driven contemporary American cuisine, guided by the best of the Southern season.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-12 animate-fade-in delay-400">
          <Button primary onClick={() => setCurrentView('reservations')} className="sm:w-auto !bg-gold !text-[${COLORS.secondaryDark}] hover:bg-white">
            Book a Table
          </Button>
          <Button onClick={() => setCurrentView('menu-dinner')} className="sm:w-auto border-2 border-cream text-cream hover:bg-cream hover:text-secondaryDark">
            View Menus
          </Button>
        </div>
      </div>
    </div>

    {/* Intro Paragraph & Dining Room */}
    <div className="grid grid-cols-1 lg:grid-cols-2 max-w-7xl mx-auto py-24 px-4 gap-12 items-center">
      <div className="lg:pr-10 animate-slide-in-left">
        <h3 className="text-4xl font-serif text-gold mb-6">The Art of the Meal</h3>
        <p className="text-xl font-sans leading-relaxed text-gray-300">
          At Satterfield's, every plate is a dedication to quality. Our kitchen, led by Chef Julianne Satterfield, fuses high-quality, seasonal ingredients with timeless Southern culinary traditions, transforming familiar flavors into elegant, unexpected experiences.
        </p>
        <p className="text-xl font-sans leading-relaxed text-gray-300 mt-4">
          We invite you to step into our warm, intimate dining room—a space designed for conversation and connection. It’s here that our passion for food and hospitality truly shines.
        </p>
        <Button onClick={() => setCurrentView('about')} className="mt-8 !bg-transparent border-2 border-gold text-gold hover:bg-gold hover:text-secondaryDark">
          Meet the Chef <ChevronRight size={18} />
        </Button>
      </div>
      <div className="animate-slide-in-right">
        <img
          src={DINING_ROOM_IMAGE_URL}
          alt="Intimate, deep-red dining room interior with white tablecloths"
          className="w-full h-auto rounded-xl shadow-2xl transition-all duration-500 hover:scale-[1.01] object-cover"
          loading="lazy"
        />
      </div>
    </div>

    {/* Highlights / Quick Links Block */}
    <div className="bg-secondaryDark py-20 px-4">
      <h3 className="text-center text-4xl font-serif mb-12 text-gold">Experience Satterfield's</h3>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Highlight 1: Hours */}
        <Card className="hover:bg-white/20 transform hover:scale-[1.03] animate-fade-in delay-200">
          <Clock size={40} className={`mx-auto mb-4 text-gold`} />
          <h4 className="text-2xl font-serif text-cream font-semibold mb-2 text-center">Dinner Service</h4>
          <p className="text-center text-sm text-gray-400">Tues - Sat, 5:00 PM - 10:00 PM</p>
          <p className="text-center text-sm text-gray-400">Sat, 4:30 PM - 11:00 PM</p>
          <a onClick={() => setCurrentView('contact')} className="block text-center text-sm mt-3 text-gold hover:underline cursor-pointer">View All Hours</a>
        </Card>

        {/* Highlight 2: Catering */}
        <Card className="hover:bg-white/20 transform hover:scale-[1.03] animate-fade-in delay-400">
          <Package size={40} className={`mx-auto mb-4 text-gold`} />
          <h4 className="text-2xl font-serif text-cream font-semibold mb-2 text-center">Lunch & Catering</h4>
          <p className="text-center text-sm text-gray-400">Pick-up and delivery options available for groups of 10+.</p>
          <a onClick={() => setCurrentView('contact')} className="block text-center text-sm mt-3 text-gold hover:underline cursor-pointer">Inquire Now</a>
        </Card>

        {/* Highlight 3: Location */}
        <Card className="hover:bg-white/20 transform hover:scale-[1.03] animate-fade-in delay-600">
          <MapPin size={40} className={`mx-auto mb-4 text-gold`} />
          <h4 className="text-2xl font-serif text-cream font-semibold mb-2 text-center">Our Location</h4>
          <p className="text-center text-sm text-gray-400">{RESTAURANT_INFO.address}</p>
          <a onClick={() => setCurrentView('contact')} className="block text-center text-sm mt-3 text-gold hover:underline cursor-pointer">Get Directions</a>
        </Card>
      </div>
    </div>
  </section>
);


// --- New Menu Component ---

const MenuLayout = ({ data, type, setCurrentView }) => {
  const [activeCategory, setActiveCategory] = useState(data[0]?.category || '');
  const [pairingSuggestions, setPairingSuggestions] = useState({});
  const [loadingDish, setLoadingDish] = useState(null);

  const handleSuggestPairing = async (dishName, dishDesc) => {
    setPairingSuggestions(prev => ({ ...prev, [dishName]: '' }));
    setLoadingDish(dishName);

    const systemPrompt = `You are the Sommelier for Satterfield's, an upscale contemporary American restaurant. Provide a concise, elegant, one-paragraph suggestion for a fine wine or artisanal cocktail pairing for the given dish. Focus on complementing the key flavors and maintaining an upscale tone.`;
    const userPrompt = `Suggest a pairing for the dish: "${dishName}" with description: "${dishDesc}".`;

    const result = await fetchGeminiContent(userPrompt, systemPrompt);

    setPairingSuggestions(prev => ({ ...prev, [dishName]: result }));
    setLoadingDish(null);
  };

  const isDinner = type === 'dinner';
  const isDessert = type === 'dessert';

  return (
    <div className="max-w-6xl mx-auto py-16 px-4 text-cream">
      <h2 className="text-5xl md:text-6xl font-serif text-center mb-4 text-gold">
        {isDinner ? 'Dinner & Dessert' : 'Wine, Cocktails & Beer'}
      </h2>
      <p className="text-center text-lg mb-12 max-w-3xl mx-auto text-gray-300">
        {isDinner ? 'Our current seasonal offerings, refined and chef-driven.' : 'A thoughtfully curated beverage list to complement your meal.'}
      </p>

      {/* Category Tabs */}
      <div className={`sticky top-20 z-20 bg-secondaryDark shadow-lg rounded-xl p-4 mb-12`}>
        <div className="flex flex-wrap justify-center gap-4">
          {data.map(data => (
            <button
              key={data.category}
              onClick={() => setActiveCategory(data.category)}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 text-sm uppercase tracking-wider ${activeCategory === data.category
                ? `bg-gold text-[${COLORS.secondaryDark}] shadow-md`
                : `bg-gray-700 text-gray-300 hover:bg-gray-600`
                }`}
            >
              {data.category}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Sections */}
      {data.map((categoryData) => (
        <div
          key={categoryData.category}
          id={`menu-${categoryData.category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
          className={`pt-12 transition-opacity duration-500 ${activeCategory === categoryData.category ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}
          style={{ display: activeCategory === categoryData.category ? 'block' : 'none' }}
        >
          <h3 className="text-4xl font-serif font-light border-b border-gold pb-2 mb-8 text-cream">
            {categoryData.category}
          </h3>

          <div className="space-y-10">
            {categoryData.items.map((item, index) => (
              <div key={index} className="flex flex-col md:flex-row items-start md:gap-8 border-b border-gray-700 pb-6 group hover:shadow-lg hover:border-gold p-2 -m-2 rounded-lg transition-all duration-300">

                <div className="flex-1">
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="text-xl font-serif font-semibold text-gold group-hover:text-white transition-colors duration-300">{item.name}</h4>
                    <span className={`text-xl font-sans font-medium text-cream`}>
                      {isDinner || isDessert ? `$${item.price}` : (item.bottle ? (item.glass ? `$${item.glass} / $${item.bottle}` : `$${item.bottle}`) : `$${item.price}`)}
                    </span>
                  </div>

                  {/* Description/Notes/Region */}
                  <p className="text-gray-400 text-sm italic">{item.desc || item.region || (item.size ? `(${item.size})` : null)}</p>

                  {/* Gemini Pairing Button */}
                  {isDinner && item.signature && (
                    <div className="mt-4">
                      <Button
                        onClick={() => handleSuggestPairing(item.name, item.desc)}
                        className={`!text-xs !py-1.5 ${loadingDish === item.name ? 'opacity-70 cursor-not-allowed' : ''}`}
                        primary={false}
                        icon={Utensils}
                        disabled={loadingDish === item.name}
                      >
                        {loadingDish === item.name ? 'Generating...' : '✨ Sommelier Pairing'}
                      </Button>

                      {pairingSuggestions[item.name] && (
                        <div className="mt-3 p-4 bg-white/10 rounded-lg border-l-4 border-gold shadow-inner transition-all duration-300">
                          <h5 className="font-semibold text-sm mb-1 text-gold">Sommelier's Recommendation:</h5>
                          <p className="text-sm italic whitespace-pre-wrap text-gray-300">{pairingSuggestions[item.name]}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const DinnerMenuPage = (props) => (
  <div className={`bg-primaryDark`}>
    <MenuLayout data={[...DINNER_MENU_DATA, ...DESSERT_MENU_DATA]} type="dinner" {...props} />
    {/* Persistent CTA block */}
    <div className={`mt-20 p-6 bg-secondaryDark rounded-t-xl flex flex-col sm:flex-row justify-center gap-4 max-w-6xl mx-auto`}>
      <Button primary onClick={() => props.setCurrentView('reservations')} className="!bg-gold !text-[${COLORS.secondaryDark}]">Book Your Experience</Button>
      <Button onClick={() => props.setCurrentView('order')} className="!bg-transparent border-2 border-gray-600 !text-cream hover:!bg-gray-600">Explore Catering</Button>
    </div>
  </div>
);

const DrinksMenuPage = (props) => {
  const combinedData = [
    { category: 'Specialty Cocktails', items: COCKTAIL_WINE_DATA.cocktails },
    {
      category: 'Beers & Ciders', items: [
        ...COCKTAIL_WINE_DATA.beerAndMore[0].items.map(i => ({ ...i, desc: 'Draught' })),
        ...COCKTAIL_WINE_DATA.beerAndMore[1].items.map(i => ({ ...i, desc: 'Bottled/Canned' })),
      ]
    },
    ...COCKTAIL_WINE_DATA.wineSections
  ];

  return (
    <div className={`bg-primaryDark`}>
      <MenuLayout data={combinedData} type="drinks" {...props} />
    </div>
  );
};


const ReservationsPage = ({ setCurrentView }) => (
  <section className={`max-w-4xl mx-auto py-16 px-4 text-center bg-primaryDark text-cream`}>
    <h2 className="text-5xl md:text-6xl font-serif mb-4 text-gold animate-slide-in-top">Plan Your Visit</h2>
    <p className="text-lg mb-16 max-w-3xl mx-auto text-gray-300 animate-fade-in delay-200">
      We look forward to welcoming you. Secure your table or place an order for convenient pickup.
    </p>

    {/* Booking Widget Placeholder */}
    <Card className="p-8 md:p-16 mb-12 border-4 border-gold animate-slide-in-left">
      <h3 className="text-3xl font-serif mb-6 flex items-center justify-center gap-3">
        <Calendar size={28} className='text-gold' /> Book a Table
      </h3>
      <p className="mb-8 text-gray-400">
        We utilize OpenTable for all reservations. Please select your desired date, time, and party size below.
      </p>
      <div className="h-64 flex items-center justify-center bg-white/5 border border-dashed border-gray-600 rounded-lg">
        <p className="text-gray-500 italic">
          [Placeholder for Embedded OpenTable or Resy Widget]
        </p>
      </div>
      <Button primary onClick={() => window.open('https://www.opentable.com', '_blank')} className="mt-8 w-full sm:w-auto !bg-gold !text-[${COLORS.secondaryDark}]">
        Go to External Booking Site
      </Button>
    </Card>

    {/* Online Ordering */}
    <Card className="p-8 md:p-16 bg-white/5 animate-slide-in-right">
      <h3 className="text-3xl font-serif mb-6 flex items-center justify-center gap-3">
        <ShoppingBag size={28} className='text-gold' /> Online Ordering
      </h3>
      <p className="mb-8 text-gray-400">
        Enjoy Satterfield's refined cuisine in the comfort of your home. Orders available for pickup starting at 5:00 PM daily.
      </p>
      <Button
        onClick={() => window.open('https://www.toasttab.com', '_blank')}
        className="w-full sm:w-auto !bg-secondaryDark !text-cream hover:!bg-gold hover:!text-[${COLORS.secondaryDark}]"
      >
        Start Your Online Order
      </Button>
    </Card>
  </section>
);

const AboutPage = () => (
  <section className={`max-w-6xl mx-auto py-16 px-4 bg-primaryDark text-cream`}>
    <h2 className="text-5xl md:text-6xl font-serif text-center mb-4 text-gold animate-slide-in-top">Our Story, Our Craft</h2>
    <p className="text-center text-lg mb-12 max-w-3xl mx-auto text-gray-300 animate-fade-in delay-200">
      Where Southern heritage meets modern culinary innovation.
    </p>

    {/* Chef Julianne */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20 animate-slide-in-left">
      <img
        src="https://placehold.co/800x800/1a1a1a/d4af37?text=Chef+Julianne+Satterfield"
        alt="Portrait of Chef Julianne Satterfield"
        loading="lazy"
        className="w-full h-auto rounded-xl shadow-2xl object-cover transition-transform duration-500 hover:scale-[1.02]"
      />
      <div className='lg:pl-8'>
        <h3 className="text-4xl font-serif mb-4 border-b border-gold pb-2 text-gold">The Vision of Chef Julianne</h3>
        <p className="text-lg font-sans leading-relaxed mb-6 text-gray-300">
          Satterfield’s is the lifelong dream of Chef Julianne Satterfield, a Charleston native who trained in Michelin-starred kitchens across the globe before returning home. Her philosophy is simple: source the best ingredients and let them shine, honoring the rich, complex flavors of the South through refined, modern techniques.
        </p>
        <p className="text-md italic text-gray-400">
          "The most honest dish is the one that tastes exactly like the place it comes from." - Chef Julianne
        </p>
      </div>
    </div>

    {/* The Space */}
    <div className="mb-20 animate-slide-in-right">
      <h3 className="text-4xl font-serif text-center mb-10 text-gold">The Setting</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <img
          src={DINING_ROOM_IMAGE_URL}
          alt="Elegant dining room interior"
          loading="lazy"
          className="w-full h-full object-cover rounded-xl shadow-xl transition-transform duration-500 hover:scale-[1.02]"
        />
        <img
          src="https://placehold.co/1000x750/d4af37/1a1a1a?text=Bar+Area+Detail"
          alt="Detail of the sophisticated bar area"
          loading="lazy"
          className="w-full h-full object-cover rounded-xl shadow-xl transition-transform duration-500 hover:scale-[1.02]"
        />
      </div>
      <p className="mt-8 text-center max-w-4xl mx-auto text-gray-300">
        Designed by local artisans, the space reflects our cuisine—warm, sophisticated, and deeply rooted in Southern craftsmanship. It’s an intimate setting perfect for both special occasions and an elevated weeknight meal.
      </p>
    </div>
  </section>
);

const LocationContactPage = () => {
  const [eventDetails, setEventDetails] = useState({ type: '', size: '', date: '', needs: '' });
  const [draftEmail, setDraftEmail] = useState('');
  const [loadingDraft, setLoadingDraft] = useState(false);

  const handleDraftEmail = async () => {
    setLoadingDraft(true);
    setDraftEmail('');

    const systemPrompt = `You are the Private Events Coordinator for Satterfield's. Draft a professional, warm, and concise email inquiry to the restaurant team based on the user's event details. The draft should be ready to copy-paste, including a professional subject line.`;
    const userPrompt = `Draft an inquiry email for a private event with the following details: Event Type: ${eventDetails.type || 'Not specified'}, Guest Count: ${eventDetails.size || 'Not specified'}, Preferred Date: ${eventDetails.date || 'Not specified'}, Specific Needs: ${eventDetails.needs || 'None specified'}. Start the email with a Subject line.`;

    const result = await fetchGeminiContent(userPrompt, systemPrompt);

    setDraftEmail(result);
    setLoadingDraft(false);
  };

  const handleChange = (e) => {
    setEventDetails({ ...eventDetails, [e.target.name]: e.target.value });
  };

  const isFormValid = eventDetails.type.length > 0 && eventDetails.size.length > 0 && eventDetails.date.length > 0;

  return (
    <section className={`max-w-6xl mx-auto py-16 px-4 bg-primaryDark text-cream`}>
      <h2 className="text-5xl md:text-6xl font-serif text-center mb-4 text-gold animate-slide-in-top">Location & Contact</h2>
      <p className="text-center text-lg mb-16 max-w-3xl mx-auto text-gray-300 animate-fade-in delay-200">
        Find us in the historic heart of downtown Charleston.
      </p>

      {/* Map Embed Placeholder */}
      <div className="h-96 w-full rounded-xl overflow-hidden shadow-2xl mb-16 animate-slide-in-left">
        <iframe
          title="Google Map Location of Satterfield's"
          width="100%"
          height="100%"
          loading="lazy"
          allowFullScreen
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3345.56844883377!2d-79.932028!3d32.782071!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88fbbb7138090333%3A0xc621b4421689104!2sCharleston%2C%20SC!5e0!3m2!1sen!2sus!4v1680000000000!5m2!1sen!2sus"
        ></iframe>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Contact Info */}
        <Card className="lg:col-span-2 p-8 bg-white/5 animate-slide-in-left">
          <h3 className="text-3xl font-serif mb-4 border-b border-gold pb-2 text-gold">Reach Out</h3>
          <div className="space-y-4 text-lg">
            <p className="flex items-center gap-3 text-gray-300"><MapPin size={24} className='text-gold' /> <strong>Address:</strong> {RESTAURANT_INFO.address}</p>
            <p className="flex items-center gap-3 text-gray-300"><Phone size={24} className='text-gold' /> <strong>Phone:</strong> <a href={`tel:${RESTAURANT_INFO.phone}`} className="hover:text-gold">{RESTAURANT_INFO.phone}</a> (Click to call)</p>
            <p className="flex items-center gap-3 text-gray-300"><Mail size={24} className='text-gold' /> <strong>Email:</strong> <a href={`mailto:${RESTAURANT_INFO.email}`} className="hover:text-gold">{RESTAURANT_INFO.email}</a></p>
          </div>
          <p className="mt-8 text-sm text-gray-400">
            * For press inquiries or private event booking, please email Chef Julianne directly.
          </p>
        </Card>

        {/* Hours */}
        <Card className="p-8 bg-white/5 animate-slide-in-right">
          <h3 className="text-3xl font-serif mb-4 border-b border-gold pb-2 text-gold">Hours of Operation</h3>
          <ul className="space-y-2">
            {RESTAURANT_INFO.hours.map((item, index) => (
              <li key={index} className="flex justify-between border-b border-gray-700 pb-1 text-md text-gray-300">
                <span className="font-semibold">{item.day}</span>
                <span className="text-gray-400">{item.time}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm italic text-gold">
            Holiday hours may vary. Please check our reservation system for holiday availability.
          </p>
        </Card>
      </div>

      {/* Private Event Inquiry Draft Feature */}
      <Card className="lg:col-span-3 p-8 mt-12 bg-white/5 animate-slide-in-bottom">
        <h3 className="text-3xl font-serif mb-6 flex items-center gap-3 text-gold">
          <Send size={28} className='text-gold' /> Private Event Inquiry Draft
        </h3>
        <p className="text-gray-300 mb-6">
          Provide your event basics, and our assistant will draft a polished, ready-to-send email for your booking inquiry.
        </p>

        {/* Form Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <input
            type="text"
            name="type"
            placeholder="Event Type (e.g., Anniversary Dinner)"
            value={eventDetails.type}
            onChange={handleChange}
            className="p-3 border border-gray-600 rounded-lg bg-gray-800 text-white focus:ring-gold focus:border-gold"
            required
          />
          <input
            type="number"
            name="size"
            placeholder="Guest Count (e.e., 45 guests)"
            value={eventDetails.size}
            onChange={handleChange}
            className="p-3 border border-gray-600 rounded-lg bg-gray-800 text-white focus:ring-gold focus:border-gold"
            required
          />
          <input
            type="date"
            name="date"
            placeholder="Preferred Date"
            value={eventDetails.date}
            onChange={handleChange}
            className="p-3 border border-gray-600 rounded-lg bg-gray-800 text-white focus:ring-gold focus:border-gold"
            required
          />
        </div>
        <textarea
          name="needs"
          placeholder="Specific requirements (e.g., wine tasting, vegetarian options, seating preferences)"
          value={eventDetails.needs}
          onChange={handleChange}
          rows="3"
          className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800 text-white focus:ring-gold focus:border-gold mb-6"
        />

        <Button
          onClick={handleDraftEmail}
          primary
          icon={Send}
          disabled={loadingDraft || !isFormValid}
          className="!bg-gold !text-[${COLORS.secondaryDark}] hover:bg-white"
        >
          {loadingDraft ? 'Drafting Email...' : '✨ Draft Inquiry Email'}
        </Button>

        {draftEmail && (
          <div className="mt-8 p-6 bg-white/10 rounded-xl border-l-4 border-gold shadow-inner">
            <h4 className="text-lg font-semibold mb-2 text-gold">Your Draft is Ready:</h4>
            <pre className="text-sm bg-gray-800 text-gray-200 p-4 rounded-lg overflow-auto border border-gray-600 whitespace-pre-wrap">
              {draftEmail}
            </pre>
            <p className="mt-3 text-sm italic text-gray-400">
              *Copy this text and send it to {RESTAURANT_INFO.email}
            </p>
          </div>
        )}
      </Card>
    </section>
  );
};


// --- Mobile Sticky CTA (Unchanged) ---

const MobileStickyCTA = ({ setCurrentView }) => (
  <div className={`fixed bottom-0 left-0 w-full z-50 bg-secondaryDark shadow-2xl border-t border-gold lg:hidden`}>
    <div className="flex justify-around p-3">
      {[
        { name: 'Reserve', path: 'reservations', icon: Calendar },
        { name: 'Menu', path: 'menu-dinner', icon: Utensils },
        { name: 'Order', path: 'order', icon: ShoppingBag },
      ].map(item => (
        <button
          key={item.path}
          onClick={() => setCurrentView(item.path)}
          className={`flex flex-col items-center text-xs font-semibold uppercase tracking-wider text-cream hover:text-gold transition-colors`}
        >
          <item.icon size={22} className="mb-1" />
          {item.name}
        </button>
      ))}
    </div>
  </div>
);

// --- Main App Component ---

const Satterfields = () => {
  const [currentView, setCurrentView] = useState('home');
  const [isMobile, setIsMobile] = useState(false);

  // Simple state machine for routing
  const renderPage = useCallback(() => {
    switch (currentView) {
      case 'home':
        return <Home setCurrentView={setCurrentView} />;
      case 'menu-dinner':
        return <DinnerMenuPage setCurrentView={setCurrentView} />;
      case 'menu-drinks':
        return <DrinksMenuPage setCurrentView={setCurrentView} />;
      case 'reservations':
      case 'order':
        return <ReservationsPage setCurrentView={setCurrentView} />;
      case 'about':
        return <AboutPage setCurrentView={setCurrentView} />;
      case 'contact':
        return <LocationContactPage setCurrentView={setCurrentView} />;
      default:
        return <Home setCurrentView={setCurrentView} />;
    }
  }, [currentView]);

  useEffect(() => {
    // Scroll to top on view change
    window.scrollTo(0, 0);

    // Update mobile status for sticky CTA
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // Tailwind's lg breakpoint
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [currentView]);

  return (
    <div className={`min-h-screen font-sans bg-primaryDark text-cream`}>
      {/* Schema Markup for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "http://schema.org",
            "@type": "Restaurant",
            "name": "Satterfield's Restaurant",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "420 King St",
              "addressLocality": "Charleston",
              "addressRegion": "SC",
              "postalCode": "29403"
            },
            "telephone": RESTAURANT_INFO.phone,
            "servesCuisine": "Contemporary American, Southern",
            "priceRange": "$$$$",
            "url": "https://www.satterfields.com",
            "hasMenu": { "@type": "Menu" }
          })
        }}
      />
      {/* End Schema Markup */}

      {/* Main Layout */}
      <Header setCurrentView={setCurrentView} />

      <main className="pb-20 lg:pb-0">
        {renderPage()}
      </main>

      <Footer setCurrentView={setCurrentView} />

      {isMobile && <MobileStickyCTA setCurrentView={setCurrentView} />}

      {/* Global Styles for Tailwind, Font, and Animations */}
      <style>{`
        /* Load Playfair Display for Serifs */
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
        
        .font-serif {
          font-family: 'Playfair Display', Georgia, serif;
        }

        /* Inter is the default font-sans, ensuring readability */
        .font-sans {
          font-family: 'Inter', sans-serif;
        }

        /* Custom Animations */
        .animate-slide-up {
            animation: slideUp 1s ease-out forwards;
        }
        @keyframes slideUp {
            from { opacity: 0; transform: translateY(40px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-in {
            animation: fadeIn 1.5s ease-out forwards;
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .animate-slide-in-left {
            animation: slideInLeft 0.8s ease-out forwards;
        }
        @keyframes slideInLeft {
            from { opacity: 0; transform: translateX(-50px); }
            to { opacity: 1; transform: translateX(0); }
        }

        .animate-slide-in-right {
            animation: slideInRight 0.8s ease-out forwards;
        }
        @keyframes slideInRight {
            from { opacity: 0; transform: translateX(50px); }
            to { opacity: 1; transform: translateX(0); }
        }

        .delay-200 { animation-delay: 0.2s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-600 { animation-delay: 0.6s; }

      `}</style>
    </div>
  );
};

export default Satterfields;