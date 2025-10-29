import OpenAI from 'openai';
import { logger } from '../lib/logger';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class OpenAIService {
  async generateStory(params: {
    character: { name: string; description: string };
    genre: string;
    language: string;
    ageGroup: string;
    theme?: string;
    moralLesson?: string;
  }): Promise<{ title: string; content: string }> {
    const { character, genre, language, ageGroup, theme, moralLesson } = params;

    const prompt = this.buildStoryPrompt(params);

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a creative children's story writer. Create engaging, age-appropriate stories that inspire imagination and teach valuable lessons. Write in ${language}.`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.8,
        max_tokens: 2000,
      });

      const response = completion.choices[0].message.content || '';
      
      // Parse title and content
      const lines = response.split('\n');
      const title = lines[0].replace(/^#+\s*/, '').trim();
      const content = lines.slice(1).join('\n').trim();

      return { title, content };
    } catch (error) {
      logger.error('OpenAI API error:', error);
      throw new Error('Failed to generate story');
    }
  }

  async generateCharacterImage(description: string): Promise<string> {
    try {
      const response = await openai.images.generate({
        model: 'dall-e-3',
        prompt: `A friendly, colorful children's book character: ${description}. Style: whimsical, vibrant, suitable for children's books.`,
        size: '1024x1024',
        quality: 'standard',
        n: 1,
      });

      return response.data?.[0].url || '';
    } catch (error) {
      logger.error('DALL-E API error:', error);
      throw new Error('Failed to generate character image');
    }
  }

  private buildStoryPrompt(params: {
    character: { name: string; description: string };
    genre: string;
    language: string;
    ageGroup: string;
    theme?: string;
    moralLesson?: string;
  }): string {
    const { character, genre, ageGroup, theme, moralLesson } = params;

    let prompt = `Create an engaging ${genre} story for children aged ${ageGroup}.

Main Character:
- Name: ${character.name}
- Description: ${character.description}
`;

    if (theme) {
      prompt += `\nTheme: ${theme}`;
    }

    if (moralLesson) {
      prompt += `\nMoral Lesson: ${moralLesson}`;
    }

    prompt += `

Requirements:
- Age-appropriate language and content for ${ageGroup} year olds
- Engaging plot with a clear beginning, middle, and end
- Vivid descriptions that spark imagination
- Positive message and character development
- Length: approximately 500-800 words
- Format: Start with a title on the first line (use # for markdown heading), then the story

Please write the complete story now.`;

    return prompt;
  }
}

