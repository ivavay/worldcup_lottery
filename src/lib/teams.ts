export type Team = {
  code: string;
  name: string;
  flag: string;
  region: string;
};

export const TEAMS: Team[] = [
  { code: "USA", name: "United States", flag: "🇺🇸", region: "CONCACAF" },
  { code: "CAN", name: "Canada", flag: "🇨🇦", region: "CONCACAF" },
  { code: "MEX", name: "Mexico", flag: "🇲🇽", region: "CONCACAF" },
  { code: "GER", name: "Germany", flag: "🇩🇪", region: "UEFA" },
  { code: "FRA", name: "France", flag: "🇫🇷", region: "UEFA" },
  { code: "ENG", name: "England", flag: "🏴", region: "UEFA" },
  { code: "ESP", name: "Spain", flag: "🇪🇸", region: "UEFA" },
  { code: "POR", name: "Portugal", flag: "🇵🇹", region: "UEFA" },
  { code: "NED", name: "Netherlands", flag: "🇳🇱", region: "UEFA" },
  { code: "BEL", name: "Belgium", flag: "🇧🇪", region: "UEFA" },
  { code: "CRO", name: "Croatia", flag: "🇭🇷", region: "UEFA" },
  { code: "SUI", name: "Switzerland", flag: "🇨🇭", region: "UEFA" },
  { code: "AUT", name: "Austria", flag: "🇦🇹", region: "UEFA" },
  { code: "SCO", name: "Scotland", flag: "🏴", region: "UEFA" },
  { code: "TUR", name: "Turkey", flag: "🇹🇷", region: "UEFA" },
  { code: "NOR", name: "Norway", flag: "🇳🇴", region: "UEFA" },
  { code: "SWE", name: "Sweden", flag: "🇸🇪", region: "UEFA" },
  { code: "CZE", name: "Czechia", flag: "🇨🇿", region: "UEFA" },
  { code: "BIH", name: "Bosnia and Herzegovina", flag: "🇧🇦", region: "UEFA" },
  { code: "BRA", name: "Brazil", flag: "🇧🇷", region: "CONMEBOL" },
  { code: "ARG", name: "Argentina", flag: "🇦🇷", region: "CONMEBOL" },
  { code: "URU", name: "Uruguay", flag: "🇺🇾", region: "CONMEBOL" },
  { code: "COL", name: "Colombia", flag: "🇨🇴", region: "CONMEBOL" },
  { code: "ECU", name: "Ecuador", flag: "🇪🇨", region: "CONMEBOL" },
  { code: "PAR", name: "Paraguay", flag: "🇵🇾", region: "CONMEBOL" },
  { code: "JPN", name: "Japan", flag: "🇯🇵", region: "AFC" },
  { code: "KOR", name: "South Korea", flag: "🇰🇷", region: "AFC" },
  { code: "AUS", name: "Australia", flag: "🇦🇺", region: "AFC" },
  { code: "IRN", name: "Iran", flag: "🇮🇷", region: "AFC" },
  { code: "KSA", name: "Saudi Arabia", flag: "🇸🇦", region: "AFC" },
  { code: "QAT", name: "Qatar", flag: "🇶🇦", region: "AFC" },
  { code: "UZB", name: "Uzbekistan", flag: "🇺🇿", region: "AFC" },
  { code: "JOR", name: "Jordan", flag: "🇯🇴", region: "AFC" },
  { code: "IRQ", name: "Iraq", flag: "🇮🇶", region: "AFC" },
  { code: "MAR", name: "Morocco", flag: "🇲🇦", region: "CAF" },
  { code: "EGY", name: "Egypt", flag: "🇪🇬", region: "CAF" },
  { code: "SEN", name: "Senegal", flag: "🇸🇳", region: "CAF" },
  { code: "GHA", name: "Ghana", flag: "🇬🇭", region: "CAF" },
  { code: "CIV", name: "Ivory Coast", flag: "🇨🇮", region: "CAF" },
  { code: "RSA", name: "South Africa", flag: "🇿🇦", region: "CAF" },
  { code: "ALG", name: "Algeria", flag: "🇩🇿", region: "CAF" },
  { code: "CPV", name: "Cape Verde", flag: "🇨🇻", region: "CAF" },
  { code: "COD", name: "DR Congo", flag: "🇨🇩", region: "CAF" },
  { code: "TUN", name: "Tunisia", flag: "🇹🇳", region: "CAF" },
  { code: "PAN", name: "Panama", flag: "🇵🇦", region: "CONCACAF" },
  { code: "CUW", name: "Curaçao", flag: "🇨🇼", region: "CONCACAF" },
  { code: "HAI", name: "Haiti", flag: "🇭🇹", region: "CONCACAF" },
  { code: "NZL", name: "New Zealand", flag: "🇳🇿", region: "OFC" },
];

export function findTeam(code: string) {
  return TEAMS.find((team) => team.code === code);
}
