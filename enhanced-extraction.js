// ENHANCED EXTRACTION FUNCTIONS - MORE ACCURATE VOICE PROCESSING

// ENHANCED NAME EXTRACTION - More accurate and comprehensive
function extractName(input) {
  // Clean input - remove common filler words
  let cleanInput = input.replace(/\b(um|uh|well|so|like|you know)\b/gi, '').trim();
  
  // Enhanced name patterns with more variations
  const namePatterns = [
    // Direct name introductions
    /(?:my name is|i'm|i am|this is|call me|name's)\s+([a-zA-Z][a-zA-Z\s]{1,40})/i,
    /(?:it's|its)\s+([a-zA-Z][a-zA-Z\s]{1,40})/i,
    /(?:i am|im)\s+([a-zA-Z][a-zA-Z\s]{1,40})/i,
    
    // Speaking patterns
    /(?:speaking|here|calling)\s*,?\s*([a-zA-Z][a-zA-Z\s]{1,40})/i,
    /([a-zA-Z][a-zA-Z\s]{1,40})\s+(?:speaking|here|calling)/i,
    
    // Just names (2-3 words)
    /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2})$/,
    /\b([A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\b/,
    
    // Common name formats
    /\b([A-Z][a-z]{2,15}(?:\s+[A-Z][a-z]{2,15}){1,2})\b/
  ];
  
  for (const pattern of namePatterns) {
    const match = cleanInput.match(pattern);
    if (match) {
      let name = match[1].trim();
      
      // Clean up the name
      name = name.replace(/\s+/g, ' '); // Remove extra spaces
      
      // Enhanced filter - exclude non-name words
      const excludeWords = /\b(reservation|table|book|booking|today|tomorrow|yesterday|dinner|lunch|breakfast|restaurant|want|need|like|would|could|should|please|thank|thanks|hello|hi|hey|good|morning|afternoon|evening|night|time|date|day|week|month|year|people|person|guest|party|special|request|dietary|allergy|window|quiet|birthday|anniversary|celebration|vegetarian|vegan|gluten|free|wheelchair|accessible|smoking|non|available|check|confirm|cancel|change|modify|update)\b/i;
      
      if (!name.match(excludeWords) && name.length >= 2 && name.length <= 50) {
        // Additional validation - must contain at least one letter
        if (/[a-zA-Z]/.test(name)) {
          return name;
        }
      }
    }
  }
  return null;
}

// ENHANCED DATE EXTRACTION - More patterns and formats
function extractDate(input) {
  // Clean input
  let cleanInput = input.toLowerCase().replace(/[^\w\s\/\-]/g, ' ').trim();
  
  // Immediate date keywords
  if (cleanInput.match(/\b(today|now)\b/)) return 'Today';
  if (cleanInput.match(/\b(tomorrow|tmrw)\b/)) return 'Tomorrow';
  if (cleanInput.match(/\b(day after tomorrow|overmorrow)\b/)) return 'Day After Tomorrow';
  if (cleanInput.match(/\b(next week)\b/)) return 'Next Week';
  if (cleanInput.match(/\b(this week)\b/)) return 'This Week';
  
  // Days of the week with variations
  const dayVariations = {
    'sunday': ['sunday', 'sun'],
    'monday': ['monday', 'mon'],
    'tuesday': ['tuesday', 'tue', 'tues'],
    'wednesday': ['wednesday', 'wed'],
    'thursday': ['thursday', 'thu', 'thur', 'thurs'],
    'friday': ['friday', 'fri'],
    'saturday': ['saturday', 'sat']
  };
  
  for (const [day, variations] of Object.entries(dayVariations)) {
    for (const variant of variations) {
      if (cleanInput.includes(variant)) {
        return day.charAt(0).toUpperCase() + day.slice(1);
      }
    }
  }
  
  // Date formats
  const datePatterns = [
    // MM/DD or DD/MM
    /\b(\d{1,2})[\/\-](\d{1,2})(?:[\/\-](\d{2,4}))?\b/,
    // Ordinal dates (1st, 2nd, 3rd, etc.)
    /\b(\d{1,2})(?:st|nd|rd|th)\b/i,
    // Month names
    /\b(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec)\s+(\d{1,2})(?:st|nd|rd|th)?\b/i,
    /\b(\d{1,2})(?:st|nd|rd|th)?\s+(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec)\b/i
  ];
  
  for (const pattern of datePatterns) {
    const match = cleanInput.match(pattern);
    if (match) {
      return match[0];
    }
  }
  
  return null;
}

// ENHANCED TIME EXTRACTION - More accurate with common speech patterns
function extractTime(input) {
  // Clean input
  let cleanInput = input.toLowerCase().replace(/[^\w\s:]/g, ' ').trim();
  
  // Enhanced time patterns
  const timePatterns = [
    // Standard formats
    /\b(\d{1,2}):(\d{2})\s*(pm|am|p\.?m\.?|a\.?m\.?)\b/i,
    /\b(\d{1,2})\s*(pm|am|p\.?m\.?|a\.?m\.?)\b/i,
    /\b(\d{1,2}):(\d{2})\b/,
    
    // Special times
    /\b(noon|midnight|midday)\b/i,
    
    // Half past, quarter past, etc.
    /\b(half past|thirty past)\s+(\d{1,2})\b/i,
    /\b(\d{1,2})\s+(thirty|half)\b/i,
    /\b(quarter past|fifteen past)\s+(\d{1,2})\b/i,
    /\b(\d{1,2})\s+(fifteen|quarter)\b/i,
    
    // O'clock variations
    /\b(\d{1,2})\s*(?:o'clock|oclock|clock)\b/i
  ];
  
  for (const pattern of timePatterns) {
    const match = cleanInput.match(pattern);
    if (match) {
      let time = match[0];
      let hour, minute = '00', period = '';
      
      // Handle special cases
      if (time.includes('noon') || time.includes('midday')) return '12:00 PM';
      if (time.includes('midnight')) return '12:00 AM';
      
      // Handle half past
      if (time.includes('half') || time.includes('thirty')) {
        hour = match[2] || match[1];
        minute = '30';
      }
      // Handle quarter past
      else if (time.includes('quarter') || time.includes('fifteen')) {
        hour = match[2] || match[1];
        minute = '15';
      }
      // Handle standard formats
      else {
        hour = match[1];
        minute = match[2] || '00';
        period = match[3] || '';
      }
      
      // Convert to number for validation
      const hourNum = parseInt(hour);
      const minuteNum = parseInt(minute);
      
      if (hourNum >= 1 && hourNum <= 12 && minuteNum >= 0 && minuteNum <= 59) {
        // Auto-detect PM for dinner hours if no period specified
        if (!period) {
          if (hourNum >= 5 && hourNum <= 11) {
            period = 'PM';
          } else if (hourNum === 12) {
            period = 'PM'; // Assume 12 is noon
          } else {
            period = 'PM'; // Default to PM for restaurant hours
          }
        }
        
        // Format the time
        const formattedHour = hourNum.toString();
        const formattedMinute = minute.padStart(2, '0');
        const formattedPeriod = period.toUpperCase();
        
        return `${formattedHour}:${formattedMinute} ${formattedPeriod}`;
      }
    }
  }
  
  // Word-based times with more variations
  const wordTimes = {
    'five': '5:00 PM', 'five thirty': '5:30 PM',
    'six': '6:00 PM', 'six thirty': '6:30 PM',
    'seven': '7:00 PM', 'seven thirty': '7:30 PM',
    'eight': '8:00 PM', 'eight thirty': '8:30 PM',
    'nine': '9:00 PM', 'nine thirty': '9:30 PM',
    'ten': '10:00 PM', 'ten thirty': '10:30 PM',
    'eleven': '11:00 PM', 'eleven thirty': '11:30 PM',
    'dinner time': '7:00 PM',
    'evening': '7:00 PM',
    'early evening': '6:00 PM',
    'late evening': '8:00 PM'
  };
  
  for (const [phrase, time] of Object.entries(wordTimes)) {
    if (cleanInput.includes(phrase)) {
      return time;
    }
  }
  
  return null;
}

// ENHANCED GUEST COUNT EXTRACTION - More accurate number detection
function extractGuestCount(input) {
  // Clean input
  let cleanInput = input.toLowerCase().replace(/[^\w\s]/g, ' ').trim();
  
  // Direct number patterns
  const numberPatterns = [
    // Direct numbers with context
    /\b(\d+)\s*(?:people|person|persons|guest|guests|ppl)\b/i,
    /(?:table for|party of|group of|reservation for)\s*(\d+)/i,
    /(\d+)\s*(?:of us|in our party|in our group)/i,
    
    // Just numbers (1-20)
    /\b(\d+)\b/
  ];
  
  for (const pattern of numberPatterns) {
    const match = cleanInput.match(pattern);
    if (match) {
      const num = parseInt(match[1]);
      if (num >= 1 && num <= 20) {
        return num;
      }
    }
  }
  
  // Enhanced word numbers with variations
  const wordNumbers = {
    'one': 1, 'a': 1, 'single': 1, 'solo': 1,
    'two': 2, 'couple': 2, 'pair': 2, 'both': 2,
    'three': 3, 'trio': 3,
    'four': 4, 'quad': 4,
    'five': 5,
    'six': 6,
    'seven': 7,
    'eight': 8,
    'nine': 9,
    'ten': 10,
    'eleven': 11,
    'twelve': 12,
    'dozen': 12,
    'thirteen': 13,
    'fourteen': 14,
    'fifteen': 15,
    'sixteen': 16,
    'seventeen': 17,
    'eighteen': 18,
    'nineteen': 19,
    'twenty': 20
  };
  
  // Check for word numbers
  for (const [word, num] of Object.entries(wordNumbers)) {
    if (cleanInput.includes(word)) {
      // Additional context validation
      if (cleanInput.includes('people') || cleanInput.includes('person') || 
          cleanInput.includes('guest') || cleanInput.includes('party') ||
          cleanInput.includes('table') || cleanInput.includes('us') ||
          cleanInput.includes('group') || num <= 2) {
        return num;
      }
    }
  }
  
  return null;
}
