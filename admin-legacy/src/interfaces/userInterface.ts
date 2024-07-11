export interface User {
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  profile_photo_url: string | null;
  name: string;
  profile_photo_url_signed: string;
}

export interface Role {
  name: string;
}

export interface Property {
  id:number,
  name:string
  Address: Address | null;
}

export interface UserData {
  user: UserData | null;
  id: number;
  User: User;
  role_id: number;
  Role: Role;
  OwnedProperties: Property[];
}

export interface Address {
  area:    string;
  city:    string;
  pincode: string;
}

