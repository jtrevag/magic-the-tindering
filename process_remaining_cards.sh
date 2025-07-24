#!/bin/bash

# Script to process remaining peasant cube cards
# This script uses curl to fetch Scryfall data for each card

INPUT_FILE="/Users/jamesgale/codebase/magic-the-tindering/THePeasantCube2025.txt"
OUTPUT_FILE="/Users/jamesgale/codebase/magic-the-tindering/mtg-tinder-draft/src/data/peasantCube.json"

# Extract mainboard cards (lines 2-541)
sed -n '2,541p' "$INPUT_FILE" > /tmp/all_cards.txt

# Function to get card data from Scryfall
get_card_data() {
    local card_name="$1"
    local encoded_name=$(echo "$card_name" | sed 's/ /%20/g' | sed 's/,/%2C/g' | sed 's/\//%2F/g')
    local url="https://api.scryfall.com/cards/named?exact=$encoded_name"
    
    local response=$(curl -s "$url")
    
    if echo "$response" | grep -q '"object":"error"'; then
        echo "ERROR: $card_name"
        return 1
    fi
    
    local id=$(echo "$response" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
    local mana_cost=$(echo "$response" | grep -o '"mana_cost":"[^"]*"' | head -1 | cut -d'"' -f4)
    local type_line=$(echo "$response" | grep -o '"type_line":"[^"]*"' | head -1 | cut -d'"' -f4)
    local rarity=$(echo "$response" | grep -o '"rarity":"[^"]*"' | head -1 | cut -d'"' -f4)
    
    echo "  {"
    echo "    \"name\": \"$card_name\","
    echo "    \"scryfallId\": \"$id\","
    echo "    \"manaCost\": \"$mana_cost\","
    echo "    \"type\": \"$type_line\","
    echo "    \"rarity\": \"$rarity\""
    echo "  }"
}

echo "Processing peasant cube cards..."
echo "This will take approximately 5-10 minutes due to API rate limiting."

# Start the JSON array
echo "[" > /tmp/cards_output.json

first=true
while IFS= read -r card_name; do
    if [ ! -z "$card_name" ]; then
        if [ "$first" = false ]; then
            echo "," >> /tmp/cards_output.json
        fi
        
        echo "Processing: $card_name"
        get_card_data "$card_name" >> /tmp/cards_output.json
        first=false
        
        # Small delay to respect API rate limits
        sleep 0.1
    fi
done < /tmp/all_cards.txt

# Close the JSON array
echo "]" >> /tmp/cards_output.json

echo "Processing complete. Moving to final location..."
mv /tmp/cards_output.json "$OUTPUT_FILE"

echo "Peasant cube JSON created at: $OUTPUT_FILE"