import { createClient } from "@sanity/client";
import singletons from "./singletons";

const memeUrls = [
  "https://i.imgflip.com/30b1gx.jpg",
  "https://i.imgflip.com/1ur9b0.jpg",
  "https://i.imgflip.com/4/3vzej.jpg",
];

function memeImage() {
  const url = memeUrls[Math.floor(Math.random() * memeUrls.length)];
  const proxyPath = url.replace(/^https?:\/\//, "");
  const resizedUrl = `https://images.weserv.nl/?url=${encodeURIComponent(proxyPath)}&w=240&h=160&fit=cover`;
  return {
    _type: "image",
    asset: {
      _type: "reference",
      _ref: url,
      url: resizedUrl,
      originalUrl: url,
      metadata: {
        dimensions: { width: 240, height: 160 },
        lqip: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMCcgaGVpZ2h0PScxMCc+PHJlY3Qgd2lkdGg9JzEwJyBoZWlnaHQ9JzEwJyBmaWxsPScjZGRkJy8+PC9zdmc+",
      },
    },
  };
}

function shortText() {
  return "placeholder";
}

function mediumText() {
  return "Eugene bhaiya ne bola hai Placeholder";
}

function longText() {
  return "again placeholder";
}

function generatePlaceholder(type) {
  if (type === "home") {
    return {
      hero: {
        head: mediumText(),
        subhead: shortText(),
        sliderImages: [memeImage(), memeImage()],
        sliderImagesMobile: [memeImage()],
        buttonText: shortText(),
        buttonLink: "#",
      },
      about: {
        head: mediumText(),
        text: longText(),
        stats: [
          { _key: "s1", number: 10, title: shortText() },
          { _key: "s2", number: 5, title: shortText() },
        ],
      },
      featured: [
        { _key: "f1", image: memeImage(), instaHandle: "@placeholder" },
      ],
      story: { head: mediumText(), storygrams: [], buttonLink: "#", buttonText: shortText() },
    };
  }

  if (type === "logo") {
    return { image: memeImage() };
  }

  if (type === "contact") {
    return { heading: mediumText(), subheading: longText() };
  }

  if (type === "navbarLink") {
    return [
      { _id: "nav-1", name: shortText(), link: "#" },
      { _id: "nav-2", name: shortText(), link: "#" },
    ];
  }

  if (type === "socialLink") {
    return [
      { _id: "soc-1", name: "instagram", link: "#", text: shortText() },
      { _id: "soc-2", name: "facebook", link: "#", text: shortText() },
    ];
  }

  if (type === "wallpaper" || type === "featured") {
    return [
      { _key: "wp1", image: memeImage(), title: mediumText() },
      { _key: "wp2", image: memeImage(), title: mediumText() },
    ];
  }

  if (type === "about") {
    return {
      head: mediumText(),
      intro: longText(),
      teamIntro: shortText(),
    };
  }

  if (type === "collections") {
    return [
      { _key: "c1", title: mediumText(), image: memeImage() },
      { _key: "c2", title: mediumText(), image: memeImage() },
    ];
  }

  if (type === "recruitment") {
    return {
      heading: mediumText(),
      description: longText(),
      openPositions: [
        { _key: "p1", title: shortText(), description: shortText() },
      ],
    };
  }

  if (type === "storygram") {
    return [
      { _key: "s1", image: memeImage(), caption: shortText() },
      { _key: "s2", image: memeImage(), caption: shortText() },
    ];
  }

  if (type === "timeline") {
    return [
      { _key: "t1", year: "2020", title: mediumText(), description: shortText() },
      { _key: "t2", year: "2022", title: mediumText(), description: shortText() },
    ];
  }

  if (type === "wallpapers") {
    return [
      { _key: "wp-a", image: memeImage(), title: mediumText() },
      { _key: "wp-b", image: memeImage(), title: mediumText() },
    ];
  }

  if (type === "team") {
    return { members: [{ _key: "m1", name: shortText(), role: shortText(), photo: memeImage() }] };
  }

  if (type === "reel") {
    return { items: [{ _key: "r1", title: shortText(), url: "#" }] };
  }

  return [];
}

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  apiVersion: process.env.SANITY_API_VERSION,
  useCdn: true,
});

const replaceRefs = async (data) => {
  if (!data) return data;
  if (Array.isArray(data)) {
    return await Promise.all(data.map((item) => replaceRefs(item)));
  }

  if (typeof data === "object") {
    if (data._ref) {
      const refDoc = await client.getDocument(data._ref);
      return await replaceRefs(refDoc);
    }

    await Promise.all(
      Object.keys(data).map(async (key) => {
        data[key] = await replaceRefs(data[key]);
      }),
    );
  }

  return data;
};

export default async function fetchData(type, filters = {}, selector = "") {
  try {
    const filterString = Object.keys(filters)
      .map((key) => `&& ${key} == "${filters[key]}"`)
      .join(" ");
    const queryString = `*[_type == "${type}" ${filterString}]${selector}`;
    const data = await client.fetch(queryString);
    const completeData = await replaceRefs(data);

    const isEmptyArray = Array.isArray(completeData) && completeData.length === 0;
    const isEmptyObject =
      completeData && typeof completeData === "object" && Object.keys(completeData).length === 0;

    if (!completeData || isEmptyArray || isEmptyObject) {
      const placeholder = generatePlaceholder(type);
      if (singletons.includes(type)) return placeholder;
      return placeholder;
    }

    if (Array.isArray(completeData) && singletons.includes(type)) {
      return completeData[0];
    }

    return completeData;
  } catch (error) {
    console.error(error);
    return null;
  }
}
