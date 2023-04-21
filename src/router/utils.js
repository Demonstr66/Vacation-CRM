function addModuleName(item, moduleName) {
  if (item.meta) {
    item.meta.module = moduleName
  }
  if (item.children) {
    item.children = item.children.map(child => addModuleName(child, moduleName))
  }
  return item
}

export function getNormalModuleRoutes(items, moduleName) {
  return items.map(item => addModuleName(item))
}