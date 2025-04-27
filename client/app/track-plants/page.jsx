'use client';
import React, { useState, useEffect } from 'react';
import { FiPlus } from 'react-icons/fi';
import { plantGrowthPlans } from './data/plants-data';
import { calculateProgressForAllPlants } from './utils/plant-utils';
import PlantCard from './components/PlantCard';
import PlantDetailModal from './components/PlantDetailModal';
import AddPlantModal from './components/AddPlantModal';

export default function TrackPlants() {
  // Initialize state from localStorage or empty array if no data exists
  const [trackedPlants, setTrackedPlants] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [growthTips, setGrowthTips] = useState({});
  const [loadingTips, setLoadingTips] = useState(false);
  
  // Load data from localStorage on initial render
  useEffect(() => {
    const savedPlants = localStorage.getItem('trackedPlants');
    const savedGrowthTips = localStorage.getItem('growthTips');
    
    if (savedPlants) {
      setTrackedPlants(JSON.parse(savedPlants));
    }
    
    if (savedGrowthTips) {
      setGrowthTips(JSON.parse(savedGrowthTips));
    }
  }, []);
  
  // Save tracked plants to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('trackedPlants', JSON.stringify(trackedPlants));
  }, [trackedPlants]);
  
  // Save growth tips to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('growthTips', JSON.stringify(growthTips));
  }, [growthTips]);
  
  // Function to add a new plant to tracking
  const addPlantToTracking = (plantPlan, plantWeight) => {
    const startDate = new Date().toISOString().split('T')[0];
    
    // Create first disease detection date (15 days from start)
    const firstDetectionDate = new Date();
    firstDetectionDate.setDate(firstDetectionDate.getDate() + 15);
    const firstDetectionDateStr = firstDetectionDate.toISOString().split('T')[0];
    
    // Calculate actual water amounts based on weight
    const waterScheduleWithAmounts = plantPlan.water.map(waterTime => ({
      time: waterTime.time,
      amountPerKg: waterTime.amount, // Keep the per kg amount for future recalculations
      amount: Math.round(waterTime.amount * plantWeight) // Calculate actual amount in ml
    }));
    
    const newPlant = {
      id: Date.now(),
      plantId: plantPlan.id,
      name: plantPlan.name,
      variety: plantPlan.variety,
      image: plantPlan.image,
      weight: plantWeight,
      startDate: startDate,
      currentStage: 0,
      progress: 0,
      notes: '',
      tasks: [
        { id: 1, name: 'Water regularly', frequency: 'As needed', lastDone: startDate },
        { 
          id: 2, 
          name: 'Check for disease signs', 
          frequency: 'Every 15 days', 
          lastDone: startDate,
          nextDue: firstDetectionDateStr,
          type: 'disease-check'
        },
      ],
      // Save water schedule with calculated amounts
      waterSchedule: waterScheduleWithAmounts
    };
    
    const updatedPlants = [...trackedPlants, newPlant];
    setTrackedPlants(updatedPlants);
    
    // Calculate initial progress
    calculateProgressForAllPlants(updatedPlants, plantGrowthPlans, setTrackedPlants);
    
    setShowAddModal(false);
  };
  
  // Function to delete a plant
  const deletePlant = (plantId) => {
    if (window.confirm("Are you sure you want to delete this plant?")) {
      const updatedPlants = trackedPlants.filter(plant => plant.id !== plantId);
      setTrackedPlants(updatedPlants);
      
      // If the deleted plant is currently selected, clear selection
      if (selectedPlant && selectedPlant.id === plantId) {
        setSelectedPlant(null);
      }
    }
  };

  // Automatically calculate progress based on start date
  useEffect(() => {
    if (trackedPlants.length > 0) {
      calculateProgressForAllPlants(trackedPlants, plantGrowthPlans, setTrackedPlants);
    
      // Set up a daily progress update (every 24 hours)
      const intervalId = setInterval(() => {
        calculateProgressForAllPlants(trackedPlants, plantGrowthPlans, setTrackedPlants);
      }, 86400000); // 24 hours
      
      return () => clearInterval(intervalId);
    }
  }, [trackedPlants.length]);
  
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <main className="flex-1 p-4 md:p-6">
        <div className="w-full">
          {/* Page header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Plant Tracker</h1>
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <FiPlus className="mr-2" /> Add Plant
            </button>
          </div>
          
          {/* Your tracked plants */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-6">
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Your Plants</h2>
              <p className="text-sm text-gray-500">Track the growth and care of your plants</p>
            </div>
            
            {trackedPlants.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-4xl mb-3">🌱</div>
                <h3 className="text-lg font-medium text-gray-800 mb-1">No plants yet</h3>
                <p className="text-gray-500 mb-4">Start tracking your plants by adding one to your garden.</p>
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg inline-flex items-center"
                >
                  <FiPlus className="mr-2" /> Add Your First Plant
                </button>
              </div>
            ) : (
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trackedPlants.map((plant) => (
                  <PlantCard 
                    key={plant.id}
                    plant={plant}
                    growthPlans={plantGrowthPlans}
                    onClick={() => setSelectedPlant(plant)}
                  />
                ))}
              </div>
            )}
          </div>
          
          {/* Plant details modal */}
          {selectedPlant && (
            <PlantDetailModal
              selectedPlant={selectedPlant}
              setSelectedPlant={setSelectedPlant}
              plantGrowthPlans={plantGrowthPlans}
              trackedPlants={trackedPlants}
              setTrackedPlants={setTrackedPlants}
              growthTips={growthTips}
              setGrowthTips={setGrowthTips}
              loadingTips={loadingTips}
              setLoadingTips={setLoadingTips}
              onDelete={deletePlant}
            />
          )}
          
          {/* Add plant modal */}
          {showAddModal && (
            <AddPlantModal
              plantGrowthPlans={plantGrowthPlans}
              onClose={() => setShowAddModal(false)}
              onAddPlant={addPlantToTracking}
            />
          )}
        </div>
      </main>
    </div>
  );
}