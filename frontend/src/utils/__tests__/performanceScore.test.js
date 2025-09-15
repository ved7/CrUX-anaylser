import { calculatePerformanceScore } from '../performanceScore';

describe('Performance Score Calculation', () => {
  test('calculates perfect score for excellent metrics', () => {
    const metrics = {
      largest_contentful_paint: { p75: 2000 },
      cumulative_layout_shift: { p75: 0.05 },
      first_contentful_paint: { p75: 1500 },
      interaction_to_next_paint: { p75: 150 }
    };

    const result = calculatePerformanceScore(metrics);
    
    expect(result.score).toBe(100);
    expect(result.grade).toBe('A');
    expect(result.recommendations).toHaveLength(0);
  });

  test('calculates poor score for bad metrics', () => {
    const metrics = {
      largest_contentful_paint: { p75: 5000 },
      cumulative_layout_shift: { p75: 0.3 },
      first_contentful_paint: { p75: 4000 },
      interaction_to_next_paint: { p75: 600 }
    };

    const result = calculatePerformanceScore(metrics);
    
    expect(result.score).toBeLessThan(50);
    expect(result.grade).toBe('F');
    expect(result.recommendations.length).toBeGreaterThan(0);
  });

  test('handles missing metrics gracefully', () => {
    const metrics = {
      largest_contentful_paint: { p75: 2000 }
    };

    const result = calculatePerformanceScore(metrics);
    
    expect(result.score).toBeGreaterThan(0);
    expect(result.breakdown).toHaveProperty('largest_contentful_paint');
  });

  test('handles null metrics', () => {
    const result = calculatePerformanceScore(null);
    
    expect(result.score).toBe(0);
    expect(result.grade).toBe('F');
  });

  test('generates appropriate recommendations', () => {
    const metrics = {
      largest_contentful_paint: { p75: 4500 },
      cumulative_layout_shift: { p75: 0.2 },
      first_contentful_paint: { p75: 2000 },
      interaction_to_next_paint: { p75: 300 }
    };

    const result = calculatePerformanceScore(metrics);
    
    expect(result.recommendations.length).toBeGreaterThan(0);
    expect(result.recommendations[0].priority).toBe('high');
    expect(result.recommendations[0].metric).toBe('largest_contentful_paint');
  });
});