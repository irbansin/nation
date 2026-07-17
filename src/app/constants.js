export const SUPPORTED_COUNTRIES = ['IN', 'US', 'FR', 'DE', 'JP', 'IT', 'BE', 'IE', 'AT', 'NL', 'UA', 'YE'];

export const MOCK_COUNTRY_NAMES = {
  'IN': 'India',
  'US': 'United States',
  'FR': 'France',
  'DE': 'Germany',
  'JP': 'Japan',
  'IT': 'Italy',
  'BE': 'Belgium',
  'IE': 'Ireland',
  'AT': 'Austria',
  'NL': 'Netherlands',
  'UA': 'Ukraine',
  'YE': 'Yemen',
  'GB': 'United Kingdom'
};

export const LOCAL_TEMPLATES = {
  IN: `
    <div class="flag-wrapper flag-in-wrapper">
      <div class="flag-india">
        <div class="band saffron"></div>
        <div class="band white">
          <div class="chakra-container">
            <img src="assets/ashok-Chakra.svg" alt="Ashok Chakra" class="ashok-chakra" id="in-chakra"/>
          </div>
        </div>
        <div class="band green"></div>
      </div>
    </div>
    <div class="country-info">
      <h2 class="country-name">Namaste! You are in India 🇮🇳</h2>
      <p class="country-details">Welcome to the land of diversity, culture, and heritage.</p>
    </div>
  `,
  US: `
    <div class="flag-wrapper flag-us-wrapper">
      <div class="flag-usa" id="usa-flag-container">
        <div class="canton" id="usa-canton"></div>
        <div class="stripes-container">
          <div class="stripe red"></div>
          <div class="stripe white"></div>
          <div class="stripe red"></div>
          <div class="stripe white"></div>
          <div class="stripe red"></div>
          <div class="stripe white"></div>
          <div class="stripe red"></div>
          <div class="stripe white"></div>
          <div class="stripe red"></div>
          <div class="stripe white"></div>
          <div class="stripe red"></div>
          <div class="stripe white"></div>
          <div class="stripe red"></div>
        </div>
      </div>
    </div>
    <div class="country-info">
      <h2 class="country-name">Hello! You are in the USA 🇺🇸</h2>
      <p class="country-details">Welcome to the land of opportunity and freedom.</p>
    </div>
  `,
  FR: `
    <div class="flag-wrapper">
      <div class="flag-vertical-tricolor french-flag">
        <div class="stripe blue"></div>
        <div class="stripe white"></div>
        <div class="stripe red"></div>
      </div>
    </div>
    <div class="country-info">
      <h2 class="country-name">Bonjour! You are in France 🇫🇷</h2>
      <p class="country-details">Welcome to the land of art, gastronomy, and romance.</p>
    </div>
  `,
  DE: `
    <div class="flag-wrapper">
      <div class="flag-horizontal-tricolor german-flag">
        <div class="stripe black"></div>
        <div class="stripe red"></div>
        <div class="stripe gold"></div>
      </div>
    </div>
    <div class="country-info">
      <h2 class="country-name">Hallo! You are in Germany 🇩🇪</h2>
      <p class="country-details">Welcome to the heart of Europe, known for its rich history and engineering.</p>
    </div>
  `,
  JP: `
    <div class="flag-wrapper">
      <div class="flag-japan">
        <div class="red-disk"></div>
      </div>
    </div>
    <div class="country-info">
      <h2 class="country-name">Konnichiwa! You are in Japan 🇯🇵</h2>
      <p class="country-details">Welcome to the land of the rising sun, blending ancient traditions with futuristic technology.</p>
    </div>
  `,
  IT: `
    <div class="flag-wrapper">
      <div class="flag-vertical-tricolor italian-flag">
        <div class="stripe green"></div>
        <div class="stripe white"></div>
        <div class="stripe red"></div>
      </div>
    </div>
    <div class="country-info">
      <h2 class="country-name">Ciao! You are in Italy 🇮🇹</h2>
      <p class="country-details">Welcome to the cradle of the Roman Empire and the Renaissance, famous for food and fashion.</p>
    </div>
  `,
  BE: `
    <div class="flag-wrapper">
      <div class="flag-vertical-tricolor belgian-flag">
        <div class="stripe black"></div>
        <div class="stripe yellow"></div>
        <div class="stripe red"></div>
      </div>
    </div>
    <div class="country-info">
      <h2 class="country-name">Bonjour / Hallo! You are in Belgium 🇧🇪</h2>
      <p class="country-details">Welcome to the home of fine chocolates, waffles, and the European Union headquarters.</p>
    </div>
  `,
  IE: `
    <div class="flag-wrapper">
      <div class="flag-vertical-tricolor irish-flag">
        <div class="stripe green"></div>
        <div class="stripe white"></div>
        <div class="stripe orange"></div>
      </div>
    </div>
    <div class="country-info">
      <h2 class="country-name">Fáilte! You are in Ireland 🇮🇪</h2>
      <p class="country-details">Welcome to the Emerald Isle, famous for its folklore, music, and beautiful green landscapes.</p>
    </div>
  `,
  AT: `
    <div class="flag-wrapper">
      <div class="flag-horizontal-tricolor austrian-flag">
        <div class="stripe red"></div>
        <div class="stripe white"></div>
        <div class="stripe red"></div>
      </div>
    </div>
    <div class="country-info">
      <h2 class="country-name">Hallo! You are in Austria 🇦🇹</h2>
      <p class="country-details">Welcome to the capital of classical music, alpine landscapes, and historic imperial palaces.</p>
    </div>
  `,
  NL: `
    <div class="flag-wrapper">
      <div class="flag-horizontal-tricolor dutch-flag">
        <div class="stripe red"></div>
        <div class="stripe white"></div>
        <div class="stripe blue"></div>
      </div>
    </div>
    <div class="country-info">
      <h2 class="country-name">Hallo! You are in the Netherlands 🇳🇱</h2>
      <p class="country-details">Welcome to the land of tulips, windmills, and beautiful canal networks.</p>
    </div>
  `,
  UA: `
    <div class="flag-wrapper">
      <div class="flag-horizontal-bicolor ukrainian-flag">
        <div class="stripe blue"></div>
        <div class="stripe yellow"></div>
      </div>
    </div>
    <div class="country-info">
      <h2 class="country-name">Vitayu! You are in Ukraine 🇺🇦</h2>
      <p class="country-details">Welcome to the land of golden wheat fields under clear blue skies.</p>
    </div>
  `,
  YE: `
    <div class="flag-wrapper">
      <div class="flag-horizontal-tricolor yemeni-flag">
        <div class="stripe red"></div>
        <div class="stripe white"></div>
        <div class="stripe black"></div>
      </div>
    </div>
    <div class="country-info">
      <h2 class="country-name">Marhaban! You are in Yemen 🇾🇪</h2>
      <p class="country-details">Welcome to the land of ancient mud-brick skyscrapers and rich trade history.</p>
    </div>
  `
};
