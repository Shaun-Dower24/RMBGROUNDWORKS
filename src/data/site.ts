export interface Service {
  slug: string;
  title: string;
  shortTitle: string;
  eyebrow: string;
  description: string;
  image: string;
  imageAlt: string;
  intro: string;
  scope: string[];
  considerations: { title: string; body: string }[];
  questions: { question: string; answer: string }[];
  gallery: string[];
  relatedServiceSlugs: string[];
}

export type WorkCategory = 'Substructure' | 'Drainage' | 'External works' | 'Enabling works';

export interface WorkStudy {
  slug: string;
  title: string;
  category: WorkCategory;
  serviceSlug: string;
  image: string;
  imageAlt: string;
  summary: string;
  description: string;
  gallery: string[];
  highlights: string[];
}

export const contacts = {
  name: 'RMB Groundworks',
  tradingName: 'RMB Groundworks Limited',
  phone: '07864 692868',
  phoneHref: 'tel:+447864692868',
  email: 'info@rmbgroundworks.co.uk',
  emailHref: 'mailto:info@rmbgroundworks.co.uk',
  address: '166 Hill End Lane, St Albans, Hertfordshire, AL4 0AB',
  addressLines: ['166 Hill End Lane', 'St Albans, Hertfordshire', 'AL4 0AB'],
  hours: 'Monday–Friday, 7:30am–5pm',
  coverage: 'Hertfordshire, London and the Home Counties',
  base: 'St Albans, Hertfordshire',
};

export const services: Service[] = [
  {
    slug: 'foundations-substructure',
    title: 'Foundations & substructure',
    shortTitle: 'Foundations & substructure',
    eyebrow: 'Below ground. Built around your project.',
    description:
      'Foundations, piling and ground beams, and block & beam floors for new-build and development projects across Hertfordshire, London and the Home Counties.',
    image: 'foundations',
    imageAlt: 'Operatives fixing reinforcement in a residential foundation excavation',
    intro:
      'From foundation excavations to ground beams and block & beam floors, RMB brings together the below-ground elements of a build. We work with developers, main contractors and private clients to discuss the package against the drawings, site conditions and wider construction programme.',
    scope: ['Foundations & substructure', 'Piling and ground beams', 'Block & beam floors'],
    considerations: [
      {
        title: 'The right starting information',
        body: 'Share your site location, relevant drawings and specification, together with the current stage of the project.',
      },
      {
        title: 'A clearly defined package',
        body: 'Discuss excavation, reinforcement, ground beams and floor construction together, with responsibilities and interfaces made clear.',
      },
      {
        title: 'The wider build',
        body: 'Let us know about access, working space, other trades and your proposed sequence so these can form part of the conversation.',
      },
    ],
    questions: [
      {
        question: 'Can we discuss a complete substructure package?',
        answer:
          'Yes. Our services include foundations, piling and ground beams, and block & beam floors. Send the scope and drawings you have so we can discuss the elements your project needs.',
      },
      {
        question: 'What should I send for an initial enquiry?',
        answer:
          'Your site location, a short description of the work, available drawings and an indication of your target dates are a useful starting point.',
      },
      {
        question: 'Can I enquire while the project is still being developed?',
        answer:
          'Yes. Tell us what stage you have reached and which information is already available. We can then discuss what is needed to assess the groundworks package.',
      },
    ],
    gallery: ['02', '11', '19', '24'],
    relatedServiceSlugs: ['drainage', 'demolition-site-preparation'],
  },
  {
    slug: 'basement-civil-works',
    title: 'Basement civil works',
    shortTitle: 'Basement civil works',
    eyebrow: 'A closer look beneath the surface.',
    description:
      'Basement civil works from RMB Groundworks, with an initial discussion of scope, drawings, site access and construction interfaces.',
    image: 'basements',
    imageAlt: 'Steel formwork being lifted into a basement excavation',
    intro:
      'Basement construction brings excavation, formwork, reinforcement and neighbouring works into close contact. RMB provides basement civil works, with the scope discussed in the context of the design information and the practical conditions on site.',
    scope: [
      'Basement civil works',
      'Excavation and substructure interfaces',
      'Formwork and reinforcement works within the agreed package',
    ],
    considerations: [
      {
        title: 'Design information',
        body: 'Start with the relevant structural drawings, specifications and known constraints, so the civil works can be discussed against a defined scope.',
      },
      {
        title: 'Access and surroundings',
        body: 'Tell us about working space, deliveries, neighbouring properties and the site arrangements that will affect the proposed works.',
      },
      {
        title: 'Clear interfaces',
        body: 'Identify the relationship between the civil works, waterproofing design and other specialist packages before agreeing responsibilities.',
      },
    ],
    questions: [
      {
        question: 'What basement information should I provide?',
        answer:
          'Please share the site location, available structural drawings, the intended scope and any known access or site constraints.',
      },
      {
        question: 'Does a basement enquiry include waterproofing?',
        answer:
          'Please identify your waterproofing requirements and any specialist design or installation arrangements in the enquiry. The specific package and responsibilities need to be agreed for your project.',
      },
      {
        question: 'Can we discuss a basement as part of wider groundworks?',
        answer:
          'Yes. Explain the surrounding foundation, drainage and external works requirements so the relationship between the packages is clear.',
      },
    ],
    gallery: ['21', '03', '08'],
    relatedServiceSlugs: ['foundations-substructure', 'drainage'],
  },
  {
    slug: 'drainage',
    title: 'Foul & surface water drainage',
    shortTitle: 'Drainage',
    eyebrow: 'An essential part of the groundworks.',
    description:
      'Foul and surface water drainage installation for construction and external works projects across Hertfordshire, London and the Home Counties.',
    image: 'drainage',
    imageAlt: 'Drainage pipework set out across a new-build plot',
    intro:
      'Drainage needs to sit alongside the foundations, levels and finished external areas of a project. RMB carries out foul and surface water drainage work as part of its groundworks and civil services, with the layout and interfaces considered against the information supplied.',
    scope: [
      'Foul water drainage',
      'Surface water drainage',
      'Drainage installation within a groundworks or external works package',
    ],
    considerations: [
      {
        title: 'The proposed layout',
        body: 'Available drainage drawings, level information and specifications help establish what is required.',
      },
      {
        title: 'Existing connections',
        body: 'Share what is known about existing services and connection points, and flag any information that still needs to be established.',
      },
      {
        title: 'Working alongside the build',
        body: 'Discuss drainage with the substructure and external works so the sequence and package boundaries are understood.',
      },
    ],
    questions: [
      {
        question: 'Do you work on foul and surface water drainage?',
        answer:
          'Both are part of RMB’s drainage services. Let us know which systems are involved and whether the work forms part of a wider construction package.',
      },
      {
        question: 'What information helps with a drainage enquiry?',
        answer:
          'A site location, available drawings, known connection information and a short description of the proposed work are useful.',
      },
      {
        question: 'Is this an emergency drainage service?',
        answer:
          'This service is for planned drainage and construction works. For a project enquiry, please contact the team during the published working hours.',
      },
    ],
    gallery: ['14', '17', '12'],
    relatedServiceSlugs: ['foundations-substructure', 'car-parks-external-works'],
  },
  {
    slug: 'demolition-site-preparation',
    title: 'Demolition & site preparation',
    shortTitle: 'Demolition & preparation',
    eyebrow: 'Prepare the ground for what comes next.',
    description:
      'Demolition and site preparation from RMB Groundworks, with the existing site, proposed scope and next construction stages discussed from the outset.',
    image: 'demolition',
    imageAlt: 'Orange excavator demolishing a structure among brick rubble',
    intro:
      'The next stage of a project starts with understanding what is already on site. RMB’s services include demolition and site clearance, providing a starting point for a conversation about the enabling works needed before new construction begins.',
    scope: [
      'Demolition',
      'Site clearance',
      'Site preparation within the agreed groundworks package',
    ],
    considerations: [
      {
        title: 'The existing site',
        body: 'Describe the structures and materials involved, current use of the site and any known services or restrictions.',
      },
      {
        title: 'A defined scope',
        body: 'Make clear what is to be removed, retained or protected, and which surveys and design information are available.',
      },
      {
        title: 'The next stage',
        body: 'Tell us what follows the enabling works, including any proposed foundation, drainage or external works package.',
      },
    ],
    questions: [
      {
        question: 'What should I include in a demolition enquiry?',
        answer:
          'Share the site location, a description of the existing structure, photographs or drawings where available, and the proposed extent of the work.',
      },
      {
        question: 'Can the enquiry include subsequent groundworks?',
        answer:
          'Yes. Please include the wider scope so demolition, preparation and the proposed construction stages can be discussed together.',
      },
      {
        question: 'What if some site information is still missing?',
        answer:
          'Tell us what is known and what is still being investigated. The information required to assess and define the package can then be discussed.',
      },
    ],
    gallery: ['13', '15', '24'],
    relatedServiceSlugs: ['foundations-substructure', 'drainage'],
  },
  {
    slug: 'car-parks-external-works',
    title: 'Car parks & external works',
    shortTitle: 'Car parks & external works',
    eyebrow: 'From construction site to finished surroundings.',
    description:
      'Car parks, kerbing, path edging, hard landscaping and external works from RMB Groundworks across Hertfordshire, London and the Home Counties.',
    image: 'car-parks',
    imageAlt: 'Completed tarmac car park with marked bays and an RMB van',
    intro:
      'External works connect a building with the space around it. RMB’s services include car parks, kerbing and path edging, hard landscaping and paving. We discuss the intended use, materials, access and drainage requirements as part of the project brief.',
    scope: ['Car parks', 'Kerbing & path edging', 'Hard landscaping & external works'],
    considerations: [
      {
        title: 'Use and finish',
        body: 'Tell us how the space will be used, the proposed layout and any materials or finish specifications already selected.',
      },
      {
        title: 'Levels and drainage',
        body: 'Available layout, level and drainage information helps define how surfaces and surrounding works fit together.',
      },
      {
        title: 'Access during the work',
        body: 'For an occupied site, explain access needs and any proposed phasing so these can be discussed before a package is agreed.',
      },
    ],
    questions: [
      {
        question: 'Can I discuss surfacing and landscaping together?',
        answer:
          'Yes. Our services include car parks, kerbing, path edging and hard landscaping. Share the proposed scope and any layout or material specifications.',
      },
      {
        question: 'What information helps with a car park enquiry?',
        answer:
          'Please include the location, approximate area or layout, current condition, intended use, available specifications and any access requirements.',
      },
      {
        question: 'Do you welcome private external works enquiries?',
        answer:
          'Yes. Describe the work and location so the team can discuss whether the project is a suitable fit.',
      },
    ],
    gallery: ['07', '10', '18', '22'],
    relatedServiceSlugs: ['drainage', 'demolition-site-preparation'],
  },
];

export const serviceBySlug = (slug: string): Service | undefined =>
  services.find((service) => service.slug === slug);

export const workStudies: WorkStudy[] = [
  {
    slug: 'foundation-reinforcement',
    title: 'Foundation reinforcement',
    category: 'Substructure',
    serviceSlug: 'foundations-substructure',
    image: '02',
    imageAlt: 'Reinforced concrete foundation with starter bars',
    summary:
      'A closer look at foundation preparation, reinforcement and the work beneath a new build.',
    description:
      'Reinforcement, formwork and excavation details from our substructure work. This collection brings together different stages and sites, showing the preparation below the visible building.',
    gallery: ['02', '11', '15', '24'],
    highlights: ['Foundation excavation', 'Reinforcement and formwork', 'Substructure preparation'],
  },
  {
    slug: 'basement-civil-works',
    title: 'Basement civil works',
    category: 'Substructure',
    serviceSlug: 'basement-civil-works',
    image: '21',
    imageAlt: 'Steel formwork being lifted into a basement excavation',
    summary: 'Formwork and reinforcement in focus within the basement works collection.',
    description:
      'Basement excavation, reinforcement and formwork from our civil works collection. These selected views bring the working areas and construction details into focus across different stages and sites.',
    gallery: ['21', '03', '08'],
    highlights: ['Basement formwork', 'Reinforcement detail', 'Excavation working areas'],
  },
  {
    slug: 'drainage-installation',
    title: 'Drainage installation',
    category: 'Drainage',
    serviceSlug: 'drainage',
    image: '14',
    imageAlt: 'Drainage pipes laid out across a new-build excavation',
    summary: 'Pipework, site layouts and the relationship between drainage and the wider build.',
    description:
      'Pipework layouts and drainage details from our groundworks collection. These views show how drainage sits alongside the foundations and other site works within a construction package.',
    gallery: ['14', '17', '12'],
    highlights: ['Drainage layouts', 'Pipework installation', 'Groundworks interfaces'],
  },
  {
    slug: 'car-parks-surfacing',
    title: 'Car parks & surfacing',
    category: 'External works',
    serviceSlug: 'car-parks-external-works',
    image: '07',
    imageAlt: 'Completed car park with marked bays and an RMB van',
    summary: 'Kerb lines, tarmac installation and finished car park surfaces.',
    description:
      'From kerb lines and tarmac laying to a marked car park, this collection explores different aspects of our surfacing and external works. A view of the preparation, installation and finished surfaces across the work.',
    gallery: ['07', '04', '10', '22'],
    highlights: ['Car park surfaces', 'Kerbing and edges', 'Tarmac installation'],
  },
  {
    slug: 'block-beam-floors',
    title: 'Block & beam floors',
    category: 'Substructure',
    serviceSlug: 'foundations-substructure',
    image: '01',
    imageAlt: 'Block and beam floor laid on a residential plot',
    summary: 'Floor construction and its connection to the surrounding substructure.',
    description:
      'Installation and prepared-floor views from our block & beam collection, alongside foundation and edge-beam details. Selected images from different sites bring the floor construction and surrounding substructure into focus.',
    gallery: ['01', '05', '19', '25'],
    highlights: ['Block & beam floors', 'Floor perimeter details', 'Substructure coordination'],
  },
  {
    slug: 'hard-landscaping',
    title: 'Hard landscaping',
    category: 'External works',
    serviceSlug: 'car-parks-external-works',
    image: '18',
    imageAlt: 'Large-format paving and a channel drain outside a new building',
    summary: 'Paved areas, external finishes and the details around a building.',
    description:
      'Large-format paving, channel drainage and driveway preparation from our external works collection. Explore the relationship between finished surfaces and the construction around a building.',
    gallery: ['18', '23', '17'],
    highlights: ['Large-format paving', 'External drainage detail', 'Driveway preparation'],
  },
];

export const workStudyBySlug = (slug: string): WorkStudy | undefined =>
  workStudies.find((work) => work.slug === slug);

export const categories: WorkCategory[] = ['Substructure', 'Drainage', 'External works'];

export const process = [
  {
    title: 'Initial consultation & site review',
    body: 'Tell us about the location, scope and stage of your project. We start with the information available and discuss what is needed next.',
  },
  {
    title: 'Quotation & tender submission',
    body: 'Review the proposed package, relevant drawings and requirements so the quotation or tender can be considered against a defined scope.',
  },
  {
    title: 'Site enabling & preparation',
    body: 'Establish the agreed starting works and the site arrangements needed before the main construction stages begin.',
  },
  {
    title: 'Execution & construction',
    body: 'Carry out the agreed groundworks package in the context of the site and the wider construction sequence.',
  },
  {
    title: 'Sign-off & handover',
    body: 'Review the completed scope and agree the project’s sign-off and handover requirements.',
  },
];
