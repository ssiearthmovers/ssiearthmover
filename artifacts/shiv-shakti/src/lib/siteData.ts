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
  img: string;
  metaTitle: string;
  metaDesc: string;
  faqs: { q: string; a: string }[];
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
    img: "/images/motor-grader-hero.png",
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
    models: ["Komatsu GD511"],
    color: "#e8c13a",
    tagline: "Spare parts for Komatsu GD511 motor graders — PAN India delivery",
    description:
      "Komatsu GD511 is one of the most powerful and reliable motor graders used across India's mining and infrastructure sectors. SSI Earthmovers maintains a dedicated inventory of Komatsu GD511 spare parts for fast dispatch from New Delhi.",
    longDescription:
      "SSI Earthmovers supplies a complete range of Komatsu GD511 motor grader spare parts including cutting edges, grader blades, scarifier teeth, end bits and all wear components. The GD511 is widely used in coal mines, stone quarries and large infrastructure projects in Jharkhand, Odisha, Chhattisgarh and Rajasthan. Our parts are manufactured to Komatsu OEM specifications using high-tensile and Hardox grade steels for maximum wear life. We stock sufficient quantities for immediate dispatch — no waiting time. Fleet operators running multiple GD511 units can avail of our bulk pricing. Our technical team can help identify the right part by OEM number or dimensions if you share them via WhatsApp.",
    keyParts: [
      "Cutting Edges",
      "Grader Blades",
      "Scarifier Teeth & Ripper Tips",
      "End Bits",
      "Circle Segments",
      "Draw Bar Components",
      "Wear Plates",
    ],
    img: "/images/motor-grader-hero.png",
    metaTitle: "Komatsu GD511 Motor Grader Spare Parts India | SSI Earthmovers Delhi",
    metaDesc:
      "Buy Komatsu GD511 motor grader spare parts in India. Cutting edges, grader blades, scarifier teeth, end bits. Same-day dispatch from New Delhi. Call +91-9953105738.",
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
      "SSI Earthmovers supplies complete spare parts support for CASE 845B motor graders operating across India. Our inventory includes Hardox cutting edges, grader blades, scarifier teeth, end bits, circle segments and draw bar parts, all manufactured to CASE Construction's OEM specifications. The CASE 845B is commonly deployed on state highway and rural road projects, and minimising downtime is critical. We maintain sufficient stock for immediate same-day dispatch to any destination in India. Whether you need a single replacement part or a full set for fleet maintenance, our team can assist. Call or WhatsApp us with your part number or dimensions for a quick quote.",
    keyParts: [
      "Cutting Edges",
      "Grader Blades",
      "Scarifier Teeth",
      "End Bits",
      "Circle Segments & Wear Parts",
      "Draw Bar Assembly Parts",
      "Blade Bolts & Hardware",
    ],
    img: "/images/motor-grader-hero.png",
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
    models: ["XCMG 165"],
    color: "#a0a0a0",
    tagline: "Spare parts for XCMG 165 motor graders — fast dispatch across India",
    description:
      "XCMG motor graders have gained significant adoption across India's road construction sector due to their competitive pricing and reliability. SSI Earthmovers supplies a complete range of spare parts for the XCMG 165 motor grader.",
    longDescription:
      "As XCMG graders have expanded their presence in Indian road projects, SSI Earthmovers has built a dedicated parts inventory for the XCMG 165. We supply cutting edges, grader blades, scarifier teeth, end bits and circle components that meet XCMG OEM specifications. XCMG 165 parts are available from our New Delhi warehouse for same-day or next-day dispatch. Our team has in-depth knowledge of XCMG grader parts compatibility — we can help you identify the right part even without the OEM part number. Bulk pricing is available for contractors running multiple XCMG 165 units.",
    keyParts: [
      "Cutting Edges",
      "Grader Blades",
      "Scarifier Teeth",
      "End Bits",
      "Circle Segments",
      "Draw Bar Parts",
    ],
    img: "/images/motor-grader-hero.png",
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
    img: "/images/motor-grader-hero.png",
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
    models: ["Sany PQ190"],
    color: "#8a3ae8",
    tagline: "Spare parts for Sany PQ190 motor graders — PAN India supply",
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
    img: "/images/motor-grader-hero.png",
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
    img: "/images/motor-grader-hero.png",
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
    compatibleBrands: ["CAT", "KOMATSU", "CASE", "XCMG", "LEEBOY", "SANY", "SDLG", "LIUGONG", "BEML", "MITSUBISHI"],
    img: "/images/category-cutting-edges.png",
    metaTitle: "Motor Grader Cutting Edges Supplier India | Hardox 400 500 | SSI Earthmovers Delhi",
    metaDesc:
      "Buy motor grader cutting edges in India. Hardox 400 & 500 grade steel. All sizes — 12ft, 14ft, 16ft, 11-hole. CAT, Komatsu, CASE, XCMG, Leeboy and all brands. Same-day dispatch from Delhi. Call +91-9953105738.",
    faqs: [
      {
        q: "What is the difference between Hardox 400 and Hardox 500 cutting edges?",
        a: "Hardox 400 has a Brinell hardness of HB 400 and is the standard high-performance choice for road construction and grading. Hardox 500 (HB 500) is harder and suited for extremely abrasive conditions like quarrying and mining. Both offer significantly longer wear life than standard mild steel edges.",
      },
      {
        q: "What sizes of motor grader cutting edges do you supply?",
        a: "We supply cutting edges in 12ft, 14ft and 16ft standard lengths, with 11-hole and 14-hole bolt patterns. Custom sizes are also available — contact us with your required dimensions.",
      },
      {
        q: "Which brands of motor graders do your cutting edges fit?",
        a: "Our cutting edges are available for all major brands including CAT (120K, 120H, 140H), Komatsu GD511, CASE 845B, XCMG 165, Leeboy 785/985, Sany PQ190, SDLG 9138/9190, Liugong CG414, BEML 605 and Mitsubishi 330 MG.",
      },
      {
        q: "How quickly can I get cutting edges delivered to my site?",
        a: "In-stock cutting edges are dispatched the same day or next business day from our New Delhi warehouse. Delivery across India typically takes 2–5 business days depending on your location.",
      },
    ],
  },
  {
    slug: "grader-blades",
    name: "Grader Blades",
    tagline: "Premium curved & straight grader blades for precision surface levelling",
    description:
      "Motor grader blades (also called moldboards) are the primary surface contact component for levelling, grading and finishing. SSI Earthmovers supplies high-quality curved and straight grader blades for all major motor grader makes and models used in India.",
    longDescription:
      "The grader blade (moldboard) is central to a motor grader's performance — it controls the quality and efficiency of the grading, levelling and finishing pass. SSI Earthmovers supplies both curved and straight grader blades in high-tensile steel, designed for precise surface finishing on road sub-grades, embankments and granular layers. Our blades are manufactured to exact model-specific dimensions for a proper fit and alignment with your cutting edges and end bits. Available in 12ft, 14ft and 16ft lengths for all major brands. Matching blade bolts and hardware are also available.",
    specs: [
      { label: "Types", value: "Curved (standard) / Straight" },
      { label: "Standard Lengths", value: "12 ft, 14 ft, 16 ft" },
      { label: "Steel Grade", value: "High-tensile steel" },
      { label: "Finish", value: "Painted / bare steel" },
      { label: "Hardware", value: "Matching blade bolts available" },
      { label: "Delivery", value: "Same-day dispatch from New Delhi" },
    ],
    variants: [
      { name: "Curved Grader Blades", desc: "Standard curved profile for efficient material rolling and precise levelling." },
      { name: "Straight Grader Blades", desc: "Flat profile for finish grading, shoulder work and ditch cutting." },
      { name: "Half-Arrow Blades", desc: "Angled profile for windrow and ditch-cutting applications." },
    ],
    compatibleBrands: ["CAT", "KOMATSU", "CASE", "XCMG", "LEEBOY", "SANY", "SDLG", "LIUGONG", "BEML", "MITSUBISHI"],
    img: "/images/category-grader-blades.png",
    metaTitle: "Motor Grader Blades Supplier India | Curved & Straight Moldboards | SSI Earthmovers",
    metaDesc:
      "Buy motor grader blades (moldboards) in India. Curved and straight, all sizes. CAT, Komatsu, CASE, XCMG, Leeboy and all brands. Same-day dispatch from Delhi. Call +91-9953105738.",
    faqs: [
      {
        q: "What is the difference between a grader blade and a cutting edge?",
        a: "The grader blade (moldboard) is the large curved or straight steel plate that moves material sideways during grading. The cutting edge is the replaceable hardened steel strip attached to the bottom of the blade that does the actual cutting. Cutting edges wear out much faster and are replaced more frequently.",
      },
      {
        q: "Do you supply grader blades for CAT 140H?",
        a: "Yes, we supply curved and straight grader blades in the correct dimensions for the CAT 140H, as well as all other major motor grader models. Contact us for pricing.",
      },
    ],
  },
  {
    slug: "scarifier-teeth",
    name: "Scarifier Teeth & Ripper Tips",
    tagline: "Heavy-duty scarifier teeth, ripper tips and shanks for tough terrain",
    description:
      "Scarifier teeth and ripper tips are essential for breaking up hard ground, old road surfaces and compacted material before grading. SSI Earthmovers supplies heavy-duty scarifier teeth and shanks for all major motor grader models used in India.",
    longDescription:
      "Motor grader scarifiers break hard ground, old asphalt and compacted soil ahead of the blade. Both the teeth (tips) and the shanks wear and need regular replacement to maintain effective scarification depth and efficiency. SSI Earthmovers supplies carbide-tipped and high-alloy steel scarifier teeth, as well as replacement shanks, for all major motor grader brands. Our scarifier teeth are engineered to penetrate hard terrain without excessive shock loading on the machine. Available in standard and Hardox-grade configurations for extended service life. Bulk packs available for fleet operators.",
    specs: [
      { label: "Types", value: "Carbide-tipped / High-alloy steel / Standard" },
      { label: "Components", value: "Teeth (tips) + Shanks sold separately" },
      { label: "Compatibility", value: "All major motor grader brands" },
      { label: "Packing", value: "Individual or bulk packs" },
      { label: "Delivery", value: "Same-day dispatch from New Delhi" },
    ],
    variants: [
      { name: "Carbide-tipped Scarifier Teeth", desc: "Maximum penetration in hard rock and old asphalt. Longest service life." },
      { name: "Standard Alloy Scarifier Teeth", desc: "Cost-effective choice for normal soil and gravel scarification." },
      { name: "Replacement Shanks", desc: "Heavy-duty shanks for all major grader brands. Replace bent or worn shanks quickly." },
      { name: "Ripper Tips", desc: "Single-shank ripper tips for breaking very hard ground and rock." },
    ],
    compatibleBrands: ["CAT", "KOMATSU", "CASE", "XCMG", "LEEBOY", "SANY", "SDLG", "LIUGONG", "BEML", "MITSUBISHI"],
    img: "/images/category-transmission.png",
    metaTitle: "Motor Grader Scarifier Teeth & Ripper Tips India | SSI Earthmovers Delhi",
    metaDesc:
      "Buy motor grader scarifier teeth, ripper tips and shanks in India. CAT, Komatsu, CASE, XCMG, Leeboy and all brands. Same-day dispatch from New Delhi. Call +91-9953105738.",
    faqs: [
      {
        q: "What are motor grader scarifier teeth used for?",
        a: "Scarifier teeth are used to break up hard, compacted ground, old road surfaces or gravel layers before the grader blade passes over. They penetrate the surface from the rear of the machine, loosening material for efficient grading.",
      },
      {
        q: "How often do scarifier teeth need to be replaced?",
        a: "Replacement frequency depends on soil/rock hardness and usage. In hard rock or old asphalt scarification, teeth may need replacing every few hundred hours. In normal soil conditions, they last much longer. Regular inspection is recommended.",
      },
    ],
  },
  {
    slug: "end-bits",
    name: "End Bits & Wear Parts",
    tagline: "Durable end bits, corner bits and all grader blade wear parts",
    description:
      "End bits (also called corner bits) protect the ends of the motor grader blade from rapid wear during angled grading, ditch cutting and shoulder work. SSI Earthmovers supplies Hardox-grade end bits and all related wear parts for every major grader brand.",
    longDescription:
      "The ends of a motor grader blade are the most vulnerable sections — they take heavy impact during angled cutting, ditch work and corner grading. End bits are sacrificial wear components designed to protect the blade body. SSI Earthmovers supplies heavy-duty end bits in standard and Hardox 400 grades, in bolt-on and weld-on configurations, for all major motor grader models. Matching hardware (bolts, nuts, washers) is also available. We also supply other blade wear parts including wing shrouds and side plates. Fast delivery to any location in India.",
    specs: [
      { label: "Types", value: "Bolt-on end bits / Weld-on end bits / Corner bits" },
      { label: "Steel Grade", value: "Standard alloy / Hardox 400" },
      { label: "Orientation", value: "Left-hand / Right-hand / Universal" },
      { label: "Compatibility", value: "All major motor grader brands" },
      { label: "Hardware", value: "Matching bolts & nuts available" },
    ],
    variants: [
      { name: "Bolt-on End Bits", desc: "Quick replacement without welding. Standard and Hardox 400 grade available." },
      { name: "Weld-on End Bits", desc: "More durable attachment for heavy-duty applications." },
      { name: "Corner Bits", desc: "Small sacrificial corners that protect the blade ends during corner work." },
      { name: "Wing Shrouds", desc: "Side protectors for extended blade life during push work." },
    ],
    compatibleBrands: ["CAT", "KOMATSU", "CASE", "XCMG", "LEEBOY", "SANY", "SDLG", "LIUGONG", "BEML", "MITSUBISHI"],
    img: "/images/category-hydraulic.png",
    metaTitle: "Motor Grader End Bits & Corner Bits India | SSI Earthmovers Delhi",
    metaDesc:
      "Buy motor grader end bits and corner bits in India. Hardox grade bolt-on and weld-on. CAT, Komatsu, CASE, XCMG, Leeboy and all brands. Same-day dispatch from Delhi. Call +91-9953105738.",
    faqs: [
      {
        q: "What is the difference between end bits and cutting edges?",
        a: "Cutting edges run along the full bottom of the grader blade and do most of the cutting work. End bits are smaller wear pieces bolted to the ends of the blade to protect the corners, which are most vulnerable during angled and ditch grading.",
      },
      {
        q: "Do you have end bits for CAT 140H grader?",
        a: "Yes, we stock both left-hand and right-hand end bits for the CAT 140H in standard and Hardox 400 grade. Available for same-day dispatch.",
      },
    ],
  },
  {
    slug: "circle-drawbar-parts",
    name: "Circle & Draw Bar Parts",
    tagline: "Circle segments, draw bar pins, bushings and related components",
    description:
      "The circle assembly and draw bar are critical structural components on every motor grader. SSI Earthmovers supplies circle segments, circle drive gears, draw bar pins, bushings and related components for all major grader brands and models.",
    longDescription:
      "The circle (ring gear) and draw bar assembly allow the motor grader blade to rotate and angle for precise cutting and grading control. These are high-precision, load-bearing components that wear gradually over thousands of hours. SSI Earthmovers stocks replacement circle segments, circle drive pinions, circle drive mounting hardware, draw bar pins, draw bar bushings and wear plates for all major motor grader brands. Using worn circle or draw bar parts reduces blade control accuracy and accelerates wear on other components. Our technical team can assist in identifying the correct part by OEM number or machine serial number.",
    specs: [
      { label: "Components", value: "Circle segments, ring gear, draw bar pins, bushings, wear plates" },
      { label: "Material", value: "Alloy steel / Heat-treated steel" },
      { label: "Compatibility", value: "All major motor grader brands" },
      { label: "Technical support", value: "Part identification by OEM number or serial number" },
    ],
    variants: [
      { name: "Circle Segments & Ring Gear", desc: "Precision-machined circle segments for smooth blade rotation." },
      { name: "Circle Drive Pinion & Housing", desc: "Drive gear and mounting components for the circle drive mechanism." },
      { name: "Draw Bar Pins & Bushings", desc: "Wear-resistant pins and bushings for the draw bar ball-and-socket joint." },
      { name: "Circle Wear Plates & Liners", desc: "Replaceable wear plates to protect the circle frame from abrasion." },
    ],
    compatibleBrands: ["CAT", "KOMATSU", "CASE", "XCMG", "LEEBOY", "SANY", "SDLG", "LIUGONG", "BEML", "MITSUBISHI"],
    img: "/images/category-engine.png",
    metaTitle: "Motor Grader Circle & Draw Bar Parts India | SSI Earthmovers Delhi",
    metaDesc:
      "Buy motor grader circle segments, draw bar pins, bushings and circle drive parts in India. All brands. Same-day dispatch from New Delhi. Call +91-9953105738.",
    faqs: [
      {
        q: "What are circle segments on a motor grader?",
        a: "The circle (also called the ring gear) is the large ring-shaped component that allows the grader blade to rotate 360°. Circle segments are sections of this ring that can be individually replaced as they wear, rather than replacing the entire circle.",
      },
      {
        q: "How do I know if my draw bar pins need replacing?",
        a: "Signs of worn draw bar pins include excessive blade play, difficulty maintaining blade angle, unusual noise from the draw bar area or visible wear/slop in the draw bar joints. Regular inspection is recommended during routine maintenance.",
      },
    ],
  },
];
