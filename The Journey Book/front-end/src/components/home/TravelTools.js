import React, { useState, useEffect } from 'react';
import './TravelTools.css';

const TravelTools = () => {
  const [activeTool, setActiveTool] = useState('currency');
  
  // Currency Converter States
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [convertedAmount, setConvertedAmount] = useState(0);
  
  // Time Zone Converter States
  const [fromTimeZone, setFromTimeZone] = useState('America/New_York');
  const [toTimeZone, setToTimeZone] = useState('Europe/London');
  const [fromTime, setFromTime] = useState('');
  const [toTime, setToTime] = useState('');
  const [currentTimes, setCurrentTimes] = useState({});

  // Visa Requirements States
  const [fromCountry, setFromCountry] = useState('USA');
  const [toCountry, setToCountry] = useState('Thailand');
  const [visaInfo, setVisaInfo] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);

    // Weather Forecast States
  const [weatherLocation, setWeatherLocation] = useState('London');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [weatherError, setWeatherError] = useState('');

    // Popular destinations for quick access
  const popularDestinations = [
    { name: 'London', emoji: '🇬🇧' },
    { name: 'Paris', emoji: '🇫🇷' },
    { name: 'New York', emoji: '🇺🇸' },
    { name: 'Tokyo', emoji: '🇯🇵' },
    { name: 'Dubai', emoji: '🇦🇪' },
    { name: 'Sydney', emoji: '🇦🇺' },
    { name: 'Singapore', emoji: '🇸🇬' },
    { name: 'Bangkok', emoji: '🇹🇭' }
  ];

  // Mock weather data (used when real API is not connected)
const mockWeatherData = {
  'London': {
    location: 'London, UK',
    temperature: 12,
    condition: 'Partly Cloudy',
    humidity: 65,
    wind: 15,
    feelsLike: 10,
    icon: '⛅',
    forecast: [
      { day: 'Today', high: 12, low: 8, condition: 'Partly Cloudy', icon: '⛅' },
      { day: 'Tomorrow', high: 14, low: 9, condition: 'Sunny', icon: '☀️' },
      { day: 'Wed', high: 11, low: 7, condition: 'Rainy', icon: '🌧️' },
      { day: 'Thu', high: 10, low: 6, condition: 'Cloudy', icon: '☁️' },
      { day: 'Fri', high: 13, low: 8, condition: 'Sunny', icon: '☀️' }
    ]
  },
  'Paris': {
    location: 'Paris, France',
    temperature: 15,
    condition: 'Sunny',
    humidity: 60,
    wind: 12,
    feelsLike: 14,
    icon: '☀️',
    forecast: [
      { day: 'Today', high: 15, low: 10, condition: 'Sunny', icon: '☀️' },
      { day: 'Tomorrow', high: 16, low: 11, condition: 'Partly Cloudy', icon: '⛅' },
      { day: 'Wed', high: 14, low: 9, condition: 'Cloudy', icon: '☁️' },
      { day: 'Thu', high: 13, low: 8, condition: 'Rainy', icon: '🌧️' },
      { day: 'Fri', high: 15, low: 10, condition: 'Sunny', icon: '☀️' }
    ]
  },
  'New York': {
    location: 'New York, USA',
    temperature: 8,
    condition: 'Cloudy',
    humidity: 70,
    wind: 20,
    feelsLike: 5,
    icon: '☁️',
    forecast: [
      { day: 'Today', high: 8, low: 2, condition: 'Cloudy', icon: '☁️' },
      { day: 'Tomorrow', high: 10, low: 3, condition: 'Sunny', icon: '☀️' },
      { day: 'Wed', high: 7, low: 1, condition: 'Snow', icon: '❄️' },
      { day: 'Thu', high: 5, low: -1, condition: 'Snow', icon: '❄️' },
      { day: 'Fri', high: 9, low: 2, condition: 'Partly Cloudy', icon: '⛅' }
    ]
  },
  'Tokyo': {
    location: 'Tokyo, Japan',
    temperature: 18,
    condition: 'Clear',
    humidity: 55,
    wind: 10,
    feelsLike: 17,
    icon: '☀️',
    forecast: [
      { day: 'Today', high: 18, low: 12, condition: 'Clear', icon: '☀️' },
      { day: 'Tomorrow', high: 19, low: 13, condition: 'Sunny', icon: '☀️' },
      { day: 'Wed', high: 17, low: 11, condition: 'Cloudy', icon: '☁️' },
      { day: 'Thu', high: 16, low: 10, condition: 'Rainy', icon: '🌧️' },
      { day: 'Fri', high: 18, low: 12, condition: 'Partly Cloudy', icon: '⛅' }
    ]
  },
  'Dubai': {
    location: 'Dubai, UAE',
    temperature: 32,
    condition: 'Sunny',
    humidity: 45,
    wind: 8,
    feelsLike: 35,
    icon: '☀️',
    forecast: [
      { day: 'Today', high: 32, low: 25, condition: 'Sunny', icon: '☀️' },
      { day: 'Tomorrow', high: 33, low: 26, condition: 'Sunny', icon: '☀️' },
      { day: 'Wed', high: 31, low: 24, condition: 'Sunny', icon: '☀️' },
      { day: 'Thu', high: 30, low: 23, condition: 'Clear', icon: '☀️' },
      { day: 'Fri', high: 32, low: 25, condition: 'Sunny', icon: '☀️' }
    ]
  },
  'Sydney': {
    location: 'Sydney, Australia',
    temperature: 22,
    condition: 'Partly Cloudy',
    humidity: 65,
    wind: 18,
    feelsLike: 21,
    icon: '⛅',
    forecast: [
      { day: 'Today', high: 22, low: 18, condition: 'Partly Cloudy', icon: '⛅' },
      { day: 'Tomorrow', high: 24, low: 19, condition: 'Sunny', icon: '☀️' },
      { day: 'Wed', high: 23, low: 18, condition: 'Rainy', icon: '🌧️' },
      { day: 'Thu', high: 21, low: 17, condition: 'Cloudy', icon: '☁️' },
      { day: 'Fri', high: 25, low: 20, condition: 'Sunny', icon: '☀️' }
    ]
  },
  'Singapore': {
    location: 'Singapore',
    temperature: 30,
    condition: 'Thunderstorm',
    humidity: 85,
    wind: 12,
    feelsLike: 36,
    icon: '⛈️',
    forecast: [
      { day: 'Today', high: 30, low: 26, condition: 'Thunderstorm', icon: '⛈️' },
      { day: 'Tomorrow', high: 31, low: 26, condition: 'Rainy', icon: '🌧️' },
      { day: 'Wed', high: 32, low: 27, condition: 'Partly Cloudy', icon: '⛅' },
      { day: 'Thu', high: 31, low: 26, condition: 'Rainy', icon: '🌧️' },
      { day: 'Fri', high: 32, low: 27, condition: 'Sunny', icon: '☀️' }
    ]
  },
  'Bangkok': {
    location: 'Bangkok, Thailand',
    temperature: 34,
    condition: 'Sunny',
    humidity: 70,
    wind: 10,
    feelsLike: 40,
    icon: '☀️',
    forecast: [
      { day: 'Today', high: 34, low: 28, condition: 'Sunny', icon: '☀️' },
      { day: 'Tomorrow', high: 35, low: 28, condition: 'Sunny', icon: '☀️' },
      { day: 'Wed', high: 33, low: 27, condition: 'Partly Cloudy', icon: '⛅' },
      { day: 'Thu', high: 34, low: 27, condition: 'Thunderstorm', icon: '⛈️' },
      { day: 'Fri', high: 32, low: 26, condition: 'Rainy', icon: '🌧️' }
    ]
  }
};


  // Static exchange rates
  const staticRates = {
    USD: 1, EUR: 0.85, GBP: 0.73, INR: 83.25, JPY: 150.42, AUD: 1.52, 
    CAD: 1.35, CHF: 0.88, CNY: 7.23, SGD: 1.34, AED: 3.67, SAR: 3.75,
    PKR: 278.50, BDT: 109.80, LKR: 322.45, NPR: 133.08, MYR: 4.71,
    THB: 35.80, KRW: 1330.45, PHP: 56.23
  };

  // Time zones data
  const timeZones = [
    { value: 'America/New_York', label: 'New York', emoji: '🇺🇸' },
    { value: 'America/Los_Angeles', label: 'Los Angeles', emoji: '🇺🇸' },
    { value: 'America/Chicago', label: 'Chicago', emoji: '🇺🇸' },
    { value: 'Europe/London', label: 'London', emoji: '🇬🇧' },
    { value: 'Europe/Paris', label: 'Paris', emoji: '🇫🇷' },
    { value: 'Europe/Berlin', label: 'Berlin', emoji: '🇩🇪' },
    { value: 'Asia/Dubai', label: 'Dubai', emoji: '🇦🇪' },
    { value: 'Asia/Singapore', label: 'Singapore', emoji: '🇸🇬' },
    { value: 'Asia/Tokyo', label: 'Tokyo', emoji: '🇯🇵' },
    { value: 'Asia/Shanghai', label: 'Shanghai', emoji: '🇨🇳' },
    { value: 'Asia/Kolkata', label: 'Mumbai', emoji: '🇮🇳' },
    { value: 'Australia/Sydney', label: 'Sydney', emoji: '🇦🇺' },
    { value: 'Pacific/Auckland', label: 'Auckland', emoji: '🇳🇿' },
    { value: 'Africa/Cairo', label: 'Cairo', emoji: '🇪🇬' },
    { value: 'Africa/Johannesburg', label: 'Johannesburg', emoji: '🇿🇦' },
    { value: 'America/Sao_Paulo', label: 'São Paulo', emoji: '🇧🇷' }
  ];

  // Countries data for visa requirements
  const countries = [
    { code: 'USA', name: 'United States', emoji: '🇺🇸' },
    { code: 'UK', name: 'United Kingdom', emoji: '🇬🇧' },
    { code: 'CAN', name: 'Canada', emoji: '🇨🇦' },
    { code: 'AUS', name: 'Australia', emoji: '🇦🇺' },
    { code: 'GER', name: 'Germany', emoji: '🇩🇪' },
    { code: 'FRA', name: 'France', emoji: '🇫🇷' },
    { code: 'ITA', name: 'Italy', emoji: '🇮🇹' },
    { code: 'ESP', name: 'Spain', emoji: '🇪🇸' },
    { code: 'IND', name: 'India', emoji: '🇮🇳' },
    { code: 'CHN', name: 'China', emoji: '🇨🇳' },
    { code: 'JPN', name: 'Japan', emoji: '🇯🇵' },
    { code: 'KOR', name: 'South Korea', emoji: '🇰🇷' },
    { code: 'SGP', name: 'Singapore', emoji: '🇸🇬' },
    { code: 'THA', name: 'Thailand', emoji: '🇹🇭' },
    { code: 'MYS', name: 'Malaysia', emoji: '🇲🇾' },
    { code: 'IDN', name: 'Indonesia', emoji: '🇮🇩' },
    { code: 'ARE', name: 'UAE', emoji: '🇦🇪' },
    { code: 'SAU', name: 'Saudi Arabia', emoji: '🇸🇦' },
    { code: 'TUR', name: 'Turkey', emoji: '🇹🇷' },
    { code: 'EGY', name: 'Egypt', emoji: '🇪🇬' },
    { code: 'ZAF', name: 'South Africa', emoji: '🇿🇦' },
    { code: 'BRA', name: 'Brazil', emoji: '🇧🇷' },
    { code: 'MEX', name: 'Mexico', emoji: '🇲🇽' },
    { code: 'PKR', name: 'Pakistan', emoji: '🇵🇰' },
    { code: 'BGD', name: 'Bangladesh', emoji: '🇧🇩' },
    { code: 'NPL', name: 'Nepal', emoji: '🇳🇵' },
    { code: 'LKA', name: 'Sri Lanka', emoji: '🇱🇰' }
  ];

  // Static visa requirements database
  const visaRequirements = {
    'USA_to_Thailand': {
      visaRequired: false,
      visaType: 'Visa Exempt',
      stayDuration: '30 days',
      passportValidity: '6 months',
      returnTicket: true,
      sufficientFunds: '20,000 THB',
      notes: 'Extension possible for 30 days at immigration office',
      lastUpdated: '2024-01-15'
    },
    'USA_to_India': {
      visaRequired: true,
      visaType: 'e-Visa',
      processingTime: '3-5 business days',
      cost: 'USD 25',
      stayDuration: '30 days',
      passportValidity: '6 months',
      notes: 'Apply online at indianvisaonline.gov.in',
      lastUpdated: '2024-01-10'
    },
    'USA_to_France': {
      visaRequired: false,
      visaType: 'Visa Exempt (Schengen)',
      stayDuration: '90 days',
      passportValidity: '3 months beyond stay',
      notes: 'Part of Schengen area',
      lastUpdated: '2024-01-12'
    },
    'IND_to_Thailand': {
      visaRequired: false,
      visaType: 'Visa Exempt',
      stayDuration: '30 days',
      passportValidity: '6 months',
      returnTicket: true,
      notes: 'Available at designated border checkpoints',
      lastUpdated: '2024-01-08'
    },
    'IND_to_USA': {
      visaRequired: true,
      visaType: 'B1/B2 Tourist Visa',
      processingTime: '2-4 weeks',
      cost: 'USD 185',
      stayDuration: 'Up to 6 months',
      interviewRequired: true,
      notes: 'Schedule appointment at US embassy',
      lastUpdated: '2024-01-05'
    },
    'UK_to_Thailand': {
      visaRequired: false,
      visaType: 'Visa Exempt',
      stayDuration: '30 days',
      passportValidity: '6 months',
      returnTicket: true,
      notes: 'Extension possible',
      lastUpdated: '2024-01-14'
    }
  };

  // Currency conversion functions
  const convertCurrency = () => {
    if (fromCurrency === toCurrency) {
      setConvertedAmount(amount);
      return;
    }
    const fromRate = staticRates[fromCurrency];
    const toRate = staticRates[toCurrency];
    const amountInUSD = amount / fromRate;
    const converted = amountInUSD * toRate;
    setConvertedAmount(parseFloat(converted.toFixed(2)));
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  // Time Zone conversion functions
  const convertTimeZone = (time, fromTZ, toTZ) => {
    if (!time) return '';
    try {
      const date = new Date(`2000-01-01T${time}`);
      const fromDate = new Date(date.toLocaleString('en-US', { timeZone: fromTZ }));
      const toDate = new Date(date.toLocaleString('en-US', { timeZone: toTZ }));
      return toDate.toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
      }).slice(0, 5);
    } catch (error) {
      return '';
    }
  };

  const getCurrentTime = (timeZone) => {
    try {
      return new Date().toLocaleTimeString('en-US', {
        timeZone: timeZone,
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch (error) {
      return 'Error';
    }
  };

  const swapTimeZones = () => {
    setFromTimeZone(toTimeZone);
    setToTimeZone(fromTimeZone);
    setFromTime(toTime);
    setToTime(fromTime);
  };

  const setToCurrentTime = () => {
    const current = getCurrentTime(fromTimeZone).slice(0, 5);
    setFromTime(current);
  };

  // Visa requirement functions
  const getVisaInfo = (from, to) => {
    const key = `${from}_to_${to}`;
    const info = visaRequirements[key];
    
    if (info) {
      setVisaInfo(info);
      // Add to search history
      const newSearch = {
        from: countries.find(c => c.code === from)?.name,
        to: countries.find(c => c.code === to)?.name,
        timestamp: new Date().toLocaleTimeString()
      };
      setSearchHistory(prev => [newSearch, ...prev.slice(0, 4)]);
    } else {
      setVisaInfo({
        visaRequired: null,
        notes: 'Information not available in our database. Please check official government websites.'
      });
    }
  };

  const swapCountries = () => {
    setFromCountry(toCountry);
    setToCountry(fromCountry);
  };

   // Weather functions
  const fetchWeatherData = (location) => {
    setLoading(true);
    setWeatherError('');
    
    // Simulate API call delay
    setTimeout(() => {
      const data = mockWeatherData[location];
      if (data) {
        setWeatherData(data);
      } else {
        setWeatherError('Weather data not available for this location');
        setWeatherData(null);
      }
      setLoading(false);
    }, 800);
  };

  const handleLocationSearch = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      if (weatherLocation.trim()) {
        fetchWeatherData(weatherLocation);
      }
    }
  };

  const getWeatherIcon = (condition) => {
    const iconMap = {
      'Sunny': '☀️',
      'Clear': '☀️',
      'Partly Cloudy': '⛅',
      'Cloudy': '☁️',
      'Rainy': '🌧️',
      'Thunderstorm': '⛈️',
      'Snow': '❄️',
      'Fog': '🌫️',
      'Windy': '💨'
    };
    return iconMap[condition] || '🌤️';
  };

  const getTemperatureColor = (temp) => {
    if (temp < 0) return '#60a5fa'; // Cold - blue
    if (temp < 10) return '#93c5fd'; // Cool - light blue
    if (temp < 20) return '#86efac'; // Mild - green
    if (temp < 30) return '#fcd34d'; // Warm - yellow
    return '#f87171'; // Hot - red
  };

   // Load initial weather data
  useEffect(() => {
    fetchWeatherData(weatherLocation);
  }, []);

  // Effects
  useEffect(() => {
    convertCurrency();
  }, [amount, fromCurrency, toCurrency]);

  useEffect(() => {
    if (fromTime) {
      const converted = convertTimeZone(fromTime, fromTimeZone, toTimeZone);
      setToTime(converted);
    }
  }, [fromTime, fromTimeZone, toTimeZone]);

  useEffect(() => {
    const updateCurrentTimes = () => {
      const times = {};
      timeZones.forEach(tz => {
        times[tz.value] = getCurrentTime(tz.value);
      });
      setCurrentTimes(times);
    };

    updateCurrentTimes();
    const interval = setInterval(updateCurrentTimes, 1000);
    return () => clearInterval(interval);
  }, []);

  // Load visa info on component mount and when countries change
  useEffect(() => {
    getVisaInfo(fromCountry, toCountry);
  }, [fromCountry, toCountry]);

  const currencyOptions = Object.keys(staticRates).map(currency => (
    <option key={currency} value={currency}>{currency}</option>
  ));

  const timeZoneOptions = timeZones.map(tz => (
    <option key={tz.value} value={tz.value}>
      {tz.emoji} {tz.label}
    </option>
  ));

  const countryOptions = countries.map(country => (
    <option key={country.code} value={country.code}>
      {country.emoji} {country.name}
    </option>
  ));

  const renderToolContent = () => {
    switch(activeTool) {
      case 'currency':
        return (
          <div className="tt-tool-section">
            <h3 className="tt-tool-title">Currency Converter</h3>
            <div className="tt-currency-converter">
              <div className="tt-input-group">
                <div className="tt-amount-input">
                  <label>Amount</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="0"
                    step="0.01"
                  />
                </div>
                
                <div className="tt-currency-selectors">
                  <div className="tt-currency-select">
                    <label>From</label>
                    <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
                      {currencyOptions}
                    </select>
                  </div>
                  
                  <button className="tt-swap-btn" onClick={swapCurrencies}>⇄ Swap</button>
                  
                  <div className="tt-currency-select">
                    <label>To</label>
                    <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
                      {currencyOptions}
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="tt-result">
                <div className="tt-conversion-result">
                  {amount} {fromCurrency} = 
                  <span className="tt-converted-amount">{convertedAmount} {toCurrency}</span>
                </div>
                <div className="tt-rate-info">
                  1 {fromCurrency} = {(staticRates[toCurrency] / staticRates[fromCurrency]).toFixed(4)} {toCurrency}
                </div>
              </div>
              
              <div className="tt-currency-grid">
                <h4>Popular Conversions</h4>
                <div className="tt-grid">
                  {['EUR', 'GBP', 'INR', 'JPY', 'AED', 'PKR'].map(currency => (
                    currency !== fromCurrency && (
                      <div key={currency} className="tt-grid-item" onClick={() => setToCurrency(currency)}>
                        <span>1 {fromCurrency}</span>
                        <span>{(staticRates[currency] / staticRates[fromCurrency]).toFixed(2)} {currency}</span>
                      </div>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'timezone':
        return (
          <div className="tt-tool-section">
            <h3 className="tt-tool-title">Time Zone Converter</h3>
            <div className="tt-timezone-converter">
              <div className="tt-time-input-group">
                <div className="tt-time-input">
                  <label>Time</label>
                  <div className="tt-time-input-wrapper">
                    <input
                      type="time"
                      value={fromTime}
                      onChange={(e) => setFromTime(e.target.value)}
                    />
                    <button className="tt-current-time-btn" onClick={setToCurrentTime}>
                      Now
                    </button>
                  </div>
                </div>
                
                <div className="tt-timezone-selectors">
                  <div className="tt-timezone-select">
                    <label>From Time Zone</label>
                    <select value={fromTimeZone} onChange={(e) => setFromTimeZone(e.target.value)}>
                      {timeZoneOptions}
                    </select>
                    <div className="tt-current-time">
                      Current: {currentTimes[fromTimeZone]}
                    </div>
                  </div>
                  
                  <button className="tt-swap-btn" onClick={swapTimeZones}>⇄ Swap</button>
                  
                  <div className="tt-timezone-select">
                    <label>To Time Zone</label>
                    <select value={toTimeZone} onChange={(e) => setToTimeZone(e.target.value)}>
                      {timeZoneOptions}
                    </select>
                    <div className="tt-current-time">
                      Current: {currentTimes[toTimeZone]}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="tt-time-result">
                <div className="tt-time-conversion">
                  <div className="tt-original-time">
                    {fromTime || '00:00'} {timeZones.find(tz => tz.value === fromTimeZone)?.label}
                  </div>
                  <div className="tt-converts-to">↓ converts to ↓</div>
                  <div className="tt-converted-time">
                    {toTime || '00:00'} {timeZones.find(tz => tz.value === toTimeZone)?.label}
                  </div>
                </div>
              </div>
              
              <div className="tt-world-clocks">
                <h4>World Clocks</h4>
                <div className="tt-clocks-grid">
                  {timeZones.slice(0, 8).map(tz => (
                    <div key={tz.value} className="tt-clock-item">
                      <div className="tt-clock-emoji">{tz.emoji}</div>
                      <div className="tt-clock-info">
                        <div className="tt-clock-city">{tz.label}</div>
                        <div className="tt-clock-time">{currentTimes[tz.value]}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'visa':
        return (
          <div className="tt-tool-section">
            <h3 className="tt-tool-title">Visa Requirements</h3>
            <div className="tt-visa-converter">
              <div className="tt-visa-input-group">
                <div className="tt-country-selectors">
                  <div className="tt-country-select">
                    <label>Traveling From</label>
                    <select value={fromCountry} onChange={(e) => setFromCountry(e.target.value)}>
                      {countryOptions}
                    </select>
                  </div>
                  
                  <button className="tt-swap-btn" onClick={swapCountries}>⇄ Swap</button>
                  
                  <div className="tt-country-select">
                    <label>Traveling To</label>
                    <select value={toCountry} onChange={(e) => setToCountry(e.target.value)}>
                      {countryOptions}
                    </select>
                  </div>
                </div>
              </div>
              
              {visaInfo && (
                <div className="tt-visa-result">
                  <div className="tt-visa-header">
                    <h4>
                      {countries.find(c => c.code === fromCountry)?.emoji} 
                      {countries.find(c => c.code === fromCountry)?.name} → 
                      {countries.find(c => c.code === toCountry)?.emoji} 
                      {countries.find(c => c.code === toCountry)?.name}
                    </h4>
                  </div>
                  
                  <div className="tt-visa-status">
                    <div className={`tt-visa-badge ${visaInfo.visaRequired === false ? 'tt-no-visa' : visaInfo.visaRequired === true ? 'tt-visa-required' : 'tt-unknown'}`}>
                      {visaInfo.visaRequired === false ? '✅ No Visa Required' : 
                       visaInfo.visaRequired === true ? '🛂 Visa Required' : 
                       '❓ Information Not Available'}
                    </div>
                  </div>

                  {visaInfo.visaRequired !== null && (
                    <div className="tt-visa-details">
                      <div className="tt-detail-grid">
                        {visaInfo.visaType && (
                          <div className="tt-detail-item">
                            <span className="tt-detail-label">Visa Type:</span>
                            <span className="tt-detail-value">{visaInfo.visaType}</span>
                          </div>
                        )}
                        
                        {visaInfo.stayDuration && (
                          <div className="tt-detail-item">
                            <span className="tt-detail-label">Stay Duration:</span>
                            <span className="tt-detail-value">{visaInfo.stayDuration}</span>
                          </div>
                        )}
                        
                        {visaInfo.passportValidity && (
                          <div className="tt-detail-item">
                            <span className="tt-detail-label">Passport Validity:</span>
                            <span className="tt-detail-value">{visaInfo.passportValidity}</span>
                          </div>
                        )}
                        
                        {visaInfo.processingTime && (
                          <div className="tt-detail-item">
                            <span className="tt-detail-label">Processing Time:</span>
                            <span className="tt-detail-value">{visaInfo.processingTime}</span>
                          </div>
                        )}
                        
                        {visaInfo.cost && (
                          <div className="tt-detail-item">
                            <span className="tt-detail-label">Cost:</span>
                            <span className="tt-detail-value">{visaInfo.cost}</span>
                          </div>
                        )}
                        
                        {visaInfo.returnTicket !== undefined && (
                          <div className="tt-detail-item">
                            <span className="tt-detail-label">Return Ticket:</span>
                            <span className="tt-detail-value">{visaInfo.returnTicket ? 'Required' : 'Not Required'}</span>
                          </div>
                        )}
                      </div>
                      
                      {visaInfo.notes && (
                        <div className="tt-visa-notes">
                          <strong>Important Notes:</strong>
                          <p>{visaInfo.notes}</p>
                        </div>
                      )}
                      
                      {visaInfo.lastUpdated && (
                        <div className="tt-last-updated">
                          Last updated: {visaInfo.lastUpdated}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              
              <div className="tt-search-history">
                <h4>Recent Searches</h4>
                {searchHistory.length > 0 ? (
                  <div className="tt-history-list">
                    {searchHistory.map((search, index) => (
                      <div key={index} className="tt-history-item">
                        <span>{search.from} → {search.to}</span>
                        <span className="tt-history-time">{search.timestamp}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="tt-no-history">No recent searches</p>
                )}
              </div>
              
              <div className="tt-visa-disclaimer">
                <p>⚠️ <strong>Disclaimer:</strong> This information is for reference only. 
                Always check official government websites for the most current visa requirements.</p>
              </div>
            </div>
          </div>
        );
      
      case 'weather':
  return (
    <div className="tt-tool-section">
      <h3 className="tt-tool-title">Weather Forecast</h3>

      {/* Search Section */}
      <div className="tt-weather-converter">
        <div className="tt-weather-search">
          <div className="tt-search-box">
            <input
              type="text"
              value={weatherLocation}
              onChange={(e) => setWeatherLocation(e.target.value)}
              onKeyPress={handleLocationSearch}
              placeholder="Enter city name..."
              className="tt-weather-input"
            />
            <button
              onClick={handleLocationSearch}
              className="tt-search-btn"
              disabled={loading}
            >
              {loading ? '🔍 Searching...' : '🔍 Search'}
            </button>
          </div>

          {/* Popular destinations */}
          <div className="tt-popular-destinations">
            <span>Popular: </span>
            {popularDestinations.map((dest) => (
              <button
                key={dest.name}
                className="tt-dest-btn"
                onClick={() => {
                  setWeatherLocation(dest.name);
                  fetchWeatherData(dest.name);
                }}
              >
                {dest.emoji} {dest.name}
              </button>
            ))}
          </div>
        </div>

        {/* Current Weather */}
        {weatherData && !loading && (
          <div className="tt-weather-result">
            <div className="tt-current-weather">
              <div className="tt-weather-header">
                <h4>{weatherData.location}</h4>
                <div className="tt-weather-main">
                  <div className="tt-weather-icon" style={{ fontSize: '4rem' }}>
                    {weatherData.icon}
                  </div>
                  <div className="tt-weather-temp">
                    <span
                      className="tt-temperature"
                      style={{ color: getTemperatureColor(weatherData.temperature) }}
                    >
                      {weatherData.temperature}°C
                    </span>
                    <span className="tt-condition">{weatherData.condition}</span>
                  </div>
                </div>
              </div>

              <div className="tt-weather-details">
                <div className="tt-weather-grid">
                  <div className="tt-weather-item">
                    <span className="tt-weather-label">Feels Like</span>
                    <span className="tt-weather-value">{weatherData.feelsLike}°C</span>
                  </div>
                  <div className="tt-weather-item">
                    <span className="tt-weather-label">Humidity</span>
                    <span className="tt-weather-value">{weatherData.humidity}%</span>
                  </div>
                  <div className="tt-weather-item">
                    <span className="tt-weather-label">Wind</span>
                    <span className="tt-weather-value">{weatherData.wind} km/h</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 5-Day Forecast */}
            <div className="tt-weather-forecast">
              <h5>5-Day Forecast</h5>
              <div className="tt-forecast-grid">
                {weatherData.forecast.map((day, index) => (
                  <div key={index} className="tt-forecast-item">
                    <div className="tt-forecast-day">{day.day}</div>
                    <div className="tt-forecast-icon">{day.icon}</div>
                    <div className="tt-forecast-temps">
                      <span className="tt-forecast-high">{day.high}°</span>
                      <span className="tt-forecast-low">{day.low}°</span>
                    </div>
                    <div className="tt-forecast-condition">{day.condition}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="tt-weather-loading">
            <div className="tt-loading-spinner"></div>
            <p>Getting weather data for {weatherLocation}...</p>
          </div>
        )}

        {/* Error State */}
        {weatherError && (
          <div className="tt-weather-error">
            <p>❌ {weatherError}</p>
            <p>Try searching for popular destinations like London, Paris, or New York.</p>
          </div>
        )}

        {/* Initial State */}
        {!weatherData && !loading && !weatherError && (
          <div className="tt-weather-initial">
            <div className="tt-initial-message">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌤️</div>
              <h4>Search for Weather</h4>
              <p>Enter a city name or click on a popular destination to get weather information.</p>
            </div>
          </div>
        )}

        {/* Weather Tips */}
        <div className="tt-weather-tips">
          <h5>Travel Weather Tips</h5>
          <div className="tt-tips-grid">
            <div className="tt-tip-item">
              <span className="tt-tip-emoji">☀️</span>
              <span>Wear sunscreen and stay hydrated in sunny weather</span>
            </div>
            <div className="tt-tip-item">
              <span className="tt-tip-emoji">🌧️</span>
              <span>Carry an umbrella and waterproof gear for rainy days</span>
            </div>
            <div className="tt-tip-item">
              <span className="tt-tip-emoji">❄️</span>
              <span>Dress in layers and wear warm clothing in cold weather</span>
            </div>
            <div className="tt-tip-item">
              <span className="tt-tip-emoji">💨</span>
              <span>Check for travel delays during windy conditions</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

      
      default:
        return null;
    }
  };

  return (
    <div className="tt-container">
      <div className="tt-header">
        <h2 className="tt-main-title">🛠️ Travel Tools</h2>
        <p className="tt-subtitle">Essential utilities for smart travelers</p>
      </div>

      <div className="tt-nav">
        <button className={`tt-nav-btn ${activeTool === 'currency' ? 'tt-active' : ''}`} onClick={() => setActiveTool('currency')}>
          💰 Currency
        </button>
        <button className={`tt-nav-btn ${activeTool === 'timezone' ? 'tt-active' : ''}`} onClick={() => setActiveTool('timezone')}>
          ⏰ Time Zone
        </button>
        <button className={`tt-nav-btn ${activeTool === 'visa' ? 'tt-active' : ''}`} onClick={() => setActiveTool('visa')}>
          🛂 Visa
        </button>
        <button className={`tt-nav-btn ${activeTool === 'weather' ? 'tt-active' : ''}`} onClick={() => setActiveTool('weather')}>
          🌤️ Weather
        </button>
      </div>

      <div className="tt-content">
        {renderToolContent()}
      </div>
    </div>
  );
};

export default TravelTools;