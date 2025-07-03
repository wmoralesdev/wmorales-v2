# Guestbook AI Setup Guide

This guide will help you set up the AI integration for the guestbook feature, which generates unique color palettes based on user moods and styles.

## AI Model Selection

We use **OpenAI GPT-3.5 Turbo** for color palette generation because:
- Cost-effective ($0.0005 per 1K input tokens, $0.0015 per 1K output tokens)
- Fast response times
- Excellent at understanding mood/style descriptions
- Reliable structured output generation

**Revision: now using GPT-4o-mini**

## Setup Steps

### 1. Get OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to [API Keys](https://platform.openai.com/api-keys)
4. Click "Create new secret key"
5. Name your key (e.g., "Portfolio Guestbook")
6. Copy the key - **you won't be able to see it again!**

### 2. Add API Key to Environment

Add the following to your `.env.local` file:

```env
OPENAI_API_KEY=sk-your-api-key-here
```

### 3. Set Usage Limits (Recommended)

To prevent unexpected charges:

1. Go to [Usage Limits](https://platform.openai.com/usage)
2. Set a monthly budget (e.g., $10)
3. Set up usage alerts

### 4. Monitor Usage

- Check usage at [OpenAI Usage Dashboard](https://platform.openai.com/usage)
- Each color generation costs approximately $0.001-$0.002

## How It Works

The AI generates a color palette with four hex colors:
- **Primary Color**: Gradient start color
- **Secondary Color**: Gradient end color
- **Accent Color**: Highlight color
- **Background Color**: Card background

Example prompt: "I'm feeling happy and creative" might generate:
```json
{
  "primaryColor": "#FFD93D",
  "secondaryColor": "#FF6B6B",
  "accentColor": "#6BCB77",
  "backgroundColor": "#2D2D3F"
}
```

## Cost Estimation

- Average tokens per request: ~200-300
- Cost per generation: ~$0.001-$0.002
- 1000 tickets would cost: ~$1-2

## Troubleshooting

### API Key Not Working
- Ensure the key starts with `sk-`
- Check if the key has been revoked
- Verify billing is set up on your OpenAI account

### Generation Fails
- Check if you have API credits
- Verify the API key is correctly set
- Check server logs for specific errors

### Fallback Colors
If AI generation fails, the system uses default colors:
- Primary: `#8b5cf6` (Purple)
- Secondary: `#ec4899` (Pink)
- Accent: `#a78bfa` (Light Purple)
- Background: `#1f1f23` (Dark Gray)