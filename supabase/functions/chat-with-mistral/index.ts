import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { message, farmerProfile } = await req.json()
    console.log('Received request:', { message, farmerProfile })
    
    const openrouterApiKey = Deno.env.get('OPENROUTER_API_KEY')
    console.log('API key exists:', !!openrouterApiKey)
    if (!openrouterApiKey) {
      console.error('OPENROUTER_API_KEY not found in environment')
      throw new Error('OpenRouter API key not configured')
    }

    // Create context-aware system prompt based on farmer profile
    const systemPrompt = `You are an expert AI farming assistant helping farmers with their agricultural questions. 
    
Farmer Profile:
- Name: ${farmerProfile.name || 'Unknown'}
- Farm Size: ${farmerProfile.farmSize || 'Unknown'}
- Location: ${farmerProfile.location || 'Unknown'}
- Experience: ${farmerProfile.experience || 'Unknown'}
- Crops: ${farmerProfile.cropTypes?.join(', ') || 'Various'}
- Main Challenges: ${farmerProfile.mainChallenges?.join(', ') || 'General farming'}
- Soil Type: ${farmerProfile.soilType || 'Unknown'}
- Planting Season: ${farmerProfile.plantingDate || 'Unknown'}
- Irrigation Method: ${farmerProfile.irrigationType || 'Unknown'}

Provide practical, actionable farming advice tailored to this farmer's specific situation. Be conversational, helpful, and focus on solutions. Keep responses concise but informative.`

    console.log('Making request to OpenRouter...')
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openrouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://lovable.dev',
        'X-Title': 'Farming Assistant',
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat-v3-0324:free',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('OpenRouter API error:', response.status, errorText)
      throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log('OpenRouter response:', data)
    const aiResponse = data.choices[0]?.message?.content || 'I apologize, but I was unable to generate a response. Could you please try rephrasing your question?'

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error in chat-with-openrouter function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate response',
        message: error.message 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})