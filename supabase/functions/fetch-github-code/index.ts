
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { githubUrl, filePath, functionName, startLine, endLine } = await req.json()
    
    // Parse GitHub URL to get owner and repo
    const urlParts = githubUrl.replace('https://github.com/', '').split('/')
    const owner = urlParts[0]
    const repo = urlParts[1]
    
    // Fetch file content from GitHub API
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`
    
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Lovable-CodeAnalyzer/1.0'
      }
    })

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`)
    }

    const data = await response.json()
    
    if (data.type !== 'file') {
      throw new Error('Path does not point to a file')
    }

    // Decode base64 content
    const fileContent = atob(data.content)
    const lines = fileContent.split('\n')
    
    // Handle line range extraction
    let functionCode = fileContent
    let functionStartLine = 1
    let functionEndLine = lines.length
    let githubLineUrl = `${githubUrl}/blob/main/${filePath}`
    
    if (startLine && endLine) {
      // Use provided line range
      functionStartLine = startLine
      functionEndLine = endLine
      functionCode = lines.slice(startLine - 1, endLine).join('\n')
      githubLineUrl = `${githubUrl}/blob/main/${filePath}#L${startLine}-L${endLine}`
    } else if (functionName) {
      // Try to extract the specific function
      const functionRegex = new RegExp(`(function\\s+${functionName}|const\\s+${functionName}\\s*=|${functionName}\\s*[:=]\\s*function|${functionName}\\s*[:=]\\s*\\(.*\\)\\s*=>)`, 'i')
      
      for (let i = 0; i < lines.length; i++) {
        if (functionRegex.test(lines[i])) {
          functionStartLine = i + 1
          
          // Find the end of the function (basic heuristic)
          let braceCount = 0
          let endLineIndex = i
          let foundOpenBrace = false
          
          for (let j = i; j < lines.length; j++) {
            const line = lines[j]
            for (const char of line) {
              if (char === '{') {
                braceCount++
                foundOpenBrace = true
              } else if (char === '}') {
                braceCount--
                if (foundOpenBrace && braceCount === 0) {
                  endLineIndex = j
                  break
                }
              }
            }
            if (foundOpenBrace && braceCount === 0) break
          }
          
          functionEndLine = endLineIndex + 1
          functionCode = lines.slice(i, endLineIndex + 1).join('\n')
          githubLineUrl = `${githubUrl}/blob/main/${filePath}#L${functionStartLine}-L${functionEndLine}`
          break
        }
      }
    }

    return new Response(JSON.stringify({
      content: functionCode,
      fullContent: fileContent,
      startLine: functionStartLine,
      endLine: functionEndLine,
      githubUrl: githubLineUrl,
      language: getLanguageFromPath(filePath),
      totalLines: lines.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

function getLanguageFromPath(filePath: string): string {
  const ext = filePath.split('.').pop()?.toLowerCase()
  const languageMap: Record<string, string> = {
    'js': 'javascript',
    'jsx': 'javascript',
    'ts': 'typescript',
    'tsx': 'typescript',
    'py': 'python',
    'java': 'java',
    'cpp': 'cpp',
    'c': 'c',
    'cs': 'csharp',
    'php': 'php',
    'rb': 'ruby',
    'go': 'go',
    'rs': 'rust',
    'swift': 'swift',
    'kt': 'kotlin'
  }
  return languageMap[ext || ''] || 'text'
}
