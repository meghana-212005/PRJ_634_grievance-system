

const KEYWORD_MAP = [
  { category: 'Water Supply', keywords: ['water', 'leak', 'pipe', 'tap', 'sewage', 'drainage'] },
  { category: 'Roads', keywords: ['road', 'pothole', 'street', 'traffic', 'footpath', 'bridge'] },
  { category: 'Electricity', keywords: ['electric', 'power', 'light', 'transformer', 'wire', 'streetlight'] },
  { category: 'Sanitation', keywords: ['garbage', 'trash', 'waste', 'sanitation', 'dump', 'clean'] },
];

export function classifyGrievance(title, description) {
  const text = `${title} ${description}`.toLowerCase();
  for (const { category, keywords } of KEYWORD_MAP) {
    if (keywords.some((kw) => text.includes(kw))) {
      return category;
    }
  }
  return 'Other';
}
