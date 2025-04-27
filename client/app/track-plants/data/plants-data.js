// Plant growth plans - reference data that doesn't need to be persisted
export const plantGrowthPlans = [
  {
    id: 1,
    name: 'Tomato',
    variety: 'Roma',
    image: '🍅',
    difficulty: 'Medium',
    harvestTime: '80-90 days',
    defaultWeight: 2, // in kg
    water: [
      { time: 6, amount: 300 },
      { time: 17, amount: 200 }
    ],
    references: [
      { title: "Tomato Growing Guide", url: "https://www.rhs.org.uk/vegetables/tomatoes/grow-your-own", type: "guide" },
      { title: "Common Tomato Diseases", url: "https://www.gardeningknowhow.com/edible/vegetables/tomato/tomato-diseases.htm", type: "disease" },
      { title: "Pruning Techniques", url: "https://www.thespruce.com/how-to-prune-tomatoes-848197", type: "maintenance" }
    ],
    stages: [
      { name: 'Seed', duration: '7-14 days', care: 'Keep soil moist, 70-80°F' },
      { name: 'Seedling', duration: '15-30 days', care: 'Provide 6-8 hours of light' },
      { name: 'Vegetative', duration: '30-50 days', care: 'Regular watering, support stems' },
      { name: 'Flowering', duration: '50-70 days', care: 'Reduce nitrogen, increase potassium' },
      { name: 'Fruiting', duration: '70-90 days', care: 'Consistent water, watch for pests' },
    ]
  },
  {
    id: 2,
    name: 'Basil',
    variety: 'Sweet Basil',
    image: '🌿',
    difficulty: 'Easy',
    harvestTime: '50-60 days',
    defaultWeight: 0.5, // in kg
    water: [
      { time: 7, amount: 150 },
      { time: 18, amount: 150 }
    ],
    references: [
      { title: "Basil Care Guide", url: "https://www.almanac.com/plant/basil" },
      { title: "Harvesting Basil", url: "https://www.gardenersworld.com/how-to/grow-plants/how-to-harvest-basil/" },
      { title: "Preventing Bolting", url: "https://savvygardening.com/how-to-prevent-basil-from-flowering/" }
    ],
    stages: [
      { name: 'Seed', duration: '5-10 days', care: 'Warm soil, light covering' },
      { name: 'Seedling', duration: '10-20 days', care: 'Bright indirect light' },
      { name: 'Vegetative', duration: '20-40 days', care: 'Regular pruning, moderate water' },
      { name: 'Mature', duration: '40-60 days', care: 'Harvest outer leaves regularly' },
    ]
  },
  {
    id: 3,
    name: 'Pepper',
    variety: 'Bell Pepper',
    image: '🫑',
    difficulty: 'Medium',
    harvestTime: '90-100 days',
    defaultWeight: 1.5, // in kg
    water: [
      { time: 6, amount: 450 }
    ],
    references: [
      { title: "Bell Pepper Growing Guide", url: "https://www.almanac.com/plant/bell-peppers" },
      { title: "Pepper Plant Problems", url: "https://www.thespruce.com/pepper-growing-problems-1403414" },
      { title: "When to Harvest Peppers", url: "https://harvesttotable.com/how_to_harvest_and_store_pep/" }
    ],
    stages: [
      { name: 'Seed', duration: '7-14 days', care: 'Warm soil (80-90°F)' },
      { name: 'Seedling', duration: '14-35 days', care: 'Bright light, avoid overwatering' },
      { name: 'Vegetative', duration: '35-60 days', care: 'Support stems, consistent watering' },
      { name: 'Flowering', duration: '60-80 days', care: 'Avoid high nitrogen fertilizers' },
      { name: 'Fruiting', duration: '80-100 days', care: 'Consistent moisture, calcium supplement' },
    ]
  },
  {
    id: 4,
    name: 'Lettuce',
    variety: 'Butterhead',
    image: '🥬',
    difficulty: 'Easy',
    harvestTime: '45-55 days',
    defaultWeight: 0.8, // in kg
    water: [
      { time: 6, amount: 150 },
      { time: 17, amount: 100 }
    ],
    references: [
      { title: "Growing Lettuce", url: "https://www.almanac.com/plant/lettuce" },
      { title: "Succession Planting", url: "https://www.growveg.com/guides/succession-sowing-of-lettuce/" },
      { title: "Preventing Bolting", url: "https://www.gardeningknowhow.com/edible/vegetables/lettuce/bolting-lettuce-plants.htm" }
    ],
    stages: [
      { name: 'Seed', duration: '2-8 days', care: 'Shallow planting, light soil' },
      { name: 'Seedling', duration: '8-20 days', care: 'Keep soil moist, moderate light' },
      { name: 'Leaf development', duration: '20-40 days', care: 'Regular light watering' },
      { name: 'Head formation', duration: '40-55 days', care: 'Protect from heat, harvest before bolting' },
    ]
  },
  {
    id: 5,
    name: 'Cucumber',
    variety: 'English',
    image: '🥒',
    difficulty: 'Medium',
    harvestTime: '55-65 days',
    defaultWeight: 1.2, // in kg
    water: [
      { time: 6, amount: 250 },
      { time: 12, amount: 150 },
      { time: 18, amount: 200 }
    ],
    references: [
      { title: "Cucumber Growing Guide", url: "https://www.almanac.com/plant/cucumbers" },
      { title: "Trellising Cucumbers", url: "https://savvygardening.com/cucumber-trellis-ideas/" },
      { title: "Common Cucumber Problems", url: "https://www.thespruce.com/cucumber-growing-problems-1403491" }
    ],
    stages: [
      { name: 'Seed', duration: '3-10 days', care: 'Warm soil, adequate moisture' },
      { name: 'Seedling', duration: '10-20 days', care: 'Full sun, regular watering' },
      { name: 'Vegetative', duration: '20-35 days', care: 'Trellising, consistent water' },
      { name: 'Flowering', duration: '35-45 days', care: 'Avoid wetting foliage, bee friendly' },
      { name: 'Fruiting', duration: '45-65 days', care: 'Even moisture, harvest frequently' },
    ]
  }
];

// Empty initial plants - data will come from localStorage
export const initialTrackedPlants = [];
