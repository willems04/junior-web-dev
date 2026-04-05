import random
import string
from typing import Optional

class PasswordGenerator:
    """Generate secure passwords with customizable options."""
    
    def __init__(self):
        self.lowercase = string.ascii_lowercase
        self.uppercase = string.ascii_uppercase
        self.digits = string.digits
        self.special = string.punctuation
    
    def generate(
        self,
        length: int = 12,
        use_uppercase: bool = True,
        use_lowercase: bool = True,
        use_digits: bool = True,
        use_special: bool = False
    ) -> str:
        """
        Generate a random password.
        
        Args:
            length: Password length (default: 12)
            use_uppercase: Include uppercase letters (default: True)
            use_lowercase: Include lowercase letters (default: True)
            use_digits: Include digits (default: True)
            use_special: Include special characters (default: False)
        
        Returns:
            Generated password string
        """
        if length < 4:
            raise ValueError("Password length must be at least 4")
        
        character_pool = ""
        
        if use_uppercase:
            character_pool += self.uppercase
        if use_lowercase:
            character_pool += self.lowercase
        if use_digits:
            character_pool += self.digits
        if use_special:
            character_pool += self.special
        
        if not character_pool:
            raise ValueError("At least one character type must be selected")
        
        # Generate password
        password = ''.join(random.choice(character_pool) for _ in range(length))
        return password
    
    def generate_multiple(
        self,
        count: int = 5,
        length: int = 12,
        use_uppercase: bool = True,
        use_lowercase: bool = True,
        use_digits: bool = True,
        use_special: bool = False
    ) -> list[str]:
        """Generate multiple passwords."""
        return [
            self.generate(length, use_uppercase, use_lowercase, use_digits, use_special)
            for _ in range(count)
        ]
    
    def get_strength(self, password: str) -> str:
        """
        Evaluate password strength.
        
        Returns:
            'Weak', 'Medium', or 'Strong'
        """
        score = 0
        
        if len(password) >= 12:
            score += 1
        if len(password) >= 16:
            score += 1
        if any(c.isupper() for c in password):
            score += 1
        if any(c.islower() for c in password):
            score += 1
        if any(c.isdigit() for c in password):
            score += 1
        if any(c in self.special for c in password):
            score += 1
        
        if score <= 2:
            return "Weak"
        elif score <= 4:
            return "Medium"
        else:
            return "Strong"


def main():
    """Interactive password generator."""
    pg = PasswordGenerator()
    
    print("=" * 50)
    print("PASSWORD GENERATOR")
    print("=" * 50)
    
    while True:
        print("\nOptions:")
        print("1. Generate single password")
        print("2. Generate multiple passwords")
        print("3. Check password strength")
        print("4. Exit")
        
        choice = input("\nEnter your choice (1-4): ").strip()
        
        if choice == "1":
            try:
                length = int(input("Enter password length (default 12): ") or "12")
                use_upper = input("Include uppercase? (y/n, default y): ").lower() != "n"
                use_lower = input("Include lowercase? (y/n, default y): ").lower() != "n"
                use_digit = input("Include digits? (y/n, default y): ").lower() != "n"
                use_spec = input("Include special characters? (y/n, default n): ").lower() == "y"
                
                password = pg.generate(length, use_upper, use_lower, use_digit, use_spec)
                strength = pg.get_strength(password)
                
                print(f"\nGenerated Password: {password}")
                print(f"Strength: {strength}")
            except ValueError as e:
                print(f"Error: {e}")
        
        elif choice == "2":
            try:
                count = int(input("How many passwords? (default 5): ") or "5")
                length = int(input("Enter password length (default 12): ") or "12")
                use_upper = input("Include uppercase? (y/n, default y): ").lower() != "n"
                use_lower = input("Include lowercase? (y/n, default y): ").lower() != "n"
                use_digit = input("Include digits? (y/n, default y): ").lower() != "n"
                use_spec = input("Include special characters? (y/n, default n): ").lower() == "y"
                
                passwords = pg.generate_multiple(count, length, use_upper, use_lower, use_digit, use_spec)
                
                print(f"\nGenerated {count} passwords:")
                for i, pwd in enumerate(passwords, 1):
                    strength = pg.get_strength(pwd)
                    print(f"{i}. {pwd} ({strength})")
            except ValueError as e:
                print(f"Error: {e}")
        
        elif choice == "3":
            password = input("Enter password to check: ")
            strength = pg.get_strength(password)
            print(f"Strength: {strength}")
        
        elif choice == "4":
            print("Goodbye!")
            break
        
        else:
            print("Invalid choice. Please try again.")


if __name__ == "__main__":
    main()
