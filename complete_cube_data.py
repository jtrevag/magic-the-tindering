#!/usr/bin/env python3
"""
Script to complete the peasant cube JSON with all 540 cards.
This uses urllib to fetch data from Scryfall API.
"""

import json
import urllib.request
import urllib.parse
import time
import sys

def get_card_data(card_name):
    """Get card data from Scryfall API using urllib"""
    try:
        # URL encode the card name
        encoded_name = urllib.parse.quote(card_name.strip())
        url = f"https://api.scryfall.com/cards/named?exact={encoded_name}"
        
        # Make the request
        with urllib.request.urlopen(url) as response:
            if response.status == 200:
                data = json.loads(response.read().decode())
                return {
                    "name": card_name.strip(),
                    "scryfallId": data.get("id", ""),
                    "manaCost": data.get("mana_cost", ""),
                    "type": data.get("type_line", ""),
                    "colors": data.get("colors", []),
                    "rarity": data.get("rarity", "")
                }
            else:
                print(f"HTTP {response.status} for {card_name}")
                return None
    except Exception as e:
        print(f"Error fetching {card_name}: {e}")
        return None

def main():
    # Read existing JSON to see what we have
    existing_file = "./src/data/peasantCube.json"
    try:
        with open(existing_file, 'r') as f:
            existing_cards = json.load(f)
        existing_names = {card["name"] for card in existing_cards}
        print(f"Found {len(existing_cards)} existing cards")
    except:
        existing_cards = []
        existing_names = set()
        print("No existing data found, starting fresh")
    
    # Read all mainboard cards
    cube_file = "./documentation/ThePeasantCube2025.txt"
    with open(cube_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # Extract mainboard cards (lines 2-541, but Python is 0-indexed)
    mainboard_cards = [line.strip() for line in lines[1:541] if line.strip()]
    print(f"Total mainboard cards: {len(mainboard_cards)}")
    
    # Find cards that need processing (new cards OR existing cards missing colors)
    cards_to_add = [card for card in mainboard_cards if card not in existing_names]
    cards_to_update = []
    for card in existing_cards:
        if card["name"] in mainboard_cards and "colors" not in card:
            cards_to_update.append(card["name"])
    
    cards_to_process = cards_to_add + cards_to_update
    print(f"New cards to add: {len(cards_to_add)}")
    print(f"Existing cards to update with colors: {len(cards_to_update)}")
    print(f"Total cards to process: {len(cards_to_process)}")
    print(f"Starting with {len(existing_cards)} cards already in database")
    print(f"Target: {len(mainboard_cards)} total cards in cube")
    print("=" * 60)
    
    # Process cards
    all_cards = existing_cards.copy()
    failed_cards = []
    
    for i, card_name in enumerate(cards_to_process):
        progress_percent = ((i + 1) / len(cards_to_process)) * 100
        print(f"[{progress_percent:.1f}%] Processing {i+1}/{len(cards_to_process)}: {card_name}")
        
        card_data = get_card_data(card_name)
        if card_data:
            if card_name in cards_to_update:
                # Update existing card with color data
                for j, existing_card in enumerate(all_cards):
                    if existing_card["name"] == card_name:
                        all_cards[j]["colors"] = card_data["colors"]
                        # Also update other fields that might be missing/outdated
                        all_cards[j]["scryfallId"] = card_data["scryfallId"]
                        all_cards[j]["manaCost"] = card_data["manaCost"]
                        all_cards[j]["type"] = card_data["type"]
                        all_cards[j]["rarity"] = card_data["rarity"]
                        break
                print(f"  ✓ Successfully updated {card_name}")
            else:
                # Add new card
                all_cards.append(card_data)
                print(f"  ✓ Successfully added {card_name}")
        else:
            failed_cards.append(card_name)
            print(f"  ✗ Failed to fetch {card_name}")
        
        # Rate limiting - be respectful to Scryfall
        time.sleep(0.1)
        
        # Save progress every 25 cards
        if (i + 1) % 25 == 0:
            with open(existing_file, 'w') as f:
                json.dump(all_cards, f, indent=2)
            print(f"📝 Progress saved: {len(all_cards)} total cards in database")
            print(f"   Remaining: {len(cards_to_process) - (i + 1)} cards")
        
        # More frequent status updates every 10 cards
        if (i + 1) % 10 == 0:
            success_rate = ((len(all_cards) - len(existing_cards)) / (i + 1)) * 100
            print(f"📊 Status: {len(all_cards)} total cards, {len(failed_cards)} failures, {success_rate:.1f}% success rate")
    
    # Final save
    with open(existing_file, 'w') as f:
        json.dump(all_cards, f, indent=2)
    
    print(f"\nProcessing complete!")
    print(f"Total cards in JSON: {len(all_cards)}")
    print(f"Failed cards: {len(failed_cards)}")
    
    if failed_cards:
        print("\nFailed cards:")
        for card in failed_cards:
            print(f"  - {card}")
        
        # Save failed cards for manual review
        with open("./failed_cards.txt", 'w') as f:
            for card in failed_cards:
                f.write(f"{card}\n")
        print(f"\nFailed cards saved to failed_cards.txt for manual review")

if __name__ == "__main__":
    main()