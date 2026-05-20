import { api } from "./api";

export type UserStatisImage = {
  id: number;
  filename?: string;
  url: string;
  ownerId?: number;
  ownerType?: string;
  createdAt?: string;
};

export type LeaderboardUser = {
  firstName: string;
  lastName: string;
  score: number;
  id: number;
  rank: number;
  isMe: boolean;
  images: UserStatisImage[];
};

export type UserStatisResponse = {
  leaderboard: LeaderboardUser[];
  rank: number;
  score: number;
};

export async function apiFetchUserStatis(): Promise<UserStatisResponse> {
  const res = await api.post("/user/statis");
  const raw = res.data || {};

  const leaderboard = Array.isArray(raw.leaderboard) ? raw.leaderboard : [];

  return {
    leaderboard,
    rank: Number(raw.rank ?? 0),
    score: Number(raw.score ?? 0),
  };
}
