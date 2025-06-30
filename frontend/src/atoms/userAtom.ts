import { atomWithStorage } from "jotai/utils";

export interface User {
  name: string;
  token: string;
}

export const userAtom = atomWithStorage<User | null>("user", null);
