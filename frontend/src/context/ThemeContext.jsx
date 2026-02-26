import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error("useTheme must be used within ThemeProvider");
    return context;
};

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) return storedTheme;
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
        return 'light';
    });

    const [accent, setAccent] = useState(() => {
        return localStorage.getItem('theme-accent') || 'indigo';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    useEffect(() => {
        const root = window.document.documentElement;
        // Remove all theme classes first
        root.classList.remove('theme-indigo', 'theme-emerald', 'theme-rose', 'theme-amber');
        // Add new class if not indigo (default is on :root so no class needed)
        if (accent && accent !== 'indigo') {
            root.classList.add(`theme-${accent}`);
        }
        localStorage.setItem('theme-accent', accent);
    }, [accent]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, accent, setAccent }}>
            {children}
        </ThemeContext.Provider>
    );
};
