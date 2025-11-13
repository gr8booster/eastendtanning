#!/usr/bin/env python3
"""
Seed Fizze Drinks Menu
Run this script to populate the fizze_drinks collection
"""
import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone
import uuid

mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'test_database')]

FIZZE_DRINKS = [
    # Signature Milk Teas
    {"name": "Fizze Classic Milk Tea", "category": "Milk Teas", "flavor_profile": "Traditional black tea + milk, lightly sweetened", "recipe": "Brew ¾ cup black tea → add 1 cup milk + 1-2 tbsp sugar → shake with ice", "price": 5.99, "available": True, "display_order": 1},
    {"name": "Taro Dream", "category": "Milk Teas", "flavor_profile": "Creamy purple taro flavor", "recipe": "Mix ½ cup tea + 1 cup milk + 2 tbsp taro powder + ice", "price": 6.49, "available": True, "display_order": 2},
    {"name": "Brown Sugar Rush", "category": "Milk Teas", "flavor_profile": "Caramel-sweet milk tea with brown sugar swirl", "recipe": "Mix ¾ cup tea + 1 cup milk + 2 tbsp brown sugar syrup; coat cup walls with syrup before pouring", "price": 6.99, "available": True, "display_order": 3},
    {"name": "Thai Twist", "category": "Milk Teas", "flavor_profile": "Rich orange Thai tea + condensed milk", "recipe": "Brew ¾ cup Thai tea + 2 tbsp condensed milk + ½ cup milk + ice", "price": 6.49, "available": True, "display_order": 4},
    {"name": "Coffee Crave", "category": "Milk Teas", "flavor_profile": "Coffee-infused milk tea", "recipe": "Mix ¾ cup coffee or tea + 1 cup milk + 1-2 tbsp sugar + ice", "price": 6.99, "available": True, "display_order": 5},
    {"name": "Peach Cloud Milk Tea", "category": "Milk Teas", "flavor_profile": "Fruity peach aroma blended with creamy tea", "recipe": "Brew ¾ cup black tea + 2 tbsp peach syrup + 1 cup milk + ice", "price": 6.49, "available": True, "display_order": 6},
    
    # Fruity Fizz Teas
    {"name": "Mango Wave", "category": "Fruit Teas", "flavor_profile": "Mango syrup + green tea", "recipe": "Brew ¾ cup green tea + 2 tbsp mango syrup + ice + (optional mango boba)", "price": 5.99, "available": True, "display_order": 7},
    {"name": "Strawberry Splash", "category": "Fruit Teas", "flavor_profile": "Sweet strawberry tea blend", "recipe": "¾ cup green tea + 2 tbsp strawberry syrup + fresh berries + ice", "price": 5.99, "available": True, "display_order": 8},
    {"name": "Lychee Breeze", "category": "Fruit Teas", "flavor_profile": "Floral sweet lychee tea", "recipe": "¾ cup green tea + 2 tbsp lychee syrup + lychee fruit + ice", "price": 6.49, "available": True, "display_order": 9},
    {"name": "Dragon Fire Tea", "category": "Fruit Teas", "flavor_profile": "Vibrant dragon fruit color & taste", "recipe": "¾ cup green tea + 2 tbsp dragon fruit puree + ice", "price": 6.99, "available": True, "display_order": 10},
    {"name": "Kiwi Kick", "category": "Fruit Teas", "flavor_profile": "Tangy kiwi sweetness with tea base", "recipe": "¾ cup green tea + 2 tbsp kiwi syrup + ice + optional kiwi boba", "price": 5.99, "available": True, "display_order": 11},
    {"name": "Peach Glow", "category": "Fruit Teas", "flavor_profile": "Juicy peach green tea", "recipe": "¾ cup green tea + 2 tbsp peach syrup + ice", "price": 5.99, "available": True, "display_order": 12},
    
    # Blended Ice Series
    {"name": "Mango Bliss", "category": "Blended Ice", "flavor_profile": "Smooth mango slush", "recipe": "Blend ½ cup mango puree + ½ cup milk + 1 cup ice", "price": 6.99, "available": True, "display_order": 13},
    {"name": "Taro Frost", "category": "Blended Ice", "flavor_profile": "Creamy purple slush", "recipe": "Blend 2 tbsp taro powder + 1 cup milk + 1 cup ice", "price": 6.99, "available": True, "display_order": 14},
    {"name": "Coconut Snow", "category": "Blended Ice", "flavor_profile": "Coconut milk slush", "recipe": "Blend 1 cup coconut milk + 2 tbsp syrup + 1 cup ice", "price": 6.99, "available": True, "display_order": 15},
    {"name": "Honeydew Heaven", "category": "Blended Ice", "flavor_profile": "Light melon flavor slush", "recipe": "Blend ½ cup honeydew puree + ½ cup milk + 1 cup ice", "price": 6.99, "available": True, "display_order": 16},
    {"name": "Peach Freeze", "category": "Blended Ice", "flavor_profile": "Fruity peach smoothie", "recipe": "Blend ½ cup peach puree + ½ cup milk + ice", "price": 6.99, "available": True, "display_order": 17},
    {"name": "Watermelon Whirl", "category": "Blended Ice", "flavor_profile": "Juicy watermelon ice blend", "recipe": "Blend ½ cup fresh watermelon + ice + 1 tbsp syrup", "price": 6.49, "available": True, "display_order": 18},
    
    # Hot Bubble Tea
    {"name": "Hot Taro Latte", "category": "Hot Boba", "flavor_profile": "Warm milk + taro powder + pearls", "recipe": "Heat 1 cup milk + 2 tbsp taro powder + add cooked pearls", "price": 6.49, "available": True, "display_order": 19},
    {"name": "Hot Thai Tea", "category": "Hot Boba", "flavor_profile": "Spiced Thai tea + condensed milk", "recipe": "Brew Thai tea + 2 tbsp condensed milk + ½ cup milk", "price": 6.49, "available": True, "display_order": 20},
    {"name": "Hot Coffee Boba", "category": "Hot Boba", "flavor_profile": "Sweet coffee latte + pearls", "recipe": "Brew coffee + 1 cup milk + 1 tbsp sugar + cooked pearls", "price": 6.49, "available": True, "display_order": 21},
    
    # House Specials
    {"name": "Fizze Galaxy Tea", "category": "House Specials", "flavor_profile": "Layered mango + dragon fruit with sparkling water for a galaxy look", "recipe": "Layer mango syrup + dragon fruit puree + sparkling water + ice", "price": 7.99, "available": True, "display_order": 22},
    {"name": "Boba Float", "category": "House Specials", "flavor_profile": "Any milk tea topped with ice cream and brown sugar drizzle", "recipe": "Prepare milk tea + add scoop of vanilla ice cream + drizzle brown sugar", "price": 8.49, "available": True, "display_order": 23},
    {"name": "Energy Fizz Tea", "category": "House Specials", "flavor_profile": "Sparkling water base + fruit syrup for carbonated bubble tea", "recipe": "Mix sparkling water + fruit syrup + ice + optional boba", "price": 6.99, "available": True, "display_order": 24},
    
    # Toppings
    {"name": "Classic Black Boba", "category": "Toppings", "flavor_profile": "Traditional tapioca pearls", "recipe": "Add to any drink", "price": 0.75, "available": True, "display_order": 25},
    {"name": "Brown Sugar Boba", "category": "Toppings", "flavor_profile": "Sweet brown sugar coated pearls", "recipe": "Add to any drink", "price": 1.00, "available": True, "display_order": 26},
    {"name": "Strawberry Popping Boba", "category": "Toppings", "flavor_profile": "Bursting strawberry flavor", "recipe": "Add to any drink", "price": 0.75, "available": True, "display_order": 27},
    {"name": "Mango Popping Boba", "category": "Toppings", "flavor_profile": "Bursting mango flavor", "recipe": "Add to any drink", "price": 0.75, "available": True, "display_order": 28},
    {"name": "Lychee Popping Boba", "category": "Toppings", "flavor_profile": "Bursting lychee flavor", "recipe": "Add to any drink", "price": 0.75, "available": True, "display_order": 29},
    {"name": "Coconut Jelly", "category": "Toppings", "flavor_profile": "Chewy coconut jelly cubes", "recipe": "Add to any drink", "price": 0.75, "available": True, "display_order": 30},
    {"name": "Coffee Jelly", "category": "Toppings", "flavor_profile": "Coffee flavored jelly cubes", "recipe": "Add to any drink", "price": 0.75, "available": True, "display_order": 31},
    
    # Dirty Sodas
    {"name": "Butter Me Up", "category": "Dirty Sodas", "flavor_profile": "Root beer with buttery cream", "recipe": "24 oz root beer + 2 tbsp butterscotch syrup + 2 tbsp cream + ice", "price": 5.49, "available": True, "display_order": 35},
    {"name": "Bake Me Crazy", "category": "Dirty Sodas", "flavor_profile": "Sprite with orange cream swirl", "recipe": "24 oz Sprite + 2 tbsp orange syrup + 2 tbsp cream + ice", "price": 5.49, "available": True, "display_order": 36},
    {"name": "Build Your Own", "category": "Dirty Sodas", "flavor_profile": "Custom soda creation", "recipe": "24 oz soda base + customer choice of 2 syrups + cream + ice", "price": 5.99, "available": True, "display_order": 37},
    {"name": "Crumb and Get It", "category": "Dirty Sodas", "flavor_profile": "Dr Pepper with vanilla cream", "recipe": "24 oz Dr Pepper + 2 tbsp vanilla syrup + 2 tbsp cream + ice", "price": 5.49, "available": True, "display_order": 38},
    {"name": "Midnight Dew", "category": "Dirty Sodas", "flavor_profile": "Mountain Dew with grape twist", "recipe": "24 oz Mountain Dew + 2 tbsp grape syrup + 1 tbsp lime juice + ice", "price": 5.49, "available": True, "display_order": 39},
    {"name": "Lime Light", "category": "Dirty Sodas", "flavor_profile": "Coca-Cola or Pepsi with lime cream", "recipe": "24 oz Coke or Pepsi + 2 tbsp lime syrup + 2 tbsp cream + ice", "price": 5.49, "available": True, "display_order": 40},
    {"name": "Summer Crush", "category": "Dirty Sodas", "flavor_profile": "Mountain Dew with peach and coconut", "recipe": "24 oz Mountain Dew + 2 tbsp peach syrup + 1 tbsp coconut cream + ice", "price": 5.49, "available": True, "display_order": 41},
    {"name": "Electric Storm", "category": "Dirty Sodas", "flavor_profile": "Sprite with blue raspberry", "recipe": "24 oz Sprite + 2 tbsp blue raspberry syrup + 1 tbsp cream + ice", "price": 5.49, "available": True, "display_order": 42},
    {"name": "Soda Water Main Squeeze", "category": "Dirty Sodas", "flavor_profile": "Soda water with lemon cream", "recipe": "24 oz soda water + 2 tbsp lemon syrup + 2 tbsp cream + ice", "price": 5.49, "available": True, "display_order": 43},
    
    # Meal Replacement Shakes
    {"name": "Banana Caramel", "category": "Shakes", "flavor_profile": "Creamy banana with caramel swirl", "recipe": "1 scoop vanilla protein + 1 banana + 2 tbsp caramel syrup + 1 cup milk + ice blend", "price": 7.99, "available": True, "display_order": 44},
    {"name": "Oreo Cheesecake", "category": "Shakes", "flavor_profile": "Rich cookies and cream cheesecake", "recipe": "1 scoop vanilla protein + 4 Oreos + 2 tbsp cream cheese + 1 cup milk + ice blend", "price": 7.99, "available": True, "display_order": 45},
    {"name": "Caramel Peanut Butter", "category": "Shakes", "flavor_profile": "Sweet caramel with nutty peanut butter", "recipe": "1 scoop vanilla protein + 2 tbsp peanut butter + 2 tbsp caramel syrup + 1 cup milk + ice blend", "price": 7.99, "available": True, "display_order": 46},
    {"name": "Buckeye", "category": "Shakes", "flavor_profile": "Ohio's famous chocolate peanut butter combo", "recipe": "1 scoop chocolate protein + 2 tbsp peanut butter + 1 tbsp chocolate syrup + 1 cup milk + ice blend", "price": 7.99, "available": True, "display_order": 47},
    {"name": "Strawberry Cheesecake", "category": "Shakes", "flavor_profile": "Fresh strawberry with creamy cheesecake", "recipe": "1 scoop vanilla protein + ½ cup strawberries + 2 tbsp cream cheese + 1 cup milk + ice blend", "price": 7.99, "available": True, "display_order": 48},
    {"name": "Death by Chocolate", "category": "Shakes", "flavor_profile": "Triple chocolate indulgence", "recipe": "1 scoop chocolate protein + 2 tbsp cocoa powder + 2 tbsp chocolate syrup + 1 cup milk + ice blend", "price": 7.99, "available": True, "display_order": 49},
    {"name": "White Chocolate Reese Cup", "category": "Shakes", "flavor_profile": "White chocolate with peanut butter", "recipe": "1 scoop vanilla protein + 2 tbsp peanut butter + 2 tbsp white chocolate syrup + 1 cup milk + ice blend", "price": 7.99, "available": True, "display_order": 50},
    {"name": "Sea Salt Peanut Butter Delight", "category": "Shakes", "flavor_profile": "Salted peanut butter perfection", "recipe": "1 scoop vanilla protein + 2 tbsp peanut butter + 1 tsp sea salt + 1 tbsp honey + 1 cup milk + ice blend", "price": 7.99, "available": True, "display_order": 51},
    {"name": "Lemon Sugar Cookie", "category": "Shakes", "flavor_profile": "Zesty lemon with sugar cookie taste", "recipe": "1 scoop vanilla protein + 2 tbsp lemon syrup + 1 tbsp vanilla extract + 2 crushed sugar cookies + 1 cup milk + ice blend", "price": 7.99, "available": True, "display_order": 52},
    
    # Coming Soon (for voting)
    {"name": "Matcha Madness", "category": "Milk Teas", "flavor_profile": "Premium matcha latte with milk foam", "recipe": "TBD", "price": 7.49, "available": False, "coming_soon": True, "votes": 0, "display_order": 53},
    {"name": "Lavender Dream", "category": "Fruit Teas", "flavor_profile": "Floral lavender green tea", "recipe": "TBD", "price": 6.99, "available": False, "coming_soon": True, "votes": 0, "display_order": 54},
    {"name": "Ube Purple Magic", "category": "Blended Ice", "flavor_profile": "Filipino purple yam slush", "recipe": "TBD", "price": 7.49, "available": False, "coming_soon": True, "votes": 0, "display_order": 55},
]

async def seed_drinks():
    print("Seeding Fizze drinks...")
    
    # Clear existing
    await db.fizze_drinks.delete_many({})
    
    # Insert all drinks
    for drink_data in FIZZE_DRINKS:
        drink_data['id'] = str(uuid.uuid4())
        drink_data['created_at'] = datetime.now(timezone.utc)
        drink_data['updated_at'] = datetime.now(timezone.utc)
        drink_data.setdefault('votes', 0)
        drink_data.setdefault('coming_soon', False)
        drink_data.setdefault('image_url', None)
        
        await db.fizze_drinks.insert_one(drink_data)
    
    print(f"✅ Seeded {len(FIZZE_DRINKS)} drinks successfully!")
    
    # Print summary
    categories = {}
    for drink in FIZZE_DRINKS:
        cat = drink['category']
        categories[cat] = categories.get(cat, 0) + 1
    
    print("\nDrinks by category:")
    for cat, count in categories.items():
        print(f"  {cat}: {count}")

if __name__ == "__main__":
    asyncio.run(seed_drinks())
    print("\nDone! Fizze menu is ready.")
