type friend_request = {
    id: string;
    status: boolean;
    from_user: {
        id: string;
        username: string;
        email: string;
        avatar_url: string | null;
    }[];
}