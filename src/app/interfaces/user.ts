export interface User {
  email: string,
  fullName: string,
  photoURL: string,
  trips: number,
  challenges: number,
  friends: number,
  faculty: string,
  gender: number,
  firstTime: boolean,
  customPhoto: {
    filePath: string
  }
  preferences: {
    edited: boolean,
    experience: string,
    location: string,
    medkit: boolean,
    punch_out: boolean,
    road_preference: string,
    speed: string,
    exit_preference: string
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
  firstTime: null,
  customPhoto: {
    filePath: null
  },
  preferences: {
    edited: false,
    experience: null,
    location: null,
    medkit: null,
    punch_out: null,
    road_preference: null,
    speed: null,
    exit_preference: null
  }
}
