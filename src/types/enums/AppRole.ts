export enum AppRole {
    Admin = "admin",
    UniversityManager = "university_manager",
    Student = "student",
  }
  
  export const RoleLabels: Record<AppRole, string> = {
    [AppRole.Admin]: "Admin",
    [AppRole.UniversityManager]: "University Manager",
    [AppRole.Student]: "Student",
  };
  