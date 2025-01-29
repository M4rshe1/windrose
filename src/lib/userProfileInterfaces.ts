import {Country, Saved, Social, Tour, TourSection, User} from "@prisma/client";

export interface ExtendedTour extends Tour {
    heroImage: { fileKey: string } | null;
    sections: ExtendedTourSection[];
}

export interface ExtendedTourSection extends TourSection {
    country: Country | null;
}

export interface ExtendedTourToUser {
    tour: ExtendedTour;
}

export interface ExtendedUser extends User {
    TourToUser: ExtendedTourToUser[];
    Social: Social[];
    Saved: Saved[];
    image: { fileKey: string } | null;
}