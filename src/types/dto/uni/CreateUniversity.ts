type CreateUniversity = {
    message: string;
    token: string;
    university: {
      id: number;
      name: string;
      email_domain: string;
      location: string;
      contact_info: string;
      logo: string | null;
      banner_color: string;
      bio: string;
      manager_id: number;
      createdAt: string;
      updatedAt: string;
    };
    user: {
      id: number;
      fullName: string;
      email: string;
      role: string;
      university_id: number;
    };
  };
  