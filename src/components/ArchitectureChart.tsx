
import React from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const nodes: Node[] = [
  // Frontend Layer
  {
    id: 'frontend',
    type: 'default',
    position: { x: 400, y: 50 },
    data: { label: 'React Frontend' },
    style: {
      background: '#3b82f6',
      color: 'white',
      border: '2px solid #1e40af',
      borderRadius: '8px',
      width: 150,
      height: 60,
    },
  },
  
  // Main Pages
  {
    id: 'index-page',
    type: 'default',
    position: { x: 150, y: 150 },
    data: { label: 'Index Page\n(Landing)' },
    style: {
      background: '#e0e7ff',
      color: '#1e40af',
      border: '1px solid #c7d2fe',
      borderRadius: '6px',
      width: 120,
      height: 60,
    },
  },
  {
    id: 'repositories-page',
    type: 'default',
    position: { x: 300, y: 150 },
    data: { label: 'Repositories\nPage' },
    style: {
      background: '#e0e7ff',
      color: '#1e40af',
      border: '1px solid #c7d2fe',
      borderRadius: '6px',
      width: 120,
      height: 60,
    },
  },
  {
    id: 'analysis-page',
    type: 'default',
    position: { x: 450, y: 150 },
    data: { label: 'Analysis Results\nPage' },
    style: {
      background: '#e0e7ff',
      color: '#1e40af',
      border: '1px solid #c7d2fe',
      borderRadius: '6px',
      width: 120,
      height: 60,
    },
  },
  {
    id: 'repo-analysis-page',
    type: 'default',
    position: { x: 600, y: 150 },
    data: { label: 'Repository\nAnalysis Page' },
    style: {
      background: '#e0e7ff',
      color: '#1e40af',
      border: '1px solid #c7d2fe',
      borderRadius: '6px',
      width: 120,
      height: 60,
    },
  },

  // Supabase Layer
  {
    id: 'supabase',
    type: 'default',
    position: { x: 400, y: 300 },
    data: { label: 'Supabase Backend' },
    style: {
      background: '#059669',
      color: 'white',
      border: '2px solid #047857',
      borderRadius: '8px',
      width: 150,
      height: 60,
    },
  },

  // Database Tables
  {
    id: 'repositories-table',
    type: 'default',
    position: { x: 100, y: 450 },
    data: { label: 'repositories\nTable' },
    style: {
      background: '#fef3c7',
      color: '#92400e',
      border: '1px solid #fbbf24',
      borderRadius: '6px',
      width: 100,
      height: 60,
    },
  },
  {
    id: 'function-analyses-table',
    type: 'default',
    position: { x: 220, y: 450 },
    data: { label: 'function_analyses\nTable' },
    style: {
      background: '#fef3c7',
      color: '#92400e',
      border: '1px solid #fbbf24',
      borderRadius: '6px',
      width: 120,
      height: 60,
    },
  },
  {
    id: 'function-qa-table',
    type: 'default',
    position: { x: 360, y: 450 },
    data: { label: 'function_qa\nTable' },
    style: {
      background: '#fef3c7',
      color: '#92400e',
      border: '1px solid #fbbf24',
      borderRadius: '6px',
      width: 100,
      height: 60,
    },
  },
  {
    id: 'documentation-proposals-table',
    type: 'default',
    position: { x: 480, y: 450 },
    data: { label: 'documentation_\nproposals Table' },
    style: {
      background: '#fef3c7',
      color: '#92400e',
      border: '1px solid #fbbf24',
      borderRadius: '6px',
      width: 120,
      height: 60,
    },
  },
  {
    id: 'forbidden-license-table',
    type: 'default',
    position: { x: 620, y: 450 },
    data: { label: 'forbidden_license\nTable' },
    style: {
      background: '#fef3c7',
      color: '#92400e',
      border: '1px solid #fbbf24',
      borderRadius: '6px',
      width: 120,
      height: 60,
    },
  },

  // Edge Functions
  {
    id: 'generate-questions-fn',
    type: 'default',
    position: { x: 150, y: 600 },
    data: { label: 'generate-questions\nEdge Function' },
    style: {
      background: '#fecaca',
      color: '#dc2626',
      border: '1px solid #f87171',
      borderRadius: '6px',
      width: 130,
      height: 60,
    },
  },
  {
    id: 'generate-documentation-fn',
    type: 'default',
    position: { x: 300, y: 600 },
    data: { label: 'generate-documentation\nEdge Function' },
    style: {
      background: '#fecaca',
      color: '#dc2626',
      border: '1px solid #f87171',
      borderRadius: '6px',
      width: 150,
      height: 60,
    },
  },
  {
    id: 'chat-with-ai-fn',
    type: 'default',
    position: { x: 470, y: 600 },
    data: { label: 'chat-with-ai\nEdge Functions' },
    style: {
      background: '#fecaca',
      color: '#dc2626',
      border: '1px solid #f87171',
      borderRadius: '6px',
      width: 130,
      height: 60,
    },
  },
  {
    id: 'fetch-github-fn',
    type: 'default',
    position: { x: 620, y: 600 },
    data: { label: 'fetch-github-code\nEdge Function' },
    style: {
      background: '#fecaca',
      color: '#dc2626',
      border: '1px solid #f87171',
      borderRadius: '6px',
      width: 140,
      height: 60,
    },
  },

  // External APIs
  {
    id: 'openai-api',
    type: 'default',
    position: { x: 200, y: 750 },
    data: { label: 'OpenAI API' },
    style: {
      background: '#d1d5db',
      color: '#374151',
      border: '1px solid #9ca3af',
      borderRadius: '6px',
      width: 100,
      height: 50,
    },
  },
  {
    id: 'github-api',
    type: 'default',
    position: { x: 650, y: 750 },
    data: { label: 'GitHub API' },
    style: {
      background: '#d1d5db',
      color: '#374151',
      border: '1px solid #9ca3af',
      borderRadius: '6px',
      width: 100,
      height: 50,
    },
  },
];

const edges: Edge[] = [
  // Frontend to Pages
  { id: 'e1', source: 'frontend', target: 'index-page', type: 'smoothstep' },
  { id: 'e2', source: 'frontend', target: 'repositories-page', type: 'smoothstep' },
  { id: 'e3', source: 'frontend', target: 'analysis-page', type: 'smoothstep' },
  { id: 'e4', source: 'frontend', target: 'repo-analysis-page', type: 'smoothstep' },

  // Pages to Supabase
  { id: 'e5', source: 'repositories-page', target: 'supabase', type: 'smoothstep' },
  { id: 'e6', source: 'analysis-page', target: 'supabase', type: 'smoothstep' },
  { id: 'e7', source: 'repo-analysis-page', target: 'supabase', type: 'smoothstep' },

  // Supabase to Database Tables
  { id: 'e8', source: 'supabase', target: 'repositories-table', type: 'smoothstep' },
  { id: 'e9', source: 'supabase', target: 'function-analyses-table', type: 'smoothstep' },
  { id: 'e10', source: 'supabase', target: 'function-qa-table', type: 'smoothstep' },
  { id: 'e11', source: 'supabase', target: 'documentation-proposals-table', type: 'smoothstep' },
  { id: 'e12', source: 'supabase', target: 'forbidden-license-table', type: 'smoothstep' },

  // Supabase to Edge Functions
  { id: 'e13', source: 'supabase', target: 'generate-questions-fn', type: 'smoothstep' },
  { id: 'e14', source: 'supabase', target: 'generate-documentation-fn', type: 'smoothstep' },
  { id: 'e15', source: 'supabase', target: 'chat-with-ai-fn', type: 'smoothstep' },
  { id: 'e16', source: 'supabase', target: 'fetch-github-fn', type: 'smoothstep' },

  // Edge Functions to External APIs
  { id: 'e17', source: 'generate-questions-fn', target: 'openai-api', type: 'smoothstep' },
  { id: 'e18', source: 'generate-documentation-fn', target: 'openai-api', type: 'smoothstep' },
  { id: 'e19', source: 'chat-with-ai-fn', target: 'openai-api', type: 'smoothstep' },
  { id: 'e20', source: 'fetch-github-fn', target: 'github-api', type: 'smoothstep' },

  // Database interactions
  { id: 'e21', source: 'generate-questions-fn', target: 'function-qa-table', type: 'smoothstep', style: { stroke: '#10b981' } },
  { id: 'e22', source: 'generate-documentation-fn', target: 'documentation-proposals-table', type: 'smoothstep', style: { stroke: '#10b981' } },
];

const ArchitectureChart = () => {
  return (
    <div className="w-full h-[800px] border rounded-lg">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        attributionPosition="bottom-left"
        style={{ backgroundColor: "#f8fafc" }}
      >
        <Background color="#e2e8f0" gap={16} />
        <Controls />
        <MiniMap 
          zoomable 
          pannable 
          style={{
            backgroundColor: "#f1f5f9",
            border: "1px solid #cbd5e1",
          }}
        />
      </ReactFlow>
      
      <div className="p-4 bg-white border-t">
        <h3 className="text-lg font-semibold mb-2">Architecture Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span>Frontend Layer</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-600 rounded"></div>
            <span>Supabase Backend</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-400 rounded"></div>
            <span>Database Tables</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-300 rounded"></div>
            <span>Edge Functions</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArchitectureChart;
