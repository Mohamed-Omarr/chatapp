type register = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}
type login = {
    email: string;
    password: string;
}

type UserData = {
  id: number;
  name: string;
  email: string;
  avatar: string | undefined;
}


type FriendRequest = {
  id: string
  status: string
  userId: string
  email: string
  username: string
  avatar_url?: string | null
}


// Flat friend type because server already returns normalized profiles
type Friend = {
  id: string;
  username: string;
  avatar_url: string | null;
};