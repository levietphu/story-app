export const checkAddView = (slug: string | undefined, callAddView: () => void) => {
  const checkStoryAddView = JSON.parse(sessionStorage.getItem('checkStoryAddView') || '[]')
  if (checkStoryAddView.length === 0) {
    sessionStorage.setItem('checkStoryAddView', JSON.stringify([{ slug: slug, timestamp: Date.now() }]))
    callAddView()
  } else {
    const itemStory = checkStoryAddView.find((item: any) => {
      return item.slug === slug
    })
    if (itemStory) {
      if (Math.floor((Date.now() - itemStory.timestamp) / 1000) >= 60) {
        sessionStorage.setItem(
          'checkStoryAddView',
          JSON.stringify(
            checkStoryAddView.map((item: any) => {
              if (item.slug === slug) {
                return {
                  slug: item.slug,
                  timestamp: Date.now()
                }
              } else {
                return item
              }
            })
          )
        )
        callAddView()
      }
    } else {
      sessionStorage.setItem(
        'checkStoryAddView',
        JSON.stringify([...checkStoryAddView, { slug: slug, timestamp: Date.now() }])
      )
      callAddView()
    }
  }
}
