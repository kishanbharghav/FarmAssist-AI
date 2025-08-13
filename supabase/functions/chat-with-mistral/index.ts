import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { message, farmerProfile } = await req.json()
    
    const mistralApiKey = Deno.env.get('MISTRAL_API_KEY')
    if (!mistralApiKey) {
      throw new Error('Mistral API key not configured')
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

Provide practical, actionable farming advice tailored to this farmer's specific situation. Be conversational, helpful, and focus on solutions. Keep responses concise but informative.`

    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${mistralApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistral-small-latest',
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
      throw new Error(`Mistral API error: ${response.status}`)
    }

    const data = await response.json()
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
    console.error('Error in chat-with-mistral function:', error)
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