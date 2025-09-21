// FIX: Corrected import path for types.
import React from 'react';
import { AIInsight } from '../types';

const AIInsightModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  insight: AIInsight | null;
  error: string | null;
}> = ({ isOpen, onClose, insight, error }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={onClose}>
      <div className="bg-card-light dark:bg-card-dark text-text-light dark:text-text-dark p-8 rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 scale-95 animate-fade-in" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-secondary flex items-center"><i className="fas fa-magic-wand-sparkles mr-3"></i>AI Financial Analysis</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 text-3xl transition-colors">&times;</button>
        </div>
        
        {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded" role="alert"><p>{error}</p></div>}
        
        {insight && (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2 text-primary">Overall Status</h3>
              <p className="text-text-secondary-light dark:text-text-secondary-dark">{insight.overallStatus}</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2 text-positive">Positive Highlights</h3>
              <ul className="list-disc list-inside space-y-1 text-text-secondary-light dark:text-text-secondary-dark">
                {insight.positiveHighlights.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2 text-warning">Areas for Improvement</h3>
              <ul className="list-disc list-inside space-y-1 text-text-secondary-light dark:text-text-secondary-dark">
                {insight.areasForImprovement.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2 text-secondary">Actionable Tips</h3>
              <ul className="list-disc list-inside space-y-1 text-text-secondary-light dark:text-text-secondary-dark">
                {insight.actionableTips.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIInsightModal;
