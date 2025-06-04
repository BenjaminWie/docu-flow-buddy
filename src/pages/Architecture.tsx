
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Database, Globe, Zap, GitBranch } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ArchitectureChart from "@/components/ArchitectureChart";

const Architecture = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Home
          </Button>
          
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Backend Architecture Overview
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Understand how your code repository analysis system works - from frontend interactions 
              to backend processing and external API integrations.
            </p>
          </div>
        </div>

        {/* Architecture Diagram */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="w-6 h-6" />
              System Architecture Diagram
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ArchitectureChart />
          </CardContent>
        </Card>

        {/* Architecture Components */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-600">
                <Globe className="w-5 h-5" />
                Frontend Layer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-3">
                React-based user interface with multiple pages for repository analysis and code exploration.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Landing page with features overview</li>
                <li>• Repository management interface</li>
                <li>• Analysis results dashboard</li>
                <li>• Interactive code exploration tools</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <Database className="w-5 h-5" />
                Database Layer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-3">
                Supabase PostgreSQL database storing repository data, function analyses, and user interactions.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Repository metadata and status</li>
                <li>• Function analysis results</li>
                <li>• Q&A conversations</li>
                <li>• Documentation proposals</li>
                <li>• License compliance data</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <Zap className="w-5 h-5" />
                Edge Functions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-3">
                Serverless functions handling AI interactions, GitHub integration, and business logic.
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• AI-powered documentation generation</li>
                <li>• Question generation for functions</li>
                <li>• Chat interfaces (developer/business)</li>
                <li>• GitHub code fetching</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Data Flow */}
        <Card>
          <CardHeader>
            <CardTitle>Data Flow & Interactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-blue-900">1. Repository Analysis</h4>
                <p className="text-gray-600">
                  User submits GitHub URL → Frontend calls Supabase → Edge function fetches code via GitHub API → 
                  Analysis results stored in database tables
                </p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold text-green-900">2. AI Documentation</h4>
                <p className="text-gray-600">
                  User requests documentation → Edge function calls OpenAI API → AI-generated content stored in 
                  documentation_proposals table → Results displayed to user
                </p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-semibold text-purple-900">3. Interactive Q&A</h4>
                <p className="text-gray-600">
                  System generates questions about functions → User engages in chat → AI responses via OpenAI → 
                  Conversations stored for future reference
                </p>
              </div>
              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-semibold text-orange-900">4. Technical Debt Analysis</h4>
                <p className="text-gray-600">
                  System analyzes dependencies → Forbidden licenses detected → Results stored in forbidden_license table → 
                  Risk assessment displayed in dashboard
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Architecture;
