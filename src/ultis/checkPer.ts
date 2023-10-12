export const checkPer = (dataRole: any[], permission: string) => {
  const checkSuccess = dataRole.map((item) => {
    return item.per.some((ro: any) => {
      return permission === ro.slug
    })
  })
  return checkSuccess.some((item) => item)
}

export const checkAdmin = (dataRole: any[], totalPer: number) => {
  const checkSuccess = dataRole.map((item) => {
    return item.per.length === totalPer
  })
  return checkSuccess.some((item) => item)
}
