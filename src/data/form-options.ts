export const countries = [
  { value: "fr", label: "France", flag: "🇫🇷" },
  { value: "be", label: "Belgique", flag: "🇧🇪" },
  { value: "ch", label: "Suisse", flag: "🇨🇭" },
  { value: "lu", label: "Luxembourg", flag: "🇱🇺" },
  { value: "de", label: "Allemagne", flag: "🇩🇪" },
  { value: "it", label: "Italie", flag: "🇮🇹" },
  { value: "es", label: "Espagne", flag: "🇪🇸" },
  { value: "nl", label: "Pays-Bas", flag: "🇳🇱" },
  { value: "at", label: "Autriche", flag: "🇦🇹" },
  { value: "mc", label: "Monaco", flag: "🇲🇨" },
  { value: "gb", label: "Royaume-Uni", flag: "🇬🇧" },
  { value: "us", label: "États-Unis", flag: "🇺🇸" },
  { value: "ca", label: "Canada", flag: "🇨🇦" },
  { value: "au", label: "Australie", flag: "🇦🇺" },
  { value: "nz", label: "Nouvelle-Zélande", flag: "🇳🇿" },
  { value: "sg", label: "Singapour", flag: "🇸🇬" },
  { value: "hk", label: "Hong Kong", flag: "🇭🇰" },
  { value: "jp", label: "Japon", flag: "🇯🇵" },
  // Autres pays de l'UE
  { value: "se", label: "Suède", flag: "🇸🇪" },
  { value: "fi", label: "Finlande", flag: "🇫🇮" },
  { value: "dk", label: "Danemark", flag: "🇩🇰" },
  { value: "ie", label: "Irlande", flag: "🇮🇪" },
  { value: "pt", label: "Portugal", flag: "🇵🇹" },
  { value: "gr", label: "Grèce", flag: "🇬🇷" },
  { value: "pl", label: "Pologne", flag: "🇵🇱" },
  { value: "cz", label: "Tchéquie", flag: "🇨🇿" },
  { value: "hu", label: "Hongrie", flag: "🇭🇺" },
  { value: "sk", label: "Slovaquie", flag: "🇸🇰" },
  { value: "si", label: "Slovénie", flag: "🇸🇮" },
  { value: "hr", label: "Croatie", flag: "🇭🇷" },
  { value: "ro", label: "Roumanie", flag: "🇷🇴" },
  { value: "bg", label: "Bulgarie", flag: "🇧🇬" },
  { value: "lt", label: "Lituanie", flag: "🇱🇹" },
  { value: "lv", label: "Lettonie", flag: "🇱🇻" },
  { value: "ee", label: "Estonie", flag: "🇪🇪" },
  { value: "cy", label: "Chypre", flag: "🇨🇾" },
  { value: "mt", label: "Malte", flag: "🇲🇹" },
  // Autres pays pertinents
  { value: "cn", label: "Chine", flag: "🇨🇳" },
  { value: "kr", label: "Corée du Sud", flag: "🇰🇷" },
  { value: "ae", label: "Émirats arabes unis", flag: "🇦🇪" },
  { value: "qa", label: "Qatar", flag: "🇶🇦" },
  { value: "sa", label: "Arabie saoudite", flag: "🇸🇦" },
  { value: "il", label: "Israël", flag: "🇮🇱" },
  { value: "tr", label: "Turquie", flag: "🇹🇷" },
  { value: "no", label: "Norvège", flag: "🇳🇴" },
  { value: "is", label: "Islande", flag: "🇮🇸" },
  { value: "mx", label: "Mexique", flag: "🇲🇽" },
  { value: "br", label: "Brésil", flag: "🇧🇷" },
  { value: "ot", label: "Other", flag: "🌍" },
] as const


export const titles = [
  { value: "mr", label: "Mr." },
  { value: "mrs", label: "Mrs." },
] as const

export const languages = [
  { value: "fr", label: "Français" },
  { value: "en", label: "English" },
  { value: "de", label: "Deutsch" },
  { value: "it", label: "Italiano" },
  { value: "es", label: "Español" },
  { value: "nl", label: "Nederlands" },
  { value: "pt", label: "Português" },
  { value: "ru", label: "Русский" },
  { value: "zh", label: "中文" },
  { value: "ja", label: "日本語" },
  { value: "ko", label: "한국어" },
  { value: "ar", label: "العربية" },
] as const

export const phonePrefixes = [
  { value: "+33", label: "France (+33)" },
  { value: "+32", label: "Belgique (+32)" },
  { value: "+41", label: "Suisse (+41)" },
  { value: "+352", label: "Luxembourg (+352)" },
  { value: "+49", label: "Allemagne (+49)" },
  { value: "+39", label: "Italie (+39)" },
  { value: "+34", label: "Espagne (+34)" },
  { value: "+31", label: "Pays-Bas (+31)" },
  { value: "+43", label: "Autriche (+43)" },
  { value: "+377", label: "Monaco (+377)" },
  { value: "+44", label: "Royaume-Uni (+44)" },
  { value: "+1-us", label: "États-Unis (+1)" },
  { value: "+1-ca", label: "Canada (+1)" },
  { value: "+61", label: "Australie (+61)" },
  { value: "+65", label: "Singapour (+65)" },
  { value: "+852", label: "Hong Kong (+852)" },
] as const

// Type definitions for the options
export type Country = typeof countries[number]["value"]
export type Title = typeof titles[number]["value"]
export type Language = typeof languages[number]["value"]
export type PhonePrefix = typeof phonePrefixes[number]["value"]