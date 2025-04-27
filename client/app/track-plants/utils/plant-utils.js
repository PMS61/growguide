import { generate_output } from '../../../lib/groq-service';

// Calculate progress for all plants
export const calculateProgressForAllPlants = (plants, growthPlans, setTrackedPlants) => {
  const updatedPlants = plants.map(plant => {
    const { progress, stage } = calculatePlantProgress(plant, growthPlans);
    return {
      ...plant,
      progress,
      currentStage: stage
    };
  });
  
  setTrackedPlants(updatedPlants);
};

// Calculate plant progress based on start date and expected duration
export const calculatePlantProgress = (plant, growthPlans) => {
  const growthPlan = growthPlans.find(p => p.id === plant.plantId);
  const startDate = new Date(plant.startDate);
  const today = new Date();
  
  // Calculate total days for full growth cycle
  let totalDaysToGrow = 0;
  
  // Extract the maximum days from the harvest time range (e.g., "80-90 days" -> 90)
  const harvestTimeMatch = growthPlan.harvestTime.match(/(\d+)-(\d+)/);
  if (harvestTimeMatch && harvestTimeMatch[2]) {
    totalDaysToGrow = parseInt(harvestTimeMatch[2]);
  } else {
    // Fallback: sum up the maximum days from each stage's duration
    growthPlan.stages.forEach(stage => {
      const durationMatch = stage.duration.match(/(\d+)-(\d+)/);
      if (durationMatch && durationMatch[2]) {
        totalDaysToGrow += parseInt(durationMatch[2]);
      } else {
        // If no range, try to extract a single number
        const singleNumber = stage.duration.match(/(\d+)/);
        if (singleNumber && singleNumber[1]) {
          totalDaysToGrow += parseInt(singleNumber[1]);
        }
      }
    });
  }
  
  // Calculate days elapsed
  const daysElapsed = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
  
  // Calculate progress percentage
  let progress = Math.min(Math.round((daysElapsed / totalDaysToGrow) * 100), 100);
  
  // Determine current stage based on progress
  const stageCount = growthPlan.stages.length;
  const stage = Math.min(Math.floor((progress / 100) * stageCount), stageCount - 1);
  
  return { progress, stage };
};

// Generate tips using LLM for current growth stage
export const generateTipsForStage = async (plant, plantGrowthPlans, setLoadingTips, setGrowthTips) => {
  if (!plant) return;
  
  const plantId = plant.id;
  const growthPlan = plantGrowthPlans.find(p => p.id === plant.plantId);
  const currentStageName = growthPlan.stages[plant.currentStage].name;
  
  setLoadingTips(true);
  
  try {
    const prompt = `You are an expert gardener. Generate specific care tips for ${plant.name} (${plant.variety}) 
      that is currently in the ${currentStageName} stage of growth.
      
      Focus on:
      1. Watering needs at this specific growth stage
      2. Light requirements
      3. Nutrient/fertilization recommendations
      4. Common issues to watch for at this stage and how to prevent them
      5. Any special care techniques appropriate for this stage
      
      Format your response in markdown with clear headings and bullet points.
      Be specific to this plant variety and growth stage. Keep your response concise but comprehensive.`;
      
    const tips = await generate_output(prompt);
    
    setGrowthTips(prevTips => ({
      ...prevTips,
      [plantId]: tips
    }));
  } catch (error) {
    console.error("Error generating tips:", error);
  } finally {
    setLoadingTips(false);
  }
};

// Helper function to format date
export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Calculate days remaining until harvest
export const calculateDaysRemaining = (plant, plantGrowthPlans) => {
  const growthPlan = plantGrowthPlans.find(p => p.id === plant.plantId);
  
  // Extract the maximum days from the harvest time range
  const harvestTimeMatch = growthPlan.harvestTime.match(/(\d+)-(\d+)/);
  if (!harvestTimeMatch) return "Unknown";
  
  const totalDaysToGrow = parseInt(harvestTimeMatch[2]);
  const startDate = new Date(plant.startDate);
  const today = new Date();
  const daysElapsed = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
  
  const daysRemaining = Math.max(0, totalDaysToGrow - daysElapsed);
  return daysRemaining;
};

// Function to clear all user data from localStorage
export const clearAllUserData = () => {
  localStorage.removeItem('trackedPlants');
  localStorage.removeItem('growthTips');
  return [];
};

// Function to export user data as JSON
export const exportUserData = () => {
  const trackedPlants = localStorage.getItem('trackedPlants');
  const growthTips = localStorage.getItem('growthTips');
  
  return {
    trackedPlants: trackedPlants ? JSON.parse(trackedPlants) : [],
    growthTips: growthTips ? JSON.parse(growthTips) : {}
  };
};

// Function to import user data
export const importUserData = (data) => {
  if (data.trackedPlants) {
    localStorage.setItem('trackedPlants', JSON.stringify(data.trackedPlants));
  }
  
  if (data.growthTips) {
    localStorage.setItem('growthTips', JSON.stringify(data.growthTips));
  }
};
