export const WHATSAPP = "919953105738";
export const PHONE1 = "+91-9953105738";
export const PHONE2 = "011-49324607";
export const EMAIL = "ssiearthmovers@gmail.com";
export const ADDRESS_SHORT = "Near Mori Gate, New Delhi – 110006";
export const HOURS = "Mon–Sat, 9:30 AM – 6:30 PM";

export const ALL_PART_TYPES = [
  "Cutting Edges",
  "Grader Blades",
  "Scarifier Teeth & Ripper Tips",
  "End Bits & Corner Bits",
  "Circle Segments",
  "Draw Bar Parts & Pins",
  "Hydraulic Seals & Components",
];

export type PartCategory =
  | "sprocket" | "bushing" | "brake" | "hub" | "gear" | "shaft"
  | "ring-gear" | "sleeve" | "plate" | "pin" | "joint" | "seal"
  | "hydraulic" | "end-bit" | "general";

export type BrandPart = {
  name: string;
  partNo: string;
  model: string;
  category: PartCategory;
  img?: string;
};

export const PART_CATEGORY_IMG: Record<PartCategory, string> = {
  sprocket:  "/images/part-types/sprocket.jpg",
  bushing:   "/images/part-types/bushing.jpg",
  brake:     "/images/part-types/brake.jpg",
  hub:       "/images/part-types/hub.jpg",
  gear:      "/images/part-types/gear-shaft.jpg",
  shaft:     "/images/part-types/gear-shaft.jpg",
  "ring-gear": "/images/part-types/ring-gear.jpg",
  sleeve:    "/images/part-types/sleeve.jpg",
  plate:     "/images/part-types/sleeve.jpg",
  pin:       "/images/part-types/hub-disc.jpg",
  joint:     "/images/part-types/hub-disc.jpg",
  seal:      "/images/part-types/bushing.jpg",
  hydraulic: "/images/part-types/hub-disc.jpg",
  "end-bit": "/images/part-types/brake.jpg",
  general:   "/images/part-types/hub.jpg",
};

export type BrandInfo = {
  slug: string;
  name: string;
  fullName: string;
  country: string;
  models: string[];
  color: string;
  tagline: string;
  description: string;
  longDescription: string;
  keyParts: string[];
  parts: BrandPart[];
  img: string;
  metaTitle: string;
  metaDesc: string;
  faqs: { q: string; a: string }[];
  gallery?: {
    featuredParts: Array<{ name: string; img: string }>;
    collageParts: string[];
  };
};

export const brands: BrandInfo[] = [
  {
    slug: "cat",
    name: "CAT",
    fullName: "Caterpillar",
    country: "USA",
    models: ["CAT 120K", "CAT 120H", "CAT 140H"],
    color: "#F5A623",
    tagline: "Complete spare parts for Caterpillar motor graders in India",
    description:
      "Caterpillar (CAT) motor graders are the most widely deployed machines on India's road construction and highway projects. SSI Earthmovers stocks a comprehensive range of CAT grader spare parts for the 120K, 120H and 140H models — ready for same-day dispatch from New Delhi.",
    longDescription:
      "SSI Earthmovers is India's trusted source for Caterpillar motor grader spare parts. With 30+ years of experience, we supply OEM-quality cutting edges, grader blades, scarifier teeth, end bits, circle segments and draw bar components specifically manufactured for CAT 120K, 120H and 140H models. Our Hardox 400 and 500 grade cutting edges offer up to 3× the wear life of standard edges, reducing downtime on your projects. We serve road construction contractors, highway agencies, quarry operators and infrastructure companies across all 28 states. No minimum order quantity for catalogue items. Bulk pricing available for fleet operators. All parts dispatched same day from our Mori Gate, New Delhi warehouse.",
    keyParts: [
      "Cutting Edges (14-hole, 16-hole)",
      "Grader Blades (14ft, 16ft)",
      "Scarifier Teeth & Shanks",
      "End Bits & Corner Bits",
      "Circle Segments & Ring Gear",
      "Draw Bar Pins & Bushings",
      "Hydraulic Cylinder Seals",
    ],
    parts: [
      { name: "Tooth Point",        partNo: "6Y5230",               model: "CAT 120K/H, 140H", category: "end-bit" },
      { name: "Washer Thrust",      partNo: "2G8615",               model: "CAT 120K/H, 140H", category: "plate" },
      { name: "Washer",             partNo: "2G8626",               model: "CAT 120K/H, 140H", category: "plate" },
      { name: "Yoke",               partNo: "2618541",              model: "CAT 120K/H, 140H", category: "joint" },
      { name: "Yoke",               partNo: "3269040",              model: "CAT 120K/H, 140H", category: "joint" },
      { name: "Washer",             partNo: "2G5673",               model: "CAT 120K/H, 140H", category: "plate" },
      { name: "Component",          partNo: "1P7521",               model: "CAT 120K/H, 140H", category: "general" },
      { name: "Cover",              partNo: "5T-0906",              model: "CAT 120K/H, 140H", category: "general" },
      { name: "Sprocket",           partNo: "8W-8286 / 2G-6377",   model: "CAT 120K/H, 140H", category: "sprocket" },
      { name: "Sprocket",           partNo: "8W-8289 / 8D-8787 / 2G-6378", model: "CAT 120K/H, 140H", category: "sprocket" },
      { name: "Strip Wear",         partNo: "5T8366",               model: "CAT 120K/H, 140H", category: "plate" },
      { name: "Retainer",           partNo: "219-2437",             model: "CAT 120K/H, 140H", category: "general" },
      { name: "Ball",               partNo: "6G5442",               model: "CAT 120K/H, 140H", category: "general" },
      { name: "Bar Spreader (Balance Rod)", partNo: "8D5949",       model: "CAT 120K/H, 140H", category: "general" },
      { name: "Bearing Sleeve",     partNo: "2G7388",               model: "CAT 120K/H, 140H", category: "sleeve" },
      { name: "Bearing Sleeve",     partNo: "1461843",              model: "CAT 120K/H, 140H", category: "sleeve" },
      { name: "Gear",               partNo: "6G5533",               model: "CAT 120K/H, 140H", category: "gear" },
      { name: "Housing",            partNo: "8X3395",               model: "CAT 120K/H, 140H", category: "hub" },
      { name: "Lever",              partNo: "3405470 / 1011970",    model: "CAT 120K/H, 140H", category: "general" },
      { name: "Lever",              partNo: "3405472",              model: "CAT 120K/H, 140H", category: "general" },
      { name: "Lock",               partNo: "5K1459",               model: "CAT 120K/H, 140H", category: "general" },
      { name: "Pin",                partNo: "8D2429",               model: "CAT 120K/H, 140H", category: "pin" },
      { name: "Pin",                partNo: "AS-1303595",           model: "CAT 120K/H, 140H", category: "pin" },
      { name: "Pinion",             partNo: "8W5092",               model: "CAT 120K/H, 140H", category: "gear" },
      { name: "Piston",             partNo: "2G5369",               model: "CAT 120K/H, 140H", category: "hydraulic" },
      { name: "Plate",              partNo: "8W1749",               model: "CAT 120K/H, 140H", category: "plate" },
      { name: "Plate Washer",       partNo: "5D5206",               model: "CAT 120K/H, 140H", category: "plate" },
      { name: "Pulley",             partNo: "1079579",              model: "CAT 120K/H, 140H", category: "general" },
      { name: "Shaft Pin",          partNo: "330-6877",             model: "CAT 120K/H, 140H", category: "pin" },
      { name: "Shaft",              partNo: "3071958",              model: "CAT 120K/H, 140H", category: "shaft" },
      { name: "Shank Ripper",       partNo: "9F5124",               model: "CAT 120K/H, 140H", category: "end-bit" },
      { name: "Shim",               partNo: "6G1915",               model: "CAT 120K/H, 140H", category: "plate" },
      { name: "Shoe",               partNo: "5T2926",               model: "CAT 120K/H, 140H", category: "brake" },
      { name: "Shoe",               partNo: "6G4526",               model: "CAT 120K/H, 140H", category: "brake" },
      { name: "Spindle",            partNo: "1473309",              model: "CAT 120K/H, 140H", category: "shaft" },
      { name: "Spring AS CYL",      partNo: "2360737",              model: "CAT 120K/H, 140H", category: "hydraulic" },
      { name: "Strip Wear (Fibre)", partNo: "5T2925",               model: "CAT 120K/H, 140H", category: "plate" },
      { name: "Strip Wear (GMTL)",  partNo: "5T2925",               model: "CAT 120K/H, 140H", category: "plate" },
      { name: "Strip Wear (GMTL)",  partNo: "6G4524",               model: "CAT 120K/H, 140H", category: "plate" },
      { name: "Strip Wear",         partNo: "333-0960",             model: "CAT 120K/H, 140H", category: "plate" },
    ],
    img: "/images/machines/cat-grader.jpg",
    gallery: {
      featuredParts: [
        { name: "Tooth Point, Washers & Yoke",              img: "/images/parts/cat-sheet-1.png" },
        { name: "Sprockets, Sprockets, Sleeves & Ball",     img: "/images/parts/cat-sheet-2.png" },
        { name: "Gear, Housing, Levers, Pins & Plates",     img: "/images/parts/cat-sheet-3.png" },
        { name: "Shafts, Shoes, Spindle & Strip Wear",      img: "/images/parts/cat-sheet-4.png" },
      ],
      collageParts: [],
    },
    metaTitle: "CAT Motor Grader Spare Parts India | CAT 140H 120K 120H | SSI Earthmovers Delhi",
    metaDesc:
      "Buy CAT motor grader spare parts in India. CAT 140H, 120K, 120H cutting edges, grader blades, scarifier teeth, end bits, circle segments. Same-day dispatch from New Delhi. Call +91-9953105738.",
    faqs: [
      {
        q: "Do you stock parts for CAT 140H motor graders?",
        a: "Yes, we have a full range of parts for the CAT 140H — cutting edges (14-hole and 16-hole), grader blades, scarifier teeth, end bits, circle segments, draw bar pins and more. In-stock for same-day dispatch.",
      },
      {
        q: "What is the price of CAT 140H cutting edges in India?",
        a: "Pricing depends on steel grade (standard or Hardox 400/500) and quantity. Contact us on WhatsApp (+91-9953105738) for a real-time quote — we typically respond within 2 hours.",
      },
      {
        q: "Are your CAT grader parts OEM or aftermarket?",
        a: "We supply genuine OEM Caterpillar parts as well as high-quality OEM-spec aftermarket replacements that meet or exceed original Caterpillar specifications.",
      },
    ],
  },
  {
    slug: "komatsu",
    name: "KOMATSU",
    fullName: "Komatsu",
    country: "Japan",
    models: ["Komatsu GD511", "Komatsu GD535"],
    color: "#e8c13a",
    tagline: "Spare parts for Komatsu GD511 & GD535 motor graders — PAN India delivery",
    description:
      "Komatsu GD511 and GD535 are among the most powerful and reliable motor graders used across India's mining and infrastructure sectors. SSI Earthmovers maintains a dedicated inventory of Komatsu GD511 and GD535 spare parts for fast dispatch from New Delhi.",
    longDescription:
      "SSI Earthmovers supplies a complete range of Komatsu GD511 and GD535 motor grader spare parts including cutting edges, grader blades, scarifier teeth, end bits and all wear components. The GD511 and GD535 are widely used in coal mines, stone quarries and large infrastructure projects in Jharkhand, Odisha, Chhattisgarh and Rajasthan. Our parts are manufactured to Komatsu OEM specifications using high-tensile and Hardox grade steels for maximum wear life. We stock sufficient quantities for immediate dispatch — no waiting time. Fleet operators running multiple Komatsu units can avail of our bulk pricing.",
    keyParts: [
      "Cutting Edges",
      "Grader Blades",
      "Scarifier Teeth & Ripper Tips",
      "End Bits",
      "Circle Segments",
      "Draw Bar Components",
      "Wear Plates",
    ],
    parts: [
      { name: "Coupling (20 teeth)", partNo: "23A-22-11190", model: "Komatsu GD511/GD535", category: "joint", img: "/images/parts/km-coupling-23a-22-11190.jpg" },
      { name: "Cap", partNo: "KB2101131011", model: "Komatsu GD511/GD535", category: "general", img: "/images/parts/km-cap-kb2101131011.jpg" },
      { name: "Cage", partNo: "23A-22-11250", model: "Komatsu GD511/GD535", category: "general", img: "/images/parts/km-cage-23a-22-11250.jpg" },
      { name: "Bracket", partNo: "23A-27-11160", model: "Komatsu GD511/GD535", category: "general", img: "/images/parts/km-bracket-23a-27-11160.jpg" },
      { name: "Bushing", partNo: "23A-70-15150", model: "Komatsu GD511/GD535", category: "bushing", img: "/images/parts/km-bushing-23a-70-15150.jpg" },
      { name: "Bushing", partNo: "23A-27-11610", model: "Komatsu GD511/GD535", category: "bushing", img: "/images/parts/km-bushing-23a-27-11610.jpg" },
      { name: "Brake Shoe", partNo: "23A-32-11230", model: "Komatsu GD511/GD535", category: "brake", img: "/images/parts/km-brake-shoe-23a3211230.jpg" },
      { name: "Bevel Gear Assembly (Crown-43T, Shaft-12T, 20T)", partNo: "23A-22-11200", model: "Komatsu GD511/GD535", category: "gear", img: "/images/parts/km-bevel-gear-23a-22-11200.jpg" },
      { name: "Lock", partNo: "238-22-15110", model: "Komatsu GD511/GD535", category: "general", img: "/images/parts/km-lock-238-22-15110.jpg" },
      { name: "Break Drum", partNo: "23-23-11242", model: "Komatsu GD511/GD535", category: "brake", img: "/images/parts/km-break-drum-23-23-11242.jpg" },
      { name: "Adjuster (R.H)", partNo: "23B-735-1180", model: "Komatsu GD511/GD535", category: "general", img: "/images/parts/km-adjuster-rh-23b-735-1180.jpg" },
      { name: "Adjuster (L.H)", partNo: "23B-735-1170", model: "Komatsu GD511/GD535", category: "general", img: "/images/parts/km-adjuster-lh-23b-735-1170.jpg" },
      { name: "Plug", partNo: "23B-27-11360", model: "Komatsu GD511/GD535", category: "general", img: "/images/parts/km-plug-23b-27-11360.jpg" },
      { name: "Adjuster", partNo: "23A-32-11150", model: "Komatsu GD511/GD535", category: "general", img: "/images/parts/km-adjuster-23a-32-11150.jpg" },
      { name: "Yoke", partNo: "23A-32-11180", model: "Komatsu GD511/GD535", category: "joint", img: "/images/parts/km-yoke-23a-32-11180.jpg" },
      { name: "Wheel Worm", partNo: "232-70-54142", model: "Komatsu GD511/GD535", category: "gear", img: "/images/parts/km-wheel-worm-232-70-54142.jpg" },
      { name: "Wedge", partNo: "232-70-13142", model: "Komatsu GD511/GD535", category: "general", img: "/images/parts/km-wedge-232-70-13142.jpg" },
      { name: "Tie Rod", partNo: "23B-27-11411", model: "Komatsu GD511/GD535", category: "joint", img: "/images/parts/km-tie-rod-23b-27-11411.jpg" },
      { name: "Stud Ball (Big)", partNo: "23B-63-31580 / 11563", model: "Komatsu GD511/GD535", category: "joint", img: "/images/parts/km-stud-ball-big-23b-63-31580.jpg" },
      { name: "Stud Ball (Small)", partNo: "23B-27-31650 / 11553", model: "Komatsu GD511/GD535", category: "joint", img: "/images/parts/km-stud-ball-small-23b-27-31650.jpg" },
      { name: "Sprocket (Small)", partNo: "23A-22-11420", model: "Komatsu GD511/GD535", category: "sprocket", img: "/images/parts/km-sprocket-23a-22-11420.jpg" },
      { name: "Shim", partNo: "232-70-51230", model: "Komatsu GD511/GD535", category: "plate", img: "/images/parts/km-shim-232-70-51230.jpg" },
      { name: "Sheer Pin Genuine", partNo: "234-71-13256", model: "Komatsu GD511/GD535", category: "pin", img: "/images/parts/km-sheer-pin-234-71-13256.jpg" },
      { name: "Shaft", partNo: "23A-70-15140", model: "Komatsu GD511/GD535", category: "shaft", img: "/images/parts/km-shaft-23a-70-15140.jpg" },
      { name: "Shaft", partNo: "23A-27-11350", model: "Komatsu GD511/GD535", category: "shaft", img: "/images/parts/km-shaft-23a-27-11350.jpg" },
      { name: "Pin", partNo: "23A-27-11530", model: "Komatsu GD511/GD535", category: "pin", img: "/images/parts/km-pin-23a-27-11530.jpg" },
      { name: "Lock", partNo: "232-70-54470", model: "Komatsu GD511/GD535", category: "general", img: "/images/parts/km-lock-232-70-54470.jpg" },
      { name: "Joint Front Axle", partNo: "23B-27-11460", model: "Komatsu GD511/GD535", category: "joint", img: "/images/parts/km-joint-front-axle-23b-27-11460.jpg" },
      { name: "Hub", partNo: "23A-15-12281", model: "Komatsu GD511/GD535", category: "hub", img: "/images/parts/km-hub-23a-15-12281.jpg" },
      { name: "Guide Shoe", partNo: "23A-70-11130", model: "Komatsu GD511/GD535", category: "general", img: "/images/parts/km-guide-shoe-23a-70-11130.jpg" },
      { name: "Guide (Big)", partNo: "23B-735-1190", model: "Komatsu GD511/GD535", category: "general", img: "/images/parts/km-guide-big-23b-735-1190.jpg" },
      { name: "Guide Blade", partNo: "232-70-12420-30", model: "Komatsu GD511/GD535", category: "general", img: "/images/parts/km-guide-blade-232-70-12420.jpg" },
      { name: "Guide", partNo: "23B7351190", model: "Komatsu GD511/GD535", category: "general", img: "/images/parts/km-guide-23b-735-1190b.jpg" },
      { name: "Gear Worm", partNo: "232-70-15150", model: "Komatsu GD511/GD535", category: "gear", img: "/images/parts/km-gear-worm-232-70-15150.jpg" },
      { name: "Gear", partNo: "233-71-13354", model: "Komatsu GD511/GD535", category: "gear", img: "/images/parts/km-gear-233-71-13354.jpg" },
      { name: "End Bit", partNo: "232-70-52190", model: "Komatsu GD511/GD535", category: "end-bit", img: "/images/parts/km-end-bit-2327052190.jpg" },
      { name: "Cover", partNo: "23A-27-11270", model: "Komatsu GD511/GD535", category: "general", img: "/images/parts/km-cover-23a-27-11270.jpg" },
      { name: "Balance Rod", partNo: "23B-735-324041", model: "Komatsu GD535", category: "general" },
      { name: "Guide (Small)", partNo: "23H-70-12210", model: "Komatsu GD535", category: "general" },
      { name: "Adjuster", partNo: "23H-735-1131", model: "Komatsu GD535", category: "general" },
      { name: "Shim", partNo: "232-70-51220", model: "Komatsu GD535", category: "plate" },
      { name: "Bushing", partNo: "23B-70-31730", model: "Komatsu GD535", category: "bushing" },
      { name: "Guide", partNo: "23B-70-5156", model: "Komatsu GD535", category: "general" },
      { name: "Guide Shoe", partNo: "23H-70-11550", model: "Komatsu GD535", category: "general" },
      { name: "Shank", partNo: "0927100045", model: "Komatsu GD535", category: "general" },
    ],
    img: "/images/machines/komatsu-gd535.jpg",
    gallery: {
      featuredParts: [
        { name: "Couplings, Bushings & Drive Parts",         img: "/images/parts/km-cat-sheet-1.png" },
        { name: "Locks, Drums & Adjusters",                  img: "/images/parts/km-cat-sheet-2.png" },
        { name: "Yoke, Worm Wheel, Wedge & Tie Rod",         img: "/images/parts/km-cat-sheet-3.png" },
        { name: "Stud Balls, Sprocket, Shafts & More",       img: "/images/parts/km-cat-sheet-4.png" },
        { name: "GD535 — Guides, Balance Rod, Bushing & Shank", img: "/images/parts/km-cat-sheet-5-gd535.png" },
      ],
      collageParts: [],
    },
    metaTitle: "Komatsu GD511 GD535 Motor Grader Spare Parts India | SSI Earthmovers Delhi",
    metaDesc:
      "Buy Komatsu GD511 & GD535 motor grader spare parts in India. Couplings, gears, shafts, brake shoes, end bits, bevel gear assemblies & more. Same-day dispatch from New Delhi. Call +91-9953105738.",
    faqs: [
      {
        q: "Do you have cutting edges for Komatsu GD511?",
        a: "Yes, we stock cutting edges and grader blades in standard and Hardox grades specifically for the Komatsu GD511. Available for same-day dispatch from our New Delhi warehouse.",
      },
      {
        q: "Can I get Komatsu GD511 scarifier teeth from you?",
        a: "Absolutely. We carry Komatsu GD511 scarifier teeth and shanks in stock. Share your OEM part number via WhatsApp for the fastest availability confirmation.",
      },
      {
        q: "Do you deliver Komatsu grader parts to mining sites?",
        a: "Yes, we deliver PAN India to all 28 states including major mining areas in Jharkhand, Odisha, Chhattisgarh and Rajasthan. Typical delivery time is 2–5 business days after dispatch.",
      },
    ],
  },
  {
    slug: "case",
    name: "CASE",
    fullName: "CASE Construction",
    country: "USA",
    models: ["CASE 845B"],
    color: "#3a7be8",
    tagline: "Genuine & OEM-spec spare parts for CASE 845B motor graders",
    description:
      "The CASE 845B is a popular motor grader in road construction and municipal work across India. SSI Earthmovers stocks all major wearing parts for the CASE 845B — cutting edges, blades, scarifier teeth and circle components, ready for fast delivery.",
    longDescription:
      "SSI Earthmovers supplies complete spare parts support for CASE 845B motor graders operating across India. Our inventory includes Hardox cutting edges, grader blades, scarifier teeth, end bits, circle segments and draw bar parts, all manufactured to CASE Construction's OEM specifications. The CASE 845B is commonly deployed on state highway and rural road projects, and minimising downtime is critical. We maintain sufficient stock for immediate same-day dispatch to any destination in India. Whether you need a single replacement part or a full set for fleet maintenance, our team can assist.",
    keyParts: [
      "Cutting Edges",
      "Grader Blades",
      "Scarifier Teeth",
      "End Bits",
      "Circle Segments & Wear Parts",
      "Draw Bar Assembly Parts",
      "Blade Bolts & Hardware",
    ],
    parts: [
      { name: "Worm Gear", partNo: "75215793", model: "CASE 845B", category: "gear" },
      { name: "Bushing (Big)", partNo: "73130969", model: "CASE 845B", category: "bushing" },
      { name: "Drum", partNo: "71103509", model: "CASE 845B", category: "brake" },
      { name: "End Bit (Side Cutter)", partNo: "7526-6800", model: "CASE 845B", category: "end-bit" },
      { name: "Gas Strut", partNo: "87559372", model: "CASE 845B", category: "hydraulic" },
      { name: "Gas Strut", partNo: "398767A1", model: "CASE 845B", category: "hydraulic" },
      { name: "Gear", partNo: "47930482", model: "CASE 845B", category: "gear" },
      { name: "Ball Joint", partNo: "8438-5731", model: "CASE 845B", category: "joint" },
      { name: "Gear Ring (Couronne)", partNo: "85-2221", model: "CASE 845B", category: "ring-gear" },
      { name: "Guide Shoe", partNo: "84341599", model: "CASE 845B", category: "general" },
      { name: "Hose", partNo: "7532-4809", model: "CASE 845B", category: "hydraulic" },
      { name: "Hub Assembly", partNo: "73130013", model: "CASE 845B", category: "hub" },
      { name: "Output Shaft Ass. (Spindle)", partNo: "3349943", model: "CASE 845B", category: "shaft" },
      { name: "Pin", partNo: "47718021", model: "CASE 845B", category: "pin" },
      { name: "Pin", partNo: "8764-7425", model: "CASE 845B", category: "pin" },
      { name: "Plate", partNo: "75267167", model: "CASE 845B", category: "plate" },
      { name: "Plate", partNo: "75267176", model: "CASE 845B", category: "plate" },
      { name: "Plate", partNo: "75248807", model: "CASE 845B", category: "plate" },
      { name: "Plate", partNo: "84165760", model: "CASE 845B", category: "plate" },
      { name: "Plate", partNo: "84165763", model: "CASE 845B", category: "plate" },
      { name: "Plate LH", partNo: "87616831", model: "CASE 845B", category: "plate" },
      { name: "Plate RH", partNo: "87616832", model: "CASE 845B", category: "plate" },
      { name: "Seal", partNo: "87625368", model: "CASE 845B", category: "seal" },
      { name: "Seal Kit", partNo: "51492481", model: "CASE 845B", category: "seal" },
      { name: "Shank", partNo: "87656075", model: "CASE 845B", category: "general" },
      { name: "Side Shift Cylinder", partNo: "75250020", model: "CASE 845B", category: "hydraulic" },
      { name: "Support", partNo: "—", model: "CASE 845B", category: "general" },
      { name: "Swing Pinion", partNo: "51508479", model: "CASE 845B", category: "gear" },
      { name: "Spacer Steering Cylinder", partNo: "75248808 / 4816-8383", model: "CASE 845B", category: "hydraulic" },
      { name: "Housing Assembly", partNo: "87618963", model: "CASE 845B", category: "general" },
    ],
    gallery: {
      featuredParts: [
        { name: "Gear Ring, Guide Shoe, Hose, Hub & Plates",    img: "/images/parts/case-sheet-1.png" },
        { name: "Plates, Seals, Shank, Side Shift & Pinion",    img: "/images/parts/case-sheet-2.png" },
        { name: "Worm Gear, Ball Joint, Drum, End Bit & Struts", img: "/images/parts/case-sheet-3.png" },
      ],
      collageParts: [],
    },
    img: "/images/machines/case-845b.jpg",
    metaTitle: "CASE 845B Motor Grader Spare Parts India | SSI Earthmovers Delhi",
    metaDesc:
      "Buy CASE 845B motor grader spare parts in India. Cutting edges, grader blades, scarifier teeth, end bits. Same-day dispatch from New Delhi. Call +91-9953105738.",
    faqs: [
      {
        q: "Do you stock parts for CASE 845B motor grader?",
        a: "Yes, we maintain a ready inventory of CASE 845B spare parts including cutting edges, grader blades, scarifier teeth, end bits and circle segments for same-day dispatch.",
      },
      {
        q: "Where do I get CASE 845B grader blades in India?",
        a: "SSI Earthmovers, Mori Gate, New Delhi is your go-to source. We supply CASE 845B grader blades PAN India with 2–5 day delivery. Call +91-9953105738 or WhatsApp for pricing.",
      },
    ],
  },
  {
    slug: "xcmg",
    name: "XCMG",
    fullName: "XCMG",
    country: "China",
    models: ["XCMG 165", "XCMG GR165"],
    color: "#a0a0a0",
    tagline: "Spare parts for XCMG 165 motor graders — fast dispatch across India",
    description:
      "XCMG motor graders have gained significant adoption across India's road construction sector due to their competitive pricing and reliability. SSI Earthmovers supplies a complete range of spare parts for the XCMG 165 motor grader.",
    longDescription:
      "As XCMG graders have expanded their presence in Indian road projects, SSI Earthmovers has built a dedicated parts inventory for the XCMG 165. We supply cutting edges, grader blades, scarifier teeth, end bits and circle components that meet XCMG OEM specifications. XCMG 165 parts are available from our New Delhi warehouse for same-day or next-day dispatch. Our team has in-depth knowledge of XCMG grader parts compatibility — we can help you identify the right part even without the OEM part number.",
    keyParts: [
      "Cutting Edges",
      "Grader Blades",
      "Scarifier Teeth",
      "End Bits",
      "Circle Segments",
      "Draw Bar Parts",
    ],
    parts: [
      { name: "Guide Thin", partNo: "83640006", model: "XCMG 165", category: "general" },
      { name: "King Pin", partNo: "380400474", model: "XCMG 165", category: "pin" },
      { name: "Nut", partNo: "805238929", model: "XCMG 165", category: "general" },
      { name: "Shaft", partNo: "380400498", model: "XCMG 165", category: "shaft" },
      { name: "Shaft", partNo: "380400959", model: "XCMG 165", category: "shaft" },
      { name: "Shaft", partNo: "380906185", model: "XCMG 165", category: "shaft" },
      { name: "Sleeve", partNo: "380400489", model: "XCMG 165", category: "sleeve" },
      { name: "Spindle Connect Plate", partNo: "380400470", model: "XCMG 165", category: "plate" },
      { name: "Tyre Axle", partNo: "275400182", model: "XCMG 165", category: "shaft" },
      { name: "Pin Long (Centre Shaft)", partNo: "380400961", model: "XCMG 165", category: "pin" },
      { name: "Sleeve", partNo: "380400490", model: "XCMG 165", category: "sleeve" },
      { name: "Ball Joint LH", partNo: "380300926 / 83670014", model: "XCMG 165", category: "joint" },
      { name: "Sleeve", partNo: "380400497", model: "XCMG 165", category: "sleeve" },
      { name: "Shaft", partNo: "275400392", model: "XCMG 165", category: "shaft" },
      { name: "Bearing", partNo: "1210030_001210031", model: "XCMG 165", category: "general" },
      { name: "Bustle (Wear Plate)", partNo: "—", model: "XCMG 165", category: "general" },
      { name: "Guide Thick", partNo: "63510024", model: "XCMG 165", category: "general" },
    ],
    gallery: {
      featuredParts: [
        { name: "Guide, King Pin, Nut, Shafts, Sleeves & Spindle Plate", img: "/images/parts/xcmg-sheet-1.png" },
        { name: "Ball Joint, Sleeve, Shafts, Bearing, Bustle & Guide Thick", img: "/images/parts/xcmg-sheet-2.png" },
      ],
      collageParts: [],
    },
    img: "/images/machines/xcmg-165.jpg",
    metaTitle: "XCMG 165 Motor Grader Spare Parts India | SSI Earthmovers Delhi",
    metaDesc:
      "Buy XCMG 165 motor grader spare parts in India. Cutting edges, grader blades, scarifier teeth, end bits. Same-day dispatch from New Delhi. Call +91-9953105738.",
    faqs: [
      {
        q: "Do you have XCMG 165 motor grader parts in stock?",
        a: "Yes. We maintain a ready stock of XCMG 165 cutting edges, grader blades and scarifier teeth at our New Delhi warehouse, available for same-day dispatch.",
      },
      {
        q: "Can I order XCMG grader blades in bulk?",
        a: "Absolutely. We offer bulk pricing for fleet operators with multiple XCMG 165 graders. Contact our sales team on WhatsApp or call +91-9953105738 for a volume quote.",
      },
    ],
  },
  {
    slug: "leeboy",
    name: "LEEBOY",
    fullName: "Leeboy",
    country: "India",
    models: ["Leeboy 785", "Leeboy 985"],
    color: "#3ae8a0",
    tagline: "Genuine spare parts for Leeboy 785 & 985 motor graders",
    description:
      "Leeboy motor graders are a popular Indian brand widely used in state highway, rural road and PMGSY projects. SSI Earthmovers maintains dedicated stock of Leeboy 785 and 985 spare parts for fast PAN India delivery.",
    longDescription:
      "Leeboy graders are among the most commonly deployed machines on rural connectivity projects funded under PMGSY and state PWD programmes across India. SSI Earthmovers maintains a comprehensive parts inventory for both the Leeboy 785 and 985 models — including cutting edges, grader blades, scarifier teeth, end bits and all wear components. As a Made-in-India brand, Leeboy graders are active in nearly every state, and our PAN India logistics network ensures 2–5 day delivery to your site. No minimum order. Same-day dispatch for in-stock items.",
    keyParts: [
      "Cutting Edges (785 & 985)",
      "Grader Blades",
      "Scarifier Teeth",
      "End Bits",
      "Circle Segments",
      "Draw Bar Pins",
    ],
    parts: [
      { name: "Lock Washer", partNo: "10018375", model: "Leeboy 785/985", category: "general" },
      { name: "Propeller Shaft Assembly", partNo: "10012786", model: "Leeboy 785/985", category: "shaft" },
      { name: "Shaft Worm Gear", partNo: "983134", model: "Leeboy 785/985", category: "gear" },
      { name: "Roller Pin (Bolt)", partNo: "10018660", model: "Leeboy 785/985", category: "pin" },
      { name: "Roller Turntable Bush", partNo: "10018518", model: "Leeboy 785/985", category: "bushing" },
      { name: "Castel Nut", partNo: "10018519", model: "Leeboy 785/985", category: "general" },
      { name: "Guide", partNo: "90000335", model: "Leeboy 785/985", category: "general" },
      { name: "Ball Joint", partNo: "10018118", model: "Leeboy 785/985", category: "joint" },
      { name: "Bevel Gear Assembly", partNo: "3265503", model: "Leeboy 785/985", category: "gear" },
      { name: "Shoe", partNo: "10010221", model: "Leeboy 785/985", category: "general" },
      { name: "Side Cutter / End Bit", partNo: "10011358", model: "Leeboy 785/985", category: "end-bit" },
      { name: "Brake Piston", partNo: "3349973", model: "Leeboy 785/985", category: "brake" },
      { name: "Flange (34 teeth)", partNo: "4656.303.016", model: "Leeboy 785/985", category: "hub" },
      { name: "T-Lock", partNo: "10018233", model: "Leeboy 785/985", category: "general" },
      { name: "Tooth", partNo: "10018178", model: "Leeboy 785/985", category: "general" },
      { name: "Gear Worm", partNo: "—", model: "Leeboy 785/985", category: "gear" },
      { name: "Yoke Propeller Shaft", partNo: "—", model: "Leeboy 785/985", category: "shaft" },
      { name: "Plate Slide Shim (L Type)", partNo: "10010188", model: "Leeboy 785/985", category: "plate" },
      { name: "Assembly Wheel Hub", partNo: "10018448", model: "Leeboy 785/985", category: "hub" },
      { name: "Brake Disc Drum", partNo: "3350003", model: "Leeboy 785/985", category: "brake" },
      { name: "Sprocket Z22", partNo: "3349483", model: "Leeboy 785/985", category: "sprocket" },
      { name: "Sheer Pin", partNo: "10010246", model: "Leeboy 785/985", category: "pin" },
      { name: "Guide Blade", partNo: "10010190", model: "Leeboy 785/985", category: "general" },
      { name: "Output Shaft Ass. (Spindle)", partNo: "3349943", model: "Leeboy 785/985", category: "shaft" },
      { name: "Gear Pinion Hole", partNo: "10010247", model: "Leeboy 785/985", category: "gear" },
      { name: "Pin Front Axle", partNo: "10010101", model: "Leeboy 785/985", category: "pin" },
      { name: "Plate Slide Shim Flat", partNo: "10010189-2", model: "Leeboy 785/985", category: "plate" },
      { name: "Plate Wear Bar Cover (3 Hole)", partNo: "10010191", model: "Leeboy 785/985", category: "plate" },
      { name: "Adapter Pinion", partNo: "10018645", model: "Leeboy 785/985", category: "gear" },
    ],
    gallery: {
      featuredParts: [
        { name: "Lock Washer, Propeller Shaft, Shaft Worm Gear, Roller Pin, Ball Joint, Bevel Gear, Shoe, Side Cutter, Brake Piston, Flange, T-Lock & Tooth", img: "/images/parts/leeboy-sheet-1.png" },
        { name: "Gear Worm, Ball Joint, Yoke Propeller Shaft, Plate Slide Shim, Assembly Wheel Hub, Brake Disc Drum, Sprocket Z22 & Sheer Pin",              img: "/images/parts/leeboy-sheet-2.png" },
        { name: "Guide Blade, Output Shaft, Gear Pinion Hole, Pin Front Axle, Plate Slide Shim Flat, Plate Wear Bar Cover, Bevel Gear Assly & Adapter Pinion",  img: "/images/parts/leeboy-sheet-3.png" },
      ],
      collageParts: [],
    },
    img: "/images/machines/leeboy-grader.jpg",
    metaTitle: "Leeboy 785 985 Motor Grader Spare Parts India | SSI Earthmovers Delhi",
    metaDesc:
      "Buy Leeboy 785 and 985 motor grader spare parts in India. Cutting edges, grader blades, scarifier teeth, end bits. Same-day dispatch from New Delhi. Call +91-9953105738.",
    faqs: [
      {
        q: "Do you stock Leeboy 785 and 985 grader parts?",
        a: "Yes, we stock parts for both Leeboy 785 and Leeboy 985 motor graders including cutting edges, grader blades, scarifier teeth and end bits, available for same-day dispatch.",
      },
      {
        q: "Can I get Leeboy grader cutting edges delivered to a remote site?",
        a: "Yes, we deliver PAN India including to remote PMGSY project sites. Typical delivery is 2–5 business days. Call +91-9953105738 to confirm delivery to your location.",
      },
    ],
  },
  {
    slug: "sany",
    name: "SANY",
    fullName: "Sany",
    country: "China",
    models: ["Sany PQ190", "Sany PQ170", "Sany STG170"],
    color: "#8a3ae8",
    tagline: "Spare parts for Sany PQ190 & STG170 motor graders — PAN India supply",
    description:
      "The Sany PQ190 is a heavy-duty motor grader increasingly deployed in Indian road and mining projects. SSI Earthmovers stocks cutting edges, grader blades, scarifier teeth and all major wearing parts for the Sany PQ190.",
    longDescription:
      "Sany is one of the fastest-growing heavy equipment brands in India, and the PQ190 motor grader is popular on large road construction and earthmoving projects. SSI Earthmovers supplies OEM-compatible spare parts for the Sany PQ190 including Hardox cutting edges, grader blades, scarifier teeth, end bits and circle components. Our team has hands-on knowledge of Sany PQ190 part specifications, enabling accurate part matching even without an OEM part number. All parts are available from our New Delhi warehouse with same-day or next-day dispatch.",
    keyParts: [
      "Cutting Edges",
      "Grader Blades",
      "Scarifier Teeth",
      "End Bits",
      "Circle Segments",
      "Draw Bar Components",
    ],
    parts: [
      { name: "Hub", partNo: "62682-21500", model: "Sany PQ190/170", category: "hub" },
      { name: "Plate Wear", partNo: "60382009006268201700", model: "Sany PQ190/170", category: "plate" },
      { name: "Ring Gear", partNo: "60331-01500", model: "Sany PQ190/170", category: "ring-gear" },
      { name: "Guide", partNo: "12787958 / 11088191", model: "Sany PQ190/170", category: "general" },
      { name: "Roller", partNo: "62663-31100", model: "Sany PQ190/170", category: "general" },
      { name: "Shaft", partNo: "60331-01100", model: "Sany PQ190/170", category: "shaft" },
      { name: "Shaft", partNo: "62663-00601", model: "Sany PQ190/170", category: "shaft" },
      { name: "Shoe", partNo: "62663-22400", model: "Sany PQ190/170", category: "general" },
      { name: "Ball Joint", partNo: "60382-10300 / 60382-00300", model: "Sany PQ190/170", category: "joint" },
      { name: "Bushing", partNo: "05605-07080", model: "Sany PQ190/170", category: "bushing" },
      { name: "Carrier Planet", partNo: "60331-00300", model: "Sany PQ190/170", category: "hub" },
      { name: "Drive Cross Assembly", partNo: "6036110600", model: "Sany PQ190/170", category: "joint" },
      { name: "End Bit (8 Hole)", partNo: "62681-10700", model: "Sany PQ190/170", category: "end-bit" },
      { name: "Sun Gear Shaft", partNo: "—", model: "Sany STG170", category: "shaft" },
      { name: "Ring Gear & Ring Hub", partNo: "—", model: "Sany STG170", category: "ring-gear" },
      { name: "Sun Gear", partNo: "—", model: "Sany STG170", category: "gear" },
      { name: "Carrier Assembly", partNo: "—", model: "Sany STG170", category: "gear" },
      { name: "Seal Cage / Chuck Nut", partNo: "—", model: "Sany STG170", category: "seal" },
      { name: "Ball Joint", partNo: "RH10659957", model: "Sany STG170", category: "joint" },
      { name: "Shaft / Pin", partNo: "20160301-164343", model: "Sany STG170", category: "shaft" },
    ],
    gallery: {
      featuredParts: [
        { name: "Sun Gear Shaft, Ring Gear & Ring Hub, Sun Gear, Carrier Assembly, Guide, Seal Cage, Ball Joint & Shaft", img: "/images/parts/sany-sheet-1.png" },
      ],
      collageParts: [],
    },
    img: "/images/motor-grader-hero.png",
    metaTitle: "Sany PQ190 Motor Grader Spare Parts India | SSI Earthmovers Delhi",
    metaDesc:
      "Buy Sany PQ190 motor grader spare parts in India. Cutting edges, grader blades, scarifier teeth, end bits. Same-day dispatch from New Delhi. Call +91-9953105738.",
    faqs: [
      {
        q: "Do you have parts for Sany PQ190 motor grader?",
        a: "Yes, we stock Sany PQ190 cutting edges, grader blades, scarifier teeth and end bits for same-day dispatch from our New Delhi warehouse.",
      },
    ],
  },
  {
    slug: "sdlg",
    name: "SDLG",
    fullName: "SDLG",
    country: "China",
    models: ["SDLG 9138", "SDLG 9190"],
    color: "#e87a3a",
    tagline: "OEM-spec spare parts for SDLG 9138 & 9190 motor graders",
    description:
      "SDLG motor graders — particularly the 9138 and 9190 models — are widely used in Indian road construction. SSI Earthmovers maintains a ready stock of SDLG grader spare parts for fast delivery nationwide.",
    longDescription:
      "SDLG 9138 and 9190 motor graders are commonly deployed on National Highway and state road projects across India. SSI Earthmovers has developed a strong parts inventory for both SDLG models, covering all major wear items: cutting edges, grader blades, scarifier teeth, end bits and circle components. Parts are manufactured to SDLG OEM dimensional specifications for perfect fit and long service life. Available for same-day dispatch from our Mori Gate, New Delhi warehouse. We offer bulk pricing to contractors with multiple SDLG units.",
    keyParts: [
      "Cutting Edges (9138 & 9190)",
      "Grader Blades",
      "Scarifier Teeth",
      "End Bits",
      "Circle Segments",
      "Draw Bar Parts",
    ],
    parts: [
      { name: "Adjust Washer", partNo: "2601934538001", model: "SDLG 9138/9190", category: "general" },
      { name: "Chuk Nut", partNo: "260193449000", model: "SDLG 9138/9190", category: "general" },
      { name: "Side Cutter (LGG)", partNo: "LGG 28140007461", model: "SDLG 9138/9190", category: "end-bit" },
      { name: "Flange", partNo: "4110002230050", model: "SDLG 9138/9190", category: "hub" },
      { name: "Shaft", partNo: "28350002131", model: "SDLG 9138/9190", category: "shaft" },
      { name: "Plate", partNo: "28350001491", model: "SDLG 9138/9190", category: "plate" },
      { name: "Hub (LGG)", partNo: "LGG411001903014", model: "SDLG 9138/9190", category: "hub" },
      { name: "Shaft (LGG)", partNo: "LGG 28350002111", model: "SDLG 9138/9190", category: "shaft" },
      { name: "Nut", partNo: "28350002141", model: "SDLG 9138/9190", category: "general" },
      { name: "Shaft", partNo: "4110001903069", model: "SDLG 9138/9190", category: "shaft" },
      { name: "Seal Cage (LGG)", partNo: "4110001903018", model: "SDLG 9138/9190", category: "seal" },
      { name: "Duramide Slide", partNo: "28350002251", model: "SDLG 9138/9190", category: "plate" },
      { name: "Sliding Shoe", partNo: "260193454000", model: "SDLG 9138/9190", category: "general" },
      { name: "Cutting Edge 11 Hole", partNo: "LGG28140009601", model: "SDLG 9138/9190", category: "end-bit" },
      { name: "Bolt Nut (LGG)", partNo: "4110001903022 / LGG4110001903023", model: "SDLG 9138/9190", category: "general" },
      { name: "Spacer Sleeve (LGG)", partNo: "LGG410001903122", model: "SDLG 9138/9190", category: "sleeve" },
      { name: "Clamping Plate (LGG)", partNo: "28350002901", model: "SDLG 9138/9190", category: "plate" },
      { name: "Shaft Sprocket", partNo: "—", model: "SDLG 9138/9190", category: "shaft" },
    ],
    gallery: {
      featuredParts: [
        { name: "Side Cutter, Flange, Shaft, Cutting Edge, Bolt Nut, Spacer & Plates", img: "/images/parts/sdlg-sheet-1.png" },
        { name: "Shafts, Shaft Sprocket, Seal Cage & Duramide Slide",                 img: "/images/parts/sdlg-sheet-2.png" },
      ],
      collageParts: [],
    },
    img: "/images/machines/sdlg-g9138.jpg",
    metaTitle: "SDLG 9138 9190 Motor Grader Spare Parts India | SSI Earthmovers Delhi",
    metaDesc:
      "Buy SDLG 9138 and 9190 motor grader spare parts in India. Cutting edges, grader blades, scarifier teeth, end bits. Same-day dispatch from New Delhi. Call +91-9953105738.",
    faqs: [
      {
        q: "Do you stock SDLG 9190 grader parts?",
        a: "Yes, we have parts for both SDLG 9138 and 9190 including cutting edges, grader blades, scarifier teeth and end bits, ready for same-day dispatch.",
      },
    ],
  },
  {
    slug: "liugong",
    name: "LIUGONG",
    fullName: "Liugong",
    country: "China",
    models: ["Liugong CG414"],
    color: "#3ab8e8",
    tagline: "Spare parts for Liugong CG414 motor graders — all India delivery",
    description:
      "The Liugong CG414 is a robust motor grader used in Indian road construction and earthmoving projects. SSI Earthmovers supplies cutting edges, grader blades, scarifier teeth and all wearing parts for the Liugong CG414.",
    longDescription:
      "Liugong CG414 motor graders are active across Indian road construction and infrastructure projects, particularly in Uttar Pradesh, Madhya Pradesh and Rajasthan. SSI Earthmovers maintains a dedicated inventory of CG414 spare parts including Hardox cutting edges, grader blades, scarifier teeth, end bits and circle components. All Liugong CG414 parts are manufactured to original dimensional specifications for a perfect fit. Available for same-day dispatch from our New Delhi warehouse with 2–5 day PAN India delivery.",
    keyParts: [
      "Cutting Edges",
      "Grader Blades",
      "Scarifier Teeth",
      "End Bits",
      "Circle Segments",
      "Draw Bar Parts",
    ],
    parts: [
      { name: "Sprocket Z22", partNo: "334948", model: "Liugong CG414", category: "sprocket" },
      { name: "Break Drum", partNo: "80513002 / SP105976", model: "Liugong CG414", category: "brake" },
      { name: "Worm Gear", partNo: "52C0122 / 52C0291", model: "Liugong CG414", category: "gear" },
      { name: "Retarder Hub", partNo: "83763201", model: "Liugong CG414", category: "hub" },
      { name: "Blade Side Shift Cylinder", partNo: "10C0887", model: "Liugong CG414", category: "hydraulic" },
      { name: "Sprocket", partNo: "85513022 / SP105818", model: "Liugong CG414", category: "sprocket" },
      { name: "Sprocket (5 inch)", partNo: "85763003", model: "Liugong CG414", category: "sprocket" },
      { name: "Hub", partNo: "80513005 / SP109922", model: "Liugong CG414", category: "hub" },
      { name: "Blade Lift Cylinder", partNo: "10C0881", model: "Liugong CG414", category: "hydraulic" },
      { name: "Brake Anchorage", partNo: "PY180-H.2.6", model: "Liugong CG414", category: "brake" },
      { name: "Break Drum", partNo: "80513002", model: "Liugong CG414", category: "brake" },
      { name: "Break Pump (Wheel Cylinder)", partNo: "PY180-H2", model: "Liugong CG414", category: "brake" },
      { name: "Break Shoe", partNo: "SP122377", model: "Liugong CG414", category: "brake" },
      { name: "Bushing", partNo: "55A1210", model: "Liugong CG414", category: "bushing" },
      { name: "Cap Tunion Lift Cyl", partNo: "—", model: "Liugong CG414", category: "hydraulic" },
      { name: "Coupling Flange", partNo: "SP109925", model: "Liugong CG414", category: "hub" },
      { name: "Cover", partNo: "SP148045", model: "Liugong CG414", category: "general" },
      { name: "Cover", partNo: "53A0430", model: "Liugong CG414", category: "general" },
      { name: "Drive Shaft", partNo: "41C0506", model: "Liugong CG414", category: "shaft" },
      { name: "Hub", partNo: "SP139664", model: "Liugong CG414", category: "hub" },
      { name: "Planet Gear", partNo: "79001547", model: "Liugong CG414", category: "gear" },
      { name: "Planetary Carrier", partNo: "83513206", model: "Liugong CG414", category: "hub" },
      { name: "Sun Gear SP", partNo: "79001524", model: "Liugong CG414", category: "gear" },
      { name: "Ring Gear", partNo: "76101031", model: "Liugong CG414", category: "ring-gear" },
      { name: "Ring Hub", partNo: "77500940", model: "Liugong CG414", category: "hub" },
      { name: "Shaft", partNo: "83763203", model: "Liugong CG414", category: "shaft" },
      { name: "Sleeve", partNo: "27A2493", model: "Liugong CG414", category: "sleeve" },
      { name: "Sleeve", partNo: "85763021", model: "Liugong CG414", category: "sleeve" },
      { name: "Slip Plate", partNo: "71A0640", model: "Liugong CG414", category: "plate" },
      { name: "Support LH", partNo: "02D2579", model: "Liugong CG414", category: "general" },
      { name: "Valve Assembly", partNo: "12C5116", model: "Liugong CG414", category: "hydraulic" },
      { name: "Worm", partNo: "45A0017", model: "Liugong CG414", category: "gear" },
    ],
    gallery: {
      featuredParts: [
        { name: "Sprocket Z22, Break Drum, Worm Gear & Retarder Hub",                     img: "/images/parts/liugong-sheet-1.png" },
        { name: "Blade Cylinders, Sprockets, Hub, Brake Anchorage & Break Pump",          img: "/images/parts/liugong-sheet-2.png" },
        { name: "Break Shoe, Bushing, Cap Tunion, Coupling Flange, Covers, Drive Shaft & Hub", img: "/images/parts/liugong-sheet-3.png" },
        { name: "Planet Gear, Planetary Carrier, Sun Gear, Ring Gear, Shafts, Sleeves & Worm", img: "/images/parts/liugong-sheet-4.png" },
      ],
      collageParts: [],
    },
    img: "/images/machines/liugong-cg414.jpg",
    metaTitle: "Liugong CG414 Motor Grader Spare Parts India | SSI Earthmovers Delhi",
    metaDesc:
      "Buy Liugong CG414 motor grader spare parts in India. Cutting edges, grader blades, scarifier teeth, end bits. Same-day dispatch from New Delhi. Call +91-9953105738.",
    faqs: [
      {
        q: "Do you have spare parts for Liugong CG414 grader?",
        a: "Yes, we stock Liugong CG414 cutting edges, grader blades, scarifier teeth and end bits for same-day dispatch from our New Delhi warehouse.",
      },
    ],
  },
  {
    slug: "beml",
    name: "BEML",
    fullName: "BEML Limited",
    country: "India",
    models: ["BEML 605"],
    color: "#e83a8a",
    tagline: "Spare parts for BEML 605 motor graders — India's trusted PSU brand",
    description:
      "BEML 605 motor graders are widely deployed by government departments, PSUs and defence projects across India. SSI Earthmovers stocks OEM-quality spare parts for the BEML 605, ensuring your graders stay operational.",
    longDescription:
      "BEML Limited's 605 motor grader is the preferred choice for government road agencies, state PWD departments and defence establishments across India. SSI Earthmovers supplies a full range of BEML 605 spare parts including cutting edges, grader blades, scarifier teeth, end bits and circle components. As a Made-in-India brand operated by a government PSU, BEML 605 graders are deployed from Kashmir to Kanyakumari. Our PAN India logistics network ensures rapid delivery to any location. All BEML 605 parts are quality-checked and dispatched same day from our New Delhi warehouse.",
    keyParts: [
      "Cutting Edges",
      "Grader Blades",
      "Scarifier Teeth",
      "End Bits",
      "Circle Segments",
      "Draw Bar Pins & Bushings",
    ],
    parts: [
      { name: "Adjuster", partNo: "232-70-52341", model: "BEML 605", category: "general" },
      { name: "Adjuster", partNo: "232-70-52331", model: "BEML 605", category: "general" },
      { name: "Arm Big", partNo: "451-AX-11362", model: "BEML 605", category: "general" },
      { name: "Arm Small", partNo: "451-AX-11379", model: "BEML 605", category: "general" },
      { name: "Axle (LH)", partNo: "451-AX-11338 / 232-27-51222", model: "BEML 605", category: "shaft" },
      { name: "Axle (RH)", partNo: "451-AX-11346", model: "BEML 605", category: "shaft" },
      { name: "Yoke / Joint (Front Axle)", partNo: "451AX11516 / 451AX11605", model: "BEML 605", category: "joint" },
      { name: "Ball Joint", partNo: "451-AX-11743", model: "BEML 605", category: "joint" },
      { name: "Brake Drum", partNo: "451-TM-34039", model: "BEML 605", category: "brake" },
      { name: "Brake Shoe Assembly", partNo: "—", model: "BEML 605", category: "brake" },
      { name: "Brake Valve", partNo: "28-68-05-00-00-00", model: "BEML 605", category: "brake" },
      { name: "Bracket", partNo: "451AX11816", model: "BEML 605", category: "general" },
      { name: "Bushing", partNo: "CSB03-10402 / TBB05-10404", model: "BEML 605", category: "bushing" },
      { name: "Cage", partNo: "451-TM-52175", model: "BEML 605", category: "general" },
      { name: "Coupling (22 Teeth)", partNo: "451-fd-03071", model: "BEML 605", category: "shaft" },
      { name: "Cover", partNo: "—", model: "BEML 605", category: "general" },
      { name: "Gear", partNo: "—", model: "BEML 605", category: "gear" },
      { name: "Guide Circle", partNo: "232-70-51211", model: "BEML 605", category: "ring-gear" },
      { name: "Knuckle Arm Steering", partNo: "451-AX-11387 / 232-27-51410-11", model: "BEML 605", category: "joint" },
      { name: "Master Cylinder", partNo: "451-BR-11883", model: "BEML 605", category: "brake" },
      { name: "Socket", partNo: "451-AX-31589", model: "BEML 605", category: "joint" },
      { name: "Tie Rod", partNo: "451AX02055", model: "BEML 605", category: "joint" },
      { name: "Water Pump", partNo: "—", model: "BEML 605", category: "hydraulic" },
      { name: "Wheel Worm", partNo: "451-WA-12871", model: "BEML 605", category: "gear" },
      { name: "Worm", partNo: "451-WA-12944", model: "BEML 605", category: "gear" },
    ],
    gallery: {
      featuredParts: [
        { name: "Adjuster, Arm Big, Arm Small & Axle",                                          img: "/images/parts/beml-sheet-1.png" },
        { name: "Axle RH, Ball Joint, Brake Drum, Brake Valve, Bushing & Cage",                 img: "/images/parts/beml-sheet-2.png" },
        { name: "Axle LH, Guide Circle, Joint, Knuckle Arm, Brake Shoe, Socket, Worm, Bracket, Tie Rod, Adjuster & Gear", img: "/images/parts/beml-sheet-3.png" },
        { name: "Coupling, Master Cylinder, Yoke & Worm",                                        img: "/images/parts/beml-sheet-4.png" },
      ],
      collageParts: [],
    },
    img: "/images/motor-grader-hero.png",
    metaTitle: "BEML 605 Motor Grader Spare Parts India | SSI Earthmovers Delhi",
    metaDesc:
      "Buy BEML 605 motor grader spare parts in India. Cutting edges, grader blades, scarifier teeth, end bits. Same-day dispatch from New Delhi. Call +91-9953105738.",
    faqs: [
      {
        q: "Do you stock parts for BEML 605 motor grader?",
        a: "Yes, we have a full range of BEML 605 spare parts including cutting edges, grader blades, scarifier teeth and end bits, all available for same-day dispatch.",
      },
      {
        q: "Do government departments buy BEML grader parts from you?",
        a: "Yes, we supply to state PWD departments, NHAI contractors, defence establishments and government infrastructure agencies across India.",
      },
    ],
  },
  {
    slug: "mitsubishi",
    name: "MITSUBISHI",
    fullName: "Mitsubishi",
    country: "Japan",
    models: ["Mitsubishi 330 MG"],
    color: "#e84a3a",
    tagline: "Spare parts for Mitsubishi 330 MG motor graders in India",
    description:
      "The Mitsubishi 330 MG is a heavy-duty motor grader used in Indian mining and large infrastructure projects. SSI Earthmovers maintains a specialist inventory of 330 MG spare parts for rapid supply across India.",
    longDescription:
      "Mitsubishi 330 MG motor graders are renowned for their durability in demanding Indian mining and large-scale road construction environments. SSI Earthmovers is one of the few suppliers in India with a dedicated stock of Mitsubishi 330 MG spare parts — including cutting edges, grader blades, scarifier teeth, end bits and circle components. Parts are sourced to meet Mitsubishi OEM specifications. Our technical team can assist with part identification and compatibility for all Mitsubishi grader models.",
    keyParts: [
      "Cutting Edges",
      "Grader Blades",
      "Scarifier Teeth",
      "End Bits",
      "Circle Segments",
      "Draw Bar Components",
    ],
    parts: [
      { name: "Ball Joint (LH)", partNo: "62641-02501", model: "Mitsubishi 330 MG", category: "joint" },
      { name: "Bearing", partNo: "05643-04700-2", model: "Mitsubishi 330 MG", category: "general" },
      { name: "Bracket (RH)", partNo: "62681-20400", model: "Mitsubishi 330 MG", category: "general" },
      { name: "Bracket (LH)", partNo: "62681-40300", model: "Mitsubishi 330 MG", category: "general" },
      { name: "Bushing", partNo: "61641-01200 / 61641-01800", model: "Mitsubishi 330 MG", category: "bushing" },
      { name: "Bushing", partNo: "05605-06040 / 05605-07080", model: "Mitsubishi 330 MG", category: "bushing" },
      { name: "Carrier Planet", partNo: "60331-00300", model: "Mitsubishi 330 MG", category: "gear" },
      { name: "Cover", partNo: "1102705101", model: "Mitsubishi 330 MG", category: "general" },
      { name: "Cross", partNo: "62461-00020", model: "Mitsubishi 330 MG", category: "joint" },
      { name: "Damper", partNo: "60325-21600", model: "Mitsubishi 330 MG", category: "general" },
      { name: "Drive Cross Assembly", partNo: "6036110600", model: "Mitsubishi 330 MG", category: "joint" },
      { name: "End Bit (8 Hole)", partNo: "62681-10700", model: "Mitsubishi 330 MG", category: "end-bit" },
      { name: "Flange", partNo: "62633-31200", model: "Mitsubishi 330 MG", category: "general" },
      { name: "Flywing Ring", partNo: "ME072527", model: "Mitsubishi 330 MG", category: "ring-gear" },
      { name: "Gear Planetary", partNo: "60331-01300", model: "Mitsubishi 330 MG", category: "gear" },
      { name: "Hollow Shaft", partNo: "60331-11800", model: "Mitsubishi 330 MG", category: "shaft" },
      { name: "Hub", partNo: "60341-00500", model: "Mitsubishi 330 MG", category: "hub" },
      { name: "Nut (Shaft 601)", partNo: "00210-42010", model: "Mitsubishi 330 MG", category: "general" },
      { name: "Pin", partNo: "60341-00300 / 61363-63300 / 61641-01100 / 62641-03101", model: "Mitsubishi 330 MG", category: "pin" },
      { name: "Plate", partNo: "60581-01300 / 69241-01101", model: "Mitsubishi 330 MG", category: "plate" },
      { name: "Plate Warning", partNo: "62682-21500", model: "Mitsubishi 330 MG", category: "plate" },
      { name: "Plate Wear", partNo: "6038200900 / 6268201700", model: "Mitsubishi 330 MG", category: "plate" },
      { name: "Retainer", partNo: "60331-12700", model: "Mitsubishi 330 MG", category: "general" },
      { name: "Ring Gear", partNo: "60331-01500", model: "Mitsubishi 330 MG", category: "ring-gear" },
      { name: "Ring Snap", partNo: "60331-01900", model: "Mitsubishi 330 MG", category: "ring-gear" },
      { name: "Roller", partNo: "62663-31100", model: "Mitsubishi 330 MG", category: "general" },
      { name: "Shaft", partNo: "60331-01100 / 62663-00601", model: "Mitsubishi 330 MG", category: "shaft" },
      { name: "Shear Pin", partNo: "62663-22400", model: "Mitsubishi 330 MG", category: "pin" },
      { name: "Shim", partNo: "60333-00900", model: "Mitsubishi 330 MG", category: "general" },
      { name: "Shoe", partNo: "60382-10300", model: "Mitsubishi 330 MG", category: "brake" },
      { name: "Sleeve", partNo: "60333-30500", model: "Mitsubishi 330 MG", category: "sleeve" },
      { name: "Strip Wear", partNo: "60581-01400", model: "Mitsubishi 330 MG", category: "plate" },
      { name: "Stud Ball (Steering Cyl)", partNo: "—", model: "Mitsubishi 330 MG", category: "joint" },
      { name: "Sun Gear", partNo: "60331-01200", model: "Mitsubishi 330 MG", category: "gear" },
      { name: "Thrust Washer", partNo: "58691-03001", model: "Mitsubishi 330 MG", category: "general" },
      { name: "Washer Thrust", partNo: "69331-17101", model: "Mitsubishi 330 MG", category: "general" },
    ],
    gallery: {
      featuredParts: [
        { name: "Bearing, Brackets, Ball Joint, Sleeve, Strip Wear, Sun Gear, Thrust Washers, Retainer, Ring Snap, Plate & Gear Planetary", img: "/images/parts/mitsubishi-sheet-1.png" },
        { name: "Bushings, Carrier Planet, Cover, Cross, Damper, Drive Cross, End Bit, Flange, Flywing Ring, Hollow Shaft, Shim & Hub",    img: "/images/parts/mitsubishi-sheet-2.png" },
        { name: "Nut, Pins, Plates, Plate Wear, Ring Gear, Roller, Shafts, Shear Pin & Shoe",                                               img: "/images/parts/mitsubishi-sheet-3.png" },
      ],
      collageParts: [],
    },
    img: "/images/motor-grader-hero.png",
    metaTitle: "Mitsubishi 330 MG Motor Grader Spare Parts India | SSI Earthmovers Delhi",
    metaDesc:
      "Buy Mitsubishi 330 MG motor grader spare parts in India. Cutting edges, grader blades, scarifier teeth, end bits. Same-day dispatch from New Delhi. Call +91-9953105738.",
    faqs: [
      {
        q: "Do you have spare parts for Mitsubishi 330 MG grader?",
        a: "Yes, we stock Mitsubishi 330 MG cutting edges, grader blades, scarifier teeth and other wear parts. Call or WhatsApp +91-9953105738 for availability and pricing.",
      },
    ],
  },
  {
    slug: "ace",
    name: "ACE",
    fullName: "ACE (Action Construction)",
    country: "India",
    models: ["ACE AG 176"],
    color: "#e83a3a",
    tagline: "OEM-spec spare parts for ACE AG 176 motor graders — PAN India supply",
    description:
      "The ACE AG 176 is a popular Indian-made motor grader widely used on PMGSY, state highway and municipal road projects. SSI Earthmovers stocks a dedicated range of ACE AG 176 spare parts including cutting edges, blades, scarifier teeth and all major circle assembly components.",
    longDescription:
      "Action Construction Equipment (ACE) graders, particularly the AG 176, are trusted across India for road construction and maintenance projects. SSI Earthmovers maintains a focused inventory of ACE AG 176 spare parts — chuk nuts, adjust washers, bearings, C plates, sliding shoes, sleeves, and other critical wear components — all sourced to OEM dimensional specifications. As a Made-in-India brand, ACE graders are deployed widely across PMGSY projects and state PWD contracts. Our New Delhi warehouse stocks ACE AG 176 parts for same-day dispatch, ensuring minimal downtime for contractors and fleet operators.",
    keyParts: [
      "Cutting Edges",
      "Grader Blades",
      "Scarifier Teeth",
      "End Bits",
      "Circle Segments & C Plates",
      "Bearings & Sleeves",
      "Chuk Nuts & Adjust Washers",
    ],
    parts: [
      { name: "Chuk Nut", partNo: "260193449000", model: "ACE AG 176", category: "general" },
      { name: "Adjust Washer", partNo: "2601934538001", model: "ACE AG 176", category: "general" },
      { name: "Bearing", partNo: "260193454000", model: "ACE AG 176", category: "general" },
      { name: "C Plate", partNo: "—", model: "ACE AG 176", category: "plate" },
      { name: "Sliding Shoe", partNo: "260193454000", model: "ACE AG 176", category: "general" },
      { name: "Sleeve", partNo: "—", model: "ACE AG 176", category: "sleeve" },
    ],
    gallery: {
      featuredParts: [
        { name: "Chuk Nut, Adjust Washer, Bearing, C Plate, Sliding Shoe & Sleeve", img: "/images/parts/ace-sheet-1.png" },
      ],
      collageParts: [],
    },
    img: "/images/machines/ace-ag176.jpg",
    metaTitle: "ACE AG 176 Motor Grader Spare Parts India | SSI Earthmovers Delhi",
    metaDesc:
      "Buy ACE AG 176 motor grader spare parts in India. Cutting edges, grader blades, scarifier teeth, end bits, bearings, sleeves. Same-day dispatch from New Delhi. Call +91-9953105738.",
    faqs: [
      {
        q: "Do you stock ACE AG 176 motor grader parts?",
        a: "Yes, we maintain a ready stock of ACE AG 176 spare parts including cutting edges, grader blades, scarifier teeth, C plates, bearings, sliding shoes and sleeves — available for same-day dispatch from New Delhi.",
      },
      {
        q: "Where can I buy ACE AG 176 grader spare parts in India?",
        a: "SSI Earthmovers, near Mori Gate, New Delhi is a specialist supplier of ACE AG 176 parts. We deliver PAN India in 2–5 business days. Call +91-9953105738 or WhatsApp for pricing and availability.",
      },
    ],
  },
];

export type ProductCategory = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  longDescription: string;
  specs: { label: string; value: string }[];
  variants: { name: string; desc: string }[];
  compatibleBrands: string[];
  img: string;
  metaTitle: string;
  metaDesc: string;
  faqs: { q: string; a: string }[];
};

export const productCategories: ProductCategory[] = [
  {
    slug: "cutting-edges",
    name: "Cutting Edges",
    tagline: "High-wear Hardox steel cutting edges for all motor grader models",
    description:
      "Motor grader cutting edges are the most frequently replaced wear part on any grader. SSI Earthmovers supplies Hardox 400 and 500 grade cutting edges in all standard sizes for CAT, Komatsu, CASE, XCMG, Leeboy, Sany, SDLG, Liugong, BEML and Mitsubishi graders.",
    longDescription:
      "Cutting edges are the front-line wear parts on every motor grader — they take the full impact of cutting, grading and levelling. Using a substandard cutting edge increases your cost-per-metre and reduces your grader's output. SSI Earthmovers supplies Hardox 400 and Hardox 500 grade steel cutting edges that deliver 2–3× the wear life of standard mild steel edges. Available in 11-hole, 14-hole and 16-hole bolt patterns, in lengths from 12 ft to 16 ft and custom sizes on request. All edges are heat-treated for consistent hardness (HB 400 or HB 500) across the full length. Used by 500+ contractors across India on NHAI, state highway and mining projects. Same-day dispatch from our New Delhi warehouse.",
    specs: [
      { label: "Steel Grade", value: "Hardox 400 / Hardox 500 / Mild Steel" },
      { label: "Hardness", value: "HB 400 or HB 500 (Hardox grades)" },
      { label: "Standard Lengths", value: "12 ft, 14 ft, 16 ft" },
      { label: "Hole Patterns", value: "11-hole, 14-hole, custom" },
      { label: "Thickness", value: "16mm, 19mm, 22mm (as per model)" },
      { label: "Delivery", value: "Same-day dispatch from New Delhi" },
    ],
    variants: [
      { name: "Hardox 400 Cutting Edges", desc: "Standard high-performance choice. HB 400 hardness. 2× wear life vs mild steel." },
      { name: "Hardox 500 Cutting Edges", desc: "For extremely abrasive conditions (quarry, mining). HB 500 hardness. Maximum wear life." },
      { name: "Mild Steel Cutting Edges", desc: "Economy option for light grading work on soil and gravel. Fast replacement cycle." },
      { name: "Custom Size Cutting Edges", desc: "Non-standard lengths and hole patterns manufactured on order. Contact us with dimensions." },
    ],
    compatibleBrands: ["CAT", "Komatsu", "CASE", "XCMG", "Leeboy", "Sany", "SDLG", "Liugong", "BEML", "Mitsubishi"],
    img: "/images/category-cutting-edges.png",
    metaTitle: "Motor Grader Cutting Edges India | Hardox 400 500 | SSI Earthmovers Delhi",
    metaDesc: "Buy motor grader cutting edges in India. Hardox 400 & 500 grade. CAT, Komatsu, CASE, XCMG, Leeboy, Sany, SDLG, Liugong, BEML. Same-day dispatch from New Delhi.",
    faqs: [
      { q: "What is the difference between Hardox 400 and Hardox 500 cutting edges?", a: "Hardox 400 (HB 400 hardness) is the standard high-performance choice suitable for most road construction and grading applications. Hardox 500 (HB 500) is for extreme abrasion in quarry, mining or rocky terrain — it lasts 20–30% longer than Hardox 400 in those conditions but costs slightly more." },
      { q: "How often do motor grader cutting edges need to be replaced?", a: "It depends on the work type and steel grade. Mild steel edges on highway projects may last 2–3 weeks. Hardox 400 edges typically last 6–12 weeks in similar conditions. In rocky or abrasive terrain, even Hardox edges may need replacement more frequently." },
      { q: "Do you supply cutting edges for all motor grader brands?", a: "Yes, we supply cutting edges for CAT 120K/H/140H, Komatsu GD511, CASE 845B, XCMG 165, Leeboy 785/985, Sany PQ190, SDLG 9138/9190, Liugong CG414, BEML 605 and Mitsubishi 330 MG." },
    ],
  },
  {
    slug: "grader-blades",
    name: "Grader Blades",
    tagline: "Full-length motor grader blades — all brands and sizes",
    description:
      "SSI Earthmovers supplies complete motor grader moldboard blades in standard and Hardox grades for all major brands. Available in 10ft, 12ft, 14ft and 16ft lengths with all standard bolt hole patterns.",
    longDescription:
      "The motor grader moldboard blade (also called the grader blade) is the primary working tool of any grader — it shapes the material being graded. A worn or bent blade reduces the grader's efficiency and quality of work. SSI Earthmovers manufactures and supplies high-quality grader blades in standard mild steel and Hardox grades for all motor grader makes and models. We maintain stock of the most popular blade sizes (12ft, 14ft, 16ft) for same-day dispatch and can manufacture custom sizes and hole patterns within 3–5 working days.",
    specs: [
      { label: "Standard Lengths", value: "10ft, 12ft, 14ft, 16ft" },
      { label: "Steel Grades", value: "Mild Steel, Hardox 400, Hardox 500" },
      { label: "Bolt Holes", value: "11-hole, 14-hole (as per brand)" },
      { label: "Thickness", value: "16mm, 19mm, 22mm" },
      { label: "Custom", value: "Available within 3–5 working days" },
    ],
    variants: [
      { name: "Standard Mild Steel Blade", desc: "Cost-effective blade for light to medium duty grading. Popular for PMGSY and rural road projects." },
      { name: "Hardox 400 Blade", desc: "2× wear life. For state highway and NHAI contractors where downtime must be minimised." },
      { name: "Hardox 500 Blade", desc: "Maximum wear life for mining, quarry and rocky terrain applications." },
    ],
    compatibleBrands: ["CAT", "Komatsu", "CASE", "XCMG", "Leeboy", "Sany", "SDLG", "Liugong", "BEML", "Mitsubishi"],
    img: "/images/category-grader-blades.png",
    metaTitle: "Motor Grader Blades India | All Brands & Sizes | SSI Earthmovers Delhi",
    metaDesc: "Buy motor grader moldboard blades in India. Mild steel, Hardox 400 & 500. All standard sizes. CAT, Komatsu, CASE, XCMG, Leeboy, Sany, SDLG. Same-day dispatch.",
    faqs: [
      { q: "What size grader blade do I need?", a: "The blade size depends on your grader model. For example, CAT 140H uses a 14ft blade, CAT 120K uses a 12ft blade, and Leeboy 985 uses a 12ft blade. Share your grader model on WhatsApp and we'll confirm the right size immediately." },
      { q: "Can you supply non-standard blade lengths?", a: "Yes, we can manufacture custom blade lengths and hole patterns on order. Lead time is typically 3–5 working days. Contact us with your requirements." },
    ],
  },
  {
    slug: "scarifier-teeth",
    name: "Scarifier Teeth",
    tagline: "High-tensile scarifier teeth & shanks for all motor grader models",
    description:
      "Scarifier teeth (also called ripper tips or tines) are high-impact wear parts that break up hardened road surfaces before regrading. SSI Earthmovers supplies forged alloy steel scarifier teeth for all major motor grader brands.",
    longDescription:
      "Scarifier teeth are subject to extreme impact loading and abrasion in every grading pass. Using low-quality scarifier teeth results in frequent tip breakage, increased downtime and higher cost-per-hour. SSI Earthmovers supplies heat-treated alloy steel scarifier teeth with hardness in the HB 400–500 range for maximum life. Available as individual tips, complete shank assemblies and full scarifier bar sets for all motor grader brands. We maintain in-stock inventory for all popular models — same-day dispatch for most orders.",
    specs: [
      { label: "Material", value: "Forged alloy steel, heat-treated" },
      { label: "Hardness", value: "HB 400–500 (tip)" },
      { label: "Types", value: "Standard tip, heavy-duty tip, complete shank" },
      { label: "Compatibility", value: "All major motor grader brands" },
    ],
    variants: [
      { name: "Standard Scarifier Teeth", desc: "For road construction and highway grading. Most popular choice." },
      { name: "Heavy-Duty Scarifier Teeth", desc: "For quarry, mining and rocky terrain. Extra-thick tip for maximum life." },
      { name: "Complete Shank Assembly", desc: "Full shank + tip assembly for quick changeover. Reduces downtime." },
    ],
    compatibleBrands: ["CAT", "Komatsu", "CASE", "XCMG", "Leeboy", "Sany", "SDLG", "Liugong", "BEML", "Mitsubishi"],
    img: "/images/category-cutting-edges.png",
    metaTitle: "Motor Grader Scarifier Teeth India | All Brands | SSI Earthmovers Delhi",
    metaDesc: "Buy motor grader scarifier teeth and shanks in India. All brands. Same-day dispatch from New Delhi. Call +91-9953105738.",
    faqs: [
      { q: "How many scarifier teeth does a motor grader have?", a: "Most motor graders have 9 to 11 scarifier teeth (tines) in the front-mounted scarifier bar. The exact number depends on the grader model. We can supply a full set of 9 or 11 teeth plus shanks." },
    ],
  },
  {
    slug: "end-bits",
    name: "End Bits & Corner Bits",
    tagline: "Heavy-duty end bits and corner bits for motor grader blades",
    description:
      "End bits (also called corner bits or side cutters) protect the ends of the motor grader blade and handle the heaviest wear during grading operations. SSI Earthmovers supplies cast and forged end bits for all major grader brands.",
    longDescription:
      "End bits sit at both ends of the motor grader blade and take the most severe wear — they handle the transition between cutting and pushing material. A worn end bit accelerates wear on the main blade and reduces grading quality. SSI Earthmovers supplies both LH (left-hand) and RH (right-hand) end bits in cast steel and Hardox grades for all motor grader models. Our end bits are dimensionally matched to OEM specifications for a perfect bolt-on fit.",
    specs: [
      { label: "Types", value: "LH (Left-Hand) and RH (Right-Hand)" },
      { label: "Material", value: "Cast steel / Hardox grade" },
      { label: "Bolt Holes", value: "As per OEM spec for each model" },
      { label: "Compatibility", value: "All major motor grader brands" },
    ],
    variants: [
      { name: "Standard Cast End Bits", desc: "Economy option. Good for light to medium duty applications." },
      { name: "Hardox End Bits", desc: "Premium choice for heavy-duty grading. 2–3× wear life vs standard." },
      { name: "LH + RH Pair Set", desc: "Complete set of left and right end bits. Priced as a pair." },
    ],
    compatibleBrands: ["CAT", "Komatsu", "CASE", "XCMG", "Leeboy", "Sany", "SDLG", "Liugong", "BEML", "Mitsubishi"],
    img: "/images/category-cutting-edges.png",
    metaTitle: "Motor Grader End Bits Corner Bits India | All Brands | SSI Earthmovers Delhi",
    metaDesc: "Buy motor grader end bits and corner bits in India. LH & RH pairs. CAT, Komatsu, CASE, XCMG, Leeboy, SDLG. Same-day dispatch from New Delhi.",
    faqs: [
      { q: "What is the difference between LH and RH end bits?", a: "LH (left-hand) and RH (right-hand) end bits are mirror images of each other — they fit on the left and right ends of the grader blade respectively. Both are needed for a complete set." },
    ],
  },
  {
    slug: "circle-drawbar-parts",
    name: "Circle & Drawbar Parts",
    tagline: "Circle segments, ring gear, drawbar pins & wear parts",
    description:
      "The circle assembly and drawbar are critical mechanical components of every motor grader. SSI Earthmovers supplies circle segments, ring gear, drawbar pins, bushings and all associated wear parts for all major grader brands.",
    longDescription:
      "The motor grader circle (also called the circle ring or ring gear) rotates the blade for angled grading. Worn circle segments cause blade vibration, poor grading quality and eventually costly repairs. SSI Earthmovers supplies individual circle segments, complete ring gear assemblies, drawbar pins, bushings, wear plates and all associated components for CAT, Komatsu, CASE, XCMG, Leeboy, Sany, SDLG, Liugong, BEML and Mitsubishi graders. Parts are manufactured to OEM dimensions for a precise fit.",
    specs: [
      { label: "Circle Segments", value: "Individual segments or complete ring" },
      { label: "Ring Gear", value: "Complete assembly available" },
      { label: "Drawbar Pins", value: "All standard sizes" },
      { label: "Bushings", value: "Bronze and steel grade" },
    ],
    variants: [
      { name: "Circle Segments", desc: "Individual segments to replace worn sections. Most cost-effective option." },
      { name: "Complete Ring Gear", desc: "Full ring gear assembly for heavily worn circles. Quick changeover." },
      { name: "Drawbar Pin Kit", desc: "Complete set of drawbar pins and bushings. For scheduled maintenance." },
      { name: "Circle Wear Plates", desc: "Liner plates that protect the circle from wear. Extend circle life." },
    ],
    compatibleBrands: ["CAT", "Komatsu", "CASE", "XCMG", "Leeboy", "Sany", "SDLG", "Liugong", "BEML", "Mitsubishi"],
    img: "/images/category-grader-blades.png",
    metaTitle: "Motor Grader Circle Segments Ring Gear Drawbar Parts India | SSI Earthmovers",
    metaDesc: "Buy motor grader circle segments, ring gear and drawbar parts in India. All brands. Same-day dispatch from New Delhi. Call +91-9953105738.",
    faqs: [
      { q: "How do I know when to replace circle segments?", a: "Signs of worn circle segments include blade wobble during grading, difficulty maintaining blade angle, unusual noise during circle rotation, and visible wear or gaps in the circle teeth. Replace individual segments before the wear spreads to the full ring." },
    ],
  },
];
