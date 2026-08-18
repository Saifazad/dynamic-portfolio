import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};

// Map of user-friendly names to actual CSS font-family definitions and import URLs
export const FONT_OPTIONS = [
  { name: 'Inter', family: "'Inter', sans-serif", url: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap' },
  { name: 'Outfit', family: "'Outfit', sans-serif", url: 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap' },
  { name: 'Playfair Display', family: "'Playfair Display', serif", url: 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap' },
  { name: 'Fira Code', family: "'Fira Code', monospace", url: 'https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600;700&display=swap' },
  { name: 'Plus Jakarta Sans', family: "'Plus Jakarta Sans', sans-serif", url: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap' }
];

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState({
    hero_title: "Hi, I'm Saif. I Build Dynamic Full-Stack Applications.",
    hero_subtitle: "A passionate developer specialized in React, Node.js, and Cloud Infrastructure.",
    primary_color: '#6366f1',
    font_family: 'Inter',
    enable_animations: true,
    profile_tag_1: 'React',
    profile_tag_2: 'Node.js',
    profile_tag_3: 'Full-Stack',
    profile_tag_4: 'Supabase'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Apply visual settings dynamically to document root and load web fonts
  useEffect(() => {
    if (!theme) return;

    // Apply primary color
    document.documentElement.style.setProperty('--primary-color', theme.primary_color);

    // Apply font-family and inject Google Font link dynamically
    const selectedFont = FONT_OPTIONS.find(f => f.name === theme.font_family) || FONT_OPTIONS[0];
    document.documentElement.style.setProperty('--font-family', selectedFont.family);

    // Dynamically inject font stylesheet if not already added
    const linkId = `google-font-${selectedFont.name.replace(/\s+/g, '-').toLowerCase()}`;
    if (!document.getElementById(linkId)) {
      const link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      link.href = selectedFont.url;
      document.head.appendChild(link);
    }
  }, [theme.primary_color, theme.font_family]);

  const updateThemeOptimistic = (updatedFields) => {
    setTheme(prev => ({
      ...prev,
      ...updatedFields
    }));
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      setTheme, 
      updateThemeOptimistic, 
      isLoading, 
      setIsLoading, 
      error, 
      setError 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
