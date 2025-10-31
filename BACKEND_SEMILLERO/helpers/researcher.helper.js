import bcryptjs from 'bcryptjs'

// === PASSWORD ===
export const hashPassword = (password) => {
  const salt = bcryptjs.genSaltSync(10)
  return bcryptjs.hashSync(password, salt)
}

export const comparePassword = (password, hashedPassword) =>
  bcryptjs.compareSync(password, hashedPassword)

// === FORMATTERS ===
export const formatName = (str = '') =>
  typeof str === 'string' ? str.toUpperCase().trim() : ''

export const formatEmail = (str = '') =>
  typeof str === 'string' ? str.toLowerCase().trim() : ''

export const formatContractType = (str = '') =>
  typeof str === 'string' ? str.toLowerCase().trim() : ''

export const formatRole = (str = '') =>
  typeof str === 'string' ? str.toUpperCase().trim() : ''

// === ROLES ===
export const determinePrimaryRole = (roles = []) => {
  if (!Array.isArray(roles) || roles.length === 0) return 'INVESTIGADOR'

  if (roles.some(r => r.role === 'SUPER' && r.active)) return 'SUPER'
  if (roles.some(r => r.role === 'ADMIN' && r.active)) return 'ADMIN'
  if (roles.some(r => r.role === 'LIDER' && r.active)) return 'LIDER'

  const activeRole = roles.find(r => r.active)
  return activeRole ? activeRole.role : 'INVESTIGADOR'
}

export const hasActiveRole = (roles = [], roleName = '') =>
  Array.isArray(roles) && roles.some(r => r.role === roleName.toUpperCase() && r.active)

export const createRole = (role, startDate, endDate = null) => ({
  role: (role || '').toUpperCase(),
  start_date: startDate || new Date(),
  end_date: endDate,
  active: true
})

// === LIMPIEZA Y FILTROS ===
export const prepareUpdateData = (updateData = {}) => {
  const cleanedData = { ...updateData }
  Object.keys(cleanedData).forEach(key => {
    if (cleanedData[key] === undefined) delete cleanedData[key]
  })
  return cleanedData
}

export const buildResearcherFilter = (query = {}) => {
  const filter = {}

  if (query.name) filter.name = { $regex: formatName(query.name), $options: 'i' }
  if (query.document_number) filter.document_number = query.document_number
  if (query.email) filter.email = { $regex: formatEmail(query.email), $options: 'i' }
  if (query.status !== undefined) filter.status = query.status
  if (query.contract_type) filter.contract_type = query.contract_type

  return filter
}
