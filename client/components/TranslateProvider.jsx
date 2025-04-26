"use client";
import { useEffect, useState } from "react";
import { SelectPicker } from "rsuite";
import { getCookie, hasCookie, setCookie, deleteCookie } from 'cookies-next';

const languageMap = {
  'English': '/auto/en',
  'Hindi': '/auto/hi',
  'Marathi': '/auto/mr',
  'Telugu': '/auto/te',
  'Kannada': '/auto/kn',
  'Gujarati': '/auto/gu',
  'Punjabi': '/auto/pa'
};

// Convert languageMap to the format needed for SelectPicker
const languages = Object.entries(languageMap).map(([label, value]) => ({
    label,
    value
}));

const TranslateProvider = ({ children }) => {
    const [selected, setSelected] = useState(null);
    const [scriptLoaded, setScriptLoaded] = useState(false);
    
    useEffect(() => {
        // Initialize with current cookie value or default to English
        if(hasCookie('googtrans')){
            setSelected(getCookie('googtrans'))
        }
        else{
            setSelected('/auto/en')
        }
        
        // Check if script is already loaded
        if (!scriptLoaded && !window.google?.translate) {
            const addScript = document.createElement('script');
            addScript.setAttribute('src', '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit');
            addScript.onload = () => {
                console.log("Google Translate script loaded");
                setScriptLoaded(true);
            };
            addScript.onerror = () => {
                console.error("Failed to load Google Translate script");
            };
            document.body.appendChild(addScript);
            
            // Define the callback function for Google Translate
            window.googleTranslateElementInit = () => {
                try {
                    new window.google.translate.TranslateElement({
                        pageLanguage: 'auto',
                        autoDisplay: false,
                        includedLanguages: "hi,en,mr,te,kn,gu,pa", // Updated to include all supported languages
                        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
                    }, 'google_translate_element');
                    console.log("Google Translate element initialized");
                } catch (err) {
                    console.error("Error initializing Google Translate:", err);
                }
            };
        }
    }, [scriptLoaded]);

    const langChange = (e, _, evt) => {
        if (!e) return;
        
        console.log("Language changed to:", e);
        evt.preventDefault();
        
        try {
            // For English, remove the cookie to show original content
            if (e === '/auto/en') {
                deleteCookie('googtrans', { path: '/', domain: window.location.hostname });
                deleteCookie('googtrans', { path: '/' });
                
                // Also try to expire the cookie
                document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname;
                document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                
                setSelected(e);
            } else {
                // For other languages, set the cookie as before
                const cookieOptions = { 
                    path: '/',
                    domain: window.location.hostname
                };
                
                setCookie('googtrans', decodeURI(e), cookieOptions);
                setSelected(e);
                
                document.cookie = `googtrans=${encodeURIComponent(e)}; path=/; domain=${window.location.hostname}`;
                document.cookie = `googtrans=${encodeURIComponent(e)}; path=/`;
            }
            
            // Force reload to apply changes
            window.location.reload();
        } catch (err) {
            console.error("Error setting language cookie:", err);
        }
    }

    return (
        <>            
            {children}
        </>
    );
};

export default TranslateProvider;