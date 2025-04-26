"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import '@/styles/auth.css';
import '@/styles/agro.css';
import Image from 'next/image';
import registerAction from '@/actions/register';
import { useRouter } from "next/navigation";
import { getCookie, setCookie, deleteCookie } from 'cookies-next';

const RegisterPage = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    language_preference: '',
    phone: '',
    username: '',
    password: '',
    roles: '',
    description: '',
    address: '',
    latitude: 12.971598,
    longitude: 77.594566,
  });
  const [errors, setErrors] = useState({});

  // Map of languages to Google Translate codes
  const languageMap = {
    'English': '/auto/en',
    'Hindi': '/auto/hi',
    'Marathi': '/auto/mr',
    'Telugu': '/auto/te',
    'Kannada': '/auto/kn',
    'Gujarati': '/auto/gu',
    'Punjabi': '/auto/pa'
  };

  // Load language preference from localStorage on component mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('languagePreference');
    if (savedLanguage) {
      setFormData(prev => ({
        ...prev,
        language_preference: savedLanguage
      }));
      
      // Apply the language translation based on saved preference
      if (savedLanguage === 'English') {
        deleteCookie('googtrans', { path: '/', domain: window.location.hostname });
        deleteCookie('googtrans', { path: '/' });
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname;
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      } else if (languageMap[savedLanguage]) {
        const cookieOptions = { path: '/', domain: window.location.hostname };
        setCookie('googtrans', decodeURI(languageMap[savedLanguage]), cookieOptions);
        document.cookie = `googtrans=${encodeURIComponent(languageMap[savedLanguage])}; path=/; domain=${window.location.hostname}`;
        document.cookie = `googtrans=${encodeURIComponent(languageMap[savedLanguage])}; path=/`;
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateStep = () => {
    const newErrors = {};
    if (step === 1 && !formData.language_preference) newErrors.language_preference = 'Language is required';
    if (step === 2) {
      if (!formData.phone) newErrors.phone = 'Phone number is required';
      if (!formData.username) newErrors.username = 'Username is required';
      if (!formData.password) newErrors.password = 'Password is required';
      else if (formData.password.length < 8) 
        newErrors.password = 'Password must be at least 8 characters';
    }
    if (step === 3) {
      if (!formData.roles) newErrors.roles = 'Role is required';
      if (!formData.description) newErrors.description = 'This field is required';
    }
    if (step === 4 && !formData.address) newErrors.address = 'Location is required';
    return newErrors;
  };

  const handleNext = (e) => {
    e.preventDefault();
    const newErrors = validateStep();
    if (Object.keys(newErrors).length === 0) {
      setErrors({});
      setStep(step + 1);
    } else {
      setErrors(newErrors);
    }
  };

  const handleBack = (e) => {
    e.preventDefault();
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateStep();
    if (Object.keys(newErrors).length === 0) {
      setErrors({});
      try {
        let response = await registerAction({
          phone: formData.phone,
          username: formData.username,
          password: formData.password,
          language_preference: formData.language_preference,
          roles: formData.roles,
          description: formData.description,
          address: formData.address,
          latitude: formData.latitude, // Use latitude from formData
          longitude: formData.longitude, // Use longitude from formData
        });
        if (response.success) {
          // router.push('/dashboard');
          console.log('Registration successful:', response);
          router.push("/dashboard");
        } else {
          console.log('Registration failed');
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
      <div className="auth-image">
          <Image
              src="/images/plant-illustration.webp"
              alt="Growing plant illustration"
              width={300}
              height={300}
              priority
              className="w-auto h-auto"
          />
      </div>
        <div className="auth-form">
          <h1>Join GrowGuide</h1>
          <p className="subtitle">Create an account and start your plant journey</p>
          
          <form onSubmit={step === 4 ? handleSubmit : handleNext}>
            {step === 1 && (
              <div className="form-group">
                <label>Preferred Language</label>
                <div className="language-buttons">
                  {['English', 'Hindi', 'Marathi', 'Telugu', 'Kannada', 'Gujarati', 'Punjabi'].map((lang) => (
                    <button
                      type="button"
                      key={lang}
                      className={`language-button ${formData.language_preference === lang ? 'selected' : ''}`}
                      onClick={() => {
                        handleChange({ target: { name: 'language_preference', value: lang } });
                        
                        // Save language preference to localStorage
                        localStorage.setItem('languagePreference', lang);
                        
                        // For English, remove the cookie to show original content
                        if (lang === 'English') {
                          deleteCookie('googtrans', { path: '/', domain: window.location.hostname });
                          deleteCookie('googtrans', { path: '/' });
                          
                          // Also try to expire the cookie
                          document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname;
                          document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                        } 
                        // For other languages, set the cookie as before
                        else if (languageMap[lang]) {
                          const cookieOptions = { 
                            path: '/',
                            domain: window.location.hostname
                          };
                          
                          setCookie('googtrans', decodeURI(languageMap[lang]), cookieOptions);
                          
                          document.cookie = `googtrans=${encodeURIComponent(languageMap[lang])}; path=/; domain=${window.location.hostname}`;
                          document.cookie = `googtrans=${encodeURIComponent(languageMap[lang])}; path=/`;
                        }
                        
                        // Reload page to apply translation changes
                        window.location.reload();
                      }}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
                {errors.language_preference && <p className="error-text">{errors.language_preference}</p>}
              </div>
            )}

            {step === 2 && (
              <>
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    placeholder="Your phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    className={errors.phone ? 'error' : ''}
                  />
                  {errors.phone && <p className="error-text">{errors.phone}</p>}
                </div>

                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    placeholder="Your username"
                    value={formData.username}
                    onChange={handleChange}
                    className={errors.username ? 'error' : ''}
                  />
                  {errors.username && <p className="error-text">{errors.username}</p>}
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? 'error' : ''}
                  />
                  {errors.password && <p className="error-text">{errors.password}</p>}
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className="form-group">
                  <label htmlFor="roles">Roles</label> {/* Renamed from "Role" */}
                  <select
                    id="roles" // Renamed from "role"
                    name="roles"
                    value={formData.roles}
                    onChange={handleChange}
                    className={errors.roles ? 'error w-full' : 'w-full'}
                  >
                    <option value="">Select a role</option>
                    <option value="Farmer">Farmer</option>
                    <option value="Expert/Consultant">Expert/Consultant</option>
                    <option value="Service Provider">Service Provider</option>
                  </select>
                  {errors.roles && <p className="error-text">{errors.roles}</p>}
                </div>

                <div className="form-group">
                  <label htmlFor="description">Write a bit about yourself</label> {/* Renamed from "about" */}
                  <textarea
                    id="description" // Renamed from "about"
                    name="description"
                    placeholder="Describe your role or expertise (e.g., type of crops)"
                    value={formData.description}
                    onChange={handleChange}
                    className={errors.description ? 'error w-full' : 'w-full'}
                  />
                  {errors.description && <p className="error-text">{errors.description}</p>}
                </div>
              </>
            )}

            {step === 4 && (
              <div className="form-group">
                <label htmlFor="address">Address</label> {/* Renamed from "Location" */}
                <input
                  type="text"
                  id="address" // Renamed from "location"
                  name="address"
                  placeholder="Enter your address"
                  value={formData.address}
                  onChange={handleChange}
                  className={errors.address ? 'error' : ''}
                />
                {errors.address && <p className="error-text">{errors.address}</p>}
              </div>
            )}

            <div className="form-navigation">
              {step > 1 && (
                <button onClick={handleBack} className="auth-button secondary">
                  Back
                </button>
              )}
              <button type="submit" className="auth-button">
                {step === 4 ? 'Submit' : 'Next'}
              </button>
            </div>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account? <Link href="/login">Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
