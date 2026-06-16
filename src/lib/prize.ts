import { TEAMS } from "./teams";

export type PrizeTier = "first" | "second" | "third" | "none";

export type TeamPrizeMapping = {
  teamCode: string;
  prize: PrizeTier;
};

export const PRIZE_LABELS: Record<Exclude<PrizeTier, "none">, string> = {
  first: "一等獎",
  second: "二等獎",
  third: "三等獎",
};

export function generatePrizeMapping(first: number, second: number, third: number) {
  const shuffled = [...TEAMS];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const winners = new Map<string, PrizeTier>();
  let cursor = 0;
  for (let i = 0; i < first; i += 1) winners.set(shuffled[cursor++].code, "first");
  for (let i = 0; i < second; i += 1) winners.set(shuffled[cursor++].code, "second");
  for (let i = 0; i < third; i += 1) winners.set(shuffled[cursor++].code, "third");

  return TEAMS.map<TeamPrizeMapping>((team) => ({
    teamCode: team.code,
    prize: winners.get(team.code) ?? "none",
  }));
}

export function getRemainingColumn(prize: PrizeTier) {
  if (prize === "first") return "first_prize_remaining";
  if (prize === "second") return "second_prize_remaining";
  if (prize === "third") return "third_prize_remaining";
  return null;
}
