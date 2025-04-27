import React, { useEffect, useState } from 'react';
import { FiRefreshCw, FiChevronDown, FiChevronUp, FiTrash2, FiDroplet, FiCheck, FiSquare, FiCheckSquare, FiCalendar, FiExternalLink, FiBook, FiAlertTriangle, FiTool } from 'react-icons/fi';
import { formatDate, generateTipsForStage } from '../utils/plant-utils';
import marked from '../marked';

const PlantDetailModal = ({ 
  selectedPlant, 
  setSelectedPlant, 
  plantGrowthPlans, 
  trackedPlants,
  setTrackedPlants,
  growthTips,
  setGrowthTips,
  loadingTips,
  setLoadingTips,
  onDelete
}) => {
  // Add state to track expanded/collapsed state of care tips
  const [tipsExpanded, setTipsExpanded] = useState(false);
  // Add state to track completed daily tasks
  const [completedTasks, setCompletedTasks] = useState({});
  
  // Helper function to format time
  const formatTime = (hour) => {
    if (hour === 0) return '12 AM';
    if (hour === 12) return '12 PM';
    return hour < 12 ? `${hour} AM` : `${hour - 12} PM`;
  };
  
  // When the component mounts or when the selected plant changes, initialize the completed tasks state
  useEffect(() => {
    if (selectedPlant) {
      // Create an object to track today's completed tasks
      const today = new Date().toISOString().split('T')[0];
      const taskStatus = {};
      
      // Check if we have any saved completion data for today
      if (selectedPlant.taskCompletions && selectedPlant.taskCompletions[today]) {
        setCompletedTasks(selectedPlant.taskCompletions[today]);
      } else {
        setCompletedTasks({});
      }
    }
  }, [selectedPlant]);
  
  // When a plant is selected, generate tips if they don't exist yet
  useEffect(() => {
    if (selectedPlant && !growthTips[selectedPlant.id]) {
      generateTipsForStage(selectedPlant, plantGrowthPlans, setLoadingTips, setGrowthTips);
    }
  }, [selectedPlant, growthTips, plantGrowthPlans, setGrowthTips, setLoadingTips]);

  // Toggle tips expanded/collapsed state
  const toggleTips = () => {
    setTipsExpanded(!tipsExpanded);
  };

  // Handle notes update with localStorage persistence
  const handleNotesChange = (e) => {
    const updatedValue = e.target.value;
    
    // Update tracked plants array
    const updatedPlants = trackedPlants.map(plant => 
      plant.id === selectedPlant.id 
        ? { ...plant, notes: updatedValue } 
        : plant
    );
    
    setTrackedPlants(updatedPlants);
    setSelectedPlant({...selectedPlant, notes: updatedValue});
  };

  // Handle task completion
  const toggleTaskCompletion = (taskId) => {
    const today = new Date().toISOString().split('T')[0];
    
    // Update the local state
    const updatedCompletedTasks = {
      ...completedTasks,
      [taskId]: !completedTasks[taskId]
    };
    setCompletedTasks(updatedCompletedTasks);
    
    // Update the plant's task completion record
    const updatedPlant = {
      ...selectedPlant,
      taskCompletions: {
        ...(selectedPlant.taskCompletions || {}),
        [today]: updatedCompletedTasks
      }
    };
    
    // If it's a regular task, also update the lastDone date
    if (taskId.startsWith('task-')) {
      const taskIdNumber = parseInt(taskId.split('-')[1]);
      const updatedTasks = selectedPlant.tasks.map(task => {
        if (task.id === taskIdNumber && !completedTasks[taskId]) {
          return { ...task, lastDone: today };
        }
        return task;
      });
      updatedPlant.tasks = updatedTasks;
    }
    
    // Update the plant in the tracked plants array
    const updatedTrackedPlants = trackedPlants.map(plant => 
      plant.id === selectedPlant.id ? updatedPlant : plant
    );
    
    setSelectedPlant(updatedPlant);
    setTrackedPlants(updatedTrackedPlants);
  };

  // Check if a water task is due today based on the time
  const isWaterTaskDueNow = (waterTime) => {
    const now = new Date();
    const hour = now.getHours();
    // Consider the task due if we're within 2 hours of the scheduled time
    return Math.abs(hour - waterTime.time) <= 2;
  };

  // Get the current plant's growth plan to access references
  const currentPlantGrowthPlan = plantGrowthPlans.find(p => p.id === selectedPlant.plantId);
  
  // Group references by type
  const getReferencesByType = () => {
    if (!currentPlantGrowthPlan || !currentPlantGrowthPlan.references) {
      return {};
    }
    
    return currentPlantGrowthPlan.references.reduce((groups, reference) => {
      const type = reference.type || 'other';
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(reference);
      return groups;
    }, {});
  };
  
  const referencesByType = getReferencesByType();
  
  // Get icon for reference type
  const getIconForType = (type) => {
    switch (type) {
      case 'guide':
        return <FiBook className="mr-2 text-blue-500" />;
      case 'disease':
        return <FiAlertTriangle className="mr-2 text-red-500" />;
      case 'maintenance':
        return <FiTool className="mr-2 text-green-500" />;
      default:
        return <FiExternalLink className="mr-2 text-gray-500" />;
    }
  };
  
  // Format reference type label
  const formatTypeLabel = (type) => {
    switch (type) {
      case 'guide':
        return 'Growing Guides';
      case 'disease':
        return 'Disease Information';
      case 'maintenance':
        return 'Maintenance Tips';
      default:
        return 'Other Resources';
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header with plant info and close/delete buttons */}
        <div className="sticky top-0 bg-white p-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center">
            <div className="text-4xl mr-3">{selectedPlant.image}</div>
            <div>
              <h2 className="text-xl font-semibold">{selectedPlant.name}</h2>
              <p className="text-gray-500">{selectedPlant.variety} • {selectedPlant.weight} kg</p>
            </div>
          </div>
          <div className="flex items-center">
            <button 
              onClick={() => onDelete(selectedPlant.id)}
              className="text-red-500 hover:text-red-700 mr-4"
              aria-label="Delete plant"
            >
              <FiTrash2 size={18} />
            </button>
            <button 
              onClick={() => setSelectedPlant(null)}
              className="text-gray-400 hover:text-gray-500"
            >
              ✕
            </button>
          </div>
        </div>
        
        <div className="p-4">
          {/* Growth stages visualization */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-3">Growth Journey</h3>
            
            <div className="relative mb-6">
              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${selectedPlant.progress}%` }}
                ></div>
              </div>
              
              {/* Stage markers */}
              <div className="flex justify-between">
                {plantGrowthPlans.find(p => p.id === selectedPlant.plantId).stages.map((stage, index) => {
                  const isCurrentOrPast = index <= selectedPlant.currentStage;
                  return (
                    <div key={index} className="text-center flex-1">
                      <div className={`w-4 h-4 rounded-full mx-auto mb-1 ${
                        isCurrentOrPast ? 'bg-green-600' : 'bg-gray-300'
                      }`}></div>
                      <div className={`text-xs font-medium ${
                        isCurrentOrPast ? 'text-green-600' : 'text-gray-500'
                      }`}>{stage.name}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Current stage details */}
            <div className="bg-green-50 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-green-800 mb-2">Current Stage: {
                  plantGrowthPlans.find(p => p.id === selectedPlant.plantId).stages[selectedPlant.currentStage].name
                }</h4>
                <div className="text-right text-sm text-green-700">
                  {selectedPlant.progress}% Complete
                </div>
              </div>
              <p className="text-green-700 text-sm">{
                plantGrowthPlans.find(p => p.id === selectedPlant.plantId).stages[selectedPlant.currentStage].care
              }</p>
            </div>
            
            {/* Daily Care Checklist */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-3">Daily Care Checklist</h3>
              <div className="bg-white border border-gray-200 rounded-lg">
                {/* Today's date */}
                <div className="p-3 bg-gray-50 border-b border-gray-200 flex items-center">
                  <FiCalendar className="text-gray-500 mr-2" />
                  <span className="font-medium">Today: {formatDate(new Date().toISOString().split('T')[0])}</span>
                </div>
                
                {/* Watering tasks */}
                <div className="p-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FiDroplet className="text-blue-500 mr-2" /> Watering Tasks
                  </h4>
                  <ul className="space-y-2">
                    {selectedPlant.waterSchedule && selectedPlant.waterSchedule.map((waterTime, index) => {
                      const taskId = `water-${index}`;
                      const isDueNow = isWaterTaskDueNow(waterTime);
                      return (
                        <li 
                          key={taskId}
                          className={`flex items-center justify-between p-2 rounded-md ${
                            isDueNow ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="flex items-center">
                            <button 
                              onClick={() => toggleTaskCompletion(taskId)}
                              className={`mr-2 p-1 rounded-md ${
                                completedTasks[taskId] 
                                  ? 'text-green-600 hover:bg-green-50' 
                                  : 'text-gray-400 hover:bg-gray-100'
                              }`}
                            >
                              {completedTasks[taskId] ? <FiCheckSquare size={18} /> : <FiSquare size={18} />}
                            </button>
                            <span className={completedTasks[taskId] ? 'line-through text-gray-400' : ''}>
                              Water at {formatTime(waterTime.time)} - {waterTime.amount} ml
                            </span>
                          </div>
                          {isDueNow && !completedTasks[taskId] && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              Due Now
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
                
                {/* Disease Detection Task - Show only if today is a 15-day interval from start date */}
                {(() => {
                  // Calculate days since planting
                  const today = new Date();
                  const startDate = new Date(selectedPlant.startDate);
                  const daysSincePlanting = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
                  
                  // Check if today is a disease detection day (every 15 days)
                  const isDiseaseCheckDay = daysSincePlanting > 0 && daysSincePlanting % 15 === 0;
                  
                  if (isDiseaseCheckDay) {
                    const taskId = 'disease-detection';
                    return (
                      <div className="p-3 border-t border-gray-200">
                        <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                          <FiCalendar className="text-orange-500 mr-2" /> Disease Detection
                        </h4>
                        <div className="bg-orange-50 p-3 rounded-md">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <button 
                                onClick={() => toggleTaskCompletion(taskId)}
                                className={`mr-2 p-1 rounded-md ${
                                  completedTasks[taskId] 
                                    ? 'text-green-600 hover:bg-green-50' 
                                    : 'text-gray-400 hover:bg-gray-100'
                                }`}
                              >
                                {completedTasks[taskId] ? <FiCheckSquare size={18} /> : <FiSquare size={18} />}
                              </button>
                              <div>
                                <span className={completedTasks[taskId] ? 'line-through text-gray-400' : 'font-medium'}>
                                  Check for disease signs
                                </span>
                                <p className="text-xs text-orange-700 mt-1">
                                  It's been {daysSincePlanting} days since planting - time for a disease check!
                                </p>
                              </div>
                            </div>
                            {!completedTasks[taskId] && (
                              <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                                Due Today
                              </span>
                            )}
                          </div>
                          <div className="mt-3 flex justify-end">
                            <a 
                              href="/plant-detector"
                              className="text-sm bg-orange-500 text-white px-3 py-1 rounded-md hover:bg-orange-600"
                            >
                              Go to Disease Detector
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}
                
                {/* Care tasks */}
                <div className="p-3 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Care Tasks</h4>
                  <ul className="space-y-2">
                    {selectedPlant.tasks && selectedPlant.tasks.map(task => {
                      const taskId = `task-${task.id}`;
                      return (
                        <li key={taskId} className="flex items-center justify-between p-2 rounded-md">
                          <div className="flex items-center">
                            <button 
                              onClick={() => toggleTaskCompletion(taskId)}
                              className={`mr-2 p-1 rounded-md ${
                                completedTasks[taskId] 
                                  ? 'text-green-600 hover:bg-green-50' 
                                  : 'text-gray-400 hover:bg-gray-100'
                              }`}
                            >
                              {completedTasks[taskId] ? <FiCheckSquare size={18} /> : <FiSquare size={18} />}
                            </button>
                            <div>
                              <span className={completedTasks[taskId] ? 'line-through text-gray-400' : ''}>
                                {task.name}
                              </span>
                              <p className="text-xs text-gray-500">{task.frequency}</p>
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">
                            Last done: {formatDate(task.lastDone)}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
            
            {/* AI-Generated Care Tips - now collapsible */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center">
                  <h3 className="font-medium text-gray-900">AI-Generated Care Tips</h3>
                  <button 
                    onClick={toggleTips}
                    className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    {tipsExpanded ? (
                      <FiChevronUp className="w-5 h-5" />
                    ) : (
                      <FiChevronDown className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <button 
                  onClick={() => generateTipsForStage(selectedPlant, plantGrowthPlans, setLoadingTips, setGrowthTips)}
                  className="text-green-600 hover:text-green-700 flex items-center text-sm"
                  disabled={loadingTips}
                >
                  <FiRefreshCw className={`mr-1 ${loadingTips ? 'animate-spin' : ''}`} /> 
                  Refresh Tips
                </button>
              </div>
              
              {/* Only show content when expanded or when loading for the first time */}
              {(tipsExpanded || (loadingTips && selectedPlant && !growthTips[selectedPlant.id])) && (
                <div className="bg-gray-50 rounded-lg p-4 prose prose-sm max-w-none transition-all duration-300">
                  {loadingTips && selectedPlant && !growthTips[selectedPlant.id] ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="animate-pulse flex flex-col items-center">
                        <div className="h-8 w-8 mb-4">
                          <FiRefreshCw className="animate-spin text-green-600 h-8 w-8" />
                        </div>
                        <p className="text-gray-500">Generating expert care tips...</p>
                      </div>
                    </div>
                  ) : selectedPlant && growthTips[selectedPlant.id] ? (
                    <div dangerouslySetInnerHTML={{ 
                      __html: marked && typeof marked.parse === 'function' 
                        ? marked.parse(growthTips[selectedPlant.id] || '') 
                        : growthTips[selectedPlant.id] || ''
                    }} />
                  ) : (
                    <p className="text-gray-500">No care tips available. Click "Refresh Tips" to generate recommendations.</p>
                  )}
                </div>
              )}
              
              {/* Show a preview when collapsed and tips exist */}
              {!tipsExpanded && selectedPlant && growthTips[selectedPlant.id] && (
                <div 
                  onClick={toggleTips}
                  className="bg-gray-50 rounded-lg p-3 text-gray-500 text-sm cursor-pointer hover:bg-gray-100"
                >
                  Click to expand and view AI-generated care tips...
                </div>
              )}
            </div>
            
            {/* Notes section */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-2">Notes</h3>
              <textarea 
                className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                rows="3"
                placeholder="Add notes about your plant..."
                value={selectedPlant.notes}
                onChange={handleNotesChange}
              ></textarea>
            </div>
            
            {/* References Section */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-3">References</h3>
              
              {Object.keys(referencesByType).length > 0 ? (
                <div className="bg-gray-50 rounded-lg p-4">
                  {Object.entries(referencesByType).map(([type, refs]) => (
                    <div key={type} className="mb-4 last:mb-0">
                      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                        {getIconForType(type)}
                        {formatTypeLabel(type)}
                      </h4>
                      <ul className="space-y-2 ml-6">
                        {refs.map((reference, index) => (
                          <li key={index}>
                            <a 
                              href={reference.url} 
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              <FiExternalLink className="mr-2 text-sm" />
                              {reference.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No references available for this plant.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantDetailModal;
