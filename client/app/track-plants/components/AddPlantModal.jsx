import React, { useState } from 'react';
import { FiCheckSquare, FiClock, FiDroplet, FiAlertTriangle, FiX } from 'react-icons/fi';
import Link from 'next/link';

const AddPlantModal = ({ plantGrowthPlans, onClose, onAddPlant }) => {
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [plantWeight, setPlantWeight] = useState('');
  const [weightError, setWeightError] = useState('');

  // Helper function to format time from 24h format
  const formatTime = (hour) => {
    if (hour === 0) return '12 AM';
    if (hour === 12) return '12 PM';
    return hour < 12 ? `${hour} AM` : `${hour - 12} PM`;
  };

  // Calculate actual water amount based on weight
  const calculateWaterAmount = (mlPerKg, weight) => {
    return Math.round(mlPerKg * weight);
  };
  
  // Handle plant selection
  const handlePlantSelection = (plant) => {
    setSelectedPlant(plant);
    setPlantWeight(plant.defaultWeight.toString());
    setWeightError('');
  };
  
  // Handle weight input change
  const handleWeightChange = (e) => {
    const value = e.target.value;
    setPlantWeight(value);
    
    // Validate weight input
    if (value <= 0) {
      setWeightError('Weight must be greater than 0');
    } else {
      setWeightError('');
    }
  };
  
  // Handle confirm button click
  const handleConfirmPlant = () => {
    if (!plantWeight || parseFloat(plantWeight) <= 0) {
      setWeightError('Please enter a valid weight greater than 0');
      return;
    }
    
    // Add the plant with the specified weight
    onAddPlant(selectedPlant, parseFloat(plantWeight));
  };
  
  // Go back to plant selection
  const handleBack = () => {
    setSelectedPlant(null);
    setPlantWeight('');
    setWeightError('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {selectedPlant ? `Add ${selectedPlant.name} (${selectedPlant.variety})` : 'Add a Plant to Track'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <FiX size={20} />
          </button>
        </div>
        
        <div className="p-4">
          {!selectedPlant ? (
            // Plant selection screen
            <>
              {/* Disease Detection Information */}
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <FiAlertTriangle className="text-blue-600 mt-1 mr-2 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-blue-800 mb-2">Plant Health Monitoring</h3>
                    <p className="text-blue-700 text-sm mb-3">
                      We recommend checking your plants for diseases every 15 days. 
                      When you add a plant, we'll automatically create reminders for disease detection.
                    </p>
                    <Link href="/plant-detector" 
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                      <FiCheckSquare className="mr-2" /> 
                      Go to Disease Detector
                    </Link>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {plantGrowthPlans.map(plant => (
                  <div 
                    key={plant.id} 
                    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handlePlantSelection(plant)}
                  >
                    <div className="p-4 flex items-center">
                      <div className="text-4xl mr-3">{plant.image}</div>
                      <div>
                        <h3 className="font-medium text-gray-900">{plant.name}</h3>
                        <p className="text-sm text-gray-500">{plant.variety}</p>
                      </div>
                    </div>
                    
                    <div className="px-4 pb-2">
                      <div className="flex items-center mb-2">
                        <div className={`px-2 py-1 rounded-full text-xs ${
                          plant.difficulty === 'Easy' 
                            ? 'bg-green-100 text-green-800' 
                            : plant.difficulty === 'Medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                        }`}>
                          {plant.difficulty}
                        </div>
                        <div className="text-gray-500 text-xs ml-2">
                          Harvest: {plant.harvestTime}
                        </div>
                      </div>
                      
                      {/* Water Timing Checklist */}
                      <div className="mt-3 mb-2">
                        <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                          <FiDroplet className="mr-1 text-blue-500" /> Watering Schedule:
                        </h4>
                        <ul className="space-y-1">
                          {plant.water.map((waterTime, index) => (
                            <li key={index} className="flex items-center text-xs text-gray-600">
                              <FiClock className="mr-1 text-blue-400" /> 
                              <span>{formatTime(waterTime.time)} - {waterTime.amount} ml/kg</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* Disease Detection Reminder */}
                      <div className="mt-3 mb-2 text-xs text-gray-600 flex items-center">
                        <FiCheckSquare className="mr-1 text-green-500" />
                        <span>Disease check: Every 15 days</span>
                      </div>
                      
                      <div className="text-sm text-gray-600 mt-2">
                        {plant.stages.length} growth stages
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            // Plant weight input screen
            <div className="max-w-md mx-auto">
              <div className="flex items-center mb-6">
                <div className="text-5xl mr-4">{selectedPlant.image}</div>
                <div>
                  <h3 className="text-xl font-medium text-gray-900">{selectedPlant.name}</h3>
                  <p className="text-gray-600">{selectedPlant.variety}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="plantWeight" className="block text-sm font-medium text-gray-700 mb-1">
                  Plant Weight (kg)
                </label>
                <input 
                  type="number"
                  id="plantWeight"
                  value={plantWeight}
                  onChange={handleWeightChange}
                  step="0.1"
                  min="0.1"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter plant weight in kg"
                />
                {weightError && (
                  <p className="text-red-500 text-xs mt-1">{weightError}</p>
                )}
                <p className="text-gray-500 text-xs mt-1">
                  This helps us calculate the exact water needed for your plant.
                </p>
              </div>
              
              {plantWeight && parseFloat(plantWeight) > 0 && (
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <h4 className="font-medium text-blue-800 mb-2">Calculated Water Amounts</h4>
                  <ul className="space-y-2">
                    {selectedPlant.water.map((waterTime, index) => {
                      const calculatedAmount = calculateWaterAmount(waterTime.amount, parseFloat(plantWeight));
                      return (
                        <li key={index} className="flex justify-between text-sm">
                          <span className="text-blue-700">{formatTime(waterTime.time)}</span>
                          <span className="font-medium text-blue-800">{calculatedAmount} ml</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
              
              <div className="flex space-x-3">
                <button
                  onClick={handleBack}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={handleConfirmPlant}
                  disabled={!plantWeight || parseFloat(plantWeight) <= 0}
                  className={`flex-1 px-4 py-2 rounded-md text-white ${
                    !plantWeight || parseFloat(plantWeight) <= 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  Add to My Plants
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddPlantModal;
