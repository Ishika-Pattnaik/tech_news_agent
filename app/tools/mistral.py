#!/usr/bin/env python3

import asyncio
from typing import Optional
try:
    from mistralai.client import Mistral
except ImportError:
    try:
        from mistralai import Mistral
    except ImportError:
        # Fallback mock implementation for development/testing
        class Mistral:
            def __init__(self, api_key: str):
                self.api_key = api_key
            
            class chat:
                @staticmethod
                def complete(model: str, messages: list):
                    class Message:
                        def __init__(self, content):
                            self.content = content
                    
                    class Choice:
                        def __init__(self, message):
                            self.message = message
                    
                    class Response:
                        def __init__(self):
                            self.choices = [Choice(Message(f"Mock summary: This is a sample AI-generated summary about tech news. In production, this would be an actual summary from Mistral AI."))]
                    
                    return Response()
import logging
import json

logger = logging.getLogger(__name__)

READING_MODE_INSTRUCTIONS = {
    "brief": """
        Give a 5-7 line TL;DR summary of the news story or search topic.
        Use simple, punchy language — no jargon.
        Format as 2-3 bullet points maximum, each one sentence long.
        End with one "Why it matters" line in italics.
        Tone: like a smart friend texting you the headline.
    """,
    "explained": """
        Give a full breakdown of the story in 150-250 words.
        Structure it as:
        • What happened (2-3 sentences)
        • Why it happened / background context (2-3 sentences)
        • Who is affected and how (2-3 sentences)
        • What comes next / implications (1-2 sentences)
        Use clear, accessible language — explain any technical terms inline.
        Tone: like a knowledgeable journalist explaining to a curious non-expert.
    """,
    "critical": """
        Provide a skeptical, analytical take on the story in 200-250 words.
        Structure it as:
        • The claim or announcement (1-2 sentences, neutral)
        • What's credible or well-supported (1-2 sentences)
        • What's missing, overhyped, or questionable (2-3 sentences)
        • Hidden motives or industry context to be aware of (1-2 sentences)
        • Verdict: a one-line skeptical summary
        Tone: like a sharp tech critic or investigative journalist — no hype, follow incentives, question narrative.
    """
}

class MistralTool:
    def __init__(self, api_key: str):
        self.client = Mistral(api_key=api_key)
        self.model = "mistral-small-latest"
    
    async def generate_headline(self, title: str, content: str) -> str:
        """
        Generate a proper headline from news title and content.
        
        Args:
            title: Original article title
            content: Article content/snippet
            
        Returns:
            Generated headline (1-2 sentences about the actual news)
        """
        try:
            prompt = f"""Based on the following article title and content, generate a clear, informative headline that explains what the news is actually about in 1-2 sentences.

Title: {title}
Content: {content}

Requirements:
- Explain what the news is actually about
- 1-2 sentences maximum
- Be factual and clear
- Focus on the key development/event
- Make it easy to understand
- Do NOT use asterisks, bold formatting, or markdown
- Plain text only

Headline:"""
            
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                None,
                lambda: self.client.chat.complete(
                    model=self.model,
                    messages=[{"role": "user", "content": prompt}]
                )
            )
            
            headline = response.choices[0].message.content.strip()
            logger.info(f"Generated headline: {headline[:100]}...")
            return headline
            
        except Exception as e:
            logger.error(f"Failed to generate headline: {str(e)}")
            return title  # Fallback to original title

    async def summarize_news(self, query: str, news_content: str, reading_mode: str = "brief") -> str:
        """
        Summarize tech news using Mistral AI.
        
        Args:
            query: Original user query
            news_content: Formatted news content from Tavily
            
        Returns:
            Summarized response
            
        Raises:
            Exception: If API call fails
        """
        try:
            if not news_content.strip():
                return "No tech news found to summarize."
            
            reading_mode_instruction = READING_MODE_INSTRUCTIONS.get(reading_mode, READING_MODE_INSTRUCTIONS["brief"])
            
            prompt = f"""You are a sharp, authoritative tech news correspondent. Your job is to deliver 
accurate, professional news summaries that feel like they belong in a top-tier 
tech publication like The Verge, Wired, or TechCrunch.

Only reference and cite information from reputable, established news organizations and research institutions. Do not cite unknown blogs, forums, or unverified sources.

Use proper industry terminology and jargon — but every time you introduce a 
technical term, weave a brief, natural explanation into the sentence itself 
so any reader can follow along without feeling talked down to.

READING MODE INSTRUCTION — apply this strictly to how you write the summary:
{reading_mode_instruction}

When given article content, return ONLY a JSON object (no extra text, no markdown, 
no code fences) in this exact format:

{{
  "headline": "A punchy, journalistic 1-line headline. Use real technical terms. Sound like a breaking news headline.",
  "summary": "Written per the reading mode instruction above. Use industry jargon naturally but fold in a quick plain-English clarification inline wherever a non-expert might stumble. Example style: 'NVIDIA's new Blackwell GPU (the chip that powers AI systems) outperforms its predecessor by 3x on inference tasks — meaning AI apps can now respond significantly faster.' For brief mode, keep it to 2-3 sentences. For explained mode, provide 4-6 sentences with background context. For critical mode, provide 6-8 sentences with analysis and counterpoints. Make it factual, sharp, and engaging.",
  "key_players": ["Company or person 1", "Company or person 2"],
  "why_it_matters": "1-2 sentences. Explain real-world significance — market impact, industry shift, what changes for businesses or consumers. Sound like an analyst, not a teacher.",
  "follow_up_question": "A smart, curious follow-up question that an engaged reader would naturally want answered next."
}}

Strict rules:
- Write like a journalist at a top tech outlet, not like a textbook or a chatbot.
- Use real terminology: LLMs, APIs, GPUs, inference, benchmark, open-source, etc.
- Every technical term must have a brief inline clarification folded naturally 
  into the sentence — not in brackets, not as a footnote. Make it flow.
- Never dumb it down — elevate the reader instead.
- Brief mode: 2 sentences max. Explained mode: up to 5 sentences. Critical mode: up to 5 sentences.
- Never start a sentence with "According to".
- Vary sentence openers across summaries.
- If Tavily returns multiple articles on the same topic, synthesize them into 
  one coherent summary rather than summarizing each separately.

Article content to summarize:
{news_content}"""
            
            logger.info(f"Calling Mistral API for query: {query}")
            
            # Run the synchronous Mistral call in an executor
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                None,
                lambda: self.client.chat.complete(
                    model=self.model,
                    messages=[{"role": "user", "content": prompt}]
                )
            )
            
            summary = response.choices[0].message.content
            logger.info("Mistral summarization completed successfully")
            return summary
            
        except Exception as e:
            logger.error(f"Mistral API call failed: {str(e)}")
            raise Exception(f"Mistral summarization error: {str(e)}")
