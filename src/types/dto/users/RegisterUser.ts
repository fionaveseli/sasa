export interface RegisterUser {
    fullName: string;
    email: string;
    password: string;
    role: "admin" | "university_manager" | "student";
    graduationYear: number;
    timeZone: string;
    university_id?: number;
  }