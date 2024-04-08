const hasPrefix = (name) => name ? name.split(':').length === 2 : false

const getPrefix = (name) => hasPrefix(name) ? name.split(':')[0] : undefined

export { hasPrefix, getPrefix }
