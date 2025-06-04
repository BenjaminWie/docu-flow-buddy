
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, FileX, ExternalLink, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface DisallowedFile {
  id: number;
  name: string;
  extension: string;
  file_url: string;
}

const DisallowedFilesTab = () => {
  const [disallowedFiles, setDisallowedFiles] = useState<DisallowedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExtension, setSelectedExtension] = useState<string>('all');

  useEffect(() => {
    fetchDisallowedFiles();
  }, []);

  const fetchDisallowedFiles = async () => {
    try {
      const { data, error } = await supabase
        .from('disallowed_files')
        .select('*')
        .order('extension', { ascending: true });

      if (error) throw error;
      setDisallowedFiles(data || []);
    } catch (error) {
      console.error('Error fetching disallowed files:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Group files by extension
  const filesByExtension = disallowedFiles.reduce((acc, file) => {
    if (!acc[file.extension]) {
      acc[file.extension] = [];
    }
    acc[file.extension].push(file);
    return acc;
  }, {} as Record<string, DisallowedFile[]>);

  const extensions = Object.keys(filesByExtension);
  const filteredFiles = selectedExtension === 'all' 
    ? disallowedFiles 
    : filesByExtension[selectedExtension] || [];

  const getExtensionRisk = (extension: string) => {
    const riskMap: Record<string, string> = {
      '.groovy': 'High',
      '.xslt': 'Medium',
      '.g4': 'Low',
      '.xml': 'Medium',
      '.properties': 'Low'
    };
    return riskMap[extension] || 'Medium';
  };

  const getExtensionColor = (extension: string) => {
    const risk = getExtensionRisk(extension);
    switch (risk) {
      case 'High': return 'bg-red-100 text-red-800 border-red-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-green-100 text-green-800 border-green-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <FileX className="w-5 h-5" />
            Disallowed Files Analysis
          </CardTitle>
          <p className="text-orange-700">
            Files that violate compliance rules and pose potential security or maintainability risks.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-red-600">{disallowedFiles.length}</div>
              <div className="text-sm text-gray-600">Total Disallowed Files</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-orange-600">{extensions.length}</div>
              <div className="text-sm text-gray-600">File Types Found</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-yellow-600">
                {extensions.filter(ext => getExtensionRisk(ext) === 'High').length}
              </div>
              <div className="text-sm text-gray-600">High Risk Types</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Extension Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            File Types Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              variant={selectedExtension === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedExtension('all')}
            >
              All Files ({disallowedFiles.length})
            </Button>
            {extensions.map(extension => (
              <Button
                key={extension}
                variant={selectedExtension === extension ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedExtension(extension)}
                className="flex items-center gap-2"
              >
                <Badge className={getExtensionColor(extension)} variant="outline">
                  {getExtensionRisk(extension)}
                </Badge>
                {extension} ({filesByExtension[extension].length})
              </Button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {extensions.map(extension => (
              <Card key={extension} className="border-l-4 border-l-orange-400">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{extension} Files</h4>
                    <Badge className={getExtensionColor(extension)}>
                      {getExtensionRisk(extension)} Risk
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold text-gray-700 mb-2">
                    {filesByExtension[extension].length}
                  </p>
                  <p className="text-sm text-gray-600">
                    {getExtensionRisk(extension) === 'High' && 'Requires immediate attention'}
                    {getExtensionRisk(extension) === 'Medium' && 'Monitor for compliance'}
                    {getExtensionRisk(extension) === 'Low' && 'Low priority review'}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed File List */}
      <Card>
        <CardHeader>
          <CardTitle>
            {selectedExtension === 'all' 
              ? 'All Disallowed Files' 
              : `${selectedExtension} Files (${filteredFiles.length})`
            }
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredFiles.map(file => (
              <div 
                key={file.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                    <Badge className={getExtensionColor(file.extension)} variant="outline">
                      {file.extension}
                    </Badge>
                  </div>
                  <div>
                    <div className="font-medium">{file.name}</div>
                    <div className="text-sm text-gray-600">
                      Risk Level: {getExtensionRisk(file.extension)}
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(file.file_url, '_blank')}
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  View File
                </Button>
              </div>
            ))}
          </div>

          {filteredFiles.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <FileX className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No files found for the selected filter.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DisallowedFilesTab;
