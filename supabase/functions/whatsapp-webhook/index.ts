import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Evolution API Configuration
const EVOLUTION_API_URL = Deno.env.get('EVOLUTION_API_URL') ?? 'https://evolution-api-46xy.onrender.com'
const EVOLUTION_API_KEY = Deno.env.get('EVOLUTION_API_KEY') ?? 'supersecretkey'
const EVOLUTION_INSTANCE  = Deno.env.get('EVOLUTION_INSTANCE_NAME') ?? 'pizza-shop'

// Format phone number to international format without + sign
// e.g., "9876543210" (Indian) -> "919876543210"
function formatPhone(phone: string): string {
  // Strip all non-digit chars
  const digits = phone.replace(/\D/g, '')
  // If already has country code (more than 10 digits for India), return as-is
  if (digits.length > 10) return digits
  // Assume Indian number, prepend 91
  return `91${digits}`
}

// Build a premium, detailed order confirmation message
function buildOrderMessage(order: {
  customer_name: string
  order_type: string
  table_number: number | null
  address: string | null
  total: number
  special_instructions: string | null
  order_items: Array<{ item_name: string; quantity: number; price: number }>
}): string {
  const isDelivery = order.order_type === 'delivery'
  const itemLines = order.order_items
    .map((item) => `  • ${item.quantity}× ${item.item_name}  —  ₹${item.price * item.quantity}`)
    .join('\n')

  const orderTypeLine = isDelivery
    ? `🚚 *Delivery*\n📍 ${order.address}`
    : `🍽️ *Dine-In*  |  Table No: ${order.table_number}`

  const specialNote = order.special_instructions
    ? `\n\n📝 *Special Instructions:*\n_${order.special_instructions}_`
    : ''

  const timestamp = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  return `╔══════════════════════════╗
✅ *ORDER CONFIRMED!*
╚══════════════════════════╝

Hello *${order.customer_name}* 👋,

Thank you for ordering from *Cafe Matrix*! 🎉 Your order has been received and is being prepared.

━━━━━━━━━━━━━━━━━━━━━━━━

🛒 *ORDER DETAILS*

${orderTypeLine}

*Items Ordered:*
${itemLines}

━━━━━━━━━━━━━━━━━━━━━━━━
💰 *Total Payable: ₹${order.total}*
━━━━━━━━━━━━━━━━━━━━━━━━${specialNote}

⏱️ *Placed at:* ${timestamp}

_For any assistance, please contact us directly._

🍕 *Cafe Matrix* — Taste the Difference!`
}

// Send WhatsApp message via Evolution API with retry logic
async function sendWhatsAppMessage(
  phone: string,
  message: string,
  maxRetries = 3
): Promise<boolean> {
  const url = `${EVOLUTION_API_URL}/message/sendText/${EVOLUTION_INSTANCE}`
  const formattedPhone = formatPhone(phone)

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    console.log(`Attempt ${attempt}/${maxRetries} — Sending message to ${formattedPhone}`)

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': EVOLUTION_API_KEY,
        },
        body: JSON.stringify({
          number: formattedPhone,
          options: {
            delay: 1000,
            presence: 'composing',
          },
          textMessage: {
            text: message,
          },
        }),
      })

      const result = await response.json()

      if (response.ok) {
        console.log(`✅ Message sent successfully on attempt ${attempt}`, result)
        return true
      }

      console.error(`❌ Attempt ${attempt} failed — Status: ${response.status}`, result)
    } catch (err) {
      console.error(`❌ Attempt ${attempt} threw an error:`, err)
    }

    // Wait before retrying (exponential back-off: 1s, 2s, 4s)
    if (attempt < maxRetries) {
      const delay = Math.pow(2, attempt - 1) * 1000
      console.log(`Waiting ${delay}ms before retry...`)
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  console.error(`🚨 All ${maxRetries} attempts failed for ${formattedPhone}`)
  return false
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // GET: Handle Meta webhook verification (kept for backward compatibility)
  if (req.method === 'GET') {
    const url = new URL(req.url)
    const mode = url.searchParams.get('hub.mode')
    const token = url.searchParams.get('hub.verify_token')
    const challenge = url.searchParams.get('hub.challenge')

    if (mode === 'subscribe' && token === Deno.env.get('WHATSAPP_VERIFY_TOKEN')) {
      console.log('WEBHOOK_VERIFIED')
      return new Response(challenge, { status: 200 })
    }
    return new Response('Verification failed', { status: 403 })
  }

  // POST: Handle order notification requests from the frontend
  if (req.method === 'POST') {
    try {
      const body = await req.json()

      // --- Case 1: Called directly from the frontend with full order data ---
      if (body.source === 'checkout') {
        const { order, items } = body

        if (!order?.phone) {
          return new Response(JSON.stringify({ error: 'Missing phone number' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          })
        }

        const message = buildOrderMessage({
          customer_name: order.customer_name,
          order_type: order.order_type,
          table_number: order.table_number ?? null,
          address: order.address ?? null,
          total: order.total,
          special_instructions: order.special_instructions ?? null,
          order_items: items ?? [],
        })

        const sent = await sendWhatsAppMessage(order.phone, message)

        return new Response(
          JSON.stringify({ status: sent ? 'sent' : 'failed' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: sent ? 200 : 500,
          }
        )
      }

      // --- Case 2: Called from a Supabase Database Webhook (future support) ---
      if (body.type === 'INSERT' && body.table === 'orders') {
        const order = body.record

        // Fetch order items from Supabase
        const supabase = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )
        const { data: items } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', order.id)

        const message = buildOrderMessage({
          customer_name: order.customer_name,
          order_type: order.order_type,
          table_number: order.table_number ?? null,
          address: order.address ?? null,
          total: order.total,
          special_instructions: order.special_instructions ?? null,
          order_items: items ?? [],
        })

        const sent = await sendWhatsAppMessage(order.phone, message)
        console.log(`DB Webhook: Order ${order.id} — Message ${sent ? 'sent' : 'failed'}`)
      }

      return new Response(JSON.stringify({ status: 'ok' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    } catch (error) {
      console.error('Error processing request:', error)
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      })
    }
  }

  return new Response('Method Not Allowed', { status: 405 })
})
