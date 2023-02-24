const reportWebVitals = (onPerfEntry, { analyticsId }) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
      onCLS((metric) => onPerfEntry({ metric, analyticsId }))
      onFID((metric) => onPerfEntry({ metric, analyticsId }))
      onFCP((metric) => onPerfEntry({ metric, analyticsId }))
      onLCP((metric) => onPerfEntry({ metric, analyticsId }))
      onTTFB((metric) => onPerfEntry({ metric, analyticsId }))
    })
  }
}

export default reportWebVitals
