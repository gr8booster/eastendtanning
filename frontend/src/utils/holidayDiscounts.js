/**
 * Dynamic Holiday & Seasonal Discount System
 * Automatically returns the current active discount based on date
 */

// Helper to get Easter date for a given year (Western Easter)
const getEasterDate = (year) => {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
};

// All holiday/seasonal discounts configuration
const getHolidayDiscounts = (year) => {
  const easter = getEasterDate(year);
  
  return [
    // New Year's (Dec 26 - Jan 7)
    {
      id: 'new-year',
      name: "New Year's Sale",
      emoji: '🎆',
      tagline: 'New Year, New Glow!',
      description: 'Start 2026 with a fresh tan! Special New Year pricing on all packages.',
      discountPercent: 20,
      discountCode: 'NEWYEAR2026',
      colors: {
        primary: 'from-purple-600 to-blue-600',
        secondary: 'from-purple-500 to-indigo-500',
        accent: 'purple-500',
        text: 'text-purple-600'
      },
      startDate: new Date(year - 1, 11, 26), // Dec 26 of previous year
      endDate: new Date(year, 0, 7), // Jan 7
      applicableTo: ['tanning', 'laundry', 'eats']
    },
    
    // Valentine's Day (Feb 7 - Feb 14)
    {
      id: 'valentines',
      name: "Valentine's Day Special",
      emoji: '💕',
      tagline: 'Glow for Your Love!',
      description: 'Look your best for Valentine\'s Day! Couples and singles welcome.',
      discountPercent: 15,
      discountCode: 'LOVE2026',
      colors: {
        primary: 'from-pink-500 to-red-500',
        secondary: 'from-rose-400 to-pink-500',
        accent: 'pink-500',
        text: 'text-pink-600'
      },
      startDate: new Date(year, 1, 7), // Feb 7
      endDate: new Date(year, 1, 14), // Feb 14
      applicableTo: ['tanning']
    },
    
    // Presidents Day (Feb 15-17 weekend)
    {
      id: 'presidents-day',
      name: "Presidents Day Weekend",
      emoji: '🇺🇸',
      tagline: 'Presidential Savings!',
      description: 'Celebrate with commander-in-chief deals this long weekend!',
      discountPercent: 15,
      discountCode: 'PRES2026',
      colors: {
        primary: 'from-blue-600 to-red-600',
        secondary: 'from-blue-500 to-red-500',
        accent: 'blue-600',
        text: 'text-blue-700'
      },
      startDate: new Date(year, 1, 14), // Feb 14
      endDate: new Date(year, 1, 17), // Feb 17
      applicableTo: ['tanning', 'laundry']
    },
    
    // Spring Break (March 1 - March 21)
    {
      id: 'spring-break',
      name: 'Spring Break Glow',
      emoji: '🌴',
      tagline: 'Get Beach Ready!',
      description: 'Build your base tan before spring break vacation! Limited time pricing.',
      discountPercent: 20,
      discountCode: 'SPRING2026',
      colors: {
        primary: 'from-teal-500 to-cyan-400',
        secondary: 'from-emerald-400 to-teal-500',
        accent: 'teal-500',
        text: 'text-teal-600'
      },
      startDate: new Date(year, 2, 1), // Mar 1
      endDate: new Date(year, 2, 21), // Mar 21
      applicableTo: ['tanning']
    },
    
    // St. Patrick's Day (March 14-17)
    {
      id: 'st-patricks',
      name: "St. Patrick's Day",
      emoji: '☘️',
      tagline: 'Lucky Golden Glow!',
      description: 'Get lucky with our St. Patrick\'s Day deals! Go for the gold!',
      discountPercent: 17,
      discountCode: 'LUCKY17',
      colors: {
        primary: 'from-green-600 to-emerald-500',
        secondary: 'from-green-500 to-lime-400',
        accent: 'green-600',
        text: 'text-green-700'
      },
      startDate: new Date(year, 2, 14), // Mar 14
      endDate: new Date(year, 2, 17), // Mar 17
      applicableTo: ['tanning', 'laundry', 'eats']
    },
    
    // Easter (Week before Easter)
    {
      id: 'easter',
      name: 'Easter Glow-Up',
      emoji: '🐣',
      tagline: 'Spring Into Radiance!',
      description: 'Look radiant for Easter! Special spring savings on all services.',
      discountPercent: 15,
      discountCode: 'EASTER2026',
      colors: {
        primary: 'from-yellow-400 to-pink-400',
        secondary: 'from-purple-300 to-pink-300',
        accent: 'yellow-400',
        text: 'text-purple-600'
      },
      startDate: new Date(easter.getTime() - 7 * 24 * 60 * 60 * 1000), // Week before
      endDate: easter,
      applicableTo: ['tanning', 'laundry']
    },
    
    // Mother's Day (May 4-11, second Sunday)
    {
      id: 'mothers-day',
      name: "Mother's Day Special",
      emoji: '💐',
      tagline: 'Treat Mom to a Glow!',
      description: 'Gift mom the glow she deserves! Perfect Mother\'s Day packages.',
      discountPercent: 20,
      discountCode: 'MOM2026',
      colors: {
        primary: 'from-pink-400 to-rose-400',
        secondary: 'from-fuchsia-300 to-pink-400',
        accent: 'pink-400',
        text: 'text-pink-600'
      },
      startDate: new Date(year, 4, 4), // May 4
      endDate: new Date(year, 4, 11), // May 11
      applicableTo: ['tanning', 'laundry']
    },
    
    // Memorial Day (May 22-26)
    {
      id: 'memorial-day',
      name: 'Memorial Day Sale',
      emoji: '🇺🇸',
      tagline: 'Summer Kickoff Savings!',
      description: 'Kick off summer with our Memorial Day deals! Honor and save.',
      discountPercent: 25,
      discountCode: 'MEMORIAL2026',
      colors: {
        primary: 'from-red-600 to-blue-600',
        secondary: 'from-red-500 to-blue-500',
        accent: 'red-600',
        text: 'text-blue-700'
      },
      startDate: new Date(year, 4, 22), // May 22
      endDate: new Date(year, 4, 26), // May 26
      applicableTo: ['tanning', 'laundry']
    },
    
    // Summer Solstice (June 19-23)
    {
      id: 'summer-solstice',
      name: 'Summer Solstice Sale',
      emoji: '☀️',
      tagline: 'Longest Day, Biggest Savings!',
      description: 'Celebrate the longest day with our hottest deals!',
      discountPercent: 20,
      discountCode: 'SOLSTICE26',
      colors: {
        primary: 'from-orange-500 to-yellow-400',
        secondary: 'from-amber-400 to-orange-400',
        accent: 'orange-500',
        text: 'text-orange-600'
      },
      startDate: new Date(year, 5, 19), // June 19
      endDate: new Date(year, 5, 23), // June 23
      applicableTo: ['tanning']
    },
    
    // 4th of July (June 30 - July 5)
    {
      id: 'july-4th',
      name: 'Independence Day Sale',
      emoji: '🎇',
      tagline: 'Freedom to Glow!',
      description: 'Celebrate America with explosive savings! Red, white, and bronze.',
      discountPercent: 25,
      discountCode: 'USA2026',
      colors: {
        primary: 'from-red-600 via-white to-blue-600',
        secondary: 'from-red-500 to-blue-500',
        accent: 'red-600',
        text: 'text-blue-700'
      },
      startDate: new Date(year, 5, 30), // June 30
      endDate: new Date(year, 6, 5), // July 5
      applicableTo: ['tanning', 'laundry', 'eats']
    },
    
    // Back to School (Aug 1-20)
    {
      id: 'back-to-school',
      name: 'Back to School',
      emoji: '📚',
      tagline: 'Start the Year Glowing!',
      description: 'Students & teachers get ready to shine! Special academic pricing.',
      discountPercent: 15,
      discountCode: 'SCHOOL2026',
      colors: {
        primary: 'from-blue-500 to-indigo-500',
        secondary: 'from-sky-400 to-blue-500',
        accent: 'blue-500',
        text: 'text-blue-600'
      },
      startDate: new Date(year, 7, 1), // Aug 1
      endDate: new Date(year, 7, 20), // Aug 20
      applicableTo: ['tanning', 'laundry']
    },
    
    // Labor Day (Aug 29 - Sept 2)
    {
      id: 'labor-day',
      name: 'Labor Day Weekend',
      emoji: '👷',
      tagline: 'You Work Hard, Save Easy!',
      description: 'Take a break and treat yourself this Labor Day weekend!',
      discountPercent: 20,
      discountCode: 'LABOR2026',
      colors: {
        primary: 'from-amber-500 to-orange-500',
        secondary: 'from-yellow-400 to-amber-500',
        accent: 'amber-500',
        text: 'text-amber-700'
      },
      startDate: new Date(year, 7, 29), // Aug 29
      endDate: new Date(year, 8, 2), // Sept 2
      applicableTo: ['tanning', 'laundry']
    },
    
    // Fall Equinox (Sept 20-24)
    {
      id: 'fall-equinox',
      name: 'Fall Into Savings',
      emoji: '🍂',
      tagline: 'Golden Hour All Season!',
      description: 'Maintain your summer glow through fall! Seasonal specials.',
      discountPercent: 15,
      discountCode: 'FALL2026',
      colors: {
        primary: 'from-orange-600 to-amber-500',
        secondary: 'from-red-400 to-orange-500',
        accent: 'orange-600',
        text: 'text-orange-700'
      },
      startDate: new Date(year, 8, 20), // Sept 20
      endDate: new Date(year, 8, 24), // Sept 24
      applicableTo: ['tanning']
    },
    
    // Halloween (Oct 24 - Oct 31)
    {
      id: 'halloween',
      name: 'Halloween Spooktacular',
      emoji: '🎃',
      tagline: 'Frighteningly Good Deals!',
      description: 'Get a killer tan for Halloween! Spooky savings all week.',
      discountPercent: 20,
      discountCode: 'SPOOKY2026',
      colors: {
        primary: 'from-orange-500 to-purple-600',
        secondary: 'from-orange-400 to-black',
        accent: 'orange-500',
        text: 'text-purple-600'
      },
      startDate: new Date(year, 9, 24), // Oct 24
      endDate: new Date(year, 9, 31), // Oct 31
      applicableTo: ['tanning', 'laundry', 'eats']
    },
    
    // Veterans Day (Nov 9-11)
    {
      id: 'veterans-day',
      name: 'Veterans Day',
      emoji: '🎖️',
      tagline: 'Honoring Those Who Serve!',
      description: 'Special thanks to our veterans! Military discounts available.',
      discountPercent: 25,
      discountCode: 'VETS2026',
      colors: {
        primary: 'from-green-700 to-gray-700',
        secondary: 'from-green-600 to-gray-600',
        accent: 'green-700',
        text: 'text-green-800'
      },
      startDate: new Date(year, 10, 9), // Nov 9
      endDate: new Date(year, 10, 11), // Nov 11
      applicableTo: ['tanning', 'laundry']
    },
    
    // Thanksgiving (Nov 21-28)
    {
      id: 'thanksgiving',
      name: 'Thanksgiving Week',
      emoji: '🦃',
      tagline: 'Thankful for Great Deals!',
      description: 'Give thanks and glow! Pre-holiday specials all week.',
      discountPercent: 20,
      discountCode: 'THANKS2026',
      colors: {
        primary: 'from-amber-600 to-orange-600',
        secondary: 'from-yellow-500 to-amber-600',
        accent: 'amber-600',
        text: 'text-amber-700'
      },
      startDate: new Date(year, 10, 21), // Nov 21
      endDate: new Date(year, 10, 28), // Nov 28
      applicableTo: ['tanning', 'laundry', 'eats']
    },
    
    // Black Friday (Nov 28 - Dec 2)
    {
      id: 'black-friday',
      name: 'Black Friday BOGO',
      emoji: '🛒',
      tagline: 'Buy One Get One FREE!',
      description: 'Our biggest sale of the year! BOGO on all monthly unlimited packages.',
      discountPercent: 50,
      discountCode: 'BOGO2026',
      colors: {
        primary: 'from-gray-900 to-black',
        secondary: 'from-red-600 to-gray-900',
        accent: 'red-600',
        text: 'text-red-600'
      },
      startDate: new Date(year, 10, 28), // Nov 28
      endDate: new Date(year, 11, 2), // Dec 2
      applicableTo: ['tanning', 'laundry']
    },
    
    // Cyber Monday (Dec 1-2)
    {
      id: 'cyber-monday',
      name: 'Cyber Monday',
      emoji: '💻',
      tagline: 'Online Exclusive Deals!',
      description: 'Digital deals you can\'t miss! Order online for extra savings.',
      discountPercent: 25,
      discountCode: 'CYBER2026',
      colors: {
        primary: 'from-cyan-500 to-blue-600',
        secondary: 'from-teal-400 to-cyan-500',
        accent: 'cyan-500',
        text: 'text-cyan-600'
      },
      startDate: new Date(year, 11, 1), // Dec 1
      endDate: new Date(year, 11, 2), // Dec 2
      applicableTo: ['tanning', 'eats']
    },
    
    // Christmas (Dec 15-25)
    {
      id: 'christmas',
      name: 'Christmas Specials',
      emoji: '🎄',
      tagline: 'Gift the Glow!',
      description: 'Holiday cheer and holiday savings! Perfect gift packages available.',
      discountPercent: 20,
      discountCode: 'XMAS2026',
      colors: {
        primary: 'from-red-600 to-green-600',
        secondary: 'from-red-500 to-green-500',
        accent: 'red-600',
        text: 'text-red-700'
      },
      startDate: new Date(year, 11, 15), // Dec 15
      endDate: new Date(year, 11, 25), // Dec 25
      applicableTo: ['tanning', 'laundry', 'eats']
    },
    
    // Founder's Day (Special - Aug 18 - 818 Coshocton Ave tribute)
    {
      id: 'founders-day',
      name: "Founder's Day (8/18)",
      emoji: '🏆',
      tagline: '818 Day Celebration!',
      description: 'Celebrating our address 818 Coshocton Ave! Special anniversary deals.',
      discountPercent: 18,
      discountCode: 'FOUNDERS818',
      colors: {
        primary: 'from-amber-500 to-yellow-400',
        secondary: 'from-yellow-400 to-amber-500',
        accent: 'amber-500',
        text: 'text-amber-700'
      },
      startDate: new Date(year, 7, 17), // Aug 17
      endDate: new Date(year, 7, 19), // Aug 19
      applicableTo: ['tanning', 'laundry', 'eats']
    }
  ];
};

// Get currently active discount(s)
export const getCurrentDiscount = (serviceType = null) => {
  const now = new Date();
  const year = now.getFullYear();
  const discounts = getHolidayDiscounts(year);
  
  // Also check previous year's discounts (for New Year spanning Dec-Jan)
  const prevYearDiscounts = getHolidayDiscounts(year - 1);
  const allDiscounts = [...discounts, ...prevYearDiscounts];
  
  const activeDiscounts = allDiscounts.filter(discount => {
    const isInRange = now >= discount.startDate && now <= discount.endDate;
    const appliesToService = !serviceType || discount.applicableTo.includes(serviceType);
    return isInRange && appliesToService;
  });
  
  // Return the discount with highest percentage if multiple are active
  if (activeDiscounts.length > 0) {
    return activeDiscounts.sort((a, b) => b.discountPercent - a.discountPercent)[0];
  }
  
  // If no holiday discount, return seasonal discount
  return getSeasonalDiscount(now);
};

// Get seasonal discount if no holiday is active
const getSeasonalDiscount = (date) => {
  const month = date.getMonth();
  
  // Winter (Dec, Jan, Feb) - SAD/Winter Blues focus
  if (month === 11 || month === 0 || month === 1) {
    return {
      id: 'winter-wellness',
      name: 'Winter Wellness',
      emoji: '❄️',
      tagline: 'Beat the Winter Blues!',
      description: 'Fight SAD with our winter tanning specials. Boost your vitamin D naturally!',
      discountPercent: 10,
      discountCode: 'WINTER10',
      colors: {
        primary: 'from-blue-400 to-cyan-300',
        secondary: 'from-blue-300 to-sky-200',
        accent: 'blue-400',
        text: 'text-blue-600'
      },
      applicableTo: ['tanning']
    };
  }
  
  // Spring (Mar, Apr, May)
  if (month >= 2 && month <= 4) {
    return {
      id: 'spring-renewal',
      name: 'Spring Renewal',
      emoji: '🌸',
      tagline: 'Refresh Your Glow!',
      description: 'Spring into a new you! Seasonal pricing on packages.',
      discountPercent: 10,
      discountCode: 'SPRING10',
      colors: {
        primary: 'from-green-400 to-lime-300',
        secondary: 'from-emerald-300 to-green-200',
        accent: 'green-400',
        text: 'text-green-600'
      },
      applicableTo: ['tanning', 'laundry']
    };
  }
  
  // Summer (Jun, Jul, Aug)
  if (month >= 5 && month <= 7) {
    return {
      id: 'summer-glow',
      name: 'Summer Glow',
      emoji: '🌞',
      tagline: 'Maintain Your Bronze!',
      description: 'Keep your summer tan all season long with our specials.',
      discountPercent: 10,
      discountCode: 'SUMMER10',
      colors: {
        primary: 'from-yellow-400 to-orange-300',
        secondary: 'from-amber-300 to-yellow-200',
        accent: 'yellow-400',
        text: 'text-amber-600'
      },
      applicableTo: ['tanning']
    };
  }
  
  // Fall (Sep, Oct, Nov)
  return {
    id: 'fall-savings',
    name: 'Fall Savings',
    emoji: '🍁',
    tagline: 'Golden Hour Everyday!',
    description: 'Don\'t let your tan fade! Fall maintenance specials.',
    discountPercent: 10,
    discountCode: 'FALL10',
    colors: {
      primary: 'from-orange-400 to-red-300',
      secondary: 'from-amber-300 to-orange-200',
      accent: 'orange-400',
      text: 'text-orange-600'
    },
    applicableTo: ['tanning', 'laundry']
  };
};

// Get all upcoming discounts for the next 30 days
export const getUpcomingDiscounts = (days = 30, serviceType = null) => {
  const now = new Date();
  const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  const year = now.getFullYear();
  const discounts = getHolidayDiscounts(year);
  
  return discounts.filter(discount => {
    const startsInFuture = discount.startDate > now && discount.startDate <= futureDate;
    const appliesToService = !serviceType || discount.applicableTo.includes(serviceType);
    return startsInFuture && appliesToService;
  }).sort((a, b) => a.startDate - b.startDate);
};

// Format discount for display
export const formatDiscountBanner = (discount) => {
  if (!discount) return null;
  
  return {
    ...discount,
    formattedDiscount: `${discount.discountPercent}% OFF`,
    displayCode: discount.discountCode,
    gradient: `bg-gradient-to-r ${discount.colors.primary}`
  };
};

export default {
  getCurrentDiscount,
  getUpcomingDiscounts,
  formatDiscountBanner,
  getHolidayDiscounts
};
