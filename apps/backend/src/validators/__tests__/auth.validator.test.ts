import { describe, it, expect } from 'vitest';
import { RegisterSchema, LoginSchema } from '../auth.validator';

describe('Auth Validators', () => {
  describe('RegisterSchema', () => {
    it('should validate correct registration data', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'SecurePass123',
      };

      const result = RegisterSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject short name', () => {
      const invalidData = {
        name: 'J',
        email: 'john@example.com',
        password: 'SecurePass123',
      };

      const result = RegisterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject invalid email', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'not-an-email',
        password: 'SecurePass123',
      };

      const result = RegisterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject weak password', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'weak',
      };

      const result = RegisterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject password without uppercase', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'lowercase123',
      };

      const result = RegisterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should trim and lowercase email', () => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'SecurePass123',
      };

      const result = RegisterSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe('john@example.com');
      }
    });
  });

  describe('LoginSchema', () => {
    it('should validate correct login data', () => {
      const validData = {
        email: 'john@example.com',
        password: 'anypassword',
      };

      const result = LoginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'not-an-email',
        password: 'anypassword',
      };

      const result = LoginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject empty password', () => {
      const invalidData = {
        email: 'john@example.com',
        password: '',
      };

      const result = LoginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});

