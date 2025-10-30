import { authValidators } from '../../../validators/auth.validator';
import { storyValidators } from '../../../validators/story.validator';
import { characterValidators } from '../../../validators/character.validator';

describe('Validation Schemas', () => {
  describe('Auth Validators', () => {
    describe('register schema', () => {
      it('should validate valid registration data', () => {
        const validData = {
          name: 'John Doe',
          email: 'john@example.com',
          password: 'Password123',
        };

        const { error } = authValidators.register.validate(validData);
        expect(error).toBeUndefined();
      });

      it('should reject short passwords', () => {
        const invalidData = {
          name: 'John Doe',
          email: 'john@example.com',
          password: 'Short1',
        };

        const { error } = authValidators.register.validate(invalidData);
        expect(error).toBeDefined();
        expect(error?.message).toContain('at least 8 characters');
      });

      it('should reject password without uppercase', () => {
        const invalidData = {
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
        };

        const { error } = authValidators.register.validate(invalidData);
        expect(error).toBeDefined();
        expect(error?.message).toContain('uppercase');
      });

      it('should reject password without lowercase', () => {
        const invalidData = {
          name: 'John Doe',
          email: 'john@example.com',
          password: 'PASSWORD123',
        };

        const { error } = authValidators.register.validate(invalidData);
        expect(error).toBeDefined();
        expect(error?.message).toContain('lowercase');
      });

      it('should reject password without number', () => {
        const invalidData = {
          name: 'John Doe',
          email: 'john@example.com',
          password: 'PasswordOnly',
        };

        const { error } = authValidators.register.validate(invalidData);
        expect(error).toBeDefined();
        expect(error?.message).toContain('number');
      });

      it('should reject invalid email', () => {
        const invalidData = {
          name: 'John Doe',
          email: 'not-an-email',
          password: 'Password123',
        };

        const { error } = authValidators.register.validate(invalidData);
        expect(error).toBeDefined();
        expect(error?.message).toContain('valid email');
      });

      it('should reject missing fields', () => {
        const invalidData = {
          email: 'john@example.com',
        };

        const { error } = authValidators.register.validate(invalidData);
        expect(error).toBeDefined();
      });

      it('should trim and lowercase email', () => {
        const data = {
          name: 'John Doe',
          email: '  JOHN@EXAMPLE.COM  ',
          password: 'Password123',
        };

        const { value } = authValidators.register.validate(data);
        expect(value.email).toBe('john@example.com');
      });
    });

    describe('login schema', () => {
      it('should validate valid login data', () => {
        const validData = {
          email: 'john@example.com',
          password: 'anypassword',
        };

        const { error } = authValidators.login.validate(validData);
        expect(error).toBeUndefined();
      });

      it('should reject invalid email', () => {
        const invalidData = {
          email: 'not-an-email',
          password: 'anypassword',
        };

        const { error } = authValidators.login.validate(invalidData);
        expect(error).toBeDefined();
      });

      it('should reject missing password', () => {
        const invalidData = {
          email: 'john@example.com',
        };

        const { error } = authValidators.login.validate(invalidData);
        expect(error).toBeDefined();
      });
    });
  });

  describe('Story Validators', () => {
    describe('generateStory schema', () => {
      it('should validate valid story data', () => {
        const validData = {
          character: {
            name: 'Hero',
            description: 'A brave hero who saves the day',
          },
          genre: 'Adventure',
          language: 'English',
          ageGroup: '6-8',
          theme: 'Courage',
          moralLesson: 'Be brave',
        };

        const { error } = storyValidators.generateStory.validate(validData);
        expect(error).toBeUndefined();
      });

      it('should reject invalid genre', () => {
        const invalidData = {
          character: {
            name: 'Hero',
            description: 'A brave hero who saves the day',
          },
          genre: 'InvalidGenre',
          language: 'English',
          ageGroup: '6-8',
        };

        const { error } = storyValidators.generateStory.validate(invalidData);
        expect(error).toBeDefined();
        expect(error?.message).toContain('Genre must be one of');
      });

      it('should reject short character description', () => {
        const invalidData = {
          character: {
            name: 'Hero',
            description: 'Short',
          },
          genre: 'Adventure',
          language: 'English',
          ageGroup: '6-8',
        };

        const { error } = storyValidators.generateStory.validate(invalidData);
        expect(error).toBeDefined();
        expect(error?.message).toContain('at least 10 characters');
      });

      it('should accept optional theme and moralLesson', () => {
        const validData = {
          character: {
            name: 'Hero',
            description: 'A brave hero who saves the day',
          },
          genre: 'Adventure',
          language: 'English',
          ageGroup: '6-8',
        };

        const { error } = storyValidators.generateStory.validate(validData);
        expect(error).toBeUndefined();
      });
    });

    describe('updateStory schema', () => {
      it('should validate valid update data', () => {
        const validData = {
          title: 'New Title',
          theme: 'Updated theme',
        };

        const { error } = storyValidators.updateStory.validate(validData);
        expect(error).toBeUndefined();
      });

      it('should reject empty update', () => {
        const invalidData = {};

        const { error } = storyValidators.updateStory.validate(invalidData);
        expect(error).toBeDefined();
        expect(error?.message).toContain('At least one field');
      });

      it('should accept URL fields', () => {
        const validData = {
          audioUrl: 'https://example.com/audio.mp3',
          videoUrl: 'https://example.com/video.mp4',
        };

        const { error } = storyValidators.updateStory.validate(validData);
        expect(error).toBeUndefined();
      });
    });

    describe('storyId schema', () => {
      it('should validate valid UUID', () => {
        const validData = {
          id: '123e4567-e89b-12d3-a456-426614174000',
        };

        const { error } = storyValidators.storyId.validate(validData);
        expect(error).toBeUndefined();
      });

      it('should reject invalid UUID', () => {
        const invalidData = {
          id: 'not-a-uuid',
        };

        const { error } = storyValidators.storyId.validate(invalidData);
        expect(error).toBeDefined();
      });
    });
  });

  describe('Character Validators', () => {
    describe('generateCharacter schema', () => {
      it('should validate valid character data', () => {
        const validData = {
          name: 'Hero',
          description: 'A brave character with magical powers',
        };

        const { error } = characterValidators.generateCharacter.validate(validData);
        expect(error).toBeUndefined();
      });

      it('should reject short description', () => {
        const invalidData = {
          name: 'Hero',
          description: 'Short',
        };

        const { error } = characterValidators.generateCharacter.validate(invalidData);
        expect(error).toBeDefined();
        expect(error?.message).toContain('at least 10 characters');
      });

      it('should reject empty name', () => {
        const invalidData = {
          name: '',
          description: 'A brave character with magical powers',
        };

        const { error } = characterValidators.generateCharacter.validate(invalidData);
        expect(error).toBeDefined();
      });
    });
  });
});

