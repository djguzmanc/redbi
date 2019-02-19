export interface User {
  email: string,
  fullName: string,
  photoURL: string,
  trips: number,
  challenges: number,
  friends: number,
  faculty: string,
  gender: number,
  preferences: {
    edited: boolean,
    experience: number,
    location: string,
    medkit: boolean,
    punch_out: boolean,
    road_preference: number,
    speed: number
  }
}

export const DEFAULT_USER: User = {
  email: null,
  fullName: null,
  photoURL: null,
  trips: 0,
  challenges: 0,
  friends: 0,
  faculty: null,
  gender: null,
  preferences: {
    edited: false,
    experience: 0,
    location: null,
    medkit: false,
    punch_out: false,
    road_preference: 0,
    speed: 0
  }
}
