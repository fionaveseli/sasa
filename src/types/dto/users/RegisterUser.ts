export interface RegisterUser {
    fullName: string;
    email: string;
    password: string;
    role: "Admin" | "University_Manager" | "Student";
    graduationYear: number;
    timeZone: string;
    university_id?: number;
  }