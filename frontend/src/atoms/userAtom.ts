import { atom } from "jotai";
import { UserInfo } from "../types/user";

// Atom for user information
export const userAtom = atom<UserInfo | null>(null);
