export const SITE = {
  website: "https://dzakiazhari.com/", // replace this with your deployed domain
  author: "Dzaki Azhar",
  profile: "https://dzakiazhari.com/",
  desc: "Thoughts, stories and ideas. A blog by Dzaki Azhari. Unfold a world of insights and growth on the blog.",
  title: "Unfold",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 4,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true, // show back button in post detail
  editPost: {
    enabled: true,
    text: "Suggest Changes",
    url: "https://github.com/dzakiazhari/astro-blog/edit/main/",
  },
  dynamicOgImage: true,
  lang: "en", // html lang code. Set this empty and default will be "en"
  timezone: "Asia/Tokyo", // Default global timezone (IANA format) https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
} as const;
