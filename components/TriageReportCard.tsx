import React from 'react';
import { TriageReportData } from '../types';
import { ClipboardDocumentListIcon, ExclamationTriangleIcon } from './icons/SolidIcons'; 
import { QuestionMarkCircleIcon } from './icons/OutlineIcons';

// Helper to get color based on severity
const getSeverityStyles = (severity: string): { bg: string, text: string, border: string } => {
    const s = severity.toLowerCase();
    if (s.includes('high') || s.includes('urgent')) return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-400' };
    if (s.includes('medium')) return { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-400' };
    if (s.includes('low')) return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-400' };
    return { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-400' };
}

const TriageReportCard: React.FC<{ data: TriageReportData }> = ({ data }) => {
    const severityStyles = getSeverityStyles(data.severity);

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-3 space-y-4 shadow-sm">
            <h4 className="text-base font-bold text-primary flex items-center">
                <ClipboardDocumentListIcon className="w-5 h-5 mr-2"/>
                AI-Powered Triage Report
            </h4>
            
            <div className={`p-3 rounded-lg flex items-center ${severityStyles.bg} border-l-4 ${severityStyles.border}`}>
                <ExclamationTriangleIcon className={`w-8 h-8 mr-4 ${severityStyles.text}`} />
                <div>
                    <p className={`text-sm font-semibold ${severityStyles.text}`}>Severity Level</p>
                    <p className={`text-xl font-bold ${severityStyles.text}`}>{data.severity}</p>
                </div>
            </div>

            <div className="space-y-3 text-sm">
                <div className="flex items-start">
                    <p className="font-medium text-gray-500 w-2/5">Predicted Condition:</p>
                    <p className="font-semibold text-dark w-3/5">{data.predictedCondition}</p>
                </div>
                <div className="flex items-start">
                    <p className="font-medium text-gray-500 w-2/5">Confidence:</p>
                    <div className="w-3/5 flex items-center pt-1">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mr-3">
                           <div className="bg-secondary h-2.5 rounded-full" style={{ width: `${data.confidenceScore}%` }}></div>
                        </div>
                        <span className="text-xs font-bold text-secondary">{data.confidenceScore}%</span>
                    </div>
                </div>
                <div className="flex items-start">
                    <p className="font-medium text-gray-500 w-2/5">Recommendation:</p>
                    <p className="font-semibold text-dark w-3/5">Consult a {data.recommendedSpecialist}</p>
                </div>
            </div>
            
            <div className="text-xs text-gray-500 italic flex items-start mt-4 bg-gray-50 p-2.5 rounded-md border border-gray-200">
                <QuestionMarkCircleIcon className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0 text-gray-400"/>
                <span>This is an AI-powered prediction and not a medical diagnosis. Please consult with a qualified doctor for an accurate assessment.</span>
            </div>
        </div>
    );
};

export default TriageReportCard;