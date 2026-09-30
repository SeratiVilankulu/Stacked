import DuneCover from "@/assets/Dune.jpg";
import HobbitCover from "@/assets/The_Hobbit.jpg";
import FellowshipCover from "@/assets/The_Fellowship.jpg";
import GoodGirlGuideCover from "@/assets/Good_Girls_Guide.jpg";
import OrientExpressCover from "@/assets/Murder_On_The_Express.jpg";
import SteveJobsCover from "@/assets/Steve_Jobs.jpg";
import PrideAndPrejudiceCover from "@/assets/Pride_and_Prejudice.jpg";
import SevenHusbandsCover from "@/assets/Seven_Husbands_Evelyn_Hugo.jpg";
import SapiensCover from "@/assets/Sapiens.jpg";
import HappyPlaceCover from "@/assets/Happy_Place.jpg";
import ShiningCover from "@/assets/The_Shining.jpg";
import MansSearchCover from "@/assets/Mans_Search.jpg";
import ProjectHailMaryCover from "@/assets/Project_Hail_Mary.jpg";
import KiteRunnerCover from "@/assets/Kite_Runner.jpg";
import BookLoversCover from "@/assets/Book_Lovers.jpg";
import StudyInScarletCover from "@/assets/Sherlock_Holmes.jpg";
import MidnightLibraryCover from "@/assets/Midnight_Library.jpg";
import NineteenEightyFourCover from "@/assets/1984.jpg";
import AtomicHabitsCover from "@/assets/Atomic_Habits.jpg";
import BecomingCover from "@/assets/Becoming.jpg";
import BriefAnswersCover from "@/assets/Brief_Answers.jpg";
import CirceCover from "@/assets/Circe .jpg";
import DragonTattooCover from "@/assets/Dragon_Tatoo.jpg";
import EducatedCover from "@/assets/Educateds.jpg";
import GoneGirlCover from "@/assets/Gone_Girl.jpg";
import ItCover from "@/assets/It.jpg";
import LittleLifeCover from "@/assets/Little_Life.jpg";
import SilentPatientCover from "@/assets/Silent_Patient.jpg";
import AlchemistCover from "@/assets/The Alchemist.jpg";
import DaVinciCodeCover from "@/assets/The Da Vinci Code.jpg";
import MartianCover from "@/assets/The_Martian.jpg";
import ThinkingCover from "@/assets/Thinking.jpg";
import MockingbirdCover from "@/assets/To_Kill_A_Mockingbird.jpg";
import CrawdadsCover from "@/assets/Where_The_Crawdads.jpg";

export const PAGE_SIZE = 5;

export const GENRE_LABELS = {
  SCIENCEFICTION: "Sci-Fi",
  FANTASY: "Fantasy",
  ROMANCE: "Romance",
  MYSTERY: "Mystery",
  NONFICTION: "Non-Fiction",
  FICTION: "Fiction",
  PHILOSOPHY: "Philosophy",
  HORROR: "Horror",
};

export const GENRE_STYLES = {
  SCIENCEFICTION: "bg-green-100 text-green-800",
  FANTASY: "bg-orange-soft text-orange-ink",
  ROMANCE: "bg-pink-100 text-pink-800",
  MYSTERY: "bg-mocha/10 text-mocha",
  NONFICTION: "bg-yellow-100 text-yellow-800",
  FICTION: "bg-sky text-teal",
  PHILOSOPHY: "bg-purple-100 text-purple-800",
  HORROR: "bg-red-100 text-red-800",
};

export const STATUS_STYLES = {
  Available: "bg-success/10 text-success",
  Unavailable: "bg-orange-soft text-orange-ink",
};

// TODO: Will remove once endpoit call is made in the frontend
export const SAMPLE_BOOKS = [
  {
    title: "Dune",
    author: "Frank Herbert",
    genre: "SCIENCEFICTION",
    isbn: "9780441172719",
    description:
      "A desert planet becomes the center of political and religious upheaval.",
    status: "Available",
    coverImage: DuneCover,
    total: 5,
  },
  {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    genre: "FANTASY",
    isbn: "9780547928227",
    description:
      "A reluctant homebody is swept into a quest to reclaim a dwarven kingdom.",
    status: "Available",
    coverImage: HobbitCover,
    total: 5,
  },
  {
    title: "The Fellowship of the Ring",
    author: "J.R.R. Tolkien",
    genre: "FANTASY",
    isbn: "9780547928210",
    description:
      "A company sets out to destroy a ring that threatens all of Middle-earth.",
    status: "Available",
    coverImage: FellowshipCover,
    total: 5,
  },
  {
    title: "A Good Girls Guide to Murder",
    author: "Holly Jackson",
    genre: "MYSTERY",
    isbn: "9781984896391",
    description:
      "Five years ago, schoolgirl Andie Bell was murdered by Sal Singh. The police know he did it. Everyone in town knows he did it.",
    status: "Available",
    coverImage: GoodGirlGuideCover,
    total: 3,
  },
  {
    title: "Murder on the Orient Express",
    author: "Agatha Christie",
    genre: "MYSTERY",
    isbn: "9780062693662",
    description: "A detective must solve a killing aboard a snowbound train.",
    status: "Available",
    coverImage: OrientExpressCover,
    total: 5,
  },
  {
    title: "Steve Jobs",
    author: "Walter Isaacson",
    genre: "BIOGRAPHY",
    isbn: "9781451648539",
    description:
      "The life and career of Apple's co-founder, drawn from years of interviews.",
    status: "Available",
    coverImage: SteveJobsCover,
    total: 5,
  },
  {
    title: "The Seven Husbands of Evelyn Hugo",
    author: "Taylor Jenkins Reid",
    genre: "FICTION",
    isbn: "9781501161933",
    description:
      "An aging Hollywood icon finally tells the truth about her many marriages.",
    status: "Available",
    coverImage: SevenHusbandsCover,
    total: 2,
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    genre: "ROMANCE",
    isbn: "9780141439518",
    description:
      "Wit and misunderstanding shape a courtship in Regency England.",
    status: "Available",
    coverImage: PrideAndPrejudiceCover,
    total: 3,
  },
  {
    title: "Sapiens",
    author: "Yuval Noah Harari",
    genre: "NONFICTION",
    isbn: "9780062316097",
    description:
      "A sweeping look at how humankind came to dominate the planet.",
    status: "Unavailable",
    coverImage: SapiensCover,
    total: 0,
  },
  {
    title: "Happy Place",
    author: "Emily Henry",
    genre: "ROMANCE",
    isbn: "9780593441275 ",
    description:
      "An adult romance novel about Harriet and Wyn, a 'perfect' couple that never told their best friends they broke up..",
    status: "Unavailable",
    coverImage: HappyPlaceCover,
    total: 0,
  },
  {
    title: "The Shining",
    author: "Stephen King",
    genre: "HORROR",
    isbn: "9780307743657",
    description:
      "A family's winter at an isolated hotel turns increasingly sinister.",
    status: "Available",
    coverImage: ShiningCover,
    total: 1,
  },
  {
    title: "Man's Search for Meaning",
    author: "Viktor Frankl",
    genre: "PHILOSOPHY",
    isbn: "9780807014295",
    description:
      "A psychiatrist's account of finding purpose while surviving the Holocaust.",
    status: "Available",
    coverImage: MansSearchCover,
    total: 5,
  },
  {
    title: "Project Hail Mary",
    author: "Andy Weir",
    genre: "SCIENCEFICTION",
    isbn: "9780593135204",
    description:
      "A lone astronaut wakes with no memory on a mission to save Earth.",
    status: "Available",
    coverImage: ProjectHailMaryCover,
    total: 5,
  },
  {
    title: "The Kite Runner",
    author: "Khaled Hosseini",
    genre: "FICTION",
    isbn: "9781594631931",
    description:
      "A friendship in Kabul is shadowed by a betrayal that follows into adulthood.",
    status: "Unavailable",
    coverImage: KiteRunnerCover,
    total: 0,
  },
  {
    title: "Book Lover",
    author: "Emily Henry",
    genre: "ROMANCE",
    isbn: "9780593334836  ",
    description:
      "One summer. Two rivals. A plot twist they didn't see coming.... Nora Stephens' life is books",
    status: "Unavailable",
    coverImage: BookLoversCover,
    total: 0,
  },
  {
    title: "Sherlock Holmes: A Study in Scarlet",
    author: "Arthur Conan Doyle",
    genre: "MYSTERY",
    isbn: "9781593082934",
    description:
      "The first case pairing detective Sherlock Holmes with his new companion, Watson.",
    status: "Unavailable",
    coverImage: StudyInScarletCover,
    total: 0,
  },
  {
    title: "The Midnight Library",
    author: "Matt Haig",
    genre: "FICTION",
    isbn: "9780525559474",
    description:
      "A woman gets the chance to live out the lives she never chose.",
    status: "Available",
    coverImage: MidnightLibraryCover,
    total: 1,
  },
  {
    title: "1984",
    author: "George Orwell",
    genre: "FICTION",
    isbn: "9780451524935",
    description:
      "A man quietly rebels against a totalitarian state that watches his every move.",
    status: "Available",
    coverImage: NineteenEightyFourCover,
    total: 4,
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    genre: "NONFICTION",
    isbn: "9780735211292",
    description:
      "A practical guide to building good habits through small, steady changes.",
    status: "Available",
    coverImage: AtomicHabitsCover,
    total: 6,
  },
  {
    title: "Becoming",
    author: "Michelle Obama",
    genre: "NONFICTION",
    isbn: "9781524763138",
    description:
      "The former First Lady reflects on her childhood, career and years in the White House.",
    status: "Available",
    coverImage: BecomingCover,
    total: 3,
  },
  {
    title: "Brief Answers to the Big Questions",
    author: "Stephen Hawking",
    genre: "NONFICTION",
    isbn: "9781984819192",
    description:
      "Hawking's final thoughts on black holes, time travel and the future of humanity.",
    status: "Available",
    coverImage: BriefAnswersCover,
    total: 2,
  },
  {
    title: "Circe",
    author: "Madeline Miller",
    genre: "FANTASY",
    isbn: "9780316556347",
    description:
      "The banished witch of Greek myth finds her own power on a lonely island.",
    status: "Available",
    coverImage: CirceCover,
    total: 3,
  },
  {
    title: "The Girl with the Dragon Tattoo",
    author: "Stieg Larsson",
    genre: "MYSTERY",
    isbn: "9780307454546",
    description:
      "A journalist and a hacker investigate a decades-old disappearance.",
    status: "Unavailable",
    coverImage: DragonTattooCover,
    total: 0,
  },
  {
    title: "Educated",
    author: "Tara Westover",
    genre: "NONFICTION",
    isbn: "9780399590504",
    description:
      "A woman raised off the grid teaches herself enough to earn a PhD from Cambridge.",
    status: "Available",
    coverImage: EducatedCover,
    total: 4,
  },
  {
    title: "Gone Girl",
    author: "Gillian Flynn",
    genre: "MYSTERY",
    isbn: "9780307588371",
    description:
      "A wife vanishes on her anniversary, and her husband becomes the prime suspect.",
    status: "Available",
    coverImage: GoneGirlCover,
    total: 2,
  },
  {
    title: "It",
    author: "Stephen King",
    genre: "HORROR",
    isbn: "9781501142970",
    description:
      "Seven friends return to their hometown to face the shape-shifting evil of their childhood.",
    status: "Available",
    coverImage: ItCover,
    total: 2,
  },
  {
    title: "A Little Life",
    author: "Hanya Yanagihara",
    genre: "FICTION",
    isbn: "9780804172707",
    description:
      "Four friends in New York, bound together by one man's hidden past.",
    status: "Unavailable",
    coverImage: LittleLifeCover,
    total: 0,
  },
  {
    title: "The Silent Patient",
    author: "Alex Michaelides",
    genre: "MYSTERY",
    isbn: "9781250301697",
    description:
      "A woman shoots her husband and never speaks again; her therapist is determined to learn why.",
    status: "Available",
    coverImage: SilentPatientCover,
    total: 3,
  },
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    genre: "FICTION",
    isbn: "9780062315007",
    description:
      "A shepherd boy travels from Spain to Egypt in search of treasure and his personal legend.",
    status: "Available",
    coverImage: AlchemistCover,
    total: 5,
  },
  {
    title: "The Da Vinci Code",
    author: "Dan Brown",
    genre: "MYSTERY",
    isbn: "9780307474278",
    description:
      "A symbologist follows a trail of clues hidden in the works of Leonardo da Vinci.",
    status: "Available",
    coverImage: DaVinciCodeCover,
    total: 4,
  },
  {
    title: "The Martian",
    author: "Andy Weir",
    genre: "SCIENCEFICTION",
    isbn: "9780553418026",
    description:
      "An astronaut stranded on Mars must science his way to survival.",
    status: "Available",
    coverImage: MartianCover,
    total: 3,
  },
  {
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    genre: "NONFICTION",
    isbn: "9780374533557",
    description:
      "A tour of the two systems that drive how we think and make decisions.",
    status: "Available",
    coverImage: ThinkingCover,
    total: 2,
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genre: "FICTION",
    isbn: "9780060935467",
    description:
      "A young girl watches her father defend a Black man falsely accused in the Deep South.",
    status: "Available",
    coverImage: MockingbirdCover,
    total: 5,
  },
  {
    title: "Where the Crawdads Sing",
    author: "Delia Owens",
    genre: "FICTION",
    isbn: "9780735219090",
    description:
      "A girl raised alone in the North Carolina marshes becomes a suspect in a local death.",
    status: "Unavailable",
    coverImage: CrawdadsCover,
    total: 0,
  },
];
