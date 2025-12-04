// Category definitions with emojis and colors
export const CATEGORIES = {
    Food: { emoji: '🍔', color: '#f59e0b', keywords: ['food', 'lunch', 'dinner', 'breakfast', 'restaurant', 'cafe', 'snack', 'meal'] },
    Travel: { emoji: '🚗', color: '#3b82f6', keywords: ['travel', 'uber', 'taxi', 'bus', 'train', 'flight', 'fuel', 'gas', 'petrol'] },
    Bills: { emoji: '💡', color: '#8b5cf6', keywords: ['bill', 'electricity', 'water', 'internet', 'phone', 'rent', 'utility'] },
    Shopping: { emoji: '🛍️', color: '#ec4899', keywords: ['shopping', 'clothes', 'amazon', 'flipkart', 'store', 'mall'] },
    Entertainment: { emoji: '🎬', color: '#f43f5e', keywords: ['movie', 'entertainment', 'game', 'netflix', 'spotify', 'concert', 'show'] },
    Health: { emoji: '💊', color: '#10b981', keywords: ['health', 'medicine', 'doctor', 'hospital', 'pharmacy', 'gym', 'fitness'] },
    Custom: { emoji: '✏️', color: '#6b7280', keywords: [] }
};

// Auto-detect category from note
export function detectCategory(note) {
    if (!note) return null;

    const lowerNote = note.toLowerCase();

    for (const [category, data] of Object.entries(CATEGORIES)) {
        if (category === 'Custom') continue;

        for (const keyword of data.keywords) {
            if (lowerNote.includes(keyword)) {
                return category;
            }
        }
    }

    return null;
}

// Get category emoji
export function getCategoryEmoji(category) {
    return CATEGORIES[category]?.emoji || '💰';
}

// Get category color
export function getCategoryColor(category) {
    return CATEGORIES[category]?.color || '#6b7280';
}

// Get all category names
export function getAllCategories() {
    return Object.keys(CATEGORIES);
}
