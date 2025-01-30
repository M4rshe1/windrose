import {Country, Saved, Social, Tour, TourSection, TourToUser, User} from "@prisma/client";

export interface ExtendedTour extends Tour {
    heroImage: { fileKey: string } | null;
    sections: ExtendedTourSection[];
    TourToUser: ExtendedTourToUser[];
}

export interface ExtendedTourSection extends TourSection {
    country: Country | null;
}

export interface ExtendedTourToUser extends TourToUser {
    user: UserWithImage;
}

export interface UserWithImage extends User {  
    image: { fileKey: string } | null;
}

export interface ExtendedUser extends User {
    Social: Social[];
    Saved: Saved[];
    image: { fileKey: string } | null;
}