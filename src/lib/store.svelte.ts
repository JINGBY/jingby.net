// global store for various components
interface Store {
    globalVolume: number;
}

export let store = $state<Store>({
    globalVolume: (60),
});



// discography
export interface Music {
    title: string;
    cover: string;
    year: number;
    url: string;
    artists?: string[];
    label?: string;
    id?: number;
}

interface Discography {
    music: Music[];
}

import fallCover from "$lib/assets/covers/fall.png";
import driveMeCrazyCover from "$lib/assets/covers/drive-me-crazy.jpeg";
import hereRightNowCover from "$lib/assets/covers/here-right-now.jpg";
import anotherLifeCover from "$lib/assets/covers/another-life.jpg";
import notEasyCover from "$lib/assets/covers/not-easy.jpg";
import anythingCover from "$lib/assets/covers/anything.jpg";
import iGotchuCover from "$lib/assets/covers/i-gotchu-remix.jpg";

export const discography : Discography = ({
    music: [
        {
            title: "Fall",
            cover: fallCover,
            year: 2024,
            url: "https://lnk.dmsmusic.co/variousartists_99",
            label: "Charge Rcrds",
            id: 7
        },
        {
            title: "Drive Me Crazy",
            year: 2023,
            cover: driveMeCrazyCover,
            url: "https://wallacademy.lnk.to/drivemecrazy",
            label: "Wall Academy",
            id: 6
        },
        {
            title: "Here Right Now",
            year: 2023,
            cover: hereRightNowCover,
            url: "https://ffm.to/mln2alz",
            artists: ["Fraxy"],
            id: 5
        },
        {
            title: "Another Life",
            year: 2023,
            cover: anotherLifeCover,
            url: "https://wallrecordings.lnk.to/AnotherLife",
            artists: ["Zach Fox", "Emma Castellino"],
            label: "Wall Recordings",
            id: 4
        },
        {
            title: "Not Easy",
            year: 2023,
            cover: notEasyCover,
            url: "https://hypeddit.com/erdbxk",
            artists: ["hittrr", "Drew Landrs"],
            label: "Charge Rcrds",
            id: 3
        },
        {
            title: "Anything",
            year: 2022,
            cover: anythingCover,
            url: "https://release.studio/jingby-anything",
            label: "Charge Rcrds",
            id: 2
        },
        {
            title: "I Gotchu (JINGBY Remix)",
            year: 2022,
            cover: iGotchuCover,
            url: "https://hypeddit.com/6cxjxm",
            id: 1
        }
    ]
});
