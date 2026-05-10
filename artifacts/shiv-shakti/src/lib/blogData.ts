export interface BlogSection {
  type: "p" | "h2" | "h3" | "ul" | "ol" | "highlight" | "cta";
  text?: string;
  items?: string[];
}

export interface BlogArticle {
  slug: string;
  title: string;
  metaTitle: string;
  metaDesc: string;
  category: string;
  date: string;
  readTime: number;
  excerpt: string;
  featuredImage: string;
  content: BlogSection[];
  relatedSlugs: string[];
}

export const blogArticles: BlogArticle[] = [
  {
    slug: "top-motor-grader-spare-parts-india",
    title: "Top 10 Motor Grader Spare Parts Every Contractor Must Keep in Stock",
    metaTitle: "Top 10 Motor Grader Spare Parts to Keep in Stock | SSI Earthmovers India",
    metaDesc: "Discover the 10 most critical motor grader spare parts every road contractor must stock to prevent costly downtime. Expert guide by SSI Earthmovers, India's leading grader parts supplier.",
    category: "Maintenance Guide",
    date: "2026-04-15",
    readTime: 7,
    excerpt: "Unexpected motor grader breakdowns on active project sites can cost lakhs per day in lost productivity. Keeping the right spare parts on site is the single best way to prevent this. Here are the 10 parts every contractor must have ready.",
    featuredImage: "/images/category-grader-blades.png",
    relatedSlugs: ["how-to-choose-cutting-edges-motor-grader", "signs-hydraulic-issues-motor-grader"],
    content: [
      { type: "p", text: "A motor grader breakdown on an active road construction site can halt an entire project — and in India's fast-paced infrastructure sector, downtime costs lakhs per day. The single best way to protect your projects is to maintain a small but strategic stock of the most commonly replaced wear parts. After 30+ years supplying grader parts to contractors across India, we know exactly which parts fail first and how to keep your machines running." },
      { type: "h2", text: "Why Keeping Spare Parts On-Site Saves Money" },
      { type: "p", text: "Most motor grader components that fail are wear parts — they degrade predictably through normal operation. When you know which parts wear fastest, you can stock them before they're urgently needed. Ordering parts reactively means 2–5 days of downtime waiting for delivery, while proactive stocking keeps machines running and projects on schedule." },
      { type: "h2", text: "1. Cutting Edges — The #1 Most Replaced Part" },
      { type: "p", text: "Cutting edges are the hardened steel blades attached to the bottom of the moldboard. They take direct contact with the road surface and wear down faster than any other component. Depending on the application (gravel, bitumen, or rocky terrain), a cutting edge can last anywhere from 200 to 800 hours. Always keep at least one full set (typically 3–5 blades per machine) on standby. For rocky or abrasive sites, stock Hardox 400 or Hardox 500 grade edges for longer life." },
      { type: "h2", text: "2. Scarifier Teeth and Shanks" },
      { type: "p", text: "The front-mounted scarifier breaks up compacted surfaces before the moldboard passes. The individual teeth (also called ripper teeth or picks) and their shanks wear quickly on hard ground. Each grader typically has 11 scarifier teeth, and replacing a worn tooth set is a 30-minute job on site — if you have the parts. Stock at least one full set of teeth and two or three shanks per machine." },
      { type: "h2", text: "3. End Bits and Side Cutters" },
      { type: "p", text: "End bits are fitted at both ends of the moldboard blade. They protect the blade ends from side wear and can be independently replaced without changing the full cutting edge. Because they take corner impacts, they typically wear faster than the main blade. A set of end bits costs a fraction of the full blade set, so always keep two or three pairs in your stores." },
      { type: "h2", text: "4. Circle Segments and Ring Gear" },
      { type: "p", text: "The circle is the large ring below the moldboard that allows blade rotation. Circle segments and the ring gear teeth wear gradually but are critical for steering precision. Worn segments cause blade positioning errors, making it impossible to achieve accurate grade. Inspect circle segments every 500 hours and stock 2–4 replacement segments depending on your machine model." },
      { type: "h2", text: "5. Draw Bar Pins and Bushings" },
      { type: "p", text: "Draw bar pins connect the moldboard assembly to the grader frame. They experience constant stress and vibration, causing bushing wear that results in blade looseness and grading inaccuracies. Keep a set of draw bar pins and bushings — they are inexpensive but critical. Loose draw bars also accelerate circle segment wear, making replacement even more urgent." },
      { type: "h2", text: "6. Hydraulic Cylinder Seals" },
      { type: "p", text: "Hydraulic systems control blade height, angle, and articulation. When seals fail, oil leaks reduce hydraulic pressure and make accurate blade control impossible. Seal kits are compact, inexpensive, and easy to fit in your on-site stores. Keep seal kits for your blade lift cylinders and side shift cylinders — these are the highest-wear circuits on a grader." },
      { type: "h2", text: "7. Brake Shoes" },
      { type: "p", text: "Motor graders working on slopes and grades put significant load on the braking system. Brake shoe wear is gradual but failure is dangerous. Most graders use drum brakes, and replacing brake shoes is a straightforward job. Keep at least one set per machine, particularly on hilly projects in states like Uttarakhand, Himachal Pradesh, or the Northeast." },
      { type: "h2", text: "8. Worm Gear and Circle Drive Assembly" },
      { type: "p", text: "The circle drive worm gear rotates the blade circle. It operates under continuous load whenever the blade angle is being adjusted. Worn worm gears cause sluggish circle rotation and eventually seize. This is a more expensive component but also more predictable in its wear pattern — inspect at every 1,000-hour service." },
      { type: "h2", text: "9. Blade Bolts and Mounting Hardware" },
      { type: "p", text: "Blade bolts — the fasteners that hold cutting edges, end bits, and ripper teeth to the moldboard — take enormous impact loads and frequently shear or strip. Always keep a full set of blade bolts for each machine. They cost almost nothing but losing one on site can mean an unplanned shutdown if you don't have replacements ready." },
      { type: "h2", text: "10. Axle and Wheel Bushings" },
      { type: "p", text: "On machines working in abrasive or dusty environments — quarries, gravel pits, or unpaved highway corridors — axle and wheel bushings wear faster than normal. Worn bushings cause play in the wheel assembly and uneven blade tracking. Inspect at each major service and keep a set of replacements per machine." },
      { type: "highlight", text: "Pro Tip: For fleet operators running 3 or more graders, consider a centralised spare parts kit shared across machines. This reduces per-machine inventory cost while keeping critical parts accessible." },
      { type: "h2", text: "How to Source Genuine Motor Grader Spare Parts in India" },
      { type: "p", text: "The quality of spare parts directly affects how long they last. Substandard parts made from low-grade steel may cost 30% less but fail 3–4× faster, costing more in the long run. When sourcing parts, always ask for the steel grade and hardness rating for wear parts like cutting edges. Request part numbers and verify they match your machine's OEM specifications. A reliable supplier will have documentation." },
      { type: "p", text: "SSI Earthmovers maintains ready stock of all 10 categories listed above for CAT, Komatsu, CASE, XCMG, SDLG, Leeboy, Sany, Liugong, BEML and Mitsubishi graders. Same-day dispatch from our Mori Gate, New Delhi warehouse. No minimum order quantity." },
      { type: "cta", text: "WhatsApp our team your machine model and part requirement — we'll confirm availability and pricing within 2 hours.", items: [] },
    ],
  },
  {
    slug: "how-to-choose-cutting-edges-motor-grader",
    title: "How to Choose the Right Cutting Edges for Your Motor Grader",
    metaTitle: "How to Choose Cutting Edges for Motor Graders | Buyer's Guide | SSI Earthmovers",
    metaDesc: "Complete guide to choosing the right cutting edges for your motor grader. Steel grades, sizes, applications, OEM vs aftermarket — expert advice from SSI Earthmovers Delhi.",
    category: "Buying Guide",
    date: "2026-04-22",
    readTime: 6,
    excerpt: "Cutting edges are the highest-wear component on any motor grader. Choosing the wrong grade or size costs money — either through premature failure or through overspending on premium steel for light-duty work. Here's how to get it right.",
    featuredImage: "/images/category-grader-blades.png",
    relatedSlugs: ["top-motor-grader-spare-parts-india", "cat-vs-komatsu-grader-parts-india"],
    content: [
      { type: "p", text: "Cutting edges are the single most frequently replaced wear part on any motor grader. Get the selection right and you'll extend your blade life by 2–3× while achieving better grading quality. Get it wrong and you'll either burn through edges too quickly or overspend on premium steel that your application doesn't need. This guide covers everything you need to know." },
      { type: "h2", text: "What Are Cutting Edges?" },
      { type: "p", text: "Cutting edges (also called grader blades or moldboard blades) are flat, rectangular steel plates bolted to the bottom edge of the motor grader's moldboard. They take direct contact with the road surface and are designed to be sacrificial — when worn, they're replaced rather than replacing the expensive moldboard itself. A standard motor grader uses between 3 and 5 blade sections across the full width of the moldboard." },
      { type: "h2", text: "Steel Grades: The Most Important Choice" },
      { type: "p", text: "The steel grade determines how hard and wear-resistant the blade is. This is the single most important factor in cutting edge selection:" },
      { type: "ul", items: [
        "Standard Carbon Steel (HB 200–250): Lowest cost, suitable for very light grading work on paved roads or sandy soils. Wears quickly on abrasive surfaces. Not recommended for most Indian road construction applications.",
        "High Carbon Steel (HB 300–350): Mid-range option for general road maintenance and mixed-surface work. Good balance of cost and durability for most highway projects.",
        "Hardox 400 (HB 400): Premium Swedish wear steel. Suitable for gravel, rocky terrain, quarry work, and aggressive grading applications. Offers 2–3× the life of standard steel on abrasive surfaces.",
        "Hardox 500 (HB 500): Highest wear resistance available. For extreme applications — mining roads, stone quarries, heavily laterite terrain. More expensive upfront but lowest cost-per-hour in the long run.",
      ]},
      { type: "highlight", text: "For most Indian road construction projects — highways, district roads, canal embankments — Hardox 400 grade provides the best cost-per-hour value." },
      { type: "h2", text: "Size Selection: Length, Thickness, and Hole Pattern" },
      { type: "p", text: "Cutting edges come in standard sizes matched to specific grader models. Key dimensions to match:" },
      { type: "ul", items: [
        "Length: Most graders use 14ft (4,267mm) or 16ft (4,877mm) moldboards. The total blade length is divided into 3–5 sections. Always measure the existing blade or consult the OEM specification.",
        "Thickness: Standard is 16mm, 19mm, or 25mm depending on the application. Thicker blades last longer but are heavier. For most projects, 19mm is optimal.",
        "Hole Pattern: The mounting holes must match the moldboard exactly. Common patterns are 11-hole (for standard sections) and custom patterns for specific brands. Providing your existing blade to match the hole pattern is the surest way to get this right.",
        "Width (height): Typically 150mm to 200mm. Choose wider blades for deeper cutting applications.",
      ]},
      { type: "h2", text: "Application-Based Selection Guide" },
      { type: "ul", items: [
        "Bitumen / paved road maintenance: Standard or HB 300 carbon steel — abrasion is low",
        "Gravel road construction and maintenance: Hardox 400 — good all-round choice",
        "Rocky terrain, laterite, or red soil: Hardox 400 or Hardox 500",
        "Quarry or mine haul roads: Hardox 500 — maximum life in extreme conditions",
        "Canal embankment and earthwork: HB 300–350, thicker section (25mm) for heavy loading",
      ]},
      { type: "h2", text: "OEM vs Aftermarket Cutting Edges" },
      { type: "p", text: "OEM (Original Equipment Manufacturer) cutting edges are produced by the machine manufacturer — CAT, Komatsu, CASE etc. — and are guaranteed to fit perfectly. However, they are significantly more expensive than aftermarket alternatives and often made from standard carbon steel." },
      { type: "p", text: "Quality aftermarket cutting edges made from certified Hardox steel offer equivalent or better wear life than OEM blades, at 30–50% lower cost. The key is sourcing from a reputable supplier who can provide material certificates and hardness test reports. Always ask for documentation when purchasing aftermarket wear parts." },
      { type: "h2", text: "How to Know When to Replace Your Cutting Edges" },
      { type: "ul", items: [
        "Blade thickness has worn down to 50% of original (typically below 8–10mm for a 19mm blade)",
        "Grading quality has deteriorated — more passes required to achieve the same finish",
        "Visible cracks, chips, or deformation on the blade face",
        "Bolt holes have elongated, preventing secure mounting",
        "Machine operator reports increased resistance or blade chatter",
      ]},
      { type: "p", text: "Replacing edges before they're completely worn prevents damage to the expensive moldboard itself — a false economy of running edges too long can cost 10× more in moldboard repairs." },
      { type: "h2", text: "Order Cutting Edges from SSI Earthmovers" },
      { type: "p", text: "SSI Earthmovers stocks cutting edges for all major grader models — CAT, Komatsu, CASE, XCMG, SDLG, Leeboy, Sany, and more — in standard and Hardox grades. Ready stock available for same-day dispatch from New Delhi. We supply PAN India with 2–5 day delivery." },
      { type: "cta", text: "Share your machine model and moldboard length on WhatsApp and we'll recommend the right blade and provide a quote within 2 hours.", items: [] },
    ],
  },
  {
    slug: "cat-vs-komatsu-grader-parts-india",
    title: "CAT vs Komatsu Motor Grader Parts: A Comparison for Indian Buyers",
    metaTitle: "CAT vs Komatsu Motor Grader Parts India — Which is Easier to Source? | SSI Earthmovers",
    metaDesc: "Comparing CAT and Komatsu motor grader spare parts availability, cost, and quality in India. Expert insights from SSI Earthmovers, stocking parts for both brands across India.",
    category: "Brand Comparison",
    date: "2026-05-01",
    readTime: 6,
    excerpt: "India's road construction sector runs heavily on CAT and Komatsu motor graders. But when a machine breaks down, which brand's parts are easier to source, faster to get, and more affordable? We break it down from a parts supplier's perspective.",
    featuredImage: "/images/machines/cat-grader.jpg",
    relatedSlugs: ["top-motor-grader-spare-parts-india", "how-to-choose-cutting-edges-motor-grader"],
    content: [
      { type: "p", text: "Caterpillar and Komatsu dominate India's motor grader market. The CAT 120K, 120H and 140H and the Komatsu GD511 and GD535 together account for a significant share of all graders operating on Indian highways, mining sites, and infrastructure projects. As a parts supplier serving contractors across 28 states, we stock and dispatch parts for both brands daily — giving us a unique perspective on their differences." },
      { type: "h2", text: "Market Presence in India" },
      { type: "p", text: "CAT motor graders have a strong presence across India, particularly in the southern and western states. The 120H and 140H are the most common models on National Highway projects. Komatsu GD511 is dominant in eastern and central India — especially in mining states like Jharkhand, Odisha, and Chhattisgarh — due to its robustness in heavy-duty applications and competitive pricing." },
      { type: "h2", text: "Parts Availability in India" },
      { type: "h3", text: "CAT Parts" },
      { type: "p", text: "CAT parts are widely available across India through authorised dealers (Gmmco, Tractors India, etc.) in major cities. However, genuine OEM CAT parts carry a significant price premium — often 2–3× more than quality aftermarket alternatives. For common wear parts like cutting edges and scarifier teeth, the aftermarket supply is mature and reliable. For mechanical components (gears, shafts, hub assemblies), availability through non-OEM channels is more limited, making relationships with specialist suppliers important." },
      { type: "h3", text: "Komatsu Parts" },
      { type: "p", text: "Komatsu has fewer authorised service centres than CAT in India, which can create challenges for contractors in smaller cities. However, the aftermarket parts ecosystem for Komatsu GD511 and GD535 is well-developed. Part numbers are consistent across model years and are widely recognised, making it relatively easy to source replacements from specialist suppliers. The GD511 has particularly good aftermarket coverage due to its large installed base in mining regions." },
      { type: "h2", text: "Cost Comparison" },
      { type: "ul", items: [
        "CAT OEM parts: Typically 20–40% more expensive than equivalent Komatsu OEM parts",
        "CAT aftermarket (quality): Competitive pricing, 30–50% below OEM",
        "Komatsu OEM: Moderately priced; good dealer network for major items",
        "Komatsu aftermarket (quality): Excellent value, especially for GD511 mechanical parts",
        "Wear parts (cutting edges, scarifier teeth): Similar pricing for both brands — aftermarket quality is equivalent",
      ]},
      { type: "h2", text: "Which Parts Fail Most Often?" },
      { type: "h3", text: "On CAT 120H / 140H:" },
      { type: "ul", items: [
        "Cutting edges and end bits — same as all graders",
        "Circle drive gear assembly (part: 6G5533) — wears faster than Komatsu equivalent in dusty conditions",
        "Draw bar pins and bushings — high replacement frequency",
        "Hydraulic cylinder seals — especially on older 120H models",
        "Brake shoes (5T2926 / 6G4526) — common on projects with grade work",
      ]},
      { type: "h3", text: "On Komatsu GD511 / GD535:" },
      { type: "ul", items: [
        "Cutting edges and scarifier teeth — standard wear",
        "Bevel gear assembly (23A-22-11200) — critical component, inspect regularly",
        "Brake drum and brake shoes — high wear in hilly terrain",
        "Worm gear and wheel worm — longer life than CAT equivalent",
        "Stud balls (big and small) — common replacement on GD511",
      ]},
      { type: "h2", text: "Verdict: Which Brand is Better for Indian Conditions?" },
      { type: "p", text: "Both machines are excellent in different applications. CAT 140H offers superior grading precision and is preferred for highway finishing work. Komatsu GD511 offers better torque and robustness for rough, unpaved terrain and mining road applications. From a parts perspective:" },
      { type: "ul", items: [
        "For projects near major cities (Delhi, Mumbai, Chennai, Bangalore): CAT parts are easier to source through authorised dealers",
        "For remote or mining-heavy locations (Jharkhand, Odisha, Rajasthan, Chhattisgarh): Komatsu parts are often more accessible through regional networks",
        "For lowest total cost of ownership: Both brands are comparable when sourcing quality aftermarket parts from specialist suppliers",
      ]},
      { type: "p", text: "SSI Earthmovers maintains ready stock of parts for CAT 120H, 120K, 140H, Komatsu GD511 and GD535 at our New Delhi warehouse. All parts verified against OEM part numbers. Same-day dispatch PAN India." },
      { type: "cta", text: "Looking for parts for your CAT or Komatsu grader? Share your part number or requirement on WhatsApp and we'll confirm availability immediately.", items: [] },
    ],
  },
  {
    slug: "signs-hydraulic-issues-motor-grader",
    title: "5 Warning Signs Your Motor Grader Hydraulic System Needs Attention",
    metaTitle: "5 Signs Your Motor Grader Hydraulic System is Failing | SSI Earthmovers India",
    metaDesc: "Learn the 5 early warning signs of motor grader hydraulic system failure. Prevent costly breakdowns with expert advice from SSI Earthmovers, India's leading grader parts supplier.",
    category: "Troubleshooting",
    date: "2026-05-05",
    readTime: 5,
    excerpt: "Hydraulic system failures are among the most expensive motor grader breakdowns — and the most avoidable. The system almost always gives clear warning signs before it fails completely. Here's what to watch for.",
    featuredImage: "/images/category-axle.png",
    relatedSlugs: ["top-motor-grader-spare-parts-india", "how-to-choose-cutting-edges-motor-grader"],
    content: [
      { type: "p", text: "Hydraulic systems control almost every movement on a motor grader — blade height, blade angle, circle rotation, articulation, and front axle lean. When the hydraulic system fails, the entire machine is unusable. The good news is that hydraulic failures rarely happen without warning. Learning to recognise the early signs can prevent a minor seal replacement from becoming a full hydraulic pump overhaul." },
      { type: "h2", text: "Sign 1: Slow or Sluggish Blade Response" },
      { type: "p", text: "If the moldboard, circle, or side shift respond more slowly than usual to joystick inputs, hydraulic pressure has dropped. This is often the first sign of a failing pump or a developing leak. Don't ignore slow response — it typically means the system is working harder than it should, which accelerates wear on the pump and control valves." },
      { type: "p", text: "What to check first: Hydraulic fluid level. Low fluid is the most common cause of slow response. If the level is correct, the pump output pressure needs to be measured and compared to the manufacturer's specification." },
      { type: "h2", text: "Sign 2: Visible Oil Leaks Under or Around the Machine" },
      { type: "p", text: "A pool of hydraulic oil on the ground overnight or streaks of oil on hydraulic cylinders, hoses, or fittings is a clear sign of seal or hose failure. Hydraulic oil is typically amber-coloured and has a distinctive mineral oil smell. Don't confuse it with engine oil (darker) or coolant (greenish or rusty water)." },
      { type: "p", text: "Small leaks become large leaks quickly under operating pressure. A weeping cylinder seal can fail completely within a few hours of operation. Identify and replace seals immediately — a seal kit costs a few thousand rupees, while a cylinder replacement can cost ten times as much." },
      { type: "h2", text: "Sign 3: Blade Drifting or Dropping Under Load" },
      { type: "p", text: "When you set the blade height and it slowly drifts down or sideways without any joystick input, the hydraulic cylinders are bypassing internally. This is caused by worn cylinder seals or a faulty control valve. On grading work requiring precise blade height, even small amounts of drift cause quality problems and operator fatigue." },
      { type: "p", text: "This symptom requires immediate attention. Internal cylinder bypass wastes hydraulic energy, causes overheating, and accelerates pump wear. Replacing the cylinder seals at this stage is a straightforward job — waiting until the seals fail completely often results in cylinder bore damage." },
      { type: "h2", text: "Sign 4: Unusual Noises from the Hydraulic Pump" },
      { type: "p", text: "A healthy hydraulic pump runs quietly. If you hear whining, squealing, or knocking from the pump area (usually at the rear of the engine compartment), the pump is cavitating — drawing in air or running low on fluid — or internal wear has begun." },
      { type: "ul", items: [
        "High-pitched whine: Usually cavitation — check fluid level and filter condition",
        "Knocking or hammering: Often water or air in the system — bleed and check for contamination",
        "Grinding noise: Internal pump wear — have the pump pressure-tested immediately",
      ]},
      { type: "p", text: "Pump noise should never be ignored. A failing pump under full load can fail catastrophically, sending metal particles throughout the entire hydraulic system and requiring a complete flush plus replacement of filters, pump, and sometimes control valves." },
      { type: "h2", text: "Sign 5: Overheating Hydraulic Oil (Warning Light or Hot Smell)" },
      { type: "p", text: "Hydraulic oil runs hot when the system is working harder than it should — due to internal leakage, a clogged filter, low fluid level, or a faulty cooler. Most modern graders have a hydraulic temperature warning light. If it illuminates, stop work and investigate before continuing." },
      { type: "p", text: "Overheated hydraulic oil breaks down faster, loses its lubrication properties, and accelerates seal and pump wear. It also puts the entire system under higher stress, increasing the risk of hose failure. Always check the hydraulic oil cooler and ensure the cooler fins are clean and free of mud and dust — a common issue on Indian construction sites." },
      { type: "highlight", text: "Preventive tip: Change hydraulic oil and filters at the manufacturer's recommended intervals — typically every 1,000–2,000 hours. Using contaminated or degraded oil is one of the leading causes of hydraulic pump failure in Indian operating conditions." },
      { type: "h2", text: "When to Call for Parts" },
      { type: "p", text: "The most commonly replaced hydraulic components on motor graders are cylinder seal kits, hoses, and control valve seals. These are inexpensive, compact, and easy to keep on site. If you identify any of the above warning signs, the most likely culprit is a cylinder seal kit — available for all major grader brands including CAT, Komatsu, CASE, XCMG and SDLG." },
      { type: "cta", text: "Need hydraulic seal kits or cylinder components for your motor grader? WhatsApp us your machine model and cylinder type — we'll dispatch the right parts same day from New Delhi.", items: [] },
    ],
  },
];

export function getBlogArticle(slug: string): BlogArticle | undefined {
  return blogArticles.find(a => a.slug === slug);
}

export function getRelatedArticles(slug: string): BlogArticle[] {
  const article = getBlogArticle(slug);
  if (!article) return [];
  return article.relatedSlugs
    .map(s => getBlogArticle(s))
    .filter(Boolean) as BlogArticle[];
}
