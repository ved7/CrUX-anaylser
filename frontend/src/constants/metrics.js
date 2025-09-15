export const METRIC_DEFINITIONS = {
  largest_contentful_paint: {
    name: 'Largest Contentful Paint',
    description: 'Time when the largest content element becomes visible',
    unit: 'ms',
    threshold: { good: 2500, needsImprovement: 4000 },
    weight: 0.4
  },
  cumulative_layout_shift: {
    name: 'Cumulative Layout Shift',
    description: 'Visual stability of the page',
    unit: '',
    threshold: { good: 0.1, needsImprovement: 0.25 },
    weight: 0.3
  },
  first_contentful_paint: {
    name: 'First Contentful Paint',
    description: 'Time when first content becomes visible',
    unit: 'ms',
    threshold: { good: 1800, needsImprovement: 3000 },
    weight: 0.2
  },
  interaction_to_next_paint: {
    name: 'Interaction to Next Paint',
    description: 'Responsiveness to user interactions',
    unit: 'ms',
    threshold: { good: 200, needsImprovement: 500 },
    weight: 0.1
  }
};

export const PERFORMANCE_GRADES = {
  A: { min: 90, color: 'success', label: 'Excellent' },
  B: { min: 80, color: 'success', label: 'Good' },
  C: { min: 70, color: 'warning', label: 'Needs Improvement' },
  D: { min: 60, color: 'warning', label: 'Poor' },
  F: { min: 0, color: 'error', label: 'Failing' }
};

export const RECOMMENDATIONS = {
  largest_contentful_paint: {
    high: 'Optimize images, preload critical resources, and improve server response time.',
    medium: 'Consider optimizing images and reducing server response time.',
    low: 'Good performance, maintain current optimizations.'
  },
  cumulative_layout_shift: {
    high: 'Set explicit dimensions for images and avoid inserting content above existing content.',
    medium: 'Review layout shifts and set explicit dimensions for dynamic content.',
    low: 'Good visual stability, maintain current practices.'
  },
  first_contentful_paint: {
    high: 'Optimize critical rendering path and minimize render-blocking resources.',
    medium: 'Consider reducing render-blocking resources and optimizing CSS.',
    low: 'Good first paint performance, maintain current optimizations.'
  },
  interaction_to_next_paint: {
    high: 'Reduce main thread blocking time and optimize JavaScript execution.',
    medium: 'Consider code splitting and optimizing JavaScript performance.',
    low: 'Good interaction responsiveness, maintain current optimizations.'
  }
};
