import React from 'react';
import { FiCalendar, FiTrash2 } from 'react-icons/fi';
import { FaSeedling, FaAppleAlt } from 'react-icons/fa';
import { formatDate, calculateDaysRemaining } from '../utils/plant-utils';

const PlantCard = ({ plant, growthPlans, onClick, onDelete }) => {
  const growthPlan = growthPlans.find(p => p.id === plant.plantId);
  const currentStageInfo = growthPlan.stages[plant.currentStage];
  const daysRemaining = calculateDaysRemaining(plant, growthPlans);
  
  // Handle delete click without triggering the card click
  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete(plant.id);
  };
  
  return (
    <div 
      className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer relative"
      onClick={onClick}
    >
      {/* Delete button */}
      <button
        onClick={handleDeleteClick}
        className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
        aria-label="Delete plant"
      >
        <FiTrash2 size={16} />
      </button>
      
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center">
          <div className="text-3xl mr-3">{plant.image}</div>
          <div>
            <h3 className="font-medium text-gray-900">{plant.name}</h3>
            <p className="text-sm text-gray-500">{plant.variety} • {plant.weight} kg</p>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between text-sm mb-1">
          <span>Growth Progress</span>
          <span>{plant.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
          <div 
            className="bg-green-600 h-2 rounded-full" 
            style={{ width: `${plant.progress}%` }}
          ></div>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <FaSeedling className="text-green-600 mr-2" />
            <span className="text-gray-700">Stage: {currentStageInfo.name}</span>
          </div>
          <div className="flex items-center">
            <FiCalendar className="text-green-600 mr-2" />
            <span className="text-gray-700">Started: {formatDate(plant.startDate)}</span>
          </div>
          {daysRemaining > 0 && (
            <div className="flex items-center">
              <FaAppleAlt className="text-green-600 mr-2" />
              <span className="text-gray-700">Days to harvest: ~{daysRemaining}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlantCard;
