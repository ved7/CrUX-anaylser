export function exportToCSV(data, filename = 'performance-data.csv') {
  if (!data || data.length === 0) return;

  const headers = [
    'URL',
    'LCP (ms)',
    'CLS',
    'FCP (ms)',
    'INP (ms)',
    'LCP 95th (ms)',
    'CLS 95th',
    'FCP 95th (ms)',
    'INP 95th (ms)',
    'LCP Good %',
    'CLS Good %',
    'FCP Good %',
    'INP Good %'
  ];

  const csvContent = [
    headers.join(','),
    ...data.map(item => {
      const metrics = item.processedMetrics || {};
      return [
        `"${item.url || item.originalUrl}"`,
        metrics.largest_contentful_paint?.p75 || 'N/A',
        metrics.cumulative_layout_shift?.p75 || 'N/A',
        metrics.first_contentful_paint?.p75 || 'N/A',
        metrics.interaction_to_next_paint?.p75 || 'N/A',
        metrics.largest_contentful_paint?.p95 || 'N/A',
        metrics.cumulative_layout_shift?.p95 || 'N/A',
        metrics.first_contentful_paint?.p95 || 'N/A',
        metrics.interaction_to_next_paint?.p95 || 'N/A',
        getGoodPercentage(metrics.largest_contentful_paint),
        getGoodPercentage(metrics.cumulative_layout_shift),
        getGoodPercentage(metrics.first_contentful_paint),
        getGoodPercentage(metrics.interaction_to_next_paint)
      ].join(',');
    })
  ].join('\n');

  downloadFile(csvContent, filename, 'text/csv');
}

export function exportToJSON(data, filename = 'performance-data.json') {
  if (!data || data.length === 0) return;

  const exportData = {
    exportDate: new Date().toISOString(),
    dataSource: 'Google Chrome UX Report',
    totalRecords: data.length,
    records: data.map(item => ({
      url: item.url || item.originalUrl,
      originalUrl: item.originalUrl,
      metrics: item.processedMetrics,
      rawData: item.data,
      success: item.success,
      isMockData: item.isMockData
    }))
  };

  downloadFile(JSON.stringify(exportData, null, 2), filename, 'application/json');
}

export function exportToTextReport(data, filename = 'performance-report.txt') {
  if (!data || data.length === 0) return;

  const report = [
    'PERFORMANCE ANALYSIS REPORT',
    '============================',
    `Generated: ${new Date().toLocaleString()}`,
    `Data Source: Google Chrome UX Report`,
    `Total URLs Analyzed: ${data.length}`,
    '',
    'DETAILED RESULTS',
    '================',
    ''
  ];

  data.forEach((item, index) => {
    const metrics = item.processedMetrics || {};
    report.push(`${index + 1}. ${item.url || item.originalUrl}`);
    report.push('   ' + '='.repeat(50));
    
    if (metrics.largest_contentful_paint) {
      report.push(`   LCP: ${metrics.largest_contentful_paint.p75}ms (95th: ${metrics.largest_contentful_paint.p95 || 'N/A'}ms)`);
    }
    if (metrics.cumulative_layout_shift) {
      report.push(`   CLS: ${metrics.cumulative_layout_shift.p75} (95th: ${metrics.cumulative_layout_shift.p95 || 'N/A'})`);
    }
    if (metrics.first_contentful_paint) {
      report.push(`   FCP: ${metrics.first_contentful_paint.p75}ms (95th: ${metrics.first_contentful_paint.p95 || 'N/A'}ms)`);
    }
    if (metrics.interaction_to_next_paint) {
      report.push(`   INP: ${metrics.interaction_to_next_paint.p75}ms (95th: ${metrics.interaction_to_next_paint.p95 || 'N/A'}ms)`);
    }
    
    report.push('');
  });

  report.push('END OF REPORT');

  downloadFile(report.join('\n'), filename, 'text/plain');
}

function getGoodPercentage(metric) {
  if (!metric?.histogram?.[0]?.density) return 'N/A';
  return Math.round(metric.histogram[0].density * 100);
}

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
