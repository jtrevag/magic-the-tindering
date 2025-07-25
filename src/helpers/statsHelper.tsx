import { Statistics, Card } from "../types/Card";

const COLORS = ["W", "U", "B", "R", "G"]

export const calculateStats = (cards: Card[]): Statistics => {
    const stats: Statistics = { 
        colorPrefs: []
    };
    const totalCardCount = cards.length
    for(const color of COLORS) {
        const cardCountForColor = cards.filter(c => c.colors.includes(color)).length
        const pref = {
            color,
            count: cardCountForColor,
            percentage: cardCountForColor / totalCardCount,
        }
        stats.colorPrefs.push(pref)
    }
    return stats;
}